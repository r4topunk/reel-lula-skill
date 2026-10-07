---
name: reel-lula
description: Produz reels verticais (9:16, até 60 s) da campanha Lula 2026 com dados verificados, motion gráfico em HTML/JS renderizado para MP4 e narração com voz sintética (Gemini TTS). Faz pesquisa e checagem de fatos com fonte primária, contraste com o adversário (Flávio Bolsonaro) sem afirmação falsa, roteiro, narração, motion, render e legenda com fontes, e cuida das regras do TSE para conteúdo com IA. Use sempre que pedirem vídeo, reel, short, TikTok, story ou "vídeo de 1 minuto" para a campanha do Lula, para virar voto de um público (TI, professores, agro, jovens, evangélicos…), para responder a uma fake news ou para comparar Lula com o adversário usando dados — mesmo que a pessoa só cole um briefing com ganchos e diga "faz um vídeo".
---

# Reel de campanha com dados reais (Lula 2026)

Um reel aqui é **um argumento com fonte**, desenhado em código e narrado por voz sintética. A pipeline:

```
briefing → FATOS (pesquisa + checagem) → roteiro/beat sheet → 3 direções de 10 s → juiz → 60 s final
         → narração TTS por beat → render MP4 → checagem final das strings → legenda com fontes
```

Por que essa ordem: um número errado num vídeo de campanha vira munição do adversário, pedido de direito de resposta e, no limite, problema na Justiça Eleitoral. Persuasão vem de fato bem escolhido e bem mostrado, não de exagero. Os fatos vêm antes de qualquer pixel, porque o roteiro nasce do que dá para provar.

## 0. Pré-requisitos (cheque uma vez)
- `ffmpeg`, `ffprobe`, `pdftotext` (poppler), Node 20+, Google Chrome (ou `CHROME=<path>`).
- `cd <skill>/scripts && npm i` (ou `pnpm i`): instala o puppeteer-core.
- `GEMINI_API_KEY` no ambiente, com uma chave do Google AI Studio. Se não houver, pergunte onde está. Nunca imprima a chave nem a grave em arquivo do projeto.
- Pasta de trabalho: `<trabalho>/` com `brief.md`, `facts.md`, `sources/`, `d1..d3/`, `final/`, `out/`.

## 1. Fatos primeiro → `facts.md`
Leia `references/pesquisa.md` e siga esse método. O essencial:
- Copie `assets/facts-template.md`. Cada afirmação que vai para a tela ou para a voz ganha uma linha com id, texto, status (VERIFICADO · CORRIGIDO · PENDENTE · DESCARTADO) e URLs.
- **Fonte primária primeiro**: plano de governo registrado no TSE, lei no Planalto, Diário Oficial, relatório do ministério, acórdão do STF, TSE para resultado. Imprensa serve para achar o documento; sozinha, só vale com 2 veículos independentes.
- **Ganchos do briefing são hipóteses.** Briefings de campanha costumam trazer frases como "o plano dele pra IA é zero" ou "seu salário cai 50%". Cheque cada uma. Se for falsa ou sem base, descarte e proponha um gancho verdadeiro com o mesmo impacto. Exemplo que funcionou: `grep -c "FNDCT" plano.pdf → 0`, que qualquer pessoa pode reproduzir (`scripts/grep-doc.sh`).
- Atribua certo: o que foi feito pelo governo Jair Bolsonaro não foi feito pelo Flávio. A ponte entre os dois só vale se estiver no documento, por exemplo "o plano dele cita o governo Jair como modelo, p. 24".
- `references/banco-de-fatos-2026-10.md` tem fatos já checados em 07/10/2026. Reaproveite, mas reconfirme números que mudam (orçamento, pesquisa, desemprego).

## 2. Roteiro → `brief.md`
Copie `assets/brief-template.md`. A estrutura que funcionou em 60 s:

| t | beat | função |
|---|---|---|
| 0–4 | gancho | choque verificável em 1 linha, legível sem som |
| 4–9 | o que é | traduz o termo técnico para o público |
| 9–18 | o que o adversário propõe | citação literal do plano, com página |
| 18–32 | já vimos esse filme | histórico do governo de que ele é continuidade |
| 32–34 | silêncio | uma linha, tela quase vazia |
| 34–46 | virada | entregas do governo Lula, com número e fonte |
| 46–54 | racional | por que importa para *esse* público, sem insulto |
| 54–60 | card | "25 DE OUTUBRO · LULA 13" + "Fontes na legenda" |

**Outras durações** (mesma ordem de beats, cortando respiro, não argumento):

| duração | palavras de voz | beats | o que sai |
|---|---|---|---|
| 60 s | 130–140 | 9 | — |
| 45 s | 90–100 | 8 | "o que é" vira legenda do gancho; histórico com 1–2 fatos |
| 30 s | 55–65 | 5 | gancho → 1 fato do adversário → 1 do histórico → 1 virada → card |

Estimativa antes do TTS: ~2,9 palavras/s depois do `vo-prep` a 1.08–1.12. Os stills podem sair com durações estimadas; troque pelas medidas quando os WAVs existirem.

Quem assiste está com o som desligado na maioria das vezes, então o texto na tela precisa carregar o argumento sozinho e a voz reforça. Cada tela de dado leva um rótulo curto de fonte ("Fonte: MCTI, 2025").

## 3. Motion (HTML/JS determinístico → MP4)
Leia `references/motion.md`, que traz o contrato `window.MOTION`, safe zones do Reels, áudio e armadilhas.
- **Rápido:** parta de `assets/estilos/dossie-60s/index.html`, o estilo vencedor ("dossiê/forense": papel, marca-texto vermelho, citação com página). Troque `T` (timeline), `VO`, as cenas e as strings. Para público dev, `assets/estilos/terminal-10s/` tem a linguagem de terminal.
- **Exploratório:** 3 direções de 10 s em paralelo → juiz → estender a vencedora (ver `references/workflow.md`). Vale a pena para um público ou tema novo.
- Stills antes do render: um por cena, no meio dela (para 60 s: `--stills 1.5,6,12,20,28,36,42,50,57`), com `W=1080 H=1920 node scripts/render-motion.mjs final final/stills --stills <tempos>`. Abra cada imagem e corrija sobreposição, texto ilegível e safe zone.
- Mudou a duração ou removeu uma cena? Leia `assets/estilos/dossie-60s/STYLE.md` ("Adaptar"): a trilha usa as mesmas chaves `T.*`, e chave apagada vira tempo `NaN` sem erro visível.

## 4. Narração (Gemini TTS)
Leia `references/tts.md`. Em resumo:
1. `final/vo.md`: tabela com beat, início, texto e ids dos fatos. Máx. ~140 palavras para 60 s.
2. Gere um WAV por beat: `scripts/tts.sh "<só o texto>" final/vo/raw/b1.wav Charon`.
3. Trate o áudio: `scripts/vo-prep.sh raw/b1.wav vo/b1.wav 1.12`. O script imprime a duração final.
4. A imagem segue a voz: ponha as durações reais em `VO` e ajuste `T`.
5. Ouça, ou transcreva com whisper se não puder ouvir, para checar se a voz leu algo que não devia (`references/tts.md` tem o comando e o modelo).
6. Se só parte da voz existe, deixe em `VO` só os beats gerados; o template avisa no console os que faltam.

## 5. Render e entrega
```bash
cd <skill>/scripts && W=1080 H=1920 FPS=30 node render-motion.mjs <trabalho>/final <trabalho>/out/reel-60s.mp4
./check-render.sh <trabalho>/out/reel-60s.mp4      # ~60.0 s nos dois streams, ≈ -12 LUFS
./ig-encode.sh <trabalho>/out/reel-60s.mp4          # versão leve p/ Instagram/WhatsApp
python3 extract-strings.py <trabalho>/final/index.html <trabalho>/final/vo.md   # checagem final
```
Leva ~10 min para 60 s a 30 fps num M1. Rode um render de cada vez. Depois, confira cada string de `extract-strings.py` contra o `facts.md`; se algo não bater, corrija e renderize de novo.

Entregue: MP4 leve, master, `card.png` (still do card), legenda (`assets/legenda-template.md`) com fontes e URLs, e `facts.md`. Diga com clareza o que **não** foi verificado (normalmente: ninguém ouviu num celular; upload não testado).

## 6. Regras eleitorais (antes de publicar)
Leia `references/regras-eleitorais.md`. As obrigatórias para este formato:
- Voz sintética gera **rótulo visível o vídeo todo** e uma linha na legenda (Res. TSE 23.610/2019, art. 9-B).
- Sem imagem ou voz de pessoa real gerada por IA (deepfake) e sem imitar a voz do Lula ou do adversário.
- Pessoa física não paga impulsionamento. No dia da votação, nada de conteúdo novo.
- Isto não é parecer jurídico. Em dúvida, a assessoria jurídica da campanha decide.

## Tom
Abrir com choque é ok; mentir não. Sem xingamento, sem apelido pejorativo, sem meme que humilha eleitor do outro lado. O objetivo é virar voto de quem está indeciso, e indeciso se afasta de quem grita. Mostre o documento, a página e o número, e deixe a pessoa concluir.
