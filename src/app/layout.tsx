import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VidAgent AI — AI Video Creation Platform",
  description: "Generate, edit, and publish AI-powered videos with your own face and voice. Scale your content production with VidAgent AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>{children}</body>
    </html>
  );
}
