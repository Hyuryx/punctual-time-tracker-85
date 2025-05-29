
import { useState, useCallback } from 'react';

interface GeocodeResult {
  display_name: string;
  address: {
    road?: string;
    house_number?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  source: 'gps' | 'network' | 'passive';
}

export const useGeocoding = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = useCallback((): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalização não suportada'));
        return;
      }

      // Primeira tentativa: alta precisão (GPS + Wi-Fi + dados móveis)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Localização obtida (alta precisão):', {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
          
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            source: position.coords.accuracy < 100 ? 'gps' : 'network'
          });
        },
        (error) => {
          console.log('Erro na localização de alta precisão, tentando com precisão reduzida:', error);
          
          // Segunda tentativa: precisão reduzida (mais rápida, usa Wi-Fi/rede)
          navigator.geolocation.getCurrentPosition(
            (position) => {
              console.log('Localização obtida (precisão reduzida):', {
                lat: position.coords.latitude,
                lon: position.coords.longitude,
                accuracy: position.coords.accuracy
              });
              
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                source: 'network'
              });
            },
            (fallbackError) => {
              console.error('Erro total na geolocalização:', fallbackError);
              reject(fallbackError);
            },
            {
              enableHighAccuracy: false, // Usa Wi-Fi/rede
              timeout: 15000,
              maximumAge: 600000 // 10 minutos
            }
          );
        },
        {
          enableHighAccuracy: true, // Tenta GPS + Wi-Fi
          timeout: 10000,
          maximumAge: 300000 // 5 minutos
        }
      );
    });
  }, []);

  const reverseGeocode = useCallback(async (lat: number, lon: number): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      // Using Nominatim (OpenStreetMap) free API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'PunctualTimeTracker/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Erro na geocodificação');
      }

      const data: GeocodeResult = await response.json();
      
      // Format the address nicely
      const address = data.address;
      let formattedAddress = '';

      if (address.road) {
        formattedAddress += address.road;
        if (address.house_number) {
          formattedAddress += `, ${address.house_number}`;
        }
      }

      if (address.neighbourhood || address.suburb) {
        if (formattedAddress) formattedAddress += ' - ';
        formattedAddress += address.neighbourhood || address.suburb;
      }

      if (address.city) {
        if (formattedAddress) formattedAddress += ', ';
        formattedAddress += address.city;
      }

      if (address.state) {
        if (formattedAddress) formattedAddress += ' - ';
        formattedAddress += address.state;
      }

      return formattedAddress || data.display_name || 'Endereço não disponível';
    } catch (err) {
      const errorMessage = 'Erro ao obter endereço';
      setError(errorMessage);
      console.error('Geocoding error:', err);
      return 'Localização Externa';
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getLocationWithAddress = useCallback(async (): Promise<{
    coordinates: string;
    address: string;
    accuracy: number;
    source: string;
  }> => {
    try {
      const locationData = await getCurrentLocation();
      const address = await reverseGeocode(locationData.latitude, locationData.longitude);
      
      return {
        coordinates: `${locationData.latitude.toFixed(6)}, ${locationData.longitude.toFixed(6)}`,
        address,
        accuracy: locationData.accuracy,
        source: locationData.source
      };
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      throw error;
    }
  }, [getCurrentLocation, reverseGeocode]);

  return {
    reverseGeocode,
    getCurrentLocation,
    getLocationWithAddress,
    isLoading,
    error
  };
};
