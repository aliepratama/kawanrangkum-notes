'use client'

import { useNoteStore } from '@/stores/note-store'
import { useEffect } from 'react'

export function NoteProvider({ 
  children 
}: { 
  children: React.ReactNode
}) {
  const fetchNotes = useNoteStore(state => state.fetchNotes)

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  return <>{children}</>
}