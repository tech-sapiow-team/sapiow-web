"use client";

import { ProExpertSession } from "@/api/proExpert/useProExpert";
import { SessionCreate } from "@/api/sessions/useSessions";
import { Button } from "@/components/common/Button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAddSessionModal } from "@/hooks/useAddSessionModal";
import { Check, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { FormField } from "./FormField";

interface AddAccompanimentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (data: SessionData) => void;
  onSessionCreated?: (sessionId: string, sessionData: SessionData) => void; // Callback après création
  editData?: ProExpertSession; // Données existantes pour la modification
  isEditMode?: boolean; // Mode édition
}

interface SessionData extends SessionCreate {
  // SessionData hérite de SessionCreate du hook API
}

export default function AddAccompanimentModal({
  isOpen,
  onClose,
  onSuccess,
  onSessionCreated,
  editData,
  isEditMode = false,
}: AddAccompanimentModalProps) {
  const t = useTranslations();

  const {
    formData,
    features,
    newFeatureName,
    errors,
    isFormValid,
    isPending,
    isLoadingFeatures,
    editingFeatureIndex,
    editingFeatureName,
    handleInputChange,
    setNewFeatureName,
    setEditingFeatureName,
    handleAddFeature,
    handleStartEditFeature,
    handleSaveEditFeature,
    handleCancelEditFeature,
    handleDeleteFeature,
    handleSubmit,
    handleCancel,
  } = useAddSessionModal({
    onSuccess,
    onClose,
    editData,
    isEditMode,
    onSessionCreated,
  });

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[540px] p-0 bg-white border-l border-light-blue-gray"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-6 pb-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl font-semibold text-gray-900 font-figtree">
                {isEditMode ? t("offers.editSession") : t("offers.addSession")}
              </SheetTitle>
            </div>
          </SheetHeader>

          {/* Content */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* Nom */}
            <div className="space-y-2">
              <FormField
                label={t("offers.sessionName")}
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder={t("offers.sessionNamePlaceholder")}
                className="w-full h-[56px] p-5 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              />
            </div>

            {/* Prix */}
            <div className="space-y-2">
              <FormField
                label={t("offers.price")}
                type="number"
                id="price"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder={t("offers.pricePlaceholder")}
                rightIcon={
                  <Image
                    src="/assets/icons/mdi_euro.svg"
                    alt={t("offers.euroAlt")}
                    width={24}
                    height={24}
                  />
                }
                className="w-full h-[56px] p-5 pr-11 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              />
            </div>

            {/* Affichage des erreurs */}
            {errors.length > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg font-figtree">
                <div className="text-sm text-red-700">
                  {errors.map((error, index) => (
                    <div key={index} className="mb-1">
                      • {error}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fonctionnalités dynamiques */}
            <div className="space-y-4 border border-light-blue-gray rounded-[12px] p-4">
              <Label className="text-sm font-medium text-gray-700 font-figtree">
                {t("offers.includedFeatures")}
              </Label>

              {/* Input pour ajouter une nouvelle feature */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeatureName}
                  onChange={(e) => setNewFeatureName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                  placeholder={t("offers.addFeaturePlaceholder")}
                  className="flex-1 h-[44px] px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-figtree text-sm"
                />
                <Button
                  onClick={handleAddFeature}
                  disabled={!newFeatureName.trim()}
                  label={t("offers.add")}
                  icon={<Plus />}
                />
              </div>

              {/* Liste des features existantes */}
              {isLoadingFeatures ? (
                <div className="text-sm text-gray-500 text-center py-4 font-figtree">
                  {t("offers.loadingFeatures")}
                </div>
              ) : features.length > 0 ? (
                <div className="space-y-2">
                  {features.map((feature, index) => (
                    <div
                      key={feature.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 font-figtree"
                    >
                      {editingFeatureIndex === index ? (
                        // Mode édition
                        <>
                          <input
                            type="text"
                            value={editingFeatureName}
                            onChange={(e) =>
                              setEditingFeatureName(e.target.value)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleSaveEditFeature(index);
                              } else if (e.key === "Escape") {
                                handleCancelEditFeature();
                              }
                            }}
                            className="flex-1 px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            autoFocus
                          />
                          <div className="flex gap-2 ml-2">
                            <button
                              onClick={() => handleSaveEditFeature(index)}
                              className="text-green-600 hover:text-green-700 transition-colors p-1 cursor-pointer"
                              title="Sauvegarder"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCancelEditFeature}
                              className="text-gray-500 hover:text-gray-700 transition-colors p-1 cursor-pointer"
                              title="Annuler"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      ) : (
                        // Mode affichage
                        <>
                          <span className="flex-1 text-sm text-gray-700">
                            {feature.name}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleStartEditFeature(index, feature.name)
                              }
                              className="text-blue-600 hover:text-blue-700 transition-colors p-1 cursor-pointer"
                              title="Modifier"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteFeature(index)}
                              className="text-red-600 hover:text-red-700 transition-colors p-1 cursor-pointer"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 text-center py-4 font-figtree">
                  {/* {isEditMode
                    ? t("offers.noFeaturesYet")
                    : t("offers.createSessionFirst")} */}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6">
            <div className="flex gap-4">
              <Button
                label={t("cancel")}
                onClick={handleCancel}
                className="flex-1 py-3 bg-white text-base font-bold text-gray-700 border-gray-300 hover:bg-gray-50 h-[56px] border-none shadow-none"
              />

              <Button
                label={
                  isPending
                    ? isEditMode
                      ? t("offers.editing")
                      : t("offers.creating")
                    : isEditMode
                    ? t("bankAccount.modify")
                    : t("bankAccount.add")
                }
                onClick={handleSubmit}
                disabled={!isFormValid || isPending}
                icon={
                  isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : undefined
                }
                className={`flex-1 py-3 text-base font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed h-[56px] border-none shadow-none ${
                  isPending ? "cursor-not-allowed opacity-75" : ""
                }`}
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
