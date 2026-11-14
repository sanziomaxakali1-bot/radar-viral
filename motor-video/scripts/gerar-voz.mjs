// Gera as vozes (ElevenLabs, 1 fala por arquivo, com cache) e registra o projeto em src/projetos.json.
// Uso: node scripts/gerar-voz.mjs roteiros/meu-roteiro.json [--dry]
// Variaveis de ambiente (ou arquivo .env.local): ELEVENLABS_API_KEY, VOZ_NARRADOR, VOZ_ROBO (IDs das vozes escolhidas pelo cliente)
import fs from 'fs'; import path from 'path'; import crypto from 'crypto'; import {execSync} from 'child_process';
import {aplicarEfeitoRobo} from './efeito-robo.mjs';
const root = path.resolve(import.meta.dirname, '..');
const arq = process.argv[2]; const dry = process.argv.includes('--dry');
if (!arq) { console.log('Uso: node scripts/gerar-voz.mjs roteiros/<arquivo>.json [--dry]'); process.exit(1); }
for (const f of [path.join(root, '.env.local'), path.join(root, '.env')]) {
  if (fs.existsSync(f)) for (const l of fs.readFileSync(f, 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
}
const KEY = process.env.ELEVENLABS_API_KEY; const VOZES = {narrador: process.env.VOZ_NARRADOR, robo: process.env.VOZ_ROBO};
const rot = JSON.parse(fs.readFileSync(path.resolve(arq), 'utf8')); // {projetos: {id: {comp, marca, theme, linhas: [...]}}}
for (const d of ['cache-voz', 'public/voz', 'src']) fs.mkdirSync(path.join(root, d), {recursive: true});
const regPath = path.join(root, 'src/projetos.json'); const reg = fs.existsSync(regPath) ? JSON.parse(fs.readFileSync(regPath, 'utf8')) : {};
let chars = 0;
for (const [id, p] of Object.entries(rot.projetos)) {
  const linhas = [];
  for (const [i, l] of p.linhas.entries()) {
    const quem = l.voz || (l.who === 'robot' ? 'robo' : 'narrador'); const voice = VOZES[quem];
    if (!voice) { console.error(`Falta a variavel VOZ_${quem.toUpperCase()}. Escolha a voz no ElevenLabs e informe so o ID.`); process.exit(1); }
    const h = crypto.createHash('sha1').update(l.text + '|' + voice + '|v1').digest('hex').slice(0, 12);
    const mp3 = path.join(root, 'cache-voz', h + '.mp3'), js = path.join(root, 'cache-voz', h + '.json');
    if (!fs.existsSync(mp3)) {
      chars += l.text.length; console.log('GERA:', l.text); if (dry) continue;
      if (!KEY) { console.error('Falta ELEVENLABS_API_KEY (coloque em .env.local; nunca cole a chave no chat).'); process.exit(1); }
      const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}/with-timestamps?output_format=mp3_44100_128`, {method: 'POST', headers: {'xi-api-key': KEY, 'Content-Type': 'application/json'},
        body: JSON.stringify({text: l.text, model_id: 'eleven_multilingual_v2', language_code: rot.idioma || 'pt', voice_settings: {stability: 0.4, similarity_boost: 0.8, style: quem === 'robo' ? 0.2 : 0.35, use_speaker_boost: true, speed: 1.1}})});
      if (!r.ok) throw new Error(r.status + ' ' + (await r.text()).slice(0, 200));
      const j = await r.json(); fs.writeFileSync(mp3, Buffer.from(j.audio_base64, 'base64')); fs.writeFileSync(js, JSON.stringify(j.alignment));
    }
    if (dry) continue;
    const al = JSON.parse(fs.readFileSync(js, 'utf8')); const words = []; let cur = null;
    al.characters.forEach((c, k) => { if (/\s/.test(c)) { cur = null; return; } if (!cur) { cur = {w: '', s: al.character_start_times_seconds[k], e: 0}; words.push(cur); } cur.w += c; cur.e = al.character_end_times_seconds[k]; });
    let fin = mp3; if (quem === 'robo') { fin = path.join(root, 'cache-voz', h + '.robo.mp3'); if (!fs.existsSync(fin)) aplicarEfeitoRobo(mp3, fin); }
    fs.copyFileSync(fin, path.join(root, 'public/voz', h + '.mp3'));
    const dur = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${fin}"`).toString());
    linhas.push({id: `${l.scene || 'l'}_${i}`, ...l, file: h + '.mp3', dur, words});
  }
  if (dry) continue;
  reg[id] = {comp: p.comp || 'vsl', marca: p.marca, theme: p.theme, linhas};
  const total = linhas.reduce((a, x) => a + Math.ceil(x.dur * 30) + 2, 0) / 30 + 0.4;
  console.log(`${id}: ${total.toFixed(1)} s` + (total < 25 || total > 35 ? '  (ATENCAO: fora de 25-35 s)' : ''));
}
if (!dry) fs.writeFileSync(regPath, JSON.stringify(reg));
console.log('caracteres novos no ElevenLabs:', chars);
