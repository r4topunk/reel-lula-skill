#!/usr/bin/env bash
# Master (crf 16, ~300 MB/min) → versão p/ Instagram/WhatsApp (~75 MB/min), sem reprocessar o áudio.
set -euo pipefail
IN="${1:?master.mp4}"; OUT="${2:-${1%.mp4}-ig.mp4}"
ffmpeg -loglevel error -y -i "$IN" -c:v libx264 -preset slow -crf 21 -maxrate 25M -bufsize 50M -pix_fmt yuv420p -c:a copy -movflags +faststart "$OUT"
ls -lh "$OUT" | awk '{print "ok:", $NF, $5}'
