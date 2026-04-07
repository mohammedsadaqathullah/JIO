'use client';

import { Zap, Smartphone, Gift } from 'lucide-react';

interface HeroSectionProps {
  onClaimClick: () => void;
}

export function HeroSection({ onClaimClick }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              Claim <span className="text-yellow-300">₹2,900</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 font-light">
              Exclusively for you. Get premium 4G/5G offers and instant bank transfer.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-yellow-300 flex-shrink-0" />
                <span className="text-lg">Lightning-fast 5G speeds</span>
              </div>
              <div className="flex items-center gap-3">
                <Smartphone className="w-6 h-6 text-yellow-300 flex-shrink-0" />
                <span className="text-lg">Unlimited data plans</span>
              </div>
              <div className="flex items-center gap-3">
                <Gift className="w-6 h-6 text-yellow-300 flex-shrink-0" />
                <span className="text-lg">Exclusive member benefits</span>
              </div>
            </div>

            <button
              onClick={onClaimClick}
              className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold text-lg py-4 px-8 rounded-lg transition duration-200 transform hover:scale-105"
            >
              Claim Now
            </button>
          </div>

          {/* Right Visual */}
          <div className="hidden md:flex justify-center">
            <div className="relative w-64 h-80 bg-white rounded-3xl shadow-2xl p-4 border-8 border-gray-800">
              <div className="absolute inset-4 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex flex-col items-center justify-center">
                <Smartphone className="w-24 h-24 text-blue-600 mb-4" />
                <p className="text-center font-bold text-gray-700">
                  5G Ready Phone
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
