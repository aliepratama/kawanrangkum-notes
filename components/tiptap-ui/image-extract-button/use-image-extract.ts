"use client"

import * as React from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { type Editor } from "@tiptap/react"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"
import { useIsMobile } from "@/hooks/use-mobile"

// --- Lib ---
import { isExtensionAvailable, sanitizeUrl } from "@/lib/tiptap-utils"

// --- Icons ---
import { ScanTextIcon } from "@/components/tiptap-icons/scan-text-icon" // You may need to create this icon

export const IMAGE_EXTRACT_SHORTCUT_KEY = "mod+shift+e"

/**
 * Configuration for the image extract functionality
 */
export interface UseImageExtractConfig {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null
  /**
   * Whether the button should hide when extract is not available.
   * @default false
   */
  hideWhenUnavailable?: boolean
  /**
   * Callback function called after a successful image extract.
   */
  onExtracted?: (extractedText?: string) => void
  /**
   * Optional function to resolve file URLs before extracting.
   * Useful for handling relative paths or custom URL schemes.
   */
  resolveFileUrl?: (url: string) => Promise<string>
}

/**
 * Checks if image can be extracted in the current editor state
 */
export function canExtractImage(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false
  if (!isExtensionAvailable(editor, ["image"])) return false

  const { selection } = editor.state
  const { $from } = selection

  // Check if we're in an image node or have an image selected
  const node = $from.node()
  return node?.type.name === "image" || selection.node?.type.name === "image"
}

/**
 * Gets the current image data for extraction
 */
export function getCurrentImageData(editor: Editor | null): {
  src?: string
  alt?: string
  title?: string
} | null {
  if (!editor || !canExtractImage(editor)) return null

  const { selection } = editor.state

  // If we have a node selection and it's an image
  if (selection.node?.type.name === "image") {
    return {
      src: selection.node.attrs.src,
      alt: selection.node.attrs.alt,
      title: selection.node.attrs.title,
    }
  }

  // Check if cursor is inside an image node
  const { $from } = selection
  const node = $from.node()
  if (node?.type.name === "image") {
    return {
      src: node.attrs.src,
      alt: node.attrs.alt,
      title: node.attrs.title,
    }
  }

  return null
}

/**
 * Extracts text from image using the extract API
 */
async function extractTextFromImageUrl(
  url: string,
  resolveFileUrl?: (url: string) => Promise<string>
): Promise<string> {
  try {
    let resolvedUrl = url
    if (resolveFileUrl) {
      resolvedUrl = await resolveFileUrl(url)
    }

    const baseUrl = window.location.href
    const sanitizedUrl = sanitizeUrl(resolvedUrl, baseUrl)

    if (sanitizedUrl === "#") {
      throw new Error("Invalid or unsafe URL after sanitization")
    }

    // Convert URL to File object for the API
    const response = await fetch(sanitizedUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`)
    }

    const blob = await response.blob()
    const file = new File([blob], "image", { type: blob.type })

    // Call extract API
    const formData = new FormData()
    formData.append('file', file)

    const extractResponse = await fetch('/api/extract-image', {
      method: 'POST',
      body: formData,
    })

    if (!extractResponse.ok) {
      const errorData = await extractResponse.json()
      throw new Error(errorData.error || `Ekstraksi gagal: ${extractResponse.statusText}`)
    }

    const data = await extractResponse.json()
    return data.extractedText || ''
  } catch (error) {
    console.error('Failed to extract text from image:', error)
    throw error
  }
}

/**
 * Extracts text from the current image and inserts it into the editor
 */
export async function extractSelectedImage(
  editor: Editor | null,
  resolveFileUrl?: (url: string) => Promise<string>
): Promise<boolean> {
  if (!editor || !canExtractImage(editor)) return false

  const imageData = getCurrentImageData(editor)
  if (!imageData?.src) return false

  try {
    const extractedText = await extractTextFromImageUrl(imageData.src, resolveFileUrl)
    
    if (extractedText) {
      // Insert extracted text after the image
      const { selection } = editor.state
      const pos = selection.to
      
      editor
        .chain()
        .focus()
        .insertContentAt(pos, `\n\n${extractedText}\n\n`)
        .run()
      
      return true
    }
    
    return false
  } catch (error) {
    console.error('Failed to extract text from image:', error)
    return false
  }
}

/**
 * Determines if the extract button should be shown
 */
export function shouldShowExtractButton(props: {
  editor: Editor | null
  hideWhenUnavailable: boolean
}): boolean {
  const { editor, hideWhenUnavailable } = props

  if (!editor || !editor.isEditable) return false
  if (!isExtensionAvailable(editor, ["image"])) return false

  if (hideWhenUnavailable) {
    return canExtractImage(editor)
  }

  return true
}

/**
 * Custom hook that provides image extract functionality for Tiptap editor
 */
export function useImageExtract(config?: UseImageExtractConfig) {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
    onExtracted,
    resolveFileUrl,
  } = config || {}

  const { editor } = useTiptapEditor(providedEditor)
  const isMobile = useIsMobile()
  const [isVisible, setIsVisible] = React.useState<boolean>(true)
  const [isExtracting, setIsExtracting] = React.useState<boolean>(false)
  const canExtract = canExtractImage(editor)

  React.useEffect(() => {
    if (!editor) return

    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowExtractButton({ editor, hideWhenUnavailable }))
    }

    handleSelectionUpdate()

    editor.on("selectionUpdate", handleSelectionUpdate)

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate)
    }
  }, [editor, hideWhenUnavailable])

  const handleExtract = React.useCallback(async () => {
    if (!editor || isExtracting) return false

    setIsExtracting(true)
    
    try {
      const imageData = getCurrentImageData(editor)
      const success = await extractSelectedImage(editor, resolveFileUrl)
      
      if (success) {
        onExtracted?.(imageData?.alt || imageData?.title)
      }
      
      return success
    } catch (error) {
      console.error('Extract failed:', error)
      return false
    } finally {
      setIsExtracting(false)
    }
  }, [editor, onExtracted, resolveFileUrl, isExtracting])

  useHotkeys(
    IMAGE_EXTRACT_SHORTCUT_KEY,
    (event) => {
      event.preventDefault()
      handleExtract()
    },
    {
      enabled: isVisible && canExtract && !isExtracting,
      enableOnContentEditable: !isMobile,
      enableOnFormTags: true,
    }
  )

  return {
    isVisible,
    canExtract,
    isExtracting,
    handleExtract,
    label: "Ekstrak Teks dari Gambar",
    shortcutKeys: IMAGE_EXTRACT_SHORTCUT_KEY,
    Icon: ScanTextIcon,
  }
}