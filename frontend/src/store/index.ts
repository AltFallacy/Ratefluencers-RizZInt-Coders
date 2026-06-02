import { create } from 'zustand';

// Sidebar state
interface SidebarStore {
  isCollapsed: boolean;
  toggle: () => void;
  setCollapsed: (v: boolean) => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  isCollapsed: false,
  toggle: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  setCollapsed: (v) => set({ isCollapsed: v }),
}));

// Search state
interface SearchFilters {
  scoreRange: [number, number];      // [0, 100]
  followersRange: [number, number];  // [0, 10000000]
  engagementRange: [number, number]; // [0, 25]
  platforms: string[];
  categories: string[];
  location: string;
  campaignTypes: string[];
}

interface SearchStore {
  query: string;
  setQuery: (q: string) => void;
  filters: SearchFilters;
  setFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;
  clearFilters: () => void;
  isOpen: boolean;                     // command palette open
  setOpen: (v: boolean) => void;
  history: string[];
  addToHistory: (q: string) => void;
}

const initialFilters: SearchFilters = {
  scoreRange: [0, 100],
  followersRange: [1000, 10000000],
  engagementRange: [0, 25],
  platforms: [],
  categories: [],
  location: '',
  campaignTypes: [],
};

const getSavedHistory = (): string[] => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('rf_search_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }
  return [];
};

export const useSearchStore = create<SearchStore>((set) => ({
  query: '',
  setQuery: (q) => set({ query: q }),
  filters: initialFilters,
  setFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    })),
  clearFilters: () => set({ filters: initialFilters }),
  isOpen: false,
  setOpen: (v) => set({ isOpen: v }),
  history: getSavedHistory(),
  addToHistory: (q) =>
    set((state) => {
      if (!q.trim()) return state;
      const filtered = state.history.filter((item) => item !== q);
      const newHistory = [q, ...filtered].slice(0, 8);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('rf_search_history', JSON.stringify(newHistory));
        } catch (e) {
          console.error(e);
        }
      }
      return { history: newHistory };
    }),
}));

// Active Influencer state
interface InfluencerStore {
  activeInfluencerId: string;
  setActiveInfluencerId: (id: string) => void;
}

export const useInfluencerStore = create<InfluencerStore>((set) => ({
  activeInfluencerId: 'inf-001',
  setActiveInfluencerId: (id) => set({ activeInfluencerId: id }),
}));

