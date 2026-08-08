---
generated_at: 2026-08-08
source_commit: 689abf3
source_state: dirty
verified_at: 2026-08-08
status: current
related_plans: ["docs/plan/apps-directory-page.md"]
---

# Flow: Diretório de Aplicativos (`apps.html`)

> **Resumo:** Página independente que lista os 4 apps da AS Software e, ao clicar em um ou ao abrir com `#app-detail-<slug>` na URL, troca a lista por um painel de detalhe centralizado na própria página (ícone grande, descrição e botões de loja), sem overlay nem navegação de servidor.

## Visão Geral

O usuário chega a `apps.html` pelo item "Aplicativos"/"Todos os apps" da nav (em `index.html` ou no próprio `apps.html`), pelo botão "Ver todos os apps" no fim da seção `#apps` da landing, ou por um link direto com hash de app (`apps.html#app-detail-<slug>`), útil para linkar um app específico já com os botões de loja visíveis. A página renderiza a lista dos 4 apps (`.app-list`) e, logo depois no DOM, os 4 painéis de detalhe (`.app-detail`) — todos presentes desde o carregamento, sem fetch nem template. `initAppDirectory()`, em `assets/js/main.js`, faz o guard `[data-app-directory]` e só ativa em `apps.html`; ao clicar num item da lista, ou já na inicialização se a URL carregar com um hash de detalhe válido, esconde a lista e ativa o `.app-detail` cujo `id` casa com o alvo, movendo o foco para o título do detalhe. O detalhe mostra dois links de loja (Google Play e App Store, abrindo em nova aba) e um link "Voltar" que reexibe a lista e devolve o foco ao item que abriu o detalhe (ou não move foco nenhum, se o detalhe foi aberto direto pela URL); a tecla Escape faz o mesmo fechamento. Sem JavaScript, a classe `js` nunca é adicionada ao `<html>`, o CSS de estado (`.js .app-detail`, `.js .app-list.is-hidden`) nunca se aplica, e lista e detalhes ficam todos visíveis e navegáveis só por âncora.

## Passo a Passo

1. **[Entrada]** — `index.html` → `nav__list` e `.app-grid-footer`
   O item de nav "Todos os apps" e o botão "Ver todos os apps" no fim de `.app-grid` linkam para `apps.html`; o footer da landing também tem um link "Todos os apps".
2. **[Saída de volta à landing]** — `apps.html` → `.app-directory__back` e item de nav "Aplicativos"
   No topo do conteúdo de `apps.html`, `<a class="app-directory__back" href="index.html#apps">← Voltar para o site</a>` navega de volta à seção de apps da landing; o item de nav "Aplicativos" do header de `apps.html` também aponta para `index.html#apps` (é o único item do header que sai da página — os demais continuam apontando para outras seções de `index.html`, e "Todos os apps" aponta para o próprio `apps.html` por ser o item da página atual, com `aria-current="page"`).
3. **[Carregamento]** — `apps.html`
   Renderiza `.app-list[data-app-directory]` com 4 `.app-list__item` (âncoras `href="#app-detail-<slug>"`) seguida de 4 `<article class="app-detail" id="app-detail-<slug>" data-app-detail>`, cada um com `.app-detail__visual`, título, categoria, descrição, `.app-detail__actions` (2 botões de loja) e `.app-detail__back[data-app-back]`.
4. **[Bootstrap]** — `assets/js/main.js` → listener `DOMContentLoaded`
   Chama `initAppDirectory()` junto com as demais inits.
5. **[Setup]** — `assets/js/main.js` → `initAppDirectory()`
   Seleciona `[data-app-directory]`; se não existir (caso de `index.html`), retorna sem registrar nada. Guarda todos os `[data-app-detail]`, a variável `lastTrigger` e define `openDetail(target)`/`closeDetail()`.
6. **[Abrir detalhe por clique]** — `assets/js/main.js` → listener `click` em `.app-list__item`
   `preventDefault()`, resolve o alvo via `document.querySelector(item.getAttribute("href"))`, guarda o item em `lastTrigger` e chama `openDetail(target)`.
7. **[Abrir detalhe por URL]** — `assets/js/main.js` → fim de `initAppDirectory()`
   Se `window.location.hash` existir e casar com um `[data-app-detail]` via `document.querySelector`, chama `openDetail(target, false)` já na inicialização — sem passar por `lastTrigger` (não há item de lista para devolver foco depois) e sem reescrever a URL, que já está correta.
8. **[Efeito de `openDetail`]** — `assets/js/main.js` → `openDetail(target, updateUrl = true)`
   Adiciona `is-hidden` à lista, remove `is-active` de todos os detalhes, adiciona `is-active` ao detalhe alvo, foca `.app-detail__title` (que tem `tabindex="-1"` para ser focável via script) e, quando `updateUrl` é `true` (clique), chama `history.replaceState(null, "", "#" + target.id)` para a URL da barra de endereço passar a refletir `apps.html#app-detail-<slug>` — é o que permite copiar/compartilhar o link do app aberto.
9. **[Renderização do estado ativo]** — `assets/css/components/_app-directory.css`
   Sob `.js`, `.app-list.is-hidden` e `.app-detail` (sem `is-active`) recebem `display: none`; `.app-detail.is-active` vira `display: grid`, centralizando o painel.
10. **[Fechar detalhe]** — `assets/js/main.js` → listener `click` em `[data-app-back]` e `closeDetail()`
    `preventDefault()`, remove `is-active` de todos os detalhes, remove `is-hidden` da lista, devolve o foco ao `lastTrigger` (o item que abriu o detalhe, quando existir) e chama `history.replaceState(null, "", pathname + search)` para tirar o hash de detalhe da URL.
11. **[Fechar por Escape]** — `assets/js/main.js` → listener `keydown` no `document`
    Com a lista escondida (`list.classList.contains("is-hidden")`), Escape chama `closeDetail()` — mesmo padrão de `initMobileNav()`.
12. **[Download]** — `apps.html` → `.app-detail__actions a.btn`
    Cada painel tem exatamente 2 links (`target="_blank" rel="noopener"`): `.btn--primary` para a Google Play, `.btn--secondary` para a App Store — cada um com um ícone SVG inline (triângulo de play / maçã, ambos `fill: currentColor`) antes do texto, dimensionado por `.app-detail__actions svg` em `_app-directory.css`.

### Caminhos alternativos

- **JavaScript desabilitado:** a classe `js` nunca é adicionada ao `<html>` (script inline no `<head>` de `apps.html`), então as regras `.js .app-list.is-hidden` e `.js .app-detail`/`.app-detail.is-active` nunca se aplicam — lista e os 4 detalhes ficam todos visíveis e acessíveis diretamente pela âncora `#app-detail-<slug>`, o navegador rola até o alvo sozinho (`assets/css/components/_app-directory.css`).
- **Item de lista sem detalhe correspondente:** `document.querySelector(item.getAttribute("href"))` retornaria `null` e o handler retorna sem alterar estado — caminho defensivo, não ocorre com o contrato de slugs atual (`assets/js/main.js`).
- **URL com hash que não é de app:** `#apps`, `#conteudo` etc. não casam com `[data-app-detail]` (`target?.matches("[data-app-detail]")` falha), então a página carrega normalmente na lista (`assets/js/main.js`).
- **Voltar após abrir por URL:** como não houve `lastTrigger`, `closeDetail()` reexibe a lista sem mover o foco para nenhum item específico (`assets/js/main.js`).

## Arquivos Envolvidos

| Camada | Arquivo | Responsabilidade |
|--------|---------|------------------|
| Apresentação (marcação) | `apps.html` | Página independente: header/footer copiados de `index.html` com âncoras reapontadas, `.app-directory__back` no topo do conteúdo, `.app-list` com 4 itens e 4 `.app-detail` |
| Entrada (marcação) | `index.html` | Item de nav "Todos os apps", botão `.app-grid-footer` e link de footer que levam a `apps.html` |
| Comportamento | `assets/js/main.js` | `initAppDirectory()` — abrir/fechar detalhe, foco e Escape |
| Estilo | `assets/css/components/_app-directory.css` | `.app-list`, `.app-list__item`, `.app-detail` e o wash (`--app-wash`) por app; estados `is-hidden`/`is-active` sob `.js` |

## Regras de Negócio Relevantes

- **Contrato de slugs entre HTML e JS** — `apps.html`: o `id` de cada `.app-detail` (`app-detail-luma`, `app-detail-celllab`, `app-detail-flora`, `app-detail-radio`) precisa casar exatamente com o `href` do `.app-list__item` correspondente e com o hash usado em links diretos; é o único vínculo entre lista, detalhe e URL, não há mapeamento em JS.
- **Deep link por hash abre o detalhe direto** — `assets/js/main.js`: `apps.html#app-detail-<slug>` ativa o painel daquele app já no carregamento (lista escondida, detalhe com os botões de loja visíveis), sem exigir clique — é o mecanismo para compartilhar o link de um app específico.
- **A URL acompanha o detalhe aberto** — `assets/js/main.js`: abrir um app pela lista atualiza a URL para `#app-detail-<slug>` via `history.replaceState` (sem empilhar entrada de histórico — o botão voltar do navegador não é o mecanismo de fechar, é `.app-detail__back`/Escape); fechar o detalhe remove o hash da URL. Sem isso, copiar a URL depois de um clique devolvia só `apps.html`, sem apontar para o app aberto.
- **Foco move para o título ao abrir o detalhe** — `assets/js/main.js`: `.app-detail__title` recebe `tabindex="-1"` só para ser alvo de `.focus()` programático, decisão de acessibilidade equivalente ao Escape de `initMobileNav()` devolvendo foco ao toggle.
- **Conteúdo nunca depende de JS para existir** — `assets/css/components/_app-directory.css`: o esconder de lista/detalhe só existe sob `.js`, mesmo precedente de `_portfolio.css` para `[data-reveal]`.

## Observações

- Header e footer de `apps.html` são cópias físicas dos de `index.html` (sem templating); qualquer mudança estrutural neles precisa ser replicada manualmente nos dois arquivos, senão os dois ficam fora de sincronia.
- Em `apps.html`, "Aplicativos" (nav) e `.app-directory__back` levam de volta a `index.html#apps`; "Todos os apps" (nav) aponta para o próprio `apps.html` com `aria-current="page"`, por ser o item da página atual — não há mais dois itens de nav auto-referenciados sem saída, como numa versão anterior desta página.
