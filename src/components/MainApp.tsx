
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
import { AuditLog } from './audit/AuditLog';
import { ProfileManagement } from './profile/ProfileManagement';
import { LocationManagement } from './locations/LocationManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

export const MainApp: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();
  const { t } = useLanguage();

  // Load active section from localStorage on mount
  useEffect(() => {
    const savedSection = localStorage.getItem('activeSection');
    if (savedSection) {
      setActiveSection(savedSection);
    }
  }, []);

  // Save active section to localStorage whenever it changes
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    localStorage.setItem('activeSection', section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{t('dashboard')}</h2>
              <p className="text-muted-foreground">
                {t('welcome')}, {user?.name}!
              </p>
            </div>
            <DashboardStats />
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Atividade Recente</CardTitle>
                  <CardDescription>Seus últimos registros de ponto</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Entrada</span>
                      <span className="text-muted-foreground">08:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Início do Intervalo</span>
                      <span className="text-muted-foreground">12:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fim do Intervalo</span>
                      <span className="text-muted-foreground">13:00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Status Atual</CardTitle>
                  <CardDescription>Informações do seu turno (9h + 1h almoço)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Status</span>
                      <span className="text-green-600 font-medium">Trabalhando</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Jornada Obrigatória</span>
                      <span className="text-muted-foreground">9h + 1h almoço</span>
                    </div>
                    <div className="flex justify-between">
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
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{t('timeEntry')}</h2>
              <p className="text-muted-foreground">
                Registre sua entrada, saída e intervalos (9h + 1h almoço)
              </p>
            </div>
            <div className="max-w-md mx-auto">
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
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Horas Extras</h2>
              <p className="text-muted-foreground">
                Gerencie suas horas extras (acima de 9h diárias)
              </p>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">
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

      case 'audit':
        return <AuditLog />;

      case 'settings':
        return <SystemSettings />;

      default:
        return (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                Seção em desenvolvimento...
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        isCollapsed={sidebarCollapsed}
      />
      
      <div className="flex-1 flex flex-col">
        <Header
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          sidebarCollapsed={sidebarCollapsed}
        />
        
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
