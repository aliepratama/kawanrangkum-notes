"use client"

import * as React from "react"
import { type Editor } from "@tiptap/react"

// --- Hooks ---
import { useImageExtract, type UseImageExtractConfig } from "./use-image-extract"

// --- UI ---
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

// --- Icons ---
import { ScanTextIcon } from "@/components/tiptap-icons/scan-text-icon"

export interface ImageExtractButtonProps extends UseImageExtractConfig {
  /**
   * The variant of the button.
   * @default "ghost"
   */
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"
  /**
   * The size of the button.
   * @default "sm"
   */
  size?: "default" | "sm" | "lg" | "icon"
  /**
   * Additional CSS classes for the button.
   */
  className?: string
}

/**
 * A button component for extracting text from images in the Tiptap editor.
 */
export function ImageExtractButton({
  editor,
  variant = "ghost",
  size = "sm",
  className,
  ...config
}: ImageExtractButtonProps) {
  const {
    isVisible,
    canExtract,
    isExtracting,
    handleExtract,
    label,
    shortcutKeys,
    Icon,
  } = useImageExtract({ editor, ...config })

  if (!isVisible) return null

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          onClick={handleExtract}
          disabled={!canExtract || isExtracting}
          aria-label={label}
        >
          <Icon className="h-4 w-4" />
          {isExtracting && <span className="ml-2">Mengekstrak...</span>}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex flex-col items-center">
          <span>{label}</span>
          <span className="text-xs text-muted-foreground">{shortcutKeys}</span>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}