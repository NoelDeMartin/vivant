import {
    getPreviousSnapshot,
    getSnapshot,
    hasSnapshots,
    isAnimatableElement,
    recordSnapshot,
    snapshotChanged,
} from '@vivantjs/core';
import { nextTick } from 'vue';
import { PromisedValue, arrayRemove, objectWithoutEmpty, required } from '@noeldemartin/utils';
import type { AnimatableElement, LayoutAnimationConfig, MorphAnimationConfig } from '@vivantjs/core';
import type { VNode } from 'vue';

import VueMorphAnimation from 'vivant/layout-animations/VueMorphAnimation';
import VueLayoutAnimation from 'vivant/layout-animations/VueLayoutAnimation';
import { getConfig } from 'vivant/config';
import { getNodeProps } from 'vivant/lib/utils';

const elements: Set<AnimatableElement> = new Set();
const elementsById: Record<string, AnimatableElement[]> = {};
const nodes: WeakMap<AnimatableElement, VNode> = new WeakMap();
const leavePromises: WeakMap<AnimatableElement, PromisedValue<void>> = new WeakMap();

function getMorphConfig(element: AnimatableElement): MorphAnimationConfig {
    const node = nodes.get(element);
    const contextConfig = getConfig(element);
    const props = node ? getNodeProps(node) : {};

    return objectWithoutEmpty({
        duration: props?.['duration'] ?? contextConfig?.duration,
        delay: props?.['delay'],
        transition: props?.['transition'],
    });
}

function getLayoutAnimationConfig(element: AnimatableElement): Omit<LayoutAnimationConfig, 'first' | 'last'> {
    const contextConfig = getConfig(element);
    const node = nodes.get(element);
    const props = node ? getNodeProps(node) : {};

    return objectWithoutEmpty({
        duration: props?.['duration'] ?? contextConfig?.duration,
        delay: props?.['delay'],
        transition: props?.['transition'],
    });
}

export function layoutUpdated(group?: string): void {
    for (const element of elements) {
        layoutAnimatedElementUpdated(element, group);
    }
}

export function layoutAnimatedElementEnter(element: AnimatableElement, node: VNode): void {
    nodes.set(element, node);
    elements.add(element);

    layoutAnimatedElementUpdated(element);

    element.hasAttribute('layout-id') && morphElementEnter(element);
}

export function layoutAnimatedElementLeave(element: AnimatableElement): void {
    elements.delete(element);

    element.hasAttribute('layout-id') && morphElementLeave(element);
}

export function layoutAnimatedElementUpdated(element: AnimatableElement, group?: string): void {
    group;

    // if (group && element.getAttribute('layout-group') !== group) {
    //     return;
    // }

    // if (!group && element.hasAttribute('layout-group')) {
    //     return;
    // }

    const animatableChildren = Array.from(element.children).filter((child) => isAnimatableElement(child));
    const previousSnapshot = getSnapshot(element);
    const currentSnapshot = recordSnapshot(element);

    animatableChildren.forEach((child) => recordSnapshot(child));

    if (!previousSnapshot || !snapshotChanged(previousSnapshot, currentSnapshot)) {
        return;
    }

    const config = getLayoutAnimationConfig(element);
    const animation = new VueLayoutAnimation(element, {
        first: previousSnapshot,
        last: currentSnapshot,
        children: animatableChildren
            .filter((child) => hasSnapshots(child))
            .map(
                (child) =>
                    new VueLayoutAnimation(child, {
                        first: required(getPreviousSnapshot(child)),
                        last: required(getSnapshot(child)),
                    }),
            ),
        ...config,
    });

    animation.play();
}

export async function morphElementEnter(element: AnimatableElement): Promise<void> {
    if (element.parentElement?.closest('[layout-id]')) {
        // Finish early for nested elements, the parent should be the one who controls the animation.
        return;
    }

    const id = required(element.getAttribute('layout-id'));
    const idElements = (elementsById[id] ??= []);
    const previousElement = idElements[0];

    idElements.push(element);
    leavePromises.set(element, new PromisedValue());

    if (previousElement) {
        await new VueMorphAnimation(previousElement, element, getMorphConfig(element)).animate();
    }
}

export function morphElementLeave(element: AnimatableElement): void {
    const id = required(element.getAttribute('layout-id'));
    const afterLeave = () => {
        leavePromises.get(element)?.resolve();
        leavePromises.delete(element);
    };

    Array.from(element.querySelectorAll('[layout-id]'))
        .concat(element)
        .forEach((child) => isAnimatableElement(child) && recordSnapshot(child));

    nextTick(async () => {
        const previousElement = elementsById[id]?.[0];

        elementsById[id] && arrayRemove(elementsById[id], element);

        if (!previousElement) {
            delete elementsById[id];

            afterLeave();

            return;
        }

        await new VueMorphAnimation(element, previousElement, {
            ...getMorphConfig(previousElement),
            revert: true,
        }).animate();

        afterLeave();
    });
}

export async function waitMorphElementLeave(element: AnimatableElement): Promise<void> {
    let morphElement = element.querySelector('[layout-id]');

    while (morphElement?.parentElement?.closest('[layout-id]')) {
        morphElement = morphElement.parentElement.closest('[layout-id]');
    }

    if (!isAnimatableElement(morphElement)) {
        return;
    }

    await leavePromises.get(morphElement);
}
