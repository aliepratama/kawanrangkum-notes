'use client'

import { useNoteStore, NoteFilter } from '@/stores/note-store'
import { CircleFadingPlus } from 'lucide-react'
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { NoteCard } from './note-card'

function CreateNoteCard() {
  return (
    <Card className="@container/card flex flex-col items-center justify-center gap-2">
      <CardHeader className="w-full justify-center">
        <CardTitle className="font-semibold tabular-nums">
          <CircleFadingPlus className="h-12 w-12 @[250px]/card:h-12 @[250px]/card:w-12" />
        </CardTitle>
      </CardHeader>
      <CardFooter className="w-full justify-center font-medium text-lg">
        Ringkas catatan baru
      </CardFooter>
    </Card>
  )
}

interface NotesGridProps {
  filter: NoteFilter
}

export function NotesGrid({ filter }: NotesGridProps) {
  const { getFilteredNotes, loading } = useNoteStore()
  const notes = getFilteredNotes(filter)

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-3 @5xl/main:grid-cols-4">
      <CreateNoteCard />
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  )
}
