import React, { useState, useEffect } from 'react';
import { Header } from './layout/Header';
import { Sidebar } from './layout/Sidebar';
import { DashboardStats } from './dashboard/DashboardStats';
import { ClockInButton } from './clockin/ClockInButton';
import { EmployeeManagement } from './employees/EmployeeManagement';
import { ReportsManagement } from './reports/ReportsManagement';
import { CompanyManagement } from './companies/CompanyManagement';
import { SystemSettings } from './settings/SystemSettings';
import { VacationManagement } from './vacation/VacationManagement';
import { TimesheetView } from './timesheet/TimesheetView';
import { ContactManagement } from './contacts/ContactManagement';
import { ProfileManagement } from './profile/ProfileManagement';
import { LocationManagement } from './locations/LocationManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

export const MainApp: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // Start collapsed on mobile
  const { user } = useAuth();
  const { t } = useLanguage();

  // Load active section from localStorage on mount
  useEffect(() => {
    const savedSection = localStorage.getItem('activeSection');
    if (savedSection) {
      setActiveSection(savedSection);
    }
    
    // Set initial sidebar state based on screen size
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarCollapsed(false);
      } else {
        setSidebarCollapsed(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Listen for custom close sidebar event
    const handleCloseSidebar = () => setSidebarCollapsed(true);
    window.addEventListener('closeSidebar', handleCloseSidebar);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('closeSidebar', handleCloseSidebar);
    };
  }, []);

  // Save active section to localStorage whenever it changes
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    localStorage.setItem('activeSection', section);
  };

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Calculate recent activity including exit time
  const getRecentActivity = () => {
    const entries = JSON.parse(localStorage.getItem('timeEntries') || '[]');
    const today = new Date().toDateString();
    const todayEntries = entries.filter((entry: any) => 
      new Date(entry.timestamp).toDateString() === today
    ).sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    const activity = [];
    
    todayEntries.forEach((entry: any) => {
      const time = new Date(entry.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      
      switch (entry.type) {
        case 'entry':
          activity.push({ label: 'Entrada', time });
          break;
        case 'break_start':
          activity.push({ label: 'Início do Intervalo', time });
          break;
        case 'break_end':
          activity.push({ label: 'Fim do Intervalo', time });
          break;
        case 'exit':
          activity.push({ label: 'Fim do Expediente', time });
          break;
      }
    });

    return activity;
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        const recentActivity = getRecentActivity();
        
        return (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{t('dashboard')}</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {t('welcome')}, {user?.name}!
              </p>
            </div>
            <DashboardStats />
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg">Atividade Recente</CardTitle>
                  <CardDescription className="text-sm">Seus últimos registros de ponto</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.length > 0 ? (
                      recentActivity.map((activity, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{activity.label}</span>
                          <span className="text-muted-foreground">{activity.time}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        Nenhum registro hoje. Faça seu primeiro registro de ponto!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg">Status Atual</CardTitle>
                  <CardDescription className="text-sm">Informações do seu turno (9h + 1h almoço)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Status</span>
                      <span className="text-green-600 font-medium">Trabalhando</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Jornada Obrigatória</span>
                      <span className="text-muted-foreground">9h + 1h almoço</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Próxima Ação</span>
                      <span className="text-muted-foreground">Saída</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'clock-in':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{t('timeEntry')}</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Registre sua entrada, saída e intervalos (9h + 1h almoço)
              </p>
            </div>
            <div className="max-w-md mx-auto px-4">
              <ClockInButton />
            </div>
          </div>
        );

      case 'profile':
        return <ProfileManagement />;

      case 'timesheet':
        return <TimesheetView />;

      case 'overtime':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Horas Extras</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Gerencie suas horas extras (acima de 9h diárias)
              </p>
            </div>
            <Card>
              <CardContent className="p-4 sm:p-6">
                <p className="text-center text-sm sm:text-base text-muted-foreground">
                  Sistema de horas extras implementado com cálculo automático.
                  Qualquer tempo trabalhado acima de 9h é contabilizado como hora extra.
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case 'vacation':
        return <VacationManagement />;

      case 'employees':
        return <EmployeeManagement />;

      case 'reports':
        return <ReportsManagement />;

      case 'locations':
        return <LocationManagement />;

      case 'companies':
        return <CompanyManagement />;

      case 'contacts':
        return <ContactManagement />;

      case 'settings':
        return <SystemSettings />;

      default:
        return (
          <Card>
            <CardContent className="p-4 sm:p-6">
              <p className="text-center text-sm sm:text-base text-muted-foreground">
                Seção em desenvolvimento...
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 w-full">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        isCollapsed={sidebarCollapsed}
      />
      
      <div className="flex-1 flex flex-col min-w-0 w-full">
        <Header
          onToggleSidebar={handleToggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
        />
        
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
