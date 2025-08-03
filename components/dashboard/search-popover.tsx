'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, FileText, Calendar } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useNoteStore, type Note } from '@/stores/note-store'

interface SearchPopoverProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectNote: (note: Note) => void
}

export function SearchPopover({ open, onOpenChange, onSelectNote }: SearchPopoverProps) {
  const { notes, loading, fetchNotes } = useNoteStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Fetch notes when component mounts or when popover opens
  useEffect(() => {
    if (open && notes.length === 0) {
      fetchNotes()
    }
  }, [open, notes.length, fetchNotes])

  // Filter notes in real-time based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredNotes(notes.slice(0, 10)) // Show first 10 notes when no search
      return
    }

    const filtered = notes.filter(note =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.icon && note.icon.toLowerCase().includes(searchQuery.toLowerCase()))
    ).slice(0, 10) // Limit to 10 results

    setFilteredNotes(filtered)
  }, [searchQuery, notes])

  // Focus input when popover opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [open])

  // Reset search when popover closes
  useEffect(() => {
    if (!open) {
      setSearchQuery('')
    }
  }, [open])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  const handleSelectNote = (note: Note) => {
    onSelectNote(note)
    onOpenChange(false)
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-muted-foreground"
        >
          <Search className="mr-2 h-4 w-4" />
          Cari catatan...
          <Badge variant="secondary" className="ml-auto">
            /
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[600px] h-[500px] p-0 flex flex-col" 
        align="start"
        side="bottom"
        sideOffset={8}
      >
        {/* Fixed Header */}
        <div className="border-b p-4 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Cari catatan berdasarkan judul..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>
        
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-2">
              {loading ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Memuat catatan...
                </div>
              ) : filteredNotes.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  {searchQuery ? 'Tidak ada catatan yang ditemukan.' : 'Belum ada catatan.'}
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredNotes.map((note) => (
                    <button
                      key={note.id}
                      onClick={() => handleSelectNote(note)}
                      className="w-full rounded-md p-3 text-left transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-lg flex-shrink-0">
                          {note.icon || '📝'}
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="font-medium text-sm truncate">
                            {note.title || 'Tanpa Judul'}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(note.created_at)}</span>
                            </div>
                            {note.is_favourite && (
                              <Badge variant="secondary" className="text-xs px-1 py-0">
                                ⭐ Favorit
                              </Badge>
                            )}
                            {note.is_public ? (
                              <Badge variant="outline" className="text-xs px-1 py-0">
                                🌐 Publik
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs px-1 py-0">
                                🔒 Privat
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        
        {/* Fixed Footer */}
        <div className="border-t p-2 flex-shrink-0">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {filteredNotes.length} dari {notes.length} catatan
            </span>
            <div className="flex gap-2">
              <span>↑↓ Navigasi</span>
              <span>↵ Pilih</span>
              <span>Esc Tutup</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}