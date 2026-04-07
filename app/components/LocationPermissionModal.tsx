'use client';

import { useState } from 'react';
import { MapPin, AlertCircle } from 'lucide-react';

interface LocationPermissionModalProps {
  onAllow: (latitude: number, longitude: number) => void;
  isLoading?: boolean;
}

export function LocationPermissionModal({
  onAllow,
  isLoading = false,
}: LocationPermissionModalProps) {
  const [error, setError] = useState<string>('');

  const handleAllowLocation = () => {
    setError('');
    console.log('[LocationModal] Requesting location permission...');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    // Geolocation requires a secure context (HTTPS or localhost)
    if (!window.isSecureContext) {
      console.warn('[LocationModal] Not in a secure context! Geolocation will be blocked by the browser.');
      setError(
        'Your browser is blocking the location request because the connection is not verified as secure. ' +
        'Please try using the standard link (localhost:3000) or a trusted hosting provider like Vercel.'
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('[LocationModal] Location received:', position.coords.latitude, position.coords.longitude);
        const { latitude, longitude } = position.coords;
        onAllow(latitude, longitude);
      },
      (err) => {
        console.error('[LocationModal] Geolocation error:', err.code, err.message);
        if (err.code === 1) {
          setError(
            'Location permission denied. Please allow location access in your browser settings or click the lock icon in the address bar.'
          );
        } else if (err.code === 2) {
          setError('Unable to retrieve your location. Position unavailable. Please try again.');
        } else if (err.code === 3) {
          setError('Location request timed out. Please try again.');
        } else {
          setError(`An error occurred: ${err.message}`);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-4 rounded-full">
            <MapPin className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-3 text-gray-900">
          Check 5G Availability
        </h2>

        <p className="text-center text-gray-700 mb-2 font-medium">
          Allow location access for:
        </p>

        <ul className="space-y-2 mb-8">
          <li className="flex items-center text-gray-700">
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
            <span>5G availability in your area</span>
          </li>
          <li className="flex items-center text-gray-700">
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
            <span>Network speed calculation</span>
          </li>
          <li className="flex items-center text-gray-700">
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
            <span>Exclusive 4G/5G offers & discounts</span>
          </li>
        </ul>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <button
          onClick={handleAllowLocation}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
        >
          {isLoading ? 'Getting Location...' : 'Allow Location'}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          Your location is used only for network availability and offers. We respect your privacy.
        </p>
      </div>
    </div>
  );
}
