#!/usr/bin/env bash
# Confere o MP4: duração de vídeo e áudio, resolução, fps, loudness (alvo ≈ -12 LUFS) e true peak.
set -euo pipefail
F="${1:?video.mp4}"
for s in v a; do ffprobe -v error -select_streams $s:0 -show_entries stream=codec_name,width,height,r_frame_rate,duration -of csv=p=0 "$F"; done
ffmpeg -hide_banner -i "$F" -af ebur128=peak=true -f null - 2>&1 | grep -A12 Summary | grep -E " I:|Peak:|LRA:" || true
ls -lh "$F" | awk '{print "tamanho:", $5}'
