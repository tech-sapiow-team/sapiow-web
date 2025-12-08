import { ProExpertSession } from "@/api/proExpert/useProExpert";
import {
  useCreateProSessionFeatures,
  useDeleteProSessionFeatures,
  useGetProSessionFeatures,
  useUpdateProSessionFeatures,
} from "@/api/sessions/useProSessionFeatures";
import {
  SessionCreate,
  SessionGetResponse,
  useCreateProSession,
  useUpdateProSession,
  validateSessionData,
} from "@/api/sessions/useSessions";
import { apiClient } from "@/lib/api-client";
import { showToast } from "@/utils/toast";
import { useEffect, useState } from "react";

interface UseAddSessionModalProps {
  onSuccess?: (data: SessionCreate) => void;
  onClose: () => void;
  editData?: ProExpertSession;
  isEditMode?: boolean;
  onSessionCreated?: (sessionId: string, sessionData: SessionCreate) => void; // Callback après création
}

export const useAddSessionModal = ({
  onSuccess,
  onClose,
  editData,
  isEditMode = false,
  onSessionCreated,
}: UseAddSessionModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    session_nature: "subscription" as const,
  });

  // État pour les features dynamiques (gestion locale)
  const [localFeatures, setLocalFeatures] = useState<
    { id: string; name: string }[]
  >([]);
  const [newFeatureName, setNewFeatureName] = useState("");
  const [editingFeatureIndex, setEditingFeatureIndex] = useState<number | null>(
    null
  ); // Index de la feature en cours d'édition
  const [editingFeatureName, setEditingFeatureName] = useState(""); // Nom temporaire pendant l'édition

  const [isLoadingSessionData, setIsLoadingSessionData] = useState(false);

  // Hooks API pour les features (utilisés seulement lors de la sauvegarde finale)
  const createFeatureMutation = useCreateProSessionFeatures();
  const updateFeatureMutation = useUpdateProSessionFeatures();
  const deleteFeatureMutation = useDeleteProSessionFeatures();

  // Charger les features si on est en mode édition
  const { data: existingFeatures, isLoading: isLoadingFeatures } =
    useGetProSessionFeatures(isEditMode && editData?.id ? editData.id : "");

  // Fonction pour récupérer les données complètes de la session
  const fetchCompleteSessionData = async (sessionId: string) => {
    try {
      setIsLoadingSessionData(true);

      // L'API retourne toutes les sessions du pro, il faut trouver la bonne
      const allSessions = await apiClient.get<SessionGetResponse[]>(
        "pro-session"
      );

      // Trouver la session avec l'ID correspondant
      const targetSession = allSessions.find(
        (session) => session.id === sessionId
      );

      return targetSession || null;
    } catch (error) {
      return null;
    } finally {
      setIsLoadingSessionData(false);
    }
  };

  // Initialiser les données en mode édition OU réinitialiser en mode création
  useEffect(() => {
    if (isEditMode && editData) {
      // Mode édition : Initialiser avec les données existantes
      setFormData({
        name: editData.name || "",
        price: editData.price?.toString() || "",
        session_nature: "subscription" as const,
      });
    } else if (!isEditMode) {
      // Mode création : Réinitialiser le formulaire
      setFormData({
        name: "",
        price: "",
        session_nature: "subscription" as const,
      });
      setLocalFeatures([]);
      setNewFeatureName("");
      setErrors([]);
    }
  }, [isEditMode, editData]);

  // Charger les features existantes en mode édition
  useEffect(() => {
    if (existingFeatures) {
      // L'API peut retourner un objet unique ou un tableau
      const featuresArray = Array.isArray(existingFeatures)
        ? existingFeatures
        : [existingFeatures];
      setLocalFeatures(
        featuresArray
          .filter((f) => f.id !== undefined && f.id !== null)
          .map((f) => ({ id: String(f.id), name: f.name }))
      );
      console.log("✅ Features chargées:", featuresArray);
    }
  }, [existingFeatures]);

  const [errors, setErrors] = useState<string[]>([]);

  // Hooks pour créer et mettre à jour une session
  const createSessionMutation = useCreateProSession();
  const updateSessionMutation = useUpdateProSession();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Ajouter une nouvelle feature (en local)
  const handleAddFeature = () => {
    if (!newFeatureName.trim()) return;

    // Générer un ID temporaire unique
    const tempId = `temp-${Date.now()}-${Math.random()}`;

    setLocalFeatures((prev) => [
      ...prev,
      { id: tempId, name: newFeatureName.trim() },
    ]);

    setNewFeatureName("");
    console.log("✅ Feature ajoutée localement:", newFeatureName.trim());
  };

  // Commencer l'édition d'une feature
  const handleStartEditFeature = (index: number, currentName: string) => {
    setEditingFeatureIndex(index);
    setEditingFeatureName(currentName);
  };

  // Annuler l'édition d'une feature
  const handleCancelEditFeature = () => {
    setEditingFeatureIndex(null);
    setEditingFeatureName("");
  };

  // Sauvegarder la modification d'une feature (en local)
  const handleSaveEditFeature = (index: number) => {
    if (!editingFeatureName.trim()) return;

    setLocalFeatures((prev) =>
      prev.map((f, i) =>
        i === index ? { ...f, name: editingFeatureName.trim() } : f
      )
    );

    setEditingFeatureIndex(null);
    setEditingFeatureName("");
    console.log("✅ Feature modifiée localement:", editingFeatureName.trim());
  };

  // Supprimer une feature (en local)
  const handleDeleteFeature = (index: number) => {
    setLocalFeatures((prev) => prev.filter((_, i) => i !== index));
    console.log("✅ Feature supprimée localement");
  };

  const handleSubmit = async () => {
    // Réinitialiser les erreurs
    setErrors([]);

    const sessionData: SessionCreate = {
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      session_nature: formData.session_nature,
      is_active: true,
      // Champs requis par le backend (les features sont gérées séparément via l'API features)
      one_on_one: false,
      video_call: false,
      strategic_session: false,
      exclusive_ressources: false,
      support: false,
      mentorship: false,
      webinar: false,
    };

    // Validation des données
    const validationErrors = validateSessionData(sessionData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      let sessionId: string;

      if (isEditMode && editData?.id) {
        // Mode édition - utiliser l'API de mise à jour
        await updateSessionMutation.mutateAsync({
          id: editData.id,
          data: {
            name: sessionData.name,
            price: sessionData.price,
            session_nature: sessionData.session_nature,
            is_active: sessionData.is_active,
            // Champs requis par le backend
            one_on_one: sessionData.one_on_one,
            video_call: sessionData.video_call,
            strategic_session: sessionData.strategic_session,
            exclusive_ressources: sessionData.exclusive_ressources,
            support: sessionData.support,
            mentorship: sessionData.mentorship,
            webinar: sessionData.webinar,
          },
        });
        sessionId = editData.id;

        // En mode édition, gérer les features existantes vs nouvelles
        // 1. Supprimer les features qui ne sont plus dans localFeatures
        const existingIds = existingFeatures
          ? (Array.isArray(existingFeatures)
              ? existingFeatures
              : [existingFeatures]
            )
              .filter((f) => f.id !== undefined && f.id !== null)
              .map((f) => String(f.id))
          : [];
        const localIds = localFeatures
          .filter((f) => typeof f.id === "string" && !f.id.startsWith("temp-"))
          .map((f) => f.id);

        for (const existingId of existingIds) {
          if (!localIds.includes(existingId)) {
            await deleteFeatureMutation.mutateAsync(existingId);
            console.log("✅ Feature supprimée:", existingId);
          }
        }

        // 2. Mettre à jour les features existantes qui ont changé
        for (const feature of localFeatures) {
          if (
            typeof feature.id === "string" &&
            !feature.id.startsWith("temp-")
          ) {
            const existingFeature = existingIds.includes(feature.id);
            if (existingFeature) {
              await updateFeatureMutation.mutateAsync({
                id: feature.id,
                data: { name: feature.name },
              });
              console.log("✅ Feature mise à jour:", feature.name);
            }
          }
        }

        // 3. Créer les nouvelles features (celles avec ID temporaire)
        for (const feature of localFeatures) {
          if (
            typeof feature.id === "string" &&
            feature.id.startsWith("temp-")
          ) {
            await createFeatureMutation.mutateAsync({
              id: sessionId,
              data: { name: feature.name },
            });
            console.log("✅ Nouvelle feature créée:", feature.name);
          }
        }
      } else {
        // Mode création
        const result = await createSessionMutation.mutateAsync(sessionData);

        if (!result.data?.id) {
          throw new Error("Erreur: ID de session non retourné");
        }

        sessionId = result.data.id;

        // Créer toutes les features locales
        for (const feature of localFeatures) {
          await createFeatureMutation.mutateAsync({
            id: sessionId,
            data: { name: feature.name },
          });
        }
      }

      if (onSuccess) {
        onSuccess(sessionData);
      }

      handleCancel();
    } catch (error: any) {
      showToast.error(error.message);
      setErrors([
        error.message ||
          (isEditMode
            ? "Erreur lors de la modification de la session"
            : "Erreur lors de la création de la session"),
      ]);
    }
  };

  const handleCancel = () => {
    // Réinitialiser le formulaire
    setFormData({
      name: "",
      price: "",
      session_nature: "subscription" as const,
    });
    setLocalFeatures([]);
    setNewFeatureName("");
    setErrors([]);
    setEditingFeatureIndex(null);
    setEditingFeatureName("");
    onClose();
  };

  const handleDelete = async () => {
    if (!isEditMode || !editData?.id) {
      console.error("Impossible de supprimer: pas en mode édition ou pas d'ID");
      return;
    }

    try {
      // "Supprimer" en mettant is_active à false
      await updateSessionMutation.mutateAsync({
        id: editData.id,
        data: {
          name: formData.name,
          price: parseFloat(formData.price),
          session_nature: formData.session_nature,
          is_active: false,
          // Champs requis par le backend
          one_on_one: false,
          video_call: false,
          strategic_session: false,
          exclusive_ressources: false,
          support: false,
          mentorship: false,
          webinar: false,
        },
      });

      if (onSuccess) {
        // Notifier le parent que la session a été "supprimée"
        onSuccess({
          name: formData.name,
          price: parseFloat(formData.price),
          session_nature: formData.session_nature,
          is_active: false,
          one_on_one: false,
          video_call: false,
          strategic_session: false,
          exclusive_ressources: false,
          support: false,
          mentorship: false,
          webinar: false,
        });
      }

      handleCancel();
    } catch (error: any) {
      showToast.error(error.message);
      setErrors([
        error.message || "Erreur lors de la suppression de la session",
      ]);
    }
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.price.trim() !== "" &&
    !isNaN(parseFloat(formData.price)) &&
    parseFloat(formData.price) > 0 &&
    !createSessionMutation.isPending &&
    !updateSessionMutation.isPending;

  return {
    // États
    formData,
    features: localFeatures, // Renommé pour compatibilité avec le composant
    newFeatureName,
    errors,
    isFormValid,
    editingFeatureIndex,
    editingFeatureName,

    // États de chargement
    isPending:
      createSessionMutation.isPending ||
      updateSessionMutation.isPending ||
      isLoadingSessionData,
    isLoadingFeatures,

    // Handlers
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
    handleDelete,
  };
};
