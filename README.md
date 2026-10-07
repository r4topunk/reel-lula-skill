# reel-lula — skill do Claude para reels de campanha com dados reais

Skill do [Claude Code](https://claude.com/claude-code) que produz reels verticais (9:16, até 60 s) para a campanha Lula 2026:
pesquisa e checagem de fatos com fonte primária → roteiro → motion em HTML/JS determinístico → narração com Gemini TTS → MP4 + legenda com fontes.

Nasceu do reel "grep FNDCT" (público de TI, 2º turno, out/2026). O estilo "dossiê" usado nele está em `assets/estilos/dossie-60s/`.

## Instalar
```bash
git clone https://github.com/r4topunk/reel-lula-skill ~/.claude/skills/reel-lula
cd ~/.claude/skills/reel-lula/scripts && npm i
```
Requisitos: Node 20+, Google Chrome (ou `CHROME=<path>`), `ffmpeg`/`ffprobe`, `pdftotext` (poppler), e `GEMINI_API_KEY` (Google AI Studio) no ambiente.

## Usar
No Claude Code: *"faz um reel de 45 s pra professores indecisos comparando Lula e Flávio na educação"*. A skill dispara sozinha.

## Princípios
- Nada vai para a tela sem linha VERIFICADA em `facts.md`. Ganchos do briefing são hipóteses: os falsos são descartados.
- Voz sintética = rótulo de IA visível o vídeo todo (Res. TSE 23.610/2019, art. 9-B). Sem deepfake.
- `references/regras-eleitorais.md` é um checklist, não parecer jurídico.

## Estrutura
```
SKILL.md                     fluxo completo
references/                  pesquisa, motion, tts, regras eleitorais, workflow com subagentes, banco de fatos
scripts/                     render-motion.mjs, tts.sh, vo-prep.sh, grep-doc.sh, extract-strings.py, check-render.sh, ig-encode.sh
assets/                      templates (brief, facts, legenda) e estilos (dossie-60s, terminal-10s)
```
