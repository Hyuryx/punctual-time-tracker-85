
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MapPin, Wifi, WifiOff } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface TimeEntry {
  id: string;
  type: 'entry' | 'exit' | 'break_start' | 'break_end';
  timestamp: Date;
  location?: string;
  locationName?: string;
  synced: boolean;
}

// Mock locations for demo
const mockLocations = [
  { coords: '-23.5505, -46.6333', name: 'Escritório Principal - São Paulo' },
  { coords: '-22.9068, -43.1729', name: 'Filial Rio de Janeiro' },
  { coords: '-19.9191, -43.9378', name: 'Filial Belo Horizonte' },
  { coords: '-25.4284, -49.2733', name: 'Filial Curitiba' },
];

export const ClockInButton: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastEntry, setLastEntry] = useState<TimeEntry | null>(null);
  const [location, setLocation] = useState<string>('Carregando...');
  const [locationName, setLocationName] = useState<string>('Carregando...');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
          setLocation(coords);
          
          // Find matching location name
          const matchedLocation = mockLocations.find(loc => 
            Math.abs(parseFloat(loc.coords.split(', ')[0]) - position.coords.latitude) < 0.01
          );
          
          setLocationName(matchedLocation ? matchedLocation.name : 'Localização Externa');
        },
        () => {
          setLocation('Localização não disponível');
          setLocationName('Localização não disponível');
        }
      );
    }
  }, []);

  const getNextAction = () => {
    if (!lastEntry) return 'entry';
    
    switch (lastEntry.type) {
      case 'entry':
        return 'break_start';
      case 'break_start':
        return 'break_end';
      case 'break_end':
        return 'exit';
      case 'exit':
        return 'entry';
      default:
        return 'entry';
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'entry':
        return 'Entrada';
      case 'exit':
        return 'Saída';
      case 'break_start':
        return 'Início do Intervalo';
      case 'break_end':
        return 'Fim do Intervalo';
      default:
        return 'Registrar Ponto';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'entry':
        return 'bg-green-600 hover:bg-green-700';
      case 'exit':
        return 'bg-red-600 hover:bg-red-700';
      case 'break_start':
        return 'bg-yellow-600 hover:bg-yellow-700';
      case 'break_end':
        return 'bg-blue-600 hover:bg-blue-700';
      default:
        return '';
    }
  };

  const handleClockIn = () => {
    const action = getNextAction();
    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      type: action as any,
      timestamp: new Date(),
      location,
      locationName,
      synced: isOnline
    };

    setLastEntry(newEntry);

    // Store in localStorage for offline sync and real-time sync
    const allEntries = JSON.parse(localStorage.getItem('timeEntries') || '[]');
    allEntries.push(newEntry);
    localStorage.setItem('timeEntries', JSON.stringify(allEntries));

    if (!isOnline) {
      const offlineEntries = JSON.parse(localStorage.getItem('offlineEntries') || '[]');
      offlineEntries.push(newEntry);
      localStorage.setItem('offlineEntries', JSON.stringify(offlineEntries));
    }

    toast({
      title: "Ponto registrado!",
      description: `${getActionLabel(newEntry.type)} registrada às ${format(newEntry.timestamp, 'HH:mm:ss')}${!isOnline ? ' (será sincronizado quando online)' : ''}`,
    });

    console.log('Ponto registrado:', newEntry);
  };

  const nextAction = getNextAction();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Registro de Ponto</CardTitle>
          <CardDescription>
            {format(currentTime, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </CardDescription>
          <div className="flex justify-center">
            {isOnline ? (
              <div className="flex items-center gap-2 text-green-600">
                <Wifi className="h-4 w-4" />
                <span className="text-sm">Online</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-orange-600">
                <WifiOff className="h-4 w-4" />
                <span className="text-sm">Offline</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="text-4xl font-mono font-bold">
            {format(currentTime, 'HH:mm:ss')}
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{locationName}</span>
          </div>

          <Button
            onClick={handleClockIn}
            className={`w-full py-6 text-lg ${getActionColor(nextAction)}`}
            size="lg"
          >
            <Clock className="mr-2 h-5 w-5" />
            {getActionLabel(nextAction)}
          </Button>

          <div className="text-xs text-muted-foreground">
            <p>• Jornada: 9h de trabalho + 1h de almoço (10h totais)</p>
            <p>• Localização GPS será registrada</p>
            <p>• {isOnline ? 'Sincronização em tempo real' : 'Será sincronizado quando online'}</p>
          </div>
        </CardContent>
      </Card>

      {lastEntry && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Último Registro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{getActionLabel(lastEntry.type)}</p>
                <p className="text-sm text-muted-foreground">
                  {format(lastEntry.timestamp, 'HH:mm:ss - dd/MM/yyyy')}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {lastEntry.synced ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <Wifi className="h-3 w-3" />
                      <span className="text-xs">Sincronizado</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-orange-600">
                      <WifiOff className="h-3 w-3" />
                      <span className="text-xs">Aguardando sincronização</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Local:</p>
                <p className="text-sm">{lastEntry.locationName}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
