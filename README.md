Raster server
===

### Install

```
npm install
```

### Running

1. Rename [`.env.sample`](./.env.sample) to `.env` and add your postgres connection credentials. Update the `DATABASE` and `USER` fields in package.json to match.
2. Create the table and load data with `npm run create-raster"`
3. Run the tile server with `npm run tile-server`
4. Run the web server with `npm run web-server`

Navigate to `http://127.0.0.1:8080`

