export {
    setElementStyles,
    resetElementStyles,
    isAnimatableElement,
    getPreviousSnapshot,
    getSnapshot,
    hasSnapshots,
    playAnimation,
    snapshotChanged,
    waitAnimations,
} from '@vivantjs/core';
export type { AnimatableElement, AnimationConfig, Animation } from '@vivantjs/core';

export * from './components';
export * from './lib';
export * from './motion';
export * from './plugin';

import vivant from './plugin';

export { vivant };
export default vivant;
