import { LayoutAnimation } from '@vivantjs/core';
import type { Transition } from '@vueuse/motion';

import animateStyles from 'vivant/lib/animate-styles';

export default class VueLayoutAnimation extends LayoutAnimation {

    protected async animate(): Promise<void> {
        await animateStyles(this.$element, (progress) => this.onUpdate(progress), {
            transition: {
                ...(this.config.transition ?? { type: 'tween' }),
                duration:
                    this.config.duration ??
                    (this.config.transition && 'duration' in this.config.transition
                        ? this.config.transition.duration
                        : undefined),
                delay: this.config.delay ?? this.config.transition?.delay,
            },
        });
    }

}

declare module '@vivantjs/core' {
    export interface LayoutAnimationConfig {
        transition?: Transition;
    }
}
