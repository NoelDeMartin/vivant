import { isInstanceOf } from '@noeldemartin/utils';

export type AnimatableElement = HTMLElement | SVGElement;

export function isAnimatableElement(element: unknown): element is AnimatableElement {
    return isInstanceOf(element, HTMLElement) || isInstanceOf(element, SVGElement);
}
