import { MorphAnimation } from '@vivantjs/core';
import type { AnimatableElement, LayoutAnimation, LayoutAnimationConfig } from '@vivantjs/core';

import VueLayoutAnimation from 'vivant/layout-animations/VueLayoutAnimation';

export default class VueMorphAnimation extends MorphAnimation {

    protected override buildLayoutAnimation(
        $element: AnimatableElement,
        config: LayoutAnimationConfig,
    ): LayoutAnimation {
        return new VueLayoutAnimation($element, config);
    }

}
