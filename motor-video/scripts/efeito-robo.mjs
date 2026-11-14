// Efeito de robô aplicado DEPOIS de gerar a fala (a voz da Hope sai normal do ElevenLabs).
// Mantém a duração/ritmo (os timestamps das palavras continuam valendo): sobe o tom ~8%, tremolo metálico, eco curto e compressão.
import {execFileSync} from 'child_process';
export const FILTRO_ROBO = [
  'highpass=f=140', 'lowpass=f=7000',
  'asetrate=44100*1.08', 'aresample=44100', 'atempo=0.9259',
  'tremolo=f=38:d=0.28',
  'aecho=0.8:0.6:14:0.30',
  'acompressor=threshold=-18dB:ratio=3:attack=5:release=80',
  'volume=1.15',
].join(',');
export const aplicarEfeitoRobo = (entrada, saida) =>
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', entrada, '-af', FILTRO_ROBO, '-ar', '44100', '-b:a', '128k', saida]);
if (process.argv[2] && process.argv[3]) { aplicarEfeitoRobo(process.argv[2], process.argv[3]); console.log('ok', process.argv[3]); }
