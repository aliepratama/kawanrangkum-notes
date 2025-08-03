import { type Editor } from '@tiptap/react'

export const isCommentActive = (editor: Editor): boolean => {
  return editor.isActive('comment')
}

// Periksa apakah komentar bisa ditambahkan
export const canAddComment = (editor: Editor): boolean => {
  return editor.can().addComment()
}

// Jalankan perintah untuk menambahkan/memilih komentar
export const handleComment = (editor: Editor): void => {
  editor.chain().focus().toggleComment().run()
}