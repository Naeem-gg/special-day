import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DNvites – Digital Wedding Invitations',
    short_name: 'DNvites',
    description: 'Create beautiful, animated digital wedding invitations in minutes.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#D4AF37',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/logo.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
