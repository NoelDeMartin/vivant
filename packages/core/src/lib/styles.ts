import type { AnimatableElement } from '@vivantjs/core/animation';

const pixelProperties = ['width', 'height', 'top', 'left', 'bottom', 'right', 'opacity'] as const;

export type ElementStyles = Omit<Partial<CSSStyleDeclaration>, (typeof pixelProperties)[number]> & {
    [K in (typeof pixelProperties)[number]]?: number | CSSStyleDeclaration[K];
};

export function setElementStyles(element: AnimatableElement, styles: ElementStyles): void {
    for (const property in styles) {
        if (!pixelProperties.includes(property) || typeof styles[property] !== 'number') {
            continue;
        }

        styles[property] = `${styles[property]}px`;
    }

    Object.assign(element.style, styles);
}

export function resetElementStyles(element: AnimatableElement): void {
    element.removeAttribute('style');
}
