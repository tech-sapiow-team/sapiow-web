"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import * as React from "react";

import { cn } from "@/lib/utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-[#004aa9] data-[state=unchecked]:bg-light-gray focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-light-gray dark:data-[state=checked]:bg-[#004aa9] inline-flex h-8 w-[50px] shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-white data-[state=checked]:bg-white data-[state=unchecked]:bg-white dark:data-[state=unchecked]:bg-gray-300 dark:data-[state=checked]:bg-white pointer-events-none block size-6 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[22px] data-[state=unchecked]:translate-x-1"
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
