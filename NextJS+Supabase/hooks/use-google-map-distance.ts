import { useState, useEffect } from 'react';
import { GeoValue } from '@/components/ui/geosuggest';

export const useGoogleDistance = (
  from: GeoValue | null,
  to: GeoValue | null
) => {
  const [distance, setDistance] = useState<string | null>(null);

  useEffect(() => {
    if (!from || !to) return;

    const fetchDistance = async () => {
      const origin = `${from.location.lat},${from.location.lng}`;
      const destination = `${to.location.lat},${to.location.lng}`;

      try {
        const response = await fetch(
          `/api/map/distance?from=${origin}&to=${destination}`
        );
        const data = (await response.json()) as {
          rows: {
            elements: {
              distance: {
                text: string;
              };
            }[];
          }[];
        };

        if (data.rows?.length > 0 && data.rows[0].elements?.length > 0) {
          const distanceText = data.rows[0].elements[0].distance?.text;
          setDistance(distanceText || 'Distance unavailable');
        } else {
          setDistance('Distance unavailable');
        }
      } catch (error) {
        console.error('Error fetching distance:', error);
        setDistance('Error calculating distance');
      }
    };

    fetchDistance();
  }, [from, to]);

  return distance;
};
