import { TimezoneUpdater } from "@/components/auth/TimezoneUpdater";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { routing } from "@/i18n/routing";
import { QueryProvider } from "@/providers/QueryProvider";
import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Figtree, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.sapiow.com";

export const metadata: Metadata = {
  title: "Sapiow - Réservez des sessions avec des experts en ligne",
  description:
    "Sapiow est la plateforme qui vous connecte avec des experts qualifiés pour des consultations vidéo personnalisées. Trouvez votre expert et réservez en ligne.",
  openGraph: {
    siteName: "Sapiow",
    type: "website",
    title: "Sapiow - Réservez des sessions avec des experts en ligne",
    description:
      "Sapiow est la plateforme qui vous connecte avec des experts qualifiés pour des consultations vidéo personnalisées. Trouvez votre expert et réservez en ligne.",
    images: [
      {
        url: `${SITE_URL}/assets/icon.png`,
        width: 1024,
        height: 1024,
        alt: "Sapiow - Plateforme d'experts en ligne",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sapiow - Réservez des sessions avec des experts en ligne",
    description:
      "Sapiow est la plateforme qui vous connecte avec des experts qualifiés pour des consultations vidéo personnalisées. Trouvez votre expert et réservez en ligne.",
    images: [
      {
        url: `${SITE_URL}/assets/icon.png`,
        width: 1024,
        height: 1024,
        alt: "Sapiow - Plateforme d'experts en ligne",
      },
    ],
  },
};

export const generateStaticParams = () => {
  return routing.locales.map((locale) => ({ locale }));
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head />
      <body
        className={` ${figtree.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <QueryProvider>
            <TimezoneUpdater />
            <FavoritesProvider>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "#363636",
                    color: "#fff",
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: "#4ade80",
                      secondary: "#fff",
                    },
                  },
                  error: {
                    duration: 4000,
                    iconTheme: {
                      primary: "#ef4444",
                      secondary: "#fff",
                    },
                  },
                }}
              />
            </FavoritesProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
