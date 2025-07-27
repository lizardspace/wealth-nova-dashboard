CREATE OR REPLACE VIEW encours_view AS
SELECT
    'assurancevie' AS asset_type,
    libelle AS asset_name,
    value AS asset_value,
    user_id
FROM
    assurancevie
UNION ALL
SELECT
    'autrepatrimoine' AS asset_type,
    libelle AS asset_name,
    value AS asset_value,
    user_id
FROM
    autrepatrimoine
UNION ALL
SELECT
    'bienimmobilier' AS asset_type,
    libelle AS asset_name,
    value AS asset_value,
    user_id
FROM
    bienimmobilier
UNION ALL
SELECT
    'comptebancaire' AS asset_type,
    libelle AS asset_name,
    value AS asset_value,
    user_id
FROM
    comptebancaire
UNION ALL
SELECT
    'contratcapitalisation' AS asset_type,
    libelle AS asset_name,
    value AS asset_value,
    user_id
FROM
    contratcapitalisation
UNION ALL
SELECT
    'entrepriseparticipation' AS asset_type,
    libelle AS asset_name,
    value AS asset_value,
    user_id
FROM
    entrepriseparticipation;
