import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface GiftCouponEmailProps {
  planName: string;
  couponCode: string;
  senderName?: string;
}

export const GiftCouponEmail = ({
  planName,
  couponCode,
  senderName,
}: GiftCouponEmailProps) => (
  <Html>
    <Head />
    <Preview>Your DNvites Gift is Here! 🎁</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Someone Sent You a Gift! 🎁</Heading>
        <Text style={text}>
          {senderName ? `${senderName} has` : "Someone has"} gifted you a <strong>{planName.toUpperCase()}</strong> Wedding Invitation plan on DNvites.
        </Text>
        <Section style={couponSection}>
          <Text style={couponLabel}>YOUR GIFT CODE</Text>
          <Text style={couponText}>{couponCode}</Text>
        </Section>
        <Text style={text}>
          Use this code during checkout to create your beautiful digital invitation for free.
        </Text>
        <Section style={btnContainer}>
          <Link style={button} href="https://dnvites.com/dashboard">
            Create Your Invitation Now
          </Link>
        </Section>
        <Hr style={hr} />
        <Text style={footer}>
          DNvites — Share your joy, digitally.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default GiftCouponEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "580px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  textAlign: "center" as const,
};

const couponSection = {
  background: "#fdf2f8",
  borderRadius: "12px",
  padding: "24px",
  margin: "24px 0",
  textAlign: "center" as const,
  border: "1px dashed #f43f8f",
};

const couponLabel = {
  color: "#f43f8f",
  fontSize: "12px",
  fontWeight: "bold",
  letterSpacing: "1px",
  margin: "0 0 8px",
};

const couponText = {
  color: "#333",
  fontSize: "32px",
  fontWeight: "bold",
  margin: "0",
  fontFamily: "monospace",
};

const btnContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#f43f8f",
  borderRadius: "32px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 30px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  textAlign: "center" as const,
};
