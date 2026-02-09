"use client";
import { Button as ButtonUI } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface HeaderVisioProps {
  handleNotificationClick: () => void;
  title: string;
}

export const HeaderVisio: React.FC<HeaderVisioProps> = ({
  handleNotificationClick,
  title,
}) => {
  const router = useRouter();
  const [isFavoriActive, setIsFavoriActive] = useState(false);
  const [previousPath, setPreviousPath] = useState("/");

  // Sauvegarder le chemin précédent quand on n'est pas sur la page favori
  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      if (currentPath !== "/favori") {
        setPreviousPath(currentPath);
      }
      // Vérifier si on est sur la page favori pour mettre à jour l'état
      setIsFavoriActive(currentPath === "/favori");
    }
  }, []);

  const handleFavoriToggle = () => {
    if (isFavoriActive) {
      router.back();
      // Si les favoris sont actifs, retourner à la page précédente
      setIsFavoriActive(false);
      router.push(previousPath);
    } else {
      // Si les favoris ne sont pas actifs, aller à la page favori
      setIsFavoriActive(true);
      router.push("/favori");
    }
  };

  return (
    <header className="w-full flex justify-between items-center lg:border-b-2 lg:border-snow-blue py-4 sticky top-0 z-20 bg-white">
      <div className="flex items-center justify-between pl-4">
        {/* Section gauche - Photo de profil et message */}
        <div className="w-full max-w-[320px] flex items-center gap-4">
          <ButtonUI
            onClick={() => router.back()}
            className="w-12 h-12 p-[3px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 shadow-none bg-snow-blue"
          >
            <ChevronLeft />
          </ButtonUI>
          <h1 className="text-base font-bold text-cobalt-blue-500 whitespace-nowrap">
            {title}
          </h1>
        </div>
      </div>
      {/* Section droite - Bouton de partage et switch mode expert */}{" "}
      <div className="flex items-center gap-4 pr-4">
        {" "}
        <ButtonUI
          onClick={handleFavoriToggle}
          className={`w-12 h-12 p-[3px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 bg-snow-blue hover:bg-snow-blue/80 shadow-none`}
        >
          <Image
            src="/assets/icons/heartfavori.svg"
            alt="heart"
            width={20}
            height={20}
            className={`transition-all duration-200 ${
              isFavoriActive ? "opacity-0" : "opacity-100"
            }`}
          />
          <Image
            src="/assets/icons/heartblack.svg"
            alt="heart"
            width={20}
            height={20}
            className={`transition-all duration-200 absolute ${
              isFavoriActive ? "opacity-100" : "opacity-0"
            }`}
          />
        </ButtonUI>
        <ButtonUI
          className={`w-12 h-12 p-[3px] rounded-full flex items-center justify-center bg-snow-blue hover:bg-snow-blue/80 shadow-none cursor-pointer`}
        >
          <Image
            src="/assets/icons/bell.svg"
            alt="heart"
            width={20}
            height={20}
            className={`transition-all duration-200 `}
          />
        </ButtonUI>
      </div>
    </header>
  );
};
