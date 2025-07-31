"use client"

import * as React from "react"
import * as LucideReact from "lucide-react"

import { NavFavorite } from "@/components/sidebar/sidebar-favorite"
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
      icon: LucideReact.Search,
    },
    {
      title: "Beranda",
      url: "/dashboard",
      icon: LucideReact.Home,
    },
    {
      title: "Pesan",
      url: "/dashboard/messages",
      icon: LucideReact.Inbox,
    },
  ],
  navSecondary: [
    {
      title: "Pengaturan",
      url: "#",
      icon: LucideReact.Settings,
    },
    {
      title: "Sampah",
      url: "#",
      icon: LucideReact.Trash2,
    },
  ],
  NavFavorite: [
    {
      name: "Big Data (B)",
      url: "/dashboard/notes",
      icon: LucideReact.Database,
    },
  ],
  navShared: [
    {
      name: "Big Data (B)",
      url: "/dashboard/notes",
      icon: LucideReact.Database,
    },
    {
      name: "Design Thinking - Theory",
      url: "#",
      icon: LucideReact.Frame,
    },
    {
      name: "Penelitian Kuantitatif",
      url: "#",
      icon: LucideReact.FileSearch2,
    },
    {
      name: "Matematika Diskrit (G)",
      url: "#",
      icon: LucideReact.Pi,
    },
  ],
  navPrivate: [
    {
      name: "RPL - Metode Agile",
      url: "#",
      icon: LucideReact.FileCode,
    },
    {
      name: "Prinsip Design",
      url: "#",
      icon: LucideReact.Frame,
    },
    {
      name: "Laporan Akhir Machine Learning",
      url: "#",
      icon: LucideReact.FileSpreadsheet,
    },
    {
      name: "Design Thinking - Theory",
      url: "#",
      icon: LucideReact.Frame,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <NavUser user={data.user} />
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavFavorite items={data.NavFavorite} />
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
