// Uso: node scripts/previa.mjs <id>   -> out/PREVIA-<id>.png (um quadro por fala; aprovar antes de renderizar)
import {bundle} from '@remotion/bundler'; import {renderStill, selectComposition} from '@remotion/renderer'; import path from 'path'; import fs from 'fs'; import {execSync} from 'child_process';
import {root, garantirClips} from './_util.mjs';
const id = process.argv[2];
if (!id) { console.log('Uso: node scripts/previa.mjs <id>'); process.exit(1); }
garantirClips(); fs.mkdirSync(path.join(root, 'out/prev'), {recursive: true});
const reg = JSON.parse(fs.readFileSync(path.join(root, 'src/projetos.json'), 'utf8')); const m = reg[id].linhas;
const url = await bundle({entryPoint: path.join(root, 'src/index.jsx'), publicDir: path.join(root, 'public')});
const comp = await selectComposition({serveUrl: url, id}); let a = 0; const files = [];
for (let i = 0; i < m.length; i++) {
  const n = Math.ceil(m[i].dur * 30) + 2, fr = a + Math.round(n * 0.7); a += n;
  const o = path.join(root, `out/prev/${id}_${i}.png`);
  await renderStill({chromiumOptions: {gl: 'angle'}, composition: comp, serveUrl: url, frame: fr, output: o, scale: 0.35}); files.push(o);
}
const ent = files.map((f) => `-i "${f}"`).join(' ');
execSync(`ffmpeg -y -loglevel error ${ent} -filter_complex "hstack=inputs=${files.length}" "${path.join(root, `out/PREVIA-${id}.png`)}"`);
console.log('previa em out/PREVIA-' + id + '.png');
