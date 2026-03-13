import axios from 'axios';

const api = axios.create({
  // L'URL de ton Backend (Node.js/Express)
  baseURL: 'http://localhost:3000/api', 
  
  // INDISPENSABLE : permet au navigateur d'envoyer le cookie HTTP-only 
  // à chaque requête après la connexion
  withCredentials: true, 
  
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;