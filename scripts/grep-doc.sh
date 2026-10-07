#!/usr/bin/env bash
# Prova "o plano cita X N vezes" com página. Conta OCORRÊNCIAS (não linhas), mostra página:linha de cada uma
# e também procura no texto "colado" (sem quebra de linha/hifenização), para não gerar zero falso.
# Uso: grep-doc.sh plano.pdf "FNDCT" "piso" "inteligência artificial"
# O comando mostrado na tela tem que ser um que reproduza o número (ex.: grep -ci "fndct" plano.txt → 0 linhas).
set -euo pipefail
PDF="${1:?pdf}"; shift
TXT="${PDF%.pdf}.txt"; [ -f "$TXT" ] || pdftotext -layout "$PDF" "$TXT"
echo "páginas no PDF: $(pdfinfo "$PDF" 2>/dev/null | awk '/^Pages/{print $2}')"
for term in "$@"; do
  occ=$( (grep -oi -- "$term" "$TXT" || true) | wc -l | tr -d ' ')
  lines=$(grep -ci -- "$term" "$TXT" || true)
  joined=$(tr '\n\f' '  ' < "$TXT" | sed -E 's/- +//g; s/ +/ /g' | (grep -oi -- "$term" || true) | wc -l | tr -d ' ')
  echo "== \"$term\": $occ ocorrências em $lines linhas (texto colado: $joined)"
  # página = número de form feeds (\f) antes da linha + 1
  awk -v t="$term" 'BEGIN{IGNORECASE=1; p=1} { n=gsub(/\f/,"&"); if (tolower($0) ~ tolower(t)) printf "   p.%d l.%d: %s\n", p, NR, substr($0,1,110); p+=n }' "$TXT" | head -12
done
