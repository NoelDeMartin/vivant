import { required } from '@noeldemartin/utils';

import { resetElementStyles, setElementStyles } from '@vivantjs/core/lib/styles';
import type { AnimatableElement } from '@vivantjs/core/animation';
import type { Snapshot } from '@vivantjs/core/layout-animations/snapshots';

interface TransformationDefinition {
    firstBounds: DOMRect;
    lastBounds: DOMRect;
    translateX: number;
    translateY: number;
    scaleX: number;
    scaleY: number;
    borderRadiusStartX: number;
    borderRadiusStartY: number;
    borderRadiusDeltaX: number;
    borderRadiusDeltaY: number;
    relativeCenterX?: number;
    relativeCenterY?: number;
}

interface TransformationSnapshot {
    x: number;
    y: number;
    width: number;
    height: number;
    scaleX: number;
    scaleY: number;
}

export interface LayoutAnimationConfig {
    first: Snapshot;
    last: Snapshot;
    inverse?: boolean;
    children?: LayoutAnimation[];
    duration?: number;
    delay?: number;
    onUpdate?(progress: number): void;
}

export default abstract class LayoutAnimation {

    public readonly $element: AnimatableElement;
    public readonly config: LayoutAnimationConfig;
    protected transformation?: TransformationDefinition;

    constructor($element: AnimatableElement, config: LayoutAnimationConfig) {
        this.$element = $element;
        this.config = {
            inverse: true,
            ...config,
        };
    }

    public async play(): Promise<void> {
        this.prepareElement();
        this.calculateTransformations();
        this.calculateRelativeCenters();

        await this.animate();

        this.config.inverse && this.resetStyles();
    }

    protected abstract animate(): Promise<void>;

    protected prepareElement(): void {
        if (getComputedStyle(this.$element).display === 'inline') {
            setElementStyles(this.$element, { display: 'inline-block' });
        }

        this.config.children?.forEach((child) => child.prepareElement());
    }

    protected calculateTransformations(): void {
        const firstSnapshot = this.config.first;
        const lastSnapshot = this.config.last;
        const translateX =
            -lastSnapshot.bounds.x -
            lastSnapshot.bounds.width / 2 +
            (firstSnapshot.bounds.x + firstSnapshot.bounds.width / 2);
        const translateY =
            -lastSnapshot.bounds.y -
            lastSnapshot.bounds.height / 2 +
            (firstSnapshot.bounds.y + firstSnapshot.bounds.height / 2);
        const borderRadiusStartX = lastSnapshot.styles.borderRadiusX;
        const borderRadiusStartY = lastSnapshot.styles.borderRadiusY;
        const borderRadiusDeltaX = firstSnapshot.styles.borderRadiusX - lastSnapshot.styles.borderRadiusX;
        const borderRadiusDeltaY = firstSnapshot.styles.borderRadiusY - lastSnapshot.styles.borderRadiusY;

        this.transformation = {
            firstBounds: firstSnapshot.bounds,
            lastBounds: lastSnapshot.bounds,
            ...(this.config.inverse
                ? {
                    translateX,
                    translateY,
                    borderRadiusStartX,
                    borderRadiusStartY,
                    borderRadiusDeltaX,
                    borderRadiusDeltaY,
                    scaleX: firstSnapshot.bounds.width / lastSnapshot.bounds.width - 1,
                    scaleY: firstSnapshot.bounds.height / lastSnapshot.bounds.height - 1,
                }
                : {
                    translateX: -translateX,
                    translateY: -translateY,
                    borderRadiusStartX: borderRadiusStartX + borderRadiusDeltaX,
                    borderRadiusStartY: borderRadiusStartY + borderRadiusDeltaY,
                    borderRadiusDeltaX: -borderRadiusDeltaX,
                    borderRadiusDeltaY: -borderRadiusDeltaY,
                    scaleX: lastSnapshot.bounds.width / firstSnapshot.bounds.width - 1,
                    scaleY: lastSnapshot.bounds.height / firstSnapshot.bounds.height - 1,
                }),
        };

        this.config.children?.forEach((child) => child.calculateTransformations());
    }

    protected calculateRelativeCenters(parent?: LayoutAnimation): void {
        if (!this.transformation) {
            return;
        }

        if (parent) {
            const bounds = this.config.inverse ? this.transformation.lastBounds : this.transformation.firstBounds;
            const parentBounds = required(
                this.config.inverse ? parent.transformation?.lastBounds : parent.transformation?.firstBounds,
            );

            this.transformation.relativeCenterX = (bounds.x - parentBounds.x + bounds.width / 2) / parentBounds.width;
            this.transformation.relativeCenterY = (bounds.y - parentBounds.y + bounds.height / 2) / parentBounds.height;
        }

        this.config.children?.forEach((child) => child.calculateRelativeCenters(this));
    }

    protected resetStyles(): void {
        resetElementStyles(this.$element);

        this.config.children?.forEach((child) => child.resetStyles());
    }

    protected onUpdate(progress: number): void {
        this.config.onUpdate?.(progress);

        this.updateElementStyles(this.config.inverse ? 1 - progress : progress);
    }

    protected updateElementStyles(progress: number, parentStyles?: TransformationSnapshot): void {
        const transformation = required(this.transformation);
        const translateX = progress * transformation.translateX;
        const translateY = progress * transformation.translateY;
        const scaleX = 1 + progress * transformation.scaleX;
        const scaleY = 1 + progress * transformation.scaleY;
        const bounds = this.config.inverse ? transformation.lastBounds : transformation.firstBounds;

        // Apply transforms.
        const transformStyles = [
            `translateX(${translateX}px)`,
            `translateY(${translateY}px)`,
            `scaleX(${scaleX})`,
            `scaleY(${scaleY})`,
        ];

        // Correct parent distortion.
        if (parentStyles) {
            transformStyles.unshift(
                `translateX(${
                    bounds.x -
                    (parentStyles.x + parentStyles.width * required(transformation.relativeCenterX) - bounds.width / 2)
                }px)`,
            );
            transformStyles.unshift(
                `translateY(${
                    bounds.y -
                    (parentStyles.y +
                        parentStyles.height * required(transformation.relativeCenterY) -
                        bounds.height / 2)
                }px)`,
            );
            transformStyles.unshift(`scaleX(${1 / parentStyles.scaleX})`);
            transformStyles.unshift(`scaleY(${1 / parentStyles.scaleY})`);
        }

        setElementStyles(this.$element, {
            transform: transformStyles.join(' '),
            borderRadius: [
                `${(transformation.borderRadiusStartX + progress * transformation.borderRadiusDeltaX) / scaleX}px`,
                `${(transformation.borderRadiusStartY + progress * transformation.borderRadiusDeltaY) / scaleY}px`,
            ].join(' / '),
        });

        // Update children.
        const frameStyles: TransformationSnapshot = {
            x: bounds.x + translateX - (bounds.width * scaleX - bounds.width) / 2,
            y: bounds.y + translateY - (bounds.height * scaleY - bounds.height) / 2,
            width: bounds.width * scaleX,
            height: bounds.height * scaleY,
            scaleX: scaleX,
            scaleY: scaleY,
        };

        this.config.children?.forEach((child) => child.updateElementStyles(progress, frameStyles));
    }

}
