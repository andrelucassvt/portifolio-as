#!/usr/bin/env bash
#
# Publica as mudanças no GitHub Pages.
#
# O push no master já dispara o build sozinho — este script existe para
# fazer add/commit/push num passo só e esperar o build terminar,
# confirmando que o site subiu de verdade.
#
# Uso:  ./deploy.sh "mensagem do commit"
#       ./deploy.sh                        (usa uma mensagem padrão)

set -euo pipefail

REPO="andrelucassvt/portifolio-as"
SITE="https://andrelucassvt.github.io/portifolio-as/"
BRANCH="master"

cd "$(dirname "$0")"

msg="${1:-chore: atualiza conteudo do site}"

# Sem mudanças pendentes não há o que publicar.
if [ -z "$(git status --porcelain)" ]; then
  echo "Nada para commitar — a árvore de trabalho está limpa."
  exit 0
fi

echo "==> Mudanças a publicar:"
git status --short

git add -A
git commit -m "$msg"
git push origin "$BRANCH"

# O build do Pages é assíncrono; sem esperar, um curl logo após o push
# ainda devolve a versão antiga.
echo "==> Aguardando o build do GitHub Pages..."
for _ in $(seq 1 20); do
  status=$(gh api "repos/$REPO/pages" --jq '.status' 2>/dev/null || echo "?")
  echo "    build: $status"
  case "$status" in
    built)   break ;;
    errored) echo "!! O build falhou. Veja: https://github.com/$REPO/deployments"; exit 1 ;;
  esac
  sleep 10
done

code=$(curl -s -o /dev/null -w '%{http_code}' "$SITE")
if [ "$code" = "200" ]; then
  echo "==> Publicado: $SITE"
else
  echo "!! O site respondeu HTTP $code — verifique $SITE"
  exit 1
fi
