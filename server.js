const express = require('express');
const fs = require('fs');
const http  = require('http');
const https = require('https');
const mysql = require('mysql2');

const bodyParser    = require('body-parser');
const cookieParser  = require('cookie-parser');
const expressStaticGzip = require("express-static-gzip");


const Config = JSON.parse(fs.readFileSync("config.json"));

const app = express();

const pool = mysql.createPool({
  connectionLimit: 5,
  host: Config.mysql.host,
  user: Config.mysql.user,
  database: Config.mysql.database,
  password: Config.mysql.password
}).promise();

try {
  pool.getConnection();
  console.log("mysql connection was established");
} catch (e) {
  console.log("failed with connecting to mysql");
}

// Устанавливаем корневую рендер-директорию
// И "pug" как основной рендерер
app.set('views',       'views' );
app.set('view engine', 'pug');

// Установка cookie-парсера
app.use(cookieParser());
app.set('etag', false);
app.disable('x-powered-by');

// Виртуализация сетевых директорий
app.use('/assets', expressStaticGzip(__dirname.concat('/assets')));
app.use('/static', expressStaticGzip(__dirname.concat('/static')));
app.use('/dist', expressStaticGzip(__dirname.concat('/dist')));

// Включаем парсер body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get("/", (req, res) => {
  res.render("app");
})


/**
 * Обработка API
 */
 app.post('/api', async (req, res) => {
  var response = { status: true };
  const sendError = (message) => {
    response.status = false;
    response.message = message;
    res.send(JSON.stringify(response));
    res.end();
    return ;
  }

  switch (req.body.action) {
    case '': {

      break;
    }
    case 'update-results': {
      const s_fname = `./cache/skills/${req.body.uid}/${req.body.subject_id}`;
      let skills = fs.readFileSync(s_fname).toString('utf8').split(' ').map(v => parseFloat(v));
      req.body.results.forEach((v, i) => {
        let d = 0.25 + 0.75 * (1 - Math.min(v.duration / 60000, 1));
        skills[v.id] = skills[v.id] * 0.8 + (v.result * 20) * d;
      });
      fs.writeFileSync(s_fname, skills.join(' '));
      
      const f_fname = `./cache/freqs/${req.body.uid}/${req.body.subject_id}`;
      let freqs = fs.readFileSync(f_fname).toString('utf8').split(' ').map(v => parseFloat(v));
      req.body.results.forEach(v => ++freqs[v.id]);
      fs.writeFileSync(f_fname, freqs.join(' '));
      

      let tasks_c = req.body.results.length;
      let correct_c = 0;
      let uid = req.body.uid;
      let subject_id = req.body.subject_id;

      req.body.results.forEach(v => correct_c += v.result);
      const [{ insertId }] = await pool.execute(`INSERT INTO results(uid, tasks_c, correct_answers_c, subject_id) VALUES (${uid}, ${tasks_c}, ${correct_c}, ${subject_id});`);

      let data = [tasks_c];
      req.body.results.forEach(v => data.push(v.id, '"' + (v.answer == null || v.answer == undefined ? "" : v.answer) + '"', v.duration, v.result + 0));
      fs.writeFileSync(`./cache/tests/${insertId}`, data.join(' '));
      break;
    }

    case 'is-paid': {
      let [[info]] = await pool.execute(`SELECT \`balance\` FROM \`users\` WHERE \`uid\`=${ req.body.uid }`);
      response.status = true;
      response.result = info.balance <= 1000;
      break;
    }

    case 'get-skills': {
      let fname = `./cache/skills/${req.body.uid}`;

      if (!fs.existsSync(fname)) {
        fs.mkdirSync(fname);
        subjects.forEach((v, i) => fs.writeFileSync(`${fname}/${i}`, new Array(300).fill(50).join(" ")));
      }

      response.result = fs.readFileSync(`${fname}/${req.body.subject_id}`).toString('utf8').split(' ').map(v => parseInt(v));
      break;
    }

    case 'get-freqs': {
      let fname = `./cache/freqs/${req.body.uid}`;

      if (!fs.existsSync(fname)) {
        fs.mkdirSync(fname);
        subjects.forEach((v, i) => fs.writeFileSync(`${fname}/${i}`, new Array(300).fill(0).join(" ")));
      }

      response.result = fs.readFileSync(`${fname}/${req.body.subject_id}`).toString('utf8').split(' ').map(v => parseInt(v));
      break;
    }

    case 'get-stats': {
      if (!req.body.hasOwnProperty('subject_id')) {
        response.status = false;
        break;
      }

      let [results] = await pool.execute(`SELECT * FROM results WHERE uid=${req.body.uid} AND subject_id=${req.body.subject_id} ORDER BY id DESC`);
      response.counts = (await pool.execute(`
        SELECT
          SUM(tasks_c) AS tasks_c,
          SUM(correct_answers_c) AS correct_answers_c,
          AVG(tasks_c) AS avg_tasks_c,
          AVG(correct_answers_c) AS avg_correct_answers_c
        FROM results
        WHERE uid=${req.body.uid} AND subject_id=${req.body.subject_id}`)
      )[0][0];
      response.results = results;
      break;
    }

    default: {
      return sendError("Параметр `action` некорректный");
    }
  }

  res.send(JSON.stringify(response));
});

// Запуск сервера
const PORT = 10000;
const server = http.createServer(app);
server.listen(PORT);
console.log(`Server is started at port ${ PORT }`);