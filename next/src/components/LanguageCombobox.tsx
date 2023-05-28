import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { translate } from "../utils/translate";
import { findLanguage, languages } from "../utils/languages";
import { useRouter } from "next/router";
import Input from "./Input";
import { FaGlobe } from "react-icons/fa";

const LanguageCombobox = () => {
  const { i18n } = useTranslation();
  const router = useRouter();
  const [language, setLanguage] = useState(findLanguage(i18n.language));

  const handleInputChange = async (languageName: string) => {
    const selected = findLanguage(languageName);
    await i18n.changeLanguage(selected.code).then(() => {
      setLanguage(selected);
      handleLanguageChange(selected.code);
    });
  };

  const handleLanguageChange = (value: string) => {
    const { pathname, asPath, query } = router;
    router
      .push({ pathname, query }, asPath, {
        locale: value,
      })
      .catch(console.error);
  };

  return (
    <Input
      left={
        <>
          <FaGlobe />
          <span className="ml-2">{`${translate("LANG", "settings")}`}</span>
        </>
      }
      type="combobox"
      value={`${language.flag} ${language.name}`}
      onChange={(e) => void handleInputChange(e.target.value)}
      setValue={(e) => void handleInputChange(e)}
      attributes={{
        options: languages.map((lang) => `${lang.flag} ${lang.name}`),
      }}
    />
  );
};

export default LanguageCombobox;
