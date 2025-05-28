
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  address: string;
  isActive: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  department: string;
  position: string;
  avatar?: string;
  companyId: string;
  workSchedule: {
    monday: { start: string; end: string; };
    tuesday: { start: string; end: string; };
    wednesday: { start: string; end: string; };
    thursday: { start: string; end: string; };
    friday: { start: string; end: string; };
    saturday: { start: string; end: string; };
    sunday: { start: string; end: string; };
  };
  salary: number;
  admissionDate: string;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  currentCompany: Company | null;
  companies: Company[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchCompany: (companyId: string) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock companies
const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Empresa Principal LTDA',
    cnpj: '12.345.678/0001-90',
    address: 'Rua Principal, 123 - São Paulo/SP',
    isActive: true
  },
  {
    id: '2',
    name: 'Filial Norte LTDA',
    cnpj: '12.345.678/0002-71',
    address: 'Av. Norte, 456 - Manaus/AM',
    isActive: true
  }
];

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Administrador',
    email: 'admin@empresa.com',
    role: 'admin',
    department: 'TI',
    position: 'Gerente de TI',
    companyId: '1',
    workSchedule: {
      monday: { start: '08:00', end: '17:00' },
      tuesday: { start: '08:00', end: '17:00' },
      wednesday: { start: '08:00', end: '17:00' },
      thursday: { start: '08:00', end: '17:00' },
      friday: { start: '08:00', end: '17:00' },
      saturday: { start: '', end: '' },
      sunday: { start: '', end: '' }
    },
    salary: 8000,
    admissionDate: '2020-01-15',
    isActive: true
  },
  {
    id: '2',
    name: 'João Silva',
    email: 'joao@empresa.com',
    role: 'employee',
    department: 'Vendas',
    position: 'Vendedor',
    companyId: '1',
    workSchedule: {
      monday: { start: '08:00', end: '17:00' },
      tuesday: { start: '08:00', end: '17:00' },
      wednesday: { start: '08:00', end: '17:00' },
      thursday: { start: '08:00', end: '17:00' },
      friday: { start: '08:00', end: '17:00' },
      saturday: { start: '', end: '' },
      sunday: { start: '', end: '' }
    },
    salary: 3500,
    admissionDate: '2021-03-10',
    isActive: true
  },
  {
    id: '3',
    name: 'Maria Santos',
    email: 'maria@empresa.com',
    role: 'employee',
    department: 'RH',
    position: 'Analista de RH',
    companyId: '1',
    workSchedule: {
      monday: { start: '08:00', end: '17:00' },
      tuesday: { start: '08:00', end: '17:00' },
      wednesday: { start: '08:00', end: '17:00' },
      thursday: { start: '08:00', end: '17:00' },
      friday: { start: '08:00', end: '17:00' },
      saturday: { start: '', end: '' },
      sunday: { start: '', end: '' }
    },
    salary: 4200,
    admissionDate: '2019-07-22',
    isActive: true
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [companies] = useState<Company[]>(mockCompanies);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('currentUser');
    const savedCompany = localStorage.getItem('currentCompany');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedCompany) {
      setCurrentCompany(JSON.parse(savedCompany));
    } else if (savedUser) {
      // Set default company for user
      const userData = JSON.parse(savedUser);
      const userCompany = companies.find(c => c.id === userData.companyId);
      if (userCompany) {
        setCurrentCompany(userCompany);
        localStorage.setItem('currentCompany', JSON.stringify(userCompany));
      }
    }
    setIsLoading(false);
  }, [companies]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - in real app, this would be an API call
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && (password === 'admin123' || password === '123456')) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      
      // Set user's company as current
      const userCompany = companies.find(c => c.id === foundUser.companyId);
      if (userCompany) {
        setCurrentCompany(userCompany);
        localStorage.setItem('currentCompany', JSON.stringify(userCompany));
      }
      
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    setCurrentCompany(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentCompany');
  };

  const switchCompany = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    if (company && user?.role === 'admin') {
      setCurrentCompany(company);
      localStorage.setItem('currentCompany', JSON.stringify(company));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      currentCompany, 
      companies, 
      login, 
      logout, 
      switchCompany, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
