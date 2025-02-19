import { createUser } from '../lib/supabase/admin'

async function createAdminUser() {
  const { user, error } = await createUser('pm@duruper.com', 'Admin@123', {
    full_name: 'Michael Scofield',
    user_type: 'admin',
  })

  if (error) {
    console.error('Error creating admin user:', error)
    return
  }

  console.log('Admin user created successfully:', user)
}

createAdminUser()
