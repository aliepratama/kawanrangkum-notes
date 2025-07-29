import { SectionCardsAll, SectionCardsPrivate, SectionCardsShared } from "@/components/dashboard/last-activity"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export function FilterTabs({}) {
  return (
    <div className="px-4 lg:px-6">
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Semua</TabsTrigger>
          <TabsTrigger value="shared">Dibagikan</TabsTrigger>
          <TabsTrigger value="private">Privat</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <SectionCardsAll />
        </TabsContent>
        <TabsContent value="shared">
            <SectionCardsShared />
        </TabsContent>
        <TabsContent value="private">
            <SectionCardsPrivate />
        </TabsContent>
      </Tabs>
    </div>
  )
}