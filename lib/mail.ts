import { render } from "@react-email/render";
import PurchaseReceiptEmail from "@/components/emails/PurchaseReceiptEmail";
import React from "react";
import { Resend } from "resend";

export async function sendEmail({
  to,
  subject,
  htmlContent,
}: {
  to: string;
  subject: string;
  htmlContent: string;
}) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not set. Email not sent.");
    return false;
  }

  try {
    const resend = new Resend(RESEND_API_KEY);

    const data = await resend.emails.send({
      from: "DNvites <noreply@dnvites.app>", // Replace with your verified sender email
      to: [to],
      subject: subject,
      html: htmlContent,
    });

    console.log("Email sent via Resend:", data.data?.id);
    return true;
  } catch (error) {
    console.error("Error sending email via Resend:", error);
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
