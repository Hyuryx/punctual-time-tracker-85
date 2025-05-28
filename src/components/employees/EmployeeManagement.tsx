
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth, User } from '@/contexts/AuthContext';
import { Plus, Edit, Trash, Search, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const departments = [
  'TI', 'RH', 'MARKETING', 'CONTABILIDADE', 'FINANCEIRO',
  'VENDAS', 'ATENDIMENTO', 'JURIDICO', 'ADMINISTRATIVO',
  'OPERACIONAL', 'COMERCIAL', 'COMPRAS', 'LOGISTICA',
  'AUDITORIA', 'QUALIDADE', 'PRODUCAO', 'MANUTENCAO'
];

export const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<User[]>([
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@empresa.com',
      role: 'employee',
      department: 'TI',
      position: 'Desenvolvedor',
      avatar: '',
      companyId: '1',
      workSchedule: {
        monday: { start: '08:00', end: '18:00' },
        tuesday: { start: '08:00', end: '18:00' },
        wednesday: { start: '08:00', end: '18:00' },
        thursday: { start: '08:00', end: '18:00' },
        friday: { start: '08:00', end: '18:00' },
        saturday: { start: '', end: '' },
        sunday: { start: '', end: '' }
      },
      salary: 5500,
      admissionDate: '2023-01-15',
      isActive: true
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@empresa.com',
      role: 'employee',
      department: 'RH',
      position: 'Analista de RH',
      avatar: '',
      companyId: '1',
      workSchedule: {
        monday: { start: '08:00', end: '18:00' },
        tuesday: { start: '08:00', end: '18:00' },
        wednesday: { start: '08:00', end: '18:00' },
        thursday: { start: '08:00', end: '18:00' },
        friday: { start: '08:00', end: '18:00' },
        saturday: { start: '', end: '' },
        sunday: { start: '', end: '' }
      },
      salary: 4200,
      admissionDate: '2022-03-10',
      isActive: true
    },
    {
      id: '3',
      name: 'Carlos Oliveira',
      email: 'carlos@empresa.com',
      role: 'employee',
      department: 'MARKETING',
      position: 'Analista de Marketing',
      avatar: '',
      companyId: '1',
      workSchedule: {
        monday: { start: '08:00', end: '18:00' },
        tuesday: { start: '08:00', end: '18:00' },
        wednesday: { start: '08:00', end: '18:00' },
        thursday: { start: '08:00', end: '18:00' },
        friday: { start: '08:00', end: '18:00' },
        saturday: { start: '', end: '' },
        sunday: { start: '', end: '' }
      },
      salary: 4800,
      admissionDate: '2023-06-01',
      isActive: true
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    salary: 0,
    admissionDate: ''
  });
  const { user } = useAuth();
  const { toast } = useToast();

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setFormData({
      name: '',
      email: '',
      department: '',
      position: '',
      salary: 0,
      admissionDate: ''
    });
    setDialogMode('create');
    setShowDialog(true);
  };

  const handleEditEmployee = (employee: User) => {
    setSelectedEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      position: employee.position,
      salary: employee.salary,
      admissionDate: employee.admissionDate
    });
    setDialogMode('edit');
    setShowDialog(true);
  };

  const handleViewEmployee = (employee: User) => {
    setSelectedEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      position: employee.position,
      salary: employee.salary,
      admissionDate: employee.admissionDate
    });
    setDialogMode('view');
    setShowDialog(true);
  };

  const handleSaveEmployee = () => {
    if (dialogMode === 'create') {
      const newEmployee: User = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role: 'employee',
        department: formData.department,
        position: formData.position,
        avatar: '',
        companyId: '1',
        workSchedule: {
          monday: { start: '08:00', end: '18:00' },
          tuesday: { start: '08:00', end: '18:00' },
          wednesday: { start: '08:00', end: '18:00' },
          thursday: { start: '08:00', end: '18:00' },
          friday: { start: '08:00', end: '18:00' },
          saturday: { start: '', end: '' },
          sunday: { start: '', end: '' }
        },
        salary: formData.salary,
        admissionDate: formData.admissionDate,
        isActive: true
      };
      setEmployees(prev => [...prev, newEmployee]);
      toast({
        title: "Funcionário adicionado",
        description: "O funcionário foi adicionado com sucesso.",
      });
    } else if (dialogMode === 'edit' && selectedEmployee) {
      setEmployees(prev => prev.map(emp => 
        emp.id === selectedEmployee.id 
          ? { ...emp, ...formData }
          : emp
      ));
      toast({
        title: "Funcionário atualizado",
        description: "Os dados do funcionário foram atualizados com sucesso.",
      });
    }
    setShowDialog(false);
  };

  const handleDeleteEmployee = (employeeId: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
    toast({
      title: "Funcionário removido",
      description: "O funcionário foi removido com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestão de Funcionários</h2>
          <p className="text-muted-foreground">
            Gerencie todos os funcionários da empresa
          </p>
        </div>
        {user?.role === 'admin' && (
          <Button onClick={handleAddEmployee}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Funcionário
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Funcionários Cadastrados</CardTitle>
          <CardDescription>
            Lista de todos os funcionários ativos na empresa
          </CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar funcionários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Salário</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>R$ {employee.salary.toLocaleString('pt-BR')}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      employee.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {employee.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewEmployee(employee)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      {user?.role === 'admin' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditEmployee(employee)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteEmployee(employee.id)}
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </>
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
              {dialogMode === 'create' && 'Adicionar Funcionário'}
              {dialogMode === 'edit' && 'Editar Funcionário'}
              {dialogMode === 'view' && 'Detalhes do Funcionário'}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === 'create' && 'Preencha os dados do novo funcionário'}
              {dialogMode === 'edit' && 'Edite os dados do funcionário'}
              {dialogMode === 'view' && 'Visualize os dados do funcionário'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input 
                id="name" 
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                disabled={dialogMode === 'view'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                disabled={dialogMode === 'view'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Departamento</Label>
              <Select 
                value={formData.department} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
                disabled={dialogMode === 'view'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um departamento" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Cargo</Label>
              <Input 
                id="position"
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                disabled={dialogMode === 'view'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary">Salário</Label>
              <Input 
                id="salary"
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData(prev => ({ ...prev, salary: Number(e.target.value) }))}
                disabled={dialogMode === 'view'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admission">Data de Admissão</Label>
              <Input 
                id="admission"
                type="date"
                value={formData.admissionDate}
                onChange={(e) => setFormData(prev => ({ ...prev, admissionDate: e.target.value }))}
                disabled={dialogMode === 'view'}
              />
            </div>
          </div>

          {dialogMode !== 'view' && (
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEmployee}>
                {dialogMode === 'create' ? 'Adicionar' : 'Salvar'}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
