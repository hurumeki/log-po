import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import ja from './ja';
import en from './en';
import { getUserData, setUserData } from '../db/db';

const translations = { ja, en };

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('ja');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getUserData('language', 'ja').then(saved => {
      setLangState(saved);
      setReady(true);
    });
  }, []);

  const setLang = useCallback(async (newLang) => {
    setLangState(newLang);
    await setUserData('language', newLang);
    document.documentElement.lang = newLang;
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = translations[lang] || translations.ja;

  if (!ready) return null;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
