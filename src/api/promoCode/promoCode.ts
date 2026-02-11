import { getSupabaseFunctionErrorMessage } from "@/lib/supabase/handleFunctionError";
import { supabase } from "@/lib/supabase/client";

/**
 * Appelle l'Edge Function `promo` pour vérifier un code promo.
 *
 * Endpoint (Supabase Functions): POST /functions/v1/promo
 * Body: { code: string }
 */
export async function verifyPromoCode<TResponse = unknown>(
  code: string
): Promise<TResponse> {
  const { data, error } = await supabase.functions.invoke("promo", {
    method: "POST",
    body: { code },
  });

  if (error) {
    const errorMessage = await getSupabaseFunctionErrorMessage(error);
    console.error("verifyPromoCode returned an error:", errorMessage, error);
    throw new Error(errorMessage);
  }

  return data as TResponse;
}
