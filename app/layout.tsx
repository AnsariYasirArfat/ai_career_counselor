import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import AppShell from "@/components/common/AppShell";
import TRPCQueryProvider from "@/components/providers/trpc-query-provider";
import AuthProvider from "@/components/providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "GuideLane AI – AI Career Counselor",
    template: "%s | GuideLane AI",
  },
  description:
    "GuideLane AI is a private, conversational career counselor that helps you explore paths, plan skills, and make confident decisions.",
  keywords: [
    "GuideLane AI",
    "AI career counselor",
    "career guidance",
    "career planning",
    "AI career coach",
  ],
  applicationName: "GuideLane AI",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    title: "GuideLane AI – AI Career Counselor",
    description:
      "Private, conversational career guidance to explore paths, plan growth, and decide with confidence.",
    images: [{ url: "/screenshots/main_page_dark.png", width: 1200, height: 630, alt: "GuideLane AI overview" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GuideLane AI – AI Career Counselor",
    description:
      "Private, conversational AI for career guidance and growth planning.",
    images: ["/screenshots/main_page_dark.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
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
        <AuthProvider>
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
        </AuthProvider>
      </body>
    </html>
  );
}