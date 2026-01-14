
import { User, Tournament, NewsItem, Coupon, Clan, Transaction } from './types';
import { MOCK_USER, TOURNAMENTS, NEWS } from './constants';

const DB_KEY = 'gh_africa_pro_db_v4';

interface DatabaseSchema {
  users: User[];
  tournaments: Tournament[];
  news: NewsItem[];
  coupons: Coupon[];
  clans: Clan[];
  registrations: Record<string, string[]>;
  transactions: Transaction[];
}

const initializeDB = (): DatabaseSchema => {
  const saved = localStorage.getItem(DB_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Database corruption detected. Initializing reset.");
    }
  }

  const initialDB: DatabaseSchema = {
    users: [MOCK_USER],
    tournaments: TOURNAMENTS,
    news: NEWS,
    coupons: [],
    clans: [
      { 
        id: 'clan_1', 
        name: 'Lagos Lions', 
        leaderId: 'user_01', 
        members: ['user_01'], 
        tag: 'LGL', 
        tier: 'National', 
        isPaidCreation: true, 
        xp: 12000 
      }
    ],
    registrations: {},
    transactions: []
  };
  localStorage.setItem(DB_KEY, JSON.stringify(initialDB));
  return initialDB;
};

export const db = {
  get: (): DatabaseSchema => initializeDB(),
  
  save: (data: DatabaseSchema) => {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
  },

  getUser: (id: string) => {
    const data = db.get();
    return data.users.find(u => u.id === id);
  },

  updateUser: (user: User) => {
    const data = db.get();
    data.users = data.users.map(u => u.id === user.id ? user : u);
    db.save(data);
    return user;
  },

  addUser: (user: User) => {
    const data = db.get();
    data.users.push(user);
    db.save(data);
    return user;
  },

  getTournaments: () => db.get().tournaments,
  
  addTournament: (t: Tournament) => {
    const data = db.get();
    data.tournaments.unshift(t);
    db.save(data);
  },

  getClans: () => db.get().clans || [],

  registerForTournament: (tId: string, uId: string) => {
    const data = db.get();
    if (!data.registrations[tId]) data.registrations[tId] = [];
    
    if (!data.registrations[tId].includes(uId)) {
      data.registrations[tId].push(uId);
      data.tournaments = data.tournaments.map(t => {
        if (t.id === tId) return { ...t, participants: t.participants + 1 };
        return t;
      });
      db.save(data);
      return true;
    }
    return false;
  },

  getRegistrations: (uId: string) => {
    const data = db.get();
    return Object.keys(data.registrations).filter(tId => 
      data.registrations[tId].includes(uId)
    );
  }
};
