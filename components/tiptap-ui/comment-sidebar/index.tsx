"use client"

import React from 'react';
import { useTiptapEditor } from '@/hooks/use-tiptap-editor';

// Impor custom hook dari file logika
import { useCommentState } from './comment-sidebar';

export const CommentSidebar = () => {
  const { editor } = useTiptapEditor();
  // Gunakan custom hook untuk mendapatkan state yang sudah dikelola
  const { comments, activeCommentId } = useCommentState(editor);

  if (!editor || comments.length === 0) {
    return null; // Jangan tampilkan apa-apa jika tidak ada komentar
  }

  return (
    <div className="w-80 border-l bg-background p-4 space-y-4">
      <h3 className="font-semibold">Komentar</h3>
      {comments.map(({ id, content }) => (
        <div
          key={id}
          className={`p-2 rounded-lg ${id === activeCommentId ? 'bg-muted' : ''}`}
        >
          {content.map((comment, index) => (
            <p key={index} className="text-sm">{comment.content}</p>
          ))}
          {/* Di sini Anda bisa menambahkan form untuk membalas */}
        </div>
      ))}
    </div>
  );
};