import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
    // 15 minutes
  windowMs: 15 * 60 * 1000, 
  // Limite à 5 tentatives de connexion par 15 min
  max: 5, 
  message: {
    success: false,
    message: "Trop de tentatives de connexion, réessayez dans 15 minutes."
  },
  standardHeaders: true, 
  legacyHeaders: false,
});