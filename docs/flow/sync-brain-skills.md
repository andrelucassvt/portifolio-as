---
generated_at: 2026-08-07
source_commit: 4d1e363
source_state: dirty
verified_at: 2026-08-07
status: current
related_plans: []
---

# Flow: Sincronização das Skills Brain Flows

> **Resumo:** Script que baixa do repositório `brain-flows` as cinco skills e os dois agentes locais e os instala em `.claude/skills/`, `.agents/skills/` e `.claude/agents/`, com auto-atualização do próprio script e migração de `plan/`/`flow/` da raiz para `docs/`.

## Visão Geral

O desenvolvedor roda `./sync-brain.sh` para alinhar as skills do projeto com o repositório-fonte. O script clona o `brain-flows` (shallow, branch `main`) num diretório temporário e, antes de qualquer cópia, compara a versão baixada de si mesmo com a local: se diferir, copia a nova versão e se reexecuta — a auto-atualização garante que o restante do fluxo rode sempre com o script mais recente. Depois copia as cinco skills (`brainstorming`, `flow`, `flow-init`, `writing-plan`, `executing-plan`) para um staging e dali, com `rsync --delete`, para `.claude/skills/` e `.agents/skills/` — o `--delete` remove skills que deixaram de existir na fonte. Em seguida copia os agentes (`brain-agent-loop`, `brain-agent-loop-exec`) para `.claude/agents/` diretamente, sem staging por skill — o comentário no script explica: agentes não passam pelo plugin porque subagents de plugin ignoram o campo `permissionMode`. Por fim, migra pastas legadas `plan/` e `flow/` da raiz para `docs/plan/` e `docs/flow/`. Qualquer skill ou agente ausente na fonte aborta o script com erro antes de tocar os destinos.

## Passo a Passo

1. **[Gatilho]** — `sync-brain.sh` (executado manualmente)
   `./sync-brain.sh`; `set -euo pipefail` aborta em qualquer falha. Caminhos-fonte são configuráveis por env (`SOURCE_REPO`, `SOURCE_BRANCH`, `SOURCE_SKILLS_PATH`, `SOURCE_AGENTS_PATH`).
2. **[Clone da fonte]** — `sync-brain.sh` → `git clone --depth 1` para `$TMP_DIR/source`
   Shallow clone do repositório `brain-flows`; `trap cleanup EXIT` garante a remoção do diretório temporário ao sair.
3. **[Auto-atualização]** — `sync-brain.sh` → `diff` do script fonte vs. local
   Se o `sync-brain.sh` do clone difere do local: copia por cima, aplica `chmod +x`, remove o temp, desativa o trap e se reexecuta via `exec` com os mesmos argumentos.
4. **[Validação e staging das skills]** — `sync-brain.sh` → loop em `BRAIN_SKILLS`
   Para cada skill: exige `SKILL.md` na fonte (ausência aborta com erro) e copia com `rsync -a --delete` para `$TMP_DIR/skills/<skill>`.
5. **[Instalação das skills]** — `sync-brain.sh` → loop em `TARGET_SKILLS_DIRS` (`.claude/skills`, `.agents/skills`)
   Aplica `rsync -a --delete` do staging para cada destino, skill a skill — os dois destinos ficam idênticos entre si e à fonte.
6. **[Instalação dos agentes]** — `sync-brain.sh` → loop em `BRAIN_AGENTS`
   Valida cada `<agente>.md` na fonte (ausência aborta) e copia para `.claude/agents/` via staging simples (`cp`, sem `--delete`).
7. **[Migração de estrutura legada]** — `sync-brain.sh` → `migrate_root_dir_to_docs "plan"` e `"flow"`
   Se `plan/` ou `flow/` existirem na raiz: move o conteúdo para `docs/plan/` e `docs/flow/` com `rsync -a` e remove a pasta antiga.

### Caminhos alternativos

- **Skill ausente na fonte:** aborta com erro antes de modificar qualquer destino (passo 4).
- **Agente ausente na fonte:** aborta com erro (passo 6).
- **Script fonte idêntico ao local:** pula a auto-atualização e segue direto para as skills (passo 3).
- **Sem pastas legadas na raiz:** `migrate_root_dir_to_docs` não faz nada (passo 7).

## Arquivos Envolvidos

| Camada | Arquivo | Responsabilidade |
|--------|---------|------------------|
| Orquestração | `sync-brain.sh` | Todo o fluxo: clone, auto-atualização, staging, instalação e migração |
| Destino | `.claude/skills/`, `.agents/skills/` | Recebem as cinco skills (sincronizadas com `--delete`) |
| Destino | `.claude/agents/` | Recebe os dois agentes locais (cópia simples) |
| Configuração | `.gitignore` | `sync-brain.sh` é ignorado — o script é local, não versionado neste repo |

## Regras de Negócio Relevantes

- **Auto-atualização antes de tudo** — `sync-brain.sh`: o script se substitui e se reexecuta se a fonte trouxer versão nova, garantindo que mudanças no próprio processo de sync valham já naquela execução.
- **Destinos espelham a fonte** — `sync-brain.sh`: `rsync --delete` nas skills remove localmente o que sumiu da fonte; edições locais nas skills são sobrescritas a cada sync.
- **Agentes fora do plugin** — `sync-brain.sh`: instalados direto em `.claude/agents/` (não via plugin) porque subagents de plugin ignoram `permissionMode`.
- **Falha rápida** — `sync-brain.sh`: qualquer skill/agente faltando na fonte aborta antes de escrever nos destinos, evitando instalação parcial.

## Dependências Externas

- Repositório `https://github.com/andrelucassvt/brain-flows.git` (branch `main` por padrão).
- `git`, `rsync`, `diff` e `mktemp` disponíveis no sistema.

## Observações

- Os agentes são copiados com `cp` simples (sem `--delete`): um agente removido da fonte permanece em `.claude/agents/` — ao contrário das skills, não há espelhamento.
- O próprio `sync-brain.sh` consta no `.gitignore` deste projeto, mas o passo 3 depende de comparar o script local com o da fonte — funciona porque o arquivo existe localmente mesmo não versionado aqui.
