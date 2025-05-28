import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import { Save, Globe, Clock, Calculator, Bell, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const SystemSettings: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    // Configurações de Ponto
    workHours: 9,
    lunchHours: 1,
    autoClockOut: false,
    photoRequired: false,
    locationRequired: true,
    
    // Configurações de Horário
    startTime: '08:00',
    endTime: '18:00',
    flexibleSchedule: true,
    weekendWork: false,
    
    // Configurações de Cálculo
    overtimeRate: 1.5,
    nightShiftRate: 1.2,
    holidayRate: 2.0,
    autoCalculateOvertime: true,
    
    // Configurações de Notificação
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    reminderInterval: 30,
    
    // Configurações do Sistema
    backupFrequency: 'daily',
    sessionTimeout: 480,
    maxLoginAttempts: 5,
    passwordPolicy: 'strong'
  });

  const handleSave = () => {
    // Save settings to localStorage or send to API
    localStorage.setItem('systemSettings', JSON.stringify(settings));
    toast({
      title: "Configurações salvas",
      description: "Todas as configurações foram atualizadas com sucesso.",
    });
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as any);
    toast({
      title: "Idioma alterado",
      description: `Idioma alterado para ${newLanguage === 'pt-BR' ? 'Português (Brasil)' : 
        newLanguage === 'pt-PT' ? 'Português (Portugal)' : 
        newLanguage === 'es-ES' ? 'Español' : 'English'}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Configurações do Sistema</h2>
          <p className="text-muted-foreground">
            Configure todas as opções do sistema de ponto eletrônico
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Salvar Configurações
        </Button>
      </div>

      <Tabs defaultValue="point" className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="point" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Ponto
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Horários
          </TabsTrigger>
          <TabsTrigger value="calculation" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Cálculos
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Sistema
          </TabsTrigger>
        </TabsList>

        <TabsContent value="point" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Registro de Ponto</CardTitle>
              <CardDescription>
                Configure como o sistema deve tratar os registros de ponto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Horas de Trabalho Obrigatórias</Label>
                  <Input
                    type="number"
                    value={settings.workHours}
                    onChange={(e) => setSettings(prev => ({ ...prev, workHours: Number(e.target.value) }))}
                  />
                  <p className="text-xs text-muted-foreground">Horas diárias obrigatórias (atual: 9h)</p>
                </div>
                <div className="space-y-2">
                  <Label>Horas de Almoço</Label>
                  <Input
                    type="number"
                    value={settings.lunchHours}
                    onChange={(e) => setSettings(prev => ({ ...prev, lunchHours: Number(e.target.value) }))}
                  />
                  <p className="text-xs text-muted-foreground">Tempo de almoço obrigatório (atual: 1h)</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Foto Obrigatória</Label>
                    <p className="text-sm text-muted-foreground">Exigir foto para confirmar registro</p>
                  </div>
                  <Switch
                    checked={settings.photoRequired}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, photoRequired: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Localização Obrigatória</Label>
                    <p className="text-sm text-muted-foreground">Registrar localização GPS</p>
                  </div>
                  <Switch
                    checked={settings.locationRequired}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, locationRequired: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Saída Automática</Label>
                    <p className="text-sm text-muted-foreground">Registrar saída automaticamente após horário</p>
                  </div>
                  <Switch
                    checked={settings.autoClockOut}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoClockOut: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Cálculo</CardTitle>
              <CardDescription>
                Configure como o sistema deve calcular horas extras e adicionais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Taxa de Hora Extra</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={settings.overtimeRate}
                    onChange={(e) => setSettings(prev => ({ ...prev, overtimeRate: Number(e.target.value) }))}
                  />
                  <p className="text-xs text-muted-foreground">Multiplicador para horas extras</p>
                </div>
                <div className="space-y-2">
                  <Label>Taxa Noturna</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={settings.nightShiftRate}
                    onChange={(e) => setSettings(prev => ({ ...prev, nightShiftRate: Number(e.target.value) }))}
                  />
                  <p className="text-xs text-muted-foreground">Adicional noturno</p>
                </div>
                <div className="space-y-2">
                  <Label>Taxa de Feriado</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={settings.holidayRate}
                    onChange={(e) => setSettings(prev => ({ ...prev, holidayRate: Number(e.target.value) }))}
                  />
                  <p className="text-xs text-muted-foreground">Multiplicador para feriados</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Cálculo Automático de Horas Extras</Label>
                  <p className="text-sm text-muted-foreground">Calcular automaticamente horas acima de 9h</p>
                </div>
                <Switch
                  checked={settings.autoCalculateOvertime}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoCalculateOvertime: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais do Sistema</CardTitle>
              <CardDescription>
                Configure idioma, segurança e outras opções gerais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Idioma do Sistema
                  </Label>
                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="pt-PT">Português (Portugal)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                      <SelectItem value="en-US">English</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Selecione o idioma da interface</p>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Timeout de Sessão (minutos)</Label>
                    <Input
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Máximo de Tentativas de Login</Label>
                    <Input
                      type="number"
                      value={settings.maxLoginAttempts}
                      onChange={(e) => setSettings(prev => ({ ...prev, maxLoginAttempts: Number(e.target.value) }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Política de Senha</Label>
                  <Select 
                    value={settings.passwordPolicy} 
                    onValueChange={(value) => setSettings(prev => ({ ...prev, passwordPolicy: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weak">Fraca (mínimo 6 caracteres)</SelectItem>
                      <SelectItem value="medium">Média (8 caracteres + números)</SelectItem>
                      <SelectItem value="strong">Forte (8 caracteres + números + símbolos)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Frequência de Backup</Label>
                  <Select 
                    value={settings.backupFrequency} 
                    onValueChange={(value) => setSettings(prev => ({ ...prev, backupFrequency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">A cada hora</SelectItem>
                      <SelectItem value="daily">Diário</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Horário</CardTitle>
              <CardDescription>
                Defina as configurações de horário de trabalho padrão
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hora de Início Padrão</Label>
                  <Input
                    type="time"
                    value={settings.startTime}
                    onChange={(e) => setSettings(prev => ({ ...prev, startTime: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hora de Fim Padrão</Label>
                  <Input
                    type="time"
                    value={settings.endTime}
                    onChange={(e) => setSettings(prev => ({ ...prev, endTime: e.target.value }))}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Horário Flexível</Label>
                    <p className="text-sm text-muted-foreground">Permitir horários flexíveis</p>
                  </div>
                  <Switch
                    checked={settings.flexibleSchedule}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, flexibleSchedule: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Trabalho nos Fins de Semana</Label>
                    <p className="text-sm text-muted-foreground">Permitir trabalho nos fins de semana</p>
                  </div>
                  <Switch
                    checked={settings.weekendWork}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, weekendWork: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificação</CardTitle>
              <CardDescription>
                Configure como o sistema deve enviar notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notificações por Email</Label>
                    <p className="text-sm text-muted-foreground">Enviar notificações por email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notificações por SMS</Label>
                    <p className="text-sm text-muted-foreground">Enviar notificações por SMS</p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, smsNotifications: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notificações Push</Label>
                    <p className="text-sm text-muted-foreground">Enviar notificações push</p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, pushNotifications: checked }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Intervalo de Lembrete (minutos)</Label>
                  <Input
                    type="number"
                    value={settings.reminderInterval}
                    onChange={(e) => setSettings(prev => ({ ...prev, reminderInterval: Number(e.target.value) }))}
                  />
                  <p className="text-xs text-muted-foreground">Intervalo para lembretes de ponto</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
