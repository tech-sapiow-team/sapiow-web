"use client";

import { useGetCustomer } from "@/api/customer/useCustomer";
import { useGetDomaines } from "@/api/domaine/useDomaine";
import { Button } from "@/components/common/Button";
import { DeleteAccountModal } from "@/components/common/DeleteAccountModal";
import { FormField } from "@/components/common/FormField";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { ProfilePhotoUpload } from "@/components/onboarding/ProfilePhotoUpload";
import { useClientProfileUpdate } from "@/hooks/useClientProfileUpdate";
import { useTranslations } from "next-intl";

export default function ClientProfile() {
  const t = useTranslations();
  const { data: customer, isLoading, error } = useGetCustomer();
  const { data: domains = [] } = useGetDomaines();

  // Hook personnalisé pour gérer la mise à jour du profil
  const {
    formData,
    isEditing,
    isUpdating,
    isUploadingAvatar,
    updateError,
    isDeleteModalOpen,
    isDeleting,
    handleFieldChange,
    handleDomainToggle,
    handleAvatarChange,
    handleAvatarDelete,
    handleSave,
    handleDeleteAccount,
    handleConfirmDelete,
    handleCloseDeleteModal,
  } = useClientProfileUpdate({ customer });

  if (isLoading) {
    return (
      <div className="w-full max-w-[702px] mx-auto mt-10 px-5">
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <LoadingScreen
            message={t("profile.loadingProfile")}
            size="md"
            fullScreen={false}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[702px] mx-auto mt-10 px-5">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">
            {t("profile.errorLoadingProfile")} {error.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[702px] h-full  mx-auto mt-10 px-5">
      <div className="flex justify-center">
        <ProfilePhotoUpload
          isCompte
          onPhotoSelect={handleAvatarChange}
          onPhotoDelete={handleAvatarDelete}
          currentAvatar={customer?.avatar}
          isUploading={isUploadingAvatar}
        />
      </div>

      <div className="w-full max-w-[343px] mx-auto grid grid-cols-1 gap-y-4 gap-x-6">
        <FormField
          type="text"
          placeholder={t("onboarding.firstName")}
          label={t("onboarding.firstName")}
          value={formData.firstName}
          onChange={(e) => handleFieldChange("firstName", e.target.value)}
          className="h-[56px]"
        />
        <FormField
          type="text"
          placeholder={t("profile.yourName")}
          label={t("profile.yourName")}
          value={formData.lastName}
          onChange={(e) => handleFieldChange("lastName", e.target.value)}
          className="h-[56px]"
        />
        <FormField
          type="email"
          placeholder={t("onboarding.email")}
          label={t("onboarding.email")}
          value={formData.email}
          onChange={(e) => handleFieldChange("email", e.target.value)}
          className="h-[56px] md:col-span-2"
        />
      </div>

      <div className="mt-16 mb-6 flex flex-col justify-between items-center gap-y-4 gap-x-6 px-10">
        <Button
          label={isUpdating ? t("profile.saving") : t("profile.saveChanges")}
          className="h-[56px] max-w-[331px] w-full font-bold text-base font-figtree"
          disabled={!isEditing || isUpdating}
          onClick={handleSave}
        />
        <Button
          label={t("profile.deleteAccount")}
          className="bg-white text-red-500 rounded-[8px] shadow-none h-[56px] max-w-[331px] w-full font-bold text-base hover:bg-white"
          onClick={handleDeleteAccount}
        />
      </div>

      {/* Modal de confirmation de suppression */}
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
