const pg = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new pg.Pool({
	user: process.env.PG_USER,
	host: process.env.PG_HOST,
	password: process.env.PG_PW,
	port: process.env.PG_PORT,
	database: process.env.PG_DB
});

async function createTable() {
	try {
		/**
		 * Create table
		 */
		const q = `
			CREATE TABLE path_test(
				lat DOUBLE PRECISION,
				lng DOUBLE PRECISION,
				field_order INTEGER,
				geom GEOMETRY(POINT, 4326)
			);
		`;
		await pool.query(q).catch(err => {
			console.log(err);
			process.exit(1);
		});

		/**
		 * Insert data
		 */
		const q2 = `
			INSERT INTO path_test (lat, lng, field_order) VALUES
				(40.74101, -74.00257, 1),
				(40.74101, -73.98698, 2),
				(40.729633, -73.97476, 3),
				(40.74101, -73.98698, 4);
		`;
		await pool.query(q2);

		/**
		 * Add geom field
		 */
		const q3 = `
			UPDATE path_test SET geom = ST_SetSRID(ST_MakePoint(lng, lat), 4326);
		`;
		await pool.query(q3);

		console.log('Table created!');
		await pool.end();
	} catch (e) {
		console.error(e);
	}
}

createTable();
