'use client'

import { AppSidebar } from '@/components/dashboard/app-sidebar'
import { FilterTabs } from '@/components/dashboard/filter-last-activity'
import { NoteProvider } from '@/components/providers/note-provider'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { useAuthStore } from '@/stores/auth-store'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const { isSignedIn, user, initialize } = useAuthStore()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

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
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/auth/login')
      } finally {
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [isSignedIn, router, initialize])

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
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
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
          <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
            <div className="ml-auto flex items-center gap-2">
              {/* Header elements in row */}
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
