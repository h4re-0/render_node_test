const { Pool } = require('pg');

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

async function selectUserdataByUsername(username) {
    const pool = getPool();
    const query = `SELECT * FROM userdata WHERE username = $1`;

    return await pool.query(query, [username]);
}

async function selectQuizdataUtil(order) {
    const pool = getPool();

    let sqlWhere = "";
    let sqlOrder = "";
    let sqlValue = [];

    if (order == "order_random") {
        sqlOrder = "ORDER BY RANDOM()"
    } else if (order == "order_id") {
        sqlOrder = "ORDER BY id"
    } else {
        sqlOrder = "ORDER BY id"
    }

    if (sqlWhere == "") sqlWhere += "TRUE";
    const query = `
    SELECT * FROM quizdata
    WHERE ${sqlWhere}
    ${sqlOrder}
    `;

    return await pool.query(query);
}

async function selectQuizDataSingle(id) {
    const pool = getPool();

    const query = `
    SELECT * FROM quizdata
    WHERE id = $1
    `;

    return pool.query(query, [id]);
}

async function insertQuizdataSingle(content, answer, comment) {
    const pool = getPool();

    const query = `
    INSERT INTO quizdata (content, answer, comment, creator_id)
    VALUES($1,$2,$3,null)
    `
    return await pool.query(query, [content, answer, comment]);
}

async function insertQuizdata(quiz) {
    const pool = getPool();

    let valueList = [];
    let sqlPlaceHolder = "";
    let temp = 1;
    for (let i = 0; i < quiz.length; i++) {
        valueList.push(quiz[i].content);
        valueList.push(quiz[i].answer);
        valueList.push(quiz[i].comment);

        if (sqlPlaceHolder != "") sqlPlaceHolder += ",";
        sqlPlaceHolder += `($${temp++},$${temp++},$${temp++},null)`
    }

    const query = `
    INSERT INTO quizdata (content, answer, comment, creator_id)
    VALUES ${sqlPlaceHolder}
    `;

    return pool.query(query, valueList);
}

async function deleteQuizdata(id) {
    const pool = getPool();

    const query = `
    DELETE FROM quizdata
    WHERE id = $1
    `;

    return pool.query(query, [id]);
}

async function updateQuizdata(id, content, answer, comment) {
    const pool = getPool();

    const query = `
    UPDATE quizdata
    SET content = $1,
        answer = $2,
        comment = $3
    WHERE id = $4
    `;

    return pool.query(query, [content, answer, comment, id]);
}

async function insertUserdata(username, hashedpassword) {
    const pool = getPool();
    
    const query = `INSERT INTO userdata (username, hashedpassword) VALUES ($1, $2)`;

    return await pool.query(query, [username, hashedpassword]);
}

exports.selectUserdataByUsername = selectUserdataByUsername;
exports.insertUserdata = insertUserdata;
exports.selectQuizdataUtil = selectQuizdataUtil;
exports.selectQuizDataSingle = selectQuizDataSingle;
exports.insertQuizdataSingle = insertQuizdataSingle;
exports.insertQuizdata = insertQuizdata;
exports.deleteQuizdata = deleteQuizdata;
exports.updateQuizdata = updateQuizdata;