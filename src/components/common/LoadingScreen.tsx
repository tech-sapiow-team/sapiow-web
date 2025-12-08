import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * Composant d'écran de chargement réutilisable avec un spinner animé et un message optionnel.
 *
 * @example
 * ```tsx
 * // Plein écran avec message
 * <LoadingScreen message="Chargement des données..." size="xl" />
 *
 * // Dans un conteneur spécifique
 * <LoadingScreen
 *   message="Chargement..."
 *   size="lg"
 *   fullScreen={false}
 *   className="h-40"
 * />
 *
 * // Sans message
 * <LoadingScreen size="md" />
 * ```
 */
interface LoadingScreenProps {
  /** Message à afficher sous le spinner */
  message?: string;
  /** Taille du spinner et du texte */
  size?: "sm" | "md" | "lg" | "xl";
  /** Si true, occupe toute la hauteur de l'écran (min-h-screen) */
  fullScreen?: boolean;
  /** Classes CSS additionnelles */
  className?: string;
}

export const LoadingScreen = ({
  message,
  size = "lg",
  fullScreen = true,
  className = "",
}: LoadingScreenProps) => {
  const t = useTranslations();

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-16 w-16",
    lg: "h-16 w-16",
    xl: "h-16 w-16",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const containerClasses = fullScreen
    ? "min-h-screen flex items-center justify-center"
    : "flex items-center justify-center";

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center justify-center gap-4">
        <Loader2
          className={`${sizeClasses[size]} text-cobalt-blue animate-spin`}
        />
        {message && (
          <p className={`${textSizes[size]} text-exford-blue font-medium`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};
