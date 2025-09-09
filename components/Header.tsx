
'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="https://static.readdy.ai/image/465851cfd5d255a5b0940b68d8aff6fb/a11ac8ae6de3f3921130eca1b9b085d3.png" 
              alt="HKC Malaysia Let's GAURA! 2025" 
              className="w-16 h-16 object-contain"
            />
            <div>
              <h2 className="text-xl font-bold">Online Auction</h2>
              <p className="text-orange-100 text-sm">Support the Mission</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="hover:text-orange-200 transition-colors">
              Auction Items
            </Link>
            <Link href="/admin" className="hover:text-orange-200 transition-colors">
              Admin Login
            </Link>
            <Link href="/donate" className="bg-white text-orange-500 px-4 py-2 rounded-full font-semibold hover:bg-orange-50 transition-colors whitespace-nowrap">
              Donate Now
            </Link>
          </nav>

          <button className="md:hidden w-6 h-6 flex items-center justify-center">
            <i className="ri-menu-line text-2xl"></i>
          </button>
        </div>
      </div>
    </header>
  );
}
