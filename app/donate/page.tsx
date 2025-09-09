'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function DonatePage() {
  const [donationAmount, setDonationAmount] = useState(108);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const predefinedAmounts = [54, 108, 216, 501, 1008, 2500];

  const handleAmountSelect = (amount: number) => {
    setDonationAmount(amount);
    setIsCustom(false);
    setCustomAmount('');
  };

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);
    setIsCustom(true);
    setDonationAmount(Number(value) || 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle donation submission
    alert('Thank you for your generous donation! This will help support our divine mission.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Support Our Divine Mission
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your generous donations help spread Krishna consciousness worldwide and support 
            the spiritual growth of countless devotees. Every contribution is a seva to the divine.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Payment QR Code</h2>
            <div className="flex justify-center">
              <img 
                src="https://static.readdy.ai/image/465851cfd5d255a5b0940b68d8aff6fb/1914665f3f0ddabbb67dc6cf169f7f80.jfif"
                alt="DuitNow QR Payment Code for HK Convention 2025"
                className="max-w-full h-auto rounded-2xl shadow-lg"
                style={{ maxHeight: '800px' }}
              />
            </div>
            <p className="text-center text-gray-600 mt-4">
              Scan this QR code with your banking app to make a direct donation
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}