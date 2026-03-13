import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../store/store';
import { eventService } from '../service/eventService';
import "../styles/dashboard.css";

const Dashboard = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const take = 5; 

  const { user } = useSelector((state: RootState) => state.auth);

  // LA fonction unique pour charger les données
const loadData = async (newSkip: number) => {
    setLoading(true);
    try {
      const result = await eventService.getEvents(newSkip, take);
      
      // LOG POUR VÉRIFIER : Ouvre ta console (F12) pour voir ce qui arrive
      console.log("Résultat API :", result);

      // SÉCURITÉ : On s'assure de ne stocker que le tableau
      // Si result est l'objet {data: [...]}, on prend result.data
      // Si result est déjà le tableau [...], on prend result
      const arrayToSet = result.data || (Array.isArray(result) ? result : []);
      
      setEvents(arrayToSet);
      setSkip(newSkip);
    } catch (error) {
      console.error("Erreur chargement :", error);
      setEvents([]); // En cas d'erreur, on met un tableau vide pour éviter le crash
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(0); }, []);

  return (
    <div className="dashboard-container">
      <h1>Bienvenue {user?.firstname} !</h1>
      <hr />

      <div className="events-list-container">
        {loading ? <p>Chargement...</p> : (
          events.map((event) => (
            <div key={event.id} className="event-card">
              <h3>{event.title}</h3>
              <p>📍 {event.location}</p>
              <p>📅 {new Date(event.date).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>

      <div className="pagination">
        <button disabled={skip === 0} onClick={() => loadData(skip - take)}>
          Précédent
        </button>
        <button disabled={events.length < take} onClick={() => loadData(skip + take)}>
          Suivant
        </button>
      </div>
    </div>
  );
};

export default Dashboard;