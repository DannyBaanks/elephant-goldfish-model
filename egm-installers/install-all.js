#!/usr/bin/env node
/**
 * Alias de `node install.js --all`. Instala EGM en todos los CLI detectados.
 */
require('./install.js');
process.argv.push('--all');
require('./install.js');
