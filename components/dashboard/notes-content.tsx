import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"

export function MainContentLayout() {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full max-h-screen"
    >
      {/* --- Panel 1: Chat --- */}
      <ResizablePanel defaultSize={60} minSize={30}>
        <ScrollArea className="h-full p-4 md:p-6">
          {/* Letakkan komponen Chat Anda di sini */}
          <h2 className="mb-4 text-xl font-semibold">Chat</h2>
          <div className="rounded-lg border p-4">
            <p>Riwayat percakapan akan muncul di sini...</p>
          </div>
        </ScrollArea>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* --- Panel 2: Studio --- */}
      <ResizablePanel defaultSize={40} minSize={25}>
        <ScrollArea className="h-full p-4 md:p-6">
          {/* Letakkan komponen Studio Anda di sini */}
          <h2 className="mb-4 text-xl font-semibold">Studio</h2>
          <div className="space-y-4">
             <div className="rounded-lg border p-4">
                <p>Fitur Studio (Ringkasan Audio, dll.) akan muncul di sini...</p>
             </div>
             <div className="rounded-lg border p-4">
                <p>Catatan Anda akan muncul di sini...</p>
             </div>
          </div>
        </ScrollArea>
      </ResizablePanel>

    </ResizablePanelGroup>
  )
}