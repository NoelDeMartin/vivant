import { recordSnapshot } from '@vivantjs/core';
import { nextTick } from 'vue';
import { PromisedValue, arrayUnique, isEmpty, tap } from '@noeldemartin/utils';
import type { AnimatableElement } from '@vivantjs/core';

import { layoutUpdated } from 'vivant/layout-animations';

let tick: Promise<unknown> | undefined;
const elementTransitions: Map<AnimatableElement, Transition> = new Map();
const elementsConfig: WeakMap<AnimatableElement, TransitionConfig> = new WeakMap();

function playTransitionHooks(transitionEntries: [AnimatableElement, Transition][]) {
    // Update layout snapshots.
    const layoutGroups = arrayUnique(transitionEntries.map(([element]) => element.getAttribute('layout-group')));

    for (const layoutGroup of layoutGroups) {
        layoutUpdated(layoutGroup ?? undefined);
    }

    // Update from and to classes.
    // We need to do this manually because Vue's implementation takes two frames to update, and this causes
    // a flicker in the UI when the implementation relies on JavaScript updates rather than CSS transitions.
    // See https://github.com/vuejs/core/blob/v3.4.0/packages/runtime-dom/src/components/Transition.ts#L316..L320
    for (const [element, { fromClass, toClass }] of transitionEntries) {
        fromClass?.split(' ').forEach((className) => className && element.classList.remove(className));
        toClass?.split(' ').forEach((className) => className && element.classList.add(className));
    }

    // Update snapshots.
    for (const [element] of transitionEntries) {
        recordSnapshot(element);
    }

    for (const layoutGroup of layoutGroups) {
        layoutUpdated(layoutGroup ?? undefined);
    }

    // Play hooks.
    Promise.all(
        transitionEntries.map(([element, { hook }]) => {
            const completed = new PromisedValue<void>();
            const result = hook ? hook(element, () => completed.resolve()) : Promise.resolve();

            return result instanceof Promise ? result : completed;
        }),
    ).then(() => {
        transitionEntries.forEach(([_, { completed }]) => completed.resolve());
    });
}

function processTransitionHooks() {
    const transitionEntries = Array.from(elementTransitions.entries());

    for (const [element] of transitionEntries) {
        recordSnapshot(element);
    }

    playTransitionHooks(transitionEntries);

    tick = undefined;
    elementTransitions.clear();
}

export type TransitionHook = (element: AnimatableElement, done: Function) => void | Promise<void>;

export interface Transition {
    completed: PromisedValue<void>;
    hook?: TransitionHook;
    fromClass?: string;
    toClass?: string;
}

export interface TransitionConfig {
    ignoreInitial: boolean;
}

export function setTransitionConfig(element: AnimatableElement, config: TransitionConfig): void {
    elementsConfig.set(element, config);
}

export function getTransitionConfig(element: AnimatableElement): TransitionConfig | undefined {
    return elementsConfig.get(element);
}

export async function playTransitionHook(
    element: AnimatableElement,
    transition: Omit<Transition, 'completed'>,
): Promise<void> {
    if (!transition.hook && isEmpty(transition.fromClass) && isEmpty(transition.toClass)) {
        return;
    }

    return tap(new PromisedValue<void>(), (completed) => {
        elementTransitions.set(element, { ...transition, completed });

        // Play the transitions in the next frame, when all components will be updated.
        tick = tick ?? nextTick(() => processTransitionHooks());
    });
}
