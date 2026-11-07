#!/usr/bin/env node
/**
 * Instalador de EGM para Cursor (local plugin).
 * Layout per docs/cursor.md del bundle:
 *   ~/.cursor/plugins/local/egm/
 *     .cursor-plugin/  (plugin.json, agents/, rules/, assets/)
 *     skills/, agents/, resources/, docs/, LICENSE, .egm-source-sha
 *
 * Uso: node install-cursor.js
 */

const fs = require('fs');
const path = require('path');
const { copyTree, copyFile, writeManifest, writeSourceSha, readBundleSha, expand, ok, info, warn, err, header } = require('./lib/utils');

const BUNDLE = expand('~/Development/ISyCo Git');
const DEST = expand('~/.cursor/plugins/local/egm');

function install() {
  header('EGM -> Cursor');
  if (!fs.existsSync(BUNDLE)) { err(`Bundle no encontrado: ${BUNDLE}`); process.exit(1); }

  if (fs.existsSync(DEST)) fs.rmSync(DEST, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(DEST), { recursive: true });
  fs.mkdirSync(DEST, { recursive: true });

  const filter = (full) => !full.includes('/.git/') && !full.includes('/node_modules/');

  // Copia explícita de los directorios del adapter Cursor (mismo orden que docs/cursor.md)
  const toCopy = [
    '.cursor-plugin',
    'skills',
    'agents',
    'resources',
    'docs',
    'LICENSE',
  ];
  let installed = [];
  for (const item of toCopy) {
    const src = path.join(BUNDLE, item);
    if (!fs.existsSync(src)) { warn(`Falta en bundle: ${item}`); continue; }
    const st = fs.statSync(src);
    if (st.isDirectory()) {
      installed = installed.concat(copyTree(src, path.join(DEST, item), filter));
    } else {
      copyFile(src, path.join(DEST, item));
      installed.push(path.join(DEST, item));
    }
  }

  const sha = readBundleSha(BUNDLE);
  fs.writeFileSync(path.join(DEST, '.egm-source-sha'), sha + '\n');
  writeManifest(DEST, installed);

  ok(`Instalado en ${DEST}`);
  info(`Skills: ${fs.readdirSync(path.join(BUNDLE, 'skills')).length}`);
  info(`Revisores (agentes): ${fs.readdirSync(path.join(BUNDLE, '.cursor-plugin/agents')).length}`);
  info(`Source SHA: ${sha}`);
  console.log('');
  console.log('  Recarga Cursor e inspecciona el plugin en Customize.');
  console.log('  cursor-agent plugin marketplace   (solo marketplace; no hay `list`)');
  console.log('');
}

install();
