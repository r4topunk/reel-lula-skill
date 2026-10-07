# Motion: HTML/JS determinístico → MP4

O vídeo é uma página. `MOTION.seek(t)` desenha o frame exato do tempo `t`; `MOTION.renderAudio()` devolve a trilha exata (música + voz). O `scripts/render-motion.mjs` abre a página num Chrome headless, fotografa frame a frame e junta tudo com o áudio no ffmpeg. Como nada é gravado em tempo real, o render sai exato e corrigir um texto custa só editar uma linha e renderizar de novo.

## Contrato (obrigatório)
```js
window.MOTION = {
  duration: 60,           // s
  ready,                  // Promise: fontes + WAVs da voz carregados
  seek(t) {},             // desenha o frame em t; sem Math.random/Date.now — ruído só com hash(i)
  async renderAudio() {}, // OfflineAudioContext(2, 44100*DUR, 44100) → buildScore(oc, oc.destination, 0, vozes) → startRendering()
};
```
- Palco lógico **1080×1920**, com letterbox na janela. Botão `button#play` (o renderer esconde). Na reprodução ao vivo, o loop chama `seek(ac.currentTime - t0)`, então imagem e som não se descolam.
- Um único `buildScore(ac, dest, T0, voBufs)` monta a trilha inteira: master compressor + limiter.
- Fontes do Google Fonts: carregue com `document.fonts.load(...)` dentro de `ready`. Se não carregarem, pinte uma faixa amarela de aviso; nunca renderize com fonte de sistema sem perceber. O `dossie-60s` já faz isso.
- Esqueleto completo e funcionando: `assets/estilos/dossie-60s/index.html` (timeline `T`, `VO`, cenas, trilha com ducking, rótulo de IA, rodapé de fonte).

## Layout para Reels / TikTok
- **Safe zones**: nada essencial nos 140 px de cima nem nos 220 px de baixo (UI do app). Laterais: 60 px.
- Texto mínimo de 54 px lógico para corpo e 40 px para rótulo de fonte. O rótulo de IA tem 32 px e fica fixo, em y≈1674.
- Rodapé fixo em todas as telas: rótulo de fonte da tela atual + rótulo de IA.
- Uma ideia por tela; uma frase fica ≥ 1,5 s; um número grande fica ≥ 1 s parado antes de sair.

## Linguagem que funcionou (estilo "dossiê", 46/60 no juiz)
- Fundo quase preto `#0d0c0b`, papel `#ece6da` com textura de ruído com seed, vermelho de campanha `#E4002B` como **marca-texto** (multiply), nunca como fundo chapado o tempo todo.
- Tipos: Instrument Serif itálico (citações, números editoriais) + Inter Tight 800/900 (afirmações) + JetBrains Mono (comando, página, linha).
- O documento real é o herói: a citação aparece com "p. 71 · linha 2666" e o marca-texto passa por cima. Isso mostra a fonte em vez de só afirmar.
- Cada beat muda enquadramento, escala e direção (wipe diagonal entre seções); a mesma composição repetida vira slide.
- Freeze de 3 frames nos golpes grandes (o "0", o número da virada, "LULA 13").

## Trilha (Web Audio)
- 100 BPM, tom menor no histórico → **silêncio real** em "E aí veio 2023" → tom maior na virada. A trilha conta a história.
- Um som por evento visual no mesmo `t`: papel virando, tick de caneta, marca-texto, carimbo, boom no número.
- Riser antes do número-chave, impacto no corte. Graves saturados (o celular não toca sub puro).

## Armadilhas
- Motion blur por média de subframes gera fantasma: use corte seco no beat.
- WebGL + `file://` bloqueia textura: o renderer serve por http.
- Dois renders ao mesmo tempo no notebook: os dois ficam lentos e um pode travar.
- Contagem animada de número: o último frame da contagem tem que ser exatamente o valor do `facts.md`.
- Loop ao vivo: agende o próximo buffer de áudio em `t0 + duração` para não abrir um buraco.

## Comandos
```bash
W=1080 H=1920 node scripts/render-motion.mjs <dir> <dir>/stills --stills 1.5,6,12,20,28,36,42,50,57   # stills
W=1080 H=1920 FPS=30 node scripts/render-motion.mjs <dir> out/reel-60s.mp4                             # render (~10 min/60 s)
```
O script imprime `page errors` no fim; precisa sair vazio.
