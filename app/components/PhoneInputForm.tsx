'use client';

import { useState } from 'react';
import { Phone, AlertCircle } from 'lucide-react';

interface PhoneInputFormProps {
  onSubmit: (phoneNumber: string) => Promise<void>;
  isLoading?: boolean;
}

export function PhoneInputForm({
  onSubmit,
  isLoading = false,
}: PhoneInputFormProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(value);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    try {
      await onSubmit(phoneNumber);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred. Please try again.'
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
      <div className="flex justify-center mb-6">
        <div className="bg-blue-100 p-4 rounded-full">
          <Phone className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-center mb-2 text-gray-900">
        Claim ₹2,900 Offer
      </h2>

      <p className="text-center text-gray-600 text-sm mb-8">
        Enter your phone number to receive exclusive offers and bank transfer details
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Mobile Number
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 font-semibold">
              +91
            </span>
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="9876543210"
              maxLength="10"
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-lg font-semibold"
              disabled={isLoading}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {phoneNumber.length}/10 digits
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || phoneNumber.length !== 10}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200 mt-6"
        >
          {isLoading ? 'Processing...' : 'Claim Your ₹2,900'}
        </button>
      </form>

      <p className="text-xs text-gray-500 text-center mt-4">
        You&apos;ll receive an SMS with bank transfer and exclusive offers
      </p>
    </div>
  );
}
