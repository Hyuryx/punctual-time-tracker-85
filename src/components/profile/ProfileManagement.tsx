
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Camera, Save, Edit, Monitor } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useScreenCapture } from '@/hooks/useScreenCapture';

export const ProfileManagement: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { captureScreen } = useScreenCapture();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
    position: user?.position || '',
    salary: user?.salary || 0,
    admissionDate: user?.admissionDate || '',
    workSchedule: user?.workSchedule || {
      monday: { start: '08:00', end: '18:00' },
      tuesday: { start: '08:00', end: '18:00' },
      wednesday: { start: '08:00', end: '18:00' },
      thursday: { start: '08:00', end: '18:00' },
      friday: { start: '08:00', end: '18:00' },
      saturday: { start: '', end: '' },
      sunday: { start: '', end: '' }
    }
  });

  const departments = [
    'TI', 'RH', 'MARKETING', 'CONTABILIDADE', 'FINANCEIRO',
    'VENDAS', 'ATENDIMENTO', 'JURIDICO', 'ADMINISTRATIVO',
    'OPERACIONAL', 'COMERCIAL', 'COMPRAS', 'LOGISTICA'
  ];

  const handlePhotoUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setProfileImage(result);
          localStorage.setItem('profileImage', result);
          toast({
            title: "Foto carregada!",
            description: "Sua foto de perfil foi atualizada com sucesso.",
          });
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Formato inválido",
          description: "Por favor, selecione apenas arquivos de imagem.",
          variant: "destructive",
        });
      }
    }
  };

  React.useEffect(() => {
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  const handleSave = () => {
    // In a real app, this would update the user data via API
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso.",
    });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleScheduleChange = (day: string, field: 'start' | 'end', value: string) => {
    setFormData(prev => ({
      ...prev,
      workSchedule: {
        ...prev.workSchedule,
        [day]: {
          ...prev.workSchedule[day as keyof typeof prev.workSchedule],
          [field]: value
        }
      }
    }));
  };

  if (user?.role !== 'admin') {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Acesso restrito para administradores
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Meu Perfil</h2>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais e configurações
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={captureScreen}
            variant="outline"
          >
            <Monitor className="mr-2 h-4 w-4" />
            Capturar Tela
          </Button>
          <Button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            variant={isEditing ? "default" : "outline"}
          >
            {isEditing ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar
              </>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Foto do Perfil</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Avatar className="w-32 h-32 mx-auto">
              <AvatarImage src={profileImage || user?.avatar} />
              <AvatarFallback className="text-2xl">
                {user?.name?.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <>
                <Button variant="outline" size="sm" onClick={handlePhotoUpload}>
                  <Camera className="mr-2 h-4 w-4" />
                  Alterar Foto
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  capture="environment"
                />
              </>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <Select 
                  value={formData.department} 
                  onValueChange={(value) => handleInputChange('department', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
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
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Salário</Label>
                <Input
                  id="salary"
                  type="number"
                  value={formData.salary}
                  onChange={(e) => handleInputChange('salary', Number(e.target.value))}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admission">Data de Admissão</Label>
                <Input
                  id="admission"
                  type="date"
                  value={formData.admissionDate}
                  onChange={(e) => handleInputChange('admissionDate', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Horário de Trabalho</CardTitle>
          <CardDescription>
            Configure seus horários de trabalho (9h + 1h almoço = 10h diárias)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {Object.entries(formData.workSchedule).map(([day, schedule]) => (
              <div key={day} className="flex items-center gap-4">
                <div className="w-24">
                  <Label className="capitalize">{day === 'monday' ? 'Segunda' : 
                    day === 'tuesday' ? 'Terça' : 
                    day === 'wednesday' ? 'Quarta' : 
                    day === 'thursday' ? 'Quinta' : 
                    day === 'friday' ? 'Sexta' : 
                    day === 'saturday' ? 'Sábado' : 'Domingo'}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={schedule.start}
                    onChange={(e) => handleScheduleChange(day, 'start', e.target.value)}
                    disabled={!isEditing}
                    className="w-32"
                  />
                  <span>às</span>
                  <Input
                    type="time"
                    value={schedule.end}
                    onChange={(e) => handleScheduleChange(day, 'end', e.target.value)}
                    disabled={!isEditing}
                    className="w-32"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
