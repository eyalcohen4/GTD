"use client"

import Highlight from "@tiptap/extension-highlight"
import Placeholder from "@tiptap/extension-placeholder"
import Typography from "@tiptap/extension-typography"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Editor as Novel } from "novel"

export const Editor = ({
  className,
  content,
  onChange,
  placeholder,
}: {
  className?: string
  placeholder?: string
  content?: any
  onChange: (content: Record<string, unknown> | null | undefined) => void
}) => {
  return (
    <Novel
      extensions={[
        Placeholder.configure({
          placeholder: placeholder ?? "Say something...",
        }),
      ]}
      className="border-none"
      defaultValue={content}
      onDebouncedUpdate={(item: any) => {
        onChange(item?.getJSON())
      }}
    />
  )
}
