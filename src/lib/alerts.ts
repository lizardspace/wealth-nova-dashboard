// src/lib/alerts.ts
import { supabase } from './supabase';

export const generateAlerts = async () => {
  // Clear existing alerts
  const { error: deleteError } = await supabase.from('alerts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (deleteError) {
    console.error('Error clearing alerts:', deleteError);
    return;
  }

  // Get all users
  const { data: users, error: usersError } = await supabase.from('users').select('id, created_at');
  if (usersError) {
    console.error('Error fetching users:', usersError);
    return;
  }

  if (users) {
    for (const user of users) {
      // Check for inactivity (user created more than 30 days ago and no activity)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const userCreationDate = new Date(user.created_at);

      if (userCreationDate < thirtyDaysAgo) {
        const { error } = await supabase.from('alerts').insert({
          user_id: user.id,
          type: 'Inactivité',
          message: `L'utilisateur ${user.id} est inactif depuis plus de 30 jours.`,
          level: 'critique',
        });
        if (error) {
          console.error('Error inserting inactivity alert:', error);
        }
      }

      // Check for incomplete profile
      const { data: personalInfo, error: personalInfoError } = await supabase
        .from('personalinfo')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (personalInfoError || !personalInfo) {
        const { error } = await supabase.from('alerts').insert({
          user_id: user.id,
          type: 'Profil incomplet',
          message: `Le profil de l'utilisateur ${user.id} est incomplet.`,
          level: 'important',
        });
        if (error) {
          console.error('Error inserting incomplete profile alert:', error);
        }
      }
    }
  }
};
