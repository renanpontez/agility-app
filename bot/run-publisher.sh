#!/bin/bash
# Wrapper chamado pelo launchd. Localiza o node e roda o publicador.
cd "$(dirname "$0")" || exit 1

# Garantir que o node seja encontrado mesmo no PATH minimo do launchd
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$PATH"
if [ -s "$HOME/.nvm/nvm.sh" ]; then . "$HOME/.nvm/nvm.sh" >/dev/null 2>&1; fi

NODE="$(command -v node)"
if [ -z "$NODE" ]; then
  echo "$(date '+%Y-%m-%dT%H:%M:%S') ERRO: node nao encontrado no PATH" >> publish.log
  exit 1
fi

"$NODE" publish.mjs >> publish.log 2>&1
