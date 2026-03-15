import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { type RootState } from '../store/store';
import { eventService } from '../service/eventService';
import "../styles/dashboard.css";

const Dashboard = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const take = 5;

  const navigate = useNavigate();
  // On récupère juste ce qu'il faut
  const { user, isInitialized, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // vérifie si il y a un cookies + authentification
  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      navigate('/login');
    }
  }, [isInitialized, isAuthenticated, navigate]);

  const loadData = async (newSkip: number) => {
    setLoading(true);
    try {
      const result = await eventService.getEvents(newSkip, take);
      const arrayToSet = result.data?.events || [];
      setEvents(arrayToSet);
      setSkip(newSkip);
    } catch (error) {
      console.error("Erreur chargement :", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (isAuthenticated) loadData(0); 
  }, [isAuthenticated]);

  // Si on vérifie encore le cookie, on ne rend rien
  if (!isInitialized) return null;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Bienvenue {user?.firstname} !</h1> 
        <button className="btn-analytics" onClick={() => navigate('/analytics')}>
           Voir les Analytics
        </button>
      </div>

      <hr className="dashboard-separator" />
      <h2>Événements à venir</h2>

      <div className="events-list-container">
        {loading ? (
          <p>Chargement...</p>
        ) : events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="event-card">
              <h3>{event.title}</h3>
              <p>{event.location}</p>
              <p>{new Date(event.startDate).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
        
          <p>Aucun événement trouvé.</p>
        )}
      </div>

      <div className="pagination">
        <button 
          disabled={skip === 0 || loading} 
          onClick={(e) => { e.preventDefault(); loadData(skip - take); }}
        >
          Précédent
        </button>
        <button 
          disabled={events.length < take || loading} 
          onClick={(e) => { e.preventDefault(); loadData(skip + take); }}
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default Dashboard;