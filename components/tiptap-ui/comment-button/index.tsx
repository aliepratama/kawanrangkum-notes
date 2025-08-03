import { useTiptapEditor } from "@/hooks/use-tiptap-editor"
import { Button } from "@/components/tiptap-ui-primitive/button"
import { MessageSquarePlus } from "lucide-react"

// Impor fungsi baru `canSetComment`
import { isCommentActive, canAddComment, handleComment } from '@/lib/comment-button'

export const CommentButton = () => {
  const { editor } = useTiptapEditor()

  if (!editor || !canAddComment(editor)) {
    return null
  }

  return (
    <Button
      type="button"
      tooltip="Comment"
      onClick={() => handleComment(editor)} // Panggil handleComment
      data-active={isCommentActive(editor)}
    >
      <MessageSquarePlus className="tiptap-button-icon" />
    </Button>
  )
}