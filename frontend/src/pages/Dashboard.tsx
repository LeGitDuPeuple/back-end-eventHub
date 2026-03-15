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
  const { user } = useSelector((state: RootState) => state.auth);

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

  useEffect(() => { loadData(0); }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Bienvenue !</h1> 
        {/* // {user?.firstname} */}

        
        <button 
          className="btn-analytics"
          onClick={() => navigate('/analytics')}
        >
           Voir les Analytics
        </button>
      </div>

      <hr className="dashboard-separator" />
      
      <h2>Événements à venir</h2>

      <div className="events-list-container">
        {loading ? <p>Chargement...</p> : (
          events.map((event) => (
            <div key={event.id} className="event-card">
              <h3>{event.title}</h3>
              <p>{event.location}</p>
              <p>{new Date(event.date).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>

      <div className="pagination">
        <button 
          type="button" 
          disabled={skip === 0 || loading} 
          onClick={(e) => {
            e.preventDefault(); 
            loadData(skip - take);
          }}
        >
          Précédent
        </button>
        
        <button 
          type="button"
          disabled={events.length < take || loading} 
          onClick={(e) => {
            e.preventDefault();
            loadData(skip + take);
          }}
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default Dashboard;