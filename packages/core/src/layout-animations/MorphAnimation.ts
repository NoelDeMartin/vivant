import { objectWithoutEmpty, required } from '@noeldemartin/utils';

import { isAnimatableElement } from '@vivantjs/core/animation/AnimatableElement';
import { setElementStyles } from '@vivantjs/core/lib/styles';
import type { AnimatableElement } from '@vivantjs/core/animation/AnimatableElement';
import type { Brand } from '@vivantjs/core/lib/types';

import { getSnapshot, recordSnapshot } from './snapshots';
import type LayoutAnimation from './LayoutAnimation';
import type { LayoutAnimationConfig } from './LayoutAnimation';

type PreviousElement = Brand<AnimatableElement, 'previous'>;
type CurrentElement = Brand<AnimatableElement, 'current'>;

interface LayoutAnimations {
    previous?: LayoutAnimation;
    current: LayoutAnimation;
}

interface LayoutAnimationsChildren {
    previous: LayoutAnimation[];
    current: LayoutAnimation[];
}

export interface MorphAnimationConfig {
    duration?: number;
    delay?: number;
    revert?: boolean;
}

export default abstract class MorphAnimation {

    protected $previous: PreviousElement;
    protected $current: CurrentElement;
    protected config: MorphAnimationConfig;

    constructor($previous: AnimatableElement, $current: AnimatableElement, config: MorphAnimationConfig = {}) {
        this.$previous = $previous as PreviousElement;
        this.$current = $current as CurrentElement;
        this.config = config;
    }

    public async animate(): Promise<void> {
        const animations = this.prepareLayoutAnimations(this.$previous, this.$current);

        await Promise.all([animations.previous?.play(), animations.current.play()]);

        this.cleanupLayoutAnimation(animations.current);

        animations.previous && this.cleanupLayoutAnimation(animations.previous);
    }

    protected abstract buildLayoutAnimation(
        $element: AnimatableElement,
        config: LayoutAnimationConfig
    ): LayoutAnimation;

    protected prepareLayoutAnimations($previous: PreviousElement, $current: CurrentElement): LayoutAnimations {
        if (this.config.revert) {
            $current.removeAttribute('style');
        }

        const children = this.prepareLayoutAnimationChildren($previous, $current);
        const first = required($previous.isConnected ? recordSnapshot($previous) : getSnapshot($previous));
        const last = recordSnapshot($current);
        const animations: LayoutAnimations = {
            current: this.buildLayoutAnimation(
                $current,
                objectWithoutEmpty({
                    first,
                    last,
                    inverse: true,
                    children: children.current,
                    duration: this.config.duration,
                    delay: this.config.delay,
                    onUpdate:
                        $current === this.$current && !this.config.revert && this.$previous.isConnected
                            ? (progress: number) => setElementStyles(this.$current, { opacity: progress })
                            : null,
                }),
            ),
        };

        $current.dataset.morphing = 'true';

        if ($previous.isConnected) {
            animations.previous = this.buildLayoutAnimation(
                $previous,
                objectWithoutEmpty({
                    first,
                    last,
                    inverse: false,
                    children: children.previous,
                    duration: this.config.duration,
                    delay: this.config.delay,
                    onUpdate:
                        $previous === this.$previous && this.config.revert
                            ? (progress: number) => setElementStyles(this.$current, { opacity: 1 - progress })
                            : null,
                }),
            );

            $previous.dataset.morphing = 'true';
        }

        return animations;
    }

    protected prepareLayoutAnimationChildren(
        $previous: PreviousElement,
        $current: CurrentElement,
    ): LayoutAnimationsChildren {
        const animations: LayoutAnimationsChildren = { previous: [], current: [] };

        $current.querySelectorAll('[layout-id]').forEach(($currentChild) => {
            if (
                !isAnimatableElement($currentChild) ||
                $currentChild.parentElement?.closest('[layout-id]') !== $current
            ) {
                // Skip grandchildren, they will be handled recursively.
                return;
            }

            const $previousChild = $previous.querySelector(`[layout-id="${$currentChild.getAttribute('layout-id')}"]`);

            if (!isAnimatableElement($previousChild)) {
                return;
            }

            const childAnimations = this.prepareLayoutAnimations(
                $previousChild as PreviousElement,
                $currentChild as CurrentElement,
            );

            animations.current.push(childAnimations.current);

            childAnimations.previous && animations.previous.push(childAnimations.previous);
        });

        return animations;
    }

    protected cleanupLayoutAnimation(animation: LayoutAnimation): void {
        delete animation.$element.dataset.morphing;

        animation.config.children?.forEach((child) => this.cleanupLayoutAnimation(child));
    }

}
