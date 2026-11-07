#!/usr/bin/env node
/**
 * Instalador de EGM para Hermes (copia directa del bundle, consistente con
 * los demás instaladores de este directorio).
 *
 * Nota: el paquete portable especial de Hermes (con plugin.json con $schema
 * y SKILL.md adaptados) ya fue verificado en la sesión previa mediante
 * install-hermes.py. Este instalador copia el bundle completo a
 * ~/.hermes/plugins/egm/ para mantener la interfaz uniforme (instalar,
 * idempotente, actualizar sha, desinstalar).
 *
 * Uso: node install-hermes.js
 */

const fs = require('fs');
const path = require('path');
const { copyTree, writeManifest, writeSourceSha, readBundleSha, expand, ok, info, warn, err, header } = require('./lib/utils');

const BUNDLE = path.resolve(__dirname, '..');
const DEST = expand('~/.hermes/plugins/egm');

function install() {
  header('EGM -> Hermes');
  if (!fs.existsSync(BUNDLE)) { err(`Bundle no encontrado: ${BUNDLE}`); process.exit(1); }

  if (fs.existsSync(DEST)) fs.rmSync(DEST, { recursive: true, force: true });
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
  console.log('  Verifica con:   hermes plugins list   (debe mostrar egm)');
  console.log('  Opcional:       hermes plugins doctor egm');
  console.log('');
}

install();
