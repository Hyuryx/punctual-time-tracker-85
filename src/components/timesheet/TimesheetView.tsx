import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Download, Clock, MapPin, FileSpreadsheet } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

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
  locationName?: string;
  hasPhoto: boolean;
  status: 'complete' | 'incomplete' | 'absent';
}

<lov-add-dependency>xlsx@latest</lov-add-dependency>

export const TimesheetView: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('2024-01');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load real-time data from localStorage
  useEffect(() => {
    const loadTimeEntries = () => {
      const entries = JSON.parse(localStorage.getItem('timeEntries') || '[]');
      const processedEntries: TimeEntry[] = [];

      // Group entries by date
      const entriesByDate: { [key: string]: any[] } = {};
      entries.forEach((entry: any) => {
        const date = new Date(entry.timestamp).toISOString().split('T')[0];
        if (!entriesByDate[date]) entriesByDate[date] = [];
        entriesByDate[date].push(entry);
      });

      // Process each date
      Object.entries(entriesByDate).forEach(([date, dayEntries]) => {
        const sortedEntries = dayEntries.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        
        const entryTimes: any = {};
        let totalMinutes = 0;
        let lastEntry: Date | null = null;

        sortedEntries.forEach(entry => {
          const time = new Date(entry.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
          
          switch (entry.type) {
            case 'entry':
              entryTimes.entry = time;
              lastEntry = new Date(entry.timestamp);
              break;
            case 'break_start':
              entryTimes.breakStart = time;
              if (lastEntry) {
                totalMinutes += (new Date(entry.timestamp).getTime() - lastEntry.getTime()) / (1000 * 60);
                lastEntry = null;
              }
              break;
            case 'break_end':
              entryTimes.breakEnd = time;
              lastEntry = new Date(entry.timestamp);
              break;
            case 'exit':
              entryTimes.exit = time;
              if (lastEntry) {
                totalMinutes += (new Date(entry.timestamp).getTime() - lastEntry.getTime()) / (1000 * 60);
                lastEntry = null;
              }
              break;
          }
        });

        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.floor(totalMinutes % 60);
        const workedHours = `${hours}h ${minutes.toString().padStart(2, '0')}m`;
        
        const overtimeMinutes = Math.max(0, totalMinutes - 540); // 540 = 9 hours
        const overtimeHours = Math.floor(overtimeMinutes / 60);
        const overtimeMins = Math.floor(overtimeMinutes % 60);
        const overtime = `${overtimeHours}h ${overtimeMins.toString().padStart(2, '0')}m`;

        const status = entryTimes.entry && entryTimes.exit ? 'complete' : 
                      entryTimes.entry ? 'incomplete' : 'absent';

        processedEntries.push({
          id: date,
          date,
          entries: entryTimes,
          workedHours,
          overtime,
          location: sortedEntries[0]?.location || '',
          locationName: sortedEntries[0]?.locationName || '',
          hasPhoto: false,
          status
        });
      });

      setTimeEntries(processedEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    };

    loadTimeEntries();
    
    // Set up real-time sync
    const interval = setInterval(loadTimeEntries, 1000);
    return () => clearInterval(interval);
  }, []);

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

  const handleExportExcel = () => {
    const data = timeEntries.map(entry => ({
      'Data': new Date(entry.date).toLocaleDateString('pt-BR'),
      'Entrada': entry.entries.entry || '-',
      'Saída Almoço': entry.entries.breakStart || '-',
      'Volta Almoço': entry.entries.breakEnd || '-',
      'Saída': entry.entries.exit || '-',
      'Horas Trabalhadas': entry.workedHours,
      'Horas Extras': entry.overtime,
      'Status': entry.status === 'complete' ? 'Completo' : entry.status === 'incomplete' ? 'Incompleto' : 'Ausente',
      'Localização': entry.locationName || entry.location || '-'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Espelho de Ponto");
    
    XLSX.writeFile(wb, `espelho-ponto-${selectedMonth}.xlsx`);
    
    toast({
      title: "Arquivo exportado!",
      description: "O espelho de ponto foi exportado para Excel com sucesso.",
    });
  };

  const handleExportPDF = () => {
    // For PDF export, we'll use the browser's print functionality
    window.print();
    
    toast({
      title: "Exportando PDF...",
      description: "Use a função de impressão do navegador para salvar como PDF.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Espelho de Ponto</h2>
          <p className="text-muted-foreground">
            Visualize e exporte o registro detalhado de ponto (Sincronização em tempo real)
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportExcel} variant="outline">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Excel
          </Button>
          <Button onClick={handleExportPDF}>
            <Download className="mr-2 h-4 w-4" />
            PDF
          </Button>
        </div>
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
                  <TableCell className="font-medium text-orange-600">
                    {entry.overtime}
                  </TableCell>
                  <TableCell>{getStatusBadge(entry.status)}</TableCell>
                  <TableCell>
                    {entry.locationName && (
                      <Button size="sm" variant="outline">
                        <MapPin className="h-3 w-3 mr-1" />
                        {entry.locationName.substring(0, 20)}...
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {timeEntries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground">
                    Nenhum registro encontrado. Faça seu primeiro registro de ponto!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
