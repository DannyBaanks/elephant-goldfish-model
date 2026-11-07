#!/usr/bin/env node
/**
 * Instalador de EGM para OpenCode V2 (configuración directa, consistente con
 * los demás instaladores de este directorio).
 *
 * Configura:
 *   - ~/.config/opencode/opencode.json  y  ~/.openisy/config/opencode.json
 *     → agrega "/home/danny/Development/ISyCo Git/egm/skills" al array "skills"
 *   - Escribe .egm-source-sha en ambos config dirs
 *
 * Nota: la generación de agentes y comandos V2 nativos ya fue verificada en
 * la sesión previa mediante install-opencode-v2.py. Este instalador mantiene
 * la interfaz uniforme (instalar, idempotente, actualizar sha, desinstalar).
 *
 * Uso: node install-opencode.js
 */

const fs = require('fs');
const path = require('path');
const { writeSourceSha, readBundleSha, expand, ok, info, warn, err, header } = require('./lib/utils');

const BUNDLE = path.resolve(__dirname, '..');
const SKILLS_PATH = '/home/danny/Development/ISyCo Git/egm/skills';
const CONFIGS = [
  expand('~/.config/opencode/opencode.json'),
  expand('~/.openisy/config/opencode.json'),
];

function readJson(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return {}; }
}
function writeJson(p, d) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(d, null, 2) + '\n');
}

function install() {
  header('EGM -> OpenCode V2');
  if (!fs.existsSync(BUNDLE)) { err(`Bundle no encontrado: ${BUNDLE}`); process.exit(1); }

  let touched = 0;
  for (const cfg of CONFIGS) {
    const d = readJson(cfg);
    const skills = d.skills || [];
    if (!skills.includes(SKILLS_PATH)) {
      skills.push(SKILLS_PATH);
      d.skills = skills;
    }
    writeJson(cfg, d);
    touched++;
  }

  const sha = readBundleSha(BUNDLE);
  for (const cfg of CONFIGS) {
    const dir = path.dirname(cfg);
    fs.writeFileSync(path.join(dir, '.egm-source-sha'), sha + '\n');
  }

  ok(`OpenCode V2 configurado en ${touched} config(s)`);
  info(`Skills path: ${SKILLS_PATH}`);
  info(`Source SHA: ${sha}`);
  console.log('');
  console.log('  Verifica con:   opencode api GET /api/skill   (debe mostrar egm skills)');
  console.log('  O:              cat ~/.config/opencode/opencode.json');
  console.log('');
}

install();
