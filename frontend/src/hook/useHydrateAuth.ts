import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { userService } from '../service/userService';
import { hydrateAuth } from '../modules/login/login.slice';

export const useHydrateAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await userService.getMe();
        
        const userData = response.data?.user || response.user;
        // sert à débuger
        console.log("Données reçues du serveur :", userData);

        if (userData) {
          dispatch(hydrateAuth(userData));
        } else {
          dispatch(hydrateAuth(null));
        }
      } catch (error) {
        console.warn("Hydratation : session non trouvée");
        dispatch(hydrateAuth(null));
      }
    };

    initAuth();
  }, [dispatch]);
};