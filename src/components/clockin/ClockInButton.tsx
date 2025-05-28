
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MapPin, Camera } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface TimeEntry {
  id: string;
  type: 'entry' | 'exit' | 'break_start' | 'break_end';
  timestamp: Date;
  location?: string;
}

export const ClockInButton: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastEntry, setLastEntry] = useState<TimeEntry | null>(null);
  const [location, setLocation] = useState<string>('Carregando...');
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
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
    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      type: action as any,
      timestamp: new Date(),
      location
    };

    setLastEntry(newEntry);
    
    toast({
      title: "Ponto registrado!",
      description: `${getActionLabel(action)} registrada às ${format(newEntry.timestamp, 'HH:mm:ss')}`,
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

          <div className="flex justify-center gap-4 text-sm">
            <Button variant="outline" size="sm">
              <Camera className="mr-2 h-4 w-4" />
              Foto de Confirmação
            </Button>
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
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Local:</p>
                <p className="text-sm">{lastEntry.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
