---
generated_at: 2026-08-07
source_commit: 51bd88f
source_state: dirty
verified_at: 2026-08-07
status: current
related_plans: []
---

# Flow: Seção Brain Flows

> **Resumo:** A seção `#brain-flows` apresenta o repositório Brain Flows, lista suas cinco skills e permite copiar o comando de instalação sem depender de JavaScript para exibir o conteúdo.

## Visão Geral

A navegação interna, o rodapé e o conteúdo principal de `index.html` apontam para a seção `#brain-flows`. Dentro dela, um card apresenta o repositório e o comando de instalação, enquanto uma lista ordenada descreve as cinco skills do workflow.

O stylesheet do componente define a grade de duas colunas em telas largas e a converte em uma única coluna `minmax(0, 1fr)` até 1024px para que o card e a lista não ultrapassem a largura disponível. Em telas até 540px, o card reduz o espaçamento interno, o comando passa a empilhar código e botão e o próprio comando quebra em várias linhas em vez de ser cortado com reticências.

Quando o DOM termina de carregar, `main.js` ativa o botão de cópia. O conteúdo permanece utilizável sem JavaScript: o comando continua visível e o link do GitHub segue acessível; apenas o botão de copiar fica oculto sem a classe `js` no elemento raiz.

## Passo a Passo

1. **Estrutura da página** — `index.html` → seção `#brain-flows`
   Carrega o stylesheet do componente na ordem do cascade e renderiza o destaque do repositório, o comando, o link externo e a lista das cinco skills.
2. **Layout responsivo** — `assets/css/components/_brain-flows.css` → `.brain-layout`
   Organiza o destaque e a lista em duas colunas acima de 1024px; no breakpoint, usa uma única coluna `minmax(0, 1fr)` — o mínimo explícito impede que o `min-content` do comando (que usa `white-space: nowrap`) estique a coluna e provoque rolagem horizontal na página.
3. **Ajustes compactos** — `assets/css/components/_brain-flows.css` → regras até 540px
   Reduz o padding do destaque, aplica o token tipográfico compacto ao título, empilha os elementos de `.brain-command` e libera a quebra do comando com `white-space: normal` e `overflow-wrap: anywhere`.
4. **Inicialização de comportamentos** — `assets/js/main.js` → `DOMContentLoaded`
   Chama `initReveal()` para os elementos marcados com `data-reveal` e `initCommandCopy()` para o botão identificado por `data-copy`.
5. **Cópia do comando** — `assets/js/main.js` → `initCommandCopy()`
   Obtém o texto do `code` dentro de `.brain-command`, tenta copiá-lo com a Clipboard API e, se ela falhar, usa um `textarea` temporário como alternativa; em seguida, atualiza o rótulo para “Copiado” por 1,6 segundo.

### Caminhos alternativos

- **JavaScript indisponível:** `assets/css/components/_brain-flows.css` mantém `.brain-command__copy` oculto, mas o comando e o link do GitHub permanecem visíveis.
- **Clipboard API indisponível ou com falha:** `assets/js/main.js` cria um `textarea` temporário e executa `document.execCommand("copy")` como alternativa.
- **Movimento reduzido ou `IntersectionObserver` indisponível:** `assets/js/main.js` adiciona `is-visible` a todos os elementos com `data-reveal`, sem aguardar a rolagem.

## Arquivos Envolvidos

| Camada | Arquivo | Responsabilidade |
|--------|---------|------------------|
| Apresentação | `index.html` | Declara a seção, o comando, a lista de skills e os links internos e externos. |
| Estilo | `assets/css/components/_brain-flows.css` | Define o componente BEM, seus estados visuais e a adaptação responsiva. |
| Tokens | `assets/css/base/_tokens.css` | Centraliza o token `--fs-650` usado pelo título compacto do destaque. |
| Estilo compartilhado | `assets/css/components/_portfolio.css` | Aplica o estado visual dos elementos com `data-reveal` quando JavaScript está disponível. |
| Interação | `assets/js/main.js` | Revela os elementos conforme o scroll e copia o comando quando solicitado. |

## Regras de Negócio Relevantes

Nenhuma regra de negócio relevante além do controle de fluxo padrão.

## Dependências Externas

- **Clipboard API do navegador** — usada por `assets/js/main.js` para copiar o comando de instalação quando disponível.
- **GitHub** — destino do link externo para o repositório Brain Flows em `index.html`.

## Observações

- A seção não consulta API nem persiste dados; a interação de cópia acontece inteiramente no navegador.
- O botão de cópia é uma melhoria progressiva: o conteúdo essencial continua acessível sem JavaScript.
