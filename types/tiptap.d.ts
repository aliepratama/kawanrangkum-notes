// types/tiptap.d.ts

import '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    comment: {
      /**
       * Adds a new comment
       */
      addComment: () => ReturnType,
      /**
       * Toggles a comment
       */
      toggleComment: () => ReturnType,
      /**
       * Removes a comment
       */
      unsetComment: () => ReturnType,
      /**
       * Gets all comments
       */
      getComments: () => { id: string, content: any[] }[],
    }
  }
}