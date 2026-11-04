---
generated_at: 2026-11-04
status: current
related_plans: []
---

# Flow: Seção Certificação

> **Resumo:** A seção `#certificacao` apresenta a certificação Claude Certified Architect – Foundations (Anthropic), com datas de emissão/validade, link de verificação no Credly, o PDF do certificado e uma miniatura clicável. É totalmente estática.

## Visão Geral

O menu principal e o rodapé de `index.html` e `apps.html` apontam para `#certificacao` (rótulo traduzido por `nav.certification`). Dentro da seção, um `.collection-heading` introduz a credencial e o `.cert-layout` divide o conteúdo em duas colunas: o card com os dados (`.cert-card`) e a miniatura do certificado (`.cert-preview`). Abaixo de 1024px vira uma coluna só.

Não há JavaScript próprio: o conteúdo é visível sem JS; apenas o reveal (`data-reveal`) e as traduções dependem dos scripts globais.

## Passo a Passo

1. **Estrutura** — `index.html` → `<section id="certificacao" class="section cert-section">`
   Heading, card com `<dl>` (datas em `<time datetime>`), links para o Credly e o PDF, e `<figure>` com a imagem linkando o PDF.
2. **Estilo** — `assets/css/components/_certification.css`
   Grade de duas colunas, card no padrão visual dos destaques do site, miniatura com sombra/hover (sem translação sob `prefers-reduced-motion`).
3. **Tradução** — `assets/js/locales.js` → chaves `cert.*` e `nav.certification` nos três idiomas; datas também são traduzidas (`cert.issuedDate`, `cert.expiresDate`).
4. **Reveal** — `assets/js/main.js` → `initReveal()` revela heading, card e miniatura ao rolar.

## Arquivos Envolvidos

| Camada | Arquivo | Responsabilidade |
|--------|---------|------------------|
| Apresentação | `index.html` | Seção, links de nav/rodapé |
| Apresentação | `apps.html` | Links de nav/rodapé para `index.html#certificacao` |
| Estilo | `assets/css/components/_certification.css` | Componente BEM `cert-*` |
| Conteúdo | `assets/docs/claude-certified-architect-foundations.pdf` | Certificado original |
| Conteúdo | `assets/img/claude-certified-architect.webp` | Miniatura (1400×1082) gerada do PDF |
| i18n | `assets/js/locales.js` | Textos `cert.*` |

## Regras de Negócio Relevantes

- A certificação vence em **09/06/2027**: ao renovar, atualizar datas (HTML + `cert.issuedDate`/`cert.expiresDate` nos três idiomas), o PDF, a miniatura e o link do Credly.

## Dependências Externas

- **Credly** — verificação pública do badge (`credly.com/badges/d67f6bad-02b7-4066-bd5b-c00840197a53`).
