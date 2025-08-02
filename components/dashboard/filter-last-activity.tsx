import { NotesGrid } from '@/components/dashboard/cards'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function FilterTabs() {
  return (
    <div className="px-4 lg:px-6">
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Semua</TabsTrigger>
          <TabsTrigger value="public">Dibagikan</TabsTrigger>
          <TabsTrigger value="private">Privat</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <NotesGrid filter="all" />
        </TabsContent>
        <TabsContent value="public">
          <NotesGrid filter="public" />
        </TabsContent>
        <TabsContent value="private">
          <NotesGrid filter="private" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
