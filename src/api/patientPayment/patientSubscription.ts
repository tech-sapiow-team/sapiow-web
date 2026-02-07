import { apiClient } from "@/lib/api-client";

export const getPatientSubscription = async <T = unknown>(): Promise<T> => {
  return apiClient.get<T>("patient-subscription");
};

export const cancelPatientSubscription = async (
  subscriptionId: string | number
): Promise<unknown> => {
  return apiClient.delete(`patient-subscription/${subscriptionId}`);
};
