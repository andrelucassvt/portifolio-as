---
generated_at: 2026-08-07
source_commit: 4d1e363
source_state: dirty
verified_at: 2026-08-07
status: current
related_plans: []
---

# Flow: Animações de Reveal no Scroll

> **Resumo:** Elementos marcados com `data-reveal` entram na tela com animação conforme o scroll, via IntersectionObserver; com `prefers-reduced-motion` ou sem suporte ao observer, tudo aparece imediatamente sem animação.

## Visão Geral

O `index.html` marca blocos animáveis com o atributo `data-reveal` (conteúdo do hero, capabilities, cards de apps e plugins, seções sobre e contato). No carregamento, `initReveal()` observa esses elementos com um `IntersectionObserver`: quando um elemento cruza o limiar de visibilidade, recebe a classe `is-visible` (que dispara a transição CSS) e deixa de ser observado — a animação acontece uma única vez por elemento. Dois fallbacks garantem que o conteúdo nunca fique invisível: usuários com `prefers-reduced-motion: reduce` e navegadores sem `IntersectionObserver` recebem `is-visible` em todos os elementos imediatamente. Além disso, um script inline no `<head>` adiciona a classe `js` ao `<html>`, permitindo ao CSS esconder os elementos apenas quando JS está disponível.

## Passo a Passo

1. **[Marcação]** — `index.html`
   Elementos animáveis recebem `data-reveal`; script inline no `<head>` adiciona `document.documentElement.classList.add("js")` antes do CSS aplicar o estado inicial escondido.
2. **[Bootstrap]** — `assets/js/main.js` → listener `DOMContentLoaded`
   Chama `initReveal()`.
3. **[Setup]** — `assets/js/main.js` → `initReveal()`
   Seleciona todos os `[data-reveal]`; se não houver nenhum, retorna.
4. **[Fallback de acessibilidade/suporte]** — `assets/js/main.js` → `initReveal()`
   Se `prefers-reduced-motion: reduce` estiver ativo ou `IntersectionObserver` não existir, adiciona `is-visible` em todos os elementos e encerra — sem observer, sem animação.
5. **[Observação]** — `assets/js/main.js` → `IntersectionObserver` (`rootMargin: "0px 0px -8%"`, `threshold: 0.08`)
   Cada elemento é observado; o observer dispara quando pelo menos 8% do elemento está visível, com margem inferior de -8% (revela um pouco antes de entrar totalmente na viewport).
6. **[Reveal]** — `assets/js/main.js` → callback do observer
   Para cada entry intersectando: adiciona `is-visible` e chama `observer.unobserve(entry.target)` — o elemento anima uma vez e não é mais observado.
7. **[Renderização]** — `assets/css/utilities/_utilities.css`
   As classes de estado (`data-reveal` escondido sob `html.js`, `is-visible` visível) definem a transição de entrada.

### Caminhos alternativos

- **`prefers-reduced-motion: reduce`:** todos os elementos ficam visíveis imediatamente, sem animação (`assets/js/main.js`).
- **Navegador sem IntersectionObserver:** mesmo fallback — visível imediato (`assets/js/main.js`).
- **JS desabilitado:** a classe `js` nunca é adicionada ao `<html>`, então o CSS não esconde os elementos — o conteúdo aparece estático (`index.html`).

## Arquivos Envolvidos

| Camada | Arquivo | Responsabilidade |
|--------|---------|------------------|
| Apresentação (marcação) | `index.html` | Atributos `data-reveal` nos blocos e script inline que adiciona a classe `js` |
| Comportamento | `assets/js/main.js` | `initReveal()` — observer, limiares e fallbacks |
| Estilo | `assets/css/utilities/_utilities.css` | Estados inicial/escondido e `is-visible` com a transição |

## Regras de Negócio Relevantes

- **Animação única por elemento** — `assets/js/main.js`: `unobserve` após o reveal impede re-animação ao rolar de volta; o reveal é um evento de primeira visualização.
- **Acessibilidade antes da animação** — `assets/js/main.js`: `prefers-reduced-motion` desativa completamente o mecanismo, não apenas suaviza.
- **Conteúdo nunca depende de JS para aparecer** — `index.html`: o estado escondido só existe sob `html.js`; sem JavaScript a página é totalmente visível.

## Dependências Externas

- `IntersectionObserver` (API nativa do navegador), com fallback explícito quando indisponível.

## Observações

- Nenhuma observação relevante — os três fallbacks (reduced-motion, sem observer, sem JS) cobrem os caminhos de degradação.
