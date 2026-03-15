import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Register } from './components/Register';
import { Login } from './components/Login'; 
import StatsPage from './pages/StatsPage'; 
import { useHydrateAuth } from './hook/useHydrateAuth'; 

const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  // hydratation est déclaré ici pour qu'elle se lance au démarrage
  useHydrateAuth(); 

  return (
    <BrowserRouter>
      <Routes>
        {/* Routes Publiques */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* route authentifier  */}
        <Route path="/dashboard" element={
          <Suspense fallback={<div>Chargement...</div>}>
            <Dashboard />
          </Suspense>
        } />
        
        <Route path="/analytics" element={<StatsPage />} />
        
        {/* Redirections par défaut  */}
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;