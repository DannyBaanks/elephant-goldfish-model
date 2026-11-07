# EGM Installers — Paquetes de comando para instalar el bundle EGM en cualquier CLI

Instala el bundle **Elephant-Goldfish Model (EGM)** en las CLIs de IA de forma tan fácil como
`codex plugin add`, `claude plugin install` o `agy plugin install`.

Soporta **9 CLIs**: Codex, agy/Gemini, Claude Code, Cursor, Crush, qoder, copilot, Hermes y OpenCode V2.

## Estructura

```
egm/           # Fork del bundle EGM (skills, agents, resources, docs, plugin.json…)
egm-installers/       # Este directorio
  install.js          # Despachador principal (node install.js <cli> | --all)
  install-all.js      # Alias: instala todos los CLI detectados
  install-codex.js    # Codex CLI
  install-agy.js      # agy / Gemini CLI
  install-claude.js   # Claude Code
  install-cursor.js   # Cursor
  install-crush.js    # Crush
  install-qoder.js    # qoder
  install-copilot.js  # copilot CLI
  install-hermes.js   # Hermes portable
  install-opencode.js # OpenCode V2
  lib/utils.js        # Utilidades compartidas (copyTree, manifiestos SHA-256)
  completions/        # Autocompletado de shell (bash + zsh)
    egm-install.bash
    _egm-install
  README.md           # este archivo
```

## Comando en el PATH (recomendado)

Se instala un único comando `egm-install` (con alias `egm`) en `~/.local/bin/`:

```bash
# Instalar en un solo CLI
egm-install codex
egm-install agy
egm-install claude
egm-install cursor
egm-install crush
egm-install qoder
egm-install copilot
egm-install hermes
egm-install opencode

# Instalar en todos los CLI que tenga detectados
egm-install --all
# o
egm --all

# Ayuda
egm-install --help
```

El comando es un wrapper sobre `node install.js`, así que funciona desde cualquier directorio.

## Autocompletado de shell

### Bash
Se agrega automáticamente a tu `~/.bashrc`. Luego de reiniciar la sesión (o hacer `source ~/.bashrc`):

```bash
egm-install <TAB>   # → codex agy claude cursor crush qoder copilot hermes opencode --all --help -h
```

Los archivos de completion viven en:
- `egm-installers/completions/egm-install.bash` (en el repo)
- `~/.local/share/egm-installers/completions/egm-install.bash` (instalado, sourceado desde `~/.bashrc`)

### Zsh
Se agrega automáticamente a tu `~/.zshrc` (fpath + compinit). Los archivos viven en:
- `egm-installers/completions/_egm-install` (en el repo)
- `~/.local/share/zsh/completions/_egm-install` (symlink al repo)

## Uso desde el directorio del repo

Desde `ISyCo Git/egm-installers/`:

```bash
# Instalar en un solo CLI
node install.js codex
node install.js agy
node install.js claude
node install.js cursor
node install.js crush
node install.js qoder
node install.js copilot
node install.js hermes
node install.js opencode

# Instalar en todos los CLI que detecte
node install.js --all
# o
node install-all.js
```

Cada instalador es **idempotente** (se puede ejecutar varias veces sin romper nada) y escribe:
- una copia del bundle en la carpeta de plugins del CLI,
- `.egm-source-sha` con el commit del bundle (`e9e1f06…`, v0.1.1),
- `.egm-install-manifest.sha256` con checksums de todos los archivos instalados.

## Rutas de destino por CLI

| CLI | Carpeta de destino |
|-----|-------------------|
| Codex | `~/.codex/plugins/egm/` |
| agy / Gemini | `~/.gemini/config/plugins/egm/` |
| Claude Code | `~/.claude/plugins/egm/` |
| Cursor | `~/.cursor/plugins/local/egm/` |
| Crush | `~/.agents/skills/egm-<skill>/` (una carpeta por skill) |
| Hermes | `~/.hermes/plugins/egm/` (paquete portable) |
| OpenCode | `~/.config/opencode/` y `~/.openisy/config/` |
| qoder | `~/.qoder/plugins/marketplaces/egm/` + `~/.qoder/plugins/cache/egm/egm/0.1.1/` |
| copilot | `~/.copilot/installed-plugins/_direct/google--elephant-goldfish-model/` |

## Verificación tras instalar

```bash
codex plugin list          # debe mostrar egm
qoder plugin list          # debe mostrar egm@egm v0.1.1 enabled
copilot plugin list        # debe mostrar egm (v0.1.1)
claude plugin list         # debe mostrar egm
crush dirs                 # skill-path = $HOME/.agents/skills
```

## Requisitos

- Node.js >= 18 (para los installers de este directorio)
- El bundle en `ISyCo Git/egm/` (ya incluido)
- Los CLI respectivos instalados en el sistema
