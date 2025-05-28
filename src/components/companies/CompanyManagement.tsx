
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth, Company } from '@/contexts/AuthContext';
import { Plus, Edit, Building, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const CompanyManagement: React.FC = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const { companies, currentCompany, switchCompany, user } = useAuth();
  const { toast } = useToast();

  const handleAddCompany = () => {
    setSelectedCompany(null);
    setDialogMode('create');
    setShowDialog(true);
  };

  const handleEditCompany = (company: Company) => {
    setSelectedCompany(company);
    setDialogMode('edit');
    setShowDialog(true);
  };

  const handleSwitchCompany = (companyId: string) => {
    switchCompany(companyId);
    toast({
      title: "Empresa alterada",
      description: "Você está agora operando na empresa selecionada.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestão de Empresas</h2>
          <p className="text-muted-foreground">
            Gerencie múltiplas empresas sem precisar deslogar
          </p>
        </div>
        {user?.role === 'admin' && (
          <Button onClick={handleAddCompany}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Empresa
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Empresa Atual</CardTitle>
          <CardDescription>
            Empresa atualmente selecionada para operação
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentCompany && (
            <div className="flex items-center gap-4 p-4 border rounded-lg bg-accent/50">
              <Building className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <h3 className="font-semibold">{currentCompany.name}</h3>
                <p className="text-sm text-muted-foreground">CNPJ: {currentCompany.cnpj}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {currentCompany.address}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Empresas Disponíveis</CardTitle>
          <CardDescription>
            Lista de todas as empresas cadastradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome da Empresa</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.id} className={currentCompany?.id === company.id ? 'bg-accent/50' : ''}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      {company.name}
                      {currentCompany?.id === company.id && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                          Atual
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{company.cnpj}</TableCell>
                  <TableCell>{company.address}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      company.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {company.isActive ? 'Ativa' : 'Inativa'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {user?.role === 'admin' && currentCompany?.id !== company.id && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSwitchCompany(company.id)}
                        >
                          Selecionar
                        </Button>
                      )}
                      {user?.role === 'admin' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCompany(company)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' ? 'Adicionar Empresa' : 'Editar Empresa'}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === 'create' 
                ? 'Preencha os dados da nova empresa' 
                : 'Edite os dados da empresa'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Nome da Empresa</Label>
              <Input 
                id="company-name" 
                defaultValue={selectedCompany?.name}
                placeholder="Digite o nome da empresa"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input 
                id="cnpj"
                defaultValue={selectedCompany?.cnpj}
                placeholder="00.000.000/0000-00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input 
                id="address"
                defaultValue={selectedCompany?.address}
                placeholder="Digite o endereço completo"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setShowDialog(false)}>
              {dialogMode === 'create' ? 'Adicionar' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
