import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MapPin, Wifi, WifiOff, Target } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { useGeocoding } from '@/hooks/useGeocoding';

interface TimeEntry {
  id: string;
  type: 'entry' | 'exit' | 'break_start' | 'break_end';
  timestamp: Date;
  location?: string;
  locationName?: string;
  accuracy?: number;
  locationSource?: string;
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
  const [locationName, setLocationName] = useState<string>('Carregando localização...');
  const [locationAccuracy, setLocationAccuracy] = useState<number>(0);
  const [locationSource, setLocationSource] = useState<string>('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();
  const { getLocationWithAddress, isLoading: geocodingLoading } = useGeocoding();

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
    // Load last entry from localStorage on component mount
    const loadLastEntry = () => {
      const entries = JSON.parse(localStorage.getItem('timeEntries') || '[]');
      if (entries.length > 0) {
        const lastStoredEntry = entries[entries.length - 1];
        // Convert timestamp back to Date object
        const entryWithDate = {
          ...lastStoredEntry,
          timestamp: new Date(lastStoredEntry.timestamp)
        };
        setLastEntry(entryWithDate);
      }
    };

    loadLastEntry();

    // Get enhanced location with Wi-Fi support
    const getEnhancedLocation = async () => {
      setLocationName('Obtendo localização precisa...');
      
      try {
        const locationData = await getLocationWithAddress();
        
        setLocation(locationData.coordinates);
        setLocationName(locationData.address);
        setLocationAccuracy(locationData.accuracy);
        setLocationSource(locationData.source);
        
        console.log('Localização obtida:', {
          coordinates: locationData.coordinates,
          address: locationData.address,
          accuracy: locationData.accuracy,
          source: locationData.source
        });
        
        // Show success toast with accuracy info
        toast({
          title: "Localização obtida!",
          description: `Precisão: ${Math.round(locationData.accuracy)}m (${locationData.source === 'gps' ? 'GPS' : 'Rede/Wi-Fi'})`,
        });
        
      } catch (error) {
        console.error('Erro ao obter localização:', error);
        setLocation('Localização não disponível');
        setLocationName('Localização não disponível');
        setLocationAccuracy(0);
        setLocationSource('erro');
        
        toast({
          title: "Erro de localização",
          description: "Não foi possível obter sua localização. Verifique as permissões.",
          variant: "destructive"
        });
      }
    };

    getEnhancedLocation();
  }, [getLocationWithAddress, toast]);

  const getNextAction = () => {
    if (!lastEntry) return 'entry';
    
    // Check if the last entry was today
    const today = new Date().toDateString();
    const lastEntryDate = new Date(lastEntry.timestamp).toDateString();
    
    // If last entry was not today, start fresh
    if (today !== lastEntryDate) {
      return 'entry';
    }
    
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
    const now = new Date(); // Data/hora atual local
    
    const newEntry: TimeEntry = {
      id: now.getTime().toString(), // Use timestamp como ID único
      type: action as any,
      timestamp: now, // Salva como objeto Date local
      location,
      locationName,
      accuracy: locationAccuracy,
      locationSource,
      synced: isOnline
    };

    setLastEntry(newEntry);

    // Store in localStorage - converter para string ISO mas manter referência local
    const allEntries = JSON.parse(localStorage.getItem('timeEntries') || '[]');
    
    // Salvar com timestamp em formato que preserve o fuso horário local
    const entryToStore = {
      ...newEntry,
      timestamp: now.toISOString(), // ISO string preserva o momento exato
      localTimestamp: now.getTime(), // Timestamp local para referência
      timezoneOffset: now.getTimezoneOffset() // Offset do fuso horário
    };
    
    allEntries.push(entryToStore);
    localStorage.setItem('timeEntries', JSON.stringify(allEntries));

    console.log('Ponto registrado com data local:', {
      timestamp: now.toLocaleString('pt-BR'),
      isoString: now.toISOString(),
      localTimestamp: now.getTime(),
      timezoneOffset: now.getTimezoneOffset(),
      type: newEntry.type
    });

    if (!isOnline) {
      const offlineEntries = JSON.parse(localStorage.getItem('offlineEntries') || '[]');
      offlineEntries.push(entryToStore);
      localStorage.setItem('offlineEntries', JSON.stringify(offlineEntries));
    }

    const accuracyText = locationAccuracy > 0 ? ` (±${Math.round(locationAccuracy)}m)` : '';
    const sourceText = locationSource === 'gps' ? 'GPS' : locationSource === 'network' ? 'Wi-Fi/Rede' : '';
    
    toast({
      title: "Ponto registrado!",
      description: `${getActionLabel(newEntry.type)} registrada às ${format(newEntry.timestamp, 'HH:mm:ss')} do dia ${format(newEntry.timestamp, 'dd/MM/yyyy')}${accuracyText}${!isOnline ? ' (será sincronizado quando online)' : ''}`,
    });

    console.log('Ponto registrado:', newEntry);
  };

  const nextAction = getNextAction();

  const getLocationIcon = () => {
    if (geocodingLoading) return <Target className="h-4 w-4 animate-pulse" />;
    if (locationSource === 'gps') return <Target className="h-4 w-4 text-green-600" />;
    if (locationSource === 'network') return <MapPin className="h-4 w-4 text-blue-600" />;
    return <MapPin className="h-4 w-4 text-orange-600" />;
  };

  const getLocationText = () => {
    if (geocodingLoading) return 'Obtendo localização precisa...';
    
    let text = locationName;
    if (locationAccuracy > 0) {
      text += ` (±${Math.round(locationAccuracy)}m)`;
    }
    if (locationSource === 'gps') text += ' • GPS';
    if (locationSource === 'network') text += ' • Wi-Fi/Rede';
    
    return text;
  };

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
            {getLocationIcon()}
            <span className={geocodingLoading ? 'animate-pulse' : ''}>
              {getLocationText()}
            </span>
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
            <p>• Localização GPS/Wi-Fi será registrada com endereço real</p>
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
                  {lastEntry.accuracy && (
                    <div className="flex items-center gap-1 text-blue-600">
                      <Target className="h-3 w-3" />
                      <span className="text-xs">±{Math.round(lastEntry.accuracy)}m</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Local:</p>
                <p className="text-sm font-medium">{lastEntry.locationName}</p>
                {lastEntry.locationSource && (
                  <p className="text-xs text-muted-foreground">
                    {lastEntry.locationSource === 'gps' ? 'GPS' : 'Wi-Fi/Rede'}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
