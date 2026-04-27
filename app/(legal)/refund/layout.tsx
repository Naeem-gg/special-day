import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Read our refund policy for DNvites digital wedding invitations.',
}

export default function RefundLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
