# Banco de fatos — checado em 07/10/2026 (reel "grep FNDCT", público TI)

Reaproveite com a fonte. Números de orçamento/execução mudam: reconfirme no dia. Um fato aqui não autoriza frase mais forte que a coluna "Fato".

Status: VERIFICADO (fonte primária ou 2+ veículos) · CORRIGIDO → VERIFICADO · DESCARTADO

## Contexto
| id | Fato | Status | Fonte |
|----|------|--------|-------|
| C1 | 1º turno 4/out/2026: Flávio 47,03% × Lula 45,16% dos válidos; 2º turno em 25/out/2026 | VERIFICADO (2 fontes) | TSE notícia 05/10/2026; CartaCapital "TSE encerra apuração do 1º turno" |

## Plano de governo do Flávio ("Para o Brasil Vencer o Atraso", 2027–2030)
Fonte primária: PDF publicado pela Agência Brasil — https://agenciabrasil.ebc.com.br/sites/default/files/atoms/files/diretrizesplanodegovernoflaviobolsonaro20272030versaofinal.pdf (cópia em sources/, texto extraído com pdftotext)
| id | Fato | Status | Evidência |
|----|------|--------|-----------|
| F1 | A palavra "FNDCT" aparece 0 vezes no plano | VERIFICADO | `grep -ci fndct sources/plano-flavio-2027-2030.txt` → 0 |
| F2 | Plano promete "uma regra clara de controle de gastos discricionários dos três Poderes da União" | VERIFICADO | txt linha 2666; PDF p. 71 |
| F3 | Plano não fixa nenhum valor em R$ para ciência/pesquisa (único R$ de investimento: R$ 900 bi em infraestrutura) | VERIFICADO | grep "R\$" no txt; R$ 900 bi na linha 1910, PDF p. 51 |
| F4 | Plano TEM capítulo de IA (Estratégia Nacional de IA p/ MPEs, data centers, ClarIA) | VERIFICADO | txt p.25 e p.56 — NÃO dizer "ele não tem plano de IA" |
| F5 | Plano cita o Wi-Fi Brasil do governo Jair Bolsonaro como modelo a continuar ("dando continuidade ao trabalho que, no governo Bolsonaro, já havia conectado…") | VERIFICADO | Teletime 17/08/2026; txt linhas 893–897, PDF p. 24 |

## Definição
| id | Fato | Status | Fonte |
|----|------|--------|-------|
| D1 | FNDCT: fundo federal com "o objetivo de financiar a inovação e o desenvolvimento científico e tecnológico" (Lei 11.540/2007, art. 1º); a Finep é a Secretaria-Executiva (art. 7º). Tela: "o fundo federal que financia pesquisa e inovação no Brasil" + "Gerido pela Finep". NÃO dizer "paga bolsa" nem "startup" (sem linha verificada) | VERIFICADO (texto da lei) | Lei 11.540/2007 · https://www2.camara.leg.br/legin/fed/lei/2007/lei-11540-12-novembro-2007-562962-publicacaooriginal-87065-pl.html |

## Histórico governo Jair Bolsonaro (2019–2022)
| id | Fato | Status | Fonte |
|----|------|--------|-------|
| B1 | Jun/2022: governo Bolsonaro bloqueou R$ 2,5 bi do FNDCT, 56% do disponível (base: R$ 4,5 bi disponíveis em 2022; nunca "56% do orçamento"; bloqueio executado 27/05, divulgado em junho) | VERIFICADO | Folha/A Gazeta 27/06/2022; MCTI · https://www.agazeta.com.br/brasil/governo-federal-bloqueia-r-25-bilhoes-do-financiamento-da-ciencia-0622 · https://revistapesquisa.fapesp.br/wp-content/uploads/2022/06/040-041_cortes_317.pdf · https://tecnoblog.net/noticias/governo-federal-bloqueia-r-25-bilhoes-do-orcamento-de-pesquisas-cientificas/ · https://www.gov.br/mcti/pt-br/acompanhe-o-mcti/fndct/paginas/documentos-1/20222trimestre.pdf |
| B2 | MP 1.136 (29/ago/2022) limitou o FNDCT a R$ 5,55 bi em 2022 (data corrigida: 29/08, não 26/08; R$ 9 bi na LOA só via nota das entidades; desfecho da MP não verificado) | CORRIGIDO → VERIFICADO | Agência Senado 29/08/2022; MP 1.136/2022 · https://www12.senado.leg.br/noticias/materias/2022/08/29/mp-editada-nesta-segunda-feira-impoe-limites-para-aplicacao-de-recursos-do-fndct · https://www12.senado.leg.br/orcamento/documentos/estudos/tipos-de-estudos/notas-tecnicas-de-adequacao-orcamentaria-e-financeira/analise-da-mpv-no-1136-de-29-de-agosto-de-2022 · https://noticias.portaldaindustria.com.br/posicionamentos/cni-alerta-para-o-risco-da-mp-que-retira-recursos-para-pesquisa-e-inovacao/ · https://legado.anped.org.br/sites/default/files/images/nota_governo-sacrifica-a-ciencia-brasileira1_set_2022.pdf |
| B3 | Mar/2021: Bolsonaro vetou integralmente a lei de internet p/ 14 mi de alunos e 1,5 mi professores da rede pública (R$ 3,5 bi). Congresso derrubou o veto (jun/2021) → Lei 14.172/2021. Governo foi ao STF (ADI 6926) e perdeu por unanimidade (jul/2022; plenário virtual até 01/07, acórdão 08/07; relator Toffoli). Usar "por unanimidade", NÃO "11×0" | VERIFICADO (4 fontes) | Migalhas; Congresso em Foco; ConJur; Teletime 08/07/2022 · https://teletime.com.br/08/07/2022/governo-e-derrotado-e-stf-declara-constitucional-destinacao-de-r-35-bi-a-educacao/ · https://www.migalhas.com.br/quentes/370164/stf-valida-lei-que-obriga-uniao-a-custear-internet-na-rede-publica · https://informativos.trilhante.com.br/julgados/stf-adi-6926-df · https://juris.damasio.com.br/jurisprudencia/julgado/1061/covid-19-educacao-e-transferencia-de-recursos-para-acesso-a-internet |

## Governo Lula (2023–2026)
| id | Fato | Status | Fonte |
|----|------|--------|-------|
| L1 | Jan/2023: reversão do bloqueio do FNDCT anunciada pela ministra Luciana Santos | VERIFICADO | Metrópoles |
| L2 | LOA 2025: R$ 14,7 bi para o FNDCT, 16% acima de 2024 (base: LOA 2024 R$ 12,7 bi, não a arrecadação; R$ 2,97 bi vetados/remanejados em abr/2025) | VERIFICADO | MCTI/Finep mar. 2025 · https://abcdoabc.com.br/comissao-do-congresso-aprova-aumento-de-r-2-bilhoes-no-orcamento-do-fndct-para-2025/ · https://www.gov.br/mcti/pt-br/acompanhe-o-mcti/fndct/paginas/ct-infra/Atada48Reunio1RECTInfra09.04.2025.pdf · https://convergenciadigital.com.br/tag/fndct/ |
| L3 | 2025: FNDCT pagou R$ 7 bi (R$ 7.005,1 mi não reembolsáveis), "maior valor já registrado" (redação literal; não usar "recorde" na tela) | VERIFICADO | MCTI, Relatório FNDCT 4º tri 2025 · https://www.gov.br/mcti/pt-br/acompanhe-o-mcti/fndct/paginas/documentos-1/20254TrimestreRelatrioGerencial.pdf |
| L4 | Plano Brasileiro de IA (PBIA, "IA para o Bem de Todos"): R$ 23 bi, 2024–2028 | VERIFICADO (MCTI slides + Exame + TecMundo) | MCTI apresentação Câmara 27/08/2025 |
| L5 | Ago/2026: governo anuncia supercomputador de IA de R$ 1 bi no RN (Macaíba, Parque Augusto Severo/UFRN, operação LNCC; recursos do FNDCT). Edital no DOU NÃO confirmado: dizer "anuncia", não "edital" | CORRIGIDO → VERIFICADO | Agência Brasil; Convergência Digital 20/08/2026 · https://www.acessa.com/economia/2026/08/337560-rn-vai-abrigar-supercomputador-brasileiro-de-inteligencia-artificial.html · https://convergenciadigital.com.br/governo/governo-lula-lanca-edital-de-compra-de-supercomputador-para-ia-com-custo-de-r-106-bilhao/ · https://www.baguete.com.br/noticias/brasil-investe-r-1-bi-em-supercomputador |
| L6 | Isenção de IR até R$ 5 mil/mês em vigor desde jan/2026 (Lei 15.270/2025) | VERIFICADO | Congresso em Foco; Lei 15.270 |
| L7 | Plano de Lula 2027–2030, p. 50: "Asseguraremos ainda a continuidade do uso estratégico do FNDCT…" (promessa = continuidade; "sem contingenciamento" é constatação do passado, não compromisso) | CORRIGIDO → VERIFICADO | Programa de Governo Lula 2027-2030 (TSE), p. 50 · https://static.congressoemfoco.com.br/2026/08/08/attachment/2026/08/08/32ce89_programa_governo_lula_2026.pdf · https://www.congressoemfoco.com.br/noticia/121121/pt-registra-novo-plano-de-governo-de-lula-no-tse-veja-a-integra |

## DESCARTADO (do briefing original — não usar)
- "Votar no Flávio = salário −50%" → sem base.
- "Plano do Flávio pra IA: zero" → FALSO (ver F4).
- "As empresas vão embora" → previsão sem dado.
