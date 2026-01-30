"use client";

import { useGetCustomer, useUpdateCustomer } from "@/api/customer/useCustomer";
import {
    useGetProExpert,
    useUpdateProExpert,
} from "@/api/proExpert/useProExpert";
import { useEffect, useRef } from "react";

export function TimezoneUpdater() {
  const { data: customer } = useGetCustomer();
  const { data: proExpert } = useGetProExpert();
  const { mutate: updateCustomer } = useUpdateCustomer();
  const { mutate: updateProExpert } = useUpdateProExpert();

  // Utiliser des refs pour éviter les mises à jour multiples dans la même session
  const hasUpdatedCustomer = useRef(false);
  const hasUpdatedProExpert = useRef(false);

  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (customer && customer.timezone !== timezone && !hasUpdatedCustomer.current) {
      console.log("Updating customer timezone to:", timezone);
      updateCustomer({ timezone });
      hasUpdatedCustomer.current = true;
    }

    if (
      proExpert &&
      proExpert.timezone !== timezone &&
      !hasUpdatedProExpert.current
    ) {
      console.log("Updating proExpert timezone to:", timezone);
      updateProExpert({ timezone });
      hasUpdatedProExpert.current = true;
    }
  }, [customer, proExpert, updateCustomer, updateProExpert]);

  return null;
}
