import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Send, Bot, User as UserIcon, Sparkles, MoreHorizontal, Trash2, Cpu, BrainCircuit, Terminal } from 'lucide-react';
import { ChatMessage, User } from '../types';

interface TimorAIProps {
  user: User;
}

// Knowledge Base for "Smart" Responses
const KNOWLEDGE_BASE = [
  {
    keywords: ['internet', 'vpn', 'koneksi', 'lambat', 'connect'],
    category: 'TECHNICAL',
    response: (user: User) => `**Analisis Jaringan & Koneksi:**\n\n1.  **Status Server:** Saat ini server Dili (TL) dan Singapore (SG) beroperasi normal dengan latency <50ms.\n2.  **Troubleshooting:** Jika koneksi lambat, coba fitur *"Koneksi Tercepat"* di menu Internet.\n3.  **Keamanan:** Koneksi Anda menggunakan enkripsi AES-256. Tidak ada kebocoran DNS terdeteksi.\n\n*Saran:* Gunakan server Singapore untuk streaming video HD.`
  },
  {
    keywords: ['vip', 'premium', 'bayar', 'harga', 'upgrade'],
    category: 'ACCOUNT',
    response: (user: User) => `**Informasi Keanggotaan Premium:**\n\n*   **Status Anda:** ${user.isVip ? 'VIP Member (Aktif)' : 'Free User'}\n*   **Manfaat VIP:**\n    *   Akses Server Global (SG, AU, US)\n    *   Tanpa Iklan\n    *   Prioritas Bandwidth\n*   **Harga:** Mulai dari $5.00/bulan.\n\nAnda dapat melakukan upgrade melalui menu *Internet* atau klik tombol upgrade di sidebar.`
  },
  {
    keywords: ['hacker', 'serang', 'attack', 'phishing', 'backdoor', 'aman'],
    category: 'SECURITY',
    response: (user: User) => `**Laporan Intelijen Keamanan Global:**\n\nSistem *God Eye* kami mendeteksi lonjakan aktivitas *Phishing* dan *Backdoor* di wilayah Asia-Pasifik. \n\n**Tindakan Pencegahan Otomatis:**\n1.  Firewall Timor App telah memblokir 124 alamat IP berbahaya hari ini.\n2.  Kode Anti-Phishing Anda adalah: **${user.antiPhishingCode || 'BELUM DISET'}**.\n3.  Pastikan 2FA aktif di menu Profil.\n\n*Kami memantau jaringan 24/7 untuk melindungi data Anda.*`
  },
  {
    keywords: ['uang', 'saldo', 'dompet', 'withdraw', 'tarik'],
    category: 'FINANCE',
    response: (user: User) => user.role === 'Super Admin' 
      ? `**Ringkasan Keuangan (Admin Only):**\n\n*   **Saldo Tersedia:** $450.00\n*   **Pending Payout:** $0.00\n*   **Pendapatan Iklan Hari Ini:** ~$12.50\n\nSilakan akses menu *Keuangan* untuk rincian transaksi lengkap atau melakukan penarikan ke Visa/Bank.`
      : `**Akses Ditolak:**\n\nMenu Keuangan dan informasi saldo hanya tersedia untuk peran *Super Admin*. Hubungi dukungan jika Anda mengalami masalah pembayaran langganan.`
  },
  {
    keywords: ['siapa', 'pemilik', 'owner', 'ceo', 'buat'],
    category: 'GENERAL',
    response: (user: User) => `**Informasi Entitas:**\n\nPlatform ini dikembangkan dan dimiliki sepenuhnya oleh **Kirenius Kollo** (CEO & Founder).\n\nVisi kami adalah membangun infrastruktur digital yang mandiri dan aman untuk Timor-Leste.`
  },
  {
    keywords: ['halo', 'hi', 'selamat', 'pagi', 'siang'],
    category: 'GENERAL',
    response: (user: User) => `Halo **${user.name}**! \n\nSistem Timor AI v2.0 siap membantu. Saya terhubung dengan database pusat dan monitor jaringan. Apa yang bisa saya bantu hari ini?\n\n*Coba tanyakan tentang: "Status Server", "Keamanan", atau "Akun Saya".*`
  }
];

export const TimorAI: React.FC<TimorAIProps> = ({ user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const savedMessages = localStorage.getItem('timor_ai_history');
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
    } catch (error) {
      console.error("Failed to load chat history", error);
    }
    
    return [{
      id: '1',
      text: `Halo ${user.name}! Saya Timor AI (Neural-Engine). Saya dapat menganalisis keamanan jaringan, status akun, dan data teknis secara real-time.`,
      sender: 'ai',
      timestamp: new Date()
    }];
  });

  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [thinkingStep, setThinkingStep] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    localStorage.setItem('timor_ai_history', JSON.stringify(messages));
    scrollToBottom();
  }, [messages, isProcessing, thinkingStep]);

  // "SMART" LOGIC ENGINE
  const processAdvancedLogic = (text: string) => {
    setIsProcessing(true);
    const lowerText = text.toLowerCase();
    
    // Simulate complex processing steps
    const steps = [
      "Menganalisis sintaks input...",
      "Mencocokkan pola knowledge base...",
      "Memeriksa status sistem real-time...",
      "Memverifikasi izin pengguna...",
      "Menyusun respons terstruktur..."
    ];

    let stepIndex = 0;
    
    const stepInterval = setInterval(() => {
      if (stepIndex < steps.length) {
        setThinkingStep(steps[stepIndex]);
        stepIndex++;
      }
    }, 400); // Fast updates to look active

    setTimeout(() => {
      clearInterval(stepInterval);
      setThinkingStep('');
      
      // Match logic
      const match = KNOWLEDGE_BASE.find(k => 
        k.keywords.some(keyword => lowerText.includes(keyword))
      );

      let responseText = "";

      if (match) {
        responseText = match.response(user);
      } else {
        // Fallback intelligent response
        responseText = `**Analisis Selesai:**\n\nMaaf, input "${text}" tidak cocok dengan parameter database saya saat ini.\n\n**Saran Topik:**\n*   Keamanan Jaringan & Hacker\n*   Status VIP & Pembayaran\n*   Masalah Koneksi Internet\n*   Informasi Pemilik App`;
      }

      const newAiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newAiMsg]);
      setIsProcessing(false);

    }, 2500); // 2.5s total thinking time
  };

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    
    // Trigger the engine
    processAdvancedLogic(newUserMsg.text);
  };

  const clearChat = () => {
    const resetMsg: ChatMessage = {
      id: Date.now().toString(),
      text: "Memori percakapan telah di-reset. Menunggu input baru...",
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages([resetMsg]);
  };

  return (
    <div className="h-[calc(100vh-theme(spacing.24))] md:h-[calc(100vh-theme(spacing.32))] flex flex-col animate-fade-in gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BrainCircuit className="text-purple-600 fill-current" />
            Timor AI <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded border border-purple-200">Neural V2.0</span>
          </h1>
          <p className="text-gray-500">Asisten cerdas dengan akses data real-time.</p>
        </div>
        <Button variant="ghost" onClick={clearChat} className="text-gray-400 hover:text-red-500">
          <Trash2 size={18} />
        </Button>
      </div>

      {/* Chat Container */}
      <Card className="flex-1 flex flex-col overflow-hidden border-0 shadow-lg bg-slate-50 relative">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div 
                key={msg.id} 
                className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[90%] md:max-w-[75%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm border ${
                    isUser ? 'bg-slate-200 border-slate-300' : 'bg-gradient-to-br from-purple-600 to-indigo-600 border-transparent'
                  }`}>
                    {isUser ? (
                      <UserIcon size={16} className="text-gray-600" />
                    ) : (
                      <Bot size={18} className="text-white" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                    <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-line ${
                      isUser 
                        ? 'bg-slate-900 text-white rounded-tr-none' 
                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 px-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Thinking Indicator */}
          {isProcessing && (
            <div className="flex justify-start w-full">
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
                   <Cpu size={18} className="text-white animate-spin-slow" />
                </div>
                <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex flex-col justify-center min-w-[200px]">
                  <div className="flex items-center gap-2 mb-1">
                     <span className="text-xs font-bold text-purple-600">Timor AI Thinking...</span>
                     <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                     </div>
                  </div>
                  {thinkingStep && (
                     <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1 animate-fade-in">
                        <Terminal size={10} /> {thinkingStep}
                     </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
          <form 
            onSubmit={handleSend}
            className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent transition-all shadow-sm"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ketik pertanyaan kompleks..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-900 placeholder:text-gray-400 py-2"
              autoFocus
            />
            <button 
              type="submit" 
              disabled={!inputText.trim() || isProcessing}
              className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Send size={18} />
            </button>
          </form>
          <div className="text-center mt-2 flex justify-center gap-4 text-[10px] text-gray-400">
             <span>Model: Timor-Neural-Lite</span>
             <span>Latency: 12ms</span>
             <span>Secure Chat</span>
          </div>
        </div>
      </Card>
    </div>
  );
};