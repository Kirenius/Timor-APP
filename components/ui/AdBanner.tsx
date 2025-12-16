import React from 'react';
import { X, Info } from 'lucide-react';

interface AdBannerProps {
  variant?: 'horizontal' | 'vertical' | 'sidebar';
  className?: string;
  onClose?: () => void;
}

export const AdBanner: React.FC<AdBannerProps> = ({ variant = 'horizontal', className = '', onClose }) => {
  if (variant === 'sidebar') {
    return (
      <div className={`mx-4 mt-auto mb-4 p-4 rounded-lg bg-slate-800 border border-slate-700 text-center relative overflow-hidden group animate-fade-in ${className}`}>
        <div className="absolute top-1 right-1 text-[10px] text-slate-500 border border-slate-600 px-1 rounded bg-slate-900/50">Sponsored</div>
        <p className="text-xs text-slate-400 mb-2 text-left">Rekomendasi</p>
        <div className="w-full h-32 bg-slate-700 rounded flex items-center justify-center mb-2 animate-pulse">
           <span className="text-slate-500 text-xs">Space Iklan 250x250</span>
        </div>
        <p className="text-sm font-bold text-white leading-tight mb-2">Hosting Murah & Cepat</p>
        <button className="w-full py-1.5 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
          Lihat Promo
        </button>
      </div>
    );
  }

  return (
    <div className={`relative bg-gray-50 border border-gray-200 rounded-lg flex flex-col items-center justify-center overflow-hidden animate-fade-in transition-all duration-500 hover:bg-gray-100 ${variant === 'vertical' ? 'w-full h-full min-h-[400px]' : 'w-full py-4'} ${className}`}>
      {/* Sponsored Label */}
      <span className="absolute top-2 left-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
         Sponsored
      </span>

      <div className="absolute top-2 right-2 flex gap-2">
        <span className="text-[10px] text-gray-400 border border-gray-200 bg-white px-1.5 rounded flex items-center gap-1">
           Ads by TimorAds <Info size={8} />
        </span>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-white rounded-full p-0.5 shadow-sm">
            <X size={12} />
          </button>
        )}
      </div>
      
      <div className="flex flex-col items-center text-center p-4 mt-2">
        <div className="bg-white p-3 rounded-full shadow-sm mb-3 border border-gray-100">
          <img src={`https://picsum.photos/seed/${Math.random()}/100/100`} alt="Ad" className="w-12 h-12 rounded object-cover opacity-90" />
        </div>
        <h4 className="font-bold text-gray-900">Internet Lambat? Ganti Provider!</h4>
        <p className="text-sm text-gray-500 max-w-md mt-1">Dapatkan kecepatan hingga 1Gbps dengan harga spesial hanya untuk hari ini.</p>
        <button className="mt-3 px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-full shadow-sm hover:bg-blue-700 transition-colors transform hover:scale-105 active:scale-95">
          Buka Sekarang
        </button>
      </div>
    </div>
  );
};