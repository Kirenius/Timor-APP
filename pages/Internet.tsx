
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Shield, ShieldCheck, Zap, Globe, Lock, RefreshCw, Power, Server, Map, Crown, Loader2, Bluetooth, Smartphone, Share2, Radio, Check, Crosshair, AlertOctagon, Terminal, Radar, Skull, Activity, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ServerNode, User, SecurityThreat, AttackEvent } from '../types';

interface InternetProps {
  user: User;
  onUpgrade: () => void;
}

// Coordinates for visual mapping on the SVG (approximate percentages)
const COUNTRY_COORDS: Record<string, { x: number, y: number }> = {
  'USA': { x: 20, y: 35 },
  'China': { x: 75, y: 35 },
  'Russia': { x: 65, y: 20 },
  'Brazil': { x: 30, y: 65 },
  'Germany': { x: 52, y: 28 },
  'Indonesia': { x: 78, y: 60 },
  'Australia': { x: 85, y: 75 },
  'India': { x: 68, y: 45 },
  'Japan': { x: 85, y: 35 },
  'UK': { x: 48, y: 25 },
};

export const Internet: React.FC<InternetProps> = ({ user, onUpgrade }) => {
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'connecting' | 'authenticating' | 'disconnecting'>('disconnected');
  const [timer, setTimer] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  
  // Bluetooth State
  const [btStatus, setBtStatus] = useState<'idle' | 'scanning' | 'active'>('idle');
  const [btDevices, setBtDevices] = useState<Array<{id: number, name: string, location: string, signal: number}>>([]);
  const [connectedBtDeviceId, setConnectedBtDeviceId] = useState<number | null>(null);

  // Global Threat Intelligence State (For All Users)
  const [globalAttacks, setGlobalAttacks] = useState<AttackEvent[]>([]);
  const [activeAttacks, setActiveAttacks] = useState<AttackEvent[]>([]); // For map pulsing

  // ADMIN ONLY: Threat Tracking State
  const [threats, setThreats] = useState<SecurityThreat[]>([]);
  const [traceLog, setTraceLog] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Server State Management with VIP flags
  const [servers, setServers] = useState<ServerNode[]>([
    { id: 1, country: 'Timor-Leste', code: 'TL', city: 'Dili', latency: '12ms', status: 'Optimal', x: 82, y: 68, isVip: false },
    { id: 2, country: 'Singapore', code: 'SG', city: 'Jurong', latency: '45ms', status: 'Cepat', x: 76, y: 58, isVip: true },
    { id: 3, country: 'Australia', code: 'AU', city: 'Darwin', latency: '58ms', status: 'Cepat', x: 84, y: 75, isVip: true },
    { id: 4, country: 'Indonesia', code: 'ID', city: 'Jakarta', latency: '62ms', status: 'Normal', x: 78, y: 64, isVip: false },
  ]);
  const [activeServerId, setActiveServerId] = useState<number | null>(null);

  const isSuperAdmin = user.role === 'Super Admin';

  // Format timer to HH:MM:SS
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // AUTO-CONNECT: Restore last server from local storage
  useEffect(() => {
    // Only attempt auto-connect if we are currently disconnected (initial load)
    if (status !== 'disconnected') return;

    const savedServerId = localStorage.getItem('timor_last_server');
    if (savedServerId) {
      const id = parseInt(savedServerId);
      const savedServer = servers.find(s => s.id === id);

      if (savedServer) {
        // If the saved server is VIP and user is NOT VIP, do not auto-connect
        if (savedServer.isVip && !user.isVip) {
          return;
        }

        setActiveServerId(id);
        
        // Initiate Auto-Connection Sequence
        setStatus('connecting');
        setTimeout(() => {
          setStatus('authenticating');
          setTimeout(() => {
            setStatus('connected');
          }, 1500);
        }, 1000);
      }
    }
  }, []); // Empty dependency array ensures this runs only once when component mounts

  // GLOBAL ATTACK SIMULATION ALGORITHM
  useEffect(() => {
    const countries = Object.keys(COUNTRY_COORDS);
    const attackTypes: AttackEvent['type'][] = ['BACKDOOR', 'PHISHING', 'RANSOMWARE', 'EXPLOIT'];
    const protocols = ['TCP/443', 'UDP/1194', 'TCP/22', 'HTTP/8080'];

    const interval = setInterval(() => {
        // 40% chance to spawn an attack every interval
        if (Math.random() > 0.4) {
            const target = countries[Math.floor(Math.random() * countries.length)];
            const source = countries[Math.floor(Math.random() * countries.length)];
            const type = attackTypes[Math.floor(Math.random() * attackTypes.length)];
            
            // Generate unique ID
            const newAttack: AttackEvent = {
                id: Math.random().toString(36).substr(2, 9),
                targetCountry: target,
                sourceCountry: source,
                type: type,
                targetCoords: COUNTRY_COORDS[target],
                timestamp: new Date().toLocaleTimeString(),
                severity: type === 'BACKDOOR' ? 'CRITICAL' : (type === 'RANSOMWARE' ? 'EXTREME' : 'HIGH'),
                protocol: protocols[Math.floor(Math.random() * protocols.length)]
            };

            // Add to logs (limit 10)
            setGlobalAttacks(prev => [newAttack, ...prev].slice(0, 10));
            
            // Add to active map visualization (remove after animation)
            setActiveAttacks(prev => [...prev, newAttack]);
            setTimeout(() => {
                setActiveAttacks(prev => prev.filter(a => a.id !== newAttack.id));
            }, 3000); // 3s pulse animation
        }
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // ADMIN ALGORITHM: Specific Threat Tracking
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

  // Simulate Chart Data
  useEffect(() => {
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      name: i,
      speed: 0,
    }));
    setChartData(initialData);

    const interval = setInterval(() => {
      setChartData(prev => {
        const newData = [...prev.slice(1)];
        // Simulate Gigabit Speed (approx 950-1050 Mbps) when connected
        const newSpeed = status === 'connected' 
          ? Math.floor(Math.random() * (1050 - 950 + 1) + 950)
          : Math.floor(Math.random() * 5); 
        
        newData.push({
          name: prev[prev.length - 1].name + 1,
          speed: newSpeed
        });
        return newData;
      });

      if (status === 'connected') {
        setTimer(t => t + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  const handleToggleConnection = (overrideServerId?: number) => {
    const targetId = overrideServerId ?? activeServerId;
    const targetServer = servers.find(s => s.id === targetId);
    if (targetId && targetServer?.isVip && !user.isVip) {
      onUpgrade();
      return;
    }

    if (status === 'connected') {
      setStatus('disconnecting');
      setTimeout(() => {
        setStatus('disconnected');
        setTimer(0);
      }, 1500);
    } else {
      setStatus('connecting');
      setTimeout(() => {
        setStatus('authenticating');
        setTimeout(() => {
          setStatus('connected');
          
          let finalServerId = targetId;
          
          if (targetId === null && !overrideServerId) {
            const optimalServer = servers.find(s => s.status === 'Optimal');
            if (optimalServer) {
              setActiveServerId(optimalServer.id);
              finalServerId = optimalServer.id;
            }
          }

          // SAVE CONNECTION TO LOCAL STORAGE
          if (finalServerId) {
            localStorage.setItem('timor_last_server', finalServerId.toString());
          }
        }, 2000);
      }, 1500);
    }
  };

  const handleConnectFastest = () => {
    const accessibleServers = user.isVip ? servers : servers.filter(s => !s.isVip);
    const sortedServers = [...accessibleServers].sort((a, b) => {
      const latA = parseInt(a.latency.replace('ms', ''));
      const latB = parseInt(b.latency.replace('ms', ''));
      return latA - latB;
    });

    if (sortedServers.length > 0) {
      const fastest = sortedServers[0];
      setActiveServerId(fastest.id);
      if (status === 'disconnected') {
        handleToggleConnection(fastest.id);
      }
    }
  };

  const handleServerSelect = (id: number) => {
    if (status !== 'disconnected' && status !== 'connected') return;
    setActiveServerId(id);
  };

  const handleToggleBluetooth = () => {
    if (btStatus === 'active') {
      setBtStatus('idle');
      setBtDevices([]);
      setConnectedBtDeviceId(null);
    } else {
      setBtStatus('scanning');
      setConnectedBtDeviceId(null);
      setTimeout(() => {
        setBtStatus('active');
        const foundDevices = [
          { id: 1, name: 'iPhone 15 Pro Max', location: 'Tokyo, JP', signal: 95 },
          { id: 2, name: 'Samsung S24 Ultra', location: 'London, UK', signal: 82 },
          { id: 3, name: 'MacBook Air M3', location: 'New York, USA', signal: 78 },
          { id: 4, name: 'Timor Mesh Node #88', location: 'Dili, TL', signal: 100 },
        ];
        setBtDevices(foundDevices);
        if (foundDevices.length > 0) {
          const bestDevice = foundDevices.reduce((prev, current) => 
            (prev.signal > current.signal) ? prev : current
          );
          setConnectedBtDeviceId(bestDevice.id);
        }
      }, 3000);
    }
  };

  const currentServer = servers.find(s => s.id === activeServerId);
  const isVipLocked = currentServer?.isVip && !user.isVip;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Internet Privasi
            {user.isVip && <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full border border-yellow-200 font-bold flex items-center"><Crown size={10} className="mr-1 fill-current"/> VIP ACTIVE</span>}
          </h1>
          <p className="text-gray-500">Koneksi berkecepatan tinggi dengan enkripsi tingkat lanjut.</p>
        </div>
        
        {/* Status Indicator */}
        <div className={`flex items-center gap-3 px-5 py-2.5 rounded-xl border shadow-sm transition-all duration-300 ${
          status === 'connected' 
            ? 'bg-emerald-50 border-emerald-200' 
            : 'bg-rose-50 border-rose-200'
        }`}>
          <div className={`p-2 rounded-lg ${status === 'connected' ? 'bg-emerald-100' : 'bg-rose-100'}`}>
            {status === 'connected' ? <ShieldCheck size={24} className="text-emerald-600" /> : <Shield size={24} className="text-rose-600" />}
          </div>
          <div className="flex flex-col">
            <span className={`text-[10px] font-bold uppercase ${status === 'connected' ? 'text-emerald-700' : 'text-rose-700'}`}>Status</span>
            <span className={`text-sm font-bold ${status === 'connected' ? 'text-emerald-800' : 'text-rose-800'}`}>
              {status === 'connected' ? 'AMAN & TERENKRIPSI' : 'RENTAN / TERBUKA'}
            </span>
          </div>
        </div>
      </div>

      {/* PREMIUM BANNER */}
      {!user.isVip && (
        <div className="bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl p-6 shadow-lg text-white flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-10 -translate-y-10">
            <Crown size={120} />
          </div>
          <div className="z-10">
             <h3 className="text-xl font-bold flex items-center gap-2">
               <Crown className="fill-current" />
               Upgrade ke Premium
             </h3>
             <p className="text-yellow-50 max-w-lg mt-1">
               Nikmati kecepatan tanpa batas, akses server internasional (Singapore, Australia), dan hilangkan iklan selamanya.
             </p>
          </div>
          <Button className="bg-white text-yellow-700 hover:bg-yellow-50 font-bold" onClick={onUpgrade}>
            Mulai Trial Gratis
          </Button>
        </div>
      )}

      {/* --- GLOBAL CYBER THREAT INTELLIGENCE (GCTI) MAP --- */}
      <Card className="bg-slate-900 border-slate-800 overflow-hidden shadow-2xl relative">
        <div className="p-4 border-b border-slate-800 bg-black/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Globe className="text-blue-500 animate-pulse" size={20} />
                <h3 className="text-lg font-mono font-bold tracking-widest text-blue-400">GLOBAL CYBER THREAT INTELLIGENCE</h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
               <span className="text-slate-400">ALGORITHM: <span className="text-green-400">HEURISTIC V9</span></span>
               <span className="flex items-center gap-1 text-red-500 animate-pulse"><Skull size={12} /> {globalAttacks.length} ACTIVE INCIDENTS</span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* World Map Visualization */}
            <div className="lg:col-span-2 relative h-[400px] bg-[#050a14] border-r border-slate-800">
                {/* World Map SVG */}
                <svg viewBox="0 0 100 100" className="w-full h-full opacity-30 pointer-events-none absolute top-0 left-0" preserveAspectRatio="none">
                    <path d="M10,20 Q30,10 50,30 T90,20 Q95,40 80,60 T40,80 Q20,70 10,20" fill="#1e293b" />
                    {/* Grid Overlay inside SVG for effect */}
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1e293b" strokeWidth="0.1"/>
                    </pattern>
                    <rect width="100" height="100" fill="url(#grid)" />
                </svg>

                {/* Render Active Attacks */}
                {activeAttacks.map((attack) => (
                    <div key={attack.id} className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ left: `${attack.targetCoords.x}%`, top: `${attack.targetCoords.y}%` }}>
                        {/* Explosive Pulse */}
                        <div className="relative">
                             <div className="absolute inset-0 rounded-full animate-ping bg-red-600 opacity-75 h-8 w-8 -ml-4 -mt-4"></div>
                             <div className="absolute inset-0 rounded-full animate-ping bg-red-600 opacity-50 h-12 w-12 -ml-6 -mt-6 delay-75"></div>
                             <div className="h-2 w-2 bg-red-500 rounded-full shadow-[0_0_10px_#ef4444]"></div>
                             
                             {/* Label */}
                             <div className="absolute left-4 top-[-10px] bg-red-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded border border-red-500/50 whitespace-nowrap animate-fade-in z-50">
                                 {attack.type} DETECTED
                                 <div className="text-[7px] text-red-300">{attack.targetCountry}</div>
                             </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Live Attack Feed */}
            <div className="bg-black font-mono text-xs flex flex-col h-[400px]">
                <div className="p-3 bg-slate-900/50 border-b border-slate-800 flex justify-between">
                    <span className="text-slate-400">LIVE THREAT FEED</span>
                    <Activity size={14} className="text-green-500 animate-pulse" />
                </div>
                
                <div className="flex-1 overflow-y-hidden relative p-4">
                     <div className="flex flex-col gap-2">
                        {globalAttacks.map((attack) => (
                            <div key={attack.id} className="border-b border-slate-800/50 pb-2 mb-1 animate-fade-in">
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`font-bold ${
                                        attack.type === 'BACKDOOR' ? 'text-purple-400' : 
                                        attack.type === 'RANSOMWARE' ? 'text-red-500' : 'text-orange-400'
                                    }`}>
                                        {attack.type}
                                    </span>
                                    <span className="text-[9px] text-slate-500">{attack.timestamp}</span>
                                </div>
                                <div className="text-slate-300 flex items-center gap-2">
                                    <span>{attack.sourceCountry}</span>
                                    <span className="text-red-500 text-[9px]">{'>'}</span>
                                    <span className="text-white font-bold">{attack.targetCountry}</span>
                                </div>
                                <div className="mt-1 flex justify-between text-[9px]">
                                    <span className="text-slate-500">{attack.protocol}</span>
                                    <span className={`px-1 rounded ${
                                        attack.severity === 'EXTREME' ? 'bg-red-900 text-white' : 'bg-slate-800 text-slate-400'
                                    }`}>{attack.severity}</span>
                                </div>
                            </div>
                        ))}
                     </div>
                     {/* Overlay gradient for scrolling effect */}
                     <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-black to-transparent"></div>
                </div>
            </div>
        </div>
      </Card>

      {/* Connection Control & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
          <div className="mb-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900">Durasi Koneksi</h3>
            <p className={`text-3xl font-mono font-bold mt-2 transition-colors ${
              status === 'connected' ? 'text-emerald-600' : 'text-slate-400'
            }`}>{formatTime(timer)}</p>
          </div>

          <button
            onClick={() => isVipLocked ? onUpgrade() : handleToggleConnection()}
            disabled={status === 'connecting' || status === 'authenticating' || status === 'disconnecting'}
            className={`
              w-40 h-40 rounded-full flex items-center justify-center border-8 transition-all duration-500 focus:outline-none relative
              ${status === 'connected' 
                ? 'border-emerald-500 text-emerald-600 bg-emerald-50 scale-105' 
                : isVipLocked 
                  ? 'border-yellow-400 text-yellow-500 bg-yellow-50 hover:bg-yellow-100 cursor-pointer'
                  : 'border-slate-200 text-slate-400 hover:border-red-500 hover:text-red-500 bg-white hover:bg-red-50'
              }
            `}
          >
            {isVipLocked ? <Crown size={64} className="fill-yellow-100" /> : <Power size={64} />}
          </button>

          <div className="mt-8 w-full px-4">
             <Button 
               fullWidth 
               variant="outline" 
               onClick={handleConnectFastest}
               disabled={status !== 'disconnected'}
               className="bg-white border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all group"
             >
               <Zap size={16} className="mr-2 group-hover:fill-current" />
               Koneksi Tercepat
             </Button>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 flex flex-col items-center justify-center text-center">
              <div className="text-sm text-gray-500">Kecepatan</div>
              <div className="text-xl font-bold text-gray-900">{status === 'connected' ? '1000' : '0'} Mbps</div>
            </Card>
            <Card className="p-4 flex flex-col items-center justify-center text-center">
              <div className="text-sm text-gray-500">Latency</div>
              <div className="text-xl font-bold text-gray-900">{status === 'connected' && currentServer ? currentServer.latency.replace('ms','') : '-'} ms</div>
            </Card>
            <Card className="p-4 flex flex-col items-center justify-center text-center">
              <div className="text-sm text-gray-500">Lokasi</div>
              <div className="text-xl font-bold text-gray-900">{status === 'connected' && currentServer ? currentServer.code : '-'}</div>
            </Card>
          </div>

          <Card className="flex-1">
            <CardHeader title="Monitor Trafik" description="Analisis throughput jaringan realtime." />
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={status === 'connected' ? '#10b981' : '#94a3b8'} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={status === 'connected' ? '#10b981' : '#94a3b8'} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis hide dataKey="name" />
                  <YAxis hide domain={[0, 1200]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="speed" stroke={status === 'connected' ? '#10b981' : '#94a3b8'} strokeWidth={2} fillOpacity={1} fill="url(#colorSpeed)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
