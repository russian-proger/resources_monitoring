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


async function insertResource(data) {

  const conn = await pool.getConnection();
  let result = await conn.execute(`
    INSERT INTO resources
    (resource_name, provider_name, link, cost, created_date, code)
    VALUES
    ('${data.resource_name}', '${data.provider_name}', '${data.resource_link}', '0 руб', CURRENT_TIMESTAMP, '123123')
  `);
  conn.release();
  return result;
}

async function getResourceById(id) {
  const conn = await pool.getConnection();
  let result = await conn.execute(`SELECT * FROM resources WHERE id=${id}`);
  conn.release();
  return result;
}

async function getResources() {
  const conn = await pool.getConnection();
  let result = await conn.execute(`SELECT * FROM resources`);
  conn.release();
  return result;
}

async function deleteResourcesByIds(ids) {
  const conn = await pool.getConnection();
  let result = await conn.execute(`DELETE FROM resources WHERE id in (${ids.join(',')})`);
  conn.release();
  return result;
}

async function parseResourceByLink(link, resource_name) {
  
}

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
  
  const sendResponse = () => {
    res.send(JSON.stringify(response));
    res.end();
    return ;
  }

  switch (req.body.action) {
    case 'upload-resource': {
      if (!req.body.resource_link || !req.body.resource_name || !req.body.provider_name)
        return sendError("Некорректный запрос");

      response.result = true;

      let external_data = await parseResourceByLink(req.body.resource_link);
      let query_result = await insertResource({...req.body, ...external_data});

      response.result = (await getResourceById(query_result[0].insertId))[0][0];
      return sendResponse();
    }

    case 'get-resources': {
      response.result = (await getResources())[0];
      return sendResponse();
    }

    case 'delete-resources': {
      if (!req.body.ids)
        return sendError("Некорректный запрос");

      await deleteResourcesByIds(req.body.ids);
      return sendResponse();
    }

    default: {
      return sendError("Параметр `action` некорректный");
    }
  }

  sendError("Что-то пошло не так");
});

// Запуск сервера
const PORT = 10000;
const server = http.createServer(app);
server.listen(PORT);
console.log(`Server is started at port ${ PORT }`);