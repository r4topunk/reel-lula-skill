#!/usr/bin/env python3
"""Lista todo texto que aparece na tela (strings do index.html) para a checagem final contra o facts.md.
Uso: python3 extract-strings.py final/index.html [vo.md]"""
import re, sys
s = open(sys.argv[1], encoding='utf-8').read()
seen = set()
for m in re.findall(r"'([^'\n]{3,160})'|\"([^\"\n]{3,160})\"|`([^`\n]{3,200})`", s):
    x = [p for p in m if p][0]
    if re.search(r'[A-Za-zÀ-ú]{3}', x) and not re.search(r'^(rgba?|#|px|\d+px|bold|italic|source-over|multiply)', x) and x not in seen:
        seen.add(x); print('TELA |', x)
if len(sys.argv) > 2:
    for line in open(sys.argv[2], encoding='utf-8'):
        if line.startswith('| b'): print('VOZ  |', line.strip())
