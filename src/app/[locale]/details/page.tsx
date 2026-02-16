import type { Metadata } from "next";
import ProfessionalDetail from "./DetailsClient";

export const dynamic = "force-dynamic";

const SITE_URL = "https://app.sapiow.com";
const API_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

interface DetailsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ id?: string }>;
}

async function fetchProExpert(id: string) {
  try {
    const res = await fetch(`${API_URL}/functions/v1/pro/${id}`, {
      headers: {
        "Content-Type": "application/json",
        apikey: ANON_KEY || "",
      },
      cache: "no-store",
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: DetailsPageProps): Promise<Metadata> {
  const [{ locale }, { id }] = await Promise.all([params, searchParams]);

  const fallbackMeta: Metadata = {
    title: "Sapiow - Expert",
    description:
      "Découvrez le profil de cet expert sur Sapiow et réservez une consultation vidéo.",
  };

  if (!id) return fallbackMeta;

  const proData = await fetchProExpert(id);
  if (!proData) return fallbackMeta;

  const fullName = [proData.first_name, proData.last_name]
    .filter(Boolean)
    .join(" ");
  const title = fullName
    ? `${fullName} - Expert sur Sapiow`
    : "Sapiow - Expert";
  const description = proData.description
    ? proData.description.slice(0, 150)
    : `Réservez une consultation vidéo avec ${fullName || "cet expert"} sur Sapiow.`;

  const hasAvatar = proData.avatar && proData.avatar.startsWith("http");
  const ogImage = hasAvatar
    ? proData.avatar
    : `${SITE_URL}/assets/og-image.png`;

  const imageEntry = hasAvatar
    ? { url: ogImage, alt: title }
    : { url: ogImage, width: 1200, height: 630, alt: title };

  const pageUrl = `${SITE_URL}/${locale}/details?id=${id}`;

  return {
    title,
    description,
    openGraph: {
      siteName: "Sapiow",
      type: "profile",
      title,
      description,
      url: pageUrl,
      images: [imageEntry],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageEntry],
    },
  };
}

export default function DetailsPage() {
  return <ProfessionalDetail />;
}
