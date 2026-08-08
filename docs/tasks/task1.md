# Task 1 — Refinamento visual do menu, seções e cards de aplicativos

> **Origem:** consolidação de `docs/tasks/problem-1.md` e das duas referências visuais de 07/08/2026.
>
> **Objetivo:** reduzir elementos decorativos que competem com o conteúdo, dar mais equilíbrio à transição de cores entre seções e eliminar informações redundantes.

## Diagnóstico consolidado

| # | Problema observado | Origem no código atual | Direção de ajuste |
|---|---|---|---|
| 1 | No menu mobile, os links precisam formar um bloco visual centralizado; os contornos circulares de fundo distraem e competem com a navegação. | `.nav__list` e os pseudo-elementos `.nav::before`/`.nav::after` em `assets/css/components/_nav.css`. | Manter o menu como overlay de tela inteira, centralizar visualmente a lista e remover os dois círculos decorativos. |
| 2 | O círculo grande no início da seção de aplicativos polui a leitura entre a faixa de capacidades e o título da seção. | `.apps-section::before` em `assets/css/components/_portfolio.css`. | Remover o ornamento circular de fundo sem alterar a estrutura, o espaçamento ou o conteúdo da seção. |
| 3 | As legendas `App / 01` a `App / 04` são redundantes: o nome, a categoria e os links já identificam cada aplicativo. | Quatro elementos `.app-card__index` em `index.html` e seu estilo em `_portfolio.css`. | Excluir as quatro legendas e o CSS que ficar sem uso. |
| 4 | A mudança para o verde escuro da seção de plugins é visualmente brusca e pesada em relação ao fundo claro das seções adjacentes. | `--color-surface-dark` em `assets/css/base/_tokens.css`, aplicado por `.plugins-section`. | Preservar o matiz verde atual, mas aplicar uma versão mais translúcida/suave por meio de token; revisar contraste dos textos, bordas e cards sobre o novo fundo. |
| 5 | Nome da empresa e CNPJ aparecem na seção “Sobre” e novamente no rodapé, repetindo informações institucionais. | `.studio-facts` em `index.html`; identificação institucional no rodapé. | Remover de “Sobre” apenas os fatos `Empresa — AS Software` e `CNPJ — 55.108.099/0001-31`; manter os dois dados no rodapé. O fato `Desenvolvimento — Android, iOS & Flutter` permanece. |

## Escopo detalhado

### 1. Menu mobile

- Aplicar o ajuste somente até o breakpoint atual de navegação mobile (`900px`).
- A lista de links deve ficar centralizada no eixo horizontal e equilibrada no eixo vertical da área disponível, sem invadir visualmente a marca nem o botão de fechar.
- Remover exclusivamente os anéis decorativos gerados por `.nav::before` e `.nav::after`.
- Preservar os comportamentos existentes: abrir/fechar pelo botão, links, backdrop, `Escape` e redimensionamento; atributos ARIA e bloqueio de rolagem não fazem parte da alteração.

### 2. Ornamentos circulares de fundo

- Remover o anel de fundo da seção de aplicativos (`.apps-section::before`), visível na segunda referência.
- O pedido se refere a ornamentos de fundo, não a elementos de conteúdo. Portanto, não remover por padrão ícones SVG, o elemento gráfico da seção “Sobre” ou os anéis internos dos cards de aplicativos (`.app-card__orbit`) sem uma nova orientação visual.
- Se houver intenção de eliminar também os círculos decorativos da seção de plugins (`.plugins-section::before` e `::after`), tratar como extensão explícita deste item; eles não estão visíveis nas referências recebidas.

### 3. Cards de aplicativos

- Remover `App / 01`, `App / 02`, `App / 03` e `App / 04` de todos os cards.
- Não alterar nomes, categorias, descrições, ícones, links para as lojas ou interações de hover.
- Eliminar o seletor `.app-card__index` caso ele não tenha mais uso.

### 4. Seção de plugins

- Criar ou ajustar um token de cor para a variação suavizada do verde, em vez de introduzir uma cor literal no componente.
- O novo fundo deve derivar do mesmo verde escuro atual e deixar transparecer/sugerir o fundo claro do site, reduzindo o contraste abrupto entre seções.
- Ajustar tokens/valores dependentes somente quando necessário para conservar legibilidade. Textos, comandos, links, bordas e estados de hover devem continuar perceptíveis.
- Não alterar a hierarquia, os textos, os links ou a função dos cards de plugins.

### 5. Informações institucionais

- Manter no rodapé a identificação `André Salvador · CNPJ 55.108.099/0001-31` e a marca AS Software.
- Na seção “Sobre”, manter a biografia e o fato técnico de desenvolvimento; remover apenas a repetição de empresa e CNPJ.
- Após a remoção, adequar a grade de `.studio-facts` para que um único item não preserve colunas, separadores ou espaços vazios destinados aos três fatos anteriores.

## Arquivos com maior probabilidade de mudança

| Arquivo | Mudança esperada |
|---|---|
| `index.html` | Remover as quatro legendas de índice dos apps e os dois fatos institucionais da seção “Sobre”. |
| `assets/css/components/_nav.css` | Centralizar o menu mobile e retirar os pseudo-elementos circulares. |
| `assets/css/components/_portfolio.css` | Retirar o círculo de fundo de aplicativos, remover estilos órfãos do índice e adaptar o bloco de fatos; aplicar o fundo suavizado de plugins. |
| `assets/css/base/_tokens.css` | Declarar/ajustar o token da variação suave do verde e, se necessário, tokens de contraste relacionados. |

## Critérios de aceite

- Em viewport mobile, o menu aberto exibe os cinco links em uma composição centralizada, sem os círculos decorativos ao fundo.
- Os fluxos de abertura, fechamento e acessibilidade do menu continuam iguais aos documentados em `docs/flow/mobile-nav.md`.
- Não há círculo decorativo grande no topo da seção “Aplicativos”.
- Nenhum card de aplicativo mostra a legenda `App / NN`.
- A seção de plugins conserva o mesmo direcionamento verde, porém com aparência mais leve e uma transição menos brusca a partir das seções claras; todo o conteúdo permanece legível.
- “AS Software” e o CNPJ não aparecem como fatos na seção “Sobre”; ambos continuam disponíveis no rodapé.
- O layout permanece íntegro nas larguras desktop e mobile, sem espaços vazios ou elementos sem estilo após as remoções.

## Fora de escopo

- Alterar o conteúdo editorial, os destinos dos links ou a ordem das seções.
- Remover ícones funcionais/de conteúdo ou o desenho da seção “Sobre”.
- Redesenhar os cards de aplicativos além da retirada das legendas de índice.
- Mudar o comportamento JavaScript do menu mobile.

## Verificação manual após implementação

1. Abrir e fechar o menu em uma largura menor ou igual a 900px; verificar centralização, ausência dos círculos e fechamento por link, backdrop e `Escape`.
2. Percorrer a transição entre capacidades, aplicativos e plugins em desktop e mobile; conferir a remoção do ornamento e o equilíbrio do novo verde.
3. Conferir os quatro cards de aplicativos e a seção “Sobre”, garantindo que não restaram índices, CNPJ, nome repetido ou espaços vazios.
