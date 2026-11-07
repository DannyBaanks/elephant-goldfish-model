# Bash completion for egm-install / egm
# Source this file from your ~/.bashrc, e.g.:
#   source ~/.local/share/egm-installers/completions/egm-install.bash

_egm_install_completion() {
    local cur prev opts clis
    COMPREPLY=()
    cur="${COMP_WORDS[COMP_CWORD]}"
    prev="${COMP_WORDS[COMP_CWORD-1]}"

    clis="codex agy claude cursor crush qoder copilot hermes opencode"
    opts="--all --help -h $clis"

    # Only complete the first positional argument (the CLI name).
    if [ "$COMP_CWORD" -eq 1 ]; then
        COMPREPLY=( $(compgen -W "$opts" -- "$cur") )
    else
        COMPREPLY=()
    fi

    return 0
}

complete -o default -F _egm_install_completion egm-install
complete -o default -F _egm_install_completion egm
