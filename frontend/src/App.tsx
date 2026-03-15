import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // AJOUTÉ
import { type RootState } from './store/store'; // AJOUTÉ
import { Register } from './components/Register';
import { Login } from './components/Login'; 
import StatsPage from './pages/StatsPage'; 
import { useHydrateAuth } from './hook/useHydrateAuth'; 

const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  // 1. On lance l'hydratation (vérification du cookie)
  useHydrateAuth(); 

  // 2. On récupère l'état d'initialisation depuis Redux
  const { isInitialized } = useSelector((state: RootState) => state.auth);

  // 3. TANT QUE LA VÉRIFICATION N'EST PAS FINIE :
  // On bloque l'affichage pour éviter les bugs de redirection ou les pages vides
  if (!isInitialized) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Arial' }}>
        <p>Vérification de la session...</p>
      </div>
    );
  }

  // 4. UNE FOIS INITIALISÉ : On affiche les routes
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Le dashboard est en Lazy Loading pour l'optimisation */}
        <Route path="/dashboard" element={
          <Suspense fallback={<div className="loading-placeholder">Chargement des événements...</div>}>
            <Dashboard />
          </Suspense>
        } />
        
        <Route path="/analytics" element={<StatsPage />} />
        
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;