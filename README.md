<h1 align="center">🐘 Elephant-Goldfish Model <sub>· fork ISyCo</sub></h1>

<p align="center">
  <strong>Un comando. Nueve CLIs. Cero fricción.</strong><br>
  Fork de <a href="https://github.com/google/elephant-goldfish-model">google/elephant-goldfish-model</a> con instaladores idempotentes para los principales CLIs de IA.
</p>

<p align="center">
  <img alt="License" src="docs/assets/badge-license.svg">
  <img alt="Node" src="docs/assets/badge-node.svg">
  <img alt="CLIs" src="docs/assets/badge-clis.svg">
  <img alt="E2E" src="docs/assets/badge-e2e.svg">
  <img alt="Upstream" src="docs/assets/badge-upstream.svg">
</p>

---

## ⚡ Inicio rápido

```bash
# Instalar en un CLI
egm-install codex

# Instalar en todos los CLIs detectados
egm-install --all

# Ayuda
egm-install --help
```

> El comando vive en `~/.local/bin/egm-install` y funciona desde cualquier directorio.
> Desde un clon del repo también puedes ejecutar `node egm-installers/install.js <cli>`.

<details>
<summary><strong>¿No tienes el comando en el PATH?</strong></summary>

```bash
git clone https://github.com/DannyBaanks/elephant-goldfish-model.git "$HOME/Development/ISyCo Git/egm"

mkdir -p ~/.local/bin
cat > ~/.local/bin/egm-install <<'EOF'
#!/usr/bin/env bash
exec node "$HOME/Development/ISyCo Git/egm/egm-installers/install.js" "$@"
EOF
chmod +x ~/.local/bin/egm-install
```

</details>

## 🧩 CLIs soportadas

| | CLI | Destino |
|:--:|---|---|
| 🤖 | **Codex** | `~/.codex/plugins/egm/` |
| ✨ | **agy / Gemini** | `~/.gemini/config/plugins/egm/` |
| 🧠 | **Claude Code** | `~/.claude/plugins/egm/` |
| 🖱️ | **Cursor** | `~/.cursor/plugins/local/egm/` |
| 💥 | **Crush** | `~/.agents/skills/egm-<skill>/` |
| 🪽 | **Hermes** | `~/.hermes/plugins/egm/` |
| 🧩 | **OpenCode** | `~/.config/opencode/` + `~/.openisy/config/` |
| 🔍 | **qoder** | `~/.qoder/plugins/marketplaces/egm/` + cache |
| 🚁 | **copilot** | `~/.copilot/installed-plugins/_direct/google--elephant-goldfish-model/` |

## 📦 Qué instala

Cada instalador copia el bundle completo —skills, agentes, recursos, documentación y adaptadores— y deja dos archivos de control:

| Archivo | Contenido |
|---|---|
| `.egm-source-sha` | Commit del bundle que quedó instalado |
| `.egm-install-manifest.sha256` | Checksums de todos los archivos instalados |

Todas las operaciones son **idempotentes**: reinstalar limpia el destino anterior, actualizar cambia el SHA y desinstalar elimina solo lo que EGM instaló.

## 🗂️ Estructura del repositorio

```text
.
├── .egm-upstream-sha     # commit de upstream sobre el que está construido el fork
├── egm-installers/       # instaladores por CLI + autocompletado
│   ├── install.js        # despachador principal
│   ├── install-*.js      # un instalador por CLI
│   ├── lib/utils.js      # utilidades compartidas
│   ├── completions/
│   │   ├── egm-install.bash
│   │   └── _egm-install
│   └── README.md         # documentación detallada de instaladores
├── skills/               # skills del bundle
├── agents/               # agentes del bundle
├── docs/                 # documentación del bundle
└── README.md             # este archivo
```

## ⌨️ Autocompletado de shell

Se configura automáticamente en `~/.bashrc` (bash) y `~/.zshrc` (zsh). Tras reiniciar la sesión:

```bash
egm-install <TAB>   # codex agy claude cursor crush qoder copilot hermes opencode --all --help -h
```

## 🔄 Actualizar desde upstream

El fork comparte historia con `google/elephant-goldfish-model`, así que las actualizaciones se traen con un merge normal:

```bash
git remote add upstream https://github.com/google/elephant-goldfish-model.git  # solo la primera vez
git fetch upstream
git merge upstream/main

# Actualizar el SHA de referencia y reinstalar
git rev-parse upstream/main > .egm-upstream-sha
egm-install --all
```

## ✅ Verificación

Suite E2E ejecutada el **2026-11-07**: **47/47 PASS** en los 9 CLIs.

| Fase | Qué comprueba |
|---|---|
| 1. Instalación | El bundle queda en el destino correcto |
| 2. Idempotencia | Reinstalar no duplica ni rompe archivos |
| 3. Actualización | `.egm-source-sha` refleja el nuevo commit |
| 4. Desinstalación | El destino queda limpio |
| 5. Reinstalación | El CLI vuelve a quedar funcional |

## 📋 Requisitos

- **Node.js ≥ 18**
- El CLI de destino instalado en el sistema
- `bash` o `zsh` para el autocompletado (opcional)

## 📄 Licencia

[Apache-2.0](LICENSE), heredada del bundle EGM original.

---

<p align="center">
  <sub>Fork mantenido por <a href="https://github.com/DannyBaanks">DannyBaanks</a> · no oficial</sub>
</p>
