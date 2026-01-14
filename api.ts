
import { db } from './db';
import { User, Tournament, MarketplaceItem, Coupon, Clan, Transaction } from './types';
import { socket } from './socket';

const simulateDelay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // --- AUTHENTICATION ---
  auth: {
    login: async (email: string) => {
      await simulateDelay();
      const user = db.get().users.find(u => u.email === email);
      if (!user) throw new Error("401: Identity not found in Hub-Core.");
      const token = btoa(JSON.stringify({ id: user.id, exp: Date.now() + 86400000 }));
      localStorage.setItem('gh_token', token);
      return { user, token };
    },
    register: async (username: string, email: string) => {
      await simulateDelay();
      const existing = db.get().users.find(u => u.email === email);
      if (existing) throw new Error("409: Uplink already active.");
      const newUser: User = {
        id: `u_${Date.now()}`,
        username,
        email,
        isEmailVerified: false,
        isPhoneVerified: false,
        bio: 'New operator in the African Hub.',
        rank: 'Rookie',
        country: 'Nigeria',
        walletBalance: 0,
        hubCoins: 0,
        xp: 0,
        isVIP: false,
        profileBanner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e',
        themeColor: '#06b6d4',
        role: 'user',
        stats: { wins: 0, tournamentsPlayed: 0, tournamentsWon: 0, kdRatio: '0.00', mvps: 0 },
        achievements: [],
        socials: {},
        favoriteGames: [],
        playstyles: []
      };
      db.addUser(newUser);
      return newUser;
    },
    verifyUplink: async (type: 'email' | 'phone', target: string) => {
      await simulateDelay();
      const code = '123456';
      localStorage.setItem(`otp_${type}_${target}`, code);
      return { success: true };
    },
    confirmOTP: async (userId: string, type: 'email' | 'phone', code: string, target: string) => {
      await simulateDelay();
      const savedCode = localStorage.getItem(`otp_${type}_${target}`);
      if (code !== savedCode && code !== '123456') throw new Error("403: Security Code Mismatch.");
      const user = db.getUser(userId);
      if (!user) throw new Error("404: Node not found.");
      const updatedUser = { ...user, [type === 'email' ? 'isEmailVerified' : 'isPhoneVerified']: true };
      db.updateUser(updatedUser);
      return updatedUser;
    }
  },

  // --- TOKEN ECONOMY (VAULT) ---
  wallet: {
    topUpVault: async (userId: string, amount: number, provider: 'opay' | 'paypal' | 'card') => {
      await simulateDelay(2000); // Simulate external payment processing
      const user = db.getUser(userId);
      if (!user) throw new Error("404");
      
      const tx: Transaction = {
        id: `tx_${Date.now()}`,
        userId,
        type: 'deposit',
        provider,
        amount,
        currency: 'NGN',
        status: 'completed',
        timestamp: new Date().toISOString()
      };
      
      const updatedUser = { ...user, walletBalance: user.walletBalance + amount };
      db.updateUser(updatedUser);
      
      const data = db.get();
      if(!data.transactions) data.transactions = [];
      data.transactions.push(tx);
      db.save(data);

      socket.emit('WALLET_SYNC', { userId, newBalance: updatedUser.walletBalance, hcBalance: updatedUser.hubCoins });
      return updatedUser;
    },

    convertNGNtoHC: async (userId: string, ngnAmount: number, hcAmount: number) => {
      await simulateDelay(800);
      const user = db.getUser(userId);
      if (!user || user.walletBalance < ngnAmount) throw new Error("402: Insufficient Vault Balance.");
      const updatedUser = { ...user, walletBalance: user.walletBalance - ngnAmount, hubCoins: user.hubCoins + hcAmount };
      db.updateUser(updatedUser);
      socket.emit('WALLET_SYNC', { userId, newBalance: updatedUser.walletBalance, hcBalance: updatedUser.hubCoins });
      return updatedUser;
    }
  },

  // --- CLANS ---
  clans: {
    purchaseKey: async (userId: string) => {
      await simulateDelay(1500);
      const user = db.getUser(userId);
      if (!user) throw new Error("404");
      if (user.walletBalance < 100) throw new Error("402: Insufficient Vault Balance (100 NGN Required).");

      const key = `KEY-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const updatedUser = { 
        ...user, 
        walletBalance: user.walletBalance - 100, 
        clanKey: key 
      };
      db.updateUser(updatedUser);
      
      socket.emit('WALLET_SYNC', { userId, newBalance: updatedUser.walletBalance, hcBalance: updatedUser.hubCoins });
      return updatedUser;
    },
    create: async (userId: string, clanName: string, tag: string) => {
      await simulateDelay();
      const user = db.getUser(userId);
      if (!user) throw new Error("404");
      if (!user.clanKey && user.role !== 'admin') throw new Error("403: Clan Key Required. Pay 100 NGN at HQ.");

      const newClan: Clan = {
        id: `clan_${Date.now()}`,
        name: clanName,
        tag: tag.toUpperCase(),
        leaderId: userId,
        members: [userId],
        tier: 'Regional',
        isPaidCreation: true,
        xp: 0
      };

      const data = db.get();
      data.clans.push(newClan);
      db.save(data);

      const updatedUser = { ...user, role: 'clan_leader' as any, clanId: newClan.id };
      db.updateUser(updatedUser);
      return { clan: newClan, user: updatedUser };
    }
  },

  // --- ADMIN OVERRIDES ---
  admin: {
    modifyBalance: async (userId: string, amount: number, type: 'add' | 'sub', currency: 'NGN' | 'HC') => {
      await simulateDelay(500);
      const user = db.getUser(userId);
      if (!user) throw new Error("404: Node not found.");
      
      let newBalance = currency === 'NGN' ? user.walletBalance : user.hubCoins;
      if (type === 'add') newBalance += amount;
      else newBalance = Math.max(0, newBalance - amount);

      const updatedUser = { 
        ...user, 
        [currency === 'NGN' ? 'walletBalance' : 'hubCoins']: newBalance 
      };
      db.updateUser(updatedUser);
      socket.emit('USER_UPDATE', updatedUser);
      socket.emit('WALLET_SYNC', { userId, newBalance: updatedUser.walletBalance, hcBalance: updatedUser.hubCoins });
      return updatedUser;
    }
  },

  verification: {
    requestCode: async (type: 'email' | 'phone', target: string) => {
      return api.auth.verifyUplink(type, target);
    },
    confirmCode: async (userId: string, type: 'email' | 'phone', code: string) => {
      const user = db.getUser(userId);
      if (!user) throw new Error("404");
      const target = type === 'email' ? user.email : user.phoneNumber || '';
      return api.auth.confirmOTP(userId, type, code, target);
    }
  }
};
