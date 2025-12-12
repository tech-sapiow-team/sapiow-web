"use client";

import { AsYouType, CountryCode, isValidPhoneNumber } from "libphonenumber-js";
import { useEffect, useRef, useState } from "react";
import {
  Country,
  countries,
  detectCountryFromPhone,
  findCountryByCode,
} from "../constants/countries";
import { searchCountriesTranslated } from "../utils/searchCountriesTranslated";

interface UsePhoneInputTranslatedProps {
  defaultCountry?: string;
  initialValue?: string;
  initialCountryCode?: string;
  onChange?: (value: string, country: Country, formattedValue: string) => void;
  getCountryName: (code: string) => string; // Function to get translated country name
}

export const usePhoneInputTranslated = ({
  defaultCountry = "SN",
  initialValue = "",
  initialCountryCode,
  onChange,
  getCountryName,
}: UsePhoneInputTranslatedProps) => {
  // Vérifier si le pays nécessite le 0 initial (France ou Émirats arabes unis)
  const needsLeadingZero = (countryCode: string) => {
    return countryCode === "FR" || countryCode === "AE";
  };

  // Retirer le 0 initial pour l'envoi au backend (FR/AE uniquement)
  const removeLeadingZeroForBackend = (value: string, countryCode: string) => {
    if (needsLeadingZero(countryCode) && value.startsWith("0")) {
      return value.substring(1);
    }
    return value;
  };

  // Ajouter le 0 initial pour l'affichage (FR/AE uniquement)
  const addLeadingZeroForDisplay = (value: string, countryCode: string) => {
    if (needsLeadingZero(countryCode) && value && !value.startsWith("0")) {
      return "0" + value;
    }
    return value;
  };

  // État pour le pays sélectionné avec détection automatique
  const [selectedCountry, setSelectedCountry] = useState<Country>(() => {
    if (initialValue || initialCountryCode) {
      return detectCountryFromPhone(initialValue, initialCountryCode);
    }
    return findCountryByCode(defaultCountry) || countries[0];
  });

  // État pour la valeur du champ téléphone (sans indicatif)
  // Pour FR/AE, on stocke avec le 0 pour faciliter l'affichage
  const [phoneValue, setPhoneValue] = useState(() => {
    if (initialValue) {
      const country =
        (initialCountryCode && findCountryByCode(initialCountryCode)) ||
        detectCountryFromPhone(initialValue, initialCountryCode);
      // S'assurer que la valeur stockée a le 0 pour FR/AE
      return addLeadingZeroForDisplay(initialValue, country.code);
    }
    return "";
  });

  // État pour la valeur formatée du numéro
  const [formattedValue, setFormattedValue] = useState(() => {
    if (initialValue && initialCountryCode) {
      const country =
        findCountryByCode(initialCountryCode) ||
        detectCountryFromPhone(initialValue, initialCountryCode);
      if (initialValue) {
        // Pour le formatage initial, ajouter le 0 si nécessaire
        const valueForFormatting = addLeadingZeroForDisplay(
          initialValue,
          country.code
        );
        const formatter = new AsYouType(country.code as CountryCode);
        return formatter.input(valueForFormatting);
      }
    }
    return "";
  });

  // État pour le dropdown
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fonctions utilitaires
  const openDropdown = () => {
    setIsOpen(true);
    setIsFocused(true);
  };
  const closeDropdown = () => {
    setIsOpen(false);
    setSearchTerm("");
    setIsFocused(false);
  };

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Écouter les changements des props pour mettre à jour les valeurs
  useEffect(() => {
    if (initialValue !== undefined && initialCountryCode) {
      const country = findCountryByCode(initialCountryCode);
      if (country) {
        setSelectedCountry(country);
        // S'assurer que la valeur stockée a le 0 pour FR/AE
        const valueWithZero = addLeadingZeroForDisplay(
          initialValue,
          country.code
        );
        setPhoneValue(valueWithZero);

        if (valueWithZero) {
          const formatter = new AsYouType(country.code as CountryCode);
          const formatted = formatter.input(valueWithZero);
          setFormattedValue(formatted);
        } else {
          setFormattedValue("");
        }
      }
    }
  }, [initialValue, initialCountryCode]);

  // Filtrer les pays selon la recherche avec traduction
  const filteredCountries = searchCountriesTranslated(
    searchTerm,
    getCountryName
  );

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    closeDropdown();

    if (phoneValue) {
      // Pour le formatage, utiliser la valeur avec le 0 initial si nécessaire
      const valueForFormatting = addLeadingZeroForDisplay(
        phoneValue,
        country.code
      );
      const formatter = new AsYouType(country.code as CountryCode);
      const newFormattedValue = formatter.input(valueForFormatting);
      setFormattedValue(newFormattedValue);

      // Envoyer la valeur sans le 0 initial au backend
      const valueForBackend = removeLeadingZeroForBackend(
        phoneValue,
        country.code
      );
      onChange?.(valueForBackend, country, newFormattedValue);
    } else {
      onChange?.(phoneValue, country, "");
    }
  };

  const handlePhoneChange = (value: string) => {
    const cleanValue = value.replace(/\D/g, "");
    // Stocker la valeur avec le 0 si elle est présente (pour l'affichage)
    setPhoneValue(cleanValue);

    // Pour le formatage, utiliser la valeur avec le 0 initial si nécessaire
    const valueForFormatting = addLeadingZeroForDisplay(
      cleanValue,
      selectedCountry.code
    );

    const formatter = new AsYouType(selectedCountry.code as CountryCode);
    const formatted = valueForFormatting
      ? formatter.input(valueForFormatting)
      : "";
    setFormattedValue(formatted);

    // Envoyer la valeur sans le 0 initial au backend
    const valueForBackend = removeLeadingZeroForBackend(
      cleanValue,
      selectedCountry.code
    );
    onChange?.(valueForBackend, selectedCountry, formatted);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      if (!isOpen) {
        setIsFocused(false);
      }
    }, 100);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const toggleDropdown = () => {
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  };

  const setCountry = (countryCode: string) => {
    const country = findCountryByCode(countryCode);
    if (country) {
      setSelectedCountry(country);
      if (phoneValue) {
        // Pour le formatage, utiliser la valeur avec le 0 initial si nécessaire
        const valueForFormatting = addLeadingZeroForDisplay(
          phoneValue,
          country.code
        );
        const formatter = new AsYouType(country.code as CountryCode);
        const newFormattedValue = formatter.input(valueForFormatting);
        setFormattedValue(newFormattedValue);

        // Envoyer la valeur sans le 0 initial au backend
        const valueForBackend = removeLeadingZeroForBackend(
          phoneValue,
          country.code
        );
        onChange?.(valueForBackend, country, newFormattedValue);
      } else {
        onChange?.(phoneValue, country, "");
      }
    }
  };

  const setPhone = (value: string) => {
    const cleanValue = value.replace(/\D/g, "");
    setPhoneValue(cleanValue);

    // Pour le formatage, utiliser la valeur avec le 0 initial si nécessaire
    const valueForFormatting = addLeadingZeroForDisplay(
      cleanValue,
      selectedCountry.code
    );
    const formatter = new AsYouType(selectedCountry.code as CountryCode);
    const formatted = valueForFormatting
      ? formatter.input(valueForFormatting)
      : "";
    setFormattedValue(formatted);

    // Envoyer la valeur sans le 0 initial au backend
    const valueForBackend = removeLeadingZeroForBackend(
      cleanValue,
      selectedCountry.code
    );
    onChange?.(valueForBackend, selectedCountry, formatted);
  };

  const reset = () => {
    setPhoneValue("");
    setFormattedValue("");
    setSelectedCountry(findCountryByCode(defaultCountry) || countries[0]);
    closeDropdown();
  };

  const isPhoneValid = () => {
    if (!phoneValue || phoneValue.trim().length === 0) {
      return false;
    }

    try {
      // Pour la validation, utiliser la valeur sans le 0 initial (comme pour le backend)
      const valueForValidation = removeLeadingZeroForBackend(
        phoneValue,
        selectedCountry.code
      );
      const fullNumber = `${selectedCountry.dialCode}${valueForValidation}`;
      return isValidPhoneNumber(
        fullNumber,
        selectedCountry.code as CountryCode
      );
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return {
    // État
    selectedCountry,
    phoneValue,
    formattedValue,
    isOpen,
    searchTerm,
    filteredCountries,
    dropdownRef,
    isFocused,

    // Actions
    handleCountrySelect,
    handlePhoneChange,
    handleSearchChange,
    handleInputFocus,
    handleInputBlur,
    toggleDropdown,
    openDropdown,
    closeDropdown,
    setCountry,
    setPhone,
    reset,

    // Utilitaires
    getFlagUrl: (country: Country) =>
      `https://flagcdn.com/w20/${country.flag}.png`,
    getFullPhoneNumber: () => {
      const valueForBackend = removeLeadingZeroForBackend(
        phoneValue,
        selectedCountry.code
      );
      return `${selectedCountry.dialCode}${valueForBackend}`;
    },
    getFormattedFullNumber: () =>
      formattedValue
        ? `${selectedCountry.dialCode} ${formattedValue}`
        : selectedCountry.dialCode,
    isValidPhone: () => phoneValue.trim().length > 0,
    isPhoneValid,
  };
};
