# Página independente de aplicativos (`apps.html`)

> **Objetivo:** Entregar uma segunda página HTML (`apps.html`) que lista todos os aplicativos da AS Software e, ao clicar em um deles, exibe uma seção de detalhe centralizada na própria página com dois botões de loja (Google Play e App Store).
> **Design de origem:** brainstorming desta conversa
> **Flows relacionados:** `docs/flow/project-structure.md`, `docs/flow/scroll-reveal.md`, `docs/flow/mobile-nav.md`, `docs/flow/header-scroll.md`

## Contexto

Hoje o site é uma página única (`index.html`) e os aplicativos aparecem apenas na seção `#apps`, como um grid estático de 4 `app-card` com links de texto para as lojas dentro de `.store-links`. Não existe página secundária, roteamento, sistema de tabs, modal nem qualquer estado interativo por app — o único JS que toca a seção é o `initReveal()` genérico. O usuário quer uma página dedicada, alcançável pelo menu e por um botão no fim da seção `#apps`, onde cada app possa ser aberto individualmente com destaque e uma escolha explícita entre Android e iOS.

## Design de Origem

- **Decisão aprovada:** Criar uma página nova e independente `apps.html` na raiz, com uma lista de todos os apps; ao clicar em um app, uma seção de detalhe centralizada aparece na própria página (estado da página, não overlay flutuante) com ícone grande, nome, descrição e dois botões (Google Play / App Store), mais um link "voltar" para a lista.
- **Alternativas descartadas:**
  - Toggle grade/lista dentro da seção `#apps` da `index.html` — descartado porque o usuário quer uma página nova, independente da landing.
  - Modal overlay centralizado (`--z-modal`) — descartado; o usuário escolheu explicitamente "seção de detalhe na mesma página".
- **Tipo de mudança:** UI-only

> Sem fases de teste automatizado: o projeto não tem manifesto de dependências (`package.json` inexistente) nem harness de teste headless. A validação funcional é manual, do usuário, conforme `AGENTS.md`.

## Arquitetura / Escopo

| Arquivo | Ação | Responsabilidade |
|---------|------|-----------------|
| `assets/css/components/_app-directory.css` | criar | Componente BEM `.app-list`, `.app-list__item`, `.app-detail` e seus modificadores por app |
| `apps.html` | criar | Página independente: header/footer copiados da landing, lista dos 4 apps e 4 painéis de detalhe |
| `assets/js/main.js` | editar | Nova função `initAppDirectory()` chamada no `DOMContentLoaded`, com guard por `[data-app-directory]` |
| `index.html` | editar | Item "Todos os apps" na `nav__list` (linhas ~55–63) + botão "Ver todos os apps" após o `.app-grid` (linha ~192) + `<link>` do novo CSS na posição correta do cascade |
| `docs/flow/project-structure.md` | editar | Deixa de descrever o site como página única; registra a nova página, o novo CSS e a nova função JS |
| `docs/flow/apps-directory.md` | criar | Flow novo da feature (lista → detalhe → lojas), gerado pela skill `flow` |

### Dados dos 4 apps (fonte: `index.html` linhas 132–192)

| App | Categoria | Ícone | Wash | Google Play | App Store |
|-----|-----------|-------|------|-------------|-----------|
| Luma create | IA criativa | `assets/img/apps/luma-create.webp` | `#ddd9d2` | `https://play.google.com/store/apps/details?id=com.andre.luma_vid` | `https://apps.apple.com/br/app/luma-create-ai-studio/id6757760221` |
| CellLab + | Ciência | `assets/img/apps/celllab.webp` | `#d6ebe3` | `https://play.google.com/store/apps/details?id=com.andre.projectlab` | `https://apps.apple.com/br/app/celllab/id6499239786` |
| Flora | Bem-estar | `assets/img/apps/flora.webp` | `#f0dddd` | `https://play.google.com/store/apps/details?id=com.andre.Cycla` | `https://apps.apple.com/br/app/flora-calend%C3%A1rio-menstrual/id6789702093` |
| Salvaterra FM | Comunicação | `assets/img/apps/salvaterra-fm.webp` | `#eee0d8` | `https://play.google.com/store/apps/details?id=com.andre.radiosalvaterrafm` | `https://apps.apple.com/br/app/salvaterra-fm/id6443883925` |

Descrições (copiar literalmente de `index.html`):
- **Luma create:** "Transforma descrições em vídeos e imagens com inteligência artificial, com opções de qualidade para diferentes ideias e formatos."
- **CellLab +:** "Um laboratório digital para planejar experimentos, analisar viabilidade celular por MTT e apoiar rotinas de contagem e plaqueamento."
- **Flora:** "Acompanha ciclo, sintomas, humor e previsões de forma acolhedora, mantendo os dados pessoais armazenados no próprio dispositivo."
- **Salvaterra FM:** "Leva a programação da rádio comunitária 87,9 FM de Salvaterra, na Ilha de Marajó, para ouvintes em qualquer lugar."

### Contrato de identificadores

Os slugs abaixo amarram HTML, CSS e JS — use exatamente estes:

| App | `id` do detalhe | Modificador BEM |
|-----|-----------------|-----------------|
| Luma create | `app-detail-luma` | `--luma` |
| CellLab + | `app-detail-celllab` | `--celllab` |
| Flora | `app-detail-flora` | `--flora` |
| Salvaterra FM | `app-detail-radio` | `--radio` |

## Fases

### Fase 1 — Componente CSS `_app-directory.css`

- [x] Criar `assets/css/components/_app-directory.css` com o cabeçalho de comentário no mesmo estilo dos outros componentes (ver `_card.css`), declarando que o componente serve à página `apps.html`
- [x] Estilizar `.app-list` (container da lista) e `.app-list__item` (linha clicável: ícone pequeno + nome + categoria), usando `--app-wash` como variável local por item, no mesmo padrão de `.app-card` em `_portfolio.css` — implementado com o hex direto nos seletores `--luma`/`--celllab`/`--flora`/`--radio` compartilhados entre `.app-list__item` e `.app-detail` (sem default, já que todo uso real sempre inclui o modificador), o que também é o que reduz a 4 o total de linhas com hex
- [x] Estilizar `.app-detail` como bloco centralizado: `.app-detail__visual` (ícone grande sobre o `--app-wash`, reaproveitando o tratamento de `.app-card__visual img` — `border-radius: 22%` e `var(--shadow-md)`), `.app-detail__title`, `.app-detail__category`, `.app-detail__description`, `.app-detail__actions` (os dois botões) e `.app-detail__back`
- [x] Adicionar as regras de estado sob `.js` seguindo o precedente de `_portfolio.css:641` — `.js .app-detail { display: none; }` e `.js .app-detail.is-active { display: <valor>; }`, de modo que **sem JS** todos os detalhes permaneçam visíveis (mesmo padrão aplicado à lista com `.js .app-list.is-hidden`)
- [x] Adicionar breakpoints alinhados aos de `_portfolio.css` (1180px, 768px, 540px) para a lista e para o detalhe
- [x] Verificação: `grep -nE '#[0-9a-fA-F]{3,6}' assets/css/components/_app-directory.css` retorna **somente** as 4 linhas de `--app-wash`; nenhum outro valor visual solto (checar também `px`/`rem` fora de tokens além dos `0.0625rem` de borda e do `22%` de radius, ambos com precedente em `_portfolio.css`) — confirmado, 4 linhas com hex, demais `rem` são dimensionamento sem token dedicado, mesmo padrão de `_portfolio.css`

### Fase 2 — Página `apps.html`

- [x] Criar `apps.html` na raiz com o `<head>` espelhando `index.html` (linhas 1–41): mesmas metas base, `<title>` próprio (ex.: "Aplicativos — AS Software") e `<meta name="description">` próprio; manter a ordem exata do cascade e inserir `<link rel="stylesheet" href="assets/css/components/_app-directory.css">` **depois** de `_brain-flows.css` e **antes** de `_utilities.css`; manter o `<script>document.documentElement.classList.add("js");</script>`
- [x] Copiar o `<header class="site-header" data-header>` de `index.html` (linhas 45–74) e o `<div class="nav-backdrop">` (linha 76), trocando os `href` de âncora por `index.html#inicio`, `index.html#plugins`, `index.html#brain-flows`, `index.html#sobre`, `index.html#contato`; o item "Aplicativos" e o novo item "Todos os apps" apontam para `apps.html` (item da página atual recebe `aria-current="page"`)
- [x] Montar o `<main id="conteudo">` com `<section class="section" id="apps">` contendo `.container` e um `.collection-heading` no padrão de `index.html:124–130` (eyebrow + h1 + parágrafo de apoio)
- [x] Criar `<div class="app-list" data-app-directory>` com 4 `<a class="app-list__item app-list__item--<slug>" href="#app-detail-<slug>">` — cada um com `<img>` do ícone (`width`/`height` 512, `alt` descritivo), nome e categoria, conforme a tabela de dados
- [x] Criar os 4 `<article class="app-detail app-detail--<slug>" id="app-detail-<slug>" data-app-detail>` com ícone grande, `<h2 class="app-detail__title" tabindex="-1">`, categoria, descrição literal, `.app-detail__actions` com `<a class="btn btn--primary" ...>Google Play</a>` e `<a class="btn btn--secondary" ...>App Store</a>` (ambos `target="_blank" rel="noopener"`), e `<a class="app-detail__back" href="#apps" data-app-back>← Voltar para a lista</a>`
- [x] Copiar o `<footer class="site-footer">` de `index.html` (linhas 333–353) aplicando o mesmo ajuste de âncoras para `index.html#...`, e fechar com `<script src="assets/js/main.js"></script>` — footer já inclui o link "Todos os apps" adicionado na Fase 4
- [x] Verificação: `grep -c 'data-app-detail' apps.html` retorna `4`; `grep -n 'href="#' apps.html` mostra apenas os 4 links de detalhe, os 4 "voltar" e o skip-link — nenhuma âncora órfã apontando para seção que só existe na landing

### Fase 3 — Comportamento `initAppDirectory()`

- [x] Em `assets/js/main.js`, adicionar `initAppDirectory();` à lista do `DOMContentLoaded` (linhas 1–7), depois de `initCommandCopy()`
- [x] Implementar `function initAppDirectory()` com guard inicial `const list = document.querySelector("[data-app-directory]"); if (!list) return;` — assim a função não faz nada na `index.html`
- [x] No clique de um `.app-list__item`: `preventDefault()`, guardar o item como último gatilho, esconder a lista (classe de estado `is-hidden`), remover `is-active` de todos os `[data-app-detail]`, adicionar `is-active` ao `<article>` cujo `id` corresponde ao `href` do item, e chamar `.focus()` no `.app-detail__title` do detalhe aberto
- [x] No clique de `[data-app-back]`: `preventDefault()`, reexibir a lista, remover `is-active` de todos os detalhes e devolver o foco ao item que abriu o detalhe
- [x] Fechar/voltar também com `Escape` quando houver um detalhe ativo (checado via `list.classList.contains("is-hidden")`), reaproveitando o padrão de `initMobileNav()` (`assets/js/main.js:35–40`)
- [x] Verificação: `node --check assets/js/main.js` sai com código 0; `grep -n 'initAppDirectory' assets/js/main.js` mostra a chamada no `DOMContentLoaded` **e** a declaração da função

### Fase 4 — Entradas na landing (`index.html`)

- [x] Adicionar `<li><a href="apps.html" class="nav__link">Todos os apps</a></li>` na `nav__list` (`index.html:56–62`), logo após o item "Aplicativos"
- [x] Adicionar, imediatamente após o fechamento de `</div>` do `.app-grid` (`index.html:192`), um bloco com `<a class="btn btn--secondary" href="apps.html">Ver todos os apps <span aria-hidden="true">↗</span></a>`, marcado com `data-reveal` para acompanhar o padrão de animação da seção
- [x] Estilizar o wrapper desse botão em `_app-directory.css` (ex.: `.app-grid-footer`, centralizado, com `margin-top: var(--space-600)`), já que é o mesmo componente conceitual — não criar arquivo CSS novo
- [x] Adicionar `<link rel="stylesheet" href="assets/css/components/_app-directory.css">` no `<head>` de `index.html`, na mesma posição do cascade usada na Fase 2 (após `_brain-flows.css`, antes de `_utilities.css`)
- [x] Adicionar o link "Todos os apps" também no `.site-footer__nav` (`index.html:344`) e no footer de `apps.html`, mantendo os dois rodapés consistentes
- [x] Verificação: `grep -n 'apps.html' index.html` retorna ao menos 3 ocorrências (nav, botão da seção, footer); `grep -n '_app-directory.css' index.html apps.html` mostra a mesma posição relativa em ambos (entre `_brain-flows.css` e `_utilities.css`)

### Fase 5 — Atualizar flows

- [x] Atualizar `docs/flow/project-structure.md`: o resumo e o corpo passam a descrever duas páginas HTML (`index.html` + `apps.html`) em vez de "página única"; incluir `assets/css/components/_app-directory.css` na lista de componentes e `initAppDirectory()` na lista de funções de `assets/js/main.js`
- [x] Verificar se `docs/flow/mobile-nav.md`, `docs/flow/header-scroll.md` e `docs/flow/scroll-reveal.md` precisam registrar que os mesmos comportamentos agora rodam também em `apps.html`; atualizar apenas os que mencionarem `index.html` como escopo exclusivo — os três mencionavam `index.html` como única marcação na tabela "Arquivos Envolvidos"; atualizados para citar também `apps.html`
- [x] Criar `docs/flow/apps-directory.md` pela skill `flow`, cobrindo: entrada pela nav/botão da landing → lista em `apps.html` → clique no item → detalhe centralizado → botões de loja → voltar; incluir o fallback sem JS
- [x] Verificação: `grep -n '\*\*Resumo:\*\*' docs/flow/apps-directory.md` retorna a linha de resumo (padrão dos demais flows); `grep -n 'página única\|apps.html' docs/flow/project-structure.md` confirma que a descrição foi atualizada

## Critérios de Sucesso

- [x] `apps.html` existe na raiz e contém os 4 apps na lista e os 4 painéis de detalhe
- [x] Cada painel de detalhe tem exatamente 2 links de loja (`.btn--primary` Google Play, `.btn--secondary` App Store) com as URLs da tabela de dados
- [x] `index.html` tem 3 entradas para a nova página (nav, botão no fim do grid, footer)
- [x] `_app-directory.css` está entre `_brain-flows.css` e `_utilities.css` no `<head>` das duas páginas
- [x] `node --check assets/js/main.js` passa sem erros
- [x] Nenhum valor visual solto em `_app-directory.css` além dos 4 `--app-wash` e dos padrões já usados em `_portfolio.css`
- [x] `docs/flow/apps-directory.md` criado e `docs/flow/project-structure.md` atualizado
- [ ] _(manual — feito pelo usuário)_ Validação funcional e visual no navegador

## Riscos e Mitigações

| Risco | Probabilidade | Mitigação |
|-------|--------------|-----------|
| Header/footer duplicados fisicamente saem de sincronia entre as duas páginas | Alta | O projeto não tem templating; a Fase 4 já obriga alterar os dois footers na mesma tarefa, e o flow novo registra a duplicação como ponto de atenção |
| Âncoras copiadas (`#sobre`, `#contato`) ficarem quebradas em `apps.html` | Média | Verificação explícita da Fase 2 faz `grep` das âncoras remanescentes; todas devem apontar para `index.html#...` |
| Detalhes ficarem inacessíveis sem JS por esconder no CSS base | Média | O esconder só existe sob o seletor `.js`, seguindo o precedente de `_portfolio.css:641`; verificação da Fase 1 cobre isso |
| Ordem do cascade invertida ao inserir o novo `<link>` | Baixa | Verificação da Fase 4 compara a posição relativa nas duas páginas |

## Rollback

Apagar `apps.html` e `assets/css/components/_app-directory.css`, remover a função `initAppDirectory()` e sua chamada em `assets/js/main.js`, e reverter as adições em `index.html` (nav, botão, footer, `<link>` do CSS). Como toda a mudança é aditiva, `git checkout -- index.html assets/js/main.js && rm apps.html assets/css/components/_app-directory.css` restaura o estado anterior.

## Teste manual (responsabilidade do usuário)

Após a execução, validar no navegador:

1. Abrir `index.html` e conferir o item "Todos os apps" no menu (desktop e mobile) e o botão no fim da seção Aplicativos.
2. Navegar para `apps.html` e conferir se os 4 apps aparecem na lista com ícone, nome e categoria.
3. Clicar em cada app: a lista some, o detalhe aparece centralizado com o ícone grande sobre o wash correto do app.
4. Conferir os dois botões (Google Play e App Store) em cada detalhe — cada um abre a loja correta em nova aba.
5. Clicar em "Voltar para a lista" e pressionar `Escape` — ambos devem retornar à lista.
6. Testar responsividade nos breakpoints (largura ~1180px, ~768px, ~540px).
7. Desabilitar o JavaScript no navegador e confirmar que a lista e todos os detalhes continuam visíveis e navegáveis por âncora.
8. Conferir os links do header e do footer de `apps.html` — todos devem voltar corretamente para as seções da landing.
