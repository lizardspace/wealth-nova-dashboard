export type User = {
  id: string;
  last_name: string | null;
  first_name: string | null;
  power: number | null;
  email: string | null;
  created_at: string;
  civilite: "M." | "Mme" | "Mlle" | null;
  date_naissance: string | null;
  part_fiscale: number | null;
};

export type PersonalInfo = {
  id: string;
  user_id: string;
  phone: number | null;
  age: number | null;
  address: string | null;
  postal_code: number | null;
  city: string | null;
  situation_matrimoniale: string | null;
  contrat_mariage: string | null;
  nb_enfants_charge: number | null;
  profession: string | null;
  revenu_annuel: number | null;
  capacite_epargne: number | null;
  epargne_precaution: number | null;
  inquietudes_patrimoine: string[] | null;
  inquietudes_immobilier: boolean | null;
  objectifs_patrimoniaux: string[] | null;
  priorite_gestion: string | null;
  projets_5_ans: string[] | null;
  reflexion_transmission: string | null;
  actions_transmission: string | null;
  objectifs_transmission: string[] | null;
  valeurs: string[] | null;
};

export type IncompleteProfile = {
  id: string;
  name: string;
  email: string;
  completionRate: number;
  missingFields: string[];
  portfolio: number;
  priority: "high" | "medium" | "low";
  lastUpdate: string;
};
