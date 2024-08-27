WITH tilebounds (geom) AS (SELECT ST_TileEnvelope($1, $2, $3)),
query AS (
  $query
)
SELECT
  st_aspng(
    st_resize(
      st_union(
        st_clip(
          query.rast,
          tilebounds.geom
        )
      ), 512, 512
    )
  )
FROM
  query, tilebounds
where st_intersects(query.rast, tilebounds.geom)
