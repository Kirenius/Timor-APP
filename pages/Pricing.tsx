import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Check, Crown, Briefcase, Zap, ShieldCheck, Globe, Server, Database, Phone, Building2, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface PricingProps {
  user: User;
  onUpgrade: () => void;
}

export const Pricing: React.FC<PricingProps> = ({ user, onUpgrade }) => {
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Solusi untuk Pengguna & Perusahaan</h1>
        <p className="text-gray-500">
          Pilih paket yang sesuai dengan kebutuhan Anda. Dari perlindungan privasi pribadi hingga infrastruktur perusahaan skala besar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        
        {/* FREE PLAN */}
        <Card className="relative border-t-4 border-t-gray-400 hover:shadow-lg transition-shadow">
          <div className="p-2">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                    <UserIcon size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Starter</h3>
            </div>
            <div className="mb-6">
              <span className="text-3xl font-bold text-gray-900">Gratis</span>
              <span className="text-gray-500">/selamanya</span>
            </div>
            
            <p className="text-sm text-gray-500 mb-6">
              Untuk pengguna kasual yang membutuhkan akses internet dasar.
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                <span>Akses Server Lokal (Timor-Leste)</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                <span>Enkripsi Standar</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                <span>Iklan dalam Aplikasi</span>
              </li>
            </ul>

            <Button 
              fullWidth 
              variant="outline" 
              disabled={!user.isVip} 
              className={!user.isVip ? "bg-gray-100 text-gray-400 border-none" : ""}
            >
              {!user.isVip ? "Paket Saat Ini" : "Downgrade"}
            </Button>
          </div>
        </Card>

        {/* PERSONAL VIP PLAN */}
        <Card className="relative border-t-4 border-t-yellow-400 bg-gradient-to-b from-yellow-50/50 to-white shadow-xl transform scale-105 z-10">
          <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg">
            POPULER
          </div>
          <div className="p-2">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
                    <Crown size={24} className="fill-current" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Personal VIP</h3>
            </div>
            <div className="mb-6">
              <span className="text-3xl font-bold text-gray-900">$5.00</span>
              <span className="text-gray-500">/bulan</span>
            </div>
            
            <p className="text-sm text-gray-500 mb-6">
              Kecepatan maksimal dan privasi total tanpa gangguan iklan.
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2 text-sm text-gray-900 font-medium">
                <Check size={16} className="text-yellow-600 mt-0.5 shrink-0" />
                <span>Akses Server Global (SG, AU, US)</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-900 font-medium">
                <Check size={16} className="text-yellow-600 mt-0.5 shrink-0" />
                <span>Unlimited Bandwidth & Speed</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-900 font-medium">
                <Check size={16} className="text-yellow-600 mt-0.5 shrink-0" />
                <span>Bebas Iklan (Ad-Free)</span>
              </li>
               <li className="flex items-start gap-2 text-sm text-gray-900 font-medium">
                <Check size={16} className="text-yellow-600 mt-0.5 shrink-0" />
                <span>Prioritas Support 24/7</span>
              </li>
            </ul>

            <Button 
              fullWidth 
              onClick={onUpgrade}
              disabled={user.isVip}
              className={user.isVip ? "bg-green-100 text-green-700 hover:bg-green-200 border-none" : "bg-gradient-to-r from-yellow-500 to-amber-600 text-white border-none shadow-lg shadow-yellow-200 hover:shadow-xl hover:scale-[1.02] transition-all"}
            >
              {user.isVip ? (
                  <span className="flex items-center gap-2"><Check size={16} /> Paket Aktif</span>
              ) : (
                  <span className="flex items-center gap-2"><Crown size={16} className="fill-white" /> Upgrade VIP</span>
              )}
            </Button>
          </div>
        </Card>

        {/* ENTERPRISE PLAN */}
        <Card className="relative border-t-4 border-t-slate-800 bg-slate-50 hover:bg-slate-100 transition-colors">
          <div className="p-2">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-slate-200 rounded-lg text-slate-800">
                    <Building2 size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Enterprise</h3>
            </div>
            <div className="mb-6">
              <span className="text-3xl font-bold text-gray-900">$49.99</span>
              <span className="text-gray-500">/bulan</span>
            </div>
            
            <p className="text-sm text-gray-500 mb-6">
              Solusi infrastruktur untuk perusahaan yang ingin menggunakan teknologi TimorApp.
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <Check size={16} className="text-slate-900 mt-0.5 shrink-0" />
                <span>Dedicated IP Address</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <Check size={16} className="text-slate-900 mt-0.5 shrink-0" />
                <span>API Access (Integrasi Sistem)</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <Check size={16} className="text-slate-900 mt-0.5 shrink-0" />
                <span>Manajemen Multi-User (Dashboard Admin)</span>
              </li>
               <li className="flex items-start gap-2 text-sm text-gray-700">
                <Check size={16} className="text-slate-900 mt-0.5 shrink-0" />
                <span>SLA Jaminan Uptime 99.9%</span>
              </li>
            </ul>

            <Button 
              fullWidth 
              variant="secondary"
              onClick={() => alert("Silakan hubungi tim sales kami di sales@timorapp.com untuk demonstrasi dan setup akun perusahaan.")}
            >
              <Briefcase size={16} className="mr-2" />
              Hubungi Sales
            </Button>
          </div>
        </Card>

      </div>

      {/* Feature Comparison / Tech Stack Showcase */}
      <div className="mt-16 bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
           <div className="absolute top-10 left-10 w-32 h-32 border border-blue-500 rounded-full"></div>
           <div className="absolute bottom-10 right-10 w-64 h-64 border border-purple-500 rounded-full"></div>
        </div>

        <div className="relative z-10 text-center mb-12">
           <h2 className="text-2xl font-bold mb-4">Mengapa Perusahaan Memilih Teknologi TimorApp?</h2>
           <p className="text-slate-400 max-w-2xl mx-auto">
             Kami menyediakan infrastruktur jaringan paling canggih di Timor-Leste dengan standar keamanan internasional.
           </p>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-blue-500 transition-colors group">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                 <ShieldCheck className="text-blue-400 group-hover:text-white" size={24} />
              </div>
              <h4 className="font-bold mb-2">Military-Grade Security</h4>
              <p className="text-sm text-slate-400">Enkripsi AES-256 dan perlindungan DDoS otomatis real-time.</p>
           </div>
           
           <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-purple-500 transition-colors group">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500 transition-colors">
                 <Database className="text-purple-400 group-hover:text-white" size={24} />
              </div>
              <h4 className="font-bold mb-2">Local Data Compliance</h4>
              <p className="text-sm text-slate-400">Data center lokal di Dili memastikan kepatuhan regulasi data.</p>
           </div>

           <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-green-500 transition-colors group">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500 transition-colors">
                 <Zap className="text-green-400 group-hover:text-white" size={24} />
              </div>
              <h4 className="font-bold mb-2">Low Latency</h4>
              <p className="text-sm text-slate-400">Jalur fiber optik langsung menjamin koneksi tercepat.</p>
           </div>

           <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-red-500 transition-colors group">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-500 transition-colors">
                 <Server className="text-red-400 group-hover:text-white" size={24} />
              </div>
              <h4 className="font-bold mb-2">99.9% Uptime SLA</h4>
              <p className="text-sm text-slate-400">Jaminan ketersediaan layanan untuk operasional bisnis kritis.</p>
           </div>
        </div>
      </div>
    </div>
  );
};