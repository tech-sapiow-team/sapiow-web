// config

import { apiClient } from "@/lib/api-client";
import { showToast } from "@/utils/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Types
export interface ProAppointmentAllowDay {
  id: string | number; // L'API peut retourner un number
  created_at: string;
  pro_id: string;
  start_date: string;
  end_date: string;
}

export interface CreateAllowDayData {
  start_date: string;
  end_date: string;
}

export interface UpdateAllowDayData {
  id: string;
  start_date: string;
  end_date: string;
}

// GET - Récupérer toutes les périodes de disponibilité
export const useGetProAppointmentAllowDays = () => {
  return useQuery<ProAppointmentAllowDay[]>({
    queryKey: ["pro-appointment-allow-days"],
    queryFn: () => apiClient.get("pro-appointment-allow-day"),
  });
};

// POST - Créer une nouvelle période de disponibilité
interface CreateAllowDayOptions {
  showSuccessToast?: boolean;
  skipInvalidate?: boolean;
}

export const useCreateProAppointmentAllowDay = (
  options?: CreateAllowDayOptions
) => {
  const queryClient = useQueryClient();
  const { showSuccessToast = true, skipInvalidate = false } = options || {};

  return useMutation<ProAppointmentAllowDay[], Error, CreateAllowDayData>({
    mutationFn: async (data: CreateAllowDayData) => {
      return apiClient.post("pro-appointment-allow-day", data);
    },
    onSuccess: () => {
      // Invalider le cache pour recharger les données
      if (!skipInvalidate) {
        queryClient.invalidateQueries({
          queryKey: ["pro-appointment-allow-days"],
        });
      }
      if (showSuccessToast) {
        showToast.success("allowDayCreated");
      }
    },
    onError: (error: any) => {
      console.error("Failed to create allow day:", error);
      showToast.error("allowDayCreateError", error?.message);
    },
  });
};

// PUT - Mettre à jour une période de disponibilité
export const useUpdateProAppointmentAllowDay = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateData: UpdateAllowDayData) => {
      // L'ID est dans le body, pas dans l'URL
      // Convertir l'ID en string pour s'assurer que l'API reçoit le bon type
      return apiClient.put("pro-appointment-allow-day", {
        ...updateData,
        id: String(updateData.id),
      });
    },
    onSuccess: () => {
      // Invalider le cache pour recharger les données
      queryClient.invalidateQueries({
        queryKey: ["pro-appointment-allow-days"],
      });
      showToast.success("allowDayUpdated");
    },
    onError: (error: any) => {
      console.error("Failed to update allow day:", error);
      showToast.error("allowDayUpdateError", error?.message);
    },
  });
};

// DELETE - Supprimer une période de disponibilité
export const useDeleteProAppointmentAllowDay = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (allowDayId: string | number) => {
      // L'ID est dans le body, pas dans l'URL
      // Convertir en string pour s'assurer que l'API reçoit le bon type
      return apiClient.delete("pro-appointment-allow-day", {
        id: String(allowDayId),
      });
    },
    onSuccess: () => {
      // Invalider le cache pour recharger les données
      queryClient.invalidateQueries({
        queryKey: ["pro-appointment-allow-days"],
      });
      showToast.success("allowDayDeleted");
    },
    onError: (error: any) => {
      console.error("Failed to delete allow day:", error);
      showToast.error("allowDayDeleteError", error?.message);
    },
  });
};
