import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

// Types
export interface Expert {
  id: string; // UUID
  user_id: string;
  first_name: string;
  last_name: string;
  avatar?: string | null;
  description?: string | null;
  domain_id: number;
  domains: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
  job?: string | null;
  language: string;
  linkedin?: string | null;
  website?: string | null;
  badge?: string | null; // Badge de l'expert (ex: "gold")
  appointment_notification_email: boolean;
  appointment_notification_sms: boolean;
  message_notification_email: boolean;
  message_notification_sms: boolean;
  promotions_notification_email: boolean;
  promotions_notification_sms: boolean;
  expertises?: any[]; // Peut être undefined
  pro_expertises?: any[]; // Nom alternatif utilisé par l'API
  schedules: any[];
  sessions: any[];
  created_at: string;
  updated_at: string;
}

export interface SearchExpertsParams {
  search?: string;
  searchFields?: string;
  orderBy?:
    | "id"
    | "patient_id"
    | "pro_id"
    | "session_id"
    | "appointment_at"
    | "status"
    | "created_at"
    | "updated_at";
  orderDirection?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export interface SearchExpertsResponse {
  data: Expert[];
  total?: number;
  limit?: number;
  offset?: number;
}

// Hook GET pour rechercher des experts
export const useSearchExperts = (params: SearchExpertsParams = {}) => {
  // Construction des paramètres de query
  const queryParams = new URLSearchParams();

  if (params.search) {
    queryParams.append("search", params.search);
  }
  if (params.searchFields) {
    queryParams.append("searchFields", params.searchFields);
  }
  if (params.orderBy) {
    queryParams.append("orderBy", params.orderBy);
  }
  if (params.orderDirection) {
    queryParams.append("orderDirection", params.orderDirection);
  }
  if (params.limit) {
    queryParams.append("limit", params.limit.toString());
  }
  if (params.offset) {
    queryParams.append("offset", params.offset.toString());
  }

  const queryString = queryParams.toString();
  const endpoint = queryString ? `search?${queryString}` : "search";

  return useQuery<Expert[]>({
    queryKey: ["experts", params],
    queryFn: () => apiClient.get<Expert[]>(endpoint),
  });
};

// Hook avec paramètres par défaut pour la liste des experts
export const useListExperts = ({
  search = "",
  searchFields,
  limit = 100,
  offset = 0,
}: Partial<SearchExpertsParams> = {}) => {
  return useSearchExperts({
    search,
    searchFields,
    limit,
    offset,
  });
};
