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

// 1問取得api
app.get('/quiz_single', jsonParser, async (req, res) => {
  const pool = getPool();

  const id = req.query.id;

  const query = `
  SELECT * FROM quizdata
  WHERE id = $1
  `

  try {
    const result = await pool.query(query, [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 問題投稿api
app.post('/post_quiz', jsonParser, async (req, res) => {
  const pool = getPool();

  const content = req.body.content;
  const answer = req.body.answer;
  const comment = req.body.comment;

  const query = `
  INSERT INTO quizdata (content, answer, comment, creator_id)
  VALUES($1,$2,$3,null)
  `

  try {
    const result = await pool.query(query, [content, answer, comment]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 問題投稿api
app.post('/post_many_quiz', jsonParser, async (req, res) => {
  const pool = getPool();
  console.log(req.body.quiz);
  const quiz = req.body.quiz;

  let valueList = [];
  let sqlPlaceHolder = "";
  let temp = 1;
  for (let i = 0; i < quiz.length; i++) {
    valueList.push(quiz[i].content);
    valueList.push(quiz[i].answer);
    valueList.push(quiz[i].comment);

    if (sqlPlaceHolder != "") sqlPlaceHolder += ",";
    sqlPlaceHolder+= `($${temp++},$${temp++},$${temp++},null)`
  }

  const query = `
  INSERT INTO quizdata (content, answer, comment, creator_id)
  VALUES ${sqlPlaceHolder}
  `

  try {
    const result = await pool.query(query, valueList);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 問題削除api
app.delete('/delete_quiz', jsonParser, async (req, res) => {
  const pool = getPool();

  const id = req.body.id;

  const query = `
  DELETE FROM quizdata
  WHERE id = $1
  `

  try {
    const result = await pool.query(query, [id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 問題更新api
app.put('/put_quiz', jsonParser, async (req, res) => {
  const pool = getPool();

  const id = req.body.id;
  const content = req.body.content;
  const answer = req.body.answer;
  const comment = req.body.comment;

  const query = `
  UPDATE quizdata
  SET content = $1,
      answer = $2,
      comment = $3
  WHERE id = $4
  `

  try {
    const result = await pool.query(query, [content, answer, comment, id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


