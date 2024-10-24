import type { MotionInstance } from './motions';

export * from './motions';

declare global {
    interface HTMLElement {
        motionInstance?: MotionInstance;
    }

    interface SVGElement {
        motionInstance?: MotionInstance;
    }
}
