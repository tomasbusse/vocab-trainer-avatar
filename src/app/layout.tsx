import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexProvider } from "@/components/ConvexProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VocabTrainer - Learn English with AI",
  description:
    "Practice English vocabulary with an AI-powered avatar teacher. Learn new words, improve pronunciation, and track your progress.",
  keywords: [
    "vocabulary",
    "english learning",
    "ai tutor",
    "pronunciation",
    "language learning",
  ],
  authors: [{ name: "VocabTrainer" }],
  openGraph: {
    title: "VocabTrainer - Learn English with AI",
    description: "Practice English vocabulary with an AI-powered avatar teacher",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#3d8b5f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ConvexProvider>{children}</ConvexProvider>
      </body>
    </html>
  );
}
