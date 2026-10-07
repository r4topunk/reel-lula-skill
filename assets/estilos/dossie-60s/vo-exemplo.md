# VO — "grep FNDCT" 60 s

Voz: Gemini TTS `gemini-3.8-flash-tts`, voz **Charon** (testada contra Orus na linha do gancho; escolhida Charon e mantida em todas as batidas).
Geração: `tts/tts.sh "<texto>" raw/bN.wav Charon`. O prefixo de instrução de estilo foi DESCARTADO: o modelo o lia em voz alta (conferido com whisper, PT e EN). O tom vem da pontuação.
Pós: corte de silêncio de início/fim + `atempo` 1.12 (b1 1.08; b6 e b9 1.0). Arquivos finais em `vo/bN.wav` (44.1 kHz mono); brutos em `vo/raw/`.
Rótulo permanente na tela: "Narração com voz sintética gerada por IA (Google Gemini)" (32 px, y≈1674, acima dos 220 px de baixo).

| beat | início (s) | dur. (s, ffprobe) | texto | fatos |
|---|---|---|---|---|
| b1 HOOK | 2.00 | 3.611 | FNDCT no plano de governo do Flávio: zero. | F1 |
| b2 O QUE É | 6.20 | 6.791 | O FNDCT é o fundo federal que financia pesquisa e inovação no Brasil. No plano dele, nenhuma menção. | D1 F1 |
| b3 O QUE TEM | 13.40 | 7.207 | Capítulo de IA? Tem. Valor para ciência? Nenhum. O que tem: controle de gastos discricionários. | F4 F3 F2 |
| b4 PONTE | 21.20 | 3.071 | E o plano promete continuar um programa do governo Bolsonaro. | F5 |
| b5 HISTÓRICO | 24.80 | 10.250 | O governo Bolsonaro vetou internet para alunos da rede pública e perdeu no Supremo por unanimidade. Bloqueou dois bilhões e meio do FNDCT. Limitou o fundo por MP. | B3 B1 B2 |
| b6 SILÊNCIO | 36.30 | 2.323 | E aí veio 2023. | — |
| b7 VIRADA | 39.20 | 9.452 | Reversão do bloqueio. Orçamento de catorze vírgula sete bilhões em 2025. Maior valor já pago pelo fundo. Vinte e três bilhões no Plano Brasileiro de IA. | L1 L2 L3 L4 |
| b8 RACIONAL | 50.80 | 4.596 | Não é torcida. É o dinheiro da pesquisa e da inovação da sua área. Você decide. | (opinião) |
| b9 END | 56.00 | 2.530 | Vinte e cinco de outubro. Lula, treze. | C1 |

Total: 132 palavras (`wc -w`). Fala ≈ 49.8 s de 60 s.
