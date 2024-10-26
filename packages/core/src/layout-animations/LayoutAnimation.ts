import { objectWithoutEmpty, required } from '@noeldemartin/utils';

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

interface FrameSnapshot {
    bounds: DOMRect;
    x: number;
    y: number;
    width: number;
    height: number;
    translateX: number;
    translateY: number;
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

    protected updateElementStyles(progress: number, parentFrameSnapshot?: FrameSnapshot): void {
        const transformation = required(this.transformation);
        const translateX = progress * transformation.translateX;
        const translateY = progress * transformation.translateY;
        const scaleX = 1 + progress * transformation.scaleX;
        const scaleY = 1 + progress * transformation.scaleY;
        const bounds = this.config.inverse ? transformation.lastBounds : transformation.firstBounds;
        const frameSnapshot: FrameSnapshot = {
            x: bounds.x + translateX - (bounds.width * scaleX - bounds.width) / 2,
            y: bounds.y + translateY - (bounds.height * scaleY - bounds.height) / 2,
            width: bounds.width * scaleX,
            height: bounds.height * scaleY,
            bounds,
            translateX,
            translateY,
            scaleX,
            scaleY,
        };

        // Update element.
        setElementStyles(
            this.$element,
            objectWithoutEmpty({
                transform: this.getUpdatedTransform(frameSnapshot, parentFrameSnapshot),
                borderRadius: this.getUpdatedBorderRadius(progress, frameSnapshot),
            }),
        );

        // Update children.
        this.config.children?.forEach((child) => child.updateElementStyles(progress, frameSnapshot));
    }

    protected getUpdatedTransform(
        frameSnapshot: FrameSnapshot,
        parentFrameSnapshot?: FrameSnapshot,
    ): string | undefined {
        const transformation = required(this.transformation);

        // Element transforms.
        let translateX = frameSnapshot.translateX;
        let translateY = frameSnapshot.translateY;
        let scaleX = frameSnapshot.scaleX;
        let scaleY = frameSnapshot.scaleY;

        // Correct parent distortion.
        if (parentFrameSnapshot) {
            const scaleCorrectionX = 1 / parentFrameSnapshot.scaleX;
            const scaleCorrectionY = 1 / parentFrameSnapshot.scaleY;
            const translateCorrectionX =
                frameSnapshot.bounds.x -
                (parentFrameSnapshot.x +
                    parentFrameSnapshot.width * required(transformation.relativeCenterX) -
                    frameSnapshot.bounds.width / 2);
            const translateCorrectionY =
                frameSnapshot.bounds.y -
                (parentFrameSnapshot.y +
                    parentFrameSnapshot.height * required(transformation.relativeCenterY) -
                    frameSnapshot.bounds.height / 2);

            scaleX *= scaleCorrectionX;
            scaleY *= scaleCorrectionY;
            translateX = (translateX + translateCorrectionX) / scaleCorrectionX;
            translateY = (translateY + translateCorrectionY) / scaleCorrectionY;
        }

        scaleX = Math.round(scaleX * 100000) / 100000;
        scaleY = Math.round(scaleY * 100000) / 100000;
        translateX = Math.round(translateX * 100) / 100;
        translateY = Math.round(translateY * 100) / 100;

        if (scaleX === 1 && scaleY === 1 && translateX === 0 && translateY === 0) {
            return;
        }

        return `scale(${scaleX}, ${scaleY}) translate(${translateX}px, ${translateY}px)`;
    }

    protected getUpdatedBorderRadius(progress: number, frameSnapshot: FrameSnapshot): string {
        const transformation = required(this.transformation);
        const horizontalRadius =
            (transformation.borderRadiusStartX + progress * transformation.borderRadiusDeltaX) / frameSnapshot.scaleX;
        const verticalRadius =
            (transformation.borderRadiusStartY + progress * transformation.borderRadiusDeltaY) / frameSnapshot.scaleY;

        return `${horizontalRadius}px / ${verticalRadius}px`;
    }

}
