import { useState } from "react";
import { Combobox as ComboboxPrimitive } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

interface DisplayLanguageSelectorProps {
  onChange: (lang: string) => void;
}

const DisplayLanguageSelector = ({ onChange }: DisplayLanguageSelectorProps) => {
  const { i18n } = useTranslation();
  const [query, setQuery] = useState("");
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      event.target instanceof HTMLInputElement &&
      typeof event.target.value === "string"
    ) {
      setQuery(event.target.value);
    }
  };

  const options = Object.keys(i18n.languages).map((lang) => ({
    label: i18n.t(`common:${lang}`),
    value: lang,
  }));

  const filteredOptions =
    query === ""
      ? options
      : options.filter((opt) => {
          return opt.label.toLowerCase().includes(query.toLowerCase());
        });

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    onChange(value);
  };

  return (
    <ComboboxPrimitive
      value={i18n.language}
      onChange={(value: string) => handleLanguageChange(value)}
    >
      <div className="relative w-full">
        <ComboboxPrimitive.Input
          onChange={handleInputChange}
          className={clsx(
            "border:black delay-50 sm: flex w-full items-center justify-between rounded-xl border-[2px] border-white/10 bg-transparent px-2 py-2 text-sm tracking-wider outline-0 transition-all hover:border-[#1E88E5]/40 focus:border-[#1E88E5] sm:py-3 md:text-lg",
          )}
        />
        <ComboboxPrimitive.Button className="absolute inset-y-0 right-0 flex items-center pr-4">
          <FaChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </ComboboxPrimitive.Button>
        <ComboboxPrimitive.Options className="absolute right-0 top-full z-20 mt-1 max-h-48 w-full overflow-auto rounded-xl border-[2px] border-white/10 bg-[#3a3a3a] tracking-wider shadow-xl outline-0 transition-all ">
          {filteredOptions.map((opt) => (
            <ComboboxPrimitive.Option
              key={opt.value}
              value={opt.value}
              className="cursor-pointer px-2 py-2 font-mono text-sm text-white/75 hover:bg-blue-500 sm:py-3 md:text-lg"
            >
              <span className={`flag-icon flag-icon-${opt.value.toLowerCase()}`} />
              {opt.label}
            </ComboboxPrimitive.Option>
          ))}
        </ComboboxPrimitive.Options>
      </div>
    </ComboboxPrimitive>
  );
};

export default DisplayLanguageSelector;
