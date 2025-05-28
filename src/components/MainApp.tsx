
import React, { useState } from 'react';
import { Header } from './layout/Header';
import { Sidebar } from './layout/Sidebar';
import { DashboardStats } from './dashboard/DashboardStats';
import { ClockInButton } from './clockin/ClockInButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

export const MainApp: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
              <p className="text-muted-foreground">
                Bem-vindo de volta, {user?.name}!
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
                  <CardDescription>Informações do seu turno</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Status</span>
                      <span className="text-green-600 font-medium">Trabalhando</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Horas Trabalhadas</span>
                      <span className="text-muted-foreground">7h 45m</span>
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
              <h2 className="text-2xl font-bold tracking-tight">Registro de Ponto</h2>
              <p className="text-muted-foreground">
                Registre sua entrada, saída e intervalos
              </p>
            </div>
            <div className="max-w-md mx-auto">
              <ClockInButton />
            </div>
          </div>
        );

      case 'timesheet':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Espelho de Ponto</h2>
              <p className="text-muted-foreground">
                Visualize seu histórico de registros
              </p>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">
                  Funcionalidade em desenvolvimento...
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case 'overtime':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Horas Extras</h2>
              <p className="text-muted-foreground">
                Gerencie suas horas extras
              </p>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">
                  Funcionalidade em desenvolvimento...
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case 'employees':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Funcionários</h2>
              <p className="text-muted-foreground">
                Gerencie os funcionários da empresa
              </p>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">
                  Funcionalidade em desenvolvimento...
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Relatórios</h2>
              <p className="text-muted-foreground">
                Gere relatórios detalhados
              </p>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">
                  Funcionalidade em desenvolvimento...
                </p>
              </CardContent>
            </Card>
          </div>
        );

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
        onSectionChange={setActiveSection}
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
