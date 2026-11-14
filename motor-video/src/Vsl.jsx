import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {build, FPS, SANS, clamp, BRAND} from './Video.jsx';

const BG = '#07080d', ACC = '#4f9bff', OR = '#ff7a2f', INK = '#f4f6ff', DIM = '#8d93a8', GRN = '#22c55e';
const MONO = '"Courier New",Consolas,monospace', HAND = '"Segoe Print","Bradley Hand ITC","Comic Sans MS",cursive';
const sp = (f, d = 0) => spring({frame: f - d, fps: FPS, config: {damping: 13, stiffness: 120}});
const pr = (f, a, b) => interpolate(f, [a, b], [0, 1], clamp);
const typed = (t, f, a, b) => t.slice(0, Math.round(interpolate(f, [a, b], [0, t.length], clamp)));
const KEYS = {mosaic: 'sem câmera', fora: 'de fora', rise: 'Reels virais', editar: 'editar', logo: 'Radar Viral', radar: 'explodindo', link: 'Cola o link', pipeline: 'pronto', duvidas: 'ele edita', formato: 'segundos', nichos: 'loja', tres: 'seguidor', cta: 'Saiba mais', simples: 'ideia', hist: 'historinhas', dia: 'todo dia', maquina: 'máquina', esteira: 'esteira', compara: 'sozinha'};

// ---------- peças ----------
const Clip = ({n, t0 = 0, style}) => <OffthreadVideo src={staticFile(`clips/c${n}.mp4`)} startFrom={Math.round(t0 * FPS)} muted style={{width: '100%', height: '100%', objectFit: 'cover', ...style}} />;
const Phone = ({n, t0 = 0, w = 420, rot = 0, x = 0, y = 0, glow = ACC, children, style}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: w * 1.78, borderRadius: w * 0.11, border: `${w * 0.025}px solid #1d2130`, background: '#000', overflow: 'hidden', transform: `rotate(${rot}deg)`, boxShadow: `0 30px 80px rgba(0,0,0,.7), 0 0 60px ${glow}33`, ...style}}>
    <Clip n={n} t0={t0} />{children}</div>);
const Pill = ({children, color = ACC, tc = '#fff', style}) => <div style={{display: 'inline-block', background: color, color: tc, fontFamily: SANS, fontWeight: 900, padding: '8px 24px', borderRadius: 999, boxShadow: `0 0 36px ${color}66`, ...style}}>{children}</div>;
const Bg = ({f, glow = ACC}) => (<AbsoluteFill style={{background: BG}}>
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 28%, ${glow}30, transparent 60%)`}} />
  <AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)', backgroundSize: '90px 90px', transform: `translateY(${(f * 0.4) % 90}px)`, opacity: 0.7}} />
  <div style={{position: 'absolute', left: 40, top: 36, fontFamily: MONO, fontSize: 24, color: DIM}}><span style={{color: OR}}>●</span> {BRAND.nome}</div></AbsoluteFill>);
const Caption = ({line, f}) => { const t = f / FPS, w = line.words; let i = 0; w.forEach((x, k) => { if (t >= x.s - 0.03) i = k; });
  const a = Math.floor(i / 3) * 3, ch = w.slice(a, a + 3); const kw = KEYS[line.scene] || '';
  return (<div style={{position: 'absolute', left: 40, right: 40, top: 1560, display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap'}}>
    {ch.map((x, k) => { const act = a + k === i; return <div key={a + k} style={{fontFamily: SANS, fontWeight: 900, fontSize: 70, color: act ? '#0b0d14' : '#fff', background: act ? OR : 'rgba(255,255,255,.10)', padding: '6px 22px', borderRadius: 16, border: '2px solid rgba(255,255,255,.14)', textShadow: act ? 'none' : '0 4px 0 #0008', transform: act ? 'scale(1.06)' : 'none'}}>{x.w}</div>; })}</div>); };
const Win = ({title, x = 70, y = 200, w = 940, h = 800, children}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 26, background: 'linear-gradient(160deg,#141826,#0c0f1a)', border: '2px solid #262d45', boxShadow: '0 40px 90px rgba(0,0,0,.7)', color: INK, fontFamily: SANS, overflow: 'hidden'}}>
    <div style={{height: 58, display: 'flex', alignItems: 'center', gap: 10, padding: '0 22px', background: '#171c2f', color: DIM, fontSize: 24, fontFamily: MONO}}>
      {['#ff5f56', '#ffbd2e', '#27c93f'].map((c) => <div key={c} style={{width: 16, height: 16, borderRadius: 8, background: c}} />)}<span style={{marginLeft: 12}}>{title}</span></div>
    <div style={{padding: 34, position: 'relative', height: h - 58}}>{children}</div></div>);
const Bar = ({p, c = ACC}) => <div style={{height: 22, borderRadius: 11, background: '#1a2036', overflow: 'hidden'}}><div style={{width: `${p * 100}%`, height: '100%', background: c, boxShadow: `0 0 20px ${c}`}} /></div>;

// ---------- cenas ----------
const Mosaic = ({f}) => { const P = [[1, 6, -140, 150, 360, -6], [2, 12, 330, 120, 400, 4], [3, 8, 720, 170, 340, 7], [4, 20, 40, 760, 380, 5], [5, 4, 560, 740, 400, -5]];
  return (<>{P.map(([n, t0, x, y, w, r], i) => <Phone key={n} n={n} t0={t0} w={w} x={x} y={y + Math.sin(f / 22 + i) * 14} rot={r + Math.sin(f / 40 + i) * 1.5} style={{opacity: 0.95 * pr(f, i * 4, i * 4 + 12), transform: `rotate(${r}deg) scale(${0.85 + 0.15 * sp(f, i * 4)})`}} />)}
    <div style={{position: 'absolute', left: 0, right: 0, top: 1240, textAlign: 'center'}}><Pill color="#000" style={{fontSize: 60, border: '3px solid #fff3', transform: `scale(${sp(f, 20)})`}}>▶ sem câmera</Pill></div></>); };
const Fora = ({f}) => (<><Phone n={1} t0={30} w={500} x={290} y={170} rot={-3} /><Phone n={2} t0={20} w={400} x={20} y={560} rot={-8} style={{opacity: 0.6}} /><Phone n={3} t0={30} w={400} x={660} y={560} rot={8} style={{opacity: 0.6}} />
  <div style={{position: 'absolute', left: 0, right: 0, top: 1290, textAlign: 'center'}}><Pill color="#fff" tc="#0b0d14" style={{fontSize: 64, transform: `scale(${sp(f, 6)})`}}>👁 de fora?</Pill></div></>);
const Rise = ({f}) => { const p = pr(f, 4, 80); const pts = Array.from({length: 30}, (_, i) => { const x = i / 29; return [60 + x * 760, 760 - Math.pow(x, 2.1) * 560 * p * (x <= p ? 1 : 0) - (x > p ? 0 : 0)]; }).filter(([x]) => (x - 60) / 760 <= p);
  return (<><Win title="alcance — últimos 28 dias" y={180} h={900}><svg viewBox="0 0 880 780" style={{width: '100%'}}><polyline fill="none" stroke={ACC} strokeWidth={10} strokeLinejoin="round" points={pts.map((q) => q.join(',')).join(' ')} style={{filter: `drop-shadow(0 0 12px ${ACC})`}} /></svg>
    <div style={{position: 'absolute', right: 40, top: 40, fontSize: 80, fontWeight: 900, color: GRN}}>↗</div></Win>
    <Phone n={1} t0={45} w={300} x={720} y={760} rot={6} style={{transform: `rotate(6deg) scale(${sp(f, 20)})`}} /></>); };
const Editar = ({f}) => { const p = pr(f, 30, 90); return (<><div style={{position: 'absolute', left: 60, top: 230, fontFamily: HAND, fontSize: 200, color: '#fff', clipPath: `inset(0 ${100 - pr(f, 2, 30) * 100}% 0 0)`, transform: 'rotate(-4deg)', fontWeight: 900, textShadow: `0 0 40px ${OR}88`}}>EDITAR</div>
  <div style={{position: 'absolute', left: 50, top: 340, width: 600 * pr(f, 30, 45), height: 14, background: '#ef4444', transform: 'rotate(-4deg)', boxShadow: '0 0 20px #ef4444'}} />
  <Win title="editor.exe — 3h restantes" y={560} h={640}>{[1, 2, 3].map((r) => <div key={r} style={{height: 90, marginBottom: 20, background: '#0c0f1a', borderRadius: 10, position: 'relative', overflow: 'hidden', border: '2px solid #262d45'}}>{Array.from({length: 6}).map((_, i) => <div key={i} style={{position: 'absolute', left: i * 135 + r * 30, top: 8, width: 120, height: 70, background: ['#334', '#445', '#324'][i % 3], borderRadius: 8}} />)}</div>)}
    <div style={{fontSize: 56, fontWeight: 900, color: '#fff', marginTop: 16}}>⏱ {String(Math.floor(p * 3)).padStart(2, '0')}:{String(Math.floor(p * 59)).padStart(2, '0')}:{String(Math.floor((f * 7) % 60)).padStart(2, '0')} <span style={{color: DIM, fontSize: 32}}>renderizando…</span></div></Win></>); };
const Logo = ({f}) => (<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 400}}>
  <div style={{width: 420, height: 420, borderRadius: '50%', border: `6px solid ${ACC}`, boxShadow: `0 0 100px ${ACC}88, inset 0 0 80px ${ACC}44`, position: 'relative', transform: `scale(${sp(f, 2)})`, overflow: 'hidden', background: '#0a0f22'}}>
    <div style={{position: 'absolute', inset: 0, background: `conic-gradient(from ${f * 8}deg, ${ACC}88, transparent 30%)`, borderRadius: '50%'}} />
    {[0.3, 0.6].map((s) => <div key={s} style={{position: 'absolute', inset: `${(1 - s) * 50}%`, border: `2px solid ${ACC}66`, borderRadius: '50%'}} />)}</div>
  <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 120, color: '#fff', marginTop: 50, letterSpacing: -2, opacity: pr(f, 8, 20), textShadow: `0 0 50px ${OR}`}}>{BRAND.a} <span style={{color: OR}}>{BRAND.b}</span></div></AbsoluteFill>);
const Radar = ({f}) => { const show = f > 70; return (<>
  <div style={{position: 'absolute', left: 190, top: 150, width: 700, height: 700, borderRadius: '50%', border: `4px solid ${ACC}`, background: '#0a0f22', overflow: 'hidden', boxShadow: `0 0 90px ${ACC}55`, opacity: show ? 0.35 : 1}}>
    <div style={{position: 'absolute', inset: 0, background: `conic-gradient(from ${f * 9}deg, ${ACC}99, transparent 28%)`}} />
    {[0.33, 0.66].map((s) => <div key={s} style={{position: 'absolute', inset: `${(1 - s) * 50}%`, border: `2px solid ${ACC}55`, borderRadius: '50%'}} />)}
    {[[420, 200], [220, 380], [500, 470], [330, 540], [150, 250]].map(([x, y], i) => <div key={i} style={{position: 'absolute', left: x, top: y, width: 28, height: 28, borderRadius: 14, background: OR, boxShadow: `0 0 30px ${OR}`, opacity: pr(f, 10 + i * 10, 18 + i * 10)}} />)}</div>
  {show && [[1, 14, 40], [2, 30, 380], [4, 10, 720]].map(([n, t0, x], i) => <div key={n} style={{position: 'absolute', left: x, top: 330, transform: `scale(${sp(f, 70 + i * 6)})`}}><Phone n={n} t0={t0} w={300} x={0} y={0} /><div style={{position: 'absolute', left: 0, top: 560, width: 300}}><Pill color={OR} style={{fontSize: 30}}>🔥 EM ALTA</Pill></div></div>)}</>); };
const Link = ({f, line}) => { const url = 'reels.com/viral-123'; const v = typed(url, f, 8, 55); const ok = f > 62; const gp = pr(f, 66, line.frames - 8);
  return (<><Win title={`${BRAND.produto.toLowerCase()} — sua versão`} y={170} h={430}><div style={{fontFamily: MONO, color: DIM, fontSize: 26}}>COLE O LINK</div><div style={{marginTop: 14, background: '#0a0d18', border: `2px solid ${ACC}`, borderRadius: 14, padding: '24px 26px', fontFamily: MONO, fontSize: 38, color: '#fff'}}>{v}<span style={{color: OR}}>{f % 14 < 8 && !ok ? '▌' : ''}</span></div>
    {ok && <div style={{marginTop: 22}}><div style={{color: GRN, fontFamily: MONO, fontSize: 30}}>✓ link colado · gerando sua versão…</div><div style={{marginTop: 14}}><Bar p={gp} c={GRN} /></div></div>}</Win>
    <Phone n={1} t0={15} w={380} x={90} y={680} rot={-4} style={{opacity: pr(f, 4, 16)}} /><div style={{position: 'absolute', left: 500, top: 960, fontSize: 120, color: OR, opacity: ok ? 1 : 0}}>➜</div>
    <Phone n={1} t0={50} w={380} x={610} y={680} rot={4} glow={OR} style={{opacity: ok ? pr(f, 70, 90) : 0, filter: 'hue-rotate(160deg)'}}><div style={{position: 'absolute', left: 14, top: 14}}><Pill color={OR} style={{fontSize: 26}}>SUA VERSÃO</Pill></div></Phone></>); };
const Pipeline = ({f}) => { const items = ['Roteiro', 'Narração', 'Legenda', 'Cenas']; const t = pr(f, 0, 100);
  return (<><Win title="editor — timeline" y={180} h={820}>
    <div style={{display: 'flex', gap: 14, marginBottom: 26}}>{items.map((x, i) => <div key={x} style={{flex: 1, padding: '14px 0', textAlign: 'center', borderRadius: 12, fontWeight: 900, fontSize: 28, background: f > 12 + i * 16 ? GRN + '33' : '#161b2e', color: f > 12 + i * 16 ? GRN : DIM, border: `2px solid ${f > 12 + i * 16 ? GRN : '#262d45'}`}}>{f > 12 + i * 16 ? '✓ ' : ''}{x}</div>)}</div>
    <div style={{height: 150, background: '#0a0d18', borderRadius: 12, border: '2px solid #262d45', position: 'relative', overflow: 'hidden', display: 'flex', gap: 6, padding: 8}}>{[1, 2, 3, 4, 5, 1].map((n, i) => <div key={i} style={{flex: 1, borderRadius: 8, overflow: 'hidden', opacity: pr(f, 8 + i * 5, 16 + i * 5)}}><Clip n={n} t0={10 + i * 7} /></div>)}
      <div style={{position: 'absolute', left: `${t * 94}%`, top: 0, bottom: 0, width: 4, background: OR, boxShadow: `0 0 14px ${OR}`}} /></div>
    <div style={{marginTop: 24, display: 'flex', alignItems: 'center', gap: 4, height: 110, background: '#0a0d18', borderRadius: 12, border: '2px solid #262d45', padding: '0 12px', overflow: 'hidden'}}>{Array.from({length: 52}).map((_, i) => <div key={i} style={{flex: 1, height: 12 + 80 * Math.abs(Math.sin(i * 1.3 + f / 4)), background: ACC, borderRadius: 3, opacity: i / 52 < t ? 1 : 0.2}} />)}</div>
    <div style={{marginTop: 24, display: 'flex', gap: 10}}>{['Bem-vindo', 'ao', BRAND.a, BRAND.b].map((w, i) => <div key={w} style={{background: i === Math.floor(t * 4) ? OR : '#1a2036', color: i === Math.floor(t * 4) ? '#000' : '#fff', fontWeight: 900, fontSize: 34, padding: '8px 18px', borderRadius: 10}}>{w}</div>)}</div></Win>
    <Phone n={1} t0={55} w={300} x={690} y={930} rot={6} style={{transform: `rotate(6deg) scale(${sp(f, 60)})`}} /></>); };
const Duvidas = ({f}) => { const I = [['Não sei editar', 'ELE EDITA'], ['Não quero aparecer', 'SEM ROSTO'], ['Já comprei curso', 'SEM TEORIA'], ['Dá muito trabalho', 'RAPIDINHO']];
  return (<>{I.map(([a, b], i) => { const at = 6 + i * 28; return (<div key={a} style={{position: 'absolute', left: 70, right: 70, top: 200 + i * 290, height: 250, borderRadius: 26, background: 'linear-gradient(160deg,#141826,#0c0f1a)', border: `2px solid ${f > at + 14 ? GRN : '#262d45'}`, padding: 34, transform: `translateX(${(1 - sp(f, at)) * 900}px)`, boxShadow: f > at + 14 ? `0 0 40px ${GRN}44` : 'none'}}>
      <div style={{fontFamily: HAND, fontSize: 56, color: f > at + 14 ? DIM : '#fff', textDecoration: f > at + 14 ? 'line-through' : 'none', textDecorationColor: '#ef4444', textDecorationThickness: 6}}>“{a}”</div>
      <div style={{marginTop: 26, opacity: pr(f, at + 14, at + 22)}}><Pill color={GRN} tc="#04210e" style={{fontSize: 48}}>✓ {b}</Pill></div></div>); })}</>); };
const Formato = ({f}) => (<><Phone n={1} t0={38} w={520} x={280} y={170} rot={-2} />
  {[['❤', 90, 380, 20], ['💬', 90, 600, 34], ['➤', 90, 820, 48], ['🔖', 870, 500, 62]].map(([ic, x, y, d], i) => <div key={i} style={{position: 'absolute', left: x, top: y - 30 * pr(f, d, d + 30), fontSize: 110, opacity: pr(f, d, d + 8) * (1 - pr(f, d + 40, d + 70) * 0.5), transform: `scale(${sp(f, d)})`}}>{ic}</div>)}
  <div style={{position: 'absolute', left: 0, right: 0, top: 1300, textAlign: 'center'}}><Pill color={OR} tc="#000" style={{fontSize: 56}}>⏱ ensina em segundos</Pill></div></>);
const Nichos = ({f}) => (<><div style={{position: 'absolute', left: 70, right: 70, top: 200, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30}}>{[['🍽', 'Restaurante'], ['🦷', 'Clínica'], ['👗', 'Loja de roupa'], ['🛒', 'Site de vendas']].map(([ic, n], i) => <div key={n} style={{height: 380, borderRadius: 30, background: 'linear-gradient(160deg,#141826,#0c0f1a)', border: `2px solid ${f > 14 + i * 14 ? ACC : '#262d45'}`, textAlign: 'center', paddingTop: 70, fontFamily: SANS, transform: `scale(${sp(f, 6 + i * 14)})`, boxShadow: f > 14 + i * 14 ? `0 0 40px ${ACC}44` : 'none'}}><div style={{fontSize: 150}}>{ic}</div><div style={{fontWeight: 900, fontSize: 44, color: '#fff', marginTop: 20}}>{n}</div></div>)}</div>
  <Phone n={3} t0={40} w={300} x={390} y={1000} rot={0} style={{transform: `scale(${sp(f, 60)})`, opacity: 0.9}} /></>);
const Tres = ({f}) => (<div style={{position: 'absolute', left: 80, right: 80, top: 230}}>{[['🎥', 'APARECER NA CÂMERA'], ['✂️', 'SABER EDITAR'], ['👤', 'TER SEGUIDOR']].map(([ic, t], i) => { const at = 6 + i * 26; return <div key={t} style={{height: 250, marginBottom: 40, borderRadius: 26, background: 'linear-gradient(160deg,#141826,#0c0f1a)', border: '2px solid #262d45', display: 'flex', alignItems: 'center', gap: 30, padding: '0 40px', position: 'relative', transform: `scale(${sp(f, at - 4)})`}}>
    <div style={{fontSize: 110}}>{ic}</div><div style={{fontFamily: SANS, fontWeight: 900, fontSize: 52, color: f > at + 10 ? DIM : '#fff'}}>{t}</div>
    <div style={{position: 'absolute', left: 30, top: 118, width: 880 * pr(f, at + 8, at + 18), height: 16, background: '#ef4444', transform: 'rotate(-3deg)', boxShadow: '0 0 24px #ef4444'}} /></div>; })}</div>);
const Simples = ({f, line}) => (<><Win title={`${BRAND.produto.toLowerCase()} — nova ideia`} y={200} h={560}><div style={{color: DIM, fontFamily: MONO, fontSize: 28}}>Que vídeo vamos fazer hoje?</div><div style={{marginTop: 18, background: '#0a0d18', border: `2px solid ${ACC}`, borderRadius: 14, padding: 26, fontSize: 44, fontWeight: 700, minHeight: 150}}>{typed('Por que ninguém mais usa fita cassete?', f, 6, 50)}<span style={{color: OR}}>▌</span></div>
  <div style={{marginTop: 26}}><Pill color={OR} tc="#000" style={{fontSize: 40, borderRadius: 14}}>GERAR VÍDEO ➜</Pill></div></Win>
  <Phone n={1} t0={60} w={340} x={370} y={820} rot={0} style={{transform: `scale(${sp(f, 55)})`}} /></>);
const Cta = ({f}) => (<AbsoluteFill style={{background: 'linear-gradient(180deg,#07040f,#1a0b3a 55%,#3a0f4a)', alignItems: 'center'}}>
  <div style={{position: 'absolute', left: 190, top: 520, width: 700, height: 700, borderRadius: '50%', background: `linear-gradient(#ffd166,${OR} 55%,#e0245e)`, boxShadow: `0 0 140px ${OR}88`, clipPath: 'inset(0 0 22% 0)'}} />
  <div style={{position: 'absolute', left: -300, right: -300, top: 1000, height: 920, backgroundImage: 'linear-gradient(#ff4fd8 2px,transparent 2px),linear-gradient(90deg,#ff4fd8 2px,transparent 2px)', backgroundSize: '100px 100px', transform: 'perspective(600px) rotateX(62deg)', transformOrigin: 'top', backgroundPositionY: f * 3, opacity: 0.55}} />
  <div style={{position: 'absolute', top: 230, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 130, color: '#fff', textShadow: `0 0 50px ${OR}`, transform: `scale(${sp(f, 2)})`, lineHeight: 1}}>{BRAND.a}<br /><span style={{color: '#ffd166'}}>{BRAND.b}</span></div>
  <div style={{position: 'absolute', top: 1180, fontFamily: SANS, fontWeight: 900, fontSize: 74, color: '#0b0d14', background: '#fff', padding: '26px 80px', borderRadius: 24, transform: `scale(${1 + 0.05 * Math.sin(f / 4)})`, boxShadow: `0 0 70px ${ACC}`}}>Saiba mais ›</div>
  <div style={{position: 'absolute', top: 1460, fontSize: 120, color: '#fff', transform: `translateY(${Math.sin(f / 5) * 14}px)`, lineHeight: 0.7}}>⌄<br />⌄</div></AbsoluteFill>);

// ---------- mascote RADI + cenas do v15 ----------
const Radi = ({f, talk, size = 280, pose = 'idle'}) => { const open = talk && Math.floor(f / 4) % 2 === 0, blink = f % 110 > 104, bob = Math.sin(f / 9) * 8, wave = pose === 'wave' ? Math.sin(f / 3) * 18 : 0;
  return (<svg viewBox="0 0 200 230" width={size} height={size * 1.15} style={{transform: `translateY(${bob}px)`, overflow: 'visible'}}>
    <defs><linearGradient id="rb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9cc4ff" /><stop offset="1" stopColor="#3b6fe0" /></linearGradient>
      <radialGradient id="rg"><stop offset="0" stopColor="#4f9bff" stopOpacity=".6" /><stop offset="1" stopColor="#4f9bff" stopOpacity="0" /></radialGradient></defs>
    <ellipse cx="100" cy="222" rx="60" ry="9" fill="url(#rg)" />
    <line x1="100" y1="52" x2="100" y2="68" stroke="#cfd8ee" strokeWidth="5" strokeLinecap="round" />
    <ellipse cx="100" cy="40" rx="42" ry="15" fill="#eef3ff" stroke="#9aa8d0" strokeWidth="3" transform={`rotate(${Math.sin(f / 18) * 8} 100 40)`} />
    <circle cx="100" cy="26" r="8" fill="#ff7a2f" opacity={0.55 + 0.45 * Math.abs(Math.sin(f / 7))} />
    <rect x="28" y="62" width="144" height="138" rx="54" fill="url(#rb)" stroke="#2a52b8" strokeWidth="4" />
    <rect x="46" y="84" width="108" height="74" rx="34" fill="#0b1226" />
    <ellipse cx="78" cy="118" rx="14" ry={blink ? 2 : 17} fill="#8ff3ff" /><ellipse cx="122" cy="118" rx="14" ry={blink ? 2 : 17} fill="#8ff3ff" />
    {!blink && <><circle cx="82" cy="111" r="5" fill="#fff" /><circle cx="126" cy="111" r="5" fill="#fff" /></>}
    <circle cx="58" cy="140" r="7" fill="#ff8fb3" opacity=".7" /><circle cx="142" cy="140" r="7" fill="#ff8fb3" opacity=".7" />
    {open ? <ellipse cx="100" cy="144" rx="10" ry="8" fill="#ff6b8a" /> : <path d="M86 140 Q100 152 114 140" stroke="#8ff3ff" strokeWidth="5" fill="none" strokeLinecap="round" />}
    <circle cx="100" cy="178" r="9" fill="#ff7a2f" /><circle cx="100" cy="178" r="4" fill="#fff" />
    <circle cx="20" cy="140" r="14" fill="#7fb0ff" stroke="#2a52b8" strokeWidth="3" transform={`rotate(${wave} 28 130)`} /><circle cx="180" cy="140" r="14" fill="#7fb0ff" stroke="#2a52b8" strokeWidth="3" />
    <rect x="62" y="198" width="30" height="16" rx="8" fill="#2a52b8" /><rect x="108" y="198" width="30" height="16" rx="8" fill="#2a52b8" /></svg>); };
const Hist = ({f}) => (<><Phone n={1} t0={22} w={560} x={260} y={150} glow="#ef4444" />
  <div style={{position: 'absolute', left: 40, top: 230, transform: `scale(${sp(f, 8)}) rotate(-6deg)`}}><Pill color="#ef4444" style={{fontSize: 50}}>📖 HISTORINHA</Pill></div>
  <div style={{position: 'absolute', right: 40, top: 520, transform: `scale(${sp(f, 24)}) rotate(5deg)`}}><Pill color="#fff" tc="#0b0d14" style={{fontSize: 46}}>você assistiu até o fim</Pill></div></>);
const Dia = ({f}) => (<><div style={{position: 'absolute', left: 0, right: 0, top: 160, textAlign: 'center', transform: `scale(${sp(f, 2)})`}}><Pill color={OR} tc="#000" style={{fontSize: 70}}>TODO DIA</Pill></div>
  {Array.from({length: 8}).map((_, i) => <Phone key={i} n={[1, 2, 3, 4, 5][i % 5]} t0={8 + i * 5} w={200} x={60 + (i % 4) * 240} y={330 + Math.floor(i / 4) * 450} rot={(i % 2 ? 3 : -3)} style={{transform: `rotate(${i % 2 ? 3 : -3}deg) scale(${sp(f, 6 + i * 7)})`}}><div style={{position: 'absolute', left: 8, top: 8, background: OR, color: '#000', fontFamily: SANS, fontWeight: 900, fontSize: 24, padding: '2px 12px', borderRadius: 10}}>DIA {i + 1}</div></Phone>)}</>);
const Maquina = ({f}) => { const out = pr(f, 20, 60); return (<>
  <div style={{position: 'absolute', left: 120, top: 190, width: 840, height: 720, borderRadius: 40, background: 'linear-gradient(160deg,#1b2340,#0d1224)', border: `4px solid ${ACC}`, boxShadow: `0 0 90px ${ACC}55`, overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: 40, top: 30, fontFamily: SANS, fontWeight: 900, fontSize: 64, color: '#fff'}}>MÁQUINA <span style={{color: OR}}>{BRAND.b}</span></div>
    <div style={{position: 'absolute', left: 60, top: 170, fontSize: 190, transform: `rotate(${f * 4}deg)`, filter: `drop-shadow(0 0 20px ${ACC})`}}>⚙️</div>
    <div style={{position: 'absolute', left: 330, top: 260, fontSize: 130, transform: `rotate(${-f * 5}deg)`}}>⚙️</div>
    <div style={{position: 'absolute', right: 50, top: 150, display: 'flex', flexDirection: 'column', gap: 16}}>{['#ef4444', '#fbbf24', '#22c55e'].map((c, i) => <div key={c} style={{width: 40, height: 40, borderRadius: 20, background: c, opacity: Math.sin(f / 4 + i * 2) > 0 ? 1 : 0.3, boxShadow: `0 0 20px ${c}`}} />)}</div>
    <div style={{position: 'absolute', left: 60, bottom: 0, width: 720, height: 90, background: '#05070f', borderRadius: '20px 20px 0 0'}} /></div>
  <Phone n={1} t0={30} w={300} x={390} y={930} style={{transform: `translateY(${(1 - out) * -420}px)`, opacity: pr(f, 18, 30)}} /></>); };
const Esteira = ({f, line}) => { const S = [['🔎', 'ACHA'], ['📝', 'ROTEIRO'], ['🎙', 'VOZ'], ['💬', 'LEGENDA'], ['✅', 'PRONTO']]; const p = pr(f, 8, line.frames - 16), cur = Math.min(4, Math.floor(p * 5));
  return (<><div style={{position: 'absolute', left: 70, top: 200, display: 'flex', gap: 22}}>{S.map(([ic, n], i) => <div key={n} style={{width: 170, height: 250, borderRadius: 24, background: 'linear-gradient(160deg,#141826,#0c0f1a)', border: `3px solid ${i <= cur ? (i === 4 ? GRN : OR) : '#262d45'}`, textAlign: 'center', paddingTop: 36, boxShadow: i <= cur ? `0 0 40px ${i === 4 ? GRN : OR}55` : 'none', transform: `scale(${sp(f, i * 6)})`}}><div style={{fontSize: 80}}>{ic}</div><div style={{fontFamily: SANS, fontWeight: 900, fontSize: 28, color: i <= cur ? '#fff' : DIM, marginTop: 14}}>{n}</div></div>)}</div>
    <div style={{position: 'absolute', left: 40, right: 40, top: 520, height: 46, borderRadius: 23, background: '#10131f', border: '2px solid #262d45', overflow: 'hidden'}}>{Array.from({length: 30}).map((_, i) => <div key={i} style={{position: 'absolute', left: ((i * 40 + f * 6) % 1200) - 100, top: 18, width: 24, height: 10, background: '#2a3050', borderRadius: 5}} />)}</div>
    <div style={{position: 'absolute', left: 40 + p * 880, top: 430, width: 110, height: 100, borderRadius: 18, background: cur === 4 ? GRN : OR, boxShadow: `0 0 40px ${cur === 4 ? GRN : OR}`, fontSize: 60, textAlign: 'center', lineHeight: '100px'}}>{cur === 4 ? '🎬' : '📦'}</div>
    <Phone n={1} t0={40} w={360} x={360} y={690} style={{transform: `scale(${sp(f, line.frames - 40)})`, opacity: pr(f, line.frames - 40, line.frames - 28)}} /></>); };
const Compara = ({f}) => { const sec = Math.floor(f * 45), tm = `${String(Math.floor(sec / 3600)).padStart(2, '0')}:${String(Math.floor(sec / 60) % 60).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`; const gp = pr(f, 6, 70);
  return (<><Win title="à mão" x={70} y={200} w={450} h={620}><div style={{fontSize: 90, textAlign: 'center'}}>😫</div><div style={{fontFamily: MONO, fontSize: 52, color: '#ef4444', textAlign: 'center', marginTop: 20, fontWeight: 900}}>{tm}</div><div style={{textAlign: 'center', color: DIM, fontSize: 30, marginTop: 18}}>editando…</div></Win>
    <Win title="máquina" x={560} y={200} w={450} h={620}><div style={{fontSize: 90, textAlign: 'center'}}>⚙️</div><div style={{marginTop: 34}}><Bar p={gp} c={GRN} /></div><div style={{textAlign: 'center', color: GRN, fontSize: 52, fontWeight: 900, marginTop: 30, opacity: pr(f, 66, 76)}}>✓ PRONTO</div></Win>
    <Phone n={1} t0={60} w={320} x={380} y={880} style={{transform: `scale(${sp(f, 70)})`, opacity: pr(f, 70, 80)}} /></>); };

// ---------- personagem LEO (criador, bonitinho) + cenas AD2 ----------
const Leo = ({f, talk, size = 250, mood = 'happy', wave = true}) => { const open = talk && Math.floor(f / 4) % 2 === 0, blink = f % 120 > 114, bob = Math.sin(f / 10) * 7, arm = wave ? Math.sin(f / 4) * 14 : 0;
  const hair = '#4a2e22', skin = '#f7d2b0', hood = '#4f9bff', hoodD = '#2f6fe0';
  return (<svg viewBox="0 0 200 240" width={size} height={size * 1.2} style={{transform: `translateY(${bob}px)`, overflow: 'visible'}}>
    <defs><linearGradient id="lh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7db4ff" /><stop offset="1" stopColor={hoodD} /></linearGradient></defs>
    <ellipse cx="100" cy="232" rx="62" ry="8" fill="#000" opacity=".35" />
    <path d="M36 236 Q36 156 100 152 Q164 156 164 236 Z" fill="url(#lh)" /><path d="M70 154 Q100 176 130 154 L122 148 Q100 164 78 148 Z" fill={hoodD} />
    <line x1="88" y1="170" x2="86" y2="196" stroke="#fff" strokeWidth="4" strokeLinecap="round" /><line x1="112" y1="170" x2="114" y2="196" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
    <ellipse cx="38" cy="186" rx="15" ry="30" fill={hood} transform="rotate(14 40 160)" /><circle cx="32" cy="214" r="12" fill={skin} />
    <g transform={`rotate(${arm} 160 165)`}><ellipse cx="164" cy="168" rx="15" ry="30" fill={hood} transform="rotate(-22 160 160)" /><circle cx="176" cy="140" r="12" fill={skin} /></g>
    <rect x="88" y="126" width="24" height="28" rx="10" fill={skin} />
    <ellipse cx="100" cy="92" rx="58" ry="54" fill={skin} /><ellipse cx="44" cy="96" rx="8" ry="11" fill={skin} /><ellipse cx="156" cy="96" rx="8" ry="11" fill={skin} />
    <path d="M42 88 Q36 26 100 24 Q164 26 158 88 Q150 56 128 54 Q104 64 80 50 Q54 54 42 88 Z" fill={hair} /><path d="M66 40 Q96 14 134 34" stroke={hair} strokeWidth="14" fill="none" strokeLinecap="round" />
    <path d="M40 92 Q36 20 100 18 Q164 20 160 92" stroke="#222a3d" strokeWidth="8" fill="none" strokeLinecap="round" />
    <rect x="28" y="84" width="20" height="34" rx="10" fill="#ff7a2f" stroke="#222a3d" strokeWidth="4" /><rect x="152" y="84" width="20" height="34" rx="10" fill="#ff7a2f" stroke="#222a3d" strokeWidth="4" />
    {blink ? (<><path d="M64 98 Q78 106 92 98" stroke="#2a1c18" strokeWidth="5" fill="none" strokeLinecap="round" /><path d="M108 98 Q122 106 136 98" stroke="#2a1c18" strokeWidth="5" fill="none" strokeLinecap="round" /></>) : (<>
      <ellipse cx="78" cy="98" rx="13" ry={mood === 'wow' ? 18 : 16} fill="#2a1c18" /><ellipse cx="122" cy="98" rx="13" ry={mood === 'wow' ? 18 : 16} fill="#2a1c18" />
      <circle cx="73" cy="91" r="5.5" fill="#fff" /><circle cx="117" cy="91" r="5.5" fill="#fff" /><circle cx="83" cy="105" r="2.5" fill="#fff" /><circle cx="127" cy="105" r="2.5" fill="#fff" /></>)}
    {mood === 'worried' ? (<><path d="M62 78 L90 70" stroke={hair} strokeWidth="5" strokeLinecap="round" /><path d="M138 78 L110 70" stroke={hair} strokeWidth="5" strokeLinecap="round" /></>) : (<><path d="M62 74 Q76 66 92 72" stroke={hair} strokeWidth="5" fill="none" strokeLinecap="round" /><path d="M108 72 Q124 66 138 74" stroke={hair} strokeWidth="5" fill="none" strokeLinecap="round" /></>)}
    <ellipse cx="62" cy="118" rx="11" ry="7" fill="#ff8fa3" opacity=".55" /><ellipse cx="138" cy="118" rx="11" ry="7" fill="#ff8fa3" opacity=".55" />
    {[[68, 112], [74, 116], [128, 116], [134, 112]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1.8" fill="#c98a5b" />)}
    {mood === 'worried' ? (open ? <ellipse cx="100" cy="132" rx="9" ry="7" fill="#7a2f2f" /> : <path d="M88 134 Q100 124 112 134" stroke="#7a2f2f" strokeWidth="5" fill="none" strokeLinecap="round" />)
      : mood === 'wow' ? <ellipse cx="100" cy="130" rx="10" ry="12" fill="#7a2f2f" />
      : open ? <><path d="M84 122 Q100 148 116 122 Z" fill="#7a2f2f" /><path d="M92 136 Q100 142 108 136 Q100 132 92 136 Z" fill="#ff7a8a" /></> : <path d="M84 124 Q100 140 116 124" stroke="#7a2f2f" strokeWidth="5" fill="none" strokeLinecap="round" />}
    {mood === 'worried' && <path d="M158 66 Q166 82 158 90 Q150 82 158 66 Z" fill="#8fd3ff" opacity={0.6 + 0.4 * Math.sin(f / 5)} />}</svg>); };
const MOOD = {edicao: 'worried', horas: 'worried', resultado: 'wow'};
const Thumb = ({n, t0 = 0, w = 120, style}) => <div style={{width: w, height: w * 1.78, borderRadius: w * 0.14, overflow: 'hidden', border: '3px solid #1d2130', flexShrink: 0, ...style}}><Clip n={n} t0={t0} /></div>;
const Edicao = ({f}) => { const sec = 4000 + f * 37; const tm = `${String(Math.floor(sec / 3600)).padStart(2, '0')}:${String(Math.floor(sec / 60) % 60).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
  return (<Win title="Editando…" y={170} h={900}>
    <div style={{position: 'absolute', right: 34, top: 20, fontFamily: SANS, fontWeight: 900, fontSize: 56, color: '#ef4444', textShadow: '0 0 24px #ef444488'}}>{tm}</div>
    <div style={{display: 'flex', gap: 24, marginTop: 80}}><Thumb n={1} t0={25} w={230} /><div style={{flex: 1}}>{['Cortar', 'Legenda', 'Efeitos', 'Exportar'].map((x, i) => <div key={x} style={{padding: '16px 20px', marginBottom: 12, borderRadius: 12, background: i === Math.floor(f / 24) % 4 ? '#1d3a70' : '#171c2f', border: `2px solid ${i === Math.floor(f / 24) % 4 ? ACC : '#262d45'}`, fontSize: 32, fontWeight: 700}}>{x}</div>)}</div></div>
    <div style={{marginTop: 34}}>{[0, 1, 2].map((r) => <div key={r} style={{height: 84, marginBottom: 14, background: '#0a0d18', borderRadius: 10, border: '2px solid #262d45', display: 'flex', gap: 5, padding: 6, overflow: 'hidden'}}>{Array.from({length: 7}).map((_, i) => <div key={i} style={{flex: 1, borderRadius: 6, overflow: 'hidden'}}><Clip n={((i + r) % 5) + 1} t0={5 + i * 6 + r * 3} /></div>)}</div>)}
      <div style={{position: 'relative', height: 0}}><div style={{position: 'absolute', left: `${(f * 0.9) % 100}%`, top: -270, width: 4, height: 270, background: OR, boxShadow: `0 0 14px ${OR}`}} /></div></div></Win>); };
const Horas = ({f}) => (<><div style={{position: 'absolute', left: 0, right: 0, top: 230, display: 'flex', justifyContent: 'center', gap: 24, opacity: 0.35}}>{[2, 3, 4].map((n, i) => <Thumb key={n} n={n} t0={10 + i * 8} w={240} />)}</div>
  <svg viewBox="0 0 400 400" style={{position: 'absolute', left: 190, top: 180, width: 700, height: 700, transform: `scale(${sp(f, 2)})`}}><circle cx="200" cy="200" r="186" fill="#0c0f1a" stroke="#262d45" strokeWidth="10" />
    {Array.from({length: 12}).map((_, i) => <line key={i} x1="200" y1="30" x2="200" y2={i % 3 === 0 ? 56 : 44} stroke="#8d93a8" strokeWidth={i % 3 === 0 ? 8 : 4} transform={`rotate(${i * 30} 200 200)`} />)}
    <line x1="200" y1="200" x2="200" y2="70" stroke="#fff" strokeWidth="8" strokeLinecap="round" transform={`rotate(${f * 9} 200 200)`} /><line x1="200" y1="200" x2="200" y2="112" stroke={OR} strokeWidth="12" strokeLinecap="round" transform={`rotate(${f * 0.75} 200 200)`} /><circle cx="200" cy="200" r="12" fill={ACC} /></svg></>);
const Ideia = ({f}) => (<><div style={{position: 'absolute', left: 340, top: 150, fontSize: 280, filter: `drop-shadow(0 0 ${40 + 30 * Math.sin(f / 6)}px #fbbf24)`, transform: `scale(${sp(f, 2)})`}}>💡</div>
  <Win title={BRAND.produto.toLowerCase()} y={520} h={330}><div style={{color: DIM, fontFamily: MONO, fontSize: 26}}>Peça o que quiser</div><div style={{marginTop: 12, background: '#0a0d18', border: `2px solid ${ACC}`, borderRadius: 14, padding: '22px 24px', fontSize: 40, fontWeight: 700}}>{typed('Faz meus vídeos da semana', f, 14, 60)}<span style={{color: OR}}>▌</span></div></Win>
  <Phone n={1} t0={35} w={250} x={730} y={930} rot={5} style={{transform: `rotate(5deg) scale(${sp(f, 50)})`}} /></>);
const Semana = ({f}) => (<><Win title="Faz meus vídeos da semana" y={190} h={640}><div style={{display: 'flex', gap: 10}}>{['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'].map((d, i) => <div key={d} style={{flex: 1, textAlign: 'center', transform: `scale(${sp(f, 6 + i * 8)})`}}><Thumb n={(i % 5) + 1} t0={8 + i * 6} w={108} /><div style={{fontFamily: MONO, color: DIM, fontSize: 22, marginTop: 10}}>{d}</div><div style={{color: GRN, fontSize: 36, opacity: pr(f, 14 + i * 8, 22 + i * 8)}}>✓</div></div>)}</div>
    <div style={{marginTop: 30}}><Bar p={pr(f, 6, 70)} c={GRN} /></div><div style={{textAlign: 'center', color: GRN, fontFamily: MONO, fontSize: 30, marginTop: 14}}>7 vídeos prontos</div></Win></>);
const Copia = ({f}) => (<><div style={{position: 'absolute', left: 70, top: 220, width: 380, height: 700 * 0.9}}><Phone n={2} t0={12} w={380} x={0} y={0} /><div style={{position: 'absolute', left: 0, top: 700, width: 380, textAlign: 'center'}}><Pill color="#1d2130" style={{fontSize: 34}}>Reel viral</Pill></div></div>
  <div style={{position: 'absolute', left: 480, top: 470, fontSize: 120, color: OR, transform: `translateX(${Math.sin(f / 4) * 10}px)`, opacity: pr(f, 18, 30)}}>➜</div>
  <div style={{position: 'absolute', left: 620, top: 220, opacity: pr(f, 26, 40), transform: `scale(${0.85 + 0.15 * sp(f, 26)})`}}><Phone n={1} t0={22} w={380} x={0} y={0} glow={OR} style={{border: `10px solid ${OR}`}} /><div style={{position: 'absolute', left: 0, top: 700, width: 380, textAlign: 'center'}}><Pill color={OR} tc="#000" style={{fontSize: 34}}>Seu Reels</Pill></div></div></>);
const Lista = ({f}) => (<Win title="Em alta no seu nicho" y={170} h={1060}><div style={{display: 'inline-block', background: GRN + '33', color: GRN, border: `2px solid ${GRN}`, borderRadius: 999, padding: '4px 18px', fontFamily: MONO, fontSize: 24, marginBottom: 18}}>NOVO HOJE</div>
  {['bastidores', 'antes e depois', 'passo a passo', 'dica rápida', 'storytelling'].map((t, i) => <div key={t} style={{display: 'flex', alignItems: 'center', gap: 24, marginBottom: 16, padding: 12, borderRadius: 18, background: '#171c2f', border: '2px solid #262d45', transform: `translateX(${(1 - sp(f, 4 + i * 9)) * 800}px)`}}><Thumb n={(i % 5) + 1} t0={6 + i * 7} w={96} /><div style={{flex: 1, fontSize: 38, fontWeight: 800}}>Reel · {t}</div><Pill color={OR} tc="#000" style={{fontSize: 24, padding: '4px 14px'}}>🔥 EM ALTA</Pill></div>)}</Win>);
const Resultado = ({f}) => (<><div style={{position: 'absolute', left: 70, right: 70, top: 190}}>{[['Alcance', ACC, 0.9], ['Seguidores', GRN, 0.78], ['Vendas', OR, 0.66]].map(([n, c, v], i) => <div key={n} style={{marginBottom: 34, padding: 34, borderRadius: 28, background: 'linear-gradient(160deg,#141826,#0c0f1a)', border: `2px solid ${c}66`, transform: `scale(${sp(f, 4 + i * 12)})`}}><div style={{display: 'flex', justifyContent: 'space-between', fontFamily: SANS, fontWeight: 900, fontSize: 58, color: '#fff'}}>{n}<span style={{color: c, fontSize: 70}}>▲</span></div><div style={{marginTop: 18}}><Bar p={v * pr(f, 10 + i * 12, 50 + i * 12)} c={c} /></div></div>)}</div>
  <Phone n={1} t0={50} w={260} x={760} y={900} rot={6} style={{opacity: pr(f, 40, 52)}} /></>);

const SC = {edicao: Edicao, horas: Horas, ideia: Ideia, semana: Semana, copia: Copia, lista: Lista, resultado: Resultado, hist: Hist, dia: Dia, maquina: Maquina, esteira: Esteira, compara: Compara, mosaic: Mosaic, fora: Fora, rise: Rise, editar: Editar, logo: Logo, radar: Radar, link: Link, pipeline: Pipeline, duvidas: Duvidas, formato: Formato, nichos: Nichos, tres: Tres, simples: Simples};
const GL = {rise: GRN, editar: '#ef4444', logo: OR, duvidas: GRN, nichos: ACC};

const Scene = ({line}) => { const f = useCurrentFrame(); const per = line.person && <div style={{position: 'absolute', left: 10, top: 1235}}><Leo f={f} talk={f < Math.ceil(line.dur * FPS)} size={275} mood={MOOD[line.scene] || 'happy'} /></div>;
  const mas = per || line.mascot && <div style={{position: 'absolute', left: 30, top: 1285}}><Radi f={f} talk={f < Math.ceil(line.dur * FPS)} size={230} pose="wave" /></div>;
  if (line.scene === 'cta') return <AbsoluteFill><Cta f={f} />{mas}</AbsoluteFill>; const C = SC[line.scene] || Mosaic;
  return (<AbsoluteFill><Bg f={f} glow={GL[line.scene] || ACC} /><C f={f} line={line} />{mas}<Caption line={line} f={f} /></AbsoluteFill>); };

export const VslVideo = ({m}) => { const {lines} = build(m); return (
  <AbsoluteFill style={{background: BG}}>
    <Audio src={staticFile('audio/music.mp3')} volume={0.1} loop />
    {lines.map((l) => (<Sequence key={l.id + l.start} from={l.start} durationInFrames={l.frames}>
      <Audio src={staticFile(`voz/${l.file}`)} volume={1} /><Audio src={staticFile('audio/whoosh.wav')} volume={0.16} />
      {l.scene === 'cta' && <Sequence from={14}><Audio src={staticFile('audio/ding.wav')} volume={0.3} /></Sequence>}
      <Scene line={l} /></Sequence>))}
  </AbsoluteFill>); };
