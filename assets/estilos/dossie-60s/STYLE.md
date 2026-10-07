# Estilo "dossiê" (60 s) — vencedor do reel "grep FNDCT" (out/2026)

Arquivo: `index.html` (o reel final real, com a cópia exata do vídeo publicado). Para reaproveitar:
1. Troque as strings das cenas (`hook`, `whatIs`, `oQueTem`, `ponte`, `hist`, `silence`, `virada`, `racional`, `endCard`) pelos seus fatos.
2. Gere a narração em `vo/b1.wav…bN.wav` (scripts/tts.sh + vo-prep.sh) e atualize `VO` com as durações.
3. Reajuste `T` (início de cada cena/elemento) para seguir a voz; a trilha (`buildScore`) usa os mesmos `T`.
4. Sem `vo/` a página abre e roda sem voz, com aviso no console ("VO faltando").

Paleta: bg #0d0c0b · papel #ece6da · tinta #16130f · vermelho #E4002B · branco #f4f0e8 · dim #9a9386.
Tipos: Instrument Serif (itálico) · Inter Tight 400–900 · JetBrains Mono 500/700.
Trilha: 100 BPM; ré menor → silêncio (tape-stop) → ré maior; hits saturados; ducking sob a voz.
Exemplo de narração com tempos: `vo-exemplo.md`.
