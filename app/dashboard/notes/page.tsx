import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { Topbar } from "@/components/dashboard/topbar"
import { Separator } from "@/components/ui/separator"
import { NotionEditor } from '@/components/tiptap-templates/notion-like/notion-like-editor'
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
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <Topbar />
          <NotionEditor room="my-document-room" placeholder="Start writing..." />
      </SidebarInset>
    </SidebarProvider>
  )
}
