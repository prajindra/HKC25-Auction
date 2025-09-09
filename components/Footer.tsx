
'use client';

export default function Footer() {
  return (
    <footer className="bg-amber-900 text-amber-100 py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">HKC 25 Auction</h3>
            <p className="text-amber-200 leading-relaxed">
              Every bid is more than just an offering — it's a step toward sharing Krishna consciousness with the world.
              By participating in the HKC Auction, you not only receive exclusive items but also contribute directly to sustaining and expanding spiritual outreach programs.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Contact Information</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <i className="ri-mail-line w-4 h-4 flex items-center justify-center"></i>
                <span>bhakti2u.malaysia@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-map-pin-line w-4 h-4 flex items-center justify-center"></i>
                <span>Sri Sri Radha Krishna Kanhaiya temple, Seberang Prai</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Support the Mission</h4>
            <p className="text-amber-200 mb-4">
              Beyond auction participation, you can directly support our cause.
            </p>
            <a 
              href="/donate" 
              className="inline-block bg-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-600 transition-colors whitespace-nowrap"
            >
              Donation Portal
            </a>
          </div>
        </div>
        
        <div className="border-t border-amber-800 mt-8 pt-8 text-center">
          <p className="text-amber-300">
            © 2025 Hare Krishna Convention. All rights reserved. | Built with devotion for the divine mission.
          </p>
        </div>
      </div>
    </footer>
  );
}