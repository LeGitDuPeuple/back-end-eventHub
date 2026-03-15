import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { userService } from '../service/userService';
import { hydrateAuth } from '../modules/login/login.slice';

export const useHydrateAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initAuth = async () => {
      try {
        // 1. On appelle ton nouveau getMe dans le service
        const response = await userService.getMe();
        
        // 2. On récupère les données (adapte selon la forme de ta réponse API)
        const userData = response.data?.user || response.user;
        
        // 3. On remplit le store Redux
        dispatch(hydrateAuth(userData));
      } catch (error) {
        // 4. Si ça échoue (pas de cookie ou token expiré), on met null
        // Ça passera isInitialized à true, mais isAuthenticated à false
        console.log("Session non trouvée ou expirée");
        dispatch(hydrateAuth(null));
      }
    };

    initAuth();
  }, [dispatch]);
};