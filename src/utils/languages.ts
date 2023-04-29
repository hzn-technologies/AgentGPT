export type Language = {
  code: string;
  name: string;
  flag: string;
};

export const ENGLISH = { code: "en", name: "English", flag: "🇺🇸" };

export const availableLanguages: Language[] = [
  ENGLISH,
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "hr", name: "Hrvatski", flag: "🇭🇷" },
  { code: "lt", name: "Lietuvių", flag: "🇱🇹" },
  { code: "uk", name: "Українська", flag: "🇺🇦" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "hu", name: "Magyar", flag: "🇭🇺" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "ro", name: "Română", flag: "🇷🇴" },
  { code: "sk", name: "Slovenčina", flag: "🇸🇰" },
]

export const languages: Language[] = availableLanguages.sort((a, b) => a.name.localeCompare(b.name));