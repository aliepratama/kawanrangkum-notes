import { create } from 'zustand'
import { createClient } from '@/utils/supabase/client'

export type Note = {
  id: string
  title: string
  icon: string
  created_at: string
  is_public: boolean
  is_favourite: boolean
  owner_id: string
}

export type NoteFilter = 'all' | 'public' | 'private' | 'favourite'

export type NoteState = {
  notes: Note[]
  loading: boolean
  error: string | null
}

export type NoteActions = {
  setNotes: (notes: Note[]) => void
  addNote: (note: Note) => void
  updateNote: (id: string, updates: Partial<Note>) => void
  deleteNote: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  fetchNotes: () => Promise<void>
  createNote: (noteData: Omit<Note, 'id' | 'created_at' | 'owner_id'>) => Promise<void>
  updateNoteById: (id: string, updates: Partial<Note>) => Promise<void>
  deleteNoteById: (id: string) => Promise<void>
  getFilteredNotes: (filter: NoteFilter) => Note[]
  toggleFavourite: (id: string) => Promise<void>
}

export type NoteStore = NoteState & NoteActions

export const useNoteStore = create<NoteStore>((set, get) => ({
  // State
  notes: [],
  loading: false,
  error: null,

  // Actions
  setNotes: (notes) => set({ notes }),
  
  addNote: (note) => set((state) => ({ 
    notes: [note, ...state.notes] 
  })),
  
  updateNote: (id, updates) => set((state) => ({
    notes: state.notes.map(note => 
      note.id === id ? { ...note, ...updates } : note
    )
  })),
  
  deleteNote: (id) => set((state) => ({
    notes: state.notes.filter(note => note.id !== id)
  })),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  fetchNotes: async () => {
    set({ loading: true, error: null })
    try {
      const supabase = createClient()
      
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        throw new Error('Unauthorized')
      }

      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error('Failed to fetch notes')
      }
      
      set({ notes: data || [], loading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        loading: false 
      })
    }
  },

  createNote: async (noteData) => {
    set({ loading: true, error: null })
    try {
      const supabase = createClient()
      
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        throw new Error('Unauthorized')
      }

      const { data, error } = await supabase
        .from('notes')
        .insert([{
          ...noteData,
          owner_id: user.id
        }])
        .select()
        .single()

      if (error) {
        throw new Error('Failed to create note')
      }

      if (data) {
        get().addNote(data)
      }
      
      set({ loading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        loading: false 
      })
    }
  },

  updateNoteById: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('notes')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error('Failed to update note')
      }

      if (data) {
        get().updateNote(id, data)
      }
      
      set({ loading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        loading: false 
      })
    }
  },

  deleteNoteById: async (id) => {
    set({ loading: true, error: null })
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)

      if (error) {
        throw new Error('Failed to delete note')
      }

      get().deleteNote(id)
      set({ loading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        loading: false 
      })
    }
  },

  getFilteredNotes: (filter: NoteFilter) => {
    const notes = get().notes
    switch (filter) {
      case 'public':
        return notes.filter(note => note.is_public)
      case 'private':
        return notes.filter(note => !note.is_public)
      case 'favourite':
        return notes.filter(note => note.is_favourite)
      case 'all':
      default:
        return notes
    }
  },

  toggleFavourite: async (id: string) => {
    const note = get().notes.find(n => n.id === id)
    if (!note) return

    const updates = { is_favourite: !note.is_favourite }
    console.log('Toggling favourite for note:', note.id, 'to', updates.is_favourite)
    await get().updateNoteById(id, updates)
    const notes = get().notes.find(n => n.id === id)
    console.log('Toggling favourite for note:', notes)
  },
}))
