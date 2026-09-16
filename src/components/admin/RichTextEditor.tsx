import { useEffect, type ReactNode } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, List, ListOrdered, Quote, Undo, Redo, Heading1, Heading2, Heading3, Link as LinkIcon } from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
}

function ToolbarButton({
  active,
  onClick,
  label,
  children,
}: {
  active?: boolean
  onClick: () => void
  label: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`p-2 rounded-lg transition-colors ${
        active ? 'bg-gold-500/20 text-gold-400' : 'text-gray-400 hover:text-gold-400 hover:bg-white/5'
      }`}
    >
      {children}
    </button>
  )
}

function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'rich-content focus:outline-none min-h-[320px] px-4 py-4',
      },
    },
  })

  // The editor is only created once on mount, so when the parent finishes
  // loading async data (edit mode) after that, push it into the editor.
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false })
    }
  }, [editor, value])

  if (!editor) return null

  function toggleLink() {
    const previousUrl = editor!.getAttributes('link').href as string | undefined
    const url = window.prompt('Link URL', previousUrl ?? 'https://')
    if (url === null) return
    if (url.trim() === '') {
      editor!.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor!.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run()
  }

  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(197, 160, 89, 0.2)' }}>
      <div
        className="flex flex-wrap items-center gap-1 px-3 py-2 border-b"
        style={{ borderColor: 'rgba(197, 160, 89, 0.15)', background: 'rgba(255,255,255,0.02)' }}
      >
        <ToolbarButton label="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton label="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="Heading 1"
          active={editor.isActive('heading', { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1 size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="Heading 2"
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="Heading 3"
          active={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="Bullet list"
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="Ordered list"
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="Quote"
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={16} />
        </ToolbarButton>
        <ToolbarButton label="Link" active={editor.isActive('link')} onClick={toggleLink}>
          <LinkIcon size={16} />
        </ToolbarButton>
        <div className="w-px h-5 mx-1" style={{ background: 'rgba(197, 160, 89, 0.2)' }} />
        <ToolbarButton label="Undo" onClick={() => editor.chain().focus().undo().run()}>
          <Undo size={16} />
        </ToolbarButton>
        <ToolbarButton label="Redo" onClick={() => editor.chain().focus().redo().run()}>
          <Redo size={16} />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} className="bg-transparent text-white" />
    </div>
  )
}

export default RichTextEditor
