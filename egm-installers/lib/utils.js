#!/usr/bin/env node
/**
 * Utilidades compartidas para los instaladores de EGM.
 * - copyTree: copia recursiva (idempotente, sobreescribe)
 * - writeManifest: genera .egm-install-manifest.sha256
 * - writeSourceSha: escribe .egm-source-sha
 * - log helpers
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\u001b[33m',
  blue: '\u001b[34m',
  red: '\u001b[31m',
  cyan: '\u001b[36m',
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}
function ok(msg)   { log(`✓ ${msg}`, 'green'); }
function info(msg) { log(`ℹ ${msg}`, 'blue'); }
function warn(msg) { log(`⚠ ${msg}`, 'yellow'); }
function err(msg)  { log(`✗ ${msg}`, 'red'); }
function header(msg){ console.log(''); log(`=== ${msg} ===`, 'bold'); }

const HOME = process.env.HOME || process.env.USERPROFILE || osHomedir();
function osHomedir() {
  try { return require('os').homedir(); } catch { return process.env.HOME; }
}

function sha256File(file) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(file);
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

function mkdirp(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyFile(src, dst) {
  mkdirp(path.dirname(dst));
  fs.copyFileSync(src, dst);
  // preservar modo
  try { fs.chmodSync(dst, fs.statSync(src).mode & 0o777); } catch {}
}

function copyTree(srcDir, dstDir, filter = () => true) {
  mkdirp(dstDir);
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  const results = [];
  for (const entry of entries) {
    const s = path.join(srcDir, entry.name);
    const d = path.join(dstDir, entry.name);
    if (!filter(s, entry.name)) continue;
    if (entry.isDirectory()) {
      results.push(...copyTree(s, d, filter));
    } else {
      copyFile(s, d);
      results.push(d);
    }
  }
  return results;
}

function writeManifest(targetRoot, installedFiles) {
  const lines = [];
  for (const file of installedFiles) {
    const rel = path.relative(targetRoot, file).split(path.sep).join('/');
    const hash = sha256FileSync(file);
    lines.push(`${hash}  ${rel}`);
  }
  lines.sort();
  const manifestPath = path.join(targetRoot, '.egm-install-manifest.sha256');
  fs.writeFileSync(manifestPath, lines.join('\n') + '\n');
  return manifestPath;
}

function sha256FileSync(file) {
  const hash = crypto.createHash('sha256');
  hash.update(fs.readFileSync(file));
  return hash.digest('hex');
}

function writeSourceSha(targetRoot, sha) {
  fs.writeFileSync(path.join(targetRoot, '.egm-source-sha'), sha + '\n');
}

function readBundleSha(bundleRoot) {
  // Prioridad 1: SHA upstream del bundle original (E.GM commit), si se guarda.
  const upstreamShaFile = path.join(bundleRoot, '.egm-upstream-sha');
  if (fs.existsSync(upstreamShaFile)) {
    return fs.readFileSync(upstreamShaFile, 'utf8').trim();
  }
  // Prioridad 2: git del bundle propio.
  try {
    return execSync('git rev-parse HEAD', { cwd: bundleRoot, encoding: 'utf8' }).trim();
  } catch {
    // Prioridad 3: hash del directorio como identificador local.
    return hashDir(bundleRoot).slice(0, 12);
  }
}

function hashDir(dir) {
  const hash = crypto.createHash('sha256');
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const full = path.join(dir, entry.name);
    hash.update(entry.name);
    if (entry.isDirectory()) {
      hash.update(hashDir(full));
    } else {
      hash.update(sha256FileSync(full));
    }
  }
  return hash.digest('hex');
}

function expand(p) {
  return path.resolve(p.replace(/^~(\/|$)/, HOME + '$1'));
}

module.exports = { colors, log, ok, info, warn, err, header, HOME, expand,
  sha256File, sha256FileSync, mkdirp, copyFile, copyTree, writeManifest,
  writeSourceSha, readBundleSha, hashDir };
