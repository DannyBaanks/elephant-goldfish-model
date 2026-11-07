#!/usr/bin/env node
/**
 * Instalador de EGM para copilot CLI.
 * Layout verificado en este sistema:
 *   ~/.copilot/installed-plugins/_direct/google--elephant-goldfish-model/  (copia del bundle)
 *
 * El instalador copia el bundle completo a esa carpeta (idempotente).
 *
 * Uso: node install-copilot.js
 */

const fs = require('fs');
const path = require('path');
const { copyTree, writeManifest, writeSourceSha, readBundleSha, expand, ok, info, warn, err, header } = require('./lib/utils');

const BUNDLE = expand('~/Development/ISyCo Git');
const DEST = expand('~/.copilot/installed-plugins/_direct/google--elephant-goldfish-model');

function install() {
  header('EGM -> copilot CLI');
  if (!fs.existsSync(BUNDLE)) { err(`Bundle no encontrado: ${BUNDLE}`); process.exit(1); }

  if (fs.existsSync(DEST)) fs.rmSync(DEST, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(DEST), { recursive: true });
  fs.mkdirSync(DEST, { recursive: true });

  const installed = copyTree(BUNDLE, DEST, (full) =>
    !full.includes('/.git/') && !full.includes('/node_modules/')
  );

  const sha = readBundleSha(BUNDLE);
  writeSourceSha(DEST, sha);
  writeManifest(DEST, installed);

  ok(`Instalado en ${DEST} (${installed.length} archivos)`);
  info(`Skills: ${fs.readdirSync(path.join(BUNDLE, 'skills')).length}`);
  info(`Agentes: ${fs.readdirSync(path.join(BUNDLE, 'agents')).length}`);
  info(`Source SHA: ${sha}`);
  console.log('');
  console.log('  Verifica con:   copilot plugin list   (debe mostrar egm v0.1.1)');
  console.log('');
}

install();
