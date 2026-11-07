#!/usr/bin/env node
/**
 * Instalador de EGM para Claude Code.
 * Copia el bundle completo a ~/.claude/plugins/egm/
 * (layout equivalente a `claude plugin install egm@egm`).
 *
 * Uso: node install-claude.js
 */

const fs = require('fs');
const path = require('path');
const { copyTree, writeManifest, writeSourceSha, readBundleSha, expand, ok, info, warn, err, header } = require('./lib/utils');

const BUNDLE = expand('~/Development/ISyCo Git');
const DEST = expand('~/.claude/plugins/egm');

function install() {
  header('EGM -> Claude Code');
  if (!fs.existsSync(BUNDLE)) { err(`Bundle no encontrado: ${BUNDLE}`); process.exit(1); }

  if (fs.existsSync(DEST)) fs.rmSync(DEST, { recursive: true, force: true });
  fs.mkdirSync(DEST, { recursive: true });

  const installed = copyTree(BUNDLE, DEST, (full) =>
    !full.includes('/.git/') && !full.includes('/node_modules/')
  );

  const sha = readBundleSha(BUNDLE);
  writeSourceSha(DEST, sha);
  writeManifest(DEST, installed);

  ok(`Instalado en ${DEST}`);
  info(`Skills: ${fs.readdirSync(path.join(BUNDLE, 'skills')).length}`);
  info(`Agentes: ${fs.readdirSync(path.join(BUNDLE, 'agents')).length}`);
  info(`Source SHA: ${sha}`);
  console.log('');
  console.log('  Luego ejecuta:  claude plugin list   (debe mostrar egm)');
  console.log('  O:              claude plugin install egm@egm');
  console.log('');
}

install();
