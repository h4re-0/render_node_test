const express = require("express");
const bodyParser = require('body-parser')
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3001;
 
// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static('public'));

// ====サーバー設定====
const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

function getPool() {
  const pgOption = {
    user: process.env.pguser,
    host: process.env.pghost,
    database: process.env.pgdatabase,
    password: process.env.pgpassword,
    port: process.env.pgport,
    ssl: { rejectUnauthorized: false },
  };
  const pool = new Pool(pgOption);
  return pool;
}

// 全問取得api
app.get('/quiz_all', async (req, res) => {
  const pool = getPool();

  const query = `
  SELECT * FROM quizdata
  `

  try {
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 問題投稿api
app.post('/post_quiz', jsonParser, async (req, res) => {
  console.log('/post_quiz', req.body);
  const pool = getPool();
  
  const content = req.body.content;
  const answer = req.body.answer;
  const comment = req.body.comment;
  
  const query = `
  INSERT INTO quizdata (content, answer, comment, creator_id)
  VALUES('${content}','${answer}','${comment}',null)
  `

  try {
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 問題削除api
app.delete('/delete_quiz', jsonParser, async (req, res) => {
  console.log(req.body);
  const pool = getPool();
  
  const id = req.body.id;
  
  const query = `
  DELETE FROM quizdata
  WHERE id = ${id}
  `

  try {
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 問題更新api
app.put('/put_quiz', jsonParser, async (req, res) => {
  console.log(req.body);
  const pool = getPool();
  
  const id = req.body.id;
  const content = req.body.content;
  const answer = req.body.answer;
  const comment = req.body.comment;
  
  const query = `
  UPDATE quizdata
  SET content = '${content}',
      answer = '${answer}',
      comment = '${comment}'
  WHERE id = ${id}
  `
  console.log(query);

  try {
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


