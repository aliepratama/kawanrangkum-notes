import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { Topbar } from "@/components/dashboard/topbar"
import { Separator } from "@/components/ui/separator"
import dynamic from 'next/dynamic';
import { NotionEditor } from '@/components/tiptap-templates/notion-like/notion-like-editor'

import defaultContent from '@/components/tiptap-templates/notion-like/data/content.json'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Page() {
  
  return (
    <SidebarProvider
      style={
        { 
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 6)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="h-[calc(100vh-var(--header-height))] flex-col overflow-y-auto">
          <NotionEditor
            room="my-document-room"
            placeholder="Start writing..."
            defaultValue={defaultContent}
          />
      </SidebarInset>
    </SidebarProvider>
  )
}
