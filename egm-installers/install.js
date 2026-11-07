#!/usr/bin/env node
/**
 * EGM Installer principal — paquete de comando para instalar el bundle EGM
 * en cualquier CLI de IA (Codex, agy/Gemini, Claude, Cursor, Crush, Hermes, OpenCode).
 *
 * Uso:
 *   node install.js <cli>        # instala en un CLI (codex|agy|claude|cursor|crush|hermes|opencode)
 *   node install.js --all        # instala en todos los CLI detectados
 *   node install.js              # muestra esta ayuda
 *
 * Los instaladores viven en este mismo directorio (install-<cli>.js).
 */

const fs = require('fs');
const path = require('path');
const { expand, ok, info, warn, err, header } = require('./lib/utils');

const INSTALLERS = {
  codex:   './install-codex.js',
  agy:     './install-agy.js',
  claude:  './install-claude.js',
  cursor:  './install-cursor.js',
  crush:   './install-crush.js',
  hermes:  './install-hermes.js',
  opencode:'./install-opencode.js',
  qoder:   './install-qoder.js',
  copilot: './install-copilot.js',
};

const BUNDLE = expand('~/Development/ISyCo Git');

function help() {
  console.log('');
  console.log('  EGM Installer — paquetes de comando para instalar el bundle EGM');
  console.log('');
  console.log('  Uso:  node install.js <cli>');
  console.log('        node install.js --all');
  console.log('');
  console.log('  CLI disponibles:');
  for (const [cli, mod] of Object.entries(INSTALLERS)) {
    const exists = fs.existsSync(path.join(__dirname, mod));
    console.log(`    ${cli.padEnd(10)}  ${exists ? '✓' : '✗'}  ${mod}`);
  }
  console.log('');
  console.log('  Ejemplos:');
  console.log('    node install.js codex');
  console.log('    node install.js agy');
  console.log('    node install.js --all');
  console.log('');
}

function detectInstalledCLIs() {
  // Detecta qué CLI tienen su carpeta de configuración presente
  const probes = {
    codex:   expand('~/.codex'),
    agy:     expand('~/.gemini'),
    claude:  expand('~/.claude'),
    cursor:  expand('~/.cursor'),
    crush:   expand('~/.agents'),
    hermes:  expand('~/.hermes'),
    opencode:expand('~/.config/opencode'),
  };
  const found = [];
  for (const [cli, dir] of Object.entries(probes)) {
    if (fs.existsSync(dir)) found.push(cli);
  }
  return found;
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
    help();
    process.exit(0);
  }

  if (!fs.existsSync(BUNDLE)) {
    err(`Bundle EGM no encontrado: ${BUNDLE}`);
    err('  Ejecuta primero:  cp -r <elephant-goldfish-model> egm');
    process.exit(1);
  }

  if (args.includes('--all')) {
    const found = detectInstalledCLIs();
    if (found.length === 0) {
      warn('No se detectó ningún CLI instalado. Ninguna acción.');
      process.exit(0);
    }
    info(`CLI detectados: ${found.join(', ')}`);
    for (const cli of found) {
      run(cli);
    }
    ok('Instalación en todos los CLI detectados completada.');
    return;
  }

  const cli = args[0];
  if (!INSTALLERS[cli]) {
    err(`CLI desconocido: ${cli}`);
    info(`Opciones válidas: ${Object.keys(INSTALLERS).join(', ')}`);
    process.exit(1);
  }
  run(cli);
}

function run(cli) {
  const mod = path.join(__dirname, INSTALLERS[cli]);
  if (!fs.existsSync(mod)) {
    err(`Instalador no encontrado para ${cli}: ${mod}`);
    process.exit(1);
  }
  require(mod);
}

main();
