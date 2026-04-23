import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preview Your Wedding Invitation",
  description: "Try any of our stunning wedding invitation templates with your own names. Live preview in just seconds!",
};

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
