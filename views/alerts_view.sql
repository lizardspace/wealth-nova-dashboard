CREATE OR REPLACE VIEW public.alerts AS
SELECT
    uuid_generate_v4() AS id,
    u.id AS user_id,
    'Inactivité' AS type,
    'critique' AS level,
    'Client inactif depuis plus de 30 jours' AS message,
    now() as created_at
FROM
    users u
LEFT JOIN
    (SELECT user_id, max(created_at) as last_activity FROM assurancevie GROUP BY user_id) a ON u.id = a.user_id
WHERE
    a.last_activity IS NULL OR a.last_activity < now() - interval '30 days'
UNION ALL
SELECT
    uuid_generate_v4() AS id,
    p.user_id,
    'Profil incomplet' AS type,
    'important' AS level,
    'Le profil du client est incomplet' AS message,
    now() as created_at
FROM
    personalinfo p
WHERE
    p.phone IS NULL OR p.address IS NULL OR p.city IS NULL
UNION ALL
SELECT
    uuid_generate_v4() AS id,
    s.user_id,
    'Simulation sans action' AS type,
    'normal' AS level,
    'Simulation réalisée sans action consécutive' AS message,
    now() as created_at
FROM
    statements s
LEFT JOIN
    assurancevie a ON s.user_id = a.user_id
WHERE
    a.id IS NULL;
