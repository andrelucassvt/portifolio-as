# Portfólio AS Software — Arquitetura

Site estático, uma página só (scroll), HTML + CSS puro (sem build tools) e JS mínimo.

## Como rodar no VS Code

1. Abra a pasta do projeto no VS Code.
2. Pressione `F5`.
3. Selecione **Portfólio AS Software** caso o editor solicite uma configuração.

O VS Code inicia automaticamente um servidor local em
`http://localhost:4173` e abre o projeto no Chrome. A configuração está em
`.vscode/launch.json` e a tarefa do servidor em `.vscode/tasks.json`.

## Estrutura de pastas

```
index.html
assets/
  css/
    base/          tokens, reset, estilos globais de elemento
    layout/         container, grid, header, footer
    components/    botão, nav, card (BEM)
    utilities/     classes utilitárias pontuais
  js/
    main.js
  img/
  fonts/
```

## Ordem do cascade (importante)

O `index.html` carrega os CSS nesta ordem — não inverter:

1. `base/_tokens.css` — variáveis (cor, tipografia, espaçamento, breakpoints)
2. `base/_reset.css` — normalização
3. `base/_base.css` — estilo global de tags puras (h1, p, body...)
4. `layout/*` — primitivos estruturais (container, grid, header, footer)
5. `components/*` — peças reutilizáveis com classe própria (BEM)
6. `utilities/_utilities.css` — sempre por último, pode sobrescrever tudo

Essa ordem é baseada em ITCSS: do mais genérico pro mais específico.

## Nomenclatura (BEM)

```
.card              bloco
.card__title       elemento (parte do bloco)
.card--featured    modificador (variação do bloco)
```

Regra: toda classe reutilizável nasce como componente em `components/`. Se
uma combinação de utilities se repete 3+ vezes, ela devia virar componente.

## Tokens

Todo valor visual (cor, espaçamento, fonte, radius, sombra) vive em
`base/_tokens.css` como variável CSS. Nunca usar valores soltos
(`padding: 24px`, `color: #333`) fora dos arquivos de token — sempre
`var(--space-400)`, `var(--color-text)` etc.

Os valores atuais são placeholders. Quando a identidade visual (cores,
tipografia) for definida, trocar só os valores dentro de `:root` — o resto
do CSS não muda.

## Breakpoints

Mobile-first não é obrigatório aqui (usamos `max-width` nos exemplos), mas
os pontos de corte padrão são:

| nome | valor  |
|------|--------|
| sm   | 480px  |
| md   | 768px  |
| lg   | 1024px |
| xl   | 1280px |

## Como adicionar uma nova seção

1. Adicionar `<section id="nome" class="section">` no `index.html`, dentro de `<main>`.
2. Reaproveitar `.container`, `.section__header`, `.grid` já existentes.
3. Se precisar de um componente novo (não existe ainda), criar
   `components/_nome.css`, seguir BEM, e linkar no `<head>` do `index.html`
   respeitando a ordem do cascade.

## JS

`assets/js/main.js` é o único arquivo de JS. Cada funcionalidade é uma
função isolada (ex: `initMobileNav`), chamada dentro do
`DOMContentLoaded`. Sem dependências externas.
