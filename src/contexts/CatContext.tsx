import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { SupabaseRepo } from '../services/SupabaseRepo'
import { Cat } from '../types';

interface CatState {
  cats: Cat[];
  loading: boolean;
  error: string | null;
}

type CatAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CATS'; payload: Cat[] }
  | { type: 'ADD_CAT'; payload: Cat }
  | { type: 'UPDATE_CAT'; payload: Cat }
  | { type: 'DELETE_CAT'; payload: string };

const initialState: CatState = {
  cats: [],
  loading: false,
  error: null,
};

const catReducer = (state: CatState, action: CatAction): CatState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CATS':
      return { ...state, cats: action.payload };
    case 'ADD_CAT':
      return { ...state, cats: [...state.cats, action.payload] };
    case 'UPDATE_CAT':
      return {
        ...state,
        cats: state.cats.map(cat =>
          cat.id === action.payload.id ? action.payload : cat
        ),
      };
    case 'DELETE_CAT':
      return {
        ...state,
        cats: state.cats.filter(cat => cat.id !== action.payload),
      };
    default:
      return state;
  }
};

interface CatContextType {
  state: CatState;
  addCat: (cat: Omit<Cat, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCat: (cat: Cat) => void;
  deleteCat: (id: string) => void;
  getCatById: (id: string) => Cat | undefined;
}

const CatContext = createContext<CatContextType | undefined>(undefined);

export const useCatContext = () => {
  const context = useContext(CatContext);
  if (!context) {
    throw new Error('useCatContext must be used within a CatProvider');
  }
  return context;
};

interface CatProviderProps {
  children: ReactNode;
}

export const CatProvider: React.FC<CatProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(catReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    (async () => {
      try {
        if (SupabaseRepo.isEnabled()) {
          const cats = await SupabaseRepo.listCats()
          if (cats.length) dispatch({ type: 'SET_CATS', payload: cats })
        } else {
          const saved = localStorage.getItem('cats');
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              dispatch({ type: 'SET_CATS', payload: parsed });
            } catch {}
          }
        }
      } catch (error) {
        console.warn('Failed to load cats:', error)
        // Fallback to localStorage
        const saved = localStorage.getItem('cats');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            dispatch({ type: 'SET_CATS', payload: parsed });
          } catch {}
        }
      }
    })()
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem('cats', JSON.stringify(state.cats));
  }, [state.cats]);

  const addCat = (catData: Omit<Cat, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCat: Cat = {
      ...catData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_CAT', payload: newCat });
    // Fire and forget to Supabase
    SupabaseRepo.addCat(catData).catch(() => {})
  };

  const updateCat = (cat: Cat) => {
    const updatedCat = { ...cat, updatedAt: new Date() };
    dispatch({ type: 'UPDATE_CAT', payload: updatedCat });
    SupabaseRepo.updateCat(updatedCat).catch(() => {})
  };

  const deleteCat = (id: string) => {
    dispatch({ type: 'DELETE_CAT', payload: id });
    SupabaseRepo.deleteCat(id).catch(() => {})
  };

  const getCatById = (id: string) => {
    return state.cats.find(cat => cat.id === id);
  };

  const value: CatContextType = {
    state,
    addCat,
    updateCat,
    deleteCat,
    getCatById,
  };

  return <CatContext.Provider value={value}>{children}</CatContext.Provider>;
}; 