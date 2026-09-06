import { useState } from 'react'

import { Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Heading from '@tiptap/extension-heading'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import Blockquote from '@tiptap/extension-blockquote'
import HorizontalRule from '@tiptap/extension-hr'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'

const extensions = [
  StarterKit,
  Bold,
  Italic,
  Heading.configure({
    levels: [1, 2, 3],
    defaultLevel: 2,
  }),
  BulletList,
  OrderedList,
  Blockquote,
  HorizontalRule,
  Link,
  Image,
]

export default function RichTextEditor({
  initialContent,
  onChange,
}: {
  initialContent?: string
  onChange: (content: string) => void
}) {
  const [editor] = useState(() => new Editor({ extensions, element: document.createElement('div') }))

  useState(() => {
    if (initialContent) {
      editor.setContent(initialContent)
    }
  }, [initialContent])

  const handleChange = ({ html, text }) => {
    onChange(html || text || '')
  }

  return (
    <div>
      <Editor
        editor={editor}
        extensions={extensions}
        onChange={handleChange}
        html={initialContent}
      />
    </div>
  )
}