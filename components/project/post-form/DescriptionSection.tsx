'use client';

import { Extension } from '@tiptap/core';
import Bold from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import Document from '@tiptap/extension-document';
import Italic from '@tiptap/extension-italic';
import ListItem from '@tiptap/extension-list-item';
import Paragraph from '@tiptap/extension-paragraph';
import Placeholder from '@tiptap/extension-placeholder';
import Text from '@tiptap/extension-text';
import { TextSelection } from '@tiptap/pm/state';
import { EditorContent, useEditor } from '@tiptap/react';
import { List } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface DescriptionSectionProps {
  description: string;
  setDescription: (v: string) => void;
}

const toolbarBtn =
  'flex h-8 w-8 items-center justify-center rounded-tile border border-border bg-surface text-[13px] font-semibold text-text-secondary transition-colors hover:bg-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary aria-pressed:border-primary aria-pressed:bg-tag-bg aria-pressed:text-primary';

// Real, reproduced bug: pressing the native End key right after a Bold/Italic-marked run at the
// end of a line, then Enter, silently drops that entire marked text node (confirmed via isolated
// repro — ArrowRight-to-the-same-position doesn't trigger it, only End does). ProseMirror has no
// built-in End/Home keymap of its own, so without this override the browser's native
// contenteditable End handling runs, and whatever DOM selection it produces at a mark boundary
// gets mis-synced back into the editor's document model, causing content loss on the next edit.
// Resolving the position via ProseMirror's own $pos.end()/$pos.start() instead of native caret
// movement sidesteps the DOM-sync step entirely.
const FixEndHomeKeys = Extension.create({
  name: 'fixEndHomeKeys',
  addKeyboardShortcuts() {
    const moveTo = (toEnd: boolean) => () => {
      const { state, view } = this.editor;
      const { $from } = state.selection;
      const pos = toEnd ? $from.end() : $from.start();
      view.dispatch(state.tr.setSelection(TextSelection.create(state.doc, pos)));
      return true;
    };
    return { End: moveTo(true), Home: moveTo(false) };
  },
});

// Hand-picked extensions only (not the StarterKit kitchen-sink preset) so "Bold/Italic/BulletList
// only, no headings" is enforced by what's imported, not by remembering to disable things.
const EXTENSIONS = [
  Document,
  Paragraph,
  Text,
  Bold,
  Italic,
  BulletList,
  ListItem,
  FixEndHomeKeys,
  Placeholder.configure({
    placeholder: "What's the vision? What have you built so far? What kind of people are you hoping to work with?",
  }),
];

export function DescriptionSection({ description, setDescription }: DescriptionSectionProps) {
  const editor = useEditor({
    extensions: EXTENSIONS,
    content: description,
    // Known, real fix for Tiptap + Next.js App Router SSR hydration mismatches — not hypothetical.
    immediatelyRender: false,
    onUpdate: ({ editor }) => setDescription(editor.getHTML()),
    editorProps: {
      attributes: {
        id: 'project-description',
        class:
          'min-h-[130px] w-full rounded-xl border border-border bg-surface p-[14px] text-[14.5px] leading-normal text-ink transition-all duration-150 focus:border-[1.5px] focus:border-primary focus:shadow-focus focus:outline-none [&_ul]:ml-5 [&_ul]:list-disc [&_p.is-editor-empty:first-child::before]:pointer-events-none [&_p.is-editor-empty:first-child::before]:float-left [&_p.is-editor-empty:first-child::before]:h-0 [&_p.is-editor-empty:first-child::before]:text-text-meta [&_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]',
      },
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label htmlFor="project-description" className="text-sm font-semibold text-ink">
          Tell people about it
        </label>
        <div className="flex items-center gap-1.5">
          {/* onMouseDown preventDefault is required here: without it, the browser moves focus
              to the button on mousedown (before onClick fires), which collapses/loses the
              editor's text selection — toggleBold() would then apply to a stray cursor position
              instead of the selected text. */}
          <button
            type="button"
            aria-label="Bold"
            aria-pressed={!!editor?.isActive('bold')}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={toolbarBtn}
          >
            B
          </button>
          <button
            type="button"
            aria-label="Italic"
            aria-pressed={!!editor?.isActive('italic')}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={cn(toolbarBtn, 'italic')}
          >
            I
          </button>
          <button
            type="button"
            aria-label="Bullet list"
            aria-pressed={!!editor?.isActive('bulletList')}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={toolbarBtn}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
