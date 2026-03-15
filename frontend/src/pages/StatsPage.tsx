import { useNavigate } from 'react-router-dom';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import "../styles/analytics.css"; 
const StatsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="stats-page-container">
      <div className="stats-header">
        <button className="btn-back" onClick={() => navigate('/dashboard')}>
          ← Retour au Dashboard
        </button>
      </div>

      <div className="stats-card">
        <h1 className="stats-title">Analytiques des inscriptions</h1>
        
       
        <AnalyticsDashboard />
      </div>
    </div>
  );
};

export default StatsPage;