// Simple file-based JSON store for users, tickets and orders
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data', 'runtime');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function filePath(name) {
  return path.join(DATA_DIR, name + '.json');
}

function readJson(name, fallback) {
  ensureDir();
  const p = filePath(name);
  if (!fs.existsSync(p)) {
    fs.writeFileSync(p, JSON.stringify(fallback, null, 2), 'utf8');
    return fallback;
  }
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    return fallback;
  }
}

function writeJson(name, data) {
  ensureDir();
  fs.writeFileSync(filePath(name), JSON.stringify(data, null, 2), 'utf8');
}

function initStorage() {
  ensureDir();
  readJson('users', []);
  readJson('orders', []);
  readJson('cards', []);
}

module.exports = { initStorage, readJson, writeJson, DATA_DIR };
