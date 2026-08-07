---
generated_at: 2026-08-07
source_commit: 4d1e363
source_state: dirty
verified_at: 2026-08-07
status: current
related_plans: []
---

# Estrutura do Projeto: Portfólio AS Software

> **Resumo:** Site estático de página única (scroll) do portfólio da AS Software, em HTML + CSS puro com JS mínimo, sem build tools, publicado no GitHub Pages com domínio `andresalvador.com`.

## Stack e Tecnologias

| Elemento | Valor |
|----------|-------|
| Linguagem | HTML, CSS, JavaScript (vanilla) |
| Framework | Nenhum (sem build tools, sem dependências de runtime) |
| Gerenciador de pacotes | Nenhum |
| Principais dependências | Google Fonts (DM Mono, Manrope, Newsreader) — única dependência externa, via CDN |
| Hospedagem | GitHub Pages (branch `master`, `CNAME` → andresalvador.com, `.nojekyll`) |

## Arquitetura

Uma única página (`index.html`) com seções em scroll. O CSS segue ITCSS em camadas carregadas em ordem fixa no `<head>` (do mais genérico ao mais específico), com nomenclatura BEM nos componentes e todos os valores visuais como variáveis CSS em tokens. O JS é um arquivo único (`assets/js/main.js`) com funções isoladas chamadas no `DOMContentLoaded`, sem dependências externas.

```
index.html (seções: hero → capabilities → apps → plugins → sobre → contato)
    ├── assets/css/base/      → tokens, reset, estilos globais de tags
    ├── assets/css/layout/    → container, grid, header, footer
    ├── assets/css/components/→ button, nav, card, portfolio (BEM)
    ├── assets/css/utilities/ → utilitários (sempre por último no cascade)
    └── assets/js/main.js     → initMobileNav, initHeader, initReveal, setCurrentYear
```

### Regras de dependência

- Ordem do cascade CSS é contrato (não inverter): `base/_tokens.css` → `base/_reset.css` → `base/_base.css` → `layout/*` → `components/*` → `utilities/_utilities.css`.
- Todo valor visual (cor, espaçamento, fonte, radius, sombra) vem de `var(--*)` definida em `base/_tokens.css`; nunca usar valores soltos (`24px`, `#333`) fora dos tokens.
- Toda classe reutilizável nasce como componente em `components/` com BEM (`.card`, `.card__title`, `.card--featured`); combinação de utilities repetida 3+ vezes deve virar componente.

## Features

| Feature | Caminho principal | Descrição resumida |
|---------|------------------|-------------------|
| Página única do portfólio | `index.html` + `assets/css/components/_portfolio.css` | Seções em scroll: hero, capabilities, apps (4 cards com links de loja), plugins open source, sobre, contato |

_Comportamentos JS são funções isoladas dentro de `assets/js/main.js`, não módulos separados — ver "Camadas / Módulos Compartilhados"._

## Camadas / Módulos Compartilhados

| Tipo | Caminho | Responsabilidade |
|------|---------|-----------------|
| Tokens | `assets/css/base/_tokens.css` | Variáveis CSS de cor, tipografia, espaçamento, breakpoints |
| Base | `assets/css/base/_reset.css`, `_base.css` | Normalização e estilos globais de tags puras |
| Layout | `assets/css/layout/` | Primitivos estruturais: `_container.css`, `_grid.css`, `_header.css`, `_footer.css` |
| Componentes | `assets/css/components/` | Peças reutilizáveis BEM: `_button.css`, `_nav.css`, `_card.css`, `_portfolio.css` |
| Utilities | `assets/css/utilities/_utilities.css` | Classes utilitárias, últimas no cascade |
| JS | `assets/js/main.js` | Único arquivo JS: nav mobile, header no scroll, reveal via IntersectionObserver, ano atual |
| Imagens | `assets/img/` | Favicon, hero (webp/png), og-cover, ícones dos apps em `apps/` |

## Configuração

| Componente | Arquivo | Responsabilidade |
|-----------|---------|-----------------|
| Servidor local | `.vscode/tasks.json` | Task `Servir portfólio`: `python3 -m http.server 4173` em background |
| Debug | `.vscode/launch.json` | Config `Portfólio AS Software`: abre Chrome em `http://localhost:4173` (F5) |
| Domínio | `CNAME` | `andresalvador.com` (GitHub Pages) |
| Deploy | `deploy.sh` | add/commit/push na `master`, aguarda build do Pages via `gh api` e confirma HTTP 200 |
| Skills Brain Flows | `sync-brain.sh` | Sincroniza skills e agentes do repo `brain-flows` para `.claude/` e `.agents/`; migra `plan/`/`flow/` da raiz para `docs/` |

## Dependências Externas Principais

| Pacote | Versão | Uso no projeto |
|--------|--------|---------------|
| Google Fonts (DM Mono, Manrope, Newsreader) | — | Tipografia do site, carregada via `<link>` no `<head>` |
| GitHub CLI (`gh`) | — | Usado por `deploy.sh` para consultar o status do build do Pages |
| Python 3 | — | Servidor local de desenvolvimento (`http.server 4173`) |

## Observações

- Não há manifesto de dependências (sem `package.json` etc.) nem testes — projeto intencionalmente sem build.
- `images/` (na raiz) contém uma imagem solta fora de `assets/img/`; parece não referenciada pelo site.
- `source_state: dirty` — no momento da análise havia modificações locais: `.gitignore` modificado e pastas `.agents/`/`.claude/` não rastreadas.
