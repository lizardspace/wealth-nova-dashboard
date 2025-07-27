CREATE OR REPLACE VIEW performance_data_view AS
SELECT
  user_id,
  'Assurance Vie' AS asset_type,
  value,
  date_acquisition
FROM
  public.assurancevie
UNION ALL
SELECT
  user_id,
  'Autre Patrimoine' AS asset_type,
  value,
  date_acquisition
FROM
  public.autrepatrimoine
UNION ALL
SELECT
  user_id,
  'Bien Immobilier' AS asset_type,
  value,
  date_acquisition
FROM
  public.bienimmobilier
UNION ALL
SELECT
  user_id,
  'Compte Bancaire' AS asset_type,
  value,
  date_acquisition
FROM
  public.comptebancaire
UNION ALL
SELECT
  user_id,
  'Contrat de Capitalisation' AS asset_type,
  value,
  date_acquisition
FROM
  public.contratcapitalisation
UNION ALL
SELECT
  user_id,
  'Entreprise et Participation' AS asset_type,
  value,
  date_acquisition
FROM
  public.entrepriseparticipation;
