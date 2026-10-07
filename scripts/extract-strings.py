#!/usr/bin/env python3
"""Lista o texto que vai para a TELA (strings com cara de frase/número no index.html) e as falas do vo.md,
para conferir uma a uma contra o facts.md. Filtra CSS, nomes de fonte, alinhamentos e trechos de código.
Uso: python3 extract-strings.py final/index.html [final/vo.md]"""
import re, sys
s = open(sys.argv[1], encoding='utf-8').read()
s = re.sub(r'<style.*?</style>', '', s, flags=re.S)
CODE = re.compile(r'[(){};=<>\\]|=>|\$\{')
NOISE = re.compile(r"^(\d00 |italic |bold |normal |rgba?\(|#[0-9a-f]{3,8}$|[a-z-]+$|source-over|multiply|screen|lighter|"
                   r"left|right|center|middle|top|bottom|alphabetic|repeat|anonymous|use strict|VO faltando|FONTES NÃO)", re.I)
seen = []
for m in re.finditer(r"'([^'\n]{2,200})'|\"([^\"\n]{2,200})\"|`([^`\n]{2,240})`", s):
    x = next(g for g in m.groups() if g)
    if CODE.search(x) or NOISE.search(x.strip()) or "'" in x and 'px' in x: continue
    if not (' ' in x.strip() or re.fullmatch(r'[R$\d.,%×x]+', x.strip())): continue   # frase (tem espaço) ou número puro
    if re.search(r'px|serif|sans|mono|Inter Tight|Instrument|JetBrains', x): continue
    if x not in seen: seen.append(x)
for x in seen: print('TELA |', x)
if len(sys.argv) > 2:
    for line in open(sys.argv[2], encoding='utf-8'):
        if re.match(r'\|\s*b\d', line): print('VOZ  |', line.strip())
