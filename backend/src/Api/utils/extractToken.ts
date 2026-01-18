export const extractToken = (authorization: string): string | null => {
  if (!authorization) return null;

  const [prefix, token] = authorization.split(" ");

  if (prefix !== "Bearer" || !token) return null;

  return token;
};
