import { apiClient } from "@/lib/api-client";

export const getProSubscription = async <T = unknown>(): Promise<T> => {
  return apiClient.get<T>("pro-subscription");
};

export const cancelProSubscription = async (
  subscriptionId: string | number,
  options?: { refund?: boolean }
): Promise<unknown> => {
  return apiClient.delete(
    `pro-subscription/${subscriptionId}`,
    options?.refund ? { refund: true } : undefined
  );
};
