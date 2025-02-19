import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase admin environment variables')
}

// Create a Supabase client with the service role key
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

// Helper function to create a new user
export async function createUser(email: string, password: string, userData: {
  full_name: string
  user_type: 'admin' | 'internal' | 'external'
  phone_number?: string
}) {
  try {
    // Create auth user
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true // Auto-confirm the email
    })

    if (authError) throw authError

    // Create user profile
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('users')
      .insert([
        {
          id: authUser.user.id,
          ...userData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (profileError) throw profileError

    return { user: profileData, error: null }
  } catch (error) {
    return { user: null, error }
  }
}

// Helper function to invite a new user
export async function inviteUser(email: string, userData: {
  full_name: string
  user_type: 'internal' | 'external'
  business_id?: string
  client_id?: string
  role?: string
}) {
  try {
    // Create auth user with invitation
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email)

    if (authError) throw authError

    // Create user profile
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('users')
      .insert([
        {
          id: authUser.user.id,
          email,
          ...userData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (profileError) throw profileError

    // Create necessary associations based on user type
    if (userData.user_type === 'internal' && userData.business_id) {
      const { error: businessError } = await supabaseAdmin
        .from('business_users')
        .insert([
          {
            user_id: authUser.user.id,
            business_id: userData.business_id,
            role: userData.role || 'staff'
          }
        ])

      if (businessError) throw businessError
    }

    if (userData.user_type === 'external' && userData.client_id) {
      const { error: clientError } = await supabaseAdmin
        .from('client_users')
        .insert([
          {
            user_id: authUser.user.id,
            client_id: userData.client_id
          }
        ])

      if (clientError) throw clientError
    }

    return { user: profileData, error: null }
  } catch (error) {
    return { user: null, error }
  }
}
