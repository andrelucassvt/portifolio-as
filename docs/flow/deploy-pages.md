---
generated_at: 2026-08-07
source_commit: 4d1e363
source_state: dirty
verified_at: 2026-08-07
status: current
related_plans: []
---

# Flow: Deploy no GitHub Pages

> **Resumo:** Script que publica o site em um comando: commita todas as mudanças locais, faz push na `master`, aguarda o build do GitHub Pages e confirma que o site responde HTTP 200.

## Visão Geral

O desenvolvedor roda `./deploy.sh "mensagem do commit"` (ou sem argumento para mensagem padrão). O script primeiro aborta se a árvore estiver limpa — sem mudanças, não há o que publicar. Depois faz `git add -A`, commit e `git pull --rebase` antes do push: o rebase é necessário porque o próprio GitHub commita no repositório (o arquivo `CNAME`, ao configurar o domínio personalizado), o que rejeitaria um push direto. Como o build do Pages é assíncrono, o script consulta `gh api repos/.../pages` em loop (até 20 tentativas de 10s) esperando o status `built`, aborta em `errored`, e por fim valida com `curl` que o site publicado responde HTTP 200.

## Passo a Passo

1. **[Gatilho]** — `deploy.sh` (executado manualmente)
   `./deploy.sh ["mensagem"]`; sem argumento, usa `chore: atualiza conteudo do site`. `set -euo pipefail` faz qualquer falha abortar o script. `cd` para o diretório do próprio script.
2. **[Guarda de mudanças]** — `deploy.sh` → `git status --porcelain`
   Se a saída for vazia (árvore limpa), imprime "Nada para commitar" e sai com código 0.
3. **[Commit]** — `deploy.sh` → `git add -A && git commit -m "$msg"`
   Mostra `git status --short` das mudanças e commita tudo com a mensagem recebida.
4. **[Sync com o remoto]** — `deploy.sh` → `git pull --rebase origin master`
   Rebase antes do push para absorver commits feitos pelo próprio GitHub (ex.: `CNAME`).
5. **[Push]** — `deploy.sh` → `git push origin master`
   O push dispara o build do GitHub Pages automaticamente.
6. **[Espera do build]** — `deploy.sh` → loop `gh api repos/andrelucassvt/portifolio-as/pages --jq '.status'`
   Até 20 iterações com `sleep 10`: sai do loop em `built`, aborta com erro em `errored` (apontando a página de deployments).
7. **[Verificação final]** — `deploy.sh` → `curl -s -o /dev/null -w '%{http_code}' https://andrelucassvt.github.io/portifolio-as/`
   HTTP 200 confirma a publicação; qualquer outro código sai com erro 1.

### Caminhos alternativos

- **Árvore limpa:** sai cedo com código 0, sem commit nem push (passo 2).
- **Build com erro no Pages:** o loop detecta `errored` e aborta com instrução de verificar os deployments (passo 6).
- **`gh api` indisponível/falhando:** o status cai no fallback `"?"` e o loop continua até esgotar as 20 tentativas — nesse caso o script segue para o `curl` mesmo sem confirmação de `built` (passo 6).
- **Site não responde 200:** sai com erro 1 reportando o código HTTP recebido (passo 7).

## Arquivos Envolvidos

| Camada | Arquivo | Responsabilidade |
|--------|---------|------------------|
| Orquestração | `deploy.sh` | Todo o fluxo: guarda, commit, rebase, push, espera do build e verificação |
| Configuração | `CNAME` | Domínio personalizado `andresalvador.com` servido pelo Pages |
| Configuração | `.nojekyll` | Desativa o processamento Jekyll do Pages (site é HTML estático puro) |

## Regras de Negócio Relevantes

- **Rebase obrigatório antes do push** — `deploy.sh`: o GitHub commita `CNAME` por conta própria; sem o rebase o push é rejeitado.
- **Deploy só com mudanças** — `deploy.sh`: árvore limpa não gera commit vazio nem build desnecessário.
- **Confirmação em duas etapas** — `deploy.sh`: status `built` da API do Pages **e** HTTP 200 no site; só as duas juntas declaram o deploy concluído.

## Dependências Externas

- GitHub Pages (build disparado pelo push na `master`).
- GitHub CLI (`gh`) autenticado — consulta o status do build.
- `curl` — verificação final do site publicado.

## Observações

- O timeout do build é fixo (~200s: 20 × 10s); se o Pages demorar mais sem `errored`, o script segue para o `curl`, que pode pegar a versão antiga e falhar com falso negativo.
- A URL verificada é `andrelucassvt.github.io/portifolio-as/`, não o domínio `andresalvador.com` do `CNAME` — a verificação cobre o Pages, não o DNS do domínio personalizado.
