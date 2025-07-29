"use client"

import * as React from "lucide-react"

import { NavShared } from "@/components/sidebar/sidebar-shared"
import { NavPrivate } from "@/components/sidebar/sidebar-private"
import { NavMain } from "@/components/sidebar/sidebar-main"
import { NavSecondary } from "@/components/sidebar/sidebar-secondary"
import { NavUser } from "@/components/sidebar/sidebar-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "ridholess",
    email: "ridholess@mail.com",
    avatar: "https://github.com/shadcn.png",
  },
  navMain: [
    {
      title: "Cari",
      url: "#",
      icon: React.Search,
    },
    {
      title: "Beranda",
      url: "/dashboard",
      icon: React.Home,
    },
    {
      title: "Pesan",
      url: "/dashboard/messages",
      icon: React.Inbox,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: React.Camera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Pengaturan",
      url: "#",
      icon: React.Settings,
    },
    {
      title: "Sampah",
      url: "#",
      icon: React.Trash2,
    },
  ],
  navShared: [
    {
      name: "Big Data (B)",
      url: "/dashboard/notes",
      icon: React.Database,
    },
    {
      name: "RPL - Metode Agile",
      url: "#",
      icon: React.FileCode,
    },
    {
      name: "Laporan Akhir Machine Learning",
      url: "#",
      icon: React.FileSpreadsheet,
    },
    {
      name: "Design Thinking - Theory",
      url: "#",
      icon: React.Frame,
    },
    {
      name: "Penelitian Kuantitatif",
      url: "#",
      icon: React.FileSearch2,
    },
  ],
  navPrivate: [
    {
      name: "Big Data (B)",
      url: "/dashboard/notes",
      icon: React.Database,
    },
    {
      name: "RPL - Metode Agile",
      url: "#",
      icon: React.FileCode,
    },
    {
      name: "Laporan Akhir Machine Learning",
      url: "#",
      icon: React.FileSpreadsheet,
    },
    {
      name: "Design Thinking - Theory",
      url: "#",
      icon: React.Frame,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavShared items={data.navShared} />
        <NavPrivate items={data.navPrivate} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>   
      </SidebarFooter>
    </Sidebar>
  )
}
