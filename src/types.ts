import { LucideIcon } from 'lucide-react';

export interface NavItem {
  id: string;
  title: string;
  icon: LucideIcon;
  path: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'free' | 'pro' | 'team' | 'admin';
  subscriptionStatus?: 'none' | 'trialing' | 'active' | 'canceled' | 'past_due';
  trialEndDate?: string;
  planId?: string;
  stripeCustomerId?: string;
  createdAt?: string;
}

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
}

export interface Website {
  id: string;
  name: string;
  domain?: string;
  isPublished: boolean;
  updatedAt: string;
}

export interface AIWritingSuggestion {
  id: string;
  type: 'feedback' | 'suggestion' | 'rewrite';
  content: string;
  originalText?: string;
  position?: { start: number; end: number };
}
