
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Plus, Eye, Edit, Trash, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface VacationRequest {
  id: string;
  employeeName: string;
  type: 'vacation' | 'medical' | 'personal' | 'maternity' | 'paternity' | 'justification';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  approvedBy?: string;
  documents?: string[];
}

export const VacationManagement: React.FC = () => {
  const [requests, setRequests] = useState<VacationRequest[]>([
    {
      id: '1',
      employeeName: 'João Silva',
      type: 'vacation',
      startDate: '2024-02-15',
      endDate: '2024-02-29',
      days: 15,
      reason: 'Férias anuais - viagem em família',
      status: 'approved',
      requestDate: '2024-01-15',
      approvedBy: 'Maria Santos'
    },
    {
      id: '2',
      employeeName: 'Carlos Oliveira',
      type: 'medical',
      startDate: '2024-01-20',
      endDate: '2024-01-22',
      days: 3,
      reason: 'Atestado médico - consulta especializada',
      status: 'pending',
      requestDate: '2024-01-19',
      documents: ['atestado_medico.pdf']
    }
  ]);
  
  const [selectedRequest, setSelectedRequest] = useState<VacationRequest | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [formData, setFormData] = useState({
    type: 'vacation' as 'vacation' | 'medical' | 'personal' | 'maternity' | 'paternity' | 'justification',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const { user } = useAuth();
  const { toast } = useToast();

  const getTypeLabel = (type: string) => {
    const labels = {
      vacation: 'Férias',
      medical: 'Atestado Médico',
      personal: 'Licença Pessoal',
      maternity: 'Licença Maternidade',
      paternity: 'Licença Paternidade',
      justification: 'Justificativa'
    };
    return labels[type as keyof typeof labels] || type;
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

  const calculateDays = (start: string, end: string, type: string) => {
    if (!start || !end) return 0;
    
    // Justificativas não contabilizam dias
    if (type === 'justification') return 0;
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleViewRequest = (request: VacationRequest) => {
    setSelectedRequest(request);
    setFormData({
      type: request.type,
      startDate: request.startDate,
      endDate: request.endDate,
      reason: request.reason
    });
    setDialogMode('view');
    setShowDialog(true);
  };

  const handleEditRequest = (request: VacationRequest) => {
    setSelectedRequest(request);
    setFormData({
      type: request.type,
      startDate: request.startDate,
      endDate: request.endDate,
      reason: request.reason
    });
    setDialogMode('edit');
    setShowDialog(true);
  };

  const handleNewRequest = () => {
    setSelectedRequest(null);
    setFormData({
      type: 'vacation' as 'vacation' | 'medical' | 'personal' | 'maternity' | 'paternity' | 'justification',
      startDate: '',
      endDate: '',
      reason: ''
    });
    setDialogMode('create');
    setShowDialog(true);
  };

  const handleSaveRequest = () => {
    const days = calculateDays(formData.startDate, formData.endDate, formData.type);
    
    if (dialogMode === 'create') {
      const newRequest: VacationRequest = {
        id: Date.now().toString(),
        employeeName: user?.name || '',
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate,
        days,
        reason: formData.reason,
        status: 'pending',
        requestDate: new Date().toISOString().split('T')[0]
      };
      setRequests(prev => [...prev, newRequest]);
      toast({
        title: "Solicitação criada",
        description: "Sua solicitação foi enviada para aprovação.",
      });
    } else if (dialogMode === 'edit' && selectedRequest) {
      setRequests(prev => prev.map(req => 
        req.id === selectedRequest.id 
          ? { ...req, type: formData.type, startDate: formData.startDate, endDate: formData.endDate, reason: formData.reason, days }
          : req
      ));
      toast({
        title: "Solicitação atualizada",
        description: "As alterações foram salvas com sucesso.",
      });
    }
    setShowDialog(false);
  };

  const handleApproveRequest = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: 'approved' as const, approvedBy: user?.name }
        : req
    ));
    toast({
      title: "Solicitação aprovada",
      description: "A solicitação foi aprovada com sucesso.",
    });
  };

  const handleRejectRequest = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: 'rejected' as const, approvedBy: user?.name }
        : req
    ));
    toast({
      title: "Solicitação rejeitada",
      description: "A solicitação foi rejeitada.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestão de Férias e Justificativas</h2>
          <p className="text-muted-foreground">
            Gerencie férias, atestados, licenças e justificativas
          </p>
        </div>
        <Button onClick={handleNewRequest}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Solicitação
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Férias Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {requests.filter(r => r.type === 'vacation' && r.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Atestados Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {requests.filter(r => r.type === 'medical' && r.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aprovadas Este Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {requests.filter(r => r.status === 'approved').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Dias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {requests.filter(r => r.status === 'approved' && r.type !== 'justification').reduce((acc, r) => acc + r.days, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Solicitações</CardTitle>
          <CardDescription>
            Lista de todas as solicitações de férias, justificativas e licenças
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Funcionário</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Dias</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Solicitação</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.employeeName}</TableCell>
                  <TableCell>{getTypeLabel(request.type)}</TableCell>
                  <TableCell>
                    {new Date(request.startDate).toLocaleDateString('pt-BR')} - {' '}
                    {new Date(request.endDate).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    {request.type === 'justification' ? (
                      <span className="text-muted-foreground">N/A</span>
                    ) : (
                      `${request.days} dias`
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>{new Date(request.requestDate).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewRequest(request)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      {(user?.role === 'admin' || request.employeeName === user?.name) && request.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditRequest(request)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      )}
                      {user?.role === 'admin' && request.status === 'pending' && (
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600"
                            onClick={() => handleApproveRequest(request.id)}
                          >
                            ✓
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600"
                            onClick={() => handleRejectRequest(request.id)}
                          >
                            ✗
                          </Button>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' && 'Nova Solicitação'}
              {dialogMode === 'edit' && 'Editar Solicitação'}
              {dialogMode === 'view' && 'Detalhes da Solicitação'}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === 'create' && 'Preencha os dados da nova solicitação'}
              {dialogMode === 'edit' && 'Edite os dados da solicitação'}
              {dialogMode === 'view' && 'Visualize os detalhes completos da solicitação'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {dialogMode === 'view' && selectedRequest && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Funcionário</Label>
                    <p className="text-sm font-medium">{selectedRequest.employeeName}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                  </div>
                  <div>
                    <Label>Tipo</Label>
                    <p className="text-sm">{getTypeLabel(selectedRequest.type)}</p>
                  </div>
                  <div>
                    <Label>Total de Dias</Label>
                    <p className="text-sm font-medium">
                      {selectedRequest.type === 'justification' ? 'N/A' : `${selectedRequest.days} dias`}
                    </p>
                  </div>
                </div>
                <div>
                  <Label>Período</Label>
                  <p className="text-sm">
                    {new Date(selectedRequest.startDate).toLocaleDateString('pt-BR')} a {' '}
                    {new Date(selectedRequest.endDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <Label>Justificativa/Motivo</Label>
                  <p className="text-sm bg-muted p-3 rounded-md">{selectedRequest.reason}</p>
                </div>
                {selectedRequest.approvedBy && (
                  <div>
                    <Label>Aprovado por</Label>
                    <p className="text-sm">{selectedRequest.approvedBy}</p>
                  </div>
                )}
                {selectedRequest.documents && selectedRequest.documents.length > 0 && (
                  <div>
                    <Label>Documentos</Label>
                    <div className="flex gap-2 mt-1">
                      {selectedRequest.documents.map((doc, index) => (
                        <Button key={index} variant="outline" size="sm">
                          <FileText className="h-3 w-3 mr-1" />
                          {doc}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {dialogMode !== 'view' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as 'vacation' | 'medical' | 'personal' | 'maternity' | 'paternity' | 'justification' }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vacation">Férias</SelectItem>
                      <SelectItem value="medical">Atestado Médico</SelectItem>
                      <SelectItem value="personal">Licença Pessoal</SelectItem>
                      <SelectItem value="maternity">Licença Maternidade</SelectItem>
                      <SelectItem value="paternity">Licença Paternidade</SelectItem>
                      <SelectItem value="justification">Justificativa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Dias</Label>
                  <p className="text-sm font-medium pt-2">
                    {formData.type === 'justification' ? 'N/A' : `${calculateDays(formData.startDate, formData.endDate, formData.type)} dias`}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Data Início</Label>
                  <Input 
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Data Fim</Label>
                  <Input 
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="reason">
                    {formData.type === 'justification' ? 'Justificativa' : 'Justificativa/Motivo'}
                  </Label>
                  <Textarea 
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder={
                      formData.type === 'justification' 
                        ? "Descreva o motivo da justificativa (ex: atraso, saída antecipada)..." 
                        : "Descreva o motivo da solicitação..."
                    }
                    rows={3}
                  />
                </div>
              </div>
            )}
          </div>

          {dialogMode !== 'view' && (
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveRequest}>
                {dialogMode === 'create' ? 'Criar Solicitação' : 'Salvar Alterações'}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
