#!/usr/bin/env node
/**
 * Minimal .env loader (no dotenv dependency). Sets process.env with optional override.
 */
const fs = require('fs');

function parseEnvValue(raw) {
  const value = raw.trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

function loadEnvFile(filePath, { override = false } = {}) {
  if (!fs.existsSync(filePath)) {
    return { loaded: false, path: filePath, keys: [] };
  }

  const keys = [];
  const content = fs.readFileSync(filePath, 'utf8');

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    if (!key) continue;
    if (!override && process.env[key] !== undefined) continue;

    process.env[key] = parseEnvValue(trimmed.slice(eq + 1));
    keys.push(key);
  }

  return { loaded: true, path: filePath, keys };
}

module.exports = { loadEnvFile };
