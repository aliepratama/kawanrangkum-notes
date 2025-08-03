'use client'

import { AppSidebar } from '@/components/dashboard/app-sidebar'
import { FilterTabs } from '@/components/dashboard/filter-last-activity'
import { SearchPopover } from '@/components/dashboard/search-popover'
import { NoteProvider } from '@/components/providers/note-provider'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { useAuthStore } from '@/stores/auth-store'
import { useNoteStore, type Note } from '@/stores/note-store'
import { useSearchShortcut } from '@/hooks/use-search-shortcut'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const { isSignedIn, user, initialize } = useAuthStore()
  const { fetchNotes } = useNoteStore()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const { isSearchOpen, setIsSearchOpen } = useSearchShortcut()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Initialize auth store first
        await initialize()

        // Then check if signed in
        const signedIn = await isSignedIn()
        if (!signedIn) {
          router.push('/auth/login')
          return
        }

        // Fetch notes after authentication is confirmed
        await fetchNotes()
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/auth/login')
      } finally {
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [isSignedIn, router, initialize, fetchNotes])

  const handleSelectNote = (note: Note) => {
    // Handle note selection - navigate to note or open in editor
    console.log('Selected note:', note)
    // You can navigate to the note editor page here
    // router.push(`/dashboard/notes/${note.id}`)
  }

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Memuat...</div>
      </div>
    )
  }

  // Don't render dashboard if no user
  if (!user) {
    return null
  }

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <header className="flex h-[--header-height] shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[--header-height]">
          <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
            <div className="ml-auto flex items-center gap-2">
              <div className="w-64">
                <SearchPopover
                  open={isSearchOpen}
                  onOpenChange={setIsSearchOpen}
                  onSelectNote={handleSelectNote}
                />
              </div>
              {/* Add theme toggle to dashboard header */}
              <ThemeToggle variant="dropdown" size="sm" />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <NoteProvider>
                <FilterTabs />
              </NoteProvider>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
