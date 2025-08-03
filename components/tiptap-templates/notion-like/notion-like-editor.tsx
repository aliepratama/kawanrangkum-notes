'use client'

import * as React from 'react'
import { EditorContent, EditorContext, useEditor } from '@tiptap/react'
import type { Doc as YDoc } from 'yjs'
import type { TiptapCollabProvider } from '@tiptap-pro/provider'
import { JSONContent } from '@tiptap/react'
import { Topbar } from '@/components/dashboard/topbar'
import { useNoteStore } from '@/stores/note-store'

// --- Tiptap Core Extensions ---
import { StarterKit } from '@tiptap/starter-kit'
import { Image } from '@tiptap/extension-image'
import { TaskList, TaskItem } from '@tiptap/extension-list'
import { Color, TextStyle } from '@tiptap/extension-text-style'
import { Placeholder, Selection } from '@tiptap/extensions'
import { Collaboration } from '@tiptap/extension-collaboration'
import { CollaborationCaret } from '@tiptap/extension-collaboration-caret'
import { Typography } from '@tiptap/extension-typography'
import { Highlight } from '@tiptap/extension-highlight'
import { Superscript } from '@tiptap/extension-superscript'
import { Subscript } from '@tiptap/extension-subscript'
import { TextAlign } from '@tiptap/extension-text-align'
import { Mathematics } from '@tiptap/extension-mathematics'
import { UniqueID } from '@tiptap/extension-unique-id'
import { Emoji, gitHubEmojis } from '@tiptap/extension-emoji'

// --- Hooks ---
import { useUiEditorState } from '@/hooks/use-ui-editor-state'

// --- Custom Extensions ---
import { HorizontalRule } from '@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension'
import { UiState } from '@/components/tiptap-extension/ui-state-extension'

// --- Tiptap Node ---
import { ImageUploadNode } from '@/components/tiptap-node/image-upload-node/image-upload-node-extension'
import '@/components/tiptap-node/blockquote-node/blockquote-node.scss'
import '@/components/tiptap-node/code-block-node/code-block-node.scss'
import '@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss'
import '@/components/tiptap-node/list-node/list-node.scss'
import '@/components/tiptap-node/image-node/image-node.scss'
import '@/components/tiptap-node/heading-node/heading-node.scss'
import '@/components/tiptap-node/paragraph-node/paragraph-node.scss'

// --- Tiptap UI ---
import { EmojiDropdownMenu } from '@/components/tiptap-ui/emoji-dropdown-menu'
import { SlashDropdownMenu } from '@/components/tiptap-ui/slash-dropdown-menu'
import { DragContextMenu } from '@/components/tiptap-ui/drag-context-menu'

// --- Contexts ---
import { AppProvider } from '@/contexts/app-context'
import { UserProvider, useUser } from '@/contexts/user-context'
import { CollabProvider, useCollab } from '@/contexts/collab-context'
import { AiProvider, useAi } from '@/contexts/ai-context'

// --- Lib ---
import {
  handleImageUpload as libHandleImageUpload,
  MAX_FILE_SIZE,
} from '@/lib/tiptap-utils'

// --- Styles ---
import '@/components/tiptap-templates/notion-like/notion-like-editor.scss'

// --- Content ---
import { NotionEditorHeader } from '@/components/tiptap-templates/notion-like/notion-like-editor-header'
import { MobileToolbar } from '@/components/tiptap-templates/notion-like/notion-like-editor-mobile-toolbar'
import { NotionToolbarFloating } from '@/components/tiptap-templates/notion-like/notion-like-editor-toolbar-floating'

export interface NotionEditorProps {
  room: string
  placeholder?: string
  defaultValue?: JSONContent | string
  noteId?: string
}

export interface EditorProviderProps {
  provider: TiptapCollabProvider
  ydoc: YDoc
  placeholder?: string
  aiToken: string | null
  defaultValue?: JSONContent | string
  noteId?: string
}

/**
 * Loading spinner component shown while connecting to the notion server
 */
export function LoadingSpinner({
  text = 'Menghubungkan...',
}: {
  text?: string
}) {
  return (
    <div className="spinner-container">
      <div className="spinner-content">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <div className="spinner-loading-text">{text}</div>
      </div>
    </div>
  )
}

/**
 * EditorContent component that renders the actual editor
 */
export function EditorContentArea() {
  const { editor } = React.useContext(EditorContext)!

  if (!editor) {
    return null
  }

  return (
    <EditorContent
      editor={editor}
      role="presentation"
      className="notion-like-editor-content"
      style={{
        cursor: editor.view.dragging ? 'grabbing' : 'auto',
      }}
    >
      <MobileToolbar />

      <DragContextMenu />
      <EmojiDropdownMenu />
      <SlashDropdownMenu />
      <NotionToolbarFloating />
    </EditorContent>
  )
}

/**
 * Component that creates and provides the editor instance
 */
export function EditorProvider(props: EditorProviderProps) {
  const {
    provider,
    ydoc,
    placeholder = 'Mulai menulis...',
    aiToken,
    defaultValue,
    noteId,
  } = props
  const { updateNoteContent } = useNoteStore()
  const { user } = useUser()

  // Debounced save function
  const debouncedSave = React.useCallback(
    React.useMemo(() => {
      let timeoutId: NodeJS.Timeout
      return (content: any) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          if (noteId) {
            updateNoteContent(noteId, content)
          }
        }, 2000) // Save after 2 seconds of inactivity
      }
    }, [noteId, updateNoteContent]),
    [noteId, updateNoteContent]
  )

  // Image upload function using your API
  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Upload gagal: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.url) {
        throw new Error('No URL returned from upload');
      }
      
      return data.url;
    } catch (error) {
      console.error("Gagal mengupload gambar:", error);
      throw error;
    }
  }

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        class: 'notion-like-editor',
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getJSON()
      debouncedSave(content)
    },
    extensions: [
      StarterKit.configure({
        undoRedo: false,
        horizontalRule: false,
        dropcursor: {
          width: 2,
        },
        link: { openOnClick: false },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Collaboration.configure({ document: ydoc }),
      CollaborationCaret.configure({
        provider,
        user: { id: user.id, name: user.name, color: user.color },
      }),
      Placeholder.configure({
        placeholder,
        emptyNodeClass: 'is-empty with-slash',
      }),
      Emoji.configure({
        emojis: gitHubEmojis.filter(
          (emoji) => !emoji.name.includes('regional')
        ),
        forceFallbackImages: true,
      }),
      Mathematics,
      Superscript,
      Subscript,
      Color,
      TextStyle,
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Selection,
      Image,
      ImageUploadNode.configure({
        accept: 'image/*',
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error('Upload gagal:', error),
      }),
      UniqueID,
      Typography,
      UiState,
    ],
  })

  React.useEffect(() => {
    if (editor && defaultValue && editor.isEmpty) {
      editor.commands.setContent(defaultValue, false)
    }
  }, [editor, defaultValue])

  React.useEffect(() => {
    return () => {
      if (noteId && editor) {
        const content = editor.getJSON()
        updateNoteContent(noteId, content)
      }
    }
  }, [noteId, editor, updateNoteContent])

  if (!editor) {
    return <LoadingSpinner />
  }

  return (
    <div className="notion-like-editor-wrapper">
      <EditorContext.Provider value={{ editor }}>
        <Topbar noteId={noteId} />
        <EditorContentArea />
      </EditorContext.Provider>
    </div>
  )
}

/**
 * Full editor with all necessary providers, ready to use with just a room ID
 */
export function NotionEditor({
  room,
  placeholder = 'Mulai menulis...',
  defaultValue,
  noteId,
}: NotionEditorProps) {
  return (
    <UserProvider>
      <AppProvider>
        <CollabProvider room={room}>
          <AiProvider>
            <NotionEditorContent
              placeholder={placeholder}
              defaultValue={defaultValue}
              noteId={noteId}
            />
          </AiProvider>
        </CollabProvider>
      </AppProvider>
    </UserProvider>
  )
}

/**
 * Internal component that handles the editor loading state
 */
export function NotionEditorContent({
  placeholder,
  defaultValue,
  noteId,
}: {
  placeholder?: string
  defaultValue?: JSONContent | string
  noteId?: string
}) {
  const { provider, ydoc } = useCollab()
  const { aiToken } = useAi()

  if (!provider || !aiToken) {
    return <LoadingSpinner />
  }

  return (
    <EditorProvider
      provider={provider}
      ydoc={ydoc}
      placeholder={placeholder}
      aiToken={aiToken}
      defaultValue={defaultValue}
      noteId={noteId}
    />
  )
}
