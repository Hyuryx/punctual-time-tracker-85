
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
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
  Clipboard,
  User,
  ContactRound
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
  { id: 'profile', label: 'Meu Perfil', icon: User, adminOnly: true },
  { id: 'timesheet', label: 'Espelho de Ponto', icon: Calendar },
  { id: 'overtime', label: 'Horas Extras', icon: Timer },
  { id: 'vacation', label: 'Férias e Justificativas', icon: Clipboard },
  { id: 'employees', label: 'Funcionários', icon: Users, adminOnly: true },
  { id: 'reports', label: 'Relatórios', icon: FileText, adminOnly: true },
  { id: 'locations', label: 'Localizações', icon: MapPin, adminOnly: true },
  { id: 'companies', label: 'Empresas', icon: Building, adminOnly: true },
  { id: 'contacts', label: 'Contatos', icon: ContactRound, adminOnly: true },
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
  const { t } = useLanguage();

  const filteredItems = sidebarItems.filter(item => 
    !item.adminOnly || user?.role === 'admin'
  );

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => window.dispatchEvent(new CustomEvent('closeSidebar'))}
        />
      )}
      
      <aside className={cn(
        "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex-shrink-0 z-50",
        "fixed inset-y-0 left-0 lg:relative lg:translate-x-0",
        isCollapsed ? "w-16 -translate-x-full lg:translate-x-0" : "w-64 translate-x-0"
      )}>
        <div className="h-full overflow-y-auto">
          <nav className="p-2 sm:p-4 space-y-1 sm:space-y-2">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id);
                    // Auto-close sidebar on mobile after selection
                    if (window.innerWidth < 1024) {
                      setTimeout(() => {
                        window.dispatchEvent(new CustomEvent('closeSidebar'));
                      }, 100);
                    }
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-2 sm:px-3 py-2 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors touch-manipulation",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};
