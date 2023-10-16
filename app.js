const express = require("express");
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3001;

app.use(express.static('public'));

// ====サーバー設定====
const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

app.get('/staff', async (req, res) => {
  const pgOption = {
    user: process.env.pguser,
    host: process.env.pghost,
    database: process.env.pgdatabase,
    password: process.env.pgpassword,
    port: process.env.pgport,
    ssl: { rejectUnauthorized: false },
  };

  console.log(pgOption);
  const pool = new Pool(pgOption);

  try {
    const result = await pool.query('SELECT * FROM staff');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

