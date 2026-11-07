#!/usr/bin/env node
/**
 * Instalador de EGM para agy / Gemini CLI.
 * Copia el bundle completo a ~/.gemini/config/plugins/egm/
 * (mismo layout que usa `agy plugin install egm@egm`).
 *
 * Uso: node install-agy.js
 */

const path = require('path');
const { copyTree, writeManifest, writeSourceSha, readBundleSha, expand, ok, info, warn, err, header } = require('./lib/utils');

const BUNDLE = path.resolve(__dirname, '..');
const DEST = expand('~/.gemini/config/plugins/egm');

function install() {
  header('EGM -> agy / Gemini CLI');
  if (!require('fs').existsSync(BUNDLE)) { err(`Bundle no encontrado: ${BUNDLE}`); process.exit(1); }

  const fs = require('fs');
  // Idempotente: reinstalar limpio (evita archivos huérfanos al actualizar)
  if (fs.existsSync(DEST)) fs.rmSync(DEST, { recursive: true, force: true });
  fs.mkdirSync(DEST, { recursive: true });

  const installed = copyTree(BUNDLE, DEST, (full) => {
    // No llevar el .git ni carpetas de trabajo internas del fork
    return !full.includes('/.git/') && !full.includes('/node_modules/');
  });

  const sha = readBundleSha(BUNDLE);
  writeSourceSha(DEST, sha);
  writeManifest(DEST, installed);

  ok(`Instalado en ${DEST}`);
  info(`Skills: ${fs.readdirSync(path.join(BUNDLE, 'skills')).length}`);
  info(`Agentes: ${fs.readdirSync(path.join(BUNDLE, 'agents')).length}`);
  info(`Source SHA: ${sha}`);
  console.log('');
  console.log('  Luego ejecuta:  agy plugin list   (debe mostrar egm enabled)');
  console.log('  O:              gemini skills list');
  console.log('');
}

install();
