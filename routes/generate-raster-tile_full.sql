WITH tilebounds (geom) AS (SELECT ST_TileEnvelope($1, $2, $3)),
query AS (
  $query
)
SELECT
  st_aspng(ST_Clip(
    	st_transform(query.rast, 3857),
    	tilebounds.geom
  ))
FROM
  query, tilebounds
where st_transform(query.rast, 3857) && tilebounds.geom
