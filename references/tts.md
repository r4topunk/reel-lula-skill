# Narração com Gemini TTS

## Setup
- Chave: `GEMINI_API_KEY` (Google AI Studio). `scripts/tts.sh` lê do ambiente; nunca grave a chave no projeto nem a imprima no log.
- Modelos vistos em out/2026: `gemini-3.8-flash-tts` (padrão), `gemini-3.8-flash-lite-tts` (mais barato), `gemini-2.5-pro-preview-tts`. Para listar: `curl -s -H "x-goog-api-key: $GEMINI_API_KEY" "https://generativelanguage.googleapis.com/v1beta/models?pageSize=200" | grep -o '"models/[^"]*tts[^"]*"'`.
- Vozes que funcionaram em PT-BR: **Charon** (grave, firme; a escolhida), Orus (firme, mais seca), Kore (feminina, clara). Teste 2 vozes na linha do gancho e mantenha uma só no vídeo inteiro.

## Lições (cada uma custou um retake)
1. **Não mande instrução de estilo junto do texto.** "Leia em tom firme: …" foi lido em voz alta (conferido com whisper). Mande só a fala. O tom vem da pontuação: frases curtas, ponto final, "?" em perguntas, vírgula para pausa.
2. **A resposta pode ser `audio/wav` (com cabeçalho) ou PCM cru `audio/L16;rate=24000`.** Tratar WAV como PCM gera um clique no início. `tts.sh` já lida com os dois.
3. **Escreva números por extenso quando a leitura for ambígua**: "catorze vírgula sete bilhões", "Lula, treze", "vinte e cinco de outubro". Siglas que devem soar como letras: teste ("FNDCT" saiu bem; se sair errado, escreva "efe-ene-dê-cê-tê").
4. **O ritmo natural do TTS é lento para reel.** `vo-prep.sh` corta o silêncio das pontas e aplica `atempo` 1.08–1.15. Acima de 1.25 fica robótico. Beats curtos de impacto ("E aí veio 2023.") ficam em 1.0.
5. **Um WAV por beat**, nunca um arquivo só: assim a imagem sincroniza com cada frase e um retake não mexe no resto.
6. **A imagem segue a voz.** Meça cada WAV final (o script imprime a duração) e monte `VO = [[arquivo, início, duração], ...]` e a timeline `T` a partir disso. Deixe ~0,3–0,6 s de respiro entre beats.

## Orçamento de fala
- Ritmo medido: ~2,9 palavras/s depois do `vo-prep` a 1.08–1.12. Use para estimar antes de gerar.
- 60 s de vídeo ≈ 130–140 palavras de narração (≈ 50 s de fala), com 2 s de gancho sem voz e um beat de silêncio.
- A voz não lê o rótulo de fonte nem números secundários; ela diz a ideia e a tela mostra o detalhe.

## Mix (no `buildScore`)
- Carregue os WAVs com `fetch('vo/bN.wav')` + `decodeAudioData` dentro do `renderAudio()` (o renderer serve a pasta por http).
- Cadeia: música → compressor → **duck** → soma; voz → compressor leve (−20 dB, 3:1) → ganho 1.25 → soma; soma → limiter (−2 dB). Duck da música para ~0,32 de 120 ms antes até 350 ms depois de cada frase.
- Graves que o celular toca: sature os hits graves (waveshaper tanh) para gerar harmônicos; sub puro some no alto-falante do celular.
- Alvo após o render: ≈ −12 LUFS integrado, true peak ≤ −1 dB (`check-render.sh`).

## Verificação sem ouvir
Com whisper.cpp (`brew install whisper-cpp`), baixe um modelo uma vez e transcreva em 16 kHz:
```bash
mkdir -p ~/.cache/whisper && curl -L -o ~/.cache/whisper/ggml-base.bin https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.bin
ffmpeg -loglevel error -y -i vo/b1.wav -ar 16000 -ac 1 /tmp/b1-16k.wav && whisper-cli -m ~/.cache/whisper/ggml-base.bin -l pt -nt -f /tmp/b1-16k.wav
```
A transcrição de cada beat tem que bater com o `vo.md`. Isso não substitui ouvir num celular; diga isso na entrega.
