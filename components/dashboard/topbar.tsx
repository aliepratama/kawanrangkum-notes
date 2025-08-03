'use client'
import React, { useState, useContext, useEffect } from 'react'
import { Gem, Library, Scale, Globe, Lock, Copy as CopyIcon, Download } from 'lucide-react'
import { EditorContext } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useNoteStore, type Note } from '@/stores/note-store'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

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
  Edit,
} from 'lucide-react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

// --- Styles ---
import '@/components/tiptap-templates/notion-like/notion-like-editor-header.scss'

const data = [
  [
    {
      label: 'Salin Tautan',
      icon: Link,
      action: 'openCopyLinkDialog',
    },
    {
      label: 'Duplikat',
      icon: Copy,
      action: 'duplicateNote',
    },
    {
      label: 'Pindahkan ke Sampah',
      icon: Trash2,
      action: 'deleteNote',
    },
  ],
  [
    {
      label: 'Urungkan',
      icon: CornerUpLeft,
      action: 'undo',
    },
    {
      label: 'Ulangi',
      icon: CornerUpRight,
      action: 'redo',
    },
  ],
  [
    {
      label: 'Simpan ke PDF',
      icon: ArrowDown,
      action: 'exportToPDF',
    },
  ],
]

interface TopbarProps {
  noteId?: string
}

export function Topbar({ noteId }: TopbarProps) {
  const { editor } = useContext(EditorContext)
  const { notes, updateNoteById, toggleFavourite, createNote, deleteNoteById } = useNoteStore()
  const router = useRouter()

  const [isOpen, setIsOpen] = React.useState(false)
  const [isDialogCopyLinkOpen, setIsDialogCopyLinkOpen] = useState(false)
  const [isDialogShareOpen, setIsDialogShareOpen] = useState(false)
  const [isDialogFlashcardOpen, setIsDialogFlashcardOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingTitle, setEditingTitle] = useState('')
  const [shareType, setShareType] = useState<'public' | 'restricted'>('public')
  const [isProcessing, setIsProcessing] = useState(false)

  // Find current note
  const currentNote = noteId ? notes.find((note) => note.id === noteId) : null

  React.useEffect(() => {
    setIsOpen(false)
  }, [])

  useEffect(() => {
    if (currentNote) {
      setEditingTitle(currentNote.title)
    }
  }, [currentNote])

  const handleFavoriteClick = async () => {
    if (currentNote) {
      await toggleFavourite(currentNote.id)
    }
  }

  const handleFlashcardDialog = () => {
    setIsDialogFlashcardOpen(true)
  }

  const handleTitleClick = () => {
    if (currentNote) {
      setIsEditing(true)
    }
  }

  const handleTitleSave = async () => {
    if (
      currentNote &&
      editingTitle.trim() &&
      editingTitle !== currentNote.title
    ) {
      await updateNoteById(currentNote.id, { title: editingTitle.trim() })
    }
    setIsEditing(false)
  }

  const handleTitleCancel = () => {
    if (currentNote) {
      setEditingTitle(currentNote.title)
    }
    setIsEditing(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave()
    } else if (e.key === 'Escape') {
      handleTitleCancel()
    }
  }

  const handleCopyLink = async () => {
    if (!currentNote) return

    try {
      setIsProcessing(true)
      
      // Update note visibility based on share type
      await updateNoteById(currentNote.id, { is_public: shareType === 'public' })
      
      const link = `${window.location.origin}/notes/${currentNote.id}`
      await navigator.clipboard.writeText(link)
      
      toast.success(`Tautan ${shareType === 'public' ? 'publik' : 'terbatas'} berhasil disalin!`)
      setIsDialogCopyLinkOpen(false)
    } catch (error) {
      toast.error('Gagal menyalin tautan')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDuplicateNote = async () => {
    if (!currentNote || !editor) return

    try {
      setIsProcessing(true)
      const content = editor.getJSON()
      
      const duplicatedNote = {
        title: `${currentNote.title} (Copy)`,
        icon: currentNote.icon,
        is_public: false,
        is_favourite: false,
        content: content
      }

      await createNote(duplicatedNote)
      
      // Find the newly created note (it will be at the top of the list)
      const newNote = notes[0]
      if (newNote) {
        router.push(`/notes/${newNote.id}`)
        toast.success('Catatan berhasil diduplikat!')
      }
    } catch (error) {
      toast.error('Gagal menduplikat catatan')
    } finally {
      setIsProcessing(false)
      setIsOpen(false)
    }
  }

  const handleDeleteNote = async () => {
    if (!currentNote) return

    try {
      setIsProcessing(true)
      await deleteNoteById(currentNote.id)
      router.push('/dashboard')
      toast.success('Catatan berhasil dihapus!')
    } catch (error) {
      toast.error('Gagal menghapus catatan')
    } finally {
      setIsProcessing(false)
      setIsDeleteDialogOpen(false)
    }
  }

  const handleExportToPDF = async () => {
    if (!editor || !currentNote) return

    try {
      setIsProcessing(true)
      
      // Get the editor content as HTML
      const htmlContent = editor.getHTML()
      
      // Create a new window for printing
      const printWindow = window.open('', '_blank')
      if (!printWindow) return

      // Create the PDF content
      const pdfContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${currentNote.title}</title>
          <meta charset="utf-8">
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            h1, h2, h3, h4, h5, h6 { color: #2c3e50; margin-top: 1.5em; }
            p { margin-bottom: 1em; }
            blockquote { 
              border-left: 4px solid #3498db; 
              margin: 1em 0; 
              padding-left: 1em; 
              color: #666; 
            }
            code { 
              background: #f8f9fa; 
              padding: 2px 4px; 
              border-radius: 3px; 
              font-family: 'Monaco', 'Courier New', monospace; 
            }
            pre { 
              background: #f8f9fa; 
              padding: 1em; 
              border-radius: 5px; 
              overflow-x: auto; 
            }
            ul, ol { margin-bottom: 1em; }
            li { margin-bottom: 0.5em; }
            img { max-width: 100%; height: auto; }
            .header { 
              text-align: center; 
              border-bottom: 2px solid #3498db; 
              padding-bottom: 20px; 
              margin-bottom: 30px; 
            }
            .footer { 
              text-align: center; 
              margin-top: 30px; 
              padding-top: 20px; 
              border-top: 1px solid #eee; 
              color: #666; 
              font-size: 0.9em; 
            }
            @media print {
              body { margin: 0; padding: 15px; }
              .header { page-break-after: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${currentNote.title}</h1>
            <p>Dibuat pada: ${new Date(currentNote.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}</p>
          </div>
          <div class="content">
            ${htmlContent}
          </div>
          <div class="footer">
            <p>Diekspor dari KawanRangkum Notes</p>
          </div>
        </body>
        </html>
      `

      printWindow.document.write(pdfContent)
      printWindow.document.close()
      
      // Wait for content to load then print
      printWindow.onload = () => {
        printWindow.print()
        printWindow.close()
      }
      
      toast.success('PDF siap untuk diunduh!')
    } catch (error) {
      toast.error('Gagal mengekspor ke PDF')
    } finally {
      setIsProcessing(false)
      setIsOpen(false)
    }
  }

  const handleAction = (action: string) => {
    if (!editor) return

    switch (action) {
      case 'openCopyLinkDialog':
        setIsDialogCopyLinkOpen(true)
        break
      case 'duplicateNote':
        handleDuplicateNote()
        break
      case 'deleteNote':
        setIsDeleteDialogOpen(true)
        break
      case 'exportToPDF':
        handleExportToPDF()
        break
      case 'undo':
        editor.chain().focus().undo().run()
        break
      case 'redo':
        editor.chain().focus().redo().run()
        break
    }
  }

  if (!editor) {
    return (
      <header className="flex h-[--header-height] shrink-0 items-center border-b"></header>
    )
  }

  return (
    <>
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
                  {isEditing ? (
                    <Input
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onBlur={handleTitleSave}
                      onKeyDown={handleKeyPress}
                      className="h-auto p-0 border-none shadow-none focus-visible:ring-0 font-normal text-sm"
                      autoFocus
                    />
                  ) : (
                    <span
                      onClick={handleTitleClick}
                      className="cursor-pointer hover:bg-muted px-1 py-0.5 rounded"
                    >
                      {currentNote?.title || 'Untitled'}
                    </span>
                  )}
                </BreadcrumbPage>
              </BreadcrumbItem>
              {currentNote?.is_public && (
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">
                    <Badge variant="outline">Dibagikan</Badge>
                  </BreadcrumbPage>
                </BreadcrumbItem>
              )}
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="cursor-pointer sm:flex"
              onClick={() => setIsDialogCopyLinkOpen(true)}
            >
              Bagikan
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex cursor-pointer"
              onClick={handleFlashcardDialog}
            >
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
              className={cn(
                'h-7 w-7',
                currentNote?.is_favourite
                  ? 'text-yellow-500 hover:text-yellow-500'
                  : ''
              )}
            >
              <Star className={currentNote?.is_favourite ? 'fill-current' : ''} />
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
                      <SidebarGroup
                        key={index}
                        className="border-b last:border-none"
                      >
                        <SidebarGroupContent className="gap-0">
                          <SidebarMenu>
                            {group.map((item, index) => (
                              <SidebarMenuItem key={index}>
                                <SidebarMenuButton
                                  onClick={() =>
                                    item.action && handleAction(item.action)
                                  }
                                  className="cursor-pointer"
                                  disabled={isProcessing}
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
        </div>
      </header>

      {/* Copy Link Dialog */}
      <Dialog
        open={isDialogCopyLinkOpen}
        onOpenChange={setIsDialogCopyLinkOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bagikan Catatan</DialogTitle>
            <DialogDescription>
              Pilih jenis akses untuk catatan Anda
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <RadioGroup
              value={shareType}
              onValueChange={(value) => setShareType(value as 'public' | 'restricted')}
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <RadioGroupItem value="public" id="public" />
                  <div className="flex items-center space-x-3 flex-1">
                    <Globe className="h-5 w-5 text-blue-500" />
                    <div>
                      <Label htmlFor="public" className="font-medium">Publik</Label>
                      <p className="text-sm text-muted-foreground">Siapa saja dapat mengakses dengan tautan</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <RadioGroupItem value="restricted" id="restricted" />
                  <div className="flex items-center space-x-3 flex-1">
                    <Lock className="h-5 w-5 text-orange-500" />
                    <div>
                      <Label htmlFor="restricted" className="font-medium">Terbatas</Label>
                      <p className="text-sm text-muted-foreground">Hanya Anda yang dapat mengakses</p>
                    </div>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button 
              onClick={handleCopyLink}
              disabled={isProcessing}
              className="gap-2"
            >
              <CopyIcon className="h-4 w-4" />
              {isProcessing ? 'Menyalin...' : 'Salin Tautan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Catatan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus catatan "{currentNote?.title}"? 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteNote}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700"
            >
              {isProcessing ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Flashcard Dialog */}
      <Dialog
        open={isDialogFlashcardOpen}
        onOpenChange={setIsDialogFlashcardOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Buat Flashcards</DialogTitle>
            <DialogDescription>
              Flashcard dari catatan kamu — mulailah belajar dengan cepat!
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <RadioGroup
              defaultValue="many"
              className="w-full grid grid-cols-1 gap-4"
            >
              <div className="">
                <RadioGroupItem
                  value="few"
                  id="option-few"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="option-few"
                  className="flex flex-col gap-2 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="flex items-center gap-2 font-semibold">
                    <Gem className="h-5 w-5 text-blue-500" />
                    Few
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Only critical concepts
                  </p>
                </Label>
              </div>

              <div>
                <RadioGroupItem
                  value="normal"
                  id="option-normal"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="option-normal"
                  className="flex flex-col gap-2 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data--state=checked])]:border-primary"
                >
                  <div className="flex items-center gap-2 font-semibold">
                    <Scale className="h-5 w-5 text-orange-500" />
                    Normal
                  </div>
                  <p className="text-sm text-muted-foreground">
                    A balanced selection
                  </p>
                </Label>
              </div>

              <div>
                <RadioGroupItem
                  value="many"
                  id="option-many"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="option-many"
                  className="flex flex-col gap-2 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="flex items-center gap-2 font-semibold">
                    <Library className="h-5 w-5 text-green-500" />
                    Many
                  </div>
                  <p className="text-sm text-muted-foreground">
                    More detailed flashcards
                  </p>
                </Label>
              </div>
            </RadioGroup>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                type="button"
                variant="destructive"
                className="w-full bg-teal-600"
              >
                Buat
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
