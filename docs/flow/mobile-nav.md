---
generated_at: 2026-08-07
source_commit: 4d1e363
source_state: dirty
verified_at: 2026-08-07
status: current
related_plans: []
---

# Flow: Navegação Mobile

> **Resumo:** Menu hambúrguer do header em telas estreitas: abre/fecha a nav com backdrop, trava o scroll do body, fecha por link, backdrop, tecla Escape ou redimensionamento para desktop.

## Visão Geral

O usuário toca no botão toggle do header (`.site-header__toggle`). O JS alterna o estado do menu aplicando classes de estado na nav, no body, no header e no backdrop, e atualiza os atributos ARIA do botão. O menu pode ser fechado por quatro caminhos: clique em qualquer link da nav, clique no backdrop, tecla Escape (que também devolve o foco ao toggle) ou resize da janela acima de 900px. A aparência aberta/fechada é inteiramente definida no CSS (`_nav.css`, `_header.css`); o JS só liga e desliga classes.

## Passo a Passo

1. **[Bootstrap]** — `assets/js/main.js` → listener `DOMContentLoaded`
   Chama `initMobileNav()` junto com as demais inits.
2. **[Setup]** — `assets/js/main.js` → `initMobileNav()`
   Seleciona `[data-nav-toggle]`, `[data-nav]`, `[data-header]` e `[data-nav-backdrop]`. Se toggle ou nav não existirem, retorna sem registrar nada. Define `setMenuState(isOpen)` e `closeMenu()`.
3. **[Gatilho principal]** — `assets/js/main.js` → listener `click` no toggle
   Inverte o estado lendo `nav.classList.contains("nav--open")` e chama `setMenuState`.
4. **[Mudança de estado]** — `assets/js/main.js` → `setMenuState(isOpen)`
   Alterna `nav--open` na nav, `nav-open` no `body` (trava o scroll via CSS), `site-header--menu-open` no header e `nav-backdrop--visible` no backdrop; atualiza `aria-expanded` e o `aria-label` ("Abrir menu"/"Fechar menu").
5. **[Fechamento por link/backdrop]** — `assets/js/main.js` → listeners em `nav.querySelectorAll("a")` e no backdrop
   Qualquer clique em link da nav ou no backdrop chama `closeMenu()`.
6. **[Fechamento por Escape]** — `assets/js/main.js` → listener `keydown` no document
   Com o menu aberto, Escape fecha o menu e move o foco de volta para o toggle.
7. **[Fechamento por resize]** — `assets/js/main.js` → listener `resize` no window
   Se `window.innerWidth > 900`, força o fechamento para não deixar o estado mobile preso ao passar para desktop.
8. **[Renderização]** — `assets/css/components/_nav.css`, `assets/css/layout/_header.css`
   As classes de estado controlam visibilidade da nav, backdrop e animação do ícone hambúrguer (definido em `index.html` como dois `<span>` dentro do toggle).

### Caminhos alternativos

- **Elementos ausentes no DOM:** se `[data-nav-toggle]` ou `[data-nav]` não existirem, `initMobileNav()` retorna cedo e nenhum listener é registrado (`assets/js/main.js`).
- **Header/backdrop ausentes:** são opcionais — acessados com optional chaining (`header?.`, `backdrop?.`) em todos os pontos.

## Arquivos Envolvidos

| Camada | Arquivo | Responsabilidade |
|--------|---------|------------------|
| Apresentação (marcação) | `index.html` | Toggle (`[data-nav-toggle]`), nav (`[data-nav]`), backdrop (`[data-nav-backdrop]`), header (`[data-header]`) |
| Comportamento | `assets/js/main.js` | `initMobileNav()` — estado do menu e todos os listeners |
| Estilo | `assets/css/components/_nav.css` | Aparência da nav e do estado `nav--open` |
| Estilo | `assets/css/layout/_header.css` | Toggle, `site-header--menu-open`, trava de scroll via `body.nav-open` |

## Regras de Negócio Relevantes

- **Breakpoint de desarme em 900px** — `assets/js/main.js`: acima de 900px de largura o menu mobile é fechado automaticamente; é o ponto de corte onde o layout desktop assume.
- **Escape devolve o foco ao toggle** — `assets/js/main.js`: decisão de acessibilidade para não perder o contexto de teclado ao fechar.

## Observações

- Não há breakpoint correspondente em `--breakpoint-*` nos tokens para o valor 900px; o número está solto no JS (única exceção à regra de valores centralizados, que cobre CSS, não JS).
