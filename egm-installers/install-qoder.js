#!/usr/bin/env node
/**
 * Instalador de EGM para qoder.
 * Layout verificado en este sistema:
 *   - marketplace source: ~/.qoder/plugins/marketplaces/egm/  (copia del bundle)
 *   - instalación real:   ~/.qoder/plugins/cache/egm/egm/0.1.1/ (copia del bundle)
 *   - registro:           ~/.qoder/plugins/installed_plugins_v2.json
 *
 * El instalador copia el bundle completo a ambos lugares y registra la
 * entrada egm@egm (scope user, versión 0.1.1) en el JSON de plugins instalados.
 *
 * Uso: node install-qoder.js
 */

const fs = require('fs');
const path = require('path');
const { copyTree, writeManifest, writeSourceSha, readBundleSha, expand, ok, info, warn, err, header } = require('./lib/utils');

const BUNDLE = path.resolve(__dirname, '..');
const QODER = expand('~/.qoder/plugins');
const MARKETPLACE_DEST = path.join(QODER, 'marketplaces/egm');
const CACHE_DEST = path.join(QODER, 'cache/egm/egm/0.1.1');
const REGISTRY = path.join(QODER, 'installed_plugins_v2.json');

function readRegistry() {
  if (!fs.existsSync(REGISTRY)) return { version: 2, plugins: {} };
  try { return JSON.parse(fs.readFileSync(REGISTRY, 'utf8')); } catch { return { version: 2, plugins: {} }; }
}

function writeRegistry(reg) {
  fs.mkdirSync(path.dirname(REGISTRY), { recursive: true });
  fs.writeFileSync(REGISTRY, JSON.stringify(reg, null, 2) + '\n');
}

function install() {
  header('EGM -> qoder');
  if (!fs.existsSync(BUNDLE)) { err(`Bundle no encontrado: ${BUNDLE}`); process.exit(1); }

  // 1) Marketplace source (lo que `qoder plugin marketplace add` registra)
  if (fs.existsSync(MARKETPLACE_DEST)) fs.rmSync(MARKETPLACE_DEST, { recursive: true, force: true });
  fs.mkdirSync(MARKETPLACE_DEST, { recursive: true });
  const marketplaceFiles = copyTree(BUNDLE, MARKETPLACE_DEST, (full) =>
    !full.includes('/.git/') && !full.includes('/node_modules/')
  );

  // 2) Instalación real en cache (lo que `qoder plugin install` despliega)
  if (fs.existsSync(CACHE_DEST)) fs.rmSync(CACHE_DEST, { recursive: true, force: true });
  fs.mkdirSync(CACHE_DEST, { recursive: true });
  const cacheFiles = copyTree(BUNDLE, CACHE_DEST, (full) =>
    !full.includes('/.git/') && !full.includes('/node_modules/')
  );

  // 3) Registro de plugin instalado (idempotente: inserta o reemplaza egm@egm)
  const reg = readRegistry();
  reg.plugins['egm@egm'] = [{
    scope: 'user',
    installPath: CACHE_DEST,
    displayName: 'Elephant-Goldfish Model',
    version: '0.1.1',
    installedAt: new Date().toISOString(),
  }];
  writeRegistry(reg);

  const sha = readBundleSha(BUNDLE);
  writeSourceSha(MARKETPLACE_DEST, sha);
  writeSourceSha(CACHE_DEST, sha);
  writeManifest(CACHE_DEST, cacheFiles);

  ok(`Marketplace: ${MARKETPLACE_DEST} (${marketplaceFiles.length} archivos)`);
  ok(`Instalado:    ${CACHE_DEST} (${cacheFiles.length} archivos)`);
  ok(`Registro:     ${REGISTRY} (egm@egm v0.1.1, user)`);
  info(`Source SHA: ${sha}`);
  console.log('');
  console.log('  Verifica con:   qoder plugin list   (debe mostrar egm@egm v0.1.1 enabled)');
  console.log('  Opcional:       qoder plugin validate .');
  console.log('');
}

install();
