import React from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  isVip: boolean;
  pin?: string;
  antiPhishingCode?: string;
  auditLog?: AuditLogEntry[];
  security?: SecurityConfig;
}

export interface SecurityConfig {
  level: number; // 1-10
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
  ipWhitelist: string[];
  ghostMode: boolean; // Hide status from others
  loginAlerts: boolean;
  hardwareKeyLinked: boolean;
  lastSecurityAudit: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  ip: string;
  location: string;
  device: string;
  status: 'success' | 'warning' | 'blocked';
  riskLevel: 'Low' | 'Medium' | 'Critical';
}

export interface SecurityThreat {
  id: string;
  ip: string;
  type: 'PHISHING' | 'DDOS' | 'BRUTE_FORCE' | 'SQL_INJECTION';
  location: string;
  coords: { x: number; y: number }; // Percentage for map
  status: 'DETECTING' | 'TRACING' | 'LOCKED' | 'NEUTRALIZED';
  confidence: number; // 0-100%
  timestamp: string;
}

export interface AttackEvent {
  id: string;
  sourceCountry: string;
  targetCountry: string;
  type: 'BACKDOOR' | 'PHISHING' | 'RANSOMWARE' | 'EXPLOIT';
  targetCoords: { x: number; y: number };
  timestamp: string;
  severity: 'HIGH' | 'CRITICAL' | 'EXTREME';
  protocol: string;
}

export interface ServerNode {
  id: number;
  country: string;
  code: string;
  city: string;
  latency: string;
  status: 'Optimal' | 'Cepat' | 'Normal';
  x: number; 
  y: number;
  isVip: boolean;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit'; // credit = uang masuk, debit = uang keluar
  status: 'completed' | 'pending';
  method?: string;
}

export interface Withdrawal {
  amount: number;
  destination: string;
  method: 'visa' | 'bank';
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isThinking?: boolean;
}

export type ViewState = 'login' | 'dashboard' | 'profile' | 'internet' | 'wallet' | 'ai' | 'pricing';

export interface NavItem {
  id: ViewState;
  label: string;
  icon: React.ReactNode;
}