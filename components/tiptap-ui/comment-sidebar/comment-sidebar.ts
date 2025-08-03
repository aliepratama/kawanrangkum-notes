import { useState, useEffect } from 'react';
import { type Editor } from '@tiptap/react';

// Definisikan tipe untuk objek komentar agar kode lebih aman dan jelas
interface Comment {
  id: string;
  content: { type: string; content: string }[];
}

// Custom hook untuk mengelola state komentar
export const useCommentState = (editor: Editor | null) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);

  useEffect(() => {
    if (!editor) return;

    // Fungsi untuk update state komentar
    const updateComments = () => {
      setComments(editor.commands.getComments());
      const activeComment = editor.getAttributes('comment');
      setActiveCommentId(activeComment.commentId || null);
    };

    // Panggil sekali saat inisialisasi
    updateComments();

    // Tambahkan listener untuk update selanjutnya
    editor.on('update', updateComments);
    editor.on('selectionUpdate', updateComments);

    // Hapus listener saat komponen di-unmount
    return () => {
      editor.off('update', updateComments);
      editor.off('selectionUpdate', updateComments);
    };
  }, [editor]);

  return { comments, activeCommentId };
};