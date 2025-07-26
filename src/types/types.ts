export type AssuranceVie = {
  id: string;
  user_id: string;
  type_assurance: 'Contrat monosupport' | 'Contrat multisupport';
  libelle: string;
  numero: string;
  compagnie: string;
  date_acquisition: string;
  souscripteur: 'Personne 1' | 'Personne 2' | 'Commun';
  contrat_gere: boolean;
  somme_versee: number;
  fond_euros: number;
  unite_de_compte: number;
  value: number;
  epargne_annuelle: number;
  proprietaire: 'Personne 1' | 'Personne 2' | 'Commun';
  conjoint_part: number;
  conjoint_type: 'PP' | 'US' | 'NP -1' | 'NP -2';
  enfants_part: number;
  enfants_type: 'PP' | 'US' | 'NP -1' | 'NP -2';
  autres_part: number;
  autres_type: 'PP' | 'US' | 'NP -1' | 'NP -2';
  denouement: 'Décès 1' | 'Décés 2';
  rachat_part: number;
  created_at: string;
};

export type ContratCapitalisation = {
  id: string;
  user_id: string;
  libelle: string;
  numero: string;
  regime: 'Art. 83 / PER' | 'Madelin' | 'PER' | 'PERCO' | 'PEREC' | 'PERO' | 'PERP' | 'PREFON PER' | 'Autre';
  compagnie: string;
  date_acquisition: string;
  souscripteur: 'Personne 1' | 'Personne 2' | 'Commun';
  contrat_gere: boolean;
  fond_euros: number;
  unite_de_compte: number;
  value: number;
  phase: 'Epargne' | 'Retraite';
  personnelle: number;
  professionnelle: number;
  rente_annuelle: number;
  created_at: string;
};

export type BienImmobilier = {
  id: string;
  user_id: string;
  type_immobilier: 'Bien de jouissance' | 'Bien de rapport';
  famille_immobilier: 'Résidence principale' | 'Résidence secondaire' | 'Autre';
  libelle: string;
  date_acquisition: string;
  date_echeance: string;
  value: number;
  proprietaire: 'Personne 1' | 'Personne 2' | 'Commun';
  type_propriete: 'PP' | 'US' | 'NP -1' | 'NP -2';
  loyer_brut: number;
  loyer_imposable: number;
  taxes: number;
  created_at: string;
};

export type EntrepriseParticipation = {
  id: string;
  user_id: string;
  type_entreprise: 'Outils de travail' | 'Entreprise Participation';
  famille_entreprise: 'autre' | 'Clientèle BNC' | 'Entreprise BA' | 'Fonds de com.BIC' | 'SCI à l\'IS' | 'Sociétés à l\'IR' | 'Société à l\'IS' | 'Société à l\'IS en PEA';
  libelle: string;
  date_acquisition: string;
  date_echeance: string;
  value: number;
  proprietaire: 'Personne 1' | 'Personne 2' | 'Commun';
  type_propriete: 'PP' | 'US' | 'NP -1' | 'NP -2';
  dividendes: number;
  optimisation: 'PFU 12,8%' | 'PFL, 22,5% pea' | 'PFL 19% pea' | 'Exonération';
  created_at: string;
};

export type CompteBancaire = {
  id: string;
  user_id: string;
  type_compte: 'Autre' | 'CEL' | 'Compte à terme' | 'Compte courant' | 'LDDS' | 'LEP' | 'Livret A' | 'PEL' | 'PEP' | 'Somme à investir';
  famille_liquidites: 'Action' | 'Autre' | 'Compte titre' | 'FCP' | 'FCPI' | 'FIP' | 'Obligations' | 'OPCI' | 'Parts sociales' | 'PEA' | 'PEA-PME' | 'PEE' | 'PEP' | 'SICAV' | 'SOFICA';
  etablissement: string;
  libelle: string;
  contrat_gere: boolean;
  date_acquisition: string;
  date_cloture: string;
  value: number;
  epargne_annuelle: number;
  proprietaire: 'Personne 1' | 'Personne 2' | 'Commun';
  type_propriete: 'PP' | 'US' | 'NP -1' | 'NP -2';
  taux: number;
  optimisation: 'PFU 12,8%' | 'PFL, 22,5% pea' | 'PFL 19% pea' | 'Exonération';
  created_at: string;
};

