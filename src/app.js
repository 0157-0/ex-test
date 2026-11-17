// ⚠️ CÓDIGO PROPOSITALMENTE VULNERÁVEL — apenas para testar scanners de segurança.
// Não rode exposto na internet e não use nada daqui como referência.

const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const serialize = require('node-serialize');
const config = require('./config');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: config.dbPassword,
  database: 'shop',
});

// SQL injection: concatena entrada do usuário na query
app.get('/users', (req, res) => {
  const query = "SELECT * FROM users WHERE name = '" + req.query.name + "'";
  db.query(query, (err, rows) => res.json(rows));
});

// Injeção de comando: parâmetro vai direto para o shell
app.get('/ping', (req, res) => {
  exec('ping -c 1 ' + req.query.host, (err, stdout) => res.send(stdout));
});

// Execução de código arbitrário com eval
app.post('/calc', (req, res) => {
  const result = eval(req.body.expression);
  res.send(String(result));
});

// XSS refletido: devolve entrada do usuário como HTML
app.get('/hello', (req, res) => {
  res.send('<h1>Olá, ' + req.query.name + '</h1>');
});

// Open redirect
app.get('/go', (req, res) => {
  res.redirect(req.query.url);
});

// Path traversal: lê qualquer arquivo do servidor
app.get('/files', (req, res) => {
  const file = path.join(__dirname, 'uploads', req.query.name);
  res.send(fs.readFileSync(file, 'utf8'));
});

// Desserialização insegura (node-serialize permite RCE)
app.post('/profile', (req, res) => {
  const profile = serialize.unserialize(req.body.data);
  res.json(profile);
});

// JWT sem validar algoritmo e com segredo fixo no código
app.get('/me', (req, res) => {
  const token = req.headers.authorization;
  const user = jwt.verify(token, 'super-secret-jwt-key-123');
  res.json(user);
});

// Cookie de sessão sem httpOnly/secure
app.post('/login', (req, res) => {
  res.cookie('session', req.body.user, { httpOnly: false, secure: false });
  res.send('ok');
});

// Verificação de certificado TLS desativada
app.get('/proxy', (req, res) => {
  const agent = new https.Agent({ rejectUnauthorized: false });
  https.get(req.query.target, { agent }, (r) => r.pipe(res));
});

app.listen(3000, () => console.log('vulnerable demo on :3000'));
