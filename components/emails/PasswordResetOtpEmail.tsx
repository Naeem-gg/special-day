import { Html, Head, Body, Container, Text, Section, Heading, Hr, Preview } from 'react-email'
import * as React from 'react'

interface PasswordResetOtpEmailProps {
  name?: string
  otpCode: string
}

export default function PasswordResetOtpEmail({
  name = 'User',
  otpCode = '000000',
}: PasswordResetOtpEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your DNvites password reset code is {otpCode}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>DNvites</Heading>
            <Text style={tagline}>Password Reset Request</Text>
          </Section>

          <Section style={content}>
            <Text style={greeting}>Hello {name},</Text>
            <Text style={paragraph}>
              We received a request to reset the password for your DNvites account. Use the verification code below to set a new password. This code will expire in 10 minutes.
            </Text>

            <Section style={otpSection}>
              <Text style={otpLabel}>Verification Code</Text>
              <Text style={otpValue}>{otpCode}</Text>
            </Section>

            <Text style={warningText}>
              If you did not request a password reset, please ignore this email. Note that you can request a password reset only once per day.
            </Text>

            <Hr style={divider} />
          </Section>

          <Section style={footer}>
            <Text style={footerText}>DNvites Support • noreply@dnvites.app</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f9f5f7',
  fontFamily: "'Playfair Display', Georgia, serif",
  padding: '40px 0',
}
const container = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
  borderRadius: '24px',
  overflow: 'hidden',
  boxShadow: '0 4px 40px rgba(244,63,143,0.08)',
}
const header = { background: 'linear-gradient(135deg, #F43F8F, #c73272)', padding: '40px 48px' }
const logo = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0 0 4px 0',
  letterSpacing: '0.05em',
}
const tagline = {
  color: 'rgba(255,255,255,0.8)',
  fontSize: '14px',
  margin: '0',
  letterSpacing: '0.1em',
  textTransform: 'uppercase' as const,
}
const content = { padding: '40px 48px' }
const greeting = {
  color: '#1a1a1a',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 16px 0',
  fontFamily: 'sans-serif',
}
const paragraph = {
  color: '#444',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 24px 0',
  fontFamily: 'sans-serif',
}
const otpSection = {
  textAlign: 'center' as const,
  backgroundColor: '#fdf8fa',
  border: '1px dashed #f0d6e4',
  borderRadius: '16px',
  padding: '24px',
  margin: '0 0 24px 0',
}
const otpLabel = {
  color: '#999',
  fontSize: '11px',
  fontWeight: '700',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.15em',
  margin: '0 0 8px 0',
  fontFamily: 'sans-serif',
}
const otpValue = {
  color: '#F43F8F',
  fontSize: '36px',
  fontWeight: '800',
  letterSpacing: '0.2em',
  margin: '0',
  fontFamily: 'monospace',
}
const warningText = {
  color: '#777',
  fontSize: '13px',
  lineHeight: '1.5',
  margin: '0 0 20px 0',
  fontFamily: 'sans-serif',
}
const divider = { border: 'none', borderTop: '1px solid #f0d6e4', margin: '24px 0' }
const footer = { padding: '20px 48px', backgroundColor: '#fdf8fa', borderTop: '1px solid #f0d6e4' }
const footerText = {
  color: '#999',
  fontSize: '11px',
  textAlign: 'center' as const,
  margin: '0',
  fontFamily: 'sans-serif',
}
