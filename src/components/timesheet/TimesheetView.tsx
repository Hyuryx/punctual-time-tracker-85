
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { format, parseISO, startOfDay, endOfDay, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TimeEntry {
  id: string;
  type: 'entry' | 'exit' | 'break_start' | 'break_end';
  timestamp: Date;
  location?: string;
  locationName?: string;
  accuracy?: number;
  locationSource?: string;
  synced: boolean;
}

interface DayEntry {
  date: Date;
  entries: TimeEntry[];
  totalHours: number;
  extraHours: number;
  status: 'complete' | 'incomplete' | 'missing';
}

export const TimesheetView: React.FC = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<DayEntry[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [selectedEmployee, setSelectedEmployee] = useState('all');

  useEffect(() => {
    loadTimeEntries();
  }, []);

  useEffect(() => {
    filterEntries();
  }, [timeEntries, selectedMonth, selectedEmployee]);

  const loadTimeEntries = () => {
    const entries = JSON.parse(localStorage.getItem('timeEntries') || '[]');
    const parsedEntries: TimeEntry[] = entries.map((entry: any) => ({
      ...entry,
      timestamp: new Date(entry.timestamp) // Garante que seja um objeto Date local
    }));
    setTimeEntries(parsedEntries);
  };

  const filterEntries = () => {
    // Criar data base para o mês selecionado no fuso horário local
    const [year, month] = selectedMonth.split('-').map(Number);
    const monthStart = new Date(year, month - 1, 1); // Mês no fuso local
    const monthEnd = new Date(year, month, 0, 23, 59, 59, 999); // Último dia do mês no fuso local

    console.log('Filtrando entradas para:', {
      selectedMonth,
      monthStart: monthStart.toLocaleString('pt-BR'),
      monthEnd: monthEnd.toLocaleString('pt-BR'),
      totalEntries: timeEntries.length
    });

    // Filtrar entradas do mês usando comparação de timestamps locais
    const monthEntries = timeEntries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      const isInMonth = entryDate >= monthStart && entryDate <= monthEnd;
      
      if (isInMonth) {
        console.log('Entrada incluída:', {
          timestamp: entryDate.toLocaleString('pt-BR'),
          type: entry.type
        });
      }
      
      return isInMonth;
    });

    // Agrupar por data local
    const entriesByDate = new Map<string, TimeEntry[]>();
    
    monthEntries.forEach(entry => {
      // Usar data local para agrupamento
      const localDate = new Date(entry.timestamp);
      const dateKey = format(localDate, 'yyyy-MM-dd'); // Formato local
      
      if (!entriesByDate.has(dateKey)) {
        entriesByDate.set(dateKey, []);
      }
      entriesByDate.get(dateKey)!.push(entry);
    });

    // Converter para array de DayEntry
    const dayEntries: DayEntry[] = Array.from(entriesByDate.entries()).map(([dateStr, entries]) => {
      const date = new Date(dateStr + 'T00:00:00'); // Data local sem conversão de fuso
      const sortedEntries = entries.sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      const { totalHours, extraHours, status } = calculateDayStats(sortedEntries);

      return {
        date,
        entries: sortedEntries,
        totalHours,
        extraHours,
        status
      };
    });

    // Ordenar por data (mais recente primeiro)
    dayEntries.sort((a, b) => b.date.getTime() - a.date.getTime());

    console.log('Entradas filtradas:', dayEntries.map(d => ({
      date: format(d.date, 'dd/MM/yyyy'),
      entries: d.entries.length,
      status: d.status
    })));

    setFilteredEntries(dayEntries);
  };

  const calculateDayStats = (entries: TimeEntry[]) => {
    if (entries.length === 0) {
      return { totalHours: 0, extraHours: 0, status: 'missing' as const };
    }

    // Calcular horas trabalhadas considerando entrada, saída e intervalos
    let totalMinutes = 0;
    let entryTime: Date | null = null;
    let breakStartTime: Date | null = null;
    let isComplete = false;

    entries.forEach(entry => {
      const entryDate = new Date(entry.timestamp);
      
      switch (entry.type) {
        case 'entry':
          entryTime = entryDate;
          break;
        case 'break_start':
          if (entryTime) {
            totalMinutes += (entryDate.getTime() - entryTime.getTime()) / 60000;
          }
          breakStartTime = entryDate;
          break;
        case 'break_end':
          entryTime = entryDate; // Reinicia contagem após o intervalo
          break;
        case 'exit':
          if (entryTime) {
            totalMinutes += (entryDate.getTime() - entryTime.getTime()) / 60000;
            isComplete = true;
          }
          break;
      }
    });

    const totalHours = totalMinutes / 60;
    const extraHours = Math.max(0, totalHours - 9); // Jornada de 9h
    const status = isComplete ? 'complete' : 'incomplete';

    return { totalHours, extraHours, status };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Completo</Badge>;
      case 'incomplete':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Incompleto</Badge>;
      case 'missing':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Ausente</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const getActionLabel = (action: string) => {
    const labels = {
      entry: 'Entrada',
      exit: 'Saída',
      break_start: 'Saída Almoço',
      break_end: 'Volta Almoço'
    };
    return labels[action as keyof typeof labels] || action;
  };

  // Gerar lista de meses para o select (últimos 12 meses)
  const generateMonthOptions = () => {
    const options = [];
    const now = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = format(date, 'yyyy-MM');
      const label = format(date, 'MMMM \'de\' yyyy', { locale: ptBR });
      options.push({ value, label });
    }
    
    return options;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Selecione o período e funcionário para visualizar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="month">Mês/Ano</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o mês" />
                </SelectTrigger>
                <SelectContent>
                  {generateMonthOptions().map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="employee">Funcionário</Label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione funcionário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os funcionários</SelectItem>
                  <SelectItem value="current">Usuário atual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Espelho de Ponto</CardTitle>
          <CardDescription>
            Registros de ponto do período selecionado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((dayEntry) => {
                  const entryTimes = {
                    entry: dayEntry.entries.find(e => e.type === 'entry'),
                    break_start: dayEntry.entries.find(e => e.type === 'break_start'),
                    break_end: dayEntry.entries.find(e => e.type === 'break_end'),
                    exit: dayEntry.entries.find(e => e.type === 'exit')
                  };

                  return (
                    <TableRow key={format(dayEntry.date, 'yyyy-MM-dd')}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <div>
                            <div className="font-medium">
                              {format(dayEntry.date, "EEE'.,'")}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {format(dayEntry.date, 'dd/MM')}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {entryTimes.entry ? (
                          <div className="text-sm">
                            {format(new Date(entryTimes.entry.timestamp), 'HH:mm')}
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        {entryTimes.break_start ? (
                          <div className="text-sm">
                            {format(new Date(entryTimes.break_start.timestamp), 'HH:mm')}
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        {entryTimes.break_end ? (
                          <div className="text-sm">
                            {format(new Date(entryTimes.break_end.timestamp), 'HH:mm')}
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        {entryTimes.exit ? (
                          <div className="text-sm">
                            {format(new Date(entryTimes.exit.timestamp), 'HH:mm')}
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">
                            {dayEntry.totalHours > 0 ? `${dayEntry.totalHours.toFixed(1)}h` : '0h 00m'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {dayEntry.extraHours > 0 ? (
                          <span className="text-sm font-medium text-orange-600">
                            {dayEntry.extraHours.toFixed(1)}h
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">0h 00m</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(dayEntry.status)}
                      </TableCell>
                      <TableCell>
                        {entryTimes.entry?.locationName ? (
                          <div className="flex items-center gap-2 max-w-xs">
                            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-xs truncate">
                              {entryTimes.entry.locationName}
                            </span>
                          </div>
                        ) : '-'}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredEntries.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground">
                      Nenhum registro encontrado para o período selecionado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
