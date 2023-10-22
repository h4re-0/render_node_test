const express = require("express");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');
const query = require('../db/query');

// 認証機能の設定
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const res = await query.selectUserdataByUsername(username);
        if (res.rowCount != 1) throw "userdataerror";
        const row = res.rows[0];

        crypto.pbkdf2(password, 'salt', 310000, 32, 'sha256', function (err, hashedPassword) {
            if (err) { return done(err); }
            if (row.hashedpassword == null) { return done(err); }
            if (!crypto.timingSafeEqual(row.hashedpassword, hashedPassword)) {
                return done(null, false, { message: 'Incorrect username or password.' });
            }
            return done(null, row);
        });
    } catch (err) {
        console.error(err);
        return done(null, false, { message: 'Incorrect username or password.' });
    }
}));

passport.serializeUser(function (user, cb) {
    console.log(user);
    process.nextTick(function () {
        cb(null, { id: user.id, username: user.username });
    });
});

passport.deserializeUser(function (user, cb) {
    console.log(user);
    process.nextTick(function () {
        return cb(null, user);
    });
});
const router = express.Router(); // express.Router() 関数を使って新しいルーターオブジェクトを作成します

// ====認証用api===
// ログインapi

router.post('/login/password', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/signin.html'
}));

router.post('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

router.post('/signup', function (req, res, next) {
    console.log("AAA");
    const username = req.body.username;
    crypto.pbkdf2(req.body.password, 'salt', 310000, 32, 'sha256', async function (err, hashedPassword) {
        console.log(req.body.password, hashedPassword);
        if (err) { return next(err); }

        const response = await query.insertUserdata(username, hashedPassword);
        res.redirect('/signin.html');
    });
});

router.get("/getlogin", function (req, res, next) {
    console.log("getlogin", req.user)
    var data = {
        user: req.user,
        items: [
            { name: "<h1>リンゴ</h1>" },
            { name: "<h2>バナナ</h2>" },
            { name: "<h3>スイカ</h3>" },
        ]
    };
    // レンダリングを行う
    console.log("getlogin", data)
    res.render("index.ejs", data);
});

// 問題検索api
router.get('/quiz_search', async (req, res) => {
    try {
        const result = await query.selectQuizdataUtil(req.query.order);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 1問取得api
router.get('/quiz_single', async (req, res) => {
    try {
        const result = await query.selectQuizDataSingle(req.query.id);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 問題投稿api
router.post('/post_quiz', async (req, res) => {
    const content = req.body.content;
    const answer = req.body.answer;
    const comment = req.body.comment;
    try {
        const result = await query.insertQuizdataSingle(content, answer, comment);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 問題投稿api
router.post('/post_many_quiz', async (req, res) => {
    try {
        const result = await query.insertQuizdata(req.body.quiz);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 問題削除api
router.delete('/delete_quiz', async (req, res) => {
    try {
        const result = await query.deleteQuizdata(req.body.id);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 問題更新api
router.put('/put_quiz', async (req, res) => {
    const id = req.body.id;
    const content = req.body.content;
    const answer = req.body.answer;
    const comment = req.body.comment;
    try {
        const result = await query.updateQuizdata(id, content, answer, comment);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

exports.router = router; // 作成したルーターオブジェクトをエクスポートします
