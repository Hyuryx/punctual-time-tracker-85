
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Clock, Users, Bell, Shield, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    // Configurações de Ponto
    autoClockOut: true,
    photoRequired: false,
    locationRequired: true,
    reminderEnabled: true,
    reminderTime: '08:00',
    
    // Configurações de Horário
    defaultWorkStart: '08:00',
    defaultWorkEnd: '17:00',
    lunchBreakDuration: 60,
    toleranceMinutes: 15,
    
    // Configurações de Cálculo
    overtimeAfterHours: 8,
    nightShiftStart: '22:00',
    nightShiftEnd: '05:00',
    nightShiftBonus: 20,
    
    // Configurações de Sistema
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    autoBackup: true,
    auditLog: true,
  });

  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: "Configurações salvas!",
      description: "As configurações do sistema foram atualizadas com sucesso.",
    });
    console.log('Settings saved:', settings);
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configurações do Sistema</h2>
        <p className="text-muted-foreground">
          Configure o comportamento e as regras do sistema de ponto
        </p>
      </div>

      <Tabs defaultValue="clock" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="clock" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Ponto
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Horários
          </TabsTrigger>
          <TabsTrigger value="calculation" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
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

        <TabsContent value="clock" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Registro de Ponto</CardTitle>
              <CardDescription>
                Defina as regras para registros de ponto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-clock-out">Saída Automática</Label>
                  <p className="text-sm text-muted-foreground">
                    Registrar saída automaticamente após horário de trabalho
                  </p>
                </div>
                <Switch
                  id="auto-clock-out"
                  checked={settings.autoClockOut}
                  onCheckedChange={(checked) => updateSetting('autoClockOut', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="photo-required">Foto Obrigatória</Label>
                  <p className="text-sm text-muted-foreground">
                    Exigir foto de confirmação em todos os registros
                  </p>
                </div>
                <Switch
                  id="photo-required"
                  checked={settings.photoRequired}
                  onCheckedChange={(checked) => updateSetting('photoRequired', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="location-required">Localização Obrigatória</Label>
                  <p className="text-sm text-muted-foreground">
                    Exigir localização GPS em todos os registros
                  </p>
                </div>
                <Switch
                  id="location-required"
                  checked={settings.locationRequired}
                  onCheckedChange={(checked) => updateSetting('locationRequired', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Horário Padrão</CardTitle>
              <CardDescription>
                Defina os horários padrão para novos funcionários
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="work-start">Início do Expediente</Label>
                  <Input
                    id="work-start"
                    type="time"
                    value={settings.defaultWorkStart}
                    onChange={(e) => updateSetting('defaultWorkStart', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="work-end">Fim do Expediente</Label>
                  <Input
                    id="work-end"
                    type="time"
                    value={settings.defaultWorkEnd}
                    onChange={(e) => updateSetting('defaultWorkEnd', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lunch-duration">Duração do Almoço (minutos)</Label>
                  <Input
                    id="lunch-duration"
                    type="number"
                    value={settings.lunchBreakDuration}
                    onChange={(e) => updateSetting('lunchBreakDuration', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tolerance">Tolerância de Atraso (minutos)</Label>
                  <Input
                    id="tolerance"
                    type="number"
                    value={settings.toleranceMinutes}
                    onChange={(e) => updateSetting('toleranceMinutes', parseInt(e.target.value))}
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
                Configure os cálculos de horas extras e adicionais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="overtime-after">Horas Extras Após (horas)</Label>
                <Input
                  id="overtime-after"
                  type="number"
                  value={settings.overtimeAfterHours}
                  onChange={(e) => updateSetting('overtimeAfterHours', parseInt(e.target.value))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="night-start">Início Adicional Noturno</Label>
                  <Input
                    id="night-start"
                    type="time"
                    value={settings.nightShiftStart}
                    onChange={(e) => updateSetting('nightShiftStart', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="night-end">Fim Adicional Noturno</Label>
                  <Input
                    id="night-end"
                    type="time"
                    value={settings.nightShiftEnd}
                    onChange={(e) => updateSetting('nightShiftEnd', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="night-bonus">Percentual Adicional Noturno (%)</Label>
                <Input
                  id="night-bonus"
                  type="number"
                  value={settings.nightShiftBonus}
                  onChange={(e) => updateSetting('nightShiftBonus', parseInt(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
              <CardDescription>
                Configure lembretes e notificações do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="reminder-enabled">Lembretes Inteligentes</Label>
                  <p className="text-sm text-muted-foreground">
                    Enviar lembretes automáticos de registro de ponto
                  </p>
                </div>
                <Switch
                  id="reminder-enabled"
                  checked={settings.reminderEnabled}
                  onCheckedChange={(checked) => updateSetting('reminderEnabled', checked)}
                />
              </div>

              {settings.reminderEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="reminder-time">Horário do Lembrete</Label>
                  <Input
                    id="reminder-time"
                    type="time"
                    value={settings.reminderTime}
                    onChange={(e) => updateSetting('reminderTime', e.target.value)}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
              <CardDescription>
                Configure aspectos gerais do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (United States)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select value={settings.timezone} onValueChange={(value) => updateSetting('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                      <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                      <SelectItem value="Europe/London">Londres (GMT+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-backup">Backup Automático</Label>
                  <p className="text-sm text-muted-foreground">
                    Realizar backup automático dos dados diariamente
                  </p>
                </div>
                <Switch
                  id="auto-backup"
                  checked={settings.autoBackup}
                  onCheckedChange={(checked) => updateSetting('autoBackup', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="audit-log">Log de Auditoria</Label>
                  <p className="text-sm text-muted-foreground">
                    Manter log detalhado de todas as atividades
                  </p>
                </div>
                <Switch
                  id="audit-log"
                  checked={settings.auditLog}
                  onCheckedChange={(checked) => updateSetting('auditLog', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} className="px-8">
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
};
