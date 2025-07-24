import { supabase } from './supabase';
import {
  AssuranceVie,
  ContratCapitalisation,
  BienImmobilier,
  EntrepriseParticipation,
  CompteBancaire,
  User
} from '../types/types';

export const getEncoursData = async () => {
  const { data: users, error: usersError } = await supabase.from('users').select('*');
  if (usersError) throw new Error(usersError.message);

  const { data: assuranceVie, error: assuranceVieError } = await supabase.from('assurancevie').select('*');
  if (assuranceVieError) throw new Error(assuranceVieError.message);

  const { data: contratCapitalisation, error: contratCapitalisationError } = await supabase.from('contratcapitalisation').select('*');
  if (contratCapitalisationError) throw new Error(contratCapitalisationError.message);

  const { data: bienImmobilier, error: bienImmobilierError } = await supabase.from('bienimmobilier').select('*');
  if (bienImmobilierError) throw new Error(bienImmobilierError.message);

  const { data: entrepriseParticipation, error: entrepriseParticipationError } = await supabase.from('entrepriseparticipation').select('*');
  if (entrepriseParticipationError) throw new Error(entrepriseParticipationError.message);

  const { data: compteBancaire, error: compteBancaireError } = await supabase.from('comptebancaire').select('*');
  if (compteBancaireError) throw new Error(compteBancaireError.message);

  return {
    users,
    assuranceVie,
    contratCapitalisation,
    bienImmobilier,
    entrepriseParticipation,
    compteBancaire
  };
};
