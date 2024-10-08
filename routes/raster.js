const express = require("express");
const { join } = require("path");
const { readFileSync } = require("fs");
const pg = require("pg");
const router = express.Router();
const dotenv = require("dotenv");

dotenv.config();

const generateRasterTile = readFileSync(
  join(__dirname, "./generate-raster-tile.sql"),
  "utf-8"
);

const pool = new pg.Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  database: process.env.PGDB,
});

pool.on("error", (err) => {
  console.error(err);
});

/* Retreive a vector tile by tileid */
router.get("/:z/:x/:y.png", async (req, res) => {
  const { params } = req;

  const { z, x, y } = params;

  try {
    const q = generateRasterTile.replace(
      "$query",
      "SELECT * FROM ny_geotiff_warped"
    );

    console.log("q", z, x, y);

    const {
      rows: [tile],
    } = await pool.query(q, [z, x, y]).catch((err) => {
      console.log(err);
    });

    res.setHeader("Content-Type", "image/png");

    if (tile?.st_aspng?.length === 0) {
      res.status(204);
    }
    res.send(tile.st_aspng);
  } catch (e) {
    console.log("tiler", e);
    res.status(404).send({
      error: e.toString(),
    });
  }
});

module.exports = router;
