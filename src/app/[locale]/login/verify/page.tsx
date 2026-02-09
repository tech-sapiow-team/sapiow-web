"use client";
import { Button } from "@/components/common/Button";
import OTPInput from "@/components/common/OTPInput";
import { RedirectIfAuthenticated } from "@/components/common/RedirectIfAuthenticated";
import { useVerifyOtp } from "@/hooks/useVerifyOtp";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function VerifyCode() {
  const t = useTranslations();
  const {
    code,
    isCodeComplete,
    formattedPhone,
    isLoading,
    error,
    handleCodeChange,
    handleResendCode,
    handleChangeNumber,
    handleContinue,
  } = useVerifyOtp();

  return (
    <RedirectIfAuthenticated>
      <div className="w-screen min-h-screen bg-white">
        <div className="container min-h-screen flex flex-col lg:grid lg:grid-cols-[630px_1fr] xl:grid-cols-[700px_1fr]">
          {/* Section image - cachée sur mobile et tablette, visible sur desktop */}
          <div className="hidden lg:block relative my-8 min-h-[600px] xl:min-h-[700px] w-full">
            <Image
              src="/assets/on_boarding.png"
              alt="Background"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Section contenu principal */}
          <div className="flex flex-col min-h-screen lg:min-h-auto">
            {/* Logo - responsive positioning */}
            <div className="mt-14 ml-[42px]">
              <Image
                src="/assets/logo.png"
                alt="Logo"
                width={175}
                height={38}
              />
            </div>

            {/* Contenu principal - centré verticalement */}
            <div className="flex flex-col justify-center items-center flex-1 px-6 py-8 lg:py-0">
              <div className="w-full max-w-[350px] sm:max-w-[380px] lg:max-w-[391px]">
                {/* Titre */}
                <h1 className="text-2xl sm:text-[26px] lg:text-[28px] leading-[32px] sm:leading-[34px] lg:leading-[36px] font-bold text-center lg:text-left font-figtree">
                  {t("verify.title")}
                </h1>

                {/* Composant OTP */}
                <div className="flex justify-center my-9">
                  <OTPInput
                    value={code}
                    onChange={handleCodeChange}
                    disabled={isLoading}
                    maxLength={6}
                  />
                </div>

                {/* Message d'erreur */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-[8px]">
                    <p className="text-sm text-red-600 font-medium text-center">
                      {error}
                    </p>
                  </div>
                )}

                {/* Liens d'action */}
                <div className="text-center space-y-3 font-figtree">
                  <p className="text-sm font-normal text-heather-gray mb-7">
                    {t("verify.noCodeReceived")}{" "}
                    <button
                      onClick={handleResendCode}
                      disabled={isLoading}
                      className="text-cyan-cobalt hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer underline"
                    >
                      {isLoading ? t("verify.sending") : t("verify.resend")}
                    </button>
                  </p>

                  <button
                    onClick={handleChangeNumber}
                    disabled={isLoading}
                    className="text-cobalt-blue hover:underline text-sm block mx-auto disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-semibold underline mb-5.5"
                  >
                    {t("verify.changeNumber")}
                  </button>
                </div>

                {/* Bouton Continuer */}
                <Button
                  label={isLoading ? t("verify.verifying") : t("continue")}
                  className="w-full rounded-[8px] h-[56px] text-base font-medium"
                  disabled={!isCodeComplete || isLoading}
                  onClick={handleContinue}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </RedirectIfAuthenticated>
  );
}
