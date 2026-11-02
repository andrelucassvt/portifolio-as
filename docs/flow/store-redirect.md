---
generated_at: 2026-10-17
source_commit: 1826d89
source_state: dirty
verified_at: 2026-10-17
status: current
related_plans: []
---

# Flow: Redirecionamento Inteligente para as Lojas (`ir/<slug>/`)

> **Resumo:** Links curtos por aplicativo que detectam Android e iOS no navegador e redirecionam para a loja correta; no desktop, ou sem JavaScript, o card do app permanece visível com os dois botões.

## Visão Geral

Cada app tem um link curto próprio em `ir/<slug>/` (`luma`, `celllab`, `flora`, `salvaterra`, `arrow-army`). A página é uma cópia enxuta do card `.app-detail` de `apps.html`, marcada com `data-store-redirect` e com dois links de loja identificados por `data-store="android"` e `data-store="ios"`. `initStoreRedirect()`, em `assets/js/main.js`, lê o User-Agent assim que o `DOMContentLoaded` dispara: Android vai para o Google Play, iPhone/iPad vai para a App Store e qualquer outra plataforma (desktop, aparelho não identificado) não é redirecionada — o card continua na tela com os dois botões. O redirecionamento usa `window.location.replace()`, então a página do link curto não fica no histórico do navegador. Sem JavaScript, a classe `js` nunca é adicionada ao `<html>`, o card aparece normalmente e os dois links de loja funcionam como navegação comum.

## Passo a Passo

1. **[Entrada]** — link externo (`https://andresalvador.com/ir/<slug>/`)
   O link é compartilhado em bio, anúncio ou QR code, ou copiado pelo botão "Copiar link" no detalhe do app em `apps.html`; o GitHub Pages serve `ir/<slug>/index.html` (a URL sem barra final redireciona para a versão com barra).
2. **[Carregamento]** — `ir/<slug>/index.html`
   Renderiza `<article class="app-detail app-detail--<slug> is-active" data-store-redirect>` com ícone, nome, categoria, descrição, dois links de loja (`data-store="android"` e `data-store="ios"`) e o link "Ver detalhes no site" para `../../apps.html#app-detail-<id>`.
3. **[Bootstrap]** — `assets/js/main.js` → listener `DOMContentLoaded`
   Chama `initStoreRedirect()` antes das demais funções.
4. **[Guard]** — `assets/js/main.js` → `initStoreRedirect()`
   Seleciona `[data-store-redirect]`; se não existir (caso de `index.html`, `apps.html`), retorna sem registrar nada.
5. **[Detecção de plataforma]** — `assets/js/main.js` → `initStoreRedirect()`
   `isAndroid` casa `/Android/i` no `navigator.userAgent`. `isIOS` casa `/iPhone|iPad|iPod/i` ou o caso do iPadOS 13+, que se apresenta como `Macintosh` e é identificado por `navigator.maxTouchPoints > 1`.
6. **[Redirecionamento]** — `assets/js/main.js` → `initStoreRedirect()`
   Com plataforma reconhecida, busca o link `[data-store="android"]` ou `[data-store="ios"]` dentro do card e chama `window.location.replace(link.href)` — a loja substitui a entrada atual, sem criar histórico.
7. **[Desktop / plataforma desconhecida]** — `assets/js/main.js` → `initStoreRedirect()`
   Sem Android ou iOS, a função retorna sem navegar; o card permanece visível e o usuário escolhe entre Google Play e App Store.
8. **[Fallback sem JavaScript]** — `ir/<slug>/index.html`
   O script inline do `<head>` não adiciona `js` ao `<html>`, então `.js .app-detail { display: none; }` não se aplica; o card e os dois links de loja ficam visíveis e navegáveis.
9. **[Volta ao site]** — `ir/<slug>/index.html` → `.app-detail__back`
   O link "Ver detalhes no site" leva a `apps.html#app-detail-<id>`, reutilizando o painel de detalhe já existente.

### Caminhos alternativos

- **iPadOS 13+:** o User-Agent diz `Macintosh`, mas `navigator.maxTouchPoints > 1` identifica o tablet e envia para a App Store (`assets/js/main.js`).
- **Desktop:** nenhum redirecionamento; o card com os dois botões é a página final (`ir/<slug>/index.html`).
- **JavaScript desabilitado:** os dois links de loja aparecem no card e funcionam normalmente (`ir/<slug>/index.html`).
- **“Solicitar site para desktop” no celular:** o User-Agent deixa de identificar Android/iOS; a página não redireciona e mostra os dois botões (`assets/js/main.js`).
- **Plataforma não mapeada:** qualquer outro sistema cai no mesmo fallback de desktop (`assets/js/main.js`).

## Arquivos Envolvidos

| Camada | Arquivo | Responsabilidade |
|--------|---------|------------------|
| Apresentação (marcação) | `ir/luma/index.html`, `ir/celllab/index.html`, `ir/flora/index.html`, `ir/salvaterra/index.html`, `ir/arrow-army/index.html` | Card do app, links de loja com `data-store`, link para o detalhe em `apps.html`, meta `noindex` e OG tags por app |
| Comportamento | `assets/js/main.js` | `initStoreRedirect()` — detecção de Android/iOS/iPadOS e `location.replace` |
| Estilo | `assets/css/components/_redirect.css` | Centraliza o card na viewport e zera o padding vertical do `.app-detail` |
| Estilo (reuso) | `assets/css/components/_app-directory.css` | `.app-detail`, `.app-detail__visual`, `.app-detail__title`, `.app-detail__actions` e o wash por app |
| Destino | `apps.html` | Painel de detalhe aberto por `#app-detail-<slug>` a partir de "Ver detalhes no site" |

## Regras de Negócio Relevantes

- **Contrato de slugs dos links curtos** — cada pasta `ir/<slug>/` tem um app fixo e um `data-store` para cada loja; o mapa atual é:

  | Link curto | App | Detalhe em `apps.html` |
  |---|---|---|
  | `/ir/luma/` | Luma create | `#app-detail-luma` |
  | `/ir/celllab/` | CellLab + | `#app-detail-celllab` |
  | `/ir/flora/` | Flora | `#app-detail-flora` |
  | `/ir/salvaterra/` | Salvaterra FM | `#app-detail-radio` |
  | `/ir/arrow-army/` | Arrow Army | `#app-detail-arrow-army` |

- **URLs de loja duplicadas de `apps.html`** — cada página de redirecionamento repete o link Google Play e o link App Store do app; qualquer mudança de URL precisa ser feita nos dois lugares, senão o link curto e o diretório divergem.
- **Redirecionamento sem entrada no histórico** — `window.location.replace()` troca a página atual pela loja; o botão voltar do navegador não retorna ao link curto, evitando um ciclo de redirecionamento.
- **Desktop nunca é redirecionado** — sem plataforma reconhecida, a função não navega; o card com os dois botões é o fallback explícito.
- **Conteúdo nunca depende de JS para existir** — o esconder do `.app-detail` só existe sob `html.js`; sem JavaScript o card e os links de loja ficam visíveis, mesmo precedente de `apps.html`.
- **`noindex, nofollow`** — as páginas de redirecionamento não devem competir com `apps.html` nos buscadores; as OG tags existem apenas para preview em redes sociais.

## Dependências Externas

- `navigator.userAgent` e `navigator.maxTouchPoints` (APIs nativas do navegador) para a detecção de plataforma.
- `window.location.replace` (API nativa) para o redirecionamento.
- Google Fonts (Manrope; DM Mono só para código) — mesma dependência de CDN das páginas principais.

## Observações

- O GitHub Pages é estático: não há detecção de User-Agent no servidor, então a decisão acontece sempre no navegador. Bots de preview que não executam JavaScript leem o título/OG da página, mas não são redirecionados.
- O redirecionamento depende de o JavaScript rodar após o `DOMContentLoaded`; em conexões lentas pode haver um breve flash do card antes de a loja abrir. O fallback manual continua visível durante esse intervalo.
- **Navegador interno do Instagram/Facebook:** o User-Agent normalmente informa iPhone/Android e o redirecionamento acontece; se o webview bloquear a navegação automática, o card com os dois botões permanece como fallback.
- As cinco páginas são cópias físicas de um mesmo template, sem templating; mudanças estruturais no card precisam ser replicadas nas cinco (e conferidas com o card de `apps.html`).
- `ir/salvaterra/` usa um slug mais legível que o id interno `#app-detail-radio`; o vínculo entre os dois é feito apenas pelo link "Ver detalhes no site".
