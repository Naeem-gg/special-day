import GiftClient from "./GiftClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gift an Invitation | DNvites",
  description: "Give the gift of a perfect wedding invitation. Purchase a gift code for your friends or family.",
};

export default function GiftPage() {
  return <GiftClient />;
}
