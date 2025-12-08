"use client";

import { useGetDomaines, useGetExpertises } from "@/api/domaine/useDomaine";
import { useGetProExpert } from "@/api/proExpert/useProExpert";
import { Button } from "@/components/common/Button";
import { DeleteAccountModal } from "@/components/common/DeleteAccountModal";
import { FormField } from "@/components/common/FormField";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { ProfilePhotoUpload } from "@/components/onboarding/ProfilePhotoUpload";
import { DomainDropdown } from "@/components/profile/DomainDropdown";
import { ExpertiseSelector } from "@/components/profile/ExpertiseSelector";
import { Textarea } from "@/components/ui/textarea";
import { useExpertProfileUpdate } from "@/hooks/useExpertProfileUpdate";
import { useTranslations } from "next-intl";

export default function ExpertProfile() {
  const t = useTranslations();
  const { data: user, isLoading, error } = useGetProExpert();
  console.log({ user });
  const { data: domains = [], isLoading: isLoadingDomains } = useGetDomaines();

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
    handleDomainChange,
    handleExpertisesChange,
    handleAvatarChange,
    handleAvatarDelete,
    handleSave,
    handleDeleteAccount,
    handleConfirmDelete,
    handleCloseDeleteModal,
  } = useExpertProfileUpdate({ user });

  // Charger les expertises pour le domaine sélectionné
  const { data: expertises = [], isLoading: isLoadingExpertises } =
    useGetExpertises(formData.domainId || 0);

  // Gérer le toggle des expertises
  const handleExpertiseToggle = (expertiseId: number) => {
    const newExpertises = formData.expertises.includes(expertiseId)
      ? formData.expertises.filter((e) => e !== expertiseId)
      : [...formData.expertises, expertiseId];
    handleExpertisesChange(newExpertises);
  };

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

  // Affichage des erreurs de mise à jour
  const displayUpdateError = updateError ? (
    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
      <div className="text-red-600 text-sm">
        {t("profile.errorUpdatingProfile")} {updateError.message}
      </div>
    </div>
  ) : null;

  return (
    <div className="w-full max-w-[702px] mx-auto mt-10 px-5">
      {displayUpdateError}
      <div className="flex justify-center">
        <ProfilePhotoUpload
          isCompte
          onPhotoSelect={handleAvatarChange}
          onPhotoDelete={handleAvatarDelete}
          currentAvatar={user?.avatar}
          isUploading={isUploadingAvatar}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
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
          type="text"
          placeholder={t("profile.yourJob")}
          label={t("profile.yourJob")}
          value={formData.job}
          onChange={(e) => handleFieldChange("job", e.target.value)}
          className="h-[56px]"
        />
        <FormField
          type="email"
          placeholder={t("onboarding.email")}
          label={t("onboarding.email")}
          value={formData.email}
          onChange={(e) => handleFieldChange("email", e.target.value)}
          className="h-[56px]"
        />
        <FormField
          type="text"
          placeholder={t("profile.linkedinLink")}
          label={t("profile.linkedinLink")}
          value={formData.linkedin}
          onChange={(e) => handleFieldChange("linkedin", e.target.value)}
          className="h-[56px]"
        />
        <FormField
          type="text"
          placeholder={t("profile.website")}
          label={t("profile.website")}
          value={formData.website}
          onChange={(e) => handleFieldChange("website", e.target.value)}
          className="h-[56px]"
        />
      </div>

      <div className="mt-6">
        <DomainDropdown
          domains={domains}
          selectedDomainId={formData.domainId}
          onDomainSelect={handleDomainChange}
          label={t("profile.expertiseDomain")}
          placeholder={t("profile.expertiseDomain")}
          isLoading={isLoadingDomains}
        />

        {/* Sélecteur d'expertises */}
        {formData.domainId && (
          <div className="mt-4">
            <ExpertiseSelector
              selectedExpertises={formData.expertises}
              expertises={expertises}
              isLoadingExpertises={isLoadingExpertises}
              onExpertiseToggle={handleExpertiseToggle}
            />
          </div>
        )}

        <Textarea
          placeholder={t("profile.aboutYouPlaceholder")}
          value={formData.description}
          onChange={(e) => handleFieldChange("description", e.target.value)}
          rows={6}
          className="w-full h-[190px] px-4 mt-4 font-medium text-exford-blue placeholder-slate-gray"
        />
      </div>

      <div className="mt-6 mb-6 flex flex-col justify-between items-center gap-y-4 gap-x-6 px-10">
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
