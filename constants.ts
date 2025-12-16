import { User } from './types';

export const APP_CONFIG = {
  name: 'Timor App',
  ownerEmail: 'kiren@timorapp.com',
  url: 'https://timorapp.com/join',
  pricing: {
    personal: '$5.00/bln',
    enterprise: '$49.99/bln'
  }
};

export const INITIAL_USER_CONFIG: User = {
  id: 'u-001',
  name: 'Kiren K',
  email: APP_CONFIG.ownerEmail,
  role: 'Super Admin',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
  isVip: true,
  pin: '123456',
  antiPhishingCode: 'TIMOR-SECURE-88',
  security: {
    level: 10,
    twoFactorEnabled: true,
    biometricEnabled: true,
    ipWhitelist: ['192.168.1.1', '10.0.0.5'],
    ghostMode: false,
    loginAlerts: true,
    hardwareKeyLinked: true,
    lastSecurityAudit: '2024-05-21 08:00:00'
  },
  auditLog: [
    { id: 'log-1', timestamp: '2024-05-21 14:30', action: 'Login Attempt', ip: '114.125.x.x', location: 'Dili, TL', device: 'iPhone 15 Pro', status: 'success', riskLevel: 'Low' },
    { id: 'log-2', timestamp: '2024-05-21 10:15', action: 'Password Change', ip: '114.125.x.x', location: 'Dili, TL', device: 'MacBook Pro', status: 'success', riskLevel: 'Medium' },
    { id: 'log-3', timestamp: '2024-05-20 22:45', action: 'Suspicious Access', ip: '185.200.x.x', location: 'Moscow, RU', device: 'Unknown Browser', status: 'blocked', riskLevel: 'Critical' },
  ]
};