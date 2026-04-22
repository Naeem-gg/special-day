import { Html, Head, Body, Container, Text, Section, Heading, Hr } from "@react-email/components";
import * as React from "react";

interface PurchaseReceiptEmailProps {
  brideName: string;
  groomName: string;
  planName: string;
  amountPaid: number;
  orderId: string;
  invitationLink: string;
}

export default function PurchaseReceiptEmail({
  brideName = "Bride",
  groomName = "Groom",
  planName = "Premium",
  amountPaid = 0,
  orderId = "order_abc",
  invitationLink = "https://dnvites.com",
}: PurchaseReceiptEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Thank You for Your Purchase! 🎉</Heading>
          <Text style={text}>
            Hello {brideName} & {groomName},
          </Text>
          <Text style={text}>
            We're thrilled to be part of your special day! Your payment for the <strong>{planName}</strong> plan has been successfully processed.
          </Text>

          <Section style={receiptSection}>
            <Text style={receiptText}><strong>Order ID:</strong> {orderId}</Text>
            <Text style={receiptText}><strong>Amount Paid:</strong> ₹{amountPaid}</Text>
          </Section>

          <Text style={text}>
            Your digital invitation is now live. You can view and share it using the link below:
          </Text>
          <Text style={linkContainer}>
            <a href={invitationLink} style={button}>
              View Your Invitation
            </a>
          </Text>

          <Hr style={hr} />
          <Text style={footer}>
            If you have any questions or need further assistance, feel free to reply to this email.
            <br />
            - The DNvites Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  borderRadius: "12px",
  maxWidth: "600px",
  border: "1px solid #eee",
};

const h1 = {
  color: "#F43F8F",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "24px",
};

const receiptSection = {
  backgroundColor: "#f9f9f9",
  padding: "20px",
  borderRadius: "8px",
  margin: "20px 0",
};

const receiptText = {
  color: "#333",
  fontSize: "14px",
  margin: "4px 0",
};

const linkContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const button = {
  backgroundColor: "#F43F8F",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
  fontWeight: "bold",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};
