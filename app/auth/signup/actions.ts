'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
  
export async function register(formData: FormData): Promise<string> {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirm-password') as string
  if (formData && password === confirmPassword) {
    const supabase = await createClient()

    const { error } = await supabase.auth.signUp({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      options: {
        emailRedirectTo: `/auth/callback`,
        data: {
          display_name: formData.get('name') as string,
        },
      },
    })
    if (error) {
      return error.message || "Registration Failed"
    }

    revalidatePath('/auth/login', 'layout')
    redirect('/auth/login')
  }
  else {
    return "Passwords do not match"
  }
}
