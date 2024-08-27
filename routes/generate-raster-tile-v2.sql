WITH tilebounds (geom) AS (SELECT ST_TileEnvelope($1, $2, $3)),
query AS (
  $query
)
SELECT
  st_aspng(query.rast)
FROM
  query, tilebounds
where st_intersects(query.rast, tilebounds.geom)
LIMIT 1;
