
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Plus, Eye, CheckCircle, XCircle, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VacationRequest {
  id: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  days: number;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  requestDate: string;
}

interface Justification {
  id: string;
  employeeName: string;
  date: string;
  type: 'absence' | 'late' | 'early_leave';
  reason: string;
  document?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const VacationManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'vacation' | 'justifications'>('vacation');
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'vacation' | 'justification'>('vacation');
  const { toast } = useToast();

  const [vacationRequests] = useState<VacationRequest[]>([
    {
      id: '1',
      employeeName: 'João Silva',
      startDate: '2024-02-15',
      endDate: '2024-02-25',
      days: 10,
      status: 'pending',
      reason: 'Férias familiares',
      requestDate: '2024-01-15'
    },
    {
      id: '2',
      employeeName: 'Maria Santos',
      startDate: '2024-03-01',
      endDate: '2024-03-15',
      days: 15,
      status: 'approved',
      reason: 'Viagem de descanso',
      requestDate: '2024-01-10'
    }
  ]);

  const [justifications] = useState<Justification[]>([
    {
      id: '1',
      employeeName: 'Carlos Oliveira',
      date: '2024-01-20',
      type: 'late',
      reason: 'Trânsito intenso na cidade',
      status: 'pending'
    },
    {
      id: '2',
      employeeName: 'Ana Costa',
      date: '2024-01-18',
      type: 'absence',
      reason: 'Consulta médica',
      document: 'atestado_medico.pdf',
      status: 'approved'
    }
  ]);

  const handleApproveVacation = (id: string) => {
    toast({
      title: "Férias aprovadas!",
      description: "A solicitação de férias foi aprovada com sucesso.",
    });
  };

  const handleRejectVacation = (id: string) => {
    toast({
      title: "Férias rejeitadas",
      description: "A solicitação de férias foi rejeitada.",
      variant: "destructive",
    });
  };

  const handleApproveJustification = (id: string) => {
    toast({
      title: "Justificativa aprovada!",
      description: "A justificativa foi aprovada com sucesso.",
    });
  };

  const handleRejectJustification = (id: string) => {
    toast({
      title: "Justificativa rejeitada",
      description: "A justificativa foi rejeitada.",
      variant: "destructive",
    });
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };

    const labels = {
      pending: 'Pendente',
      approved: 'Aprovado',
      rejected: 'Rejeitado'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      absence: 'Falta',
      late: 'Atraso',
      early_leave: 'Saída Antecipada'
    };
    return labels[type as keyof typeof labels];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {activeTab === 'vacation' ? 'Gestão de Férias' : 'Gestão de Justificativas'}
          </h2>
          <p className="text-muted-foreground">
            {activeTab === 'vacation' 
              ? 'Gerencie solicitações de férias dos funcionários'
              : 'Gerencie justificativas de faltas e atrasos'
            }
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={activeTab === 'vacation' ? 'default' : 'outline'}
            onClick={() => setActiveTab('vacation')}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Férias
          </Button>
          <Button 
            variant={activeTab === 'justifications' ? 'default' : 'outline'}
            onClick={() => setActiveTab('justifications')}
          >
            <FileText className="mr-2 h-4 w-4" />
            Justificativas
          </Button>
        </div>
      </div>

      {activeTab === 'vacation' && (
        <Card>
          <CardHeader>
            <CardTitle>Solicitações de Férias</CardTitle>
            <CardDescription>
              Todas as solicitações de férias pendentes e processadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Funcionário</TableHead>
                  <TableHead>Data Início</TableHead>
                  <TableHead>Data Fim</TableHead>
                  <TableHead>Dias</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vacationRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.employeeName}</TableCell>
                    <TableCell>{new Date(request.startDate).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{new Date(request.endDate).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{request.days} dias</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>{request.reason}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {request.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApproveVacation(request.id)}
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectVacation(request.id)}
                            >
                              <XCircle className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === 'justifications' && (
        <Card>
          <CardHeader>
            <CardTitle>Justificativas</CardTitle>
            <CardDescription>
              Justificativas de faltas, atrasos e saídas antecipadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Funcionário</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {justifications.map((justification) => (
                  <TableRow key={justification.id}>
                    <TableCell className="font-medium">{justification.employeeName}</TableCell>
                    <TableCell>{new Date(justification.date).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{getTypeLabel(justification.type)}</TableCell>
                    <TableCell>{justification.reason}</TableCell>
                    <TableCell>
                      {justification.document && (
                        <Button size="sm" variant="outline">
                          <FileText className="h-3 w-3 mr-1" />
                          Ver
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(justification.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {justification.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApproveJustification(justification.id)}
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectJustification(justification.id)}
                            >
                              <XCircle className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === 'vacation' ? 'Nova Solicitação de Férias' : 'Nova Justificativa'}
            </DialogTitle>
            <DialogDescription>
              {dialogType === 'vacation' 
                ? 'Preencha os dados para solicitar férias'
                : 'Preencha os dados da justificativa'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {dialogType === 'vacation' ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Data de Início</Label>
                    <Input id="start-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">Data de Fim</Label>
                    <Input id="end-date" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vacation-reason">Motivo</Label>
                  <Textarea id="vacation-reason" placeholder="Descreva o motivo das férias" />
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="justification-date">Data</Label>
                    <Input id="justification-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="justification-type">Tipo</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="absence">Falta</SelectItem>
                        <SelectItem value="late">Atraso</SelectItem>
                        <SelectItem value="early_leave">Saída Antecipada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="justification-reason">Motivo</Label>
                  <Textarea id="justification-reason" placeholder="Descreva o motivo" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="document">Documento Comprobatório (Opcional)</Label>
                  <Input id="document" type="file" accept=".pdf,.jpg,.jpeg,.png" />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setShowDialog(false)}>
              Enviar Solicitação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
