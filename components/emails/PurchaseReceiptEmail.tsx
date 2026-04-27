import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Section,
  Heading,
  Hr,
  Link,
  Preview,
  Img,
} from 'react-email'
import * as React from 'react'

interface PurchaseReceiptEmailProps {
  brideName: string
  groomName: string
  planName: string
  amountPaid: number
  orderId: string
  invitationLink: string
}

export default function PurchaseReceiptEmail({
  brideName = 'Bride',
  groomName = 'Groom',
  planName = 'Premium',
  amountPaid = 0,
  orderId = 'DNV123456',
  invitationLink = 'https://dnvites.com',
}: PurchaseReceiptEmailProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://dnvites.com'

  return (
    <Html>
      <Head />
      <Preview>Your DNvites Invitation is Ready! 🎉</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Img src={`${baseUrl}/logo.png`} width="140" height="auto" alt="DNvites" style={logo} />
          </Section>

          <Heading style={h1}>Purchase Confirmation</Heading>

          <Text style={text}>
            Dear{' '}
            <strong>
              {brideName} & {groomName}
            </strong>
            ,
          </Text>
          <Text style={text}>
            Congratulations! Your payment for the <strong>{planName}</strong> plan has been
            successfully received. We are honored to be a part of your wedding journey.
          </Text>

          <Section style={receiptSection}>
            <Text style={receiptHeading}>Order Summary</Text>
            <Hr style={receiptHr} />
            <div style={receiptRow}>
              <Text style={receiptLabel}>Order ID</Text>
              <Text style={receiptValue}>{orderId}</Text>
            </div>
            <div style={receiptRow}>
              <Text style={receiptLabel}>Amount Paid</Text>
              <Text style={receiptValue}>₹{amountPaid}</Text>
            </div>
            <div style={receiptRow}>
              <Text style={receiptLabel}>Status</Text>
              <Text style={{ ...receiptValue, color: '#10b981' }}>Success</Text>
            </div>
          </Section>

          <Text style={ctaText}>
            Your beautiful digital invitation is now live and ready to be shared with your loved
            ones.
          </Text>

          <Section style={buttonContainer}>
            <Link href={invitationLink} style={button}>
              View Your Invitation
            </Link>
          </Section>

          <Text style={secondaryText}>
            You can share this link via WhatsApp, Instagram, or Email. Your guests can RSVP directly
            through the page.
          </Text>

          <Hr style={hr} />
          <Section style={footerSection}>
            <Text style={footer}>
              <strong>DNvites – Dearest Invites</strong>
              <br />
              Premium Digital Wedding Invitations
            </Text>
            <Text style={footerLink}>
              <Link href={baseUrl} style={link}>
                Website
              </Link>{' '}
              |{' '}
              <Link href="https://instagram.com/dnvites" style={link}>
                Instagram
              </Link>
            </Text>
            <Text style={footerSmall}>
              If you have any questions, simply reply to this email. Our concierge team is here to
              help.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#fdf8f9',
  padding: '40px 0',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '48px',
  borderRadius: '24px',
  maxWidth: '600px',
  border: '1px solid #fce4ec',
  boxShadow: '0 10px 25px rgba(244, 63, 143, 0.05)',
}

const logoSection = {
  textAlign: 'center' as const,
  marginBottom: '32px',
}

const logo = {
  margin: '0 auto',
}

const h1 = {
  color: '#1a1a1a',
  fontFamily: "'Playfair Display', serif",
  fontSize: '28px',
  fontWeight: '300',
  textAlign: 'center' as const,
  margin: '0 0 40px 0',
}

const text = {
  color: '#4a4a4a',
  fontFamily: "'Inter', sans-serif",
  fontSize: '16px',
  lineHeight: '1.6',
  marginBottom: '20px',
}

const receiptSection = {
  backgroundColor: '#fafafa',
  padding: '24px',
  borderRadius: '16px',
  margin: '32px 0',
  border: '1px solid #f0f0f0',
}

const receiptHeading = {
  fontSize: '12px',
  fontWeight: 'bold',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  color: '#888',
  marginBottom: '12px',
}

const receiptHr = {
  borderColor: '#eee',
  margin: '12px 0',
}

const receiptRow = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '8px',
}

const receiptLabel = {
  fontSize: '14px',
  color: '#666',
  margin: '0',
}

const receiptValue = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#1a1a1a',
  margin: '0',
}

const ctaText = {
  color: '#4a4a4a',
  fontSize: '16px',
  textAlign: 'center' as const,
  marginBottom: '24px',
}

const buttonContainer = {
  textAlign: 'center' as const,
  marginBottom: '32px',
}

const button = {
  backgroundColor: '#F43F8F',
  borderRadius: '100px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
  fontWeight: '600',
  boxShadow: '0 4px 15px rgba(244, 63, 143, 0.3)',
}

const secondaryText = {
  color: '#888',
  fontSize: '14px',
  textAlign: 'center' as const,
  marginBottom: '40px',
}

const hr = {
  borderColor: '#f0f0f0',
  margin: '32px 0',
}

const footerSection = {
  textAlign: 'center' as const,
}

const footer = {
  color: '#1a1a1a',
  fontSize: '14px',
  lineHeight: '20px',
  marginBottom: '8px',
}

const footerLink = {
  marginBottom: '16px',
}

const link = {
  color: '#F43F8F',
  textDecoration: 'none',
  fontSize: '14px',
}

const footerSmall = {
  color: '#aaa',
  fontSize: '12px',
  lineHeight: '18px',
}
