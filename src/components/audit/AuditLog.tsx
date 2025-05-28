
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  result: 'success' | 'failure' | 'warning';
}

export const AuditLog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [filterResult, setFilterResult] = useState('');

  const [auditEntries] = useState<AuditEntry[]>([
    {
      id: '1',
      timestamp: '2024-01-20 14:30:25',
      user: 'admin@empresa.com',
      action: 'LOGIN',
      resource: 'Sistema',
      details: 'Login realizado com sucesso',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      result: 'success'
    },
    {
      id: '2',
      timestamp: '2024-01-20 14:25:12',
      user: 'joao@empresa.com',
      action: 'CLOCK_IN',
      resource: 'Registro de Ponto',
      details: 'Entrada registrada às 08:00',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)',
      result: 'success'
    },
    {
      id: '3',
      timestamp: '2024-01-20 14:20:45',
      user: 'maria@empresa.com',
      action: 'UPDATE_EMPLOYEE',
      resource: 'Funcionário #123',
      details: 'Dados do funcionário alterados',
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      result: 'success'
    },
    {
      id: '4',
      timestamp: '2024-01-20 14:15:30',
      user: 'carlos@empresa.com',
      action: 'LOGIN_FAILED',
      resource: 'Sistema',
      details: 'Tentativa de login com senha incorreta',
      ipAddress: '192.168.1.103',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      result: 'failure'
    },
    {
      id: '5',
      timestamp: '2024-01-20 14:10:15',
      user: 'admin@empresa.com',
      action: 'GENERATE_REPORT',
      resource: 'Relatório de Ponto',
      details: 'Relatório mensal gerado',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      result: 'success'
    },
    {
      id: '6',
      timestamp: '2024-01-20 14:05:00',
      user: 'sistema',
      action: 'AUTO_BACKUP',
      resource: 'Banco de Dados',
      details: 'Backup automático realizado',
      ipAddress: 'localhost',
      userAgent: 'Sistema Interno',
      result: 'success'
    }
  ]);

  const filteredEntries = auditEntries.filter(entry => {
    const matchesSearch = 
      entry.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = !filterAction || entry.action === filterAction;
    const matchesUser = !filterUser || entry.user === filterUser;
    const matchesResult = !filterResult || entry.result === filterResult;
    
    return matchesSearch && matchesAction && matchesUser && matchesResult;
  });

  const getResultBadge = (result: string) => {
    const colors = {
      success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      failure: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    };

    const labels = {
      success: 'Sucesso',
      failure: 'Falha',
      warning: 'Aviso'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[result as keyof typeof colors]}`}>
        {labels[result as keyof typeof labels]}
      </span>
    );
  };

  const getActionLabel = (action: string) => {
    const labels: { [key: string]: string } = {
      'LOGIN': 'Login',
      'LOGOUT': 'Logout',
      'LOGIN_FAILED': 'Login Falhado',
      'CLOCK_IN': 'Entrada',
      'CLOCK_OUT': 'Saída',
      'UPDATE_EMPLOYEE': 'Atualização Funcionário',
      'CREATE_EMPLOYEE': 'Criação Funcionário',
      'DELETE_EMPLOYEE': 'Exclusão Funcionário',
      'GENERATE_REPORT': 'Geração Relatório',
      'UPDATE_SETTINGS': 'Atualização Configurações',
      'AUTO_BACKUP': 'Backup Automático'
    };
    return labels[action] || action;
  };

  const uniqueActions = [...new Set(auditEntries.map(entry => entry.action))];
  const uniqueUsers = [...new Set(auditEntries.map(entry => entry.user))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Log de Auditoria</h2>
          <p className="text-muted-foreground">
            Acompanhe todas as atividades realizadas no sistema
          </p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Exportar Log
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Use os filtros abaixo para encontrar atividades específicas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar nos logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="action-filter">Ação</Label>
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as ações" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as ações</SelectItem>
                  {uniqueActions.map(action => (
                    <SelectItem key={action} value={action}>
                      {getActionLabel(action)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="user-filter">Usuário</Label>
              <Select value={filterUser} onValueChange={setFilterUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os usuários" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os usuários</SelectItem>
                  {uniqueUsers.map(user => (
                    <SelectItem key={user} value={user}>
                      {user}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="result-filter">Resultado</Label>
              <Select value={filterResult} onValueChange={setFilterResult}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os resultados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os resultados</SelectItem>
                  <SelectItem value="success">Sucesso</SelectItem>
                  <SelectItem value="failure">Falha</SelectItem>
                  <SelectItem value="warning">Aviso</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setFilterAction('');
                  setFilterUser('');
                  setFilterResult('');
                }}
                className="w-full"
              >
                <Filter className="mr-2 h-4 w-4" />
                Limpar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
          <CardDescription>
            {filteredEntries.length} atividade(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Recurso</TableHead>
                <TableHead>Detalhes</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Resultado</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">
                    {new Date(entry.timestamp).toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell>{entry.user}</TableCell>
                  <TableCell>{getActionLabel(entry.action)}</TableCell>
                  <TableCell>{entry.resource}</TableCell>
                  <TableCell className="max-w-xs truncate">{entry.details}</TableCell>
                  <TableCell>{entry.ipAddress}</TableCell>
                  <TableCell>{getResultBadge(entry.result)}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3" />
                    </Button>
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
