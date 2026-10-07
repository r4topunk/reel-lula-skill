#!/usr/bin/env bash
# Prova "o plano cita X N vezes": extrai o texto do PDF e conta/mostra cada termo (sem distinguir maiúsculas).
# Uso: grep-doc.sh plano.pdf "FNDCT" "inteligência artificial" "R\$"
# O comando e o resultado podem ir para a tela, desde que sejam exatamente estes.
set -euo pipefail
PDF="${1:?pdf}"; shift
TXT="${PDF%.pdf}.txt"; [ -f "$TXT" ] || pdftotext -layout "$PDF" "$TXT"
for term in "$@"; do
  n=$(grep -ci -- "$term" "$TXT" || true); echo "== \"$term\": $n linhas"
  grep -ni -- "$term" "$TXT" | head -8 || true
done
echo "(texto em $TXT; página = conte os form feeds ou procure o número no rodapé)"
