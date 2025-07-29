import { 
  PlusCircle,
  Database,
  EllipsisVertical,
  Divide,
  Frame,
  Users,
  FileSpreadsheet,
  CircleFadingPlus,
  FileCode,
  FileSearch2
 } from "lucide-react"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCardsAll() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-3 @5xl/main:grid-cols-4">
      <Card className="@container/card flex flex-col items-center justify-center gap-2">
        <CardHeader className="w-full justify-center">
          <CardTitle className="font-semibold tabular-nums ">
              <CircleFadingPlus className="h-12 w-12 @[250px]/card:h-12 @[250px]/card:w-12"/>
          </CardTitle>
        </CardHeader>
        <CardFooter className="w-full justify-center font-medium text-lg">
            Ringkas catatan baru
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          {/* <CardDescription>Total Revenue</CardDescription> */}
          <CardTitle className="flex justify-between font-normal tabular-nums ">
            <div>
              <Frame className="h-12 w-12 @[250px]/card:h-12 @[250px]/card:w-12"/>
            </div>
            <div>
              <EllipsisVertical className="h-12 w-12 @[250px]/card:h-6 @[250px]/card:w-6"/>
            </div>
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-2">
          <div className="line-clamp-1 flex gap-2 font-medium text-xl">
            Design Thinking - Theory
          </div>
          <div className="flex w-full justify-between">
            <div className="text-muted-foreground text-sm">
              28 July 2025
            </div>
            <div>
              <Users className="h-12 w-12 @[250px]/card:h-4 @[250px]/card:w-4"/>
            </div>
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          {/* <CardDescription>Total Revenue</CardDescription> */}
          <CardTitle className="flex justify-between font-semibold tabular-nums ">
            <div>
              <FileSearch2 className="h-12 w-12 @[250px]/card:h-12 @[250px]/card:w-12"/>
            </div>
            <div>
              <EllipsisVertical className="h-12 w-12 @[250px]/card:h-6 @[250px]/card:w-6"/>
            </div>
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-2">
          <div className="line-clamp-1 flex gap-2 font-medium text-xl">
            Penelitian Kuantitatif
          </div>
          <div className="flex w-full justify-between">
            <div className="text-muted-foreground text-sm">
              28 July 2025
            </div>
            {/* <div>
              <Users className="h-12 w-12 @[250px]/card:h-4 @[250px]/card:w-4"/>
            </div> */}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          {/* <CardDescription>Total Revenue</CardDescription> */}
          <CardTitle className="flex justify-between font-semibold tabular-nums ">
            <div>
              <FileCode className="h-12 w-12 @[250px]/card:h-12 @[250px]/card:w-12"/>
            </div>
            <div>
              <EllipsisVertical className="h-12 w-12 @[250px]/card:h-6 @[250px]/card:w-6"/>
            </div>
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-2">
          <div className="line-clamp-1 flex gap-2 font-medium text-xl">
            RPL - Metode Agile
          </div>
          <div className="flex w-full justify-between">
            <div className="text-muted-foreground text-sm">
              28 July 2025
            </div>
            <div>
              <Users className="h-12 w-12 @[250px]/card:h-4 @[250px]/card:w-4"/>
            </div>
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          {/* <CardDescription>Total Revenue</CardDescription> */}
          <CardTitle className="flex justify-between font-semibold tabular-nums ">
            <div>
              <Database className="h-12 w-12 @[250px]/card:h-12 @[250px]/card:w-12"/>
            </div>
            <div>
              <EllipsisVertical className="h-12 w-12 @[250px]/card:h-6 @[250px]/card:w-6"/>
            </div>
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-2">
          <div className="line-clamp-1 flex gap-2 font-medium text-xl">
            Big Data (B)
          </div>
          <div className="flex w-full justify-between">
            <div className="text-muted-foreground text-sm">
              28 July 2025
            </div>
            {/* <div>
              <Users className="h-12 w-12 @[250px]/card:h-4 @[250px]/card:w-4"/>
            </div> */}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export function SectionCardsPrivate() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-3 @5xl/main:grid-cols-4">
      <Card className="@container/card flex flex-col items-center justify-center gap-2">
        <CardHeader className="w-full justify-center">
          <CardTitle className="font-semibold tabular-nums ">
              <CircleFadingPlus className="h-12 w-12 @[250px]/card:h-12 @[250px]/card:w-12"/>
          </CardTitle>
        </CardHeader>
        <CardFooter className="w-full justify-center font-medium text-lg">
            Ringkas catatan baru
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          {/* <CardDescription>Total Revenue</CardDescription> */}
          <CardTitle className="flex justify-between font-semibold tabular-nums ">
            <div>
              <FileSearch2 className="h-12 w-12 @[250px]/card:h-12 @[250px]/card:w-12"/>
            </div>
            <div>
              <EllipsisVertical className="h-12 w-12 @[250px]/card:h-6 @[250px]/card:w-6"/>
            </div>
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-2">
          <div className="line-clamp-1 flex gap-2 font-medium text-xl">
            Penelitian Kuantitatif
          </div>
          <div className="flex w-full justify-between">
            <div className="text-muted-foreground text-sm">
              28 July 2025
            </div>
            {/* <div>
              <Users className="h-12 w-12 @[250px]/card:h-4 @[250px]/card:w-4"/>
            </div> */}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          {/* <CardDescription>Total Revenue</CardDescription> */}
          <CardTitle className="flex justify-between font-semibold tabular-nums ">
            <div>
              <Database className="h-12 w-12 @[250px]/card:h-12 @[250px]/card:w-12"/>
            </div>
            <div>
              <EllipsisVertical className="h-12 w-12 @[250px]/card:h-6 @[250px]/card:w-6"/>
            </div>
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-2">
          <div className="line-clamp-1 flex gap-2 font-medium text-xl">
            Big Data (B)
          </div>
          <div className="flex w-full justify-between">
            <div className="text-muted-foreground text-sm">
              28 July 2025
            </div>
            {/* <div>
              <Users className="h-12 w-12 @[250px]/card:h-4 @[250px]/card:w-4"/>
            </div> */}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export function SectionCardsShared() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-3 @5xl/main:grid-cols-4">
      <Card className="@container/card flex flex-col items-center justify-center gap-2">
        <CardHeader className="w-full justify-center">
          <CardTitle className="font-semibold tabular-nums ">
              <CircleFadingPlus className="h-12 w-12 @[250px]/card:h-12 @[250px]/card:w-12"/>
          </CardTitle>
        </CardHeader>
        <CardFooter className="w-full justify-center font-medium text-lg">
            Ringkas catatan baru
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          {/* <CardDescription>Total Revenue</CardDescription> */}
          <CardTitle className="flex justify-between font-normal tabular-nums ">
            <div>
              <Frame className="h-12 w-12 @[250px]/card:h-12 @[250px]/card:w-12"/>
            </div>
            <div>
              <EllipsisVertical className="h-12 w-12 @[250px]/card:h-6 @[250px]/card:w-6"/>
            </div>
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-2">
          <div className="line-clamp-1 flex gap-2 font-medium text-xl">
            Design Thinking - Theory
          </div>
          <div className="flex w-full justify-between">
            <div className="text-muted-foreground text-sm">
              28 July 2025
            </div>
            <div>
              <Users className="h-12 w-12 @[250px]/card:h-4 @[250px]/card:w-4"/>
            </div>
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          {/* <CardDescription>Total Revenue</CardDescription> */}
          <CardTitle className="flex justify-between font-semibold tabular-nums ">
            <div>
              <FileCode className="h-12 w-12 @[250px]/card:h-12 @[250px]/card:w-12"/>
            </div>
            <div>
              <EllipsisVertical className="h-12 w-12 @[250px]/card:h-6 @[250px]/card:w-6"/>
            </div>
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-2">
          <div className="line-clamp-1 flex gap-2 font-medium text-xl">
            RPL - Metode Agile
          </div>
          <div className="flex w-full justify-between">
            <div className="text-muted-foreground text-sm">
              28 July 2025
            </div>
            <div>
              <Users className="h-12 w-12 @[250px]/card:h-4 @[250px]/card:w-4"/>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
