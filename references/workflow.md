# Versão com subagentes (opcional)

Use quando o público ou tema é novo e vale explorar 3 linguagens visuais, ou quando há muitos fatos para checar. Para "mais um reel no estilo dossiê", faça direto pelo `SKILL.md`, que é mais barato.

Custo de referência (out/2026): 7 agentes, ~840k tokens, ~28 min, render incluído.

## Forma
```
Verificar (2 agentes, opus/medium) ─┐
                                    ├─→ Juiz (1, opus/high) → Final 60 s + TTS + render (1, opus/medium)
Direções 10 s (3, opus/medium) ─────┘
```
- Verificar e Direções rodam em paralelo: as direções de 10 s só usam o gancho, que já está VERIFICADO.
- O juiz abre todos os stills e lê o código (seek + buildScore). Critérios, nota de 1 a 10 cada: para o scroll em 2 s; legível sem som; fala com o público-alvo; escala para 60 s com ~8 beats e voz sem virar slide; acabamento; áudio.
- O agente final recebe o veredito do juiz + o JSON dos fatos verificados e faz: atualiza facts.md → estende a vencedora → vo.md + TTS por beat → rótulo de IA → stills → render → checagem de strings → legenda + card.

## Script (ferramenta Workflow do Claude Code)
Passe `args: {"root": "<pasta de trabalho absoluta>", "skill": "<pasta desta skill absoluta>"}`. Antes, `brief.md` e `facts.md` já precisam existir, com os PENDENTE marcados.

```js
export const meta = {
  name: 'reel-lula',
  description: 'Verificar fatos + 3 direções de 10 s -> juiz -> reel final 60 s 9:16 com Gemini TTS',
  phases: [{ title: 'Verificar' }, { title: 'Direções' }, { title: 'Juiz' }, { title: 'Final' }],
}
const { root: ROOT, skill: SKILL } = args
const VERIFY_SCHEMA = { type: 'object', required: ['claims'], properties: { claims: { type: 'array', items: { type: 'object',
  required: ['id', 'status', 'on_screen_text', 'source_label', 'urls', 'notes'],
  properties: { id: { type: 'string' }, status: { type: 'string', enum: ['VERIFICADO', 'CORRIGIDO', 'DESCARTADO'] },
    on_screen_text: { type: 'string' }, source_label: { type: 'string' }, urls: { type: 'array', items: { type: 'string' } }, notes: { type: 'string' } } } } } }
const verify = (ids, extra) => `Você checa fatos para um vídeo de campanha (2º turno 2026). Precisão vale mais que impacto: sem fonte primária ou 2 veículos independentes → CORRIGIDO (com redação defensável) ou DESCARTADO. Leia ${ROOT}/facts.md e ${SKILL}/references/pesquisa.md. Verifique SÓ: ${ids.join(', ')}. ${extra} Não edite arquivos. on_screen_text ≤ 14 palavras, literalmente sustentado pela fonte.`
const DIRS = [
  ['d1', 'DOSSIÊ: parta de ' + SKILL + '/assets/estilos/dossie-60s/index.html (papel, marca-texto, citação com página).'],
  ['d2', 'TERMINAL/DEV: parta de ' + SKILL + '/assets/estilos/terminal-10s/index.html (comando digitado, resultado gigante, glitch).'],
  ['d3', 'TIPOGRAFIA CINÉTICA: palavra/número gigante por batida (~128 BPM), punch de escala, flood vermelho, freeze no número.'],
]
const dir = ([k, txt]) => `Construa um TESTE DE DIREÇÃO de 10 s (1080x1920). Leia ${ROOT}/brief.md, ${ROOT}/facts.md (só VERIFICADO na tela), ${SKILL}/references/motion.md. Direção: ${txt} Escreva SÓ em ${ROOT}/${k}/index.html seguindo o contrato MOTION. Verifique: cd ${SKILL}/scripts && W=1080 H=1920 node render-motion.mjs ${ROOT}/${k} ${ROOT}/${k}/stills --stills 1,3,5.5,8.5 ; abra os stills, corrija uma vez. Responda: pasta, 3 linhas de descrição, BPM, stills, o que não foi verificado.`

phase('Verificar')
const vP = parallel([
  () => agent(verify(['<ids histórico>'], '<o que resolver>'), { phase: 'Verificar', schema: VERIFY_SCHEMA, model: 'opus', effort: 'medium' }),
  () => agent(verify(['<ids governo Lula>'], '<o que resolver>'), { phase: 'Verificar', schema: VERIFY_SCHEMA, model: 'opus', effort: 'medium' }),
])
const dP = parallel(DIRS.map(d => () => agent(dir(d), { label: d[0], phase: 'Direções', model: 'opus', effort: 'medium' })))
const [vR, dR] = await Promise.all([vP, dP])
const claims = vR.filter(Boolean).flatMap(r => r.claims)
phase('Juiz')
const verdict = await agent(`Julgue 3 testes de 10 s para Reels (brief: ${ROOT}/brief.md) em ${ROOT}/d1..d3 (index.html + stills). Relatórios:\n${dR.map((r, i) => 'd' + (i + 1) + ': ' + r).join('\n')}\nAbra todos os stills, leia seek e buildScore. Nota 1-10: para o scroll em 2 s; legível sem som; fala com o público; escala p/ 60 s com voz; acabamento; áudio. Responda: vencedora, tabela, 3 enxertos dos perdedores, correções.`, { phase: 'Juiz', model: 'opus', effort: 'high' })
phase('Final')
const final = await agent(`Construa o reel FINAL de 60 s seguindo ${SKILL}/SKILL.md passos 3-5 e ${SKILL}/references/{motion,tts,regras-eleitorais}.md. Veredito:\n${verdict}\nFatos verificados (autoritativos; nunca mostre DESCARTADO):\n${JSON.stringify(claims)}\nPassos: atualize ${ROOT}/facts.md; copie a vencedora p/ ${ROOT}/final/ e estenda; ${ROOT}/final/vo.md + WAV por beat com ${SKILL}/scripts/tts.sh e vo-prep.sh (GEMINI_API_KEY no ambiente; nunca imprima); rótulo de IA permanente; stills e correções; render FPS=30 em ${ROOT}/out/; check-render.sh; ig-encode.sh; extract-strings.py contra facts.md; legenda (${SKILL}/assets/legenda-template.md) e card.png. Responda: caminhos, durações ffprobe, voz, tabela tela→fato, o que não foi verificado.`, { phase: 'Final', model: 'opus', effort: 'medium' })
return { claims, verdict, final }
```
