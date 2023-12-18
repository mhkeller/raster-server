const express = require("express");
const { join } = require("path");
const { readFileSync } = require("fs");
const pg = require('pg');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

const generateVectorTile = readFileSync(
  join(__dirname, "./generate-vector-tile.sql"),
  "utf-8"
);

const pool = new pg.Pool({
	user: process.env.PG_USER,
	host: process.env.PG_HOST,
	password: process.env.PG_PW,
	port: process.env.PG_PORT,
	database: process.env.PG_DB
});

pool.on('error', err => {
	console.error(err);
});

/* Retreive a vector tile by tileid */
router.get("/:z/:x/:y.mvt", async (req, res) => {
  const { params } = req;

  const { z, x, y } = params;

  try {
    const q = generateVectorTile.replace("$query", 'SELECT ST_Makeline(geom ORDER BY field_order) as geom FROM path_test');

    const {
      rows: [tile],
    } = await pool.query(q, [z, x, y]);

    res.setHeader("Content-Type", "application/x-protobuf");

    if (tile.st_asmvt.length === 0) {
      res.status(204);
    }
    res.send(tile.st_asmvt);
  } catch (e) {
    console.log("tiler", e);
    res.status(404).send({
      error: e.toString(),
    });
  }
});

module.exports = router;
