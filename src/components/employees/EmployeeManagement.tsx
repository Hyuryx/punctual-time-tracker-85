
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth, User } from '@/contexts/AuthContext';
import { Plus, Edit, Trash, Search, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const { user } = useAuth();
  const { toast } = useToast();

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setDialogMode('create');
    setShowDialog(true);
  };

  const handleEditEmployee = (employee: User) => {
    setSelectedEmployee(employee);
    setDialogMode('edit');
    setShowDialog(true);
  };

  const handleViewEmployee = (employee: User) => {
    setSelectedEmployee(employee);
    setDialogMode('view');
    setShowDialog(true);
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
                defaultValue={selectedEmployee?.name}
                disabled={dialogMode === 'view'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email"
                defaultValue={selectedEmployee?.email}
                disabled={dialogMode === 'view'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Departamento</Label>
              <Input 
                id="department"
                defaultValue={selectedEmployee?.department}
                disabled={dialogMode === 'view'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Cargo</Label>
              <Input 
                id="position"
                defaultValue={selectedEmployee?.position}
                disabled={dialogMode === 'view'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary">Salário</Label>
              <Input 
                id="salary"
                type="number"
                defaultValue={selectedEmployee?.salary}
                disabled={dialogMode === 'view'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admission">Data de Admissão</Label>
              <Input 
                id="admission"
                type="date"
                defaultValue={selectedEmployee?.admissionDate}
                disabled={dialogMode === 'view'}
              />
            </div>
          </div>

          {dialogMode !== 'view' && (
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setShowDialog(false)}>
                {dialogMode === 'create' ? 'Adicionar' : 'Salvar'}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
