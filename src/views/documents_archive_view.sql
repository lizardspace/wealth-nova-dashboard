CREATE VIEW documents_archive AS
SELECT
    m.id,
    m.document->>'document_name' as document_name,
    u.first_name || ' ' || u.last_name as client_name,
    m.created_at as sending_date,
    m.document->>'document_type' as document_type,
    (m.created_at + interval '15 days') as expiration_date,
    'Archivé' as status
FROM
    mission m
JOIN
    users u ON m.user_id = u.id;
