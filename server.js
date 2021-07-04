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




// Запуск сервера
const PORT = 10000;
const server = http.createServer(app);
server.listen(PORT);
console.log(`Server is started at port ${ PORT }`);