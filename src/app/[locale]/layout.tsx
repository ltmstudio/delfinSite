import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import BootstrapClient from "../../components/BootstrapClient";
import StructuredData from "../../components/StructuredData";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages();
  const meta = (messages as any).meta;
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://delfin-sanitary.com';
  const currentUrl = `${baseUrl}/${locale}`;
  
  return {
    title: meta?.title || "Delfin",
    description: meta?.description || "Premium Bathroom Fixtures",
    keywords: meta?.keywords || "",
    authors: [{ name: meta?.author || "Delfin" }],
    creator: meta?.author || "Delfin",
    publisher: meta?.author || "Delfin",
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: currentUrl,
      languages: {
        'ru': `${baseUrl}/ru`,
        'en': `${baseUrl}/en`,
        'tr': `${baseUrl}/tr`,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale,
      url: currentUrl,
      title: meta?.ogTitle || meta?.title || "Delfin",
      description: meta?.ogDescription || meta?.description || "Premium Bathroom Fixtures",
      siteName: 'Delfin',
      images: [
        {
          url: `${baseUrl}/logo-delfin.png`,
          width: 1200,
          height: 630,
          alt: 'Delfin Logo',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta?.ogTitle || meta?.title || "Delfin",
      description: meta?.ogDescription || meta?.description || "Premium Bathroom Fixtures",
      images: [`${baseUrl}/logo-delfin.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      // Google Search Console verification (добавьте свой код)
      // google: 'your-google-verification-code',
      // Yandex Webmaster verification
      // yandex: 'your-yandex-verification-code',
    },
  };
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <BootstrapClient />
      {children}
    </NextIntlClientProvider>
  );
}
