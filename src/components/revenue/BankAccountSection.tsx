import {
  useCreateAccountStripe,
  useGetInfoStripeAccount,
  useUpdateBank,
} from "@/api/proBank/useBank";
import { Button } from "@/components/common/Button";
import { LoadingModal } from "@/components/common/LoadingModal";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";

interface BankAccountSectionProps {
  hasBankAccount: boolean;
  onAddBankAccount: () => void;
  onModifyBankAccount: () => void;
}

export default function BankAccountSection({
  hasBankAccount,
  onAddBankAccount,
  onModifyBankAccount,
}: BankAccountSectionProps) {
  const t = useTranslations();
  const { mutate: initializeStripeAccount } = useCreateAccountStripe();
  const { mutate: updateBank } = useUpdateBank();
  const { data: bankAccount } = useGetInfoStripeAccount();

  // Déterminer si un compte Stripe existe et récupérer les infos bancaires
  const hasStripeAccount = !!bankAccount?.account;
  const stripeAccount = bankAccount?.account;
  const externalAccount = stripeAccount?.external_accounts?.data?.[0];
  const hasExternalAccount = !!externalAccount;
  const last4 = externalAccount?.last4;
  const country = externalAccount?.country || stripeAccount?.country;
  const [initiateBankAccount, setInitiateBankAccount] = useState(false);
  const [isModifying, setIsModifying] = useState(false);

  const handleAddBankAccount = () => {
    setInitiateBankAccount(true);
    initializeStripeAccount(undefined, {
      onSuccess(data) {
        if (data.onboarding_url) {
          window.location.href = data.onboarding_url;
        }
      },
      onError(error) {
        setInitiateBankAccount(false);
        console.log(error);
      },
    });
  };

  const handleModifyBankAccount = () => {
    // Récupérer l'ID du bank_account depuis external_accounts
    const bankAccountId = externalAccount?.id;

    if (!bankAccountId) {
      console.error("Aucun compte bancaire trouvé");
      return;
    }

    setIsModifying(true);
    updateBank(
      {
        external_account_token: bankAccountId,
      },
      {
        onSuccess(data) {
          if (data?.onboarding_url) {
            window.location.href = data.onboarding_url;
          }
        },
        onError(error) {
          setIsModifying(false);
          console.error(
            "Erreur lors de la modification du compte bancaire:",
            error
          );
        },
      }
    );
  };

  const handleCompleteConfiguration = () => {
    setIsModifying(true);
    initializeStripeAccount(undefined, {
      onSuccess(data) {
        if (data.onboarding_url) {
          window.location.href = data.onboarding_url;
        }
      },
      onError(error) {
        setIsModifying(false);
        console.error(
          "Erreur lors de la complétion de la configuration:",
          error
        );
      },
    });
  };

  const isLoading = initiateBankAccount || isModifying;

  return (
    <>
      <LoadingModal
        isOpen={isLoading}
        message={t("bankAccount.preparingRedirect")}
      />
      <div className="space-y-6 ml-0 lg:ml-5">
        <h2 className="text-sm font-medium font-figtree text-charcoal-blue hidden lg:block">
          {t("bankAccount.title")}
        </h2>

        <Card className="bg-white border-gray-200 h-[60px]">
          <CardContent className="p-4 h-full flex items-center">
            <div className="flex items-center justify-between w-full">
              {!hasStripeAccount ? (
                // État 1 : pas de compte Stripe
                <>
                  <div className="flex items-center gap-4 pb-6">
                    <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
                      <Image
                        src="/assets/icons/stripe.svg"
                        alt={t("bankAccount.bankAlt")}
                        width={24}
                        height={24}
                      />
                    </div>
                    <div className="text-xs font-medium text-gray-600 hidden xl:block">
                      XXX XXXX XXXXXXXXX XXX
                    </div>
                    <div className="text-xs font-medium text-gray-600 xl:hidden">
                      {t("bankAccount.addRib")}
                    </div>
                  </div>
                  <Button
                    label={
                      initiateBankAccount
                        ? t("bankAccount.inProgress")
                        : t("bankAccount.add")
                    }
                    onClick={handleAddBankAccount}
                    disabled={initiateBankAccount}
                    className="border border-light-blue-gray hover:text-white rounded-full text-exford-blue font-bold font-figtree px-4 py-2 mb-6 bg-transparent text-sm shadow-none"
                  />
                </>
              ) : !hasExternalAccount ? (
                // État 2 : compte Stripe créé mais configuration incomplète
                <>
                  <div className="flex items-center gap-4 pb-6">
                    <div className="w-9 h-9 bg-orange-100 rounded-full border border-orange-200 flex items-center justify-center">
                      <span className="text-orange-600 font-normal text-[10px]">
                        Stripe
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">
                        Stripe Connect
                      </div>
                      <div className="text-xs text-orange-600">
                        {t("bankAccount.incompleteConfig")}
                      </div>
                    </div>
                  </div>
                  <Button
                    label={
                      isModifying
                        ? t("bankAccount.inProgress")
                        : t("bankAccount.completeConfig")
                    }
                    onClick={handleCompleteConfiguration}
                    disabled={isModifying}
                    className="border border-orange-300 text-orange-600 hover:bg-orange-50 px-4 py-2 bg-transparent text-sm mb-6"
                  />
                </>
              ) : (
                // État 3 : configuration complète avec external account
                <>
                  <div className="flex items-center gap-4 pb-6">
                    <div className="w-9 h-9 bg-[#5B56F6] rounded-full border border-gray-200 flex items-center justify-center">
                      <span className="text-white font-normal text-[10px]">
                        Stripe
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">
                        Stripe Connect
                      </div>
                      <div className="text-xs text-gray-500">
                        {country?.toUpperCase()}
                        {last4 ? `••••${last4}` : "••••••••"}
                      </div>
                    </div>
                  </div>
                  <Button
                    label={
                      isModifying
                        ? t("bankAccount.inProgress")
                        : t("bankAccount.modify")
                    }
                    onClick={handleModifyBankAccount}
                    disabled={isModifying}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 bg-transparent text-sm mb-6"
                  />
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
