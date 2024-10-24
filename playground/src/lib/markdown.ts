import DOMPurify from 'dompurify';
import { Renderer, marked } from 'marked';
import { tap } from '@noeldemartin/utils';

function makeRenderer(): Renderer {
    return tap(new Renderer(), (renderer) => {
        renderer.link = function(link) {
            return Renderer.prototype.link.apply(this, [link]).replace('<a', '<a target="_blank"');
        };
    });
}

export function md(raw: TemplateStringsArray): string {
    const lines = raw.join('').split('\n');

    while (lines[0]?.trim().length === 0) {
        lines.shift();
    }

    while (lines[lines.length - 1]?.trim().length === 0) {
        lines.pop();
    }

    const index = lines[0]?.search(/\S/);

    return lines.map((line) => line.slice(index)).join('\n');
}

export function renderMarkdown(markdown: string): string {
    return safeHtml(marked(markdown, { renderer: makeRenderer() }) as string);
}

export function safeHtml(html: string): string {
    // See https://github.com/cure53/DOMPurify/issues/317
    return DOMPurify.sanitize(html, { ADD_ATTR: ['target'] });
}
