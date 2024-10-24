import { onMounted, onUnmounted } from 'vue';

function useWindowEvent<Event extends keyof WindowEventMap>(
    type: Event,
    listener: (event: WindowEventMap[Event], stop: () => void) => unknown,
): () => void {
    const nativeListener = (event: WindowEventMap[Event]) => listener.call(document, event, stop);
    const stop = () => window.removeEventListener(type, nativeListener);

    onMounted(() => window.addEventListener(type, nativeListener));
    onUnmounted(() => stop());

    return stop;
}

export function watchKeyboardShortcut(
    shortcut: string,
    listeners: Partial<{ start(): unknown; end(): unknown }> | (() => unknown),
): () => void {
    const shortcutListeners = typeof listeners === 'function' ? { start: listeners } : listeners;
    const consume = (event: KeyboardEvent) => {
        if (event.key !== shortcut) {
            return false;
        }

        const activeElementTagName = document.querySelector(':focus')?.tagName.toLowerCase();

        if (activeElementTagName === 'input' || activeElementTagName === 'textarea') {
            return false;
        }

        event.preventDefault();

        return true;
    };

    const stops = [
        useWindowEvent('keydown', (event) => consume(event) && shortcutListeners.start?.()),
        useWindowEvent('keyup', (event) => consume(event) && shortcutListeners.end?.()),
    ];

    return () => stops.forEach((stop) => stop());
}
