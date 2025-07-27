CREATE OR REPLACE VIEW user_goals AS
SELECT
    u.id as user_id,
    u.last_name,
    u.first_name,
    pv.changements_previsibles as expected_changes,
    pv.financement_etudes as education_funding,
    pv.liquidite_patrimoine as patrimony_liquidity,
    pi.objectifs_patrimoniaux as patrimony_goals,
    pi.priorite_gestion as management_priority,
    pi.projets_5_ans as five_year_projects,
    r.epargne_retraite as retirement_savings,
    r.montant_epargne as retirement_amount,
    (pi.nb_enfants_charge > 0) as has_dependent_children,
    pi.nb_enfants_charge as dependent_children_count
FROM
    users u
LEFT JOIN personalinfo pi ON u.id = pi.user_id
LEFT JOIN projetsvie pv ON u.id = pv.user_id
LEFT JOIN retraite r ON u.id = r.user_id;
