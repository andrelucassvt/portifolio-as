---
generated_at: 2026-08-07
source_commit: 1826d89
source_state: dirty
verified_at: 2026-10-17
status: current
related_plans: ["docs/plan/apps-directory-page.md"]
---

# Estrutura do Projeto: Portfólio AS Software

> **Resumo:** Site estático do portfólio da AS Software, em HTML + CSS puro com JS mínimo, sem build tools, publicado no GitHub Pages com domínio `andresalvador.com`. Duas páginas principais: `index.html` (landing em scroll) e `apps.html` (diretório independente de todos os aplicativos), mais cinco páginas auxiliares de redirecionamento em `ir/<slug>/`.

## Stack e Tecnologias

| Elemento | Valor |
|----------|-------|
| Linguagem | HTML, CSS, JavaScript (vanilla) |
| Framework | Nenhum (sem build tools, sem dependências de runtime) |
| Gerenciador de pacotes | Nenhum |
| Principais dependências | Google Fonts (Manrope; DM Mono só para código) — única dependência externa, via CDN |
| Hospedagem | GitHub Pages (branch `master`, `CNAME` → andresalvador.com, `.nojekyll`) |

## Arquitetura

Duas páginas principais independentes, sem roteamento nem templating: `index.html` (landing em scroll) e `apps.html` (diretório de aplicativos, alcançável pelo menu e por um botão no fim da seção `#apps` da landing). As cinco páginas de `ir/<slug>/` são links curtos de redirecionamento para as lojas, reaproveitando o card `.app-detail` de `apps.html`. Header e footer são copiados fisicamente entre as duas páginas principais — qualquer alteração neles precisa ser replicada manualmente nos dois arquivos. O CSS segue ITCSS em camadas carregadas em ordem fixa no `<head>` (do mais genérico ao mais específico, idêntica nas páginas principais), com nomenclatura BEM nos componentes e todos os valores visuais como variáveis CSS em tokens. O JS é um arquivo único (`assets/js/main.js`), compartilhado por todas as páginas, com funções isoladas chamadas no `DOMContentLoaded` — funções específicas de uma página fazem guard por seletor de atributo (`data-app-directory`, `data-store-redirect`) e não fazem nada nas outras.

```
index.html (seções: hero → capabilities → apps → plugins → certificacao → sobre → contato)
apps.html  (lista de apps → detalhe centralizado por app → lojas)
ir/<slug>/ (link curto: card do app → loja no celular; desktop escolhe a loja)
    ├── assets/css/base/      → tokens, reset, estilos globais de tags
    ├── assets/css/layout/    → container, grid, header, footer
    ├── assets/css/components/→ button, nav, card, portfolio, certification, app-directory, redirect (BEM)
    ├── assets/css/utilities/ → utilitários (sempre por último no cascade)
    ├── assets/js/locales.js + i18n.js → internacionalização pt-BR/en/es (ver docs/flow/i18n.md)
    └── assets/js/main.js     → initStoreRedirect, initMobileNav, initHeader, initReveal, initCommandCopy, initShortLinkCopy, initAppDirectory, setCurrentYear
```

### Regras de dependência

- Ordem do cascade CSS é contrato (não inverter): `base/_tokens.css` → `base/_reset.css` → `base/_base.css` → `layout/*` → `components/*` → `utilities/_utilities.css`.
- Todo valor visual (cor, espaçamento, fonte, radius, sombra) vem de `var(--*)` definida em `base/_tokens.css`; nunca usar valores soltos (`24px`, `#333`) fora dos tokens.
- Toda classe reutilizável nasce como componente em `components/` com BEM (`.card`, `.card__title`, `.card--featured`); combinação de utilities repetida 3+ vezes deve virar componente.

## Features

| Feature | Caminho principal | Descrição resumida |
|---------|------------------|-------------------|
| Landing do portfólio | `index.html` + `assets/css/components/_portfolio.css` + `assets/css/components/_certification.css` | Seções em scroll: hero, capabilities, apps (4 cards com links de loja e botão "Ver todos os apps"), plugins open source, certificação (Claude Certified Architect – Foundations: card com datas e links para Credly/PDF + miniatura do certificado), sobre, contato |
| Diretório de aplicativos | `apps.html` + `assets/css/components/_app-directory.css` | Página independente com lista dos 5 apps; ao clicar em um, exibe um painel de detalhe centralizado na mesma página (ícone grande, descrição, botões Google Play/App Store, botão discreto para copiar o link curto e link de voltar) |
| Redirecionamento para as lojas | `ir/<slug>/` + `assets/js/main.js` + `assets/css/components/_redirect.css` | Cinco links curtos que detectam Android/iOS e abrem a loja correta; desktop e usuários sem JS veem o card do app com os dois botões |

_Comportamentos JS são funções isoladas dentro de `assets/js/main.js`, não módulos separados — ver "Camadas / Módulos Compartilhados"._

## Camadas / Módulos Compartilhados

| Tipo | Caminho | Responsabilidade |
|------|---------|-----------------|
| Tokens | `assets/css/base/_tokens.css` | Variáveis CSS de cor, tipografia, espaçamento, breakpoints |
| Base | `assets/css/base/_reset.css`, `_base.css` | Normalização e estilos globais de tags puras |
| Layout | `assets/css/layout/` | Primitivos estruturais: `_container.css`, `_grid.css`, `_header.css`, `_footer.css` |
| Componentes | `assets/css/components/` | Peças reutilizáveis BEM: `_button.css`, `_nav.css`, `_lang-switch.css`, `_card.css`, `_portfolio.css`, `_certification.css`, `_app-directory.css`, `_redirect.css` |
| Utilities | `assets/css/utilities/_utilities.css` | Classes utilitárias, últimas no cascade |
| JS | `assets/js/locales.js`, `assets/js/i18n.js` | Dicionários e motor de tradução (pt-BR, en, es) com seletor de idioma no header; escolha salva em `localStorage` |
| JS | `assets/js/main.js` | JS das funcionalidades, compartilhado por todas as páginas: redirecionamento de `ir/<slug>/` para a loja, nav mobile, header no scroll, reveal via IntersectionObserver, botão de copiar comando de instalação, cópia do link curto no detalhe de `apps.html`, alternância lista/detalhe de `apps.html`, ano atual |
| Imagens | `assets/img/` | Favicon, og-cover, ícones dos apps em `apps/` (a ilustração `hero-code-garden-v2.*` não é mais referenciada) |

## Configuração

| Componente | Arquivo | Responsabilidade |
|-----------|---------|-----------------|
| Servidor local | `.vscode/tasks.json` | Task `Servir portfólio`: libera a porta 4173 (`lsof -ti tcp:4173 | xargs kill`) e sobe `python3 -m http.server 4173` em background |
| Debug | `.vscode/launch.json` | Config `Portfólio AS Software`: abre Chrome em `http://localhost:4173` (F5) |
| Domínio | `CNAME` | `andresalvador.com` (GitHub Pages) |
| Deploy | `deploy.sh` | add/commit/push na `master`, aguarda build do Pages via `gh api` e confirma HTTP 200 |
| Skills Brain Flows | `sync-brain.sh` | Sincroniza skills e agentes do repo `brain-flows` para `.claude/` e `.agents/`; migra `plan/`/`flow/` da raiz para `docs/` |

## Dependências Externas Principais

| Pacote | Versão | Uso no projeto |
|--------|--------|---------------|
| Google Fonts (Manrope; DM Mono só para código) | — | Tipografia do site, carregada via `<link>` no `<head>` |
| GitHub CLI (`gh`) | — | Usado por `deploy.sh` para consultar o status do build do Pages |
| Python 3 | — | Servidor local de desenvolvimento (`http.server 4173`) |

## Observações

- Não há manifesto de dependências (sem `package.json` etc.) nem testes — projeto intencionalmente sem build.
- `images/` (na raiz) contém uma imagem solta fora de `assets/img/`; parece não referenciada pelo site.
- Header e footer de `apps.html` são cópias físicas dos de `index.html` — não há templating; qualquer alteração estrutural neles precisa ser replicada manualmente nos dois arquivos (ver `docs/flow/apps-directory.md`).
- `source_state: dirty` — no momento da análise havia modificações locais não commitadas referentes aos links de redirecionamento em `ir/<slug>/` (ver `docs/flow/store-redirect.md`).
