CREATE OR REPLACE VIEW public.encours_view AS
SELECT
  'assurancevie' AS asset_type,
  libelle AS asset_name,
  value AS asset_value,
  user_id
FROM
  public.assurancevie
UNION ALL
SELECT
  'autrepatrimoine' AS asset_type,
  libelle AS asset_name,
  value AS asset_value,
  user_id
FROM
  public.autrepatrimoine
UNION ALL
SELECT
  'bienimmobilier' AS asset_type,
  libelle AS asset_name,
  value AS asset_value,
  user_id
FROM
  public.bienimmobilier
UNION ALL
SELECT
  'comptebancaire' AS asset_type,
  libelle AS asset_name,
  value AS asset_value,
  user_id
FROM
  public.comptebancaire
UNION ALL
SELECT
  'contratcapitalisation' AS asset_type,
  libelle AS asset_name,
  value AS asset_value,
  user_id
FROM
  public.contratcapitalisation
UNION ALL
SELECT
  'entrepriseparticipation' AS asset_type,
  libelle AS asset_name,
  value AS asset_value,
  user_id
FROM
  public.entrepriseparticipation;
