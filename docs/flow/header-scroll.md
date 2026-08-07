---
generated_at: 2026-08-07
source_commit: 4d1e363
source_state: dirty
verified_at: 2026-08-07
status: current
related_plans: []
---

# Flow: Header Dinâmico no Scroll

> **Resumo:** O header fixo ganha a classe `is-scrolled` (fundo/sombra) assim que a página rola mais de 24px, e perde a classe ao voltar ao topo.

## Visão Geral

Ao carregar a página, `initHeader()` registra um listener de scroll que compara `window.scrollY` com o limiar de 24px e alterna a classe `is-scrolled` no elemento `[data-header]`. A função roda uma vez na inicialização para cobrir o caso de a página já carregar rolada (refresh com âncora). Todo o efeito visual (fundo sólido, sombra) é CSS em `_header.css`; o JS só liga/desliga a classe. O listener usa `{ passive: true }` para não bloquear o scroll.

## Passo a Passo

1. **[Bootstrap]** — `assets/js/main.js` → listener `DOMContentLoaded`
   Chama `initHeader()`.
2. **[Setup]** — `assets/js/main.js` → `initHeader()`
   Seleciona `[data-header]`; se não existir, retorna sem registrar nada.
3. **[Estado inicial]** — `assets/js/main.js` → `syncHeader()`
   Executada imediatamente: aplica `is-scrolled` se a página já carregar com `scrollY > 24`.
4. **[Gatilho de scroll]** — `assets/js/main.js` → listener `scroll` no window (`passive: true`)
   A cada evento de scroll, `syncHeader()` alterna `is-scrolled` conforme `window.scrollY > 24`.
5. **[Renderização]** — `assets/css/layout/_header.css`
   A classe `is-scrolled` ativa o estilo de header rolado (fundo/sombra) via CSS.

### Caminhos alternativos

- **Header ausente no DOM:** `initHeader()` retorna cedo e nenhum listener é registrado (`assets/js/main.js`).

## Arquivos Envolvidos

| Camada | Arquivo | Responsabilidade |
|--------|---------|------------------|
| Apresentação (marcação) | `index.html` | `<header class="site-header" data-header>` |
| Comportamento | `assets/js/main.js` | `initHeader()` — limiar de scroll e alternância da classe |
| Estilo | `assets/css/layout/_header.css` | Estilo do header e do estado `is-scrolled` |

## Regras de Negócio Relevantes

- **Limiar de 24px** — `assets/js/main.js`: abaixo de 24px de scroll o header permanece no estado inicial (transparente); acima, ganha o estilo de leitura sobre conteúdo.

## Observações

- O limiar 24px é um valor solto no JS, assim como o breakpoint 900px da nav mobile — os tokens CSS não cobrem constantes de comportamento.
