
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Calendar, TrendingUp, Users } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon: Icon, trend }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">
        {description}
      </p>
      {trend && (
        <p className="text-xs text-green-600 mt-1">{trend}</p>
      )}
    </CardContent>
  </Card>
);

export const DashboardStats: React.FC = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Horas Trabalhadas Hoje"
        value="7h 45m"
        description="Meta: 8h"
        icon={Clock}
        trend="+15 min vs ontem"
      />
      <StatCard
        title="Horas Extras"
        value="2h 30m"
        description="Este mês"
        icon={TrendingUp}
        trend="+30 min vs mês anterior"
      />
      <StatCard
        title="Faltas"
        value="1"
        description="Este mês"
        icon={Calendar}
      />
      <StatCard
        title="Funcionários Ativos"
        value="127"
        description="Online agora: 89"
        icon={Users}
        trend="+2 novos esta semana"
      />
    </div>
  );
};
