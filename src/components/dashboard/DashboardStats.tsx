
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Calendar, TrendingUp, Users, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
  isNegative?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon: Icon, trend, isNegative }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-4 w-4 ${isNegative ? 'text-red-500' : 'text-muted-foreground'}`} />
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold ${isNegative ? 'text-red-600' : ''}`}>{value}</div>
      <p className="text-xs text-muted-foreground">
        {description}
      </p>
      {trend && (
        <p className={`text-xs mt-1 ${isNegative ? 'text-red-600' : 'text-green-600'}`}>{trend}</p>
      )}
    </CardContent>
  </Card>
);

export const DashboardStats: React.FC = () => {
  // Calculate real-time hours based on localStorage entries
  const calculateWorkedHours = () => {
    const entries = JSON.parse(localStorage.getItem('timeEntries') || '[]');
    const today = new Date().toDateString();
    const todayEntries = entries.filter((entry: any) => 
      new Date(entry.timestamp).toDateString() === today
    );

    if (todayEntries.length === 0) return { worked: '0h 00m', overtime: '0h 00m', negative: '0h 00m', isNegative: false };

    let totalMinutes = 0;
    let lastEntry = null;

    for (const entry of todayEntries) {
      if (entry.type === 'entry') {
        lastEntry = new Date(entry.timestamp);
      } else if (entry.type === 'break_start' && lastEntry) {
        totalMinutes += (new Date(entry.timestamp).getTime() - lastEntry.getTime()) / (1000 * 60);
        lastEntry = null;
      } else if (entry.type === 'break_end') {
        lastEntry = new Date(entry.timestamp);
      } else if (entry.type === 'exit' && lastEntry) {
        totalMinutes += (new Date(entry.timestamp).getTime() - lastEntry.getTime()) / (1000 * 60);
        lastEntry = null;
      }
    }

    // If still working, add current time
    if (lastEntry) {
      totalMinutes += (new Date().getTime() - lastEntry.getTime()) / (1000 * 60);
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    
    // Calculate overtime (anything over 9 hours)
    const overtimeMinutes = Math.max(0, totalMinutes - 540); // 540 = 9 hours
    const overtimeHours = Math.floor(overtimeMinutes / 60);
    const overtimeMins = Math.floor(overtimeMinutes % 60);

    // Calculate negative hours (if less than 9 hours and day is complete)
    const hasExit = todayEntries.some((entry: any) => entry.type === 'exit');
    const negativeMinutes = hasExit && totalMinutes < 540 ? 540 - totalMinutes : 0;
    const negativeHours = Math.floor(negativeMinutes / 60);
    const negativeMins = Math.floor(negativeMinutes % 60);

    return {
      worked: `${hours}h ${minutes.toString().padStart(2, '0')}m`,
      overtime: `${overtimeHours}h ${overtimeMins.toString().padStart(2, '0')}m`,
      negative: `${negativeHours}h ${negativeMins.toString().padStart(2, '0')}m`,
      isNegative: negativeMinutes > 0
    };
  };

  const { worked, overtime, negative, isNegative } = calculateWorkedHours();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Horas Trabalhadas Hoje"
        value={worked}
        description="Meta: 9h (+ 1h almoço = 10h totais)"
        icon={Clock}
        trend={worked !== '0h 00m' ? '+' + worked + ' registradas' : undefined}
      />
      <StatCard
        title="Horas Extras"
        value={overtime}
        description="Hoje (acima de 9h)"
        icon={TrendingUp}
        trend={overtime !== '0h 00m' ? 'Contabilizadas automaticamente' : undefined}
      />
      {isNegative && (
        <StatCard
          title="Horas Negativas"
          value={negative}
          description="Déficit do dia (abaixo de 9h)"
          icon={TrendingDown}
          trend="Precisa compensar essas horas"
          isNegative={true}
        />
      )}
      {!isNegative && (
        <StatCard
          title="Faltas"
          value="0"
          description="Este mês"
          icon={Calendar}
        />
      )}
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
