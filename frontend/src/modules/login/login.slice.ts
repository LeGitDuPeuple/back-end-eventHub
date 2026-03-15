import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types/user';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  isInitialized: boolean; // <-- AJOUTÉ : Pour savoir si on a fini de vérifier le cookie
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  isInitialized: false, // <-- AJOUTÉ : Initialisé à false par défaut
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.isInitialized = true; // Si on se connecte manuellement, c'est aussi initialisé
    },
    // Modifié pour accepter "null" si l'hydratation échoue (pas de cookie)
    hydrateAuth: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload; // true si user existe, false sinon
      state.loading = false;
      state.isInitialized = true; // <--- L'hydratation est terminée !
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  },
});

export const { setUser, logout, setLoading, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;