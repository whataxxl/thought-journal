import { useState, useEffect, useCallback } from 'react';

export interface LocationInfo {
  latitude: number;
  longitude: number;
  placeName: string | null;
}

export function useLocation() {
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setPermissionGranted(result.state === 'granted');
      });
    }
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        () => { setPermissionGranted(true); resolve(true); },
        () => { setPermissionGranted(false); resolve(false); },
        { timeout: 5000 },
      );
    });
  };

  const getCurrentLocation = useCallback(async (): Promise<LocationInfo | null> => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          setPermissionGranted(true);
          const { latitude, longitude } = pos.coords;
          let placeName: string | null = null;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
            );
            const data = await res.json();
            if (data.address) {
              placeName = [data.address.city || data.address.town, data.address.state]
                .filter(Boolean).join(', ') || data.address.country || null;
            }
          } catch { /* reverse geocode failure is non-fatal */ }
          resolve({ latitude, longitude, placeName });
        },
        () => resolve(null),
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 },
      );
    });
  }, []);

  return { permissionGranted, requestPermission, getCurrentLocation };
}
