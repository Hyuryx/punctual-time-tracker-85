
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MapPin, Clock, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface LocationEntry {
  id: string;
  employeeName: string;
  locationName: string;
  coordinates: string;
  timestamp: Date;
  action: string;
}

export const LocationManagement: React.FC = () => {
  const [locationEntries, setLocationEntries] = useState<LocationEntry[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Load location data from localStorage and sync in real-time
    const loadLocationData = () => {
      const timeEntries = JSON.parse(localStorage.getItem('timeEntries') || '[]');
      
      const locations: LocationEntry[] = timeEntries.map((entry: any) => ({
        id: entry.id,
        employeeName: user?.name || 'Usuário',
        locationName: entry.locationName || 'Localização Externa',
        coordinates: entry.location || '',
        timestamp: new Date(entry.timestamp),
        action: entry.type
      }));

      setLocationEntries(locations.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
    };

    loadLocationData();
    
    // Update every 5 seconds for real-time sync
    const interval = setInterval(loadLocationData, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const getActionLabel = (action: string) => {
    const labels = {
      entry: 'Entrada',
      exit: 'Saída',
      break_start: 'Início do Intervalo',
      break_end: 'Fim do Intervalo'
    };
    return labels[action as keyof typeof labels] || action;
  };

  const getActionColor = (action: string) => {
    const colors = {
      entry: 'text-green-600',
      exit: 'text-red-600',
      break_start: 'text-yellow-600',
      break_end: 'text-blue-600'
    };
    return colors[action as keyof typeof colors] || 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Registro de Localizações</h2>
        <p className="text-muted-foreground">
          Todas as localizações registradas após login dos funcionários
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Registros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{locationEntries.length}</div>
            <p className="text-xs text-muted-foreground">Registros de localização</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Localizações Únicas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(locationEntries.map(entry => entry.locationName)).size}
            </div>
            <p className="text-xs text-muted-foreground">Locais diferentes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Último Registro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {locationEntries.length > 0 
                ? locationEntries[0].timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                : '--:--'
              }
            </div>
            <p className="text-xs text-muted-foreground">Hora do último ponto</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Localizações</CardTitle>
          <CardDescription>
            Registro em tempo real de todas as localizações dos funcionários
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Funcionário</TableHead>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Coordenadas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locationEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {entry.employeeName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <div>
                        <div className="font-medium">
                          {entry.timestamp.toLocaleDateString('pt-BR')}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {entry.timestamp.toLocaleTimeString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${getActionColor(entry.action)}`}>
                      {getActionLabel(entry.action)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{entry.locationName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {entry.coordinates}
                    </code>
                  </TableCell>
                </TableRow>
              ))}
              {locationEntries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Nenhum registro de localização encontrado. 
                    Faça seu primeiro registro de ponto para começar!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
