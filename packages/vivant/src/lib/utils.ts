import { noop } from '@noeldemartin/utils';
import type { GetClosureArgs } from '@noeldemartin/utils';
import type { Directive, DirectiveHook, ObjectDirective, VNode } from 'vue';

type DirectiveHookName = Exclude<
    {
        [K in keyof ObjectDirective]: DirectiveHook extends ObjectDirective[K] ? K : never;
    }[keyof ObjectDirective],
    undefined
>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getNodeProps(node: VNode): any {
    return node.props
        ? node.props // @ts-expect-error - Compatibility (Vue 3)
        : node.data && node.data.attrs // @ts-expect-error - Compatibility (Vue 2)
            ? node.data.attrs
            : {};
}

export function overrideDirectiveHook(
    directive: ObjectDirective,
    hook: DirectiveHookName,
    implementation: (baseHook: DirectiveHook, ...args: GetClosureArgs<DirectiveHook>) => void,
): DirectiveHook {
    const baseMethod = (directive[hook] ?? noop) as DirectiveHook;

    directive[hook] = function(this: Directive, ...args: GetClosureArgs<DirectiveHook>) {
        implementation.call(this, baseMethod, ...args);
    };

    return baseMethod;
}
