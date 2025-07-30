-- ========================================
-- NETTOYAGE ET RECRÉATION DU SYSTÈME SUPER ADMIN
-- ========================================

-- 1. Suppression des politiques existantes pour éviter les conflits
DO $$ 
DECLARE
    pol record;
BEGIN
    -- Supprimer toutes les politiques existantes sur les tables principales
    FOR pol IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
        AND tablename IN (
            'users', 'assurancevie', 'autrepatrimoine', 'bienimmobilier', 
            'budget', 'comptebancaire', 'contratcapitalisation', 'credit',
            'entreprise', 'entrepriseparticipation', 'family', 'family_invitations',
            'fiscalite', 'ifi', 'impotrevenu', 'mission', 'patrimoinefinancier',
            'patrimoineimmo', 'prevoyance', 'profileinvestisseur', 'projetsvie',
            'retraite', 'retraitecomplementaire', 'statements', 'traindevie',
            'contacts', 'pioneers', 'health'
        )
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
                      pol.policyname, pol.schemaname, pol.tablename);
    END LOOP;
END $$;

-- 2. Ajout de la colonne role si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'role' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.users 
        ADD COLUMN role text 
        CHECK (role = ANY (ARRAY['user'::text, 'admin'::text, 'super_admin'::text])) 
        DEFAULT 'user';
    END IF;
END $$;

-- 3. Création des fonctions de vérification (avec remplacement)
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin_or_super()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Activation du RLS sur toutes les tables (si pas déjà activé)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personalinfo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assurancevie ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.autrepatrimoine ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bienimmobilier ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comptebancaire ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contratcapitalisation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entreprise ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entrepriseparticipation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fiscalite ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ifi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impotrevenu ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patrimoinefinancier ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patrimoineimmo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prevoyance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profileinvestisseur ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projetsvie ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retraite ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retraitecomplementaire ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traindevie ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pioneers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health ENABLE ROW LEVEL SECURITY;

-- ========================================
-- CRÉATION DES NOUVELLES POLITIQUES RLS
-- ========================================

-- USERS TABLE
CREATE POLICY "users_select_policy" ON public.users
  FOR SELECT
  USING (auth.uid() = id OR is_super_admin());

CREATE POLICY "users_update_policy" ON public.users
  FOR UPDATE
  USING (auth.uid() = id OR is_super_admin());

CREATE POLICY "users_insert_policy" ON public.users
  FOR INSERT
  WITH CHECK (is_super_admin());

CREATE POLICY "users_delete_policy" ON public.users
  FOR DELETE
  USING (is_super_admin());

-- PERSONALINFO TABLE
CREATE POLICY "personalinfo_select_policy" ON public.personalinfo
  FOR SELECT
  USING (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "personalinfo_insert_policy" ON public.personalinfo
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "personalinfo_update_policy" ON public.personalinfo
  FOR UPDATE
  USING (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "personalinfo_delete_policy" ON public.personalinfo
  FOR DELETE
  USING (auth.uid() = user_id OR is_super_admin());

-- ASSURANCE VIE
CREATE POLICY "assurancevie_select_policy" ON public.assurancevie
  FOR SELECT
  USING (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "assurancevie_insert_policy" ON public.assurancevie
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "assurancevie_update_policy" ON public.assurancevie
  FOR UPDATE
  USING (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "assurancevie_delete_policy" ON public.assurancevie
  FOR DELETE
  USING (auth.uid() = user_id OR is_super_admin());

-- AUTRE PATRIMOINE
CREATE POLICY "autrepatrimoine_select_policy" ON public.autrepatrimoine
  FOR SELECT
  USING (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "autrepatrimoine_insert_policy" ON public.autrepatrimoine
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "autrepatrimoine_update_policy" ON public.autrepatrimoine
  FOR UPDATE
  USING (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "autrepatrimoine_delete_policy" ON public.autrepatrimoine
  FOR DELETE
  USING (auth.uid() = user_id OR is_super_admin());

-- BIEN IMMOBILIER
CREATE POLICY "bienimmobilier_select_policy" ON public.bienimmobilier
  FOR SELECT
  USING (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "bienimmobilier_insert_policy" ON public.bienimmobilier
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "bienimmobilier_update_policy" ON public.bienimmobilier
  FOR UPDATE
  USING (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "bienimmobilier_delete_policy" ON public.bienimmobilier
  FOR DELETE
  USING (auth.uid() = user_id OR is_super_admin());

-- BUDGET
CREATE POLICY "budget_select_policy" ON public.budget
  FOR SELECT
  USING (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "budget_insert_policy" ON public.budget
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "budget_update_policy" ON public.budget
  FOR UPDATE
  USING (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "budget_delete_policy" ON public.budget
  FOR DELETE
  USING (auth.uid() = user_id OR is_super_admin());

-- COMPTE BANCAIRE
CREATE POLICY "comptebancaire_select_policy" ON public.comptebancaire
  FOR SELECT
  USING (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "comptebancaire_insert_policy" ON public.comptebancaire
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "comptebancaire_update_policy" ON public.comptebancaire
  FOR UPDATE
  USING (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "comptebancaire_delete_policy" ON public.comptebancaire
  FOR DELETE
  USING (auth.uid() = user_id OR is_super_admin());

-- CONTRAT CAPITALISATION
CREATE POLICY "contratcapitalisation_select_policy" ON public.contratcapitalisation
  FOR SELECT
  USING (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "contratcapitalisation_insert_policy" ON public.contratcapitalisation
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "contratcapitalisation_update_policy" ON public.contratcapitalisation
  FOR UPDATE
  USING (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "contratcapitalisation_delete_policy" ON public.contratcapitalisation
  FOR DELETE
  USING (auth.uid() = user_id OR is_super_admin());

-- CREDIT
CREATE POLICY "credit_select_policy" ON public.credit
  FOR SELECT
  USING (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "credit_insert_policy" ON public.credit
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "credit_update_policy" ON public.credit
  FOR UPDATE
  USING (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "credit_delete_policy" ON public.credit
  FOR DELETE
  USING (auth.uid() = user_id OR is_super_admin());

-- ENTREPRISE
CREATE POLICY "entreprise_select_policy" ON public.entreprise
  FOR SELECT
  USING (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "entreprise_insert_policy" ON public.entreprise
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "entreprise_update_policy" ON public.entreprise
  FOR UPDATE
  USING (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "entreprise_delete_policy" ON public.entreprise
  FOR DELETE
  USING (auth.uid() = user_id OR is_super_admin());

-- ENTREPRISE PARTICIPATION
CREATE POLICY "entrepriseparticipation_select_policy" ON public.entrepriseparticipation
  FOR SELECT
  USING (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "entrepriseparticipation_insert_policy" ON public.entrepriseparticipation
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "entrepriseparticipation_update_policy" ON public.entrepriseparticipation
  FOR UPDATE
  USING (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "entrepriseparticipation_delete_policy" ON public.entrepriseparticipation
  FOR DELETE
  USING (auth.uid() = user_id OR is_super_admin());

-- FAMILY
CREATE POLICY "family_select_policy" ON public.family
  FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = related_user_id OR is_super_admin());

CREATE POLICY "family_insert_policy" ON public.family
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "family_update_policy" ON public.family
  FOR UPDATE
  USING (auth.uid() = user_id OR auth.uid() = related_user_id OR is_super_admin());

CREATE POLICY "family_delete_policy" ON public.family
  FOR DELETE
  USING (auth.uid() = user_id OR auth.uid() = related_user_id OR is_super_admin());

-- FAMILY INVITATIONS
CREATE POLICY "family_invitations_select_policy" ON public.family_invitations
  FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id OR is_super_admin());

CREATE POLICY "family_invitations_insert_policy" ON public.family_invitations
  FOR INSERT
  WITH CHECK (auth.uid() = sender_id OR is_super_admin());

CREATE POLICY "family_invitations_update_policy" ON public.family_invitations
  FOR UPDATE
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id OR is_super_admin());

CREATE POLICY "family_invitations_delete_policy" ON public.family_invitations
  FOR DELETE
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id OR is_super_admin());

-- Politiques pour les autres tables avec user_id
CREATE POLICY "fiscalite_all_policy" ON public.fiscalite
  FOR ALL
  USING (auth.uid() = user_id OR is_super_admin())
  WITH CHECK (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "ifi_all_policy" ON public.ifi
  FOR ALL
  USING (auth.uid() = user_id OR is_super_admin())
  WITH CHECK (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "impotrevenu_all_policy" ON public.impotrevenu
  FOR ALL
  USING (auth.uid() = user_id OR is_super_admin())
  WITH CHECK (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "mission_all_policy" ON public.mission
  FOR ALL
  USING (auth.uid() = user_id OR is_super_admin())
  WITH CHECK (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "patrimoinefinancier_all_policy" ON public.patrimoinefinancier
  FOR ALL
  USING (auth.uid() = user_id OR is_super_admin())
  WITH CHECK (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "patrimoineimmo_all_policy" ON public.patrimoineimmo
  FOR ALL
  USING (auth.uid() = user_id OR is_super_admin())
  WITH CHECK (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "prevoyance_all_policy" ON public.prevoyance
  FOR ALL
  USING (auth.uid() = user_id OR is_super_admin())
  WITH CHECK (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "profileinvestisseur_all_policy" ON public.profileinvestisseur
  FOR ALL
  USING (auth.uid() = user_id OR is_super_admin())
  WITH CHECK (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "projetsvie_all_policy" ON public.projetsvie
  FOR ALL
  USING (auth.uid() = user_id OR is_super_admin())
  WITH CHECK (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "retraite_all_policy" ON public.retraite
  FOR ALL
  USING (auth.uid() = user_id OR is_super_admin())
  WITH CHECK (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "retraitecomplementaire_all_policy" ON public.retraitecomplementaire
  FOR ALL
  USING (auth.uid() = user_id OR is_super_admin())
  WITH CHECK (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "statements_all_policy" ON public.statements
  FOR ALL
  USING (auth.uid() = user_id OR is_super_admin())
  WITH CHECK (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "traindevie_all_policy" ON public.traindevie
  FOR ALL
  USING (auth.uid() = user_id OR is_super_admin())
  WITH CHECK (auth.uid() = user_id OR is_super_admin());

-- ========================================
-- POLITIQUES SPÉCIALES POUR TABLES SENSIBLES
-- ========================================

-- CONTACTS - Super admin only
CREATE POLICY "contacts_super_admin_only" ON public.contacts
  FOR ALL
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

-- PIONEERS - Super admin only  
CREATE POLICY "pioneers_super_admin_only" ON public.pioneers
  FOR ALL
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

-- HEALTH - Super admin only
CREATE POLICY "health_super_admin_only" ON public.health
  FOR ALL
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

-- ========================================
-- FONCTIONS UTILITAIRES
-- ========================================

-- Fonction pour créer un super admin
CREATE OR REPLACE FUNCTION create_super_admin(
  p_email text,
  p_first_name text,
  p_last_name text,
  p_auth_id uuid DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  super_admin_id uuid;
BEGIN
  IF p_auth_id IS NULL THEN
    super_admin_id := uuid_generate_v4();
  ELSE
    super_admin_id := p_auth_id;
  END IF;

  INSERT INTO public.users (
    id,
    email,
    first_name,
    last_name,
    role,
    created_at
  ) VALUES (
    super_admin_id,
    p_email,
    p_first_name,
    p_last_name,
    'super_admin',
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    role = 'super_admin',
    email = p_email,
    first_name = p_first_name,
    last_name = p_last_name;

  RETURN super_admin_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour promouvoir un utilisateur en admin
CREATE OR REPLACE FUNCTION promote_to_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  IF NOT is_super_admin() THEN
    RAISE EXCEPTION 'Seuls les super admins peuvent promouvoir des utilisateurs';
  END IF;

  UPDATE public.users 
  SET role = 'admin' 
  WHERE id = user_id;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour rétrograder un utilisateur
CREATE OR REPLACE FUNCTION demote_user(user_id uuid)
RETURNS boolean AS $$
BEGIN
  IF NOT is_super_admin() THEN
    RAISE EXCEPTION 'Seuls les super admins peuvent rétrograder des utilisateurs';
  END IF;

  IF (SELECT role FROM public.users WHERE id = user_id) = 'super_admin' THEN
    IF (SELECT COUNT(*) FROM public.users WHERE role = 'super_admin') <= 1 THEN
      RAISE EXCEPTION 'Impossible de rétrograder le dernier super admin';
    END IF;
  END IF;

  UPDATE public.users 
  SET role = 'user' 
  WHERE id = user_id;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour obtenir tous les utilisateurs
CREATE OR REPLACE FUNCTION get_all_users()
RETURNS TABLE (
  id uuid,
  email text,
  first_name text,
  last_name text,
  role text,
  created_at timestamp with time zone,
  last_login timestamp with time zone
) AS $$
BEGIN
  IF NOT is_super_admin() THEN
    RAISE EXCEPTION 'Accès refusé : seuls les super admins peuvent voir tous les utilisateurs';
  END IF;

  RETURN QUERY 
  SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.created_at, u.last_login
  FROM public.users u
  ORDER BY u.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- CRÉATION DE GUILLAUME COMME SUPER ADMIN
-- ========================================

-- Créer Guillaume en tant que super admin
SELECT create_super_admin(
  'guillaume.recipon4@gmail.com',
  'Guillaume',
  'Re',
  'a93bdc23-2bc3-47b0-aa68-f5eb2c2b9194'::uuid
);

-- ========================================
-- VÉRIFICATIONS
-- ========================================

-- Vérifier que Guillaume est bien créé comme super admin
DO $$
DECLARE
    guillaume_record record;
BEGIN
    SELECT INTO guillaume_record id, email, first_name, last_name, role, created_at 
    FROM public.users 
    WHERE id = 'a93bdc23-2bc3-47b0-aa68-f5eb2c2b9194'::uuid;
    
    IF guillaume_record.role = 'super_admin' THEN
        RAISE NOTICE 'SUCCESS: Guillaume a été créé comme super admin';
        RAISE NOTICE 'Email: %, Nom: % %, Rôle: %', 
               guillaume_record.email, 
               guillaume_record.first_name, 
               guillaume_record.last_name, 
               guillaume_record.role;
    ELSE
        RAISE NOTICE 'ERREUR: Guillaume n''a pas le rôle super_admin';
    END IF;
END $$;

-- Vérifier que les politiques RLS sont bien activées
SELECT 'RLS Status' as check_type, schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
  'users', 'assurancevie', 'bienimmobilier', 'comptebancaire',
  'budget', 'credit', 'contacts', 'pioneers'
)
ORDER BY tablename;
