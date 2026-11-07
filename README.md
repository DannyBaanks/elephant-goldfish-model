# elephant-goldfish-model (ISyCo fork)

Fork del bundle **Elephant-Goldfish Model (EGM)** de Google, preparado para
instalarse fácilmente en cualquier CLI de IA (Codex, agy/Gemini, Claude Code,
Cursor, Crush, qoder, copilot, Hermes y OpenCode V2) mediante un único comando
en el PATH.

Incluye:

- Bundle EGM v0.1.1 en la raíz del repo (skills, agentes, recursos, docs, adaptadores)
- `egm-installers/` — paquetes de comando por CLI, idempotentes, con manifiesto SHA-256

## Comando rápido (ya instalado en ~/.local/bin)

Desde cualquier directorio:

```bash
# Instalar en un CLI específico
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

# Alias corto
egm --all

# Ayuda
egm-install --help
```

## CLIs soportadas y destino

| CLI | Carpeta de destino |
|-----|-------------------|
| Codex | `~/.codex/plugins/egm/` |
| agy / Gemini | `~/.gemini/config/plugins/egm/` |
| Claude Code | `~/.claude/plugins/egm/` |
| Cursor | `~/.cursor/plugins/local/egm/` |
| Crush | `~/.agents/skills/egm-<skill>/` |
| Hermes | `~/.hermes/plugins/egm/` |
| OpenCode | `~/.config/opencode/` + `~/.openisy/config/` |
| qoder | `~/.qoder/plugins/marketplaces/egm/` + `~/.qoder/plugins/cache/egm/egm/0.1.1/` |
| copilot | `~/.copilot/installed-plugins/_direct/google--elephant-goldfish-model/` |

Cada instalador escribe `.egm-source-sha` (commit del bundle) y
`.egm-install-manifest.sha256` (checksums de archivos instalados).

## Estructura del repositorio

```
.                   # Bundle EGM v0.1.1 (fuente original: google/elephant-goldfish-model)
.egm-upstream-sha   # commit de upstream sobre el que está construido el fork
egm-installers/     # Instaladores por CLI + autocompletado de shell
  install.js          # despachador principal
  install-*.js        # un instalador por CLI
  lib/utils.js        # utilidades compartidas
  completions/
    egm-install.bash   # autocompletado bash
    _egm-install       # autocompletado zsh
  README.md           # documentación detallada de instaladores
README.md           # este archivo
```

## Autocompletado de shell

Se instala automáticamente en `~/.bashrc` (bash) y `~/.zshrc` (zsh).
Luego de reiniciar la sesión:

```bash
egm-install <TAB>   # codex agy claude cursor crush qoder copilot hermes opencode --all --help -h
```

## Requisitos

- Node.js >= 18
- Los CLI respectivos instalados en el sistema

## Licencia

Apache-2.0 (heredado del bundle EGM original).
