import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {build, FPS, SANS, clamp, BRAND} from './Video.jsx';

const MONO = '"Courier New",Consolas,monospace';
const YEL = '#fbbf24', NAVY = '#1a1c4a', LINE = '#4a4fb0';
const sp = (f, d = 0) => spring({frame: f - d, fps: FPS, config: {damping: 11, stiffness: 150}});
const typed = (t, f, a, b) => t.slice(0, Math.round(interpolate(f, [a, b], [0, t.length], clamp)));
const prog = (f, a, b) => interpolate(f, [a, b], [0, 1], clamp);

// ---------- personagem pixel (novo: gorro verde-água, moletom mostarda) ----------
const PAL = {H: '#2a1a12', S: '#c98a5b', s: '#a86d44', E: '#111', B: '#2dd4bf', b: '#14998a', J: '#f5a524', j: '#c97d0a', M: '#7a2a1a', W: '#fff'};
const rows = (open) => ['     BBBBBB     ', '    BBBBBBBB    ', '   bbbbbbbbbb   ', '   HHHHHHHHHH   ', '   HSSSSSSSSH   ', '   HSSSSSSSSH   ', '   SSEESSEESS   ', '   SSEESSEESS   ', '   SSSSSSSSSS   ', open ? '   SSSMMMMSSS   ' : '   SSSSSSSSSS   ', open ? '    sSSMMSSs    ' : '    sSSSSSSs    ', '      SSSS      ',
  '  JJJJjjjjJJJJ  ', ' JJJJJjjjjJJJJJ ', ' JJJJJJJJJJJJJJ ', ' JJJJJJJJJJJJJJ ', ' JJJJJJJJJJJJJJ ', ' JJJJJJJJJJJJJJ ', ' JJJJJJJJJJJJJJ ', ' JJJJJJJJJJJJJJ '];
const POSES = {
  cheeks: [[0, 7, 2, 3, 'S'], [14, 7, 2, 3, 'S'], [0, 10, 1, 4, 'J'], [15, 10, 1, 4, 'J']],
  point: [[14, 13, 2, 2, 'J'], [16, 11, 2, 2, 'J'], [18, 9, 2, 2, 'J'], [19, 6, 2, 3, 'S'], [19, 5, 1, 1, 'S']],
  thumb: [[14, 12, 3, 2, 'J'], [16, 8, 3, 4, 'S'], [17, 6, 1, 2, 'S']],
  ok: [[14, 11, 2, 2, 'J'], [15, 7, 4, 4, 'S'], [16, 8, 2, 2, 'W']],
  shrug: [[-3, 11, 3, 3, 'S'], [16, 11, 3, 3, 'S'], [-1, 13, 2, 2, 'J'], [14, 13, 2, 2, 'J']],
};
const Sprite = ({pose = 'ok', talk = false, f = 0, cell = 34}) => {
  const open = talk && Math.floor(f / 4) % 2 === 0, blink = f % 100 > 94;
  const g = rows(open); const rects = [];
  g.forEach((r, y) => [...r].forEach((c, x) => { if (c === ' ') return; let col = PAL[c]; if (c === 'E' && blink) col = PAL.S; rects.push(<rect key={x + '-' + y} x={x} y={y} width={1.02} height={1.02} fill={col} />); }));
  (POSES[pose] || []).forEach(([x, y, w, h, c], i) => rects.push(<rect key={'p' + i} x={x} y={y} width={w} height={h} fill={PAL[c]} stroke="#00000055" strokeWidth={0.12} />));
  const bob = Math.sin(f / 7) * 5;
  return <svg viewBox="-4 0 26 20" width={cell * 26} height={cell * 20} style={{transform: `translateY(${bob}px)`, shapeRendering: 'crispEdges'}}>{rects}</svg>;
};

// ---------- fundo, título, janela ----------
const BGS = {a: ['#14123a', '#1d2a6e'], g: ['#0f2a2a', '#1b3a52'], p: ['#2a1250', '#4a1f78'], r: ['#35142a', '#5a1f48'], b: ['#101a45', '#1d3a8a']};
const Bg = ({k = 'a', t = 0}) => {
  const [c1, c2] = BGS[k]; const sparks = [[90, 520], [980, 700], [140, 1180], [930, 1250], [540, 380], [60, 860], [1010, 480]];
  return (<AbsoluteFill style={{background: `linear-gradient(170deg,${c1},${c2})`}}>
    <AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(115deg,rgba(255,255,255,.035) 0 60px,transparent 60px 130px)'}} />
    <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(255,255,255,.14) 2px,transparent 2px)', backgroundSize: '54px 54px', opacity: 0.5}} />
    {sparks.map(([x, y], i) => <div key={i} style={{position: 'absolute', left: x, top: y, color: YEL, fontSize: 34, opacity: 0.35 + 0.65 * Math.abs(Math.sin(t / 14 + i * 1.7))}}>✦</div>)}
    <div style={{position: 'absolute', right: 50, top: 36, fontFamily: MONO, fontSize: 24, color: '#9aa3ff', letterSpacing: 1}}>{BRAND.slug} <span style={{color: YEL}}>/ automação</span></div>
  </AbsoluteFill>);
};
const chunks = (words) => { const out = []; for (let i = 0; i < words.length; i += 2) out.push(words.slice(i, i + 2)); if (out.length > 1 && out[out.length - 1].length === 1) { const last = out.pop(); out[out.length - 1].push(last[0]); } return out; };
const Title = ({line, f}) => {
  const t = f / FPS, cs = chunks(line.words); let ci = 0; cs.forEach((c, i) => { if (t >= c[0].s - 0.05) ci = i; });
  const c = cs[ci]; const a = c.map((w) => w.w); const first = a.slice(0, a.length > 2 ? a.length - 1 : 1).join(' '), second = a.slice(a.length > 2 ? a.length - 1 : 1).join(' ');
  const p = sp(f - Math.round(c[0].s * FPS));
  const st = {fontFamily: SANS, fontWeight: 900, fontSize: 104, lineHeight: 1.08, letterSpacing: -1};
  return (<div style={{position: 'absolute', left: 60, top: 110, transform: `scale(${0.85 + 0.15 * p})`, transformOrigin: 'left top', opacity: Math.min(1, p * 1.5)}}>
    <div style={{...st, color: '#fff', textShadow: '0 6px 0 rgba(0,0,0,.35)'}}>{first}</div>
    {second && <div style={{...st, display: 'inline-block', background: YEL, color: '#17142e', padding: '0 20px', borderRadius: 8, marginTop: 4, boxShadow: '0 6px 0 #b8860b'}}>{second}</div>}
  </div>);
};
const Win = ({title = '', h = 700, top = 470, children}) => (
  <div style={{position: 'absolute', left: 80, right: 80, top, height: h, background: NAVY, border: `4px solid ${LINE}`, borderRadius: 22, boxShadow: '0 26px 0 rgba(0,0,0,.28)', fontFamily: MONO, color: '#dfe3ff', overflow: 'hidden'}}>
    <div style={{height: 46, background: '#272a6e', display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px', fontSize: 22, color: '#aab2ff'}}>
      {['#ff5f56', '#ffbd2e', '#27c93f'].map((c) => <div key={c} style={{width: 14, height: 14, borderRadius: 7, background: c}} />)}<span style={{marginLeft: 10}}>{title}</span></div>
    <div style={{padding: 30, position: 'relative', height: h - 46}}>{children}</div>
  </div>);
const Field = ({label, value, cursor, h = 90, big = 34}) => (<div style={{marginBottom: 24}}>
  <div style={{fontSize: 24, color: '#8c95ff', marginBottom: 8}}>{label}</div>
  <div style={{height: h, background: '#0d0f33', border: `3px solid ${LINE}`, borderRadius: 10, padding: '16px 20px', fontSize: big, color: '#fff', fontWeight: 700}}>{value}{cursor && <span style={{color: YEL}}>▌</span>}</div></div>);
const Btn = ({children, color = YEL, tc = '#17142e', style}) => <div style={{display: 'inline-block', background: color, color: tc, fontFamily: MONO, fontWeight: 900, fontSize: 30, padding: '18px 36px', borderRadius: 10, boxShadow: '0 6px 0 rgba(0,0,0,.35)', ...style}}>{children}</div>;
const Bar = ({p, color = YEL, h = 24}) => <div style={{height: h, background: '#0d0f33', border: `3px solid ${LINE}`, borderRadius: 8, overflow: 'hidden'}}><div style={{width: `${p * 100}%`, height: '100%', background: color}} /></div>;
const Bubble = ({ch, f, at = 10}) => <div style={{position: 'absolute', left: 110, top: 1220, width: 90, height: 90, background: '#fff', borderRadius: 16, color: YEL, fontFamily: SANS, fontWeight: 900, fontSize: 64, textAlign: 'center', lineHeight: '90px', transform: `scale(${sp(f, at)}) rotate(${Math.sin(f / 5) * 6}deg)`, boxShadow: '0 6px 0 #0006'}}>{ch}</div>;

// mini arte pixel para cenas (blocos coloridos)
const Art = ({kind, w = 300, h = 190, seed = 0, f = 0}) => {
  const bgc = {casa: '#e9a35f', cam: '#2a2f55', fita: '#3a6ea5', velho: '#6b4f9a'}[kind] || '#444';
  return (<div style={{width: w, height: h, background: bgc, position: 'relative', overflow: 'hidden', imageRendering: 'pixelated'}}>
    {kind === 'casa' && <><div style={{position: 'absolute', left: 40, top: 70, width: 220, height: 100, background: '#d9534f'}} /><div style={{position: 'absolute', left: 30, top: 40, width: 240, height: 34, background: '#8a2f2c'}} />{[0, 1, 2, 3].map((i) => <div key={i} style={{position: 'absolute', left: 60 + i * 50, top: 100, width: 28, height: 36, background: '#ffe9a8'}} />)}</>}
    {kind === 'cam' && <><div style={{position: 'absolute', left: 90, top: 60, width: 130, height: 90, background: '#9aa0c8', borderRadius: 8}} /><div style={{position: 'absolute', left: 125, top: 80, width: 60, height: 60, background: '#111', borderRadius: 30, border: '8px solid #cfd3f5'}} /></>}
    {kind === 'fita' && <><div style={{position: 'absolute', left: 60, top: 55, width: 180, height: 110, background: '#cfd3f5', borderRadius: 8}} /><div style={{position: 'absolute', left: 90, top: 85, width: 44, height: 44, background: '#222', borderRadius: 22}} /><div style={{position: 'absolute', left: 170, top: 85, width: 44, height: 44, background: '#222', borderRadius: 22}} /></>}
    {kind === 'velho' && <><div style={{position: 'absolute', left: 110, top: 40, width: 80, height: 70, background: '#c98a5b'}} /><div style={{position: 'absolute', left: 90, top: 110, width: 120, height: 90, background: '#f5a524'}} /></>}
  </div>);
};

// ---------- cenas ----------
const Timer = ({f, line, p0, p1}) => { const p = interpolate(f, [0, line.frames], [p0, p1], clamp); const sec = Math.round(p * 600); const mm = String(Math.floor(sec / 60)).padStart(2, '0'), ss = String(sec % 60).padStart(2, '0');
  const clips = Math.floor(p * 9); const kinds = ['casa', 'cam', 'fita', 'velho'];
  return (<><Win title="radarviral — projeto" h={660}>
    <div style={{background: YEL, color: '#17142e', fontWeight: 900, fontSize: 34, textAlign: 'center', padding: '14px 0', borderRadius: 8}}>IDEIA: fita cassete</div>
    <div style={{display: 'flex', gap: 8, marginTop: 36, height: 150, alignItems: 'center'}}>{Array.from({length: 9}).map((_, i) => <div key={i} style={{flex: 1, height: i < clips ? 140 : 0, transition: 'none', background: ['#3a6ea5', '#e9a35f', '#6b4f9a'][i % 3], border: '3px solid #fff3', opacity: i < clips ? 1 : 0}} />)}</div>
    <div style={{marginTop: 40}}><Bar p={p} color="#ef4444" h={30} /></div>
    <div style={{marginTop: 26, fontSize: 52, fontWeight: 900, color: '#fff', textAlign: 'center'}}>{mm}:{ss} <span style={{color: '#8c95ff'}}>/ 10:00</span></div>
    <div style={{marginTop: 30, textAlign: 'center', color: '#9aa3ff', fontSize: 28}}>{kinds.slice(0, 1).map(() => 'renderizando vídeo...')}</div>
  </Win><Bubble ch="!" f={f} /></>); };
const Digita = ({f, line, gen}) => { const txt = 'Por que ninguém mais usa fita cassete?'; const dur = line.frames;
  const v = gen ? txt : typed(txt, f, 14, dur - 20); const gp = prog(f, 6, dur - 8);
  return (<><Win title="radarviral — nova ideia" h={660}>
    <Field label="IDEIA DO VÍDEO" value={v} cursor={!gen && f % 16 < 9} h={130} big={36} />
    <Field label="OU COLE UM LINK" value="" />
    {!gen ? <Btn>GERAR VERSÃO</Btn> : <><Btn color="#22c55e" tc="#06260f" style={{padding: '14px 26px'}}>GERANDO...</Btn><div style={{marginTop: 26}}><Bar p={gp} color="#22c55e" /><div style={{marginTop: 8, textAlign: 'right', color: '#8c95ff', fontSize: 24}}>sua versão · {Math.round(gp * 100)}%</div></div></>}
  </Win>{!gen && <Bubble ch="?" f={f} at={12} />}</>); };
const Roteiro = ({f, line}) => { const L = ['CENA 1  fita sai da gaveta', 'CENA 2  anos 80: o toca-fitas', 'CENA 3  o walkman aparece', 'CENA 4  vem o streaming', 'CENA 5  hoje: coleção retrô']; const n = Math.floor(prog(f, 8, line.frames - 14) * 5.99);
  return (<Win title="roteiro.txt — personagem" h={700}>
    <div style={{display: 'flex', gap: 24}}>
      <div style={{flex: 1, fontSize: 26, lineHeight: 1.9}}>{L.map((x, i) => <div key={i} style={{opacity: i <= n ? 1 : 0.0, color: i === n ? YEL : '#cfd3ff'}}>{x}</div>)}</div>
      <div style={{width: 300, height: 380, background: '#0d0f33', border: `3px solid ${LINE}`, borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{transform: `scale(${sp(f, 30)})`, opacity: f > 28 ? 1 : 0}}><Sprite pose="thumb" f={f} cell={9} /></div>
        <div style={{marginTop: 14, color: '#8c95ff', fontSize: 22}}>personagem fixo</div></div></div>
  </Win>); };
const Cenas = ({f, line}) => { const half = line.frames * 0.5; const kinds = ['casa', 'cam', 'fita', 'velho'];
  if (f < half) { return (<Win title="gerando cenas" h={720}><div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22}}>{kinds.map((k, i) => { const p = prog(f, i * 6, half - 6 + i * 2); const done = p >= 1;
      return (<div key={k} style={{background: '#0d0f33', border: `3px solid ${LINE}`, padding: 10}}><div style={{position: 'relative'}}><Art kind={k} w={370} h={230} />{!done && <div style={{position: 'absolute', inset: 0, background: `rgba(13,15,51,${1 - p})`}} />}</div>
        <div style={{marginTop: 10, fontSize: 22, color: done ? '#4ade80' : '#8c95ff'}}>cena 0{i + 1} · {done ? 'OK' : Math.round(p * 100) + '%'}</div></div>); })}</div></Win>); }
  const ff = f - half; return (<Win title="editor — timeline" h={720}>
    {[['VÍDEO', '#3a6ea5'], ['VOZ', '#ef4444'], ['MÚSICA', '#22c55e'], ['LEGENDA', YEL]].map(([n, c], r) => (<div key={n} style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22, opacity: prog(ff, r * 5, r * 5 + 8)}}>
      <div style={{width: 130, fontSize: 22, color: '#8c95ff'}}>{n}</div>
      <div style={{flex: 1, height: 100, background: '#0d0f33', border: `3px solid ${LINE}`, display: 'flex', alignItems: 'center', gap: 4, padding: '0 8px', overflow: 'hidden'}}>
        {Array.from({length: r === 0 ? 4 : r === 3 ? 6 : 30}).map((_, i) => <div key={i} style={{flex: r === 0 || r === 3 ? 1 : '0 0 14px', height: r === 0 ? 72 : r === 3 ? 26 : 20 + 55 * Math.abs(Math.sin(i * 1.3 + ff / 5 + r)), background: c, opacity: 0.9}} />)}</div></div>))}
    <div style={{textAlign: 'center', marginTop: 30, color: '#4ade80', fontSize: 28}}>✓ voz · música · legenda</div></Win>); };
const Troca = ({f, line}) => { const bad = f < line.frames * 0.5; const seed = Math.floor(f / 2);
  return (<Win title="editor — cena 4" h={700}>
    <div style={{position: 'relative', height: 340, border: `3px solid ${bad ? '#ef4444' : '#4ade80'}`, overflow: 'hidden', background: '#000'}}>
      {bad ? Array.from({length: 60}).map((_, i) => <div key={i} style={{position: 'absolute', left: (i * 53 + seed * 31) % 800, top: (i * 37 + seed * 17) % 320, width: 60, height: 40, background: ['#777', '#aaa', '#555', '#ef4444'][(i + seed) % 4], opacity: 0.8}} />) : <Art kind="fita" w={820} h={336} />}
      <div style={{position: 'absolute', left: 16, top: 16, background: bad ? '#ef4444' : '#22c55e', color: '#fff', padding: '6px 14px', fontWeight: 900, fontSize: 24}}>{bad ? 'REFAZENDO...' : 'CENA REFEITA ✓'}</div></div>
    <div style={{marginTop: 28}}><Field label="PEDIDO" value={typed('troca essa cena', f, 2, 30)} cursor={f % 14 < 8} h={80} /></div></Win>); };
const Link = ({f, line}) => { const url = '> reels.com/viral-123'; const v = typed(url, f, 8, line.frames * 0.5); const ok = f > line.frames * 0.55; const gp = prog(f, line.frames * 0.6, line.frames - 6);
  return (<Win title="radarviral — sua versão" h={560} top={560}><Field label="COLE O LINK" value={v} cursor={!ok && f % 14 < 8} h={110} big={36} />
    {ok && <div style={{color: '#4ade80', fontSize: 32, marginBottom: 20}}>✓ link colado</div>}
    {ok && <><div style={{color: '#cfd3ff', fontSize: 28, marginBottom: 10}}>gerando sua versão...</div><Bar p={gp} color="#22c55e" /></>}</Win>); };
const Publica = ({f, line}) => { const half = line.frames * 0.5;
  if (f < half) return (<Win title="publicar — Reels" h={720}>
    <Field label="TÍTULO" value={typed('Por que a fita cassete morreu', f, 4, half * 0.5)} h={80} big={28} />
    <Field label="DESCRIÇÃO" value={typed('Em 1980 o toca-fitas dominava tudo. Hoje virou item de coleção.', f, half * 0.3, half - 4)} h={170} big={26} />
    <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>{['#retro', '#fitacassete', '#anos80', '#nostalgia'].map((t, i) => <div key={t} style={{background: YEL, color: '#17142e', fontWeight: 900, padding: '6px 14px', fontSize: 24, opacity: f > half * 0.6 + i * 3 ? 1 : 0}}>{t}</div>)}</div></Win>);
  const ff = f - half; const w = interpolate(ff, [0, 14], [820, 280], clamp);
  return (<Win title="versão vertical" h={720}><div style={{position: 'relative', height: 360, background: '#0d0f33', border: `3px solid ${LINE}`}}>
      <div style={{position: 'absolute', left: 0, top: 0}}><Art kind="velho" w={820} h={336} /></div>
      <div style={{position: 'absolute', left: 270, top: 0, width: w > 281 ? 280 : w, height: 336, border: `6px solid ${YEL}`, background: 'rgba(251,191,36,.18)'}} /></div>
    <div style={{display: 'flex', gap: 30, justifyContent: 'center', marginTop: 30}}>{['TikTok', 'Reels'].map((n, i) => <div key={n} style={{textAlign: 'center', transform: `scale(${sp(ff, 10 + i * 6)})`}}><div style={{width: 120, height: 210, background: '#6b4f9a', border: '4px solid #fff', borderRadius: 14}} /><div style={{fontSize: 22, color: '#cfd3ff', marginTop: 8}}>{n}</div></div>)}</div></Win>); };
const Apps = ({f, line}) => { const items = [['🎤', 'gravar'], ['▶', 'editar'], ['✦', '10 apps']]; const lvl = f > line.frames * 0.62;
  return (<>{!lvl ? <div style={{position: 'absolute', left: 80, right: 80, top: 600, display: 'flex', gap: 34, justifyContent: 'center'}}>{items.map(([ic, n], i) => { const at = 6 + i * 18; const cross = f > at + 14;
    return (<div key={n} style={{textAlign: 'center', transform: `scale(${sp(f, at)})`}}><div style={{width: 240, height: 240, background: '#272a6e', border: `5px solid ${LINE}`, borderRadius: 24, fontSize: 120, lineHeight: '240px', color: YEL, position: 'relative', opacity: cross ? 0.5 : 1}}>{ic}{cross && <div style={{position: 'absolute', left: 20, right: 20, top: 110, height: 16, background: '#ef4444', transform: 'rotate(-35deg)'}} />}</div><div style={{fontFamily: MONO, fontSize: 32, color: '#cfd3ff', marginTop: 14}}>{n}</div></div>); })}</div>
    : <Win title="automação de vídeos" h={560} top={560}><div style={{display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14}}>{['Ideia', 'Roteiro', 'Personagem', 'Cenas', 'Voz', 'Música', 'Legenda', 'Capa', 'Vertical'].map((n, i) => <div key={n} style={{background: f > line.frames * 0.62 + i * 2 ? YEL : '#272a6e', color: '#17142e', fontWeight: 900, fontSize: 24, textAlign: 'center', padding: '22px 0', borderRadius: 8}}>+ {n}</div>)}</div>
      <div style={{marginTop: 26}}><Bar p={prog(f, line.frames * 0.62, line.frames - 4)} color="#22c55e" /></div><div style={{marginTop: 8, color: '#8c95ff', fontSize: 24}}>9/9 módulos ligados</div></Win>}
    {lvl && <div style={{position: 'absolute', right: 110, top: 1240, background: YEL, color: '#17142e', fontFamily: SANS, fontWeight: 900, fontSize: 52, padding: '8px 24px', borderRadius: 10, transform: `scale(${sp(f, line.frames * 0.64)}) rotate(-4deg)`, boxShadow: '0 6px 0 #0006'}}>LEVEL UP</div>}</>); };
const Cta = ({f}) => (<AbsoluteFill style={{background: 'linear-gradient(180deg,#0a0d2e,#142a6a)', alignItems: 'center', justifyContent: 'center'}}>
  <div style={{textAlign: 'center', fontFamily: SANS, fontWeight: 900, transform: `scale(${0.8 + 0.2 * sp(f)})`}}>
    <div style={{fontSize: 96, color: '#fff'}}>CLICA NO BOTÃO</div>
    <div style={{fontSize: 112, background: YEL, color: '#17142e', display: 'inline-block', padding: '0 24px', marginTop: 10, borderRadius: 8, boxShadow: '0 8px 0 #b8860b'}}>AQUI EMBAIXO</div>
    <div style={{fontFamily: MONO, fontSize: 36, color: '#cfd3ff', marginTop: 50}}>e ative o seu {BRAND.produto}</div>
    <div style={{display: 'inline-block', marginTop: 40, background: '#fff', color: '#17142e', fontFamily: SANS, fontSize: 52, padding: '22px 60px', borderRadius: 18, transform: `scale(${1 + 0.05 * Math.sin(f / 4)})`, boxShadow: '0 8px 0 #0006'}}>Saiba mais ›</div>
    <div style={{marginTop: 60, color: YEL, fontSize: 110, lineHeight: 0.8, transform: `translateY(${Math.sin(f / 5) * 14}px)`}}>⌄<br />⌄</div></div></AbsoluteFill>);

const SC = {
  timer: {bg: 'a', pose: 'cheeks', ui: (p) => <Timer {...p} p0={0.02} p1={0.55} />},
  timer2: {bg: 'a', pose: 'cheeks', ui: (p) => <Timer {...p} p0={0.55} p1={1} />},
  digita: {bg: 'g', pose: 'point', ui: (p) => <Digita {...p} />},
  gera: {bg: 'g', pose: 'ok', ui: (p) => <Digita {...p} gen />},
  roteiro: {bg: 'p', pose: 'ok', ui: (p) => <Roteiro {...p} />},
  cenas: {bg: 'g', pose: 'thumb', ui: (p) => <Cenas {...p} />},
  troca: {bg: 'p', pose: 'thumb', ui: (p) => <Troca {...p} />},
  link: {bg: 'b', pose: 'point', ui: (p) => <Link {...p} />},
  publica: {bg: 'r', pose: 'point', ui: (p) => <Publica {...p} />},
  apps: {bg: 'a', pose: 'shrug', ui: (p) => <Apps {...p} />},
  cta: {bg: 'b', pose: null, ui: null},
};

const Scene = ({line, index, total}) => { const f = useCurrentFrame(); const s = SC[line.scene] || SC.timer;
  if (line.scene === 'cta') return <Cta f={f} />;
  const talk = f < Math.ceil(line.dur * FPS); const xp = (index + f / line.frames) / total; const gold = f < 16 && index % 2 === 0;
  return (<AbsoluteFill><Bg k={s.bg} t={f + index * 40} />
    <Title line={line} f={f} />
    {s.ui({f, line})}
    <div style={{position: 'absolute', left: 250, top: 1270, width: 580, height: 580, borderRadius: '50%', background: 'radial-gradient(circle,rgba(251,191,36,.55),rgba(251,191,36,0) 68%)'}} />
    <div style={{position: 'absolute', left: 98, top: 1236}}><Sprite pose={s.pose} talk={talk} f={f} cell={34} /></div>
    <div style={{position: 'absolute', left: 70, bottom: 60, display: 'flex', alignItems: 'center', gap: 10, fontFamily: MONO, fontWeight: 900, fontSize: 26, color: '#fff'}}>XP<div style={{width: 160, height: 22, background: '#0d0f33', border: `3px solid ${LINE}`}}><div style={{width: `${xp * 100}%`, height: '100%', background: YEL}} /></div></div>
    {gold && <div style={{position: 'absolute', left: 80, top: 1300 - f * 2, fontFamily: MONO, fontWeight: 900, fontSize: 40, color: YEL, opacity: 1 - f / 16}}>+10 XP</div>}
  </AbsoluteFill>); };

export const PixelVideo = ({m}) => { const {lines} = build(m); return (
  <AbsoluteFill style={{background: '#0a0d2e'}}>
    <Audio src={staticFile('audio/music.mp3')} volume={0.09} loop />
    {lines.map((l, i) => (<Sequence key={l.id} from={l.start} durationInFrames={l.frames}>
      <Audio src={staticFile(`voz/${l.file}`)} volume={1} /><Audio src={staticFile('audio/whoosh.wav')} volume={0.18} />
      {l.scene === 'cta' && <Sequence from={14}><Audio src={staticFile('audio/ding.wav')} volume={0.3} /></Sequence>}
      <Scene line={l} index={i} total={lines.length} /></Sequence>))}
  </AbsoluteFill>); };
