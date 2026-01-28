"use client";
import { useGetDomaines } from "@/api/domaine/useDomaine";
import { getDomainIcon } from "@/constants/onboarding";
import { useTranslations } from "next-intl";
import Image from "next/image";
import CategorySkeleton from "./CategorySkeleton";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export default function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const t = useTranslations();
  const { data: domains = [], isLoading } = useGetDomaines();

  // Créer les catégories avec "Top" en premier + domaines API
  const categories = [
    { id: "top", name: "Top", icon: "/assets/icons/star.svg" },
    ...domains.map((domain) => ({
      id: domain.id.toString(),
      name: domain.name,
      icon: getDomainIcon(domain.name),
    })),
  ];

  if (isLoading) {
    return <CategorySkeleton />;
  }

  return (
    <div className="flex items-center overflow-x-auto scrollbar-hide gap-6 py-4">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`flex flex-col items-center gap-2 transition-all duration-200 cursor-pointer`}
        >
          <div
            className={`w-12 h-12 p-[3px] rounded-full flex items-center justify-center ${
              selectedCategory === category.id ? "bg-[#001E44]" : "bg-snow-blue"
            }`}
          >
            <Image
              src={category.icon}
              alt={category.name}
              width={20}
              height={20}
              className={`transition-all duration-200 ${
                selectedCategory === category.id
                  ? "filter brightness-0 invert"
                  : ""
              }`}
            />
          </div>
          <span className="text-xs font-medium">{category.name}</span>
        </button>
      ))}
    </div>
  );
}
