#!/usr/bin/env node
/**
 * Instalador de EGM para Crush.
 * skill-path = $HOME/.agents/skills (según crushrc).
 * Cada skill EGM se instala autocontenida en ~/.agents/skills/egm-<skill>/
 * con agents/, resources/, docs/, TESTING.md dentro para que sus referencias
 * relativas resuelvan.
 *
 * Uso: node install-crush.js
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { copyTree, writeSourceSha, readBundleSha, expand, ok, info, warn, err, header } = require('./lib/utils');

const BUNDLE = path.resolve(__dirname, '..');
const DEST_ROOT = expand('~/.agents/skills');

const DOCS_TO_COPY = ['claude.md', 'codex.md', 'harnesses.md'];

function sha256File(file) {
  const hash = crypto.createHash('sha256');
  hash.update(fs.readFileSync(file));
  return hash.digest('hex');
}

function writeManifest(targetRoot, installedFiles) {
  const lines = [];
  for (const file of installedFiles) {
    const rel = path.relative(targetRoot, file).split(path.sep).join('/');
    lines.push(`${sha256File(file)}  ${rel}`);
  }
  lines.sort();
  fs.writeFileSync(path.join(targetRoot, '.egm-install-manifest.sha256'), lines.join('\n') + '\n');
}

function install() {
  header('EGM -> Crush');
  if (!fs.existsSync(BUNDLE)) { err(`Bundle no encontrado: ${BUNDLE}`); process.exit(1); }
  fs.mkdirSync(DEST_ROOT, { recursive: true });

  const skillsDir = path.join(BUNDLE, 'skills');
  const skillNames = fs.readdirSync(skillsDir).filter(
    (n) => fs.statSync(path.join(skillsDir, n)).isDirectory()
  );

  const allInstalled = [];
  for (const name of skillNames) {
    const srcSkill = path.join(skillsDir, name);
    const dst = path.join(DEST_ROOT, name); // ej. ~/.agents/skills/egm-bootstrap

    // Idempotente: reinstalar limpio
    if (fs.existsSync(dst)) fs.rmSync(dst, { recursive: true, force: true });
    fs.mkdirSync(dst, { recursive: true });

    // 1) contenido propio de la skill (SKILL.md, TEST.md, references/, assets/, agents/openai.yaml…)
    let installed = copyTree(srcSkill, dst, (full) =>
      !full.includes('/.git/') && !full.includes('/node_modules/')
    );

    // 2) contenido compartido EGM para que la skill sea autocontenida
    installed = installed.concat(copyTree(path.join(BUNDLE, 'agents'), path.join(dst, 'agents')));
    installed = installed.concat(copyTree(path.join(BUNDLE, 'resources'), path.join(dst, 'resources')));
    fs.mkdirSync(path.join(dst, 'docs'), { recursive: true });
    for (const doc of DOCS_TO_COPY) {
      const s = path.join(BUNDLE, 'docs', doc);
      if (fs.existsSync(s)) {
        fs.copyFileSync(s, path.join(dst, 'docs', doc));
        installed.push(path.join(dst, 'docs', doc));
      }
    }
    const testing = path.join(BUNDLE, 'TESTING.md');
    if (fs.existsSync(testing)) {
      fs.copyFileSync(testing, path.join(dst, 'TESTING.md'));
      installed.push(path.join(dst, 'TESTING.md'));
    }

    // 3) parchear el link fuera-de-skill ../../docs/codex.md -> docs/codex.md
    const skillMd = path.join(dst, 'SKILL.md');
    if (fs.existsSync(skillMd)) {
      let text = fs.readFileSync(skillMd, 'utf8');
      text = text.replace(/\.\.\/\.\.\/docs\/codex\.md/g, 'docs/codex.md');
      fs.writeFileSync(skillMd, text);
    }

    const sha = readBundleSha(BUNDLE);
    fs.writeFileSync(path.join(dst, '.egm-source-sha'), sha + '\n');

    allInstalled.push(...installed);
    ok(`${name}: ${installed.length} archivos -> ${dst}`);
  }

  writeManifest(DEST_ROOT, allInstalled);
  ok(`Raíz skills: ${DEST_ROOT}`);
  info(`Source SHA: ${readBundleSha(BUNDLE)}`);
  console.log('');
  console.log('  Crush lee las skills desde skill-path ($HOME/.agents/skills).');
  console.log('  Cada egm-* ya es autocontenida (agents/, resources/, docs/, TESTING.md).');
  console.log('');
}

install();
