import { User, PersonalInfo } from "@/lib/database.types";

export const calculateCompletion = (user: User, personalInfo: PersonalInfo | null) => {
  const totalFields = 15; // Adjust this number based on the fields you're checking
  let completedFields = 0;
  const missingFields: string[] = [];

  if (user.last_name) completedFields++; else missingFields.push("Nom");
  if (user.first_name) completedFields++; else missingFields.push("Prénom");
  if (user.email) completedFields++; else missingFields.push("Email");
  if (user.civilite) completedFields++; else missingFields.push("Civilité");
  if (user.date_naissance) completedFields++; else missingFields.push("Date de naissance");

  if (personalInfo) {
    if (personalInfo.phone) completedFields++; else missingFields.push("Téléphone");
    if (personalInfo.address) completedFields++; else missingFields.push("Adresse");
    if (personalInfo.city) completedFields++; else missingFields.push("Ville");
    if (personalInfo.postal_code) completedFields++; else missingFields.push("Code Postal");
    if (personalInfo.situation_matrimoniale) completedFields++; else missingFields.push("Situation Matrimoniale");
    if (personalInfo.profession) completedFields++; else missingFields.push("Profession");
    if (personalInfo.revenu_annuel) completedFields++; else missingFields.push("Revenu Annuel");
    if (personalInfo.capacite_epargne) completedFields++; else missingFields.push("Capacité d'épargne");
    if (personalInfo.epargne_precaution) completedFields++; else missingFields.push("Épargne de précaution");
    if (personalInfo.objectifs_patrimoniaux) completedFields++; else missingFields.push("Objectifs patrimoniaux");
  } else {
    missingFields.push("Informations Personnelles");
  }

  const completionRate = Math.round((completedFields / totalFields) * 100);
  return { completionRate, missingFields };
};

export const determinePriority = (completionRate: number, portfolio: number): "high" | "medium" | "low" => {
  if (completionRate < 60 || portfolio > 200000) {
    return "high";
  } else if (completionRate < 80 || portfolio > 100000) {
    return "medium";
  } else {
    return "low";
  }
};
