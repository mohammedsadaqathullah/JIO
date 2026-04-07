'use client';

import { CheckCircle, MessageCircle } from 'lucide-react';

interface SuccessConfirmationProps {
  phoneNumber: string;
}

export function SuccessConfirmation({ phoneNumber }: SuccessConfirmationProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full animate-pulse">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Success!
        </h2>

        <p className="text-gray-700 mb-2 font-medium">
          Your claim has been registered
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
          <p className="text-sm text-gray-600 mb-2">We&apos;ll send SMS to:</p>
          <p className="text-xl font-bold text-blue-600">+91 {phoneNumber}</p>
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="font-semibold text-gray-900 text-sm">
                Bank Transfer Details
              </p>
              <p className="text-xs text-gray-600">
                Within 24 hours to your registered account
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="font-semibold text-gray-900 text-sm">
                Exclusive 4G/5G Offers
              </p>
              <p className="text-xs text-gray-600">
                Special discounts based on your location
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed">
          Thank you for choosing Jio. Your location data is secure and used only for personalized offers and network optimization.
        </p>
      </div>
    </div>
  );
}
