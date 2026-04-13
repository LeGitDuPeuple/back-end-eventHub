import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types/user';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  isInitialized: boolean; // Flag crucial pour savoir si l'app a fini de checker le cookie au démarrage
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  isInitialized: false, // On commence à false pour bloquer l'accès tant que l'auth n'est pas vérifiée
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
   // Enregistre l'utilisateur et valide l'accès après le formulaire de login.
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.isInitialized = true; 
    },

    // Restaure la session au rafraîchissement en utilisant le cookie.
    hydrateAuth: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload; 
      state.loading = false;
      state.isInitialized = true; 
    },

   // Déconnecte l'utilisateur et vide les données du store. (pas encore fait de déconexion)
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
    },

  
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  },
});

export const { setUser, logout, setLoading, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;