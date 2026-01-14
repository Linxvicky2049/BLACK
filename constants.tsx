
import { Tournament, NewsItem, User, MarketplaceItem } from './types';

export const MOCK_USER: User = {
  id: 'user_01',
  username: 'NaijaWarrior_X',
  email: 'admin@gaminghub.africa',
  phoneNumber: '+234 800 000 0000',
  isEmailVerified: true,
  isPhoneVerified: false,
  bio: 'Top tier COD Mobile player from Lagos. Representing Lagos Lions. Admin and Hub Overseer.',
  rank: 'Apex Legend',
  country: 'Nigeria',
  walletBalance: 25000,
  hubCoins: 5000,
  xp: 12500,
  isVIP: true,
  profileBanner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NaijaWarrior_X',
  themeColor: '#06b6d4',
  role: 'admin',
  stats: {
    wins: 1420,
    tournamentsPlayed: 45,
    tournamentsWon: 12,
    kdRatio: '2.45',
    mvps: 88
  },
  achievements: [
    { id: 'a1', title: 'Lagos Legend', icon: '🏆', description: 'Won a Major in Lagos', dateEarned: '2024-05-12' },
    { id: 'a2', title: 'Sharpshooter', icon: '🎯', description: '500+ Headshots in a season', dateEarned: '2024-08-20' },
    { id: 'a3', title: 'Wealthy Warrior', icon: '💰', description: 'Accumulated 100k+ in tournament winnings', dateEarned: '2025-01-05' },
    { id: 'a4', title: 'Early Adopter', icon: '⚡', description: 'Joined the Hub in Year 1', dateEarned: '2023-11-11' }
  ],
  socials: {
    twitter: { handle: '@NaijaWarrior_X', verified: true },
    discord: { handle: 'NaijaWarrior#1234', verified: true },
    twitch: { handle: 'NaijaWarriorLive', verified: false }
  },
  favoriteGames: ['Call of Duty Mobile', 'Tekken 8', 'Apex Legends'],
  playstyles: ['Aggressive Entry', 'Tactical Sniper', 'IGL']
};

export const TOURNAMENTS: Tournament[] = [
  {
    id: 't1',
    title: 'Lagos Invitational: COD Mobile',
    game: 'Call of Duty Mobile',
    prizePool: '₦500,000',
    entryFee: '₦2,500',
    date: 'Oct 15, 2025',
    time: '18:00',
    location: 'Surulere Gaming Center',
    status: 'active',
    participants: 120,
    maxParticipants: 128,
  },
  {
    id: 't2',
    title: 'Abuja Clash: FIFA 26',
    game: 'FIFA 26',
    prizePool: '₦1,000,000',
    entryFee: 'Free (VIP)',
    date: 'Nov 02, 2025',
    time: '14:00',
    location: 'Abuja Virtual Lounge',
    status: 'upcoming',
    participants: 45,
    maxParticipants: 256,
  }
];

export const NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: 'The Rise of Mobile Esports in Africa',
    category: 'esports',
    summary: 'How local infrastructure is finally catching up to mobile gaming demand.',
    author: 'Adebayo T.',
    date: '2 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 'n3',
    title: 'Paystack Integration: Fast Top-ups Now Live',
    category: 'update',
    summary: 'Use your local card or bank transfer to fund your Gaming Hub wallet instantly.',
    author: 'Tech Team',
    date: '3 days ago',
    imageUrl: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=2070&auto=format&fit=crop',
  }
];

export const MARKET_ITEMS: MarketplaceItem[] = [
  {
    id: 'm1',
    name: 'Pro Streamer Mic Z-1',
    category: 'gear',
    price: 45000,
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1974&auto=format&fit=crop',
    rarity: 'epic',
  },
  {
    id: 'm2',
    name: 'Lagos Lions Pro Jersey',
    category: 'gear',
    price: 15000,
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1938&auto=format&fit=crop',
    rarity: 'rare',
  },
  {
    id: 'm3',
    name: 'PSN ₦10,000 Voucher',
    category: 'digital',
    price: 10000,
    imageUrl: 'https://images.unsplash.com/photo-1605898835518-20384ec26eef?q=80&w=1935&auto=format&fit=crop',
    rarity: 'common',
  },
  {
    id: 'm4',
    name: 'Shadow Operator Skin - COD',
    category: 'skins',
    price: 2500,
    imageUrl: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?q=80&w=2070&auto=format&fit=crop',
    rarity: 'legendary',
  },
  {
    id: 'm5',
    name: 'Razer Kraken V3 HyperSense',
    category: 'gear',
    price: 85000,
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2065&auto=format&fit=crop',
    rarity: 'epic',
  },
  {
    id: 'm6',
    name: 'Steam $50 Wallet Code',
    category: 'digital',
    price: 75000,
    imageUrl: 'https://images.unsplash.com/photo-1585504198199-20277593b94f?q=80&w=1935&auto=format&fit=crop',
    rarity: 'rare',
  },
  {
    id: 'm7',
    name: 'Apex Coins: 2150 Pack',
    category: 'digital',
    price: 18500,
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop',
    rarity: 'common',
  },
  {
    id: 'm8',
    name: 'Logitech G502 HERO Mouse',
    category: 'gear',
    price: 35000,
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=1965&auto=format&fit=crop',
    rarity: 'rare',
  }
];
