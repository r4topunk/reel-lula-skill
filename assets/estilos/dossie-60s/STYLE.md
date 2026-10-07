# Estilo "dossiê" (60 s) — vencedor do reel "grep FNDCT" (out/2026)

Arquivo: `index.html` (o reel final real, com a cópia exata do vídeo publicado). Para reaproveitar:
1. Troque as strings das cenas (`hook`, `whatIs`, `oQueTem`, `ponte`, `hist`, `silence`, `virada`, `racional`, `endCard`) pelos seus fatos.
2. Gere a narração em `vo/b1.wav…bN.wav` (scripts/tts.sh + vo-prep.sh) e atualize `VO` com as durações.
3. Reajuste `T` (início de cada cena/elemento) para seguir a voz; a trilha (`buildScore`) usa os mesmos `T`.
4. Sem `vo/` a página abre e roda sem voz, com aviso no console ("VO faltando").

## Adaptar (outra duração, cena a mais ou a menos)
- `T` guarda o início de cada cena e de cada elemento; `seek()` escolhe a cena por `T`, e `buildScore()` agenda os sons pelas **mesmas chaves** (`T.h2`, `T.v4`…). Ao apagar uma cena, faça `grep -n "T\.<chave>" index.html` e remova ou troque cada uso. Chave inexistente vira `NaN` e o som some sem erro.
- `FREEZES`, `SOURCES` (rodapé de fonte por cena) e `VO` também usam os tempos: revise os três.
- Geometria fixa: o marca-texto das citações usa offsets de y por linha (citação de 3+ linhas pode cair entre linhas) e o carimbo do histórico tem posição fixa (pode cobrir o título). Confira nos stills.

Paleta: bg #0d0c0b · papel #ece6da · tinta #16130f · vermelho #E4002B · branco #f4f0e8 · dim #9a9386.
Tipos: Instrument Serif (itálico) · Inter Tight 400–900 · JetBrains Mono 500/700.
Trilha: 100 BPM; ré menor → silêncio (tape-stop) → ré maior; hits saturados; ducking sob a voz.
Exemplo de narração com tempos: `vo-exemplo.md`.
