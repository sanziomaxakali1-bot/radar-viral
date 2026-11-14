// Uso: node scripts/render.mjs <id> [<id>...]   -> out/<id>.mp4
import {bundle} from '@remotion/bundler'; import {renderMedia, selectComposition} from '@remotion/renderer'; import path from 'path'; import fs from 'fs';
import {root, garantirClips} from './_util.mjs';
const ids = process.argv.slice(2);
if (!ids.length) { console.log('Uso: node scripts/render.mjs <id>'); process.exit(1); }
garantirClips(); fs.mkdirSync(path.join(root, 'out'), {recursive: true});
const url = await bundle({entryPoint: path.join(root, 'src/index.jsx'), publicDir: path.join(root, 'public')});
for (const id of ids) {
  const comp = await selectComposition({serveUrl: url, id});
  await renderMedia({chromiumOptions: {gl: 'angle'}, composition: comp, serveUrl: url, codec: 'h264', crf: 20, outputLocation: path.join(root, `out/${id}.mp4`)});
  console.log('pronto', id, '->', `out/${id}.mp4`);
}
