WITH tilebounds (geom) AS (SELECT ST_TileEnvelope($1, $2, $3)),
query AS (
  $query
)
SELECT
  st_aspng(st_clip(st_transform(query.rast, 3857), tilebounds.geom))
FROM
  query, tilebounds
where st_transform(query.rast, 3857) && tilebounds.geom
-- order by random()
