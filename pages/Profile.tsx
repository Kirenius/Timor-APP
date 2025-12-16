import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { User, Mail, Phone, MapPin, Camera, Save, Laptop, ShieldCheck, Lock, Smartphone, Fingerprint, Eye, EyeOff, AlertTriangle, Key, Activity, Globe, Shield, RefreshCw, Crosshair, AlertOctagon, Radar, Terminal } from 'lucide-react';
import { User as UserType, SecurityThreat } from '../types';
import { APP_CONFIG } from '../constants';

interface ProfileProps {
  user: UserType;
  onToggleRole?: () => void;
  onUpdateProfile?: (updates: Partial<UserType>) => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onToggleRole, onUpdateProfile }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'security'>('general');
  
  // General Profile State
  const [isEditing, setIsEditing] = useState(false);
  
  // PIN Security State
  const [showPinVerify, setShowPinVerify] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // ADMIN ONLY: God Eye Threat Tracking State
  const [threats, setThreats] = useState<SecurityThreat[]>([]);
  const [traceLog, setTraceLog] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  const isSuperAdmin = user.role === 'Super Admin';

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: "+60 14 300 2703",
    location: "Malaysia",
    bio: "Founder & CEO Timor App. Pemilik tunggal dan pengelola infrastruktur jaringan global.",
    antiPhishingCode: user.antiPhishingCode || "TIMOR-SECURE-88"
  });
  
  // Security State
  const [securityData, setSecurityData] = useState(user.security || {
    level: 8,
    twoFactorEnabled: false,
    biometricEnabled: false,
    ipWhitelist: [],
    ghostMode: false,
    loginAlerts: true,
    hardwareKeyLinked: false,
    lastSecurityAudit: new Date().toISOString()
  });

  // Sync state with props when user changes (e.g. fresh login)
  useEffect(() => {
    setFormData({
        name: user.name,
        email: user.email,
        phone: "+60 14 300 2703",
        location: "Malaysia",
        bio: user.role === 'Super Admin' 
            ? "Founder & CEO Timor App. Pemilik tunggal dan pengelola infrastruktur jaringan global." 
            : "Pengguna Aplikasi Timor App.",
        antiPhishingCode: user.antiPhishingCode || "TIMOR-SECURE-88"
    });
    
    setSecurityData(user.security || {
        level: 8,
        twoFactorEnabled: false,
        biometricEnabled: false,
        ipWhitelist: [],
        ghostMode: false,
        loginAlerts: true,
        hardwareKeyLinked: false,
        lastSecurityAudit: new Date().toISOString()
    });
  }, [user]);

  // ADMIN ALGORITHM: Threat Simulation (God Eye System)
  useEffect(() => {
    if (!isSuperAdmin) return;

    const threatTypes: Array<SecurityThreat['type']> = ['PHISHING', 'DDOS', 'BRUTE_FORCE', 'SQL_INJECTION'];
    const locations = [
        { city: 'Moscow, RU', x: 65, y: 25 },
        { city: 'Beijing, CN', x: 75, y: 35 },
        { city: 'Pyongyang, KP', x: 80, y: 32 },
        { city: 'Lagos, NG', x: 52, y: 55 },
        { city: 'Brasilia, BR', x: 30, y: 65 }
    ];

    const addLog = (msg: string) => {
      setTraceLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 8));
    };

    const interval = setInterval(() => {
        // Randomly decide to spawn a threat (30% chance every 2 seconds)
        if (Math.random() > 0.7) {
            const loc = locations[Math.floor(Math.random() * locations.length)];
            const type = threatTypes[Math.floor(Math.random() * threatTypes.length)];
            const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
            
            const newThreat: SecurityThreat = {
                id: `thr-${Date.now()}`,
                ip,
                type,
                location: loc.city,
                coords: { x: loc.x + (Math.random() * 5 - 2.5), y: loc.y + (Math.random() * 5 - 2.5) },
                status: 'DETECTING',
                confidence: Math.floor(Math.random() * (99 - 60) + 60),
                timestamp: new Date().toLocaleTimeString()
            };

            setThreats(prev => [newThreat, ...prev].slice(0, 5));
            addLog(`SIGNAL DETECTED: Suspicious packet from ${ip} (${loc.city})`);

            // Simulate Tracing Lifecycle
            setTimeout(() => {
                setThreats(prev => prev.map(t => t.id === newThreat.id ? { ...t, status: 'TRACING' } : t));
                addLog(`TRIANGULATING: Calculating hops for ${ip}...`);
            }, 2000);

            setTimeout(() => {
                setThreats(prev => prev.map(t => t.id === newThreat.id ? { ...t, status: 'LOCKED' } : t));
                addLog(`TARGET LOCKED: ${type} Source Identified at ${loc.city}. Confidence: ${newThreat.confidence}%`);
            }, 4500);
            
            setTimeout(() => {
                setThreats(prev => prev.map(t => t.id === newThreat.id ? { ...t, status: 'NEUTRALIZED' } : t));
                addLog(`NEUTRALIZED: Firewall rules updated. Blocked ${ip}.`);
            }, 7000);
        }
    }, 2000);

    return () => clearInterval(interval);
  }, [isSuperAdmin]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- HANDLERS ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setIsEditing(false);
    } else {
      // Prompt for PIN before enabling edit mode
      setPinInput('');
      setPinError(false);
      setShowPinVerify(true);
    }
  };

  const verifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = user.pin || '123456';
    if (pinInput === correctPin) {
      setShowPinVerify(false);
      setIsEditing(true);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile({
        name: formData.name,
        email: formData.email,
        antiPhishingCode: formData.antiPhishingCode,
      });
    }
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdateProfile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateProfile({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const toggleSecurityFeature = (feature: keyof typeof securityData) => {
    setSecurityData(prev => ({
      ...prev,
      [feature]: !prev[feature as keyof typeof prev]
    }));
  };

  const handlePanicButton = () => {
    alert("PANIC MODE ACTIVATED:\n\n1. All active sessions terminated.\n2. Account locked.\n3. IP address masked.\n4. Admin notified.");
  };
  
  const isOwner = user.email === APP_CONFIG.ownerEmail;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in relative">
      
      {/* PIN Verification Modal */}
      {showPinVerify && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowPinVerify(false)} />
           <div className="relative bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm animate-fade-in flex flex-col items-center text-center">
             <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <Lock size={32} className="text-red-600" />
             </div>
             <h3 className="text-xl font-bold text-gray-900 mb-2">Verifikasi Keamanan</h3>
             <p className="text-sm text-gray-500 mb-6">Masukkan PIN 6-digit Anda untuk mengubah informasi profil sensitif.</p>
             
             <form onSubmit={verifyPin} className="w-full">
                <input 
                  type="password" 
                  maxLength={6}
                  placeholder="• • • • • •"
                  className="w-full text-center text-3xl tracking-[0.5em] font-bold text-gray-800 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-0 outline-none py-3 mb-4 transition-all"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  autoFocus
                />
                
                {pinError && (
                  <div className="flex items-center justify-center gap-2 text-red-500 text-xs font-medium mb-4 animate-bounce">
                    <AlertTriangle size={12} />
                    PIN Salah. Silakan coba lagi.
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-3">
                   <Button type="button" variant="ghost" fullWidth onClick={() => setShowPinVerify(false)}>Batal</Button>
                   <Button type="submit" fullWidth disabled={pinInput.length < 6}>Verifikasi</Button>
                </div>
             </form>
           </div>
        </div>
      )}

      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pengaturan Akun</h1>
          <p className="text-gray-500">Pusat kendali profil dan keamanan tingkat lanjut.</p>
        </div>
        <div className="flex p-1 bg-white border border-gray-200 rounded-xl">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'general' ? 'bg-slate-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Profil Umum
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'security' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <ShieldCheck size={16} />
            Security Layer 10
          </button>
        </div>
      </div>

      {activeTab === 'general' ? (
        // --- GENERAL PROFILE TAB ---
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Avatar Card */}
          <Card className="lg:col-span-1 flex flex-col items-center text-center p-8">
            <div className="relative group cursor-pointer" onClick={triggerFileInput}>
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg bg-gray-200 transition-transform group-hover:scale-105"
              />
              <div className="absolute bottom-1 right-1 bg-slate-900 text-white p-2 rounded-full border-2 border-white shadow-md transition-transform group-hover:scale-110">
                 <Camera size={16} />
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
            
            <button onClick={triggerFileInput} className="text-xs text-blue-600 font-medium mt-3 hover:underline">
              Ketuk untuk ganti foto
            </button>
            
            <h2 className="mt-4 text-xl font-bold text-gray-900">{user.name}</h2>
            <p className={`text-sm font-medium px-3 py-1 rounded-full mt-2 inline-block ${
               user.role === 'Super Admin' ? 'bg-purple-100 text-purple-700' : 'bg-red-50 text-red-600'
            }`}>
              {user.role}
            </p>
            
            {onToggleRole && isOwner && (
               <div className="mt-8 pt-4 border-t border-gray-100 w-full">
                 <p className="text-[10px] uppercase text-gray-400 font-bold mb-2">Owner Controls</p>
                 <button 
                   onClick={onToggleRole}
                   className="w-full flex items-center justify-center gap-2 p-2 text-xs border border-dashed border-purple-300 bg-purple-50 rounded hover:bg-purple-100 text-purple-700 transition-colors"
                 >
                   <Laptop size={14} />
                   Switch Mode ({user.role === 'Super Admin' ? 'Admin' : 'User'})
                 </button>
               </div>
             )}
          </Card>

          {/* Form Card */}
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <CardHeader title="Informasi Pribadi" />
              <Button 
                variant={isEditing ? 'ghost' : 'outline'} 
                onClick={handleEditToggle}
                className={`h-9 ${isEditing ? 'text-red-600 hover:text-red-700 hover:bg-red-50' : ''}`}
              >
                {isEditing ? 'Batal' : 'Ubah Data'}
              </Button>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="pl-9 w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 shadow-sm focus:ring-red-500 focus:border-red-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="pl-9 w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 shadow-sm focus:ring-red-500 focus:border-red-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="pl-9 w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 shadow-sm focus:ring-red-500 focus:border-red-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input 
                      type="text" 
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="pl-9 w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 shadow-sm focus:ring-red-500 focus:border-red-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea 
                  rows={4}
                  name="bio"
                  disabled={!isEditing}
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 shadow-sm focus:ring-red-500 focus:border-red-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                />
              </div>

              {isEditing && (
                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <Button type="submit">
                    <Save className="w-4 h-4 mr-2" />
                    Simpan Perubahan
                  </Button>
                </div>
              )}
            </form>
          </Card>
        </div>
      ) : (
        // --- SECURITY LAYER 10 TAB ---
        <div className="space-y-6">
          
          {/* GOD EYE TRACKING SYSTEM (SUPER ADMIN ONLY) */}
          {isSuperAdmin && (
            <Card className="bg-slate-950 border-slate-800 text-green-500 overflow-hidden shadow-2xl relative mb-6">
                {/* Header */}
                <div className="p-4 border-b border-slate-800 bg-black/50 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Crosshair className="animate-spin-slow text-red-500" size={20} />
                        <h3 className="text-lg font-mono font-bold tracking-widest text-red-500">GOD EYE TRACKING SYSTEM <span className="text-xs ml-2 bg-red-900/30 px-2 py-0.5 rounded">V4.0</span></h3>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono">
                       <span className="flex items-center gap-1 text-slate-400"><Radar size={12} /> SCANNING...</span>
                       <span className="flex items-center gap-1 text-red-500 animate-pulse"><AlertOctagon size={12} /> {threats.length} THREATS ACTIVE</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3">
                    {/* Visual Map */}
                    <div className="lg:col-span-2 relative h-[300px] bg-[#050a14] border-r border-slate-800">
                        {/* Grid Overlay */}
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                        
                        {/* World Map SVG (Dark Mode) */}
                        <svg viewBox="0 0 100 100" className="w-full h-full opacity-20 pointer-events-none absolute top-0 left-0" preserveAspectRatio="none">
                           <path d="M10,20 Q30,10 50,30 T90,20 Q95,40 80,60 T40,80 Q20,70 10,20" fill="#1e293b" />
                        </svg>

                        {/* Threat Markers */}
                        {threats.map((threat) => (
                            <div key={threat.id} className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000" style={{ left: `${threat.coords.x}%`, top: `${threat.coords.y}%` }}>
                                {/* Pulse Ring */}
                                <div className="absolute inset-0 rounded-full animate-ping bg-red-500/50" style={{ padding: '10px' }}></div>
                                
                                {/* Target Crosshair */}
                                <div className="relative group cursor-crosshair">
                                    <Crosshair size={24} className={`text-red-500 ${threat.status === 'LOCKED' ? 'scale-125' : 'animate-pulse'}`} />
                                    
                                    {/* Info Box */}
                                    <div className="absolute left-6 top-0 bg-slate-900/90 border border-red-900/50 p-2 rounded text-[10px] font-mono whitespace-nowrap z-50 backdrop-blur-sm min-w-[150px]">
                                        <div className="flex justify-between text-red-400 font-bold mb-1">
                                            <span>{threat.status}</span>
                                            <span>{threat.confidence}%</span>
                                        </div>
                                        <div className="text-slate-300">IP: {threat.ip}</div>
                                        <div className="text-slate-400">LOC: {threat.location}</div>
                                        <div className="text-red-500 mt-1">{threat.type}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {/* Radar Sweep Effect */}
                        <div className="absolute top-1/2 left-1/2 w-[150%] h-[150%] bg-gradient-to-r from-transparent via-green-500/5 to-transparent transform -translate-x-1/2 -translate-y-1/2 animate-[spin_4s_linear_infinite] pointer-events-none rounded-full border-t border-green-500/10"></div>
                    </div>

                    {/* Console Log */}
                    <div className="bg-black font-mono text-xs p-4 flex flex-col h-[300px]">
                        <div className="flex items-center gap-2 mb-2 text-slate-500 border-b border-slate-800 pb-2">
                            <Terminal size={14} />
                            <span>TERMINAL OUTPUT</span>
                        </div>
                        
                        <div className="flex-1 overflow-hidden relative">
                             <div className="absolute bottom-0 left-0 w-full flex flex-col gap-1">
                                {traceLog.map((log, idx) => (
                                    <div key={idx} className="break-all opacity-80 hover:opacity-100 transition-opacity">
                                        <span className="text-green-600 mr-2">{'>'}</span>
                                        <span className={log.includes('LOCKED') ? 'text-red-400 font-bold' : log.includes('NEUTRALIZED') ? 'text-blue-400' : 'text-slate-300'}>
                                            {log}
                                        </span>
                                    </div>
                                ))}
                                <div ref={logEndRef} className="animate-pulse text-green-500 mt-2">_</div>
                             </div>
                        </div>

                        {/* Stats Footer */}
                        <div className="mt-4 pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-[10px] text-slate-500">
                            <div>
                                BLOCKS TODAY
                                <div className="text-lg text-slate-200 font-bold">8,241</div>
                            </div>
                            <div>
                                PACKETS SNIFFED
                                <div className="text-lg text-slate-200 font-bold">14.2TB</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
          )}

          {/* Top Status Banner */}
          <div className="bg-slate-900 rounded-xl p-6 text-white shadow-2xl border border-slate-700 relative overflow-hidden">
             {/* Decorative Background */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full blur-[100px] opacity-10"></div>
             
             <div className="flex flex-col md:flex-row items-center justify-between relative z-10 gap-6">
                <div className="flex items-center gap-6">
                   <div className="relative">
                      <div className="w-20 h-20 rounded-full border-4 border-green-500 flex items-center justify-center bg-slate-800 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                         <Shield size={40} className="text-green-500" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-green-500 text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full border border-slate-900">
                         LVL 10
                      </div>
                   </div>
                   <div>
                      <h2 className="text-2xl font-bold mb-1">Status Keamanan: Maksimal</h2>
                      <p className="text-slate-400 text-sm max-w-md">
                         Akun Anda dilindungi oleh enkripsi AES-256 GCM, autentikasi multi-faktor biometrik, dan pemantauan ancaman real-time.
                      </p>
                   </div>
                </div>
                
                <div className="flex gap-4">
                   <div className="text-center px-4 py-2 bg-slate-800 rounded-lg border border-slate-700">
                      <div className="text-xs text-slate-400 mb-1">Security Score</div>
                      <div className="text-xl font-bold text-green-400 font-mono">100%</div>
                   </div>
                   <div className="text-center px-4 py-2 bg-slate-800 rounded-lg border border-slate-700">
                      <div className="text-xs text-slate-400 mb-1">Enkripsi</div>
                      <div className="text-xl font-bold text-blue-400 font-mono">256-BIT</div>
                   </div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Access Control Card */}
            <Card>
               <CardHeader title="Kontrol Akses (MFA)" description="Kelola lapisan autentikasi ganda." />
               
               <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                           <Smartphone size={20} />
                        </div>
                        <div>
                           <p className="font-semibold text-gray-900">Authenticator App</p>
                           <p className="text-xs text-gray-500">Google Auth / Authy</p>
                        </div>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer">
                       <input type="checkbox" className="sr-only peer" checked={securityData.twoFactorEnabled} onChange={() => toggleSecurityFeature('twoFactorEnabled')} />
                       <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                     </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                           <Fingerprint size={20} />
                        </div>
                        <div>
                           <p className="font-semibold text-gray-900">Biometric Login</p>
                           <p className="text-xs text-gray-500">Face ID / Touch ID</p>
                        </div>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer">
                       <input type="checkbox" className="sr-only peer" checked={securityData.biometricEnabled} onChange={() => toggleSecurityFeature('biometricEnabled')} />
                       <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                     </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                           <Key size={20} />
                        </div>
                        <div>
                           <p className="font-semibold text-gray-900">Hardware Key (YubiKey)</p>
                           <p className="text-xs text-gray-500">Physical Security Token</p>
                        </div>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer">
                       <input type="checkbox" className="sr-only peer" checked={securityData.hardwareKeyLinked} onChange={() => toggleSecurityFeature('hardwareKeyLinked')} />
                       <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                     </label>
                  </div>
               </div>
               
               <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="mb-4">
                     <label className="block text-sm font-semibold text-gray-900 mb-1">Kode Anti-Phishing</label>
                     <div className="relative">
                       <ShieldCheck className="absolute left-3 top-2.5 h-4 w-4 text-purple-500" />
                       <input 
                         type="text" 
                         value={formData.antiPhishingCode}
                         readOnly
                         className="pl-9 w-full rounded-lg border border-gray-200 bg-gray-50 p-2 text-sm text-gray-900 font-mono tracking-wide"
                       />
                       <div className="absolute right-3 top-2.5 text-xs text-green-600 font-bold flex items-center gap-1">
                          <CheckIcon /> Verified
                       </div>
                     </div>
                     <p className="text-[10px] text-gray-500 mt-1">
                       Pastikan kode ini selalu muncul di email resmi Timor App.
                     </p>
                  </div>
               </div>
            </Card>

            {/* Stealth & Monitor Card */}
            <Card className="flex flex-col">
               <CardHeader title="Stealth & Monitoring" description="Privasi tingkat lanjut dan pemantauan." />
               
               <div className="space-y-4 flex-1">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                     <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${securityData.ghostMode ? 'bg-slate-800 text-white' : 'bg-gray-200 text-gray-500'}`}>
                           {securityData.ghostMode ? <EyeOff size={20} /> : <Eye size={20} />}
                        </div>
                        <div>
                           <p className="font-semibold text-gray-900">Ghost Mode</p>
                           <p className="text-xs text-gray-500">Sembunyikan status online & lokasi</p>
                        </div>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer">
                       <input type="checkbox" className="sr-only peer" checked={securityData.ghostMode} onChange={() => toggleSecurityFeature('ghostMode')} />
                       <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-800"></div>
                     </label>
                  </div>

                  <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                     <h4 className="font-bold text-red-700 flex items-center gap-2 text-sm mb-2">
                        <AlertTriangle size={16} />
                        Panic Button (Darurat)
                     </h4>
                     <p className="text-xs text-red-600 mb-3">
                        Gunakan hanya dalam keadaan darurat. Ini akan mengunci akun, memutuskan semua sesi, dan menghapus cache lokal.
                     </p>
                     <button 
                        onClick={handlePanicButton}
                        className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded-lg shadow-sm active:scale-95 transition-all"
                     >
                        AKTIFKAN LOCKDOWN
                     </button>
                  </div>
               </div>
            </Card>
          </div>

          {/* Real-time Audit Log */}
          <Card>
             <div className="flex items-center justify-between mb-4">
                <CardHeader title="Audit Log Real-time" description="Aktivitas mencurigakan diblokir secara otomatis." />
                <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                   <Activity size={12} className="animate-pulse" />
                   Monitoring Active
                </div>
             </div>
             
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                   <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                      <tr>
                         <th className="px-6 py-3">Waktu</th>
                         <th className="px-6 py-3">Aktivitas</th>
                         <th className="px-6 py-3">Lokasi / IP</th>
                         <th className="px-6 py-3">Perangkat</th>
                         <th className="px-6 py-3">Risk Level</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                      {user.auditLog?.map((log) => (
                         <tr key={log.id} className="hover:bg-gray-50">
                            <td className="px-6 py-3 font-mono text-xs text-gray-500">{log.timestamp}</td>
                            <td className="px-6 py-3">
                               <span className={`font-medium ${log.status === 'blocked' ? 'text-red-600' : 'text-gray-900'}`}>
                                  {log.action}
                               </span>
                            </td>
                            <td className="px-6 py-3 text-gray-500">
                               <div className="flex items-center gap-1">
                                  <Globe size={12} /> {log.location}
                               </div>
                               <div className="text-[10px] font-mono">{log.ip}</div>
                            </td>
                            <td className="px-6 py-3 text-gray-500">{log.device}</td>
                            <td className="px-6 py-3">
                               <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                  log.riskLevel === 'Critical' ? 'bg-red-100 text-red-700' :
                                  log.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-green-100 text-green-700'
                               }`}>
                                  {log.riskLevel}
                               </span>
                            </td>
                         </tr>
                      ))}
                      {(!user.auditLog || user.auditLog.length === 0) && (
                         <tr>
                            <td colSpan={5} className="text-center py-6 text-gray-400">Belum ada catatan aktivitas.</td>
                         </tr>
                      )}
                   </tbody>
                </table>
             </div>
          </Card>
        </div>
      )}
    </div>
  );
};

const CheckIcon = () => (
  <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);