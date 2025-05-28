
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Download, FileText, BarChart3, Clock, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const reportTypes = [
  { id: 'timesheet', name: 'Espelho de Ponto', icon: Clock, description: 'Relatório detalhado de registros de ponto' },
  { id: 'overtime', name: 'Horas Extras', icon: BarChart3, description: 'Relatório de horas extras trabalhadas' },
  { id: 'absences', name: 'Faltas e Atrasos', icon: Calendar, description: 'Relatório de faltas e atrasos' },
  { id: 'employees', name: 'Funcionários', icon: Users, description: 'Relatório de dados dos funcionários' },
  { id: 'attendance', name: 'Frequência', icon: FileText, description: 'Relatório de frequência mensal' },
  { id: 'vacation', name: 'Férias', icon: Calendar, description: 'Relatório de férias e licenças' },
  { id: 'audit', name: 'Auditoria', icon: FileText, description: 'Log de atividades do sistema' },
  { id: 'payroll', name: 'Folha de Pagamento', icon: BarChart3, description: 'Relatório para folha de pagamento' },
  { id: 'productivity', name: 'Produtividade', icon: BarChart3, description: 'Relatório de produtividade por departamento' },
];

export const ReportsManagement: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const { toast } = useToast();

  const handleGenerateReport = () => {
    if (!selectedReport) {
      toast({
        title: "Erro",
        description: "Selecione um tipo de relatório",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Relatório gerado!",
      description: "O relatório foi gerado com sucesso e será baixado em breve.",
    });

    // Simulate report generation
    console.log('Generating report:', {
      type: selectedReport,
      startDate,
      endDate,
      employee: selectedEmployee,
      department: selectedDepartment
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Relatórios</h2>
        <p className="text-muted-foreground">
          Gere relatórios detalhados sobre ponto, frequência e produtividade
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <Card 
              key={report.id}
              className={`cursor-pointer transition-colors hover:bg-accent ${
                selectedReport === report.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedReport(report.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{report.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{report.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações do Relatório</CardTitle>
          <CardDescription>
            Configure os parâmetros para gerar o relatório selecionado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Data Inicial</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">Data Final</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employee">Funcionário (Opcional)</Label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os funcionários" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os funcionários</SelectItem>
                  <SelectItem value="1">João Silva</SelectItem>
                  <SelectItem value="2">Maria Santos</SelectItem>
                  <SelectItem value="3">Carlos Oliveira</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Departamento (Opcional)</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os departamentos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os departamentos</SelectItem>
                  <SelectItem value="vendas">Vendas</SelectItem>
                  <SelectItem value="rh">RH</SelectItem>
                  <SelectItem value="ti">TI</SelectItem>
                  <SelectItem value="financeiro">Financeiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleGenerateReport} className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Gerar Relatório
            </Button>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Visualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Relatórios Rápidos</CardTitle>
          <CardDescription>
            Acesso rápido aos relatórios mais utilizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="justify-start">
              <Clock className="mr-2 h-4 w-4" />
              Ponto Hoje
            </Button>
            <Button variant="outline" className="justify-start">
              <BarChart3 className="mr-2 h-4 w-4" />
              Horas Extras Mês
            </Button>
            <Button variant="outline" className="justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              Faltas Mês
            </Button>
            <Button variant="outline" className="justify-start">
              <Users className="mr-2 h-4 w-4" />
              Funcionários Ativos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
