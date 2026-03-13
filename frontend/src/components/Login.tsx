import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userService } from '../service/userService';
import { setUser } from '../modules/login/login.slice';
import { validateEmail } from '../utils/validator';
import "../styles/login.css";

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // État pour l'erreur
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // On reset l'erreur au début

    if (!validateEmail(email)) {
      setError("Email invalide");
      return;
    }

    try {
      const response = await userService.login({ email, password });
      const userData = response.data?.user || response.user;
      dispatch(setUser(userData));
      navigate('/dashboard'); 
    } catch (err) {
      setError("Identifiants incorrects");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Connexion</h2>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
        
        {/* Message d'erreur simple */}
        {error && <p style={{ color: 'red', fontSize: '13px', margin: '0' }}>{error}</p>}
        
        <button type="submit">Se connecter</button>
        <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
          Pas de compte ? <span className="auth-link" onClick={() => navigate('/register')}>S'inscrire</span>
        </p>
      </form>
    </div>
  );
};