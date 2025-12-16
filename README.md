
# 🇹🇱 Timor App - Dashboard Admin & Network Intelligence

**Timor App** adalah dashboard administratif modern berbasis React yang mensimulasikan platform manajemen jaringan, keamanan siber, dan keuangan digital. Aplikasi ini dirancang dengan antarmuka pengguna (UI) tingkat tinggi, animasi halus, dan logika interaktif yang kompleks.

![Project Status](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Tech](https://img.shields.io/badge/Tech-React%20%7C%20TypeScript%20%7C%20Tailwind-blueviolet)

## ✨ Fitur Utama

### 1. 📊 Dashboard Komprehensif
- Visualisasi data trafik dan pendapatan menggunakan grafik interaktif (Recharts).
- Statistik real-time untuk pengguna, pendapatan, dan aktivitas server.
- Integrasi banner iklan dinamis (untuk pengguna non-VIP).

### 2. 🛡️ Internet Privasi & Keamanan (VPN Sim)
- **Simulasi Koneksi:** Menghubungkan ke server virtual (Timor-Leste, Singapore, Australia).
- **Auto-Connect:** Mengingat server terakhir dan otomatis terhubung saat aplikasi dibuka.
- **Speed Test:** Visualisasi kecepatan internet hingga **1000 Mbps**.
- **God Eye System:** Peta ancaman siber global (Global Cyber Threat Intelligence) yang memvisualisasikan serangan siber secara real-time pada peta dunia interaktif.

### 3. 🤖 Timor AI (Neural Engine)
- Asisten chat cerdas yang dapat menjawab pertanyaan tentang status server, keamanan akun, dan paket langganan.
- Efek simulasi "Thinking" sebelum menjawab.

### 4. 💰 Manajemen Dompet (Super Admin)
- Dashboard keuangan dengan konversi mata uang (USD, IDR, MYR, dll).
- Riwayat transaksi detail (Credit/Debit).
- Simulasi penarikan dana (Withdrawal) ke Visa atau Bank Transfer.

### 5. 👤 Profil & Keamanan Tingkat Lanjut
- Manajemen profil pengguna (Avatar, Bio).
- **Security Layer 10:** Simulasi pengaturan MFA (2FA, Biometric, Hardware Key).
- Audit Log real-time untuk memantau aktivitas mencurigakan.
- Verifikasi PIN untuk pengeditan data sensitif.

### 6. 💎 Sistem Tier (Free vs VIP)
- **Free:** Akses terbatas, iklan aktif, server terbatas.
- **VIP:** Akses server global, tanpa iklan, kecepatan prioritas.
- Simulasi pembayaran upgrade menggunakan Kartu Kredit atau E-Wallet lokal (Telemor/Telkomcel).

## 🛠️ Teknologi yang Digunakan

*   **Frontend:** React 18+ (Hooks, Context)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS (via CDN untuk demo ini, atau CLI untuk production)
*   **Icons:** Lucide React
*   **Charts:** Recharts
*   **Animation:** CSS Keyframes & Transitions

## 🚀 Cara Menjalankan Project

1.  **Clone Repository**
    ```bash
    git clone https://github.com/username/timor-app.git
    cd timor-app
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    # atau
    yarn install
    ```

3.  **Jalankan Server Development**
    ```bash
    npm start
    # atau
    npm run dev
    ```

4.  Buka browser di `http://localhost:3000` (atau port yang disediakan terminal).

## 🔑 Panduan Login (Simulasi)

Aplikasi ini memiliki logika Role-Based Access Control (RBAC) berdasarkan email yang digunakan saat login:

| Role | Email Login | Fitur |
| :--- | :--- | :--- |
| **Super Admin (Owner)** | `kiren@timorapp.com` | Akses penuh, Menu Dompet/Keuangan, God Eye System, Edit Mode. |
| **Admin / VIP** | `admin@timor.tl` | Status VIP aktif, Akses Server Premium, Tanpa Iklan. |
| **User Biasa** | *(Email sembarang)* | Fitur dasar, Iklan aktif, Server terbatas. |

> **Catatan:** Password bebas (simulasi).

## 📂 Struktur Folder

```
src/
├── components/      # Komponen UI (Button, Card, Sidebar, Modals)
├── pages/           # Halaman Utama (Dashboard, Internet, Wallet, dll)
├── types.ts         # Definisi TypeScript Interfaces
├── constants.ts     # Konfigurasi konstanta & data dummy
├── App.tsx          # Routing utama & State Management global
└── index.tsx        # Entry point
```

## 🤝 Kontribusi

Kontribusi selalu diterima! Silakan buat *Pull Request* untuk fitur baru atau perbaikan bug.

1.  Fork Project ini
2.  Buat Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit Perubahan (`git commit -m 'Add some AmazingFeature'`)
4.  Push ke Branch (`git push origin feature/AmazingFeature`)
5.  Buka Pull Request

## 📝 Lisensi

Didistribusikan di bawah Lisensi MIT. Lihat `LICENSE` untuk informasi lebih lanjut.

---

*Dibuat dengan ❤️ untuk Timor-Leste Digital Future.*
