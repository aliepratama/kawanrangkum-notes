"use client"
import React, { useState, useContext } from "react"
import { Gem, Library, Scale } from "lucide-react"
import { EditorContext } from '@tiptap/react';
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import {
  ArrowDown,
  ArrowUp,
  Bell,
  Copy, 
  CornerUpLeft,
  CornerUpRight,
  Forward,
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
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

// --- Tiptap Imports ---
import { ThemeToggle } from "@/components/tiptap-templates/notion-like/notion-like-editor-theme-toggle"

// --- Tiptap UI ---
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button"

// --- Styles ---
import "@/components/tiptap-templates/notion-like/notion-like-editor-header.scss"

import { CollaborationUsers } from "@/components/tiptap-templates/notion-like/notion-like-editor-collaboration-users"

const data = [
  [
    {
      label: "Salin Tautan",
      icon: Link,
      action: 'openCopyLinkDialog',
    },
    {
      label: "Duplikat",
      icon: Copy,
    },
    {
      label: "Pindahkan ke",
      icon: Forward,
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
      action: 'undo',
    },
    {
      label: "Ulangi",
      icon: CornerUpRight,
      action: 'redo',
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

export function Topbar() {
  const { editor } = useContext(EditorContext);
  const [isOpen, setIsOpen] = React.useState(false)
  React.useEffect(() => {
    setIsOpen(false)
  }, [])
  const [isFavorited, setIsFavorited] = React.useState(true)
  const [isDialogCopyLinkOpen, setIsDialogCopyLinkOpen] = useState(false);

  const handleFavoriteClick = () => {
    setIsFavorited(!isFavorited)
  }

  const [isDialogShareOpen, setIsDialogShareOpen] = useState(false);
  const [isDialogFlashcardOpen, setIsDialogFlashcardOpen] = useState(false);

  const handleFlashcardDialog = () => {
    setIsDialogFlashcardOpen(true);
  }

  const handleAction = (action: string) => {
    if (!editor) return;

    if (action === 'openCopyLinkDialog') {
      setIsDialogCopyLinkOpen(true);
    } else if (action === 'undo') {
      editor.chain().focus().undo().run();
    } else if (action === 'redo') {
      editor.chain().focus().redo().run();
    }
  };

  if (!editor) {
    // Tampilkan versi sederhana atau kosong jika editor belum siap
    return <header className="flex h-[--header-height] shrink-0 items-center border-b"></header>;
  }

  return (
    <header className="sticky top-0 z-10 flex h-[--header-height] shrink-0 items-center gap-2 border-b bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[--header-height] px-4 lg:px-6">
      <div className="flex w-full items-center gap-1 px-4 py-2 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1">
                Big Data (B)
              </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1">
                <Badge variant="outline">
                  Dibagikan
                </Badge>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <Button 
            variant="ghost" size="sm" className="cursor-pointer sm:flexark:text-foreground"
          >
              Bagikan
          </Button>
          
          <Button 
            variant="ghost"  size="sm" className="hidden sm:flex cursor-pointer"
            onClick={handleFlashcardDialog}>
              Flashcard
          </Button>

          <Button variant="ghost" size="sm" className="hidden sm:flex">
              Mindmapping
          </Button>
          
          <ThemeToggle />

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
                              <SidebarMenuButton
                                onClick={() => item.action && handleAction(item.action)}
                                className="cursor-pointer"
                              >
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

        <Dialog open={isDialogCopyLinkOpen} onOpenChange={setIsDialogCopyLinkOpen}>
          <DialogTrigger asChild>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Bagikan</DialogTitle>
              <DialogDescription>
                Siapa pun yang memiliki tautan ini akan dapat melihatnya.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="link" className="sr-only">
                  Link
                </Label>
                <Input
                  id="link"
                  defaultValue="https://kawanrangkum.com/big-data-1543499cfc4280f"
                  readOnly
                />
              </div>
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isDialogFlashcardOpen} onOpenChange={setIsDialogFlashcardOpen}>
          <DialogTrigger asChild>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Buat Flashcards</DialogTitle>
              <DialogDescription>
                Flashcard dari catatan kamu — mulailah belajar dengan cepat!
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2">
              <RadioGroup defaultValue="many" className="w-full grid grid-cols-1 gap-4">
                {/* Opsi 1: Few */}
                <div className="">
                  <RadioGroupItem value="few" id="option-few" className="peer sr-only" />
                  <Label
                    htmlFor="option-few"
                    className="flex flex-col gap-2 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="flex items-center gap-2 font-semibold">
                      <Gem className="h-5 w-5 text-blue-500" />
                      Few
                    </div>
                    <p className="text-sm text-muted-foreground">Only critical concepts</p>
                  </Label>
                </div>

                {/* Opsi 2: Normal */}
                <div>
                  <RadioGroupItem value="normal" id="option-normal" className="peer sr-only" />
                  <Label
                    htmlFor="option-normal"
                    className="flex flex-col gap-2 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data--state=checked])]:border-primary"
                  >
                    <div className="flex items-center gap-2 font-semibold">
                      <Scale className="h-5 w-5 text-orange-500" />
                      Normal
                    </div>
                    <p className="text-sm text-muted-foreground">A balanced selection</p>
                  </Label>
                </div>

                {/* Opsi 3: Many */}
                <div>
                  <RadioGroupItem value="many" id="option-many" className="peer sr-only" />
                  <Label
                    htmlFor="option-many"
                    className="flex flex-col gap-2 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="flex items-center gap-2 font-semibold">
                      <Library className="h-5 w-5 text-green-500" />
                      Many
                    </div>
                    <p className="text-sm text-muted-foreground">More detailed flashcards</p>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="destructive" className="w-full bg-teal-600">
                  Buat
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  )
}
