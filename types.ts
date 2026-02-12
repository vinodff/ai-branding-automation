
import React from 'react';

export interface BrandContext {
  id?: string;
  industry: string;
  tone: string;
  target_audience: string;
  brand_personality: string;
  keywords: string[];
}

export interface BrandIdentity {
  name: string;
  industry: string;
  vibe: string;
  tagline?: string;
}

export enum AppRoute {
  DASHBOARD = 'dashboard',
  CONTEXT = 'context',
  NAME_GEN = 'name-gen',
  LOGO_GEN = 'logo-gen',
  CONTENT_GEN = 'content-gen',
  SENTIMENT = 'sentiment',
  ASSISTANT = 'assistant',
  RESEARCH = 'research',
  ROADMAP = 'roadmap',
}

export interface NavItem {
  id: AppRoute;
  label: string;
  icon: React.ReactNode;
}

export interface GeneratedBrandName {
  name: string;
  meaning: string;
}

export interface SentimentResult {
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number;
  breakdown: {
    trust: number;
    excitement: number;
    reliability: number;
  };
  summary: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface RoadmapStep {
  day: number;
  task: string;
  phase: 'Identity' | 'Visuals' | 'Launch';
  description: string;
}
