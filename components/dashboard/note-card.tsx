'use client'

import { Note, useNoteStore } from '@/stores/note-store'
import {
  Database,
  EllipsisVertical,
  Frame,
  Users,
  FileCode,
  FileSearch2,
  Star,
  FolderOpen,
  Share,
  Trash2,
} from 'lucide-react'
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const iconMap = {
  database: Database,
  frame: Frame,
  fileCode: FileCode,
  fileSearch: FileSearch2,
}

interface NoteCardProps {
  note: Note
}

export function NoteCard({ note }: NoteCardProps) {
  const { toggleFavourite, deleteNote } = useNoteStore()
  const IconComponent = iconMap[note.icon as keyof typeof iconMap] || FileCode
  
  const handleOpen = () => {
    // Navigate to note detail page
  } 

  const handleShare = () => {
    // Implement share functionality
  }

  const handleDelete = () => {
    // Delete the note
    deleteNote(note.id)
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="flex justify-between font-semibold tabular-nums">
          <div>
            <IconComponent className="h-12 w-12 @[250px]/card:h-12 @[250px]/card:w-12" />
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleFavourite(note.id)}
              className="p-1"
            >
              <Star 
                className={`h-4 w-4 ${note.is_favourite ? 'fill-current text-yellow-500' : ''}`} 
              />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1"
                >
                  <EllipsisVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleOpen} className="cursor-pointer">
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Open
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShare} className="cursor-pointer">
                  <Share className="mr-2 h-4 w-4" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete} 
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-2">
        <div className="line-clamp-1 flex gap-2 font-medium text-xl">
          {note.title}
        </div>
        <div className="flex w-full justify-between">
          <div className="text-muted-foreground text-sm">
            {new Date(note.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </div>
          {note.is_public && (
            <div>
              <Users className="h-4 w-4" />
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}