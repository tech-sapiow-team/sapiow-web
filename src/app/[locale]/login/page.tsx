"use client";
import { Button } from "@/components/common/Button";
import PhoneNumber from "@/components/common/PhoneNumber";
import { RedirectIfAuthenticated } from "@/components/common/RedirectIfAuthenticated";
import { useLogin } from "@/hooks/useLogin";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  const t = useTranslations();
  const {
    phoneNumber,
    selectedCountry,
    formattedValue,
    isPhoneValid,
    isLoading,
    error,
    setIsPhoneValid,
    handlePhoneChange,
    handleContinue,
  } = useLogin();

  return (
    <RedirectIfAuthenticated>
      <div className="w-screen min-h-screen bg-white">
        <div className="container min-h-screen flex flex-col lg:grid lg:grid-cols-[630px_1fr] xl:grid-cols-[700px_1fr]">
          {/* Section image - cachée sur mobile et tablette, visible sur desktop */}
          <div className="hidden lg:block relative my-8 min-h-[600px] xl:min-h-[700px] w-full">
            <Image
              src="/assets/on_boarding.png"
              alt="Onboarding"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col ">
            <div className="mt-14 ml-[42px]">
              <Image
                src="/assets/logo.svg"
                alt="Logo"
                width={175}
                height={175}
              />
            </div>

            {/* Contenu principal - centré verticalement */}
            <div className="flex flex-col justify-center items-center flex-1 px-6 py-8 lg:py-0">
              <div className="w-full max-w-[350px] sm:max-w-[380px] lg:max-w-[391px]">
                {/* Titre responsive */}
                <h1 className="text-2xl sm:text-[26px] lg:text-[28px] leading-[32px] sm:leading-[34px] lg:leading-[36px] font-bold text-center lg:text-left font-figtree">
                  {t("login.title")}
                </h1>

                {/* Sous-titre responsive */}
                <p className="text-base sm:text-lg font-normal my-4 text-center lg:text-left text-gray-600 font-figtree">
                  {t("login.subtitle")}
                </p>

                {/* Champ téléphone */}
                <div className="mb-6">
                  <PhoneNumber
                    value={phoneNumber}
                    countryCode={selectedCountry?.code}
                    onChange={handlePhoneChange}
                    onValidationChange={setIsPhoneValid}
                  />
                </div>

                {/* Message d'erreur */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-[8px]">
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                  </div>
                )}

                {/* Bouton */}
                <Button
                  label={isLoading ? t("login.sendingCode") : t("continue")}
                  className="w-full rounded-[8px] h-[56px] text-base font-medium"
                  disabled={!isPhoneValid || isLoading}
                  onClick={handleContinue}
                />

                {/* Texte légal responsive */}
                <p className="text-xs sm:text-sm font-medium text-black mt-6 lg:mt-4 text-center lg:text-left leading-relaxed font-figtree">
                  {t("login.legalText")}{" "}
                  <Link
                    href="/mentions-legales"
                    target="_blank"
                    className="text-cyan-cobalt hover:underline"
                  >
                    {t("login.termsOfService")}
                  </Link>{" "}
                  {t("login.and")}{" "}
                  <Link
                    href="/mentions-legales"
                    target="_blank"
                    className="text-cyan-cobalt hover:underline"
                  >
                    {t("login.privacyPolicy")}
                  </Link>{" "}
                  {t("login.ofSapiow")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RedirectIfAuthenticated>
  );
}
