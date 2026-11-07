<h1 align="center">📦 EGM Installers</h1>

<p align="center">
  <strong>El bundle Elephant-Goldfish Model, instalado en cualquier CLI con un solo comando.</strong>
</p>

<p align="center">
  <img alt="CLIs" src="https://img.shields.io/badge/CLIs-9-6f42c1">
  <img alt="Node" src="https://img.shields.io/badge/node-%E2%89%A5%2018-339933?logo=node.js&logoColor=white">
  <img alt="E2E" src="https://img.shields.io/badge/E2E-47%2F47%20PASS-brightgreen">
</p>

---

Instala el bundle **Elephant-Goldfish Model (EGM)** de forma tan simple como `codex plugin add`, `claude plugin install` o `agy plugin install`, pero para **9 CLIs** a la vez.

## 🧩 CLIs soportadas

| | CLI | Instalador |
|:--:|---|---|
| 🤖 | **Codex** | `install-codex.js` |
| ✨ | **agy / Gemini** | `install-agy.js` |
| 🧠 | **Claude Code** | `install-claude.js` |
| 🖱️ | **Cursor** | `install-cursor.js` |
| 💥 | **Crush** | `install-crush.js` |
| 🪽 | **Hermes** | `install-hermes.js` |
| 🧩 | **OpenCode** | `install-opencode.js` |
| 🔍 | **qoder** | `install-qoder.js` |
| 🚁 | **copilot** | `install-copilot.js` |

## ⚡ Uso rápido

```bash
# Un CLI
egm-install codex

# Todos los CLIs detectados
egm-install --all

# Alias corto
egm --all

# Ayuda
egm-install --help
```

El comando `egm-install` es un wrapper sobre `node install.js`, así que funciona desde cualquier directorio.

### Desde el repositorio

```bash
cd egm-installers

node install.js codex      # un CLI
node install.js --all      # todos los detectados
node install-all.js        # alias de --all
```

## 🗂️ Estructura

```text
egm-installers/
├── install.js          # despachador principal (node install.js <cli> | --all)
├── install-all.js      # alias: instala todos los CLIs detectados
├── install-codex.js
├── install-agy.js
├── install-claude.js
├── install-cursor.js
├── install-crush.js
├── install-qoder.js
├── install-copilot.js
├── install-hermes.js
├── install-opencode.js
├── lib/
│   └── utils.js        # copyTree, manifiestos SHA-256, lectura del bundle
├── completions/
│   ├── egm-install.bash
│   └── _egm-install
└── README.md           # este archivo
```

## 🔒 Qué escribe cada instalador

Cada instalador es **idempotente**: se puede ejecutar varias veces sin duplicar archivos ni romper el CLI.

| Artefacto | Contenido |
|---|---|
| Copia del bundle | Skills, agentes, recursos, docs y adaptadores en el destino del CLI |
| `.egm-source-sha` | Commit del bundle instalado (`e9e1f06…`, v0.1.1) |
| `.egm-install-manifest.sha256` | Checksums de todos los archivos instalados |

Reinstalar limpia el destino anterior; actualizar cambia el SHA; desinstalar elimina solo lo que EGM instaló.

## 📍 Rutas de destino

| CLI | Destino |
|---|---|
| Codex | `~/.codex/plugins/egm/` |
| agy / Gemini | `~/.gemini/config/plugins/egm/` |
| Claude Code | `~/.claude/plugins/egm/` |
| Cursor | `~/.cursor/plugins/local/egm/` |
| Crush | `~/.agents/skills/egm-<skill>/` (una carpeta por skill) |
| Hermes | `~/.hermes/plugins/egm/` (paquete portable) |
| OpenCode | `~/.config/opencode/` + `~/.openisy/config/` |
| qoder | `~/.qoder/plugins/marketplaces/egm/` + cache |
| copilot | `~/.copilot/installed-plugins/_direct/google--elephant-goldfish-model/` |

## ⌨️ Autocompletado de shell

### Bash

Se agrega automáticamente a `~/.bashrc`. Tras reiniciar la sesión (o `source ~/.bashrc`):

```bash
egm-install <TAB>   # → codex agy claude cursor crush qoder copilot hermes opencode --all --help -h
```

Archivos:
- `completions/egm-install.bash` (en el repo)
- `~/.local/share/egm-installers/completions/egm-install.bash` (instalado)

### Zsh

Se agrega automáticamente a `~/.zshrc` (fpath + compinit). Archivos:
- `completions/_egm-install` (en el repo)
- `~/.local/share/zsh/completions/_egm-install` (symlink)

## ✅ Verificación tras instalar

```bash
codex plugin list          # debe mostrar egm
qoder plugin list          # debe mostrar egm@egm v0.1.1 enabled
copilot plugin list        # debe mostrar egm (v0.1.1)
claude plugin list         # debe mostrar egm
crush dirs                 # skill-path = $HOME/.agents/skills
```

## 📋 Requisitos

- **Node.js ≥ 18**
- El bundle en la raíz del repo (`ISyCo Git/egm/`)
- Los CLIs respectivos instalados en el sistema
