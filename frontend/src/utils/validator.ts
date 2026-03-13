export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};

// On garde l'email car c'est standard, mais c'est tout
export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};