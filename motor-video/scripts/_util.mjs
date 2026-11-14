import fs from 'fs'; import path from 'path';
export const root = path.resolve(import.meta.dirname, '..');
// garante c1..c5 em public/clips (repete os que existirem); avisa se nao houver nenhum
export const garantirClips = () => {
  const d = path.join(root, 'public/clips'); fs.mkdirSync(d, {recursive: true});
  const ex = [1, 2, 3, 4, 5].map((n) => path.join(d, `c${n}.mp4`)).filter((f) => fs.existsSync(f));
  if (!ex.length) { console.error('Coloque pelo menos 1 Reel vertical em public/clips/c1.mp4 (veja public/clips/LEIA-ME.txt).'); process.exit(1); }
  [1, 2, 3, 4, 5].forEach((n, i) => { const f = path.join(d, `c${n}.mp4`); if (!fs.existsSync(f)) fs.copyFileSync(ex[i % ex.length], f); });
};
