
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

export const useGeocoding = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return {
    reverseGeocode,
    isLoading,
    error
  };
};
