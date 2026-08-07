# Portfólio AS Software

Site estático de página única (scroll) em HTML + CSS puro com JS vanilla mínimo, sem build tools, publicado no GitHub Pages com domínio `andresalvador.com`.

## Stack

- HTML, CSS e JavaScript vanilla — sem framework, sem dependências de runtime
- Única dependência externa: Google Fonts (DM Mono, Manrope, Newsreader) via CDN
- Hospedagem: GitHub Pages na branch `master` (`CNAME`, `.nojekyll`)

## Estrutura

- `index.html` — página única; todas as seções (hero, capabilities, apps, plugins, sobre, contato) e a ordem de carregamento dos CSS no `<head>`
- `assets/css/base/` — tokens (variáveis CSS), reset, estilos globais de tags
- `assets/css/layout/` — container, grid, header, footer
- `assets/css/components/` — componentes BEM (button, nav, card, portfolio, brain-flows)
- `assets/css/utilities/` — utilitários, sempre por último no cascade
- `assets/js/main.js` — único arquivo JS; cada funcionalidade é uma função isolada chamada no `DOMContentLoaded`
- `docs/flow/` — documentação de estrutura e flows do projeto
- `.claude/skills/`, `.agents/skills/` — skills do Brain Flows (sincronizadas por script, não editar)

## Comandos

- `F5` no VS Code — libera a porta 4173, sobe `python3 -m http.server 4173` e abre o Chrome (`.vscode/launch.json` + `tasks.json`)
- `./deploy.sh "mensagem"` — commit, push na `master`, espera o build do Pages e confirma HTTP 200 (exige `gh` autenticado)
- `./sync-brain.sh` — sincroniza skills/agentes do repo `brain-flows` (script local, está no `.gitignore`)

## Convenções

- **Ordem do cascade CSS é contrato** (não inverter no `<head>`): `_tokens.css` → `_reset.css` → `_base.css` → `layout/*` → `components/*` → `_utilities.css`
- **Tokens**: todo valor visual (cor, espaçamento, fonte, radius, sombra) usa `var(--*)` de `base/_tokens.css`; nunca valores soltos como `24px` ou `#333` fora dos tokens
- **BEM**: `.card`, `.card__title`, `.card--featured`; toda classe reutilizável nasce em `components/`. Combinação de utilities repetida 3+ vezes vira componente
- **Nova seção**: `<section id="nome" class="section">` dentro de `<main>`, reaproveitando `.container`/`.grid`; componente novo entra como `components/_nome.css` respeitando a ordem do cascade
- **JS**: sem dependências; cada funcionalidade é uma função `init*` isolada chamada no `DOMContentLoaded` de `main.js`
- **Acessibilidade**: respeitar `prefers-reduced-motion` e manter conteúdo visível sem JS (padrão do reveal: esconder só sob `html.js`)

## Gotchas

- O push direto na `master` falha se o GitHub tiver commitado `CNAME` por conta própria — o `deploy.sh` já resolve com `git pull --rebase` antes do push
- `deploy.sh` verifica `andrelucassvt.github.io/portifolio-as/`, não o domínio `andresalvador.com` — DNS do domínio não é coberto pela verificação
- Edições manuais em `.claude/skills/` e `.agents/skills/` são sobrescritas pelo próximo `sync-brain.sh` (`rsync --delete`)
- `images/` na raiz não é referenciada pelo site; imagens do site vivem em `assets/img/`

## Não fazer

- Não adicionar build tools, frameworks ou gerenciador de pacotes — o projeto é intencionalmente HTML/CSS/JS puro
- Não editar arquivos dentro de `.claude/skills/` ou `.agents/skills/` — vêm do repo `brain-flows`
- Não inverter a ordem dos `<link>` de CSS no `index.html`
- Não usar valores visuais soltos fora de `_tokens.css`

## 📖 Documentação de Flows

Para qualquer feature ou fluxo, verifique a pasta `./docs/flow/`: leia os títulos dos arquivos `.md` disponíveis e, se algum for relevante para a tarefa atual, leia-o antes de implementar ou debugar. Invoque a skill `flow` para criar ou atualizar flows individuais.

## 🧪 Teste funcional

Após implementar, não execute o projeto para validar o resultado (rodar o app, emulador/simulador, dispositivo físico, servidor local, screenshots ou interação simulada). Teste funcional/visual é responsabilidade do usuário.

- Limite a verificação a análise estática, build/compile e testes automatizados
- Ao concluir, liste objetivamente o que o usuário deve testar manualmente
- Não pergunte se deve executar o projeto — só faça isso se o usuário pedir explicitamente
