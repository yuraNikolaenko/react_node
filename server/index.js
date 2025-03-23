const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Підключення до SQLite
const db = new sqlite3.Database('data.db', (err) => {
  if (err) {
    console.error('Помилка підключення до SQLite:', err.message);
  } else {
    console.log('✅ Підключено до бази даних SQLite');
  }
});

// Створимо тестову таблицю (одноразово)
db.run(`
  CREATE TABLE IF NOT EXISTS test (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
  )
`);

// Проста тестова ручка
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Привіт з backend!' });
});

// Отримати всі записи з тестової таблиці
app.get('/api/test', (req, res) => {
  db.all('SELECT * FROM test', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Додати запис
app.post('/api/test', (req, res) => {
  const { name } = req.body;
  db.run('INSERT INTO test (name) VALUES (?)', [name], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: this.lastID, name });
    }
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущено на http://localhost:${PORT}`);
});
