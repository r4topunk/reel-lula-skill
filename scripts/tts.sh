#!/usr/bin/env bash
# Gera 1 trecho de narração com Gemini TTS.
# Uso: GEMINI_API_KEY=... tts.sh "<texto falado>" saida.wav [voz=Charon] [modelo=gemini-3.8-flash-tts]
# - Passe SÓ o texto que deve ser falado. Instruções de estilo ("leia em tom firme:") são lidas em voz alta pelo modelo.
#   O tom vem da pontuação: frases curtas, ponto final, "?" para perguntas.
# - A chave vem de GEMINI_API_KEY (ou GOOGLE_API_KEY). Nunca escreva a chave em arquivo do projeto.
set -euo pipefail
TEXT="${1:?texto}"; OUT="${2:?saida.wav}"; VOICE="${3:-Charon}"; MODEL="${4:-gemini-3.8-flash-tts}"
K="${GEMINI_API_KEY:-${GOOGLE_API_KEY:-}}"
[ -n "$K" ] || { echo "defina GEMINI_API_KEY (chave do Google AI Studio)" >&2; exit 2; }
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
python3 -c 'import json,sys; print(json.dumps({"contents":[{"parts":[{"text":sys.argv[1]}]}],"generationConfig":{"responseModalities":["AUDIO"],"speechConfig":{"voiceConfig":{"prebuiltVoiceConfig":{"voiceName":sys.argv[2]}}}}}))' "$TEXT" "$VOICE" > "$TMP/req.json"
curl -s -H "x-goog-api-key: $K" -H "Content-Type: application/json" \
  "https://generativelanguage.googleapis.com/v1beta/models/$MODEL:generateContent" -d @"$TMP/req.json" > "$TMP/resp.json"
# A API devolve audio/wav (com cabeçalho) em alguns modelos e PCM cru (audio/L16;rate=24000) em outros: trata os dois.
python3 - "$TMP/resp.json" "$TMP/out.pcm" <<'PY'
import json,sys,base64,io,wave,re
d=json.load(open(sys.argv[1]))
if 'error' in d: sys.exit("API error: "+d['error'].get('message',''))
p=d['candidates'][0]['content']['parts'][0]['inlineData']; b=base64.b64decode(p['data'])
if 'wav' in p['mimeType']:
    w=wave.open(io.BytesIO(b)); rate=w.getframerate(); b=w.readframes(w.getnframes())
else:
    m=re.search(r'rate=(\d+)',p['mimeType']); rate=int(m.group(1)) if m else 24000
open(sys.argv[2],'wb').write(b); open(sys.argv[2]+'.rate','w').write(str(rate))
PY
ffmpeg -loglevel error -y -f s16le -ar "$(cat "$TMP/out.pcm.rate")" -ac 1 -i "$TMP/out.pcm" "$OUT"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT"
