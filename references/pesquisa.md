# Pesquisa e checagem de fatos

Objetivo: cada frase do vídeo (tela e voz) tem uma linha no `facts.md` com status e fonte que um jornalista conseguiria conferir em 2 minutos.

## Ordem de busca
1. **Documento-base do adversário**: plano de governo registrado no TSE (DivulgaCandContas) ou PDF republicado pela Agência Brasil. Baixe para `sources/` e extraia: `scripts/grep-doc.sh sources/plano.pdf "termo1" "termo2"`. Contagens, ausências ("0 menções") e citações literais com página saem daqui.
2. **Documento-base do Lula**: programa de governo registrado no TSE. Cite a página. Ele promete *continuidade*, não números novos; não invente meta que não está escrita.
3. **Atos oficiais**: Planalto (leis, vetos), Diário Oficial (MPs, decretos, portarias), Congresso (derrubada de veto), STF (ADI, acórdão, informativo), ministério (relatórios de execução, LOA).
4. **Dados**: IBGE/SIDRA, Tesouro, TSE (resultado), Portal da Transparência.
5. **Imprensa**: para achar o documento e dar contexto. Afirmação só com imprensa = 2 veículos independentes, e escreva "segundo X" se for interpretação.

## Armadilhas que já pegaram (cada uma mudou uma frase)
| Armadilha | Exemplo real | Regra |
|---|---|---|
| Gancho do briefing falso | "plano do Flávio para IA: zero" — o plano TEM capítulo de IA | Leia o documento antes de aceitar o gancho |
| Base do percentual | "56%" era de R$ 4,5 bi *disponíveis*, não do orçamento do FNDCT | Escreva a base ("56% do disponível no ano") |
| Palavra mais forte que a fonte | relatório diz "maior valor já registrado", não "recorde" | Use a redação literal do documento |
| Anúncio ≠ ato | "edital de R$ 1 bi" não estava no DOU; havia só anúncio | "governo anuncia" até achar o ato publicado |
| Placar inventado | "STF 11 a 0" — fontes dizem só "por unanimidade" | Não converta adjetivo em número |
| Data errada | MP 1.136 é de 29/08/2022, não 26/08 | Data do DOU/Agência Senado |
| Autor errado | bloqueio de 2022 foi do governo Jair, não do Flávio | Ponte só se estiver no documento |
| Promessa vs constatação | plano Lula fala em "continuidade do uso estratégico do FNDCT", não "sem contingenciamento" | Prometido = palavras do plano |
| Definição ampliada | "o FNDCT paga bolsa e startup" — sem fonte | Use a definição da lei (Lei 11.540/2007, art. 1º) |

## Checagem adversarial
Para cada fato que sustenta o argumento, pergunte: "como a campanha adversária desmentiria isto?" Se a resposta for "mostrando a página X", vá ler a página X. Num workflow, use 1–2 agentes verificadores com a instrução "na dúvida, CORRIGIDO ou DESCARTADO" (ver `workflow.md`).

## Formato do `facts.md`
Veja `assets/facts-template.md`. Uma tabela por bloco (contexto, plano do adversário, histórico, governo Lula), mais uma seção DESCARTADO com o motivo. A seção DESCARTADO evita que alguém reintroduza o gancho falso depois.

## Antes de publicar
- `python3 scripts/extract-strings.py final/index.html final/vo.md` → cada linha TELA/VOZ tem um id no `facts.md`.
- Fatos com uma só fonte: mantenha só se a fonte for primária; senão suavize ou tire.
- Números que mudam (pesquisa, orçamento, desemprego): reconfirme no dia do render.
