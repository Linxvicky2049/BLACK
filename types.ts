
export interface Achievement {
  id: string;
  title: string;
  icon: string;
  description: string;
  dateEarned: string;
}

export interface UserStats {
  wins: number;
  tournamentsPlayed: number;
  tournamentsWon: number;
  kdRatio: string;
  mvps: number;
}

export interface SocialAccount {
  handle: string;
  verified: boolean;
}

export interface SocialLinks {
  twitter?: SocialAccount;
  discord?: SocialAccount;
  twitch?: SocialAccount;
  youtube?: SocialAccount;
  tiktok?: SocialAccount;
  psn?: string;
  xbox?: string;
  steam?: string;
}

export type UserRole = 'user' | 'admin' | 'clan_leader' | 'vip_host';

export interface User {
  id: string;
  username: string;
  email: string;
  phoneNumber?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  bio: string;
  rank: string;
  country: string;
  walletBalance: number; // Real Money (NGN)
  hubCoins: number;     // In-game Token (HC)
  xp: number;
  isVIP: boolean;
  profileBanner: string;
  profileBannerVideo?: string;
  avatarUrl?: string;
  themeColor: string;
  role: UserRole;
  stats: UserStats;
  achievements: Achievement[];
  socials: SocialLinks;
  favoriteGames: string[];
  playstyles: string[];
  clanId?: string;
  clanKey?: string; // New: Key for clan access
  location?: { lat: number; lng: number; city: string };
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'purchase' | 'conversion' | 'admin_adj';
  provider?: 'opay' | 'paypal' | 'card' | 'admin';
  amount: number;
  currency: 'NGN' | 'HC';
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
}

export interface LobbyInfo {
  lobbyId: string;
  accessPin?: string;
  region: string;
  lobbyType: 'Public' | 'Private' | 'Password Protected';
  deepLink?: string;
}

export interface Tournament {
  id: string;
  title: string;
  game: string;
  prizePool: string;
  entryFee: string; // e.g. "500 HC"
  date: string;
  time: string;
  location: string;
  status: 'active' | 'upcoming' | 'completed';
  participants: number;
  maxParticipants: number;
  lobby?: LobbyInfo;
  rules?: string;
  rewardTier?: string;
}

export interface Clan {
  id: string;
  name: string;
  tag: string;
  leaderId: string;
  members: string[];
  tier: 'Global' | 'National' | 'Regional';
  isPaidCreation: boolean;
  expiryDate?: string;
  xp: number;
}

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  author: string;
  date: string;
  imageUrl: string;
}

export interface MarketplaceItem {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  source?: string;
  origin?: string;
}

export interface Coupon {
  id: string;
  code: string;
  rewardType: 'HC' | 'NGN' | 'Skin';
  rewardValue: number;
  isRedeemed: boolean;
}

export type AuthMode = 'login' | 'signup';

export enum NavSection {
  Dashboard = 'dashboard',
  Tournaments = 'tournaments',
  Events = 'events',
  Marketplace = 'marketplace',
  Community = 'community',
  Wallet = 'wallet',
  Podcast = 'podcast',
  Profile = 'profile',
  Admin = 'admin',
  Streaming = 'streaming',
  Leaderboard = 'leaderboard'
}
