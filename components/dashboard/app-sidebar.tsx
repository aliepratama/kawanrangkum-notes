'use client'

import * as React from 'react'
import { NavMain } from '@/components/sidebar/sidebar-main'
import { NavNotes } from '@/components/sidebar/sidebar-notes'
import { NavUser } from '@/components/sidebar/sidebar-user'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar'
import { Home, Search, Settings, BookOpen } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'

// This is sample data
const data = {
  navMain: [
    {
      title: 'Beranda',
      url: '/dashboard',
      icon: Home,
    },
    {
      title: 'Cari',
      url: '/search',
      icon: Search,
    },
    {
      title: 'Pengaturan',
      url: '/settings',
      icon: Settings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore()

  // Create user data from auth store
  const userData = React.useMemo(() => ({
    name: user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User',
    email: user?.email || 'user@example.com',
    avatar: user?.user_metadata?.avatar_url || '/avatars/user.jpg',
  }), [user])

  return (
    <Sidebar 
      collapsible="icon" 
      className="z-50" 
      {...props}
    >
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <BookOpen className="h-4 w-4 flex-shrink-0" />
          <div className="font-semibold truncate group-data-[collapsible=icon]:hidden">
            KawanRangkum
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavNotes />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
