import { ref } from 'vue';
import { animateStyles } from 'vivant';
import type { AnimatableElement, Animation, AnimationConfig } from 'vivant';

async function horizontalSlide(element: AnimatableElement, action: 'in' | 'out', config: AnimationConfig) {
    const enter = action === 'in';
    const forward = animationsDirection.value === 'forward';
    const animationConfig = { type: 'spring' as const, ...config };

    if (enter) {
        await animateStyles(
            element,
            { x: 0 },
            {
                initial: { x: forward ? window.innerWidth : -window.innerWidth },
                ...animationConfig,
            },
        );

        return;
    }

    await animateStyles(element, { x: forward ? -window.innerWidth : window.innerWidth }, animationConfig);
}

async function verticalSlide(element: AnimatableElement, action: 'in' | 'out', config: AnimationConfig) {
    const enter = action === 'in';
    const forward = animationsDirection.value === 'forward';

    if (enter) {
        await animateStyles(
            element,
            { opacity: 1, y: 0 },
            {
                initial: { opacity: 0, y: forward ? element.clientHeight : -element.clientHeight },
                ...config,
            },
        );

        return;
    }

    await animateStyles(element, { opacity: 0, y: forward ? -element.clientHeight : element.clientHeight }, config);
}

const animations: Record<string, Animation> = {
    horizontalSlideIn: (element, config) => horizontalSlide(element, 'in', config),
    horizontalSlideOut: (element, config) => horizontalSlide(element, 'out', config),
    verticalSlideIn: (element, config) => verticalSlide(element, 'in', config),
    verticalSlideOut: (element, config) => verticalSlide(element, 'out', config),
};

export const animationsDirection = ref<'forward' | 'backwards'>('forward');

export default animations;
