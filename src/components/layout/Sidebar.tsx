
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { 
  Clock, 
  BarChart3, 
  Users, 
  Settings, 
  Calendar,
  MapPin,
  FileText,
  Building,
  Timer,
  Shield,
  Clipboard
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

const sidebarItems: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'clock-in', label: 'Registro de Ponto', icon: Clock },
  { id: 'timesheet', label: 'Espelho de Ponto', icon: Calendar },
  { id: 'overtime', label: 'Horas Extras', icon: Timer },
  { id: 'vacation', label: 'Férias e Justificativas', icon: Clipboard },
  { id: 'employees', label: 'Funcionários', icon: Users, adminOnly: true },
  { id: 'reports', label: 'Relatórios', icon: FileText, adminOnly: true },
  { id: 'locations', label: 'Localizações', icon: MapPin, adminOnly: true },
  { id: 'companies', label: 'Empresas', icon: Building, adminOnly: true },
  { id: 'audit', label: 'Auditoria', icon: Shield, adminOnly: true },
  { id: 'settings', label: 'Configurações', icon: Settings, adminOnly: true },
];

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isCollapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection, 
  onSectionChange, 
  isCollapsed 
}) => {
  const { user } = useAuth();

  const filteredItems = sidebarItems.filter(item => 
    !item.adminOnly || user?.role === 'admin'
  );

  return (
    <aside className={cn(
      "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <nav className="p-4 space-y-2">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
