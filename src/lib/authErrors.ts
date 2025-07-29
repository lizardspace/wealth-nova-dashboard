import { AuthError } from '@supabase/supabase-js';

export const getAuthErrorMessage = (error: AuthError | null): string => {
  if (!error) {
    return "Une erreur inattendue est survenue.";
  }

  if (error.message.includes("Invalid login credentials")) {
    return "Email ou mot de passe incorrect.";
  }
  if (error.message.includes("User already registered")) {
    return "Un utilisateur avec cet email existe déjà.";
  }
  if (error.message.includes("Password should be at least 6 characters")) {
    return "Le mot de passe doit contenir au moins 6 caractères.";
  }
  if (error.message.includes("Unable to validate email address: invalid format")) {
    return "Le format de l'email est invalide.";
  }
  if (error.message.includes("Password must contain at least one uppercase letter")) {
    return "Le mot de passe doit contenir au moins une lettre majuscule.";
  }
  if (error.message.includes("Password must contain at least one lowercase letter")) {
    return "Le mot de passe doit contenir au moins une lettre minuscule.";
  }
  if (error.message.includes("Password must contain at least one digit")) {
    return "Le mot de passe doit contenir au moins un chiffre.";
  }

  // Fallback for other errors
  return "Une erreur est survenue lors de l'authentification. Veuillez réessayer.";
};
