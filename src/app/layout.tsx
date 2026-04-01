import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { StructuredData } from "@/components/seo/StructuredData";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.devpik.com"),
  title: {
    default: "DevPik - Free Online Developer Tools, Text Utilities & Tech Blog",
    template: "%s | DevPik",
  },
  description: "Free online tools for developers and creators. JSON formatter, regex tester, Base64 encoder, word counter, and 20+ more utilities. 100% client-side, no signup required.",
  keywords: ["free online tools", "developer tools", "JSON formatter", "regex tester", "Base64 encoder", "word counter", "text tools", "code formatter", "free developer tools", "online utilities", "DNS lookup", "JWT decoder"],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    siteName: "DevPik",
    type: "website",
    url: "https://www.devpik.com",
    title: "DevPik - Free Online Developer Tools, Text Utilities & Tech Blog",
    description: "Free online tools for developers and creators. JSON formatter, regex tester, Base64 encoder, word counter, and 20+ more utilities. 100% client-side.",
    images: [
      {
        url: "https://www.devpik.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "DevPik - Free Developer Tools & Online Utilities",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevPik - Free Online Developer Tools, Text Utilities & Tech Blog",
    description: "Free online tools for developers and creators. JSON formatter, regex tester, Base64 encoder, word counter, and 20+ more utilities.",
    images: ["https://www.devpik.com/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DevPik",
  url: "https://www.devpik.com",
  logo: "https://www.devpik.com/logo.png",
  description: "DevPik is a platform for free developer tools, text utilities, and technology insights.",
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    email: "founders@mergemain.com",
    contactType: "customer support",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "DevPik",
  url: "https://www.devpik.com",
  description: "Free online developer tools, text utilities, and technology insights. 20+ tools running 100% client-side.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.devpik.com/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6309173133572136"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.variable} ${outfit.variable} font-sans min-h-screen bg-background text-foreground antialiased selection:bg-primary/30 selection:text-primary`}>
        <StructuredData data={organizationSchema} />
        <StructuredData data={websiteSchema} />
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <div className="mx-auto flex-1 w-full max-w-screen-2xl px-4 md:px-8">
            <main className="flex-1 py-6 md:py-10 min-w-0">
              {children}
            </main>
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
