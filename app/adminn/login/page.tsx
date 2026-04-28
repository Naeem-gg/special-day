import { getSession } from '@/lib/auth-utils'
import { redirect } from 'next/navigation'
import { LoginForm } from './LoginForm'

export const dynamic = 'force-dynamic'

export default async function AdminLoginPage() {
  const session = await getSession()

  if (session) {
    redirect('/adminn')
  }

  return <LoginForm />
}
