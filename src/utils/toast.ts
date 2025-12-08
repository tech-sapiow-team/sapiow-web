import toast from "react-hot-toast";

// Messages par défaut en français (fallback)
const defaultMessages = {
  // Questions
  questionSubmitted: "Question soumise avec succès !",
  questionUpdated: "Question mise à jour avec succès !",
  questionDeleted: "Question supprimée avec succès !",
  questionSubmitError: "Erreur lors de la soumission de la question",
  questionUpdateError: "Erreur lors de la mise à jour de la question",
  questionDeleteError: "Erreur lors de la suppression de la question",

  // Appointments
  appointmentCreated: "Rendez-vous créé avec succès !",
  appointmentConfirmed: "Rendez-vous confirmé avec succès !",
  appointmentCancelled: "Rendez-vous annulé avec succès !",
  appointmentCreateError: "Erreur lors de la création du rendez-vous",
  appointmentUpdateError: "Erreur lors de la mise à jour du rendez-vous",
  appointmentCancelError: "Erreur lors de l'annulation du rendez-vous",

  // Date Blocking
  dateBlocked: "Date bloquée avec succès !",
  dateBlockError: "Erreur lors du blocage de la date",
  dateUnblocked: "Date débloquée avec succès !",
  dateUnblockError: "Erreur lors du déblocage de la date",

  // Allow Days (Périodes de disponibilité)
  allowDayCreated: "Période de disponibilité créée avec succès !",
  allowDayUpdated: "Période de disponibilité mise à jour avec succès !",
  allowDayDeleted: "Période de disponibilité supprimée avec succès !",
  allowDayCreateError: "Erreur lors de la création de la période",
  allowDayUpdateError: "Erreur lors de la mise à jour de la période",
  allowDayDeleteError: "Erreur lors de la suppression de la période",

  // Session Features (Fonctionnalités de session)
  sessionFeatureCreated: "Fonctionnalité créée avec succès !",
  sessionFeatureUpdated: "Fonctionnalité mise à jour avec succès !",
  sessionFeatureDeleted: "Fonctionnalité supprimée avec succès !",
  sessionFeatureCreateError: "Erreur lors de la création de la fonctionnalité",
  sessionFeatureUpdateError:
    "Erreur lors de la mise à jour de la fonctionnalité",
  sessionFeatureDeleteError:
    "Erreur lors de la suppression de la fonctionnalité",

  // Video Call
  callConnectionError: "Erreur lors de la connexion à l'appel vidéo",
  callTokenError: "Erreur lors de la récupération du token d'appel",

  // Bank Account
  bankUpdateError: "Erreur lors de la mise à jour du compte bancaire",

  // Account Deletion
  accountDeleteError:
    "Impossible de supprimer votre compte. Vous avez des rendez-vous en attente ou confirmés.",
};

export const showToast = {
  success: (key: keyof typeof defaultMessages, customMessage?: string) => {
    const message = customMessage || defaultMessages[key];
    // Utiliser setTimeout avec un délai minimal pour garantir l'affichage même après des invalidations
    // Le délai permet d'éviter que les toasts soient écrasés par des re-renders rapides
    setTimeout(() => {
      toast.success(message, {
        id: `toast-${key}-${Date.now()}`, // ID unique pour éviter les doublons
      });
    }, 0);
  },
  error: (key: keyof typeof defaultMessages, customMessage?: string) => {
    const message = customMessage || defaultMessages[key];
    // Utiliser setTimeout avec un délai minimal pour garantir l'affichage même après des invalidations
    setTimeout(() => {
      toast.error(message, {
        id: `toast-error-${key}-${Date.now()}`, // ID unique pour éviter les doublons
      });
    }, 0);
  },
  // Fonctions directes pour les messages personnalisés
  successDirect: (message: string) => {
    setTimeout(() => {
      toast.success(message, {
        id: `toast-success-${Date.now()}-${Math.random()}`, // ID unique
      });
    }, 0);
  },
  errorDirect: (message: string) => {
    setTimeout(() => {
      toast.error(message, {
        id: `toast-error-${Date.now()}-${Math.random()}`, // ID unique
      });
    }, 0);
  },
  loadingDirect: (message: string) => {
    setTimeout(() => {
      toast.loading(message, {
        id: `toast-loading-${Date.now()}-${Math.random()}`, // ID unique
      });
    }, 0);
  },
};
