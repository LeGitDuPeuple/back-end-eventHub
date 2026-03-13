import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../service/userService';
import '../styles/register.css';

export const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    role: 'USER' as const
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Le bouton est cliquable seulement si tous les champs sont remplis
  const isFormValid = formData.email && formData.password && formData.firstname && formData.lastname;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await userService.register(formData);
      alert("Compte créé !");
      navigate('/login');
    } catch (err) {
      setError("Erreur lors de l'inscription.");
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit}>
        <h2>Inscription</h2>
        <input 
          type="text" placeholder="Prénom" 
          onChange={(e) => setFormData({...formData, firstname: e.target.value})} 
        />
        <input 
          type="text" placeholder="Nom" 
          onChange={(e) => setFormData({...formData, lastname: e.target.value})} 
        />
        <input 
          type="email" placeholder="Email" 
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
        />
        <input 
          type="password" placeholder="Mot de passe" 
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
        />
        
        {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
        {!isFormValid && <p style={{ color: 'orange', fontSize: '12px' }}>Veuillez remplir tous les champs</p>}

        <button type="submit" disabled={!isFormValid} style={{ opacity: isFormValid ? 1 : 0.5 }}>
          S'inscrire
        </button>
        <p>Déjà un compte ? <a href="/login">Se connecter</a></p>
      </form>
    </div>
  );
};