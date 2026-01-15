"use client";
import { VisioOption } from "@/hooks/useOnboardingExpert";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { Switch } from "../ui/switch";

interface VisioConfigurationProps {
  visioOptions: VisioOption[];
  onUpdateVisioOption: (
    index: number,
    field: keyof VisioOption,
    value: unknown
  ) => void;
}

export const VisioConfiguration: React.FC<VisioConfigurationProps> = ({
  visioOptions,
  onUpdateVisioOption,
}) => {
  const t = useTranslations();
  const [focusedFields, setFocusedFields] = useState<Set<number>>(new Set());

  const handleFocus = (index: number) => {
    setFocusedFields((prev) => new Set(prev).add(index));
  };

  const handleBlur = (index: number) => {
    setFocusedFields((prev) => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  };

  return (
    <div className="w-full max-w-[350px] sm:max-w-[380px] lg:max-w-[391px] flex flex-col ">
      <h2 className="text-sm sm:text-base lg:text-xl font-bold text-left pl-6 mb-8">
        {t("onboarding.addFirstVisio")}
      </h2>

      <div className="w-full space-y-4 mb-8">
        {visioOptions.map((option, idx) => (
          <div
            key={option.duration}
            className="flex items-center justify-between bg-white border-1 border-[#E5E7EB] rounded-[12px] px-4 py-3.5 w-[317px] h-[56px]"
          >
            <span className="text-base font-medium text-exford-blue w-24">
              {option.duration} {t("onboarding.minutes")}
            </span>

            <div
              className={`flex items-center gap-2 w-[98px] h-[40px] rounded-[8px] border-1 border-[#E5E7EB] ${
                !option.enabled ? "border-light-blue-gray" : ""
              }`}
            >
              <div className="relative flex-1">
                <input
                  type="number"
                  id={`price-${idx}`}
                  min="0"
                  disabled={!option.enabled}
                  value={option.price}
                  onChange={(e) =>
                    onUpdateVisioOption(idx, "price", e.target.value)
                  }
                  onFocus={() => handleFocus(idx)}
                  onBlur={() => handleBlur(idx)}
                  className={`block px-2 pb-2 pt-4 w-full text-base bg-transparent appearance-none focus:outline-none focus:ring-0 peer [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    option.enabled
                      ? "text-exford-blue focus:border-transparent"
                      : "text-[#64748B]"
                  }`}
                  placeholder=" "
                />
                <label
                  htmlFor={`price-${idx}`}
                  className={`absolute text-xs font-normal duration-300 transform scale-75 top-1 z-10 origin-[0] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-0 start-1 bg-white ${
                    option.enabled
                      ? "text-[#64748B] peer-focus:text-[#64748B]"
                      : "text-[#CBD5E1]"
                  }`}
                >
                  {option.price || focusedFields.has(idx) ? t("onboarding.price") : "0"}
                </label>
              </div>
              <span
                className={`text-lg font-bold pr-3 ${
                  !option.enabled ? "text-[#CBD5E1]" : "text-[#64748B]"
                }`}
              >
                €
              </span>
            </div>

            <Switch
              checked={option.enabled}
              onCheckedChange={(checked) =>
                onUpdateVisioOption(idx, "enabled", checked)
              }
              className="ml-4"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
