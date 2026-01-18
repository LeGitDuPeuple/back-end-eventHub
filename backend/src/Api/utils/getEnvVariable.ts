import "dotenv/config";

export const getEnvVariable = (variableName: string): string => {
  const value = process.env[variableName];

  if (!value) {
    throw new Error(`Missing environment variable: ${variableName}`);
  }

  return value;
};
