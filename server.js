
// dependencies
const express = require("express");
// create express app and prepare db connection
const app = express();

// allows CORS
app.all("*", (req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	next();
});

// import routes
app.use("/tiles", require("./routes/tiles.js"));
app.use("/raster", require("./routes/raster.js"));

// start the server
app.listen(4000);
console.log(`Postgis tiler is listening on port 4000...`); // eslint-disable-line
