
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Download, Clock, MapPin, Camera } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface TimeEntry {
  id: string;
  date: string;
  entries: {
    entry?: string;
    breakStart?: string;
    breakEnd?: string;
    exit?: string;
  };
  workedHours: string;
  overtime: string;
  location: string;
  hasPhoto: boolean;
  status: 'complete' | 'incomplete' | 'absent';
}

export const TimesheetView: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('2024-01');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const { user } = useAuth();

  const [timeEntries] = useState<TimeEntry[]>([
    {
      id: '1',
      date: '2024-01-15',
      entries: {
        entry: '08:00',
        breakStart: '12:00',
        breakEnd: '13:00',
        exit: '17:00'
      },
      workedHours: '8h 00m',
      overtime: '0h 00m',
      location: '-23.5505, -46.6333',
      hasPhoto: true,
      status: 'complete'
    },
    {
      id: '2',
      date: '2024-01-16',
      entries: {
        entry: '08:05',
        breakStart: '12:00',
        breakEnd: '13:00',
        exit: '17:30'
      },
      workedHours: '8h 25m',
      overtime: '0h 25m',
      location: '-23.5505, -46.6333',
      hasPhoto: true,
      status: 'complete'
    },
    {
      id: '3',
      date: '2024-01-17',
      entries: {
        entry: '08:00',
        breakStart: '12:00',
        breakEnd: '13:00'
      },
      workedHours: '5h 00m',
      overtime: '0h 00m',
      location: '-23.5505, -46.6333',
      hasPhoto: true,
      status: 'incomplete'
    },
    {
      id: '4',
      date: '2024-01-18',
      entries: {},
      workedHours: '0h 00m',
      overtime: '0h 00m',
      location: '',
      hasPhoto: false,
      status: 'absent'
    }
  ]);

  const calculateTotals = () => {
    let totalWorked = 0;
    let totalOvertime = 0;
    
    timeEntries.forEach(entry => {
      const [hours, minutes] = entry.workedHours.replace(/[hm]/g, '').split(' ').map(Number);
      const [overtimeHours, overtimeMinutes] = entry.overtime.replace(/[hm]/g, '').split(' ').map(Number);
      
      totalWorked += hours * 60 + minutes;
      totalOvertime += overtimeHours * 60 + overtimeMinutes;
    });

    const formatTime = (minutes: number) => {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      return `${h}h ${m.toString().padStart(2, '0')}m`;
    };

    return {
      totalWorked: formatTime(totalWorked),
      totalOvertime: formatTime(totalOvertime),
      workingDays: timeEntries.filter(e => e.status !== 'absent').length,
      absences: timeEntries.filter(e => e.status === 'absent').length
    };
  };

  const totals = calculateTotals();

  const getStatusBadge = (status: string) => {
    const colors = {
      complete: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      incomplete: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      absent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };

    const labels = {
      complete: 'Completo',
      incomplete: 'Incompleto',
      absent: 'Ausente'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const handleExportPDF = () => {
    console.log('Exporting timesheet to PDF...');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Espelho de Ponto</h2>
          <p className="text-muted-foreground">
            Visualize e exporte o registro detalhado de ponto
          </p>
        </div>
        <Button onClick={handleExportPDF}>
          <Download className="mr-2 h-4 w-4" />
          Exportar PDF
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Trabalhado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.totalWorked}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Horas Extras</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.totalOvertime}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Dias Trabalhados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.workingDays}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Faltas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.absences}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Selecione o período e funcionário para visualizar
          </CardDescription>
          <div className="flex gap-4">
            <div className="space-y-2">
              <Label htmlFor="month">Mês/Ano</Label>
              <Input
                id="month"
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
            </div>
            {user?.role === 'admin' && (
              <div className="space-y-2">
                <Label htmlFor="employee">Funcionário</Label>
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Selecione funcionário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os funcionários</SelectItem>
                    <SelectItem value="1">João Silva</SelectItem>
                    <SelectItem value="2">Maria Santos</SelectItem>
                    <SelectItem value="3">Carlos Oliveira</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Entrada</TableHead>
                <TableHead>Saída Almoço</TableHead>
                <TableHead>Volta Almoço</TableHead>
                <TableHead>Saída</TableHead>
                <TableHead>Horas Trabalhadas</TableHead>
                <TableHead>Horas Extras</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Foto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">
                    {new Date(entry.date).toLocaleDateString('pt-BR', { 
                      weekday: 'short', 
                      day: '2-digit', 
                      month: '2-digit' 
                    })}
                  </TableCell>
                  <TableCell>{entry.entries.entry || '-'}</TableCell>
                  <TableCell>{entry.entries.breakStart || '-'}</TableCell>
                  <TableCell>{entry.entries.breakEnd || '-'}</TableCell>
                  <TableCell>{entry.entries.exit || '-'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {entry.workedHours}
                    </div>
                  </TableCell>
                  <TableCell>{entry.overtime}</TableCell>
                  <TableCell>{getStatusBadge(entry.status)}</TableCell>
                  <TableCell>
                    {entry.location && (
                      <Button size="sm" variant="outline">
                        <MapPin className="h-3 w-3" />
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    {entry.hasPhoto && (
                      <Button size="sm" variant="outline">
                        <Camera className="h-3 w-3" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
