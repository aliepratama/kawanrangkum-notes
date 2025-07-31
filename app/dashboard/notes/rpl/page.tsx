"use client"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { AppSidebar } from "@/components/dashboard/app-sidebar"

import {
  ArrowDown,
  ArrowUp,
  Bell,
  Copy, 
  CornerUpLeft,
  CornerUpRight,
  Link,
  MoreHorizontal,
  Star,
  Trash2,
} from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,

} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const data = [
  [
    {
      label: "Salin Tautan",
      icon: Link,
    },
    {
      label: "Duplikat",
      icon: Copy,
    },
    {
      label: "Pindahkan ke",
      icon: CornerUpRight,
    },
    {
      label: "Pindahkan ke Sampah",
      icon: Trash2,
    },
  ],
  [
    {
      label: "Urungkan",
      icon: CornerUpLeft,
    },
    {
      label: "Notifikasi",
      icon: Bell,
    },
  ],
  [
    {
      label: "Impor",
      icon: ArrowUp,
    },
    {
      label: "Ekspor",
      icon: ArrowDown,
    },
  ],
]

export default function Page() {
    const [isOpen, setIsOpen] = React.useState(false)
        React.useEffect(() => {
        setIsOpen(false)
        }, [])
        const [isFavorited, setIsFavorited] = React.useState(false)

        const handleFavoriteClick = () => {
        setIsFavorited(!isFavorited)
    }

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
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                orientation="vertical"
                className="mx-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                    <BreadcrumbPage className="line-clamp-1">
                        RPL - Metode Agile
                    </BreadcrumbPage>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                    <BreadcrumbPage className="line-clamp-1">
                        <Badge variant="outline">
                        Privat
                        </Badge>
                    </BreadcrumbPage>
                    </BreadcrumbItem>

                </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto flex items-center gap-2">
                <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
                    <a
                    href="#"
                    rel="noopener noreferrer"
                    target="_blank"
                    className="dark:text-foreground"
                    >
                    Bagikan
                    </a>
                </Button>
                <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
                    <a
                    href="#"
                    rel="noopener noreferrer"
                    target="_blank"
                    className="dark:text-foreground"
                    >
                    Flashcard
                    </a>
                </Button>
                <Button
                    onClick={handleFavoriteClick}
                    variant="ghost"
                    size="icon"
                    className={cn("h-7 w-7", 
                    isFavorited
                    ? "text-yellow-500 hover:text-yellow-500"
                    : ""
                    )}
                >
                    <Star className={isFavorited ? "fill-current" : ""} />
                </Button>
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="data-[state=open]:bg-accent h-7 w-7"
                    >
                        <MoreHorizontal />
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent
                    className="w-56 overflow-hidden rounded-lg mt-1 p-0"
                    align="end"
                    >
                    <Sidebar collapsible="none" className="bg-transparent">
                        <SidebarContent>
                        {data.map((group, index) => (
                            <SidebarGroup key={index} className="border-b last:border-none">
                            <SidebarGroupContent className="gap-0">
                                <SidebarMenu>
                                {group.map((item, index) => (
                                    <SidebarMenuItem key={index}>
                                    <SidebarMenuButton>
                                        <item.icon /> <span>{item.label}</span>
                                    </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                            </SidebarGroup>
                        ))}
                        </SidebarContent>
                    </Sidebar>
                    </PopoverContent>
                </Popover>
                </div>
            </div>
            </header>
      </SidebarInset>
    </SidebarProvider>
  )
}
