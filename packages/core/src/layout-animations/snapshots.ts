import { clamp, required, tap } from '@noeldemartin/utils';
import type { AnimatableElement } from '@vivantjs/core/animation/AnimatableElement';

const snapshots: WeakMap<
    AnimatableElement,
    {
        current: Snapshot;
        previous?: Snapshot;
    }
> = new WeakMap();

function measureComputedStyles(element: AnimatableElement, rect: DOMRect): ComputedStyles {
    const styles = getComputedStyle(element);

    if (styles.borderRadius.includes('/')) {
        const [x, y] = styles.borderRadius.split('/');

        return {
            borderRadiusX: parseBorderPixels(required(x), rect.width),
            borderRadiusY: parseBorderPixels(required(y), rect.height),
        };
    }

    return {
        borderRadiusX: parseBorderPixels(styles.borderRadius, rect.width),
        borderRadiusY: parseBorderPixels(styles.borderRadius, rect.height),
    };
}

function parseBorderPixels(value: string, base: number): number {
    const border = value.includes('%') ? base * parseFloat(value) : parseFloat(value);

    return clamp(border, 0, base * 0.5);
}

export interface ComputedStyles {
    borderRadiusX: number;
    borderRadiusY: number;
}

export interface Snapshot {
    bounds: DOMRect;
    styles: ComputedStyles;
}

export function snapshotChanged(a: Snapshot, b: Snapshot): boolean {
    return (
        a.bounds.height !== b.bounds.height ||
        a.bounds.width !== b.bounds.width ||
        a.bounds.x !== b.bounds.x ||
        a.bounds.y !== b.bounds.y ||
        a.styles.borderRadiusX !== b.styles.borderRadiusX ||
        a.styles.borderRadiusY !== b.styles.borderRadiusY
    );
}

export function hasSnapshots(element: AnimatableElement): boolean {
    const elementSnapshots = snapshots.get(element);

    return !!elementSnapshots && !!elementSnapshots.previous;
}

export function getSnapshot(element: AnimatableElement): Snapshot | undefined {
    return snapshots.get(element)?.current;
}

export function getPreviousSnapshot(element: AnimatableElement): Snapshot | undefined {
    return snapshots.get(element)?.previous;
}

export function recordSnapshot(element: AnimatableElement): Snapshot {
    const bounds = element.getBoundingClientRect();
    const styles = measureComputedStyles(element, bounds);

    return tap({ bounds, styles }, (snapshot) => {
        snapshots.set(element, {
            current: snapshot,
            previous: snapshots.get(element)?.current,
        });
    });
}
