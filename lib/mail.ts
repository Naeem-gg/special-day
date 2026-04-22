import { render } from "@react-email/render";
import PurchaseReceiptEmail from "@/components/emails/PurchaseReceiptEmail";
import React from "react";
import nodemailer from "nodemailer";

export async function sendEmail({
  to,
  subject,
  htmlContent,
}: {
  to: string;
  subject: string;
  htmlContent: string;
}) {
  const SMTP_USER = process.env.BREVO_SMTP_USER;
  const SMTP_PASS = process.env.BREVO_SMTP_PASS;

  if (!SMTP_USER || !SMTP_PASS) {
    console.warn("BREVO_SMTP_USER or BREVO_SMTP_PASS is not set. Email not sent.");
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: '"DNvites" <noreply@dnvites.com>', // Replace with your verified sender email
      to: to,
      subject: subject,
      html: htmlContent,
    });

    console.log("Email sent via Brevo (Nodemailer): %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

export async function sendPurchaseReceipt({
  to,
  brideName,
  groomName,
  planName,
  amountPaid,
  orderId,
  invitationLink,
}: {
  to: string;
  brideName: string;
  groomName: string;
  planName: string;
  amountPaid: number;
  orderId: string;
  invitationLink: string;
}) {
  // @ts-ignore
  const htmlContent = await render(
    React.createElement(PurchaseReceiptEmail, {
      brideName,
      groomName,
      planName,
      amountPaid,
      orderId,
      invitationLink,
    })
  );

  return sendEmail({
    to,
    subject: "Your DNvites Invitation is Ready! 🎉",
    htmlContent,
  });
}
