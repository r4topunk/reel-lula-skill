#!/usr/bin/env bash
# Corta silêncio do início/fim, acelera (atempo) e converte p/ 44.1 kHz mono. Imprime a duração final (use-a na timeline).
# Uso: vo-prep.sh bruto.wav final.wav [atempo=1.12]   (1.08–1.15 soa natural; >1.25 fica robótico)
set -euo pipefail
IN="${1:?in}"; OUT="${2:?out}"; TEMPO="${3:-1.12}"
ffmpeg -loglevel error -y -i "$IN" -af "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08,areverse,atempo=$TEMPO" -ar 44100 -ac 1 "$OUT"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT"
