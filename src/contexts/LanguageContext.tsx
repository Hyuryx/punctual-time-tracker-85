
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'pt-BR' | 'pt-PT' | 'es-ES' | 'en-US';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  'pt-BR': {
    'dashboard': 'Dashboard',
    'timeEntry': 'Registro de Ponto',
    'employees': 'Funcionários',
    'reports': 'Relatórios',
    'settings': 'Configurações',
    'profile': 'Perfil',
    'vacation': 'Férias e Justificativas',
    'timesheet': 'Espelho de Ponto',
    'locations': 'Localizações',
    'logout': 'Sair',
    'welcome': 'Bem-vindo de volta',
    'workingHours': 'Horas Trabalhadas',
    'overtime': 'Horas Extras',
    'absences': 'Faltas',
    'activeEmployees': 'Funcionários Ativos'
  },
  'pt-PT': {
    'dashboard': 'Painel de Controlo',
    'timeEntry': 'Registo de Ponto',
    'employees': 'Funcionários',
    'reports': 'Relatórios',
    'settings': 'Definições',
    'profile': 'Perfil',
    'vacation': 'Férias e Justificações',
    'timesheet': 'Espelho de Ponto',
    'locations': 'Localizações',
    'logout': 'Terminar Sessão',
    'welcome': 'Bem-vindo de volta',
    'workingHours': 'Horas Trabalhadas',
    'overtime': 'Horas Extra',
    'absences': 'Faltas',
    'activeEmployees': 'Funcionários Activos'
  },
  'es-ES': {
    'dashboard': 'Panel de Control',
    'timeEntry': 'Registro de Tiempo',
    'employees': 'Empleados',
    'reports': 'Informes',
    'settings': 'Configuración',
    'profile': 'Perfil',
    'vacation': 'Vacaciones y Justificaciones',
    'timesheet': 'Hoja de Tiempo',
    'locations': 'Ubicaciones',
    'logout': 'Cerrar Sesión',
    'welcome': 'Bienvenido de vuelta',
    'workingHours': 'Horas Trabajadas',
    'overtime': 'Horas Extra',
    'absences': 'Ausencias',
    'activeEmployees': 'Empleados Activos'
  },
  'en-US': {
    'dashboard': 'Dashboard',
    'timeEntry': 'Time Entry',
    'employees': 'Employees',
    'reports': 'Reports',
    'settings': 'Settings',
    'profile': 'Profile',
    'vacation': 'Vacation & Justifications',
    'timesheet': 'Timesheet',
    'locations': 'Locations',
    'logout': 'Logout',
    'welcome': 'Welcome back',
    'workingHours': 'Working Hours',
    'overtime': 'Overtime',
    'absences': 'Absences',
    'activeEmployees': 'Active Employees'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt-BR');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
