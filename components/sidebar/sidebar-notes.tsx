'use client'

import { useNoteStore } from '@/stores/note-store'
import { Star, Share, Lock, FileText, Users } from 'lucide-react'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const iconMap = {
  database: FileText,
  frame: FileText,
  fileCode: FileText,
  fileSearch: FileText,
}

export function NavNotes() {
  const { getFilteredNotes } = useNoteStore()

  const favouriteNotes = getFilteredNotes('favourite')
  const publicNotes = getFilteredNotes('public')
  const privateNotes = getFilteredNotes('private')

  return (
    <>
      {/* Favourite Notes */}
      {favouriteNotes.length > 0 && (
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Favorit
          </SidebarGroupLabel>
          <SidebarMenu>
            {favouriteNotes.slice(0, 5).map((note) => {
              const IconComponent =
                iconMap[note.icon as keyof typeof iconMap] || FileText
              return (
                <SidebarMenuItem key={note.id}>
                  <SidebarMenuButton asChild>
                    <a
                      href={`/notes/${note.id}`}
                      className="flex items-center gap-2"
                    >
                      <IconComponent className="h-4 w-4" />
                      <span className="truncate">{note.title}</span>
                      <div className="ml-auto flex items-center gap-1">
                        {note.is_public ? (
                          <Users className="h-3 w-3" />
                        ) : (
                          <Lock className="h-3 w-3" />
                        )}
                      </div>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      )}

      {/* Recent Notes */}
      <SidebarGroup>
        <SidebarGroupLabel>Terbaru</SidebarGroupLabel>
        <SidebarMenu>
          {[...privateNotes, ...publicNotes]
            .sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )
            .slice(0, 8)
            .map((note) => {
              const IconComponent =
                iconMap[note.icon as keyof typeof iconMap] || FileText
              return (
                <SidebarMenuItem key={note.id}>
                  <SidebarMenuButton asChild>
                    <a
                      href={`/notes/${note.id}`}
                      className="flex items-center gap-2"
                    >
                      <IconComponent className="h-4 w-4" />
                      <span className="truncate">{note.title}</span>
                      <div className="ml-auto flex items-center gap-1">
                        {note.is_favourite && (
                          <Star className="h-3 w-3 fill-current" />
                        )}
                        {note.is_public ? (
                          <Users className="h-3 w-3" />
                        ) : (
                          <Lock className="h-3 w-3" />
                        )}
                      </div>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
        </SidebarMenu>
      </SidebarGroup>
    </>
  )
}
