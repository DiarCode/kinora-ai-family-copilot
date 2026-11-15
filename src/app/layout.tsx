import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kinora: the family copilot for parents",
    template: "%s · Kinora",
  },
  description:
    "Kinora gives both parents one calm place to check in, talk through hard moments, and leave with one small next step. Five minutes at a time.",
  applicationName: "Kinora",
  keywords: [
    "family copilot",
    "parenting",
    "coparenting",
    "relationship coaching",
    "child development",
  ],
  authors: [{ name: "Kinora" }],
  openGraph: {
    title: "Kinora: the family copilot for parents",
    description:
      "Parenting is a team sport. Kinora helps both parents check in, repair, understand each child, and learn in five-minute reps.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kinora: the family copilot for parents",
    description:
      "One private place for both parents to check in, talk through hard moments, and leave with one small next step.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`}>
      <body className="min-h-dvh antialiased">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            className:
              "rounded-2xl border border-[#e4e2e8] bg-white text-[#1e1e20] shadow-xl",
          }}
        />
      </body>
    </html>
  );
}
