import { Html, Head, Body, Container, Text, Section, Heading, Hr, Preview } from "react-email";
import * as React from "react";

interface FeedbackNotificationEmailProps {
  name: string;
  email: string;
  type: string;
  subject: string;
  message: string;
  feedbackId: number;
}

const TYPE_LABELS: Record<string, string> = {
  feedback: "💬 General Feedback",
  complaint: "🚨 Complaint",
  grievance: "⚠️ Grievance",
  feature_request: "✨ Feature Request",
};

export default function FeedbackNotificationEmail({
  name = "User",
  email = "user@example.com",
  type = "feedback",
  subject = "No subject",
  message = "",
  feedbackId = 0,
}: FeedbackNotificationEmailProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dnvites.com";

  return (
    <Html>
      <Head />
      <Preview>New {type} from {name} — DNvites</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>DNvites</Heading>
            <Text style={tagline}>New {TYPE_LABELS[type] || type} Received</Text>
          </Section>

          <Section style={content}>
            <Text style={label}>From</Text>
            <Text style={value}>{name} &lt;{email}&gt;</Text>

            <Text style={label}>Type</Text>
            <Text style={value}>{TYPE_LABELS[type] || type}</Text>

            <Text style={label}>Subject</Text>
            <Text style={value}>{subject}</Text>

            <Hr style={divider} />

            <Text style={label}>Message</Text>
            <Text style={messageBox}>{message}</Text>

            <Hr style={divider} />

            <Section style={ctaSection}>
              <Text style={ctaText}>
                Reply to this directly from the Admin Panel:
              </Text>
              <a href={`${baseUrl}/adminn?section=feedback&id=${feedbackId}`} style={ctaButton}>
                Open in Admin Panel →
              </a>
            </Section>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>DNvites Admin Notification • dnvites@duck.com</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: "#f9f5f7", fontFamily: "'Playfair Display', Georgia, serif", padding: "40px 0" };
const container = { maxWidth: "600px", margin: "0 auto", backgroundColor: "#ffffff", borderRadius: "24px", overflow: "hidden", boxShadow: "0 4px 40px rgba(244,63,143,0.08)" };
const header = { background: "linear-gradient(135deg, #F43F8F, #c73272)", padding: "40px 48px" };
const logo = { color: "#ffffff", fontSize: "28px", fontWeight: "700", margin: "0 0 4px 0", letterSpacing: "0.05em" };
const tagline = { color: "rgba(255,255,255,0.8)", fontSize: "14px", margin: "0", letterSpacing: "0.1em", textTransform: "uppercase" as const };
const content = { padding: "40px 48px" };
const label = { color: "#999", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" as const, letterSpacing: "0.15em", margin: "0 0 4px 0" };
const value = { color: "#1a1a1a", fontSize: "15px", margin: "0 0 20px 0", fontFamily: "sans-serif" };
const messageBox = { color: "#333", fontSize: "15px", lineHeight: "1.7", backgroundColor: "#fdf8fa", border: "1px solid #f0d6e4", borderRadius: "12px", padding: "20px", fontFamily: "sans-serif", margin: "0" };
const divider = { border: "none", borderTop: "1px solid #f0d6e4", margin: "28px 0" };
const ctaSection = { textAlign: "center" as const };
const ctaText = { color: "#666", fontSize: "13px", marginBottom: "16px", fontFamily: "sans-serif" };
const ctaButton = { display: "inline-block", backgroundColor: "#F43F8F", color: "#ffffff", fontFamily: "sans-serif", fontWeight: "700", fontSize: "14px", padding: "14px 32px", borderRadius: "100px", textDecoration: "none" };
const footer = { padding: "20px 48px", backgroundColor: "#fdf8fa", borderTop: "1px solid #f0d6e4" };
const footerText = { color: "#ccc", fontSize: "11px", textAlign: "center" as const, margin: "0", fontFamily: "sans-serif" };
