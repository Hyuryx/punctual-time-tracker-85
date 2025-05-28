import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Mail, Phone, Building, Users, Globe, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddContactForm } from './AddContactForm';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  company: string;
  linkedin?: string;
  whatsapp?: string;
  website?: string;
}

export const ContactManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('todos');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'João Silva',
      email: 'joao.silva@empresa.com',
      phone: '(11) 99999-1234',
      department: 'TI',
      position: 'Desenvolvedor Senior',
      company: 'Empresa Tecnologia Ltda',
      linkedin: 'linkedin.com/in/joaosilva',
      whatsapp: '11999991234',
      website: 'joaosilva.dev'
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria.santos@empresa.com',
      phone: '(11) 98888-5678',
      department: 'RH',
      position: 'Gerente de Recursos Humanos',
      company: 'Empresa Tecnologia Ltda',
      linkedin: 'linkedin.com/in/mariasantos',
      whatsapp: '11988885678'
    },
    {
      id: '3',
      name: 'Carlos Oliveira',
      email: 'carlos.oliveira@empresa.com',
      phone: '(11) 97777-9012',
      department: 'Vendas',
      position: 'Diretor Comercial',
      company: 'Empresa Tecnologia Ltda',
      linkedin: 'linkedin.com/in/carlosoliveira',
      whatsapp: '11977779012',
      website: 'carlosvendas.com.br'
    },
    {
      id: '4',
      name: 'Ana Costa',
      email: 'ana.costa@empresa.com',
      phone: '(11) 96666-3456',
      department: 'Financeiro',
      position: 'Analista Financeira',
      company: 'Empresa Tecnologia Ltda',
      linkedin: 'linkedin.com/in/anacosta',
      whatsapp: '11966663456'
    },
    {
      id: '5',
      name: 'Pedro Almeida',
      email: 'pedro.almeida@parceiro.com',
      phone: '(21) 95555-7890',
      department: 'Parceiros',
      position: 'Consultor Técnico',
      company: 'Parceiros & Consultoria',
      linkedin: 'linkedin.com/in/pedroalmeida',
      whatsapp: '21955557890',
      website: 'parceirosconsultoria.com'
    },
    {
      id: '6',
      name: 'Luciana Ferreira',
      email: 'luciana.ferreira@fornecedor.com',
      phone: '(31) 94444-2468',
      department: 'Fornecedores',
      position: 'Representante Comercial',
      company: 'Fornecedores S.A.',
      linkedin: 'linkedin.com/in/lucianaferreira',
      whatsapp: '31944442468'
    }
  ]);

  const handleAddContact = (newContact: Contact) => {
    setContacts(prev => [...prev, newContact]);
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm) ||
      contact.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === 'todos' || contact.department === filterDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const departments = [...new Set(contacts.map(contact => contact.department))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Contatos</h2>
          <p className="text-muted-foreground">
            Gerencie contatos de funcionários, parceiros e fornecedores
          </p>
        </div>
        <Button onClick={() => setIsAddFormOpen(true)}>
          <Users className="mr-2 h-4 w-4" />
          Adicionar Contato
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Use os filtros abaixo para encontrar contatos específicos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar contatos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department-filter">Departamento</Label>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os departamentos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os departamentos</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setFilterDepartment('todos');
                }}
                className="w-full"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Contatos</CardTitle>
          <CardDescription>
            {filteredContacts.length} contato(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Redes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                        {contact.email}
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${contact.phone}`} className="hover:underline">
                        {contact.phone}
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>{contact.position}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {contact.department}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      {contact.company}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {contact.linkedin && (
                        <a 
                          href={`https://${contact.linkedin}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                          title="LinkedIn"
                        >
                          <Users className="h-4 w-4" />
                        </a>
                      )}
                      {contact.whatsapp && (
                        <a 
                          href={`https://wa.me/${contact.whatsapp}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800"
                          title="WhatsApp"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </a>
                      )}
                      {contact.website && (
                        <a 
                          href={`https://${contact.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-800"
                          title="Website"
                        >
                          <Globe className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddContactForm
        open={isAddFormOpen}
        onOpenChange={setIsAddFormOpen}
        onAddContact={handleAddContact}
      />
    </div>
  );
};
