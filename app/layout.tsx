import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

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
    default: "BudgetApp | Personal Finance Management",
    template: "%s | BudgetApp",
  },
  description:
    "A minimalist, high-density tool for personal finance management. Track your budgets and transactions with ease.",
  keywords: [
    "budget tracking",
    "personal finance",
    "finance app",
    "expense tracker",
    "minimalist budget",
  ],
  authors: [{ name: "Deddy Wolley", url: "https://deddywolley.com" }],
  creator: "Deddy Wolley",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://budget-app.deddywolley.com",
    title: "BudgetApp | Personal Finance Management",
    description:
      "A minimalist, high-density tool for personal finance management. Track your budgets and transactions with ease.",
    siteName: "BudgetApp",
  },
  twitter: {
    card: "summary_large_image",
    title: "BudgetApp | Personal Finance Management",
    description:
      "A minimalist, high-density tool for personal finance management. Track your budgets and transactions with ease.",
    creator: "@deddywolley",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        <QueryProvider>
          <div className="relative flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
          </div>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
