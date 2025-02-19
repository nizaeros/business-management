import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nbuwuosqpfzyxasdvejk.supabase.co'
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5idXd1b3NxcGZ6eXhhc2R2ZWprIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTk0MTcwOSwiZXhwIjoyMDU1NTE3NzA5fQ.wmA7-kDjTyvtYwsti1yMZjbnesAV7w2hEiF6JU-LJQI'

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

async function createAdminUser() {
  try {
    // Create auth user with admin privileges
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: 'pm@duruper.com',
      password: 'Admin@123',
      email_confirm: true,
      user_metadata: {
        full_name: 'Michael Scofield'
      }
    })

    if (authError) {
      console.error('Auth Error:', authError)
      return
    }

    console.log('Auth user created:', authUser.user.id)

    // Update user type
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ user_type: 'admin' })
      .eq('id', authUser.user.id)

    if (updateError) {
      console.error('Update Error:', updateError)
      return
    }

    console.log('Admin user created and configured successfully')
  } catch (error) {
    console.error('Error creating admin user:', error)
  }
}

createAdminUser()
