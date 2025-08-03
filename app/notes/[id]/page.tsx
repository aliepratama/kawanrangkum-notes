'use client'

import { use, useEffect, useState } from 'react'
import { AppSidebar } from '@/components/dashboard/app-sidebar'
import { NotionEditor } from '@/components/tiptap-templates/notion-like/notion-like-editor'

import defaultContent from '@/components/tiptap-templates/notion-like/data/starter.json'
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar'
import { useNoteStore } from '@/stores/note-store'

interface NotesPageProps {
  params: Promise<{ id: string }>
}

export default function NotesPage({ params }: NotesPageProps) {
  const { id } = use(params)
  const { notes, fetchNotes, loading } = useNoteStore()
  const [noteContent, setNoteContent] = useState(defaultContent)

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  useEffect(() => {
    if (notes.length > 0) {
      const currentNote = notes.find(note => note.id === id)
      if (currentNote && currentNote.content) {
        setNoteContent(currentNote.content)
      }
    }
  }, [notes, id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 6)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="h-[calc(100vh-var(--header-height))] flex-col overflow-y-auto">
        <NotionEditor
          room={`note-${id}`}
          placeholder="Start writing..."
          defaultValue={noteContent}
          noteId={id}
        />
      </SidebarInset>
    </SidebarProvider>
  )
}
