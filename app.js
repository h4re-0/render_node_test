const express = require("express");
const router = require("./router/router.js").router;
const passport = require('passport');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3001;

// テンプレートエンジンの指定
app.set("view engine", "ejs");

// リクエストをbodyで受け取れるようにする
app.use(express.json())

// formなどのデータをbodyで受け取れるようにする
app.use(express.urlencoded({ extended: true }));

// public以下のファイルをアクセス可能にする
app.use(express.static('public'));
app.use(session({
  secret: 'keyboard dog',
  resave: false,
  saveUninitialized: false,
  // store: 
}));

app.use(passport.initialize());
app.use(passport.authenticate('session'));

// ====サーバー設定====
const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

// routerの設定
app.use('/', router);

