import type { Metadata } from "next";
import ProfessionalDetail from "./DetailsClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.sapiow.com";
const API_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

interface DetailsPageProps {
  searchParams: Promise<{ id?: string }>;
}

async function fetchProExpert(id: string) {
  try {
    const res = await fetch(`${API_URL}/functions/v1/pro/${id}`, {
      headers: {
        "Content-Type": "application/json",
        apikey: ANON_KEY || "",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  searchParams,
}: DetailsPageProps): Promise<Metadata> {
  const { id } = await searchParams;

  if (!id) {
    return {
      title: "Sapiow - Expert",
      description:
        "Découvrez le profil de cet expert sur Sapiow et réservez une consultation vidéo personnalisée.",
    };
  }

  const proData = await fetchProExpert(id);

  if (!proData) {
    return {
      title: "Sapiow - Expert",
      description:
        "Découvrez le profil de cet expert sur Sapiow et réservez une consultation vidéo personnalisée.",
    };
  }

  const fullName = [proData.first_name, proData.last_name]
    .filter(Boolean)
    .join(" ");
  const title = fullName
    ? `${fullName} - Expert sur Sapiow`
    : "Sapiow - Expert";
  const description = proData.description
    ? proData.description.slice(0, 160)
    : `Réservez une consultation vidéo avec ${
        fullName || "cet expert"
      } sur Sapiow.`;

  const ogImage =
    proData.avatar && proData.avatar.startsWith("http")
      ? proData.avatar
      : `${SITE_URL}/assets/icon.png`;

  return {
    title,
    description,
    openGraph: {
      siteName: "Sapiow",
      type: "profile",
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1024,
          height: 1024,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1024,
          height: 1024,
          alt: title,
        },
      ],
    },
  };
}

export default function DetailsPage() {
  return <ProfessionalDetail />;
}
