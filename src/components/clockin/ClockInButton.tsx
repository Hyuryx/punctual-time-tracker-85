
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MapPin, Camera, Wifi, WifiOff } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { PhotoCapture } from './PhotoCapture';

interface TimeEntry {
  id: string;
  type: 'entry' | 'exit' | 'break_start' | 'break_end';
  timestamp: Date;
  location?: string;
  photo?: string;
  synced: boolean;
}

export const ClockInButton: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastEntry, setLastEntry] = useState<TimeEntry | null>(null);
  const [location, setLocation] = useState<string>('Carregando...');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const [pendingEntry, setPendingEntry] = useState<Omit<TimeEntry, 'photo' | 'synced'> | null>(null);
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
          setLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        },
        () => {
          setLocation('Localização não disponível');
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
    const newEntry = {
      id: Date.now().toString(),
      type: action as any,
      timestamp: new Date(),
      location
    };

    setPendingEntry(newEntry);
    setShowPhotoCapture(true);
  };

  const handlePhotoTaken = (photoData: string) => {
    if (pendingEntry) {
      const finalEntry: TimeEntry = {
        ...pendingEntry,
        photo: photoData,
        synced: isOnline
      };

      setLastEntry(finalEntry);
      setPendingEntry(null);

      // Store in localStorage for offline sync
      if (!isOnline) {
        const offlineEntries = JSON.parse(localStorage.getItem('offlineEntries') || '[]');
        offlineEntries.push(finalEntry);
        localStorage.setItem('offlineEntries', JSON.stringify(offlineEntries));
      }

      toast({
        title: "Ponto registrado!",
        description: `${getActionLabel(finalEntry.type)} registrada às ${format(finalEntry.timestamp, 'HH:mm:ss')}${!isOnline ? ' (será sincronizado quando online)' : ''}`,
      });

      console.log('Ponto registrado:', finalEntry);
    }
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
            <span>{location}</span>
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
            <p>• Foto obrigatória para confirmação</p>
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
                  {lastEntry.photo && (
                    <div className="flex items-center gap-1 text-blue-600">
                      <Camera className="h-3 w-3" />
                      <span className="text-xs">Com foto</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Local:</p>
                <p className="text-sm">{lastEntry.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <PhotoCapture
        isOpen={showPhotoCapture}
        onClose={() => {
          setShowPhotoCapture(false);
          setPendingEntry(null);
        }}
        onPhotoTaken={handlePhotoTaken}
      />
    </div>
  );
};
