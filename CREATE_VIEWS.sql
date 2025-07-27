CREATE OR REPLACE VIEW public.client_stats AS
SELECT
    u.id AS user_id,
    u.created_at,
    u.last_login,
    pi.age,
    pi.objectifs_patrimoniaux,
    p.score
FROM
    public.users u
LEFT JOIN
    public.personalinfo pi ON u.id = pi.user_id
LEFT JOIN
    public.profileinvestisseur p ON u.id = p.user_id;
