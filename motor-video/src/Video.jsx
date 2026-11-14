import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, Easing} from 'remotion';
import {Robot, Creator, cfg} from './Chars.jsx';

export const BRAND = {nome: 'RADAR VIRAL', a: 'RADAR', b: 'VIRAL', produto: 'Radar Viral', slug: 'radarviral'}; // trocado por projeto via roteiro.marca
export const FPS = 30;
export const GAP = 2; // frames entre falas (voz colada)
export const BLUE = '#4f9bff', ORANGE = '#e8743b';
export const SANS = '"Segoe UI Black","Arial Black",Arial,sans-serif';
const SERIF = 'Georgia,"Times New Roman",serif';

export const build = (manifest) => { let acc = 0;
  const lines = manifest.map((l) => { const frames = Math.ceil(l.dur * FPS) + GAP; const o = {...l, start: acc, frames}; acc += frames; return o; });
  return {lines, total: acc + 12}; };

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};
export const pop = (f, d = 0, cfg = {damping: 12, stiffness: 140}) => spring({frame: f - d, fps: FPS, config: cfg});

export const Card = ({children, style}) => (
  <div style={{background: 'linear-gradient(160deg,#12151c,#0a0c11)', border: '2px solid #262c3a', borderRadius: 40,
    boxShadow: '0 30px 80px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.06)', color: '#e8ecf4', fontFamily: SANS, ...style}}>{children}</div>
);
export const Thumb = ({w = 120, h = 160, hue = 210, r = 18}) => (
  <div style={{width: w, height: h, borderRadius: r, background: `linear-gradient(150deg,hsl(${hue} 70% 45%),hsl(${hue + 50} 60% 22%))`, position: 'relative', flexShrink: 0}}>
    <div style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: w * 0.32, height: w * 0.32, borderRadius: '50%', background: 'rgba(255,255,255,.85)'}}>
      <div style={{marginLeft: w * 0.12, marginTop: w * 0.07, borderLeft: `${w * 0.13}px solid #111`, borderTop: `${w * 0.09}px solid transparent`, borderBottom: `${w * 0.09}px solid transparent`, width: 0, height: 0}} />
    </div>
  </div>
);
export const Center = ({children, style}) => <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', ...style}}>{children}</AbsoluteFill>;
export const Pill = ({children, color = BLUE, style}) => (
  <div style={{background: color + '22', border: `2px solid ${color}`, color, borderRadius: 999, padding: '10px 26px', fontFamily: SANS, fontSize: 34, letterSpacing: 2, ...style}}>{children}</div>
);

// ---------- cenas (f = frame local, d = duração) ----------
const Gancho = ({f}) => {
  const p = pop(f), flick = f % 22 < 3 ? 0.5 : 1;
  return (<Center style={{top: -120}}>
    <div style={{transform: `scale(${0.8 + 0.2 * p})`, opacity: p}}>
      <Card style={{width: 560, height: 960, padding: 34, position: 'relative', overflow: 'hidden', borderRadius: 80}}>
        <div style={{width: '100%', height: 640, borderRadius: 40, background: 'linear-gradient(160deg,#171a22,#0a0b0f)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: flick}}>
          <div style={{fontSize: 120, color: '#2b3142'}}>▶</div>
        </div>
        <div style={{marginTop: 40, display: 'flex', gap: 24, alignItems: 'baseline'}}>
          <span style={{fontSize: 130, color: '#ff5a5a', opacity: flick}}>0</span><span style={{fontSize: 44, color: '#6b7388'}}>visualizações</span>
        </div>
        <div style={{height: 18, width: '70%', background: '#1b2030', borderRadius: 9, marginTop: 30}} />
        <div style={{height: 18, width: '45%', background: '#1b2030', borderRadius: 9, marginTop: 18}} />
      </Card>
    </div>
    <div style={{position: 'absolute', left: -10, bottom: 560, transform: `translateY(${(1 - p) * 200}px)`}}><Creator size={340} mood="worried" shrug={Math.sin(f / 6) * 0.3 + 0.3} /></div>
  </Center>);
};
const Adivinhar = ({f}) => {
  const pos = [[110, 360, -8], [640, 300, 10], [160, 780, 6], [660, 760, -10]];
  return (<Center>
    {pos.map(([x, y, r], i) => {
      const p = pop(f, i * 3), bob = Math.sin(f / 8 + i * 2) * 14;
      return <div key={i} style={{position: 'absolute', left: x, top: y + bob, transform: `scale(${p}) rotate(${r}deg)`}}>
        <Card style={{width: 290, height: 290, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 190, color: BLUE}}>?</Card></div>;
    })}
    <div style={{position: 'absolute', bottom: 560, transform: `scale(${pop(f, 4)})`}}><Creator size={520} mood="worried" shrug={0.5 + Math.sin(f / 5) * 0.5} /></div>
  </Center>);
};
const Radar = ({f}) => {
  const p = pop(f), ang = f * 7;
  const blips = [[300, 240, '+1,2M', 14], [640, 420, '+840K', 30], [420, 600, '+2,1M', 48], [720, 220, '+530K', 66]];
  return (<Center style={{top: -150}}>
    <div style={{position: 'relative', width: 860, height: 860, transform: `scale(${0.7 + 0.3 * p})`, opacity: p}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle,#0c1a2e,#070a10 70%)', border: '3px solid #1d3b66', boxShadow: `0 0 120px ${BLUE}55`}} />
      {[0.33, 0.66, 1].map((s) => <div key={s} style={{position: 'absolute', left: 430 - 430 * s, top: 430 - 430 * s, width: 860 * s, height: 860 * s, borderRadius: '50%', border: '2px solid #1d3b6699'}} />)}
      <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: `conic-gradient(from ${ang}deg,${BLUE}00 0deg,${BLUE}00 280deg,${BLUE}aa 360deg)`}} />
      {blips.map(([x, y, t, d], i) => { const q = pop(f, d); return (
        <div key={i} style={{position: 'absolute', left: x, top: y, transform: `scale(${q})`}}>
          <div style={{width: 34, height: 34, borderRadius: '50%', background: '#ff4d6d', boxShadow: '0 0 40px #ff4d6d'}} />
          <Card style={{position: 'absolute', left: 44, top: -26, padding: '8px 22px', borderRadius: 22, fontSize: 40, whiteSpace: 'nowrap', color: '#7dffb0'}}>{t}</Card>
        </div>); })}
    </div>
    <div style={{position: 'absolute', right: 30, bottom: 560, transform: `translateY(${(1 - pop(f, 10)) * 300}px)`}}><Robot size={330} blink={f % 70 < 4} /></div>
  </Center>);
};
const Segundos = ({f, d}) => {
  const prog = interpolate(f, [4, d - 6], [0, 100], {...clamp, easing: Easing.out(Easing.cubic)});
  const rows = [['Reel #1', 'alta agora', 210], ['Reel #2', 'subindo', 260], ['Reel #3', 'subindo', 320]];
  return (<Center style={{top: -100}}>
    <div style={{transform: `scale(${0.85 + 0.15 * pop(f)})`, opacity: pop(f)}}>
      <Card style={{width: 860, padding: 44}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 44}}><span>{BRAND.produto}</span><span style={{color: BLUE}}>{Math.round(prog)}%</span></div>
        <div style={{height: 22, background: '#1a1f2c', borderRadius: 11, margin: '26px 0 40px'}}><div style={{width: `${prog}%`, height: '100%', borderRadius: 11, background: `linear-gradient(90deg,#2b6cff,${BLUE})`, boxShadow: `0 0 30px ${BLUE}`}} /></div>
        {rows.map(([a, b, h], i) => { const q = pop(f, 10 + i * 8); return (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 28, padding: '18px 0', opacity: q, transform: `translateX(${(1 - q) * 120}px)`, borderTop: '1px solid #1f2433'}}>
            <Thumb w={100} h={130} hue={h} /><div style={{flex: 1}}><div style={{fontSize: 44}}>{a}</div><div style={{fontSize: 32, color: '#6b7388'}}>{b}</div></div>
            <div style={{fontSize: 56, color: '#7dffb0'}}>▲</div></div>); })}
      </Card>
    </div>
  </Center>);
};
const Formato = ({f, d}) => {
  const tags = [['GANCHO', 0, 90], ['CORPO', 1, 340], ['CTA', 2, 600]];
  const act = Math.min(2, Math.floor((f / d) * 3));
  return (<Center style={{top: -60}}>
    <div style={{transform: `scale(${0.85 + 0.15 * pop(f)})`, opacity: pop(f), position: 'relative'}}>
      <Card style={{width: 480, height: 840, padding: 28, borderRadius: 70}}>
        <div style={{height: 220, borderRadius: 34, background: 'linear-gradient(150deg,#2b6cff,#1b2a66)', outline: act === 0 ? `5px solid ${BLUE}` : 'none'}} />
        <div style={{height: 380, borderRadius: 34, background: '#161a24', marginTop: 20, outline: act === 1 ? `5px solid ${BLUE}` : 'none'}} />
        <div style={{height: 130, borderRadius: 34, background: ORANGE, marginTop: 20, outline: act === 2 ? '5px solid #fff' : 'none'}} />
      </Card>
      {tags.map(([t, i, y]) => { const q = pop(f, 6 + i * 6); return (
        <div key={t} style={{position: 'absolute', left: 500, top: y, transform: `scale(${q})`, opacity: act === i ? 1 : 0.45}}><Pill>{t}</Pill></div>); })}
    </div>
  </Center>);
};
const Copia = ({f}) => {
  const q1 = pop(f), q2 = pop(f, 16), ar = interpolate(f, [8, 24], [0, 1], clamp);
  return (<Center style={{top: -80}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
      <div style={{transform: `scale(${q1})`}}><Card style={{width: 380, height: 620, padding: 24, textAlign: 'center'}}><Thumb w={332} h={420} hue={210} r={30} /><div style={{marginTop: 34, fontSize: 42}}>Reel viral</div></Card></div>
      <div style={{fontSize: 120, color: BLUE, opacity: ar, transform: `translateX(${(ar - 1) * 40}px)`}}>➜</div>
      <div style={{transform: `scale(${q2})`}}><Card style={{width: 380, height: 620, padding: 24, textAlign: 'center', border: `3px solid ${ORANGE}`}}><div style={{height: 420, borderRadius: 30, background: 'linear-gradient(150deg,#e8743b55,#12151c)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Robot size={300} blink={f % 60 < 4} /></div><div style={{marginTop: 34, fontSize: 42, color: ORANGE}}>Seu Reels</div></Card></div>
    </div>
  </Center>);
};
const Seguranca = ({f}) => {
  const dash = interpolate(f, [6, 30], [220, 0], clamp), p = pop(f);
  return (<Center style={{top: -100}}>
    <div style={{transform: `scale(${0.8 + 0.2 * p})`, opacity: p}}>
      <svg width="560" height="620" viewBox="0 0 200 220"><path d="M100 10 L180 40 V110 Q180 175 100 210 Q20 175 20 110 V40 Z" fill="#0d1a30" stroke={BLUE} strokeWidth="5" />
        <path d="M60 110 L90 140 L142 80" fill="none" stroke="#7dffb0" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="220" strokeDashoffset={dash} /></svg>
    </div>
    <div style={{position: 'absolute', bottom: 600, transform: `scale(${pop(f, 14)})`}}><Card style={{padding: '24px 70px', fontSize: 60, background: `linear-gradient(90deg,#2b6cff,${BLUE})`, border: 'none'}}>Postar</Card></div>
  </Center>);
};
const Horas = ({f, d}) => {
  const rot = f * 18, strike = interpolate(f, [d * 0.5, d * 0.75], [0, 100], clamp);
  return (<Center style={{top: -100}}>
    <div style={{transform: `scale(${0.8 + 0.2 * pop(f)})`, opacity: pop(f), position: 'relative'}}>
      <svg width="620" height="620" viewBox="0 0 200 200"><circle cx="100" cy="100" r="92" fill="#0d0f14" stroke="#262c3a" strokeWidth="6" />
        {[...Array(12)].map((_, i) => <line key={i} x1="100" y1="16" x2="100" y2="26" stroke="#4b5568" strokeWidth="4" transform={`rotate(${i * 30} 100 100)`} />)}
        <line x1="100" y1="100" x2="100" y2="34" stroke={BLUE} strokeWidth="6" strokeLinecap="round" transform={`rotate(${rot} 100 100)`} />
        <line x1="100" y1="100" x2="100" y2="56" stroke="#e8ecf4" strokeWidth="8" strokeLinecap="round" transform={`rotate(${rot / 12} 100 100)`} /></svg>
      <div style={{position: 'absolute', left: -40, top: 290, height: 20, width: `${strike * 7.2}px`, background: '#ff4d6d', borderRadius: 10, transform: 'rotate(-14deg)', boxShadow: '0 0 40px #ff4d6d'}} />
    </div>
  </Center>);
};
const Lista = ({f}) => {
  const rows = ['bastidores', 'antes e depois', 'passo a passo', 'dica rápida', 'storytelling'];
  return (<Center style={{top: -80}}>
    <div style={{transform: `scale(${0.9 + 0.1 * pop(f)})`, opacity: pop(f)}}>
      <Card style={{width: 900, padding: 40}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}><span style={{fontSize: 48}}>Em alta no seu nicho</span><Pill color="#7dffb0" style={{fontSize: 28}}>NOVO HOJE</Pill></div>
        {rows.map((r, i) => { const q = pop(f, 8 + i * 6); return (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 26, padding: '18px 0', borderTop: '1px solid #1f2433', opacity: q, transform: `translateX(${(1 - q) * 160}px)`}}>
            <Thumb w={90} h={120} hue={190 + i * 30} r={16} /><span style={{flex: 1, fontSize: 38}}>Reel · {r}</span><span style={{fontSize: 52, color: '#7dffb0'}}>▲</span></div>); })}
      </Card>
    </div>
  </Center>);
};
const Resultado = ({f, d, line}) => {
  const items = (line && line.labels) || ['Alcance', 'Seguidores', 'Vendas'];
  const step = Math.round(d / 4);
  return (<Center style={{top: -60, gap: 36}}>
    {items.map((t, i) => { const s0 = 4 + i * step; const q = pop(f, s0); const g = interpolate(f, [s0, s0 + 22], [0, 1], clamp); return (
      <div key={t} style={{transform: `scale(${0.8 + 0.2 * q})`, opacity: q}}>
        <Card style={{width: 860, padding: '36px 44px', display: 'flex', alignItems: 'center', gap: 36}}>
          <div style={{flex: 1}}><div style={{fontSize: 62}}>{t}</div><div style={{height: 24, marginTop: 20, background: '#1a1f2c', borderRadius: 12}}><div style={{width: `${g * 88}%`, height: '100%', borderRadius: 12, background: 'linear-gradient(90deg,#1f9d62,#7dffb0)'}} /></div></div>
          <div style={{fontSize: 110, color: '#7dffb0'}}>▲</div></Card></div>); })}
  </Center>);
};
const Cta = ({f}) => {
  const p = pop(f), pulse = 1 + Math.sin(f / 4) * 0.035;
  return (<Center style={{top: -90}}>
    <div style={{textAlign: 'center', transform: `scale(${0.85 + 0.15 * p})`, opacity: p}}>
      <svg width="260" height="260" viewBox="0 0 200 200"><circle cx="100" cy="100" r="88" fill="#0c1a2e" stroke={BLUE} strokeWidth="6" /><circle cx="100" cy="100" r="55" fill="none" stroke="#1d3b66" strokeWidth="4" /><path d={`M100 100 L${100 + 88 * Math.cos(f / 5)} ${100 + 88 * Math.sin(f / 5)}`} stroke={BLUE} strokeWidth="8" strokeLinecap="round" /><circle cx="140" cy="70" r="9" fill="#ff4d6d" /></svg>
      <div style={{fontFamily: SANS, fontSize: 120, color: '#fff', marginTop: 10}}>{BRAND.produto.split(' ')[0]} <span style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400, color: BLUE}}>{BRAND.produto.split(' ').slice(1).join(' ')}</span></div>
      <div style={{marginTop: 60, transform: `scale(${pulse})`}}><Card style={{display: 'inline-block', padding: '34px 110px', fontSize: 84, background: `linear-gradient(90deg,#2b6cff,${BLUE})`, border: 'none', boxShadow: `0 0 90px ${BLUE}88`}}>Saiba mais</Card></div>
    </div>
    <div style={{position: 'absolute', left: 420, bottom: 450, transform: `translateY(${(1 - pop(f, 8)) * 300}px)`}}><Robot size={240} blink={f % 70 < 4} /></div>
  </Center>);
};
const Bloqueio = ({f}) => {
  const p = pop(f), cur = f % 30 < 15;
  return (<Center style={{top: -120}}>
    <div style={{transform: `scale(${0.85 + 0.15 * p})`, opacity: p}}>
      <Card style={{width: 860, padding: 44}}>
        <div style={{fontSize: 40, color: '#6b7388', marginBottom: 24}}>Novo Reels</div>
        <div style={{height: 380, borderRadius: 30, background: '#0a0c11', border: '2px dashed #2b3142', padding: 40, fontSize: 64, color: '#4b5568'}}>O que postar?{cur ? <span style={{color: BLUE}}>|</span> : null}</div>
        <div style={{display: 'flex', gap: 20, marginTop: 28}}>{[0, 1, 2].map((i) => <div key={i} style={{flex: 1, height: 24, borderRadius: 12, background: '#1a1f2c'}} />)}</div>
      </Card>
    </div>
    <div style={{position: 'absolute', left: 20, bottom: 560, transform: `translateY(${(1 - pop(f, 6)) * 300}px)`}}><Creator size={380} mood="worried" shrug={0.4 + Math.sin(f / 6) * 0.3} blink={f % 80 < 4} /></div>
  </Center>);
};
const Flat = ({f}) => {
  const p = pop(f), draw = interpolate(f, [6, 50], [0, 1], clamp);
  const pts = [[0, 60], [90, 62], [180, 56], [270, 60], [360, 58], [450, 61], [540, 59], [630, 60]];
  const path = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y + 40}`).join(' ');
  return (<Center style={{top: -120}}>
    <div style={{transform: `scale(${0.85 + 0.15 * p})`, opacity: p}}>
      <Card style={{width: 860, padding: 44}}>
        <div style={{fontSize: 46, marginBottom: 20}}>Alcance dos seus Reels</div>
        <svg width="770" height="300" viewBox="0 0 640 220"><g stroke="#1a2236" strokeWidth="2">{[40, 100, 160, 210].map((y) => <line key={y} x1="0" x2="640" y1={y} y2={y} />)}</g>
          <path d={path} fill="none" stroke="#ff5a5a" strokeWidth="8" strokeLinecap="round" strokeDasharray="1000" strokeDashoffset={1000 * (1 - draw)} /></svg>
        <div style={{fontSize: 36, color: '#ff5a5a', marginTop: 10}}>parado</div>
      </Card>
    </div>
    <div style={{position: 'absolute', right: 10, bottom: 560, transform: `translateY(${(1 - pop(f, 8)) * 300}px)`}}><Creator size={360} mood="worried" shrug={0.3} /></div>
  </Center>);
};
const Grana = ({f}) => {
  const p = pop(f), up = interpolate(f, [4, 40], [0, 1], clamp);
  return (<Center style={{top: -100}}>
    <div style={{position: 'relative', transform: `scale(${0.85 + 0.15 * p})`, opacity: p}}>
      <Card style={{width: 860, padding: 50, height: 700, position: 'relative', overflow: 'hidden'}}>
        <div style={{fontSize: 52}}>Seu Instagram</div>
        <svg width="760" height="470" viewBox="0 0 640 400" style={{marginTop: 10}}><defs><linearGradient id="gg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7dffb0" stopOpacity=".4" /><stop offset="1" stopColor="#7dffb0" stopOpacity="0" /></linearGradient></defs>
          <path d={`M0 380 L120 340 L240 350 L360 240 L480 170 L ${0 + 640} 40 L640 400 L0 400 Z`} fill="url(#gg)" opacity={up} />
          <path d="M0 380 L120 340 L240 350 L360 240 L480 170 L640 40" fill="none" stroke="#7dffb0" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="900" strokeDashoffset={900 * (1 - up)} /></svg>
      </Card>
      {[0, 1, 2].map((i) => { const q = pop(f, 18 + i * 8); return <div key={i} style={{position: 'absolute', right: 30 + i * 90, top: -60 - (i % 2) * 20, transform: `scale(${q})`, width: 110, height: 110, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%,#ffe27a,#d9a21b)', border: '5px solid #b07d10', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 62, color: '#8a5d0a', fontFamily: SANS}}>$</div>; })}
    </div>
    <div style={{position: 'absolute', left: 10, bottom: 560, transform: `translateY(${(1 - pop(f, 8)) * 300}px)`}}><Creator size={360} mood="wow" /></div>
  </Center>);
};
const Passando = ({f}) => {
  const hues = [210, 320, 150, 260, 30, 190];
  return (<Center style={{top: -120}}>
    {hues.map((h, i) => { const x = interpolate(f, [0, 70], [1300 + i * 330, -1500 + i * 330], clamp) + 0; const y = 330 + (i % 2) * 40; return (
      <div key={i} style={{position: 'absolute', left: x, top: y}}><Card style={{width: 330, height: 560, padding: 20, borderRadius: 50}}><Thumb w={290} h={440} hue={h} r={34} /><div style={{marginTop: 22, fontSize: 40, color: '#7dffb0'}}>▲ viralizando</div></Card></div>); })}
    <div style={{position: 'absolute', left: 20, bottom: 560, transform: `translateY(${(1 - pop(f, 6)) * 300}px)`}}><Creator size={380} mood="worried" blink={f % 70 < 4} /></div>
  </Center>);
};
const Ideia = ({f}) => {
  const p = pop(f), glow = 0.6 + Math.sin(f / 5) * 0.25;
  return (<Center style={{top: -100}}>
    <div style={{transform: `scale(${0.7 + 0.3 * p})`, opacity: p}}>
      <svg width="560" height="640" viewBox="0 0 200 230"><circle cx="100" cy="90" r="80" fill="#ffd95a" opacity={glow * 0.25} />
        <path d="M100 20 Q160 20 160 80 Q160 110 132 132 L132 160 H68 V132 Q40 110 40 80 Q40 20 100 20 Z" fill="#ffe27a" stroke="#d9a21b" strokeWidth="6" />
        <rect x="70" y="164" width="60" height="14" rx="6" fill="#8b93a7" /><rect x="76" y="182" width="48" height="14" rx="6" fill="#6b7388" />
        <path d="M80 120 L92 90 L108 110 L120 80" stroke="#d9a21b" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>
    <div style={{position: 'absolute', right: 20, bottom: 560, transform: `translateY(${(1 - pop(f, 8)) * 300}px)`}}><Robot size={330} happy blink={false} wave={Math.sin(f / 4) * 0.5 + 0.5} /></div>
  </Center>);
};
const Loja = ({f}) => {
  const p = pop(f);
  return (<Center style={{top: -100}}>
    <div style={{transform: `scale(${0.8 + 0.2 * p})`, opacity: p}}>
      <svg width="760" height="640" viewBox="0 0 300 250"><rect x="30" y="90" width="240" height="140" rx="8" fill="#12151c" stroke="#262c3a" strokeWidth="4" />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${30 + i * 48} 50 h48 v50 q-24 18 -48 0 Z`} fill={i % 2 ? '#fff' : ORANGE} />)}
        <rect x="52" y="120" width="70" height="60" rx="6" fill="#0c1a2e" stroke={BLUE} strokeWidth="3" />
        <rect x="150" y="120" width="96" height="110" rx="6" fill="#0a0c11" stroke="#262c3a" strokeWidth="3" />
        <circle cx="198" cy="150" r="10" fill={BLUE} opacity=".6" /></svg>
    </div>
    <div style={{position: 'absolute', left: 20, bottom: 560, transform: `translateY(${(1 - pop(f, 8)) * 300}px)`}}><Creator size={360} mood="worried" shrug={0.5} /></div>
  </Center>);
};
const Edicao = ({f, d}) => {
  const p = pop(f), t = interpolate(f, [4, d - 4], [0, 3 * 3600], clamp);
  const hh = String(Math.floor(t / 3600)).padStart(2, '0'), mm = String(Math.floor((t % 3600) / 60)).padStart(2, '0'), ss = String(Math.floor(t % 60)).padStart(2, '0');
  const head = interpolate(f, [4, d - 4], [0, 1], clamp);
  const tracks = [[['#2b6cff', 0, 38], ['#7c3aed', 40, 30], ['#2b6cff', 72, 26]], [['#e8743b', 6, 24], ['#e8743b', 34, 40], ['#e8743b', 78, 20]], [['#1f9d62', 0, 70], ['#1f9d62', 74, 24]]];
  return (<Center style={{top: -120}}>
    <div style={{transform: `scale(${0.88 + 0.12 * p})`, opacity: p}}>
      <Card style={{width: 900, padding: 36}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24}}>
          <span style={{fontSize: 38, color: '#6b7388'}}>Editando...</span>
          <span style={{fontSize: 74, color: '#ff5a5a', fontVariantNumeric: 'tabular-nums'}}>{hh}:{mm}:{ss}</span>
        </div>
        <div style={{display: 'flex', gap: 24}}>
          <div style={{width: 300, height: 400, borderRadius: 26, background: 'linear-gradient(150deg,#1b2a66,#0a0c11)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 90, color: '#2b3142'}}>▶</div>
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'center'}}>
            {['Cortar', 'Legenda', 'Efeitos', 'Exportar'].map((x, i) => <div key={x} style={{padding: '14px 24px', borderRadius: 18, background: '#161a24', fontSize: 34, color: i === Math.floor(head * 3.99) ? BLUE : '#6b7388', border: i === Math.floor(head * 3.99) ? `2px solid ${BLUE}` : '2px solid transparent'}}>{x}</div>)}
          </div>
        </div>
        <div style={{position: 'relative', marginTop: 30, padding: '14px 0'}}>
          {tracks.map((tr, ti) => <div key={ti} style={{position: 'relative', height: 54, marginBottom: 12, background: '#0a0c11', borderRadius: 12}}>
            {tr.map(([c, x, w], i) => <div key={i} style={{position: 'absolute', left: `${x}%`, width: `${w}%`, top: 6, bottom: 6, borderRadius: 8, background: c, opacity: 0.85}} />)}</div>)}
          <div style={{position: 'absolute', left: `${head * 98}%`, top: 0, bottom: 0, width: 5, background: '#fff', boxShadow: '0 0 20px #fff'}} />
        </div>
      </Card>
    </div>
    <div style={{position: 'absolute', right: 10, bottom: 560, transform: `translateY(${(1 - pop(f, 8)) * 300}px)`}}><Creator size={350} mood="worried" shrug={0.3} blink={f % 70 < 4} /></div>
  </Center>);
};
const Semana = ({f}) => {
  const days = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'];
  const txt = 'Faz meus vídeos da semana', n = Math.min(txt.length, Math.floor(Math.max(0, f - 4) * 1.6));
  const p = pop(f);
  return (<Center style={{top: -120}}>
    <div style={{transform: `scale(${0.9 + 0.1 * p})`, opacity: p, width: 900}}>
      <Card style={{padding: 36}}>
        <div style={{padding: '22px 30px', borderRadius: 26, background: '#161a24', fontSize: 44, color: '#e8ecf4', marginBottom: 28}}>{txt.slice(0, n)}<span style={{color: BLUE}}>{f % 20 < 10 ? '|' : ''}</span></div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18}}>
          {days.map((dd, i) => { const q = pop(f, 26 + i * 5); return (
            <div key={dd} style={{transform: `scale(${q})`, opacity: q, textAlign: 'center'}}>
              <div style={{position: 'relative'}}><Thumb w={190} h={250} hue={200 + i * 22} r={22} />
                <div style={{position: 'absolute', right: 8, top: 8, width: 44, height: 44, borderRadius: '50%', background: '#1f9d62', fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'}}>✓</div></div>
              <div style={{fontSize: 30, color: '#6b7388', marginTop: 8}}>{dd}</div></div>); })}
        </div>
      </Card>
    </div>
    <div style={{position: 'absolute', right: 20, bottom: 520, transform: `translateY(${(1 - pop(f, 10)) * 300}px)`}}><Robot size={300} happy wave={Math.sin(f / 4) * 0.5 + 0.5} /></div>
  </Center>);
};
export const SCENES = {edicao: Edicao, semana: Semana, gancho: Gancho, adivinhar: Adivinhar, radar: Radar, segundos: Segundos, formato: Formato, copia: Copia, seguranca: Seguranca, horas: Horas, lista: Lista, resultado: Resultado, cta: Cta, bloqueio: Bloqueio, flat: Flat, grana: Grana, passando: Passando, ideia: Ideia, loja: Loja};

// ---------- legenda palavra por palavra ----------
const norm = (s) => s.toLowerCase().replace(/[^a-zà-ú]/g, '');
const Captions = ({line, f}) => {
  const t = f / FPS, W = line.words;
  const chunks = []; for (let i = 0; i < W.length; i += 2) chunks.push(W.slice(i, i + 2));
  let ci = 0; chunks.forEach((c, i) => { if (t >= c[0].s - 0.02) ci = i; });
  const ch = chunks[ci];
  return (<div style={{position: 'absolute', left: 0, right: 0, top: 1470, textAlign: 'center', padding: '0 50px'}}>
    {ch.map((w, i) => { const key = norm(w.w) === norm(line.key), active = t >= w.s - 0.02;
      return <span key={i} style={{display: 'inline-block', margin: '0 18px', fontFamily: key ? SERIF : SANS, fontStyle: key ? 'italic' : 'normal', fontWeight: key ? 400 : 900,
        fontSize: key ? 150 : 128, textTransform: key ? 'none' : 'uppercase', color: key ? BLUE : '#fff', opacity: active ? 1 : 0,
        transform: `scale(${active ? 1 : 0.8})`, textShadow: '0 6px 30px rgba(0,0,0,.9)', WebkitTextStroke: key ? 0 : '2px #000'}}>{w.w.replace(/[.,]/g, '')}</span>; })}
  </div>);
};

const Grid = () => {
  const f = useCurrentFrame(), off = (f * 4) % 120;
  return (<AbsoluteFill style={{background: '#050608', overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: -600, right: -600, top: 760, height: 1500, transform: 'perspective(900px) rotateX(68deg)', transformOrigin: 'top',
      backgroundImage: 'linear-gradient(#1a2a4a 2px,transparent 2px),linear-gradient(90deg,#1a2a4a 2px,transparent 2px)', backgroundSize: '120px 120px', backgroundPosition: `0 ${off}px`,
      maskImage: 'linear-gradient(transparent,#000 40%)', WebkitMaskImage: 'linear-gradient(transparent,#000 15%)'}} />
    <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 30%,#0e1a33 0%,transparent 60%)'}} />
  </AbsoluteFill>);
};

const Scene = ({line, index}) => {
  const f = useCurrentFrame(), S = SCENES[line.scene || line.id] || Gancho;
  const dir = index % 2 ? -1 : 1;
  const push = interpolate(f, [0, line.frames], [1, 1.09], clamp);
  const x = interpolate(f, [0, line.frames], [0, dir * -22], clamp);
  const flash = interpolate(f, [0, 4], [0.5, 0], clamp);
  return (<AbsoluteFill>
    <AbsoluteFill style={{transform: `scale(${push}) translateX(${x}px)`}}><S f={f} d={line.frames} line={line} /></AbsoluteFill>
    <Captions line={line} f={f} />
    <AbsoluteFill style={{background: '#fff', opacity: flash, mixBlendMode: 'overlay'}} />
  </AbsoluteFill>);
};

export const Video = ({m, real}) => { cfg.real = !!real; const {lines} = build(m); return (
  <AbsoluteFill>
    <Grid />
    <Audio src={staticFile('audio/music.mp3')} volume={0.1} loop />
    {lines.map((l, i) => (
      <Sequence key={l.id} from={l.start} durationInFrames={l.frames}>
        <Audio src={staticFile(`voz/${l.file || l.id + '.mp3'}`)} volume={1} />
        <Audio src={staticFile('audio/whoosh.wav')} volume={0.22} />
        {(l.scene || l.id) === 'cta' && <Sequence from={14}><Audio src={staticFile('audio/ding.wav')} volume={0.3} /></Sequence>}
        <Scene line={l} index={i} />
      </Sequence>
    ))}
  </AbsoluteFill>
); };
