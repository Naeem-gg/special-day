import { Html, Head, Body, Container, Text, Section, Heading, Hr, Link, Preview, Img } from "react-email";
import * as React from "react";

interface GiftCouponEmailProps {
  planName: string;
  couponCode: string;
  senderName?: string;
}

export const GiftCouponEmail = ({
  planName = "Premium",
  couponCode = "GIFT-PREMIUM-123",
  senderName = "A friend",
}: GiftCouponEmailProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dnvites.com";

  return (
    <Html>
      <Head />
      <Preview>A Special Wedding Gift for You! 🎁</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
             <Img
              src={`${baseUrl}/logo.png`}
              width="140"
              height="auto"
              alt="DNvites"
              style={logo}
            />
          </Section>
          
          <Heading style={h1}>Someone Sent You a Gift! 🎁</Heading>
          
          <Text style={text}>
            {senderName ? <strong>{senderName}</strong> : "Someone"} has gifted you a <strong>{planName}</strong> Wedding Invitation plan on DNvites.
          </Text>
          
          <Text style={text}>
            Now you can create a stunning, animated digital wedding invitation and share it with all your guests effortlessly.
          </Text>

          <Section style={couponSection}>
            <Text style={couponLabel}>YOUR EXCLUSIVE GIFT CODE</Text>
            <Text style={couponText}>{couponCode}</Text>
          </Section>

          <Text style={ctaText}>
            Redeem this code during checkout to claim your free {planName} invitation.
          </Text>
          
          <Section style={buttonContainer}>
            <Link href={`${baseUrl}/dashboard`} style={button}>
              Create Your Invitation Now
            </Link>
          </Section>

          <Hr style={hr} />
          <Section style={footerSection}>
            <Text style={footer}>
              <strong>DNvites – Dearest Invites</strong>
              <br />
              Premium Digital Wedding Invitations
            </Text>
            <Text style={footerLink}>
              <Link href={baseUrl} style={link}>Website</Link> | <Link href="https://instagram.com/dnvites" style={link}>Instagram</Link>
            </Text>
            <Text style={footerSmall}>
              Share your joy, digitally. If you need help, simply reply to this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default GiftCouponEmail;

const main = {
  backgroundColor: "#fdf8f9",
  padding: "40px 0",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "48px",
  borderRadius: "24px",
  maxWidth: "600px",
  border: "1px solid #fce4ec",
  boxShadow: "0 10px 25px rgba(244, 63, 143, 0.05)",
};

const logoSection = {
  textAlign: "center" as const,
  marginBottom: "32px",
};

const logo = {
  margin: "0 auto",
};

const h1 = {
  color: "#1a1a1a",
  fontFamily: "'Playfair Display', serif",
  fontSize: "26px",
  fontWeight: "300",
  textAlign: "center" as const,
  margin: "0 0 32px 0",
};

const text = {
  color: "#4a4a4a",
  fontFamily: "'Inter', sans-serif",
  fontSize: "16px",
  lineHeight: "1.6",
  textAlign: "center" as const,
  marginBottom: "20px",
};

const couponSection = {
  backgroundColor: "#fdf2f8",
  padding: "32px",
  borderRadius: "16px",
  margin: "32px 0",
  border: "2px dashed #F43F8F",
  textAlign: "center" as const,
};

const couponLabel = {
  fontSize: "12px",
  fontWeight: "bold",
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
  color: "#F43F8F",
  marginBottom: "12px",
};

const couponText = {
  fontSize: "32px",
  fontWeight: "bold",
  color: "#1a1a1a",
  fontFamily: "monospace",
  margin: "0",
  letterSpacing: "0.05em",
};

const ctaText = {
  color: "#666",
  fontSize: "14px",
  textAlign: "center" as const,
  marginBottom: "24px",
};

const buttonContainer = {
  textAlign: "center" as const,
  marginBottom: "32px",
};

const button = {
  backgroundColor: "#F43F8F",
  borderRadius: "100px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "16px 32px",
  fontWeight: "600",
  boxShadow: "0 4px 15px rgba(244, 63, 143, 0.3)",
};

const hr = {
  borderColor: "#f0f0f0",
  margin: "32px 0",
};

const footerSection = {
  textAlign: "center" as const,
};

const footer = {
  color: "#1a1a1a",
  fontSize: "14px",
  lineHeight: "20px",
  marginBottom: "8px",
};

const footerLink = {
  marginBottom: "16px",
};

const link = {
  color: "#F43F8F",
  textDecoration: "none",
  fontSize: "14px",
};

const footerSmall = {
  color: "#aaa",
  fontSize: "12px",
  lineHeight: "18px",
};
