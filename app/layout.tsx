import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import AppShell from "@/components/common/AppShell";
import TRPCQueryProvider from "@/components/providers/trpc-query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Career Counselor",
  description:
    "AI-powered career guidance app that helps you explore opportunities, plan growth, and make smarter career decisions with confidence.",
  keywords: [
    "AI career counselor",
    "career guidance",
    "job advice",
    "professional growth",
    "career planning",
    "AI career coach",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TRPCQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AppShell>{children}</AppShell>
          </ThemeProvider>
          <Toaster position="top-center" />
        </TRPCQueryProvider>
      </body>
    </html>
  );
}
