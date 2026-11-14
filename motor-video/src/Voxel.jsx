import React, {useMemo} from 'react';
import * as THREE from 'three';
import {useThree} from '@react-three/fiber';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, Easing} from 'remotion';
import {build, FPS, SANS, BRAND} from './Video.jsx';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};
export const T = {hood: '#f0c93a', pocket: '#d9ae24', pants: '#1b2250', hair: '#15151a', hat: null, rob: '#f1f1ec', robD: '#e6e6e0', pal: ['#f7a6c8', '#b9a3f0', '#8fc2f5', '#ffc29b', '#f48fb1', '#a5b4fc'], sky: 'linear-gradient(#e0509a 0%,#ff8cbc 55%,#ffc7dc 100%)', night: 'linear-gradient(#1a0b3d 0%,#3a1260 55%,#8a2a8f 100%)', body: 'linear-gradient(#ff3ea5,#d81b83)', neon: '#ff5fb8'};
const pop = (f, d = 0, cfg = {damping: 12, stiffness: 140}) => spring({frame: f - d, fps: FPS, config: cfg});
const rnd = (seed) => { let a = seed; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };

// ---------- 3D ----------
const B = ({p = [0, 0, 0], s = [1, 1, 1], c = '#fff', r = [0, 0, 0], e = 0}) => (
  <mesh position={p} rotation={r}><boxGeometry args={s} /><meshStandardMaterial color={c} flatShading roughness={1} emissive={c} emissiveIntensity={e} /></mesh>
);
const talkAmt = (line, f) => { const t = f / FPS; return line && line.words.some((w) => t >= w.s - 0.03 && t <= w.e + 0.03) ? 0.35 + 0.65 * Math.abs(Math.sin(f * 0.95)) : 0; };

const Boy = ({talk = 0, mood = 'happy', f = 0, scale = 1, pos = [0, 0, 0], rotY = 0}) => {
  const blink = f % 95 < 4 ? 0.1 : 1, w = mood === 'worried' ? 0.4 : 0;
  const bob = Math.sin(f / 16) * 0.05;
  return (
    <group position={pos} scale={scale} rotation={[0, rotY, 0]}>
      <B p={[-0.7, 1.2, 0]} s={[1.1, 2.4, 1.1]} c={T.pants} /><B p={[0.7, 1.2, 0]} s={[1.1, 2.4, 1.1]} c={T.pants} />
      <B p={[-0.7, 0.15, 0.25]} s={[1.2, 0.3, 1.6]} c="#2a2a33" /><B p={[0.7, 0.15, 0.25]} s={[1.2, 0.3, 1.6]} c="#2a2a33" />
      <B p={[0, 3.9, 0]} s={[2.8, 2.6, 1.7]} c={T.hood} />
      <B p={[-0.35, 3.9, 0.87]} s={[0.12, 1.3, 0.05]} c="#fff" /><B p={[0.35, 3.9, 0.87]} s={[0.12, 1.3, 0.05]} c="#fff" />
      <B p={[0, 3.0, 0.87]} s={[1.7, 0.7, 0.05]} c={T.pocket} />
      <B p={[-1.95, 3.9, 0]} s={[0.95, 2.5, 0.95]} c={T.hood} /><B p={[1.95, 3.9, 0]} s={[0.95, 2.5, 0.95]} c={T.hood} />
      <B p={[-1.95, 2.45, 0]} s={[0.85, 0.6, 0.85]} c="#e8c19a" /><B p={[1.95, 2.45, 0]} s={[0.85, 0.6, 0.85]} c="#e8c19a" />
      <group position={[0, 6.5 + bob, 0]} rotation={[0, Math.sin(f / 22) * 0.07, Math.sin(f / 30) * 0.02]}>
        <B s={[2.9, 2.9, 2.5]} c="#e8c19a" />
        <B p={[0, 1.7, -0.05]} s={[3.1, 0.9, 2.7]} c={T.hair} /><B p={[0, 1.1, 1.18]} s={[3.1, 0.55, 0.3]} c={T.hair} />
        {T.hat ? <><B p={[0, 1.95, 0]} s={[3.2, 0.9, 2.8]} c={T.hat} /><B p={[0, 1.55, 1.75]} s={[3.2, 0.18, 1.0]} c={T.hat} /></> : <B p={[0, 1.55, 1.36]} s={[0.9, 0.12, 0.06]} c="#f5d84a" />}
        <B p={[-0.72, 0.15, 1.27]} s={[0.44, 0.74 * blink, 0.05]} c="#0c0c10" /><B p={[0.72, 0.15, 1.27]} s={[0.44, 0.74 * blink, 0.05]} c="#0c0c10" />
        <B p={[-0.72, 0.78 + w * 0.15, 1.27]} s={[0.85, 0.15, 0.05]} c="#0c0c10" r={[0, 0, w]} /><B p={[0.72, 0.78 + w * 0.15, 1.27]} s={[0.85, 0.15, 0.05]} c="#0c0c10" r={[0, 0, -w]} />
        <B p={[0, -0.3, 1.29]} s={[0.3, 0.3, 0.06]} c="#d9a77c" />
        <B p={[0, -0.95, 1.27]} s={[1.0, 0.13 + talk * 0.5, 0.05]} c="#6b0f0f" />
      </group>
    </group>
  );
};
const Robot = ({talk = 0, f = 0, scale = 1, pos = [0, 0, 0], rotY = 0, fly = true}) => {
  const bob = fly ? Math.sin(f / 12) * 0.35 : 0, blink = f % 80 < 4 ? 0.1 : 1, flame = 0.7 + Math.abs(Math.sin(f * 0.8)) * 0.6;
  return (
    <group position={[pos[0], pos[1] + bob, pos[2]]} scale={scale} rotation={[0, rotY, Math.sin(f / 18) * 0.06]}>
      <B s={[3, 2.3, 2.3]} c={T.rob} />
      <B p={[0, 0.1, 1.17]} s={[2.4, 1.7, 0.06]} c="#0b0b10" />
      <B p={[-0.55, 0.2, 1.22]} s={[0.42, 0.6 * blink, 0.05]} c="#ffd84a" e={0.9} /><B p={[0.55, 0.2, 1.22]} s={[0.42, 0.6 * blink, 0.05]} c="#ffd84a" e={0.9} />
      <B p={[0, -1.45 - talk * 0.3, 0]} s={[2.5, 0.7, 2.1]} c={T.robD} />
      {[-0.7, -0.25, 0.25, 0.7].map((x) => <B key={x} p={[x, -1.45 - talk * 0.3, 1.07]} s={[0.1, 0.5, 0.03]} c="#111" />)}
      <B p={[0, 1.55, 0]} s={[0.14, 0.7, 0.14]} c="#b0b0b8" /><B p={[0, 2.0, 0]} s={[0.4, 0.4, 0.4]} c="#ff4a6a" e={0.8} />
      {[-0.8, 0.8].map((x) => <B key={x} p={[x, -2.15, 0]} s={[0.55, 0.45 * flame, 0.55]} c="#ff9d2e" e={1} />)}
      <B p={[-1.7, 0, 0]} s={[0.35, 0.8, 0.8]} c="#d8d8d2" /><B p={[1.7, 0, 0]} s={[0.35, 0.8, 0.8]} c="#d8d8d2" />
    </group>
  );
};
let _tex = null;
const winTex = () => {
  if (_tex) return _tex; const c = document.createElement('canvas'); c.width = 64; c.height = 256; const g = c.getContext('2d'); g.fillStyle = '#ffffff'; g.fillRect(0, 0, 64, 256);
  const R = rnd(7), cols = ['#ffe27a', '#ff9ec7', '#9ad7ff', '#c9b3ff', '#ffffff', '#ffd1a3'];
  for (let y = 0; y < 32; y++) for (let x = 0; x < 8; x++) { g.fillStyle = R() > 0.25 ? cols[Math.floor(R() * cols.length)] : '#cfc2e8'; g.fillRect(x * 8 + 1, y * 8 + 1, 5, 5); }
  _tex = new THREE.CanvasTexture(c); _tex.wrapS = _tex.wrapT = THREE.RepeatWrapping; _tex.magFilter = THREE.NearestFilter; return _tex;
};
const City = () => {
  const items = useMemo(() => { const R = rnd(11), pal = T.pal; const arr = [];
    for (let i = 0; i < 22; i++) arr.push({x: -34 + i * 3.1 + R(), z: -14 - (i % 3) * 5, w: 2.6 + R() * 1.6, h: 10 + R() * 18, c: pal[Math.floor(R() * pal.length)]}); return arr; }, []);
  const t0 = winTex();
  return (<>
    {items.map((b, i) => { const t = t0.clone(); t.needsUpdate = true; t.repeat.set(b.w / 6, b.h / 14); return (
      <mesh key={i} position={[b.x, b.h / 2, b.z]}><boxGeometry args={[b.w, b.h, 3]} /><meshStandardMaterial color={b.c} map={t} flatShading roughness={1} emissive={b.c} emissiveIntensity={0.06} /></mesh>); })}
    <B p={[0, -0.05, -4]} s={[90, 0.1, 40]} c="#4a2a6e" /><B p={[0, 0.02, -9]} s={[90, 0.12, 5]} c="#e0709f" />
    {[...Array(12)].map((_, i) => <B key={i} p={[-30 + i * 5.5, 0.06, 1.8]} s={[2.4, 0.04, 0.22]} c="#f5d84a" />)}
    <B p={[7, 3.5, -6]} s={[0.22, 7, 0.22]} c="#2a2230" /><B p={[6.3, 7, -6]} s={[1.6, 0.18, 0.4]} c="#2a2230" /><B p={[5.7, 6.8, -6]} s={[0.5, 0.3, 0.5]} c="#ffe9a8" e={1} />
    <B p={[-9, 2, -7]} s={[0.4, 4, 0.4]} c="#6b4a2a" />{[0, 1, 2, 3].map((k) => <B key={k} p={[-9 + Math.cos(k * 1.6) * 1.4, 4.1, -7 + Math.sin(k * 1.6) * 1.4]} s={[2.2, 0.35, 0.8]} c="#27a46a" r={[0, k * 1.6, 0.3]} />)}
  </>);
};
const Rig = ({pos, look}) => { const {camera} = useThree(); camera.position.set(...pos); camera.lookAt(...look); return null; };
const World = ({children, cam, look}) => (
  <ThreeCanvas width={1080} height={1920} camera={{fov: 40, near: 0.1, far: 300, position: cam}} style={{position: 'absolute', inset: 0}}>
    <ambientLight intensity={1.35} /><directionalLight position={[6, 12, 9]} intensity={1.6} /><directionalLight position={[-8, 4, 6]} intensity={0.5} color="#ffb3d9" />
    <Rig pos={cam} look={look} /><City />{children}
  </ThreeCanvas>
);

// ---------- cenas 3D ----------
const FaceBoy = ({f, d, line}) => {
  const z = interpolate(f, [0, d], [11.6, 10.4], clamp);
  return <World cam={[Math.sin(f / 40) * 0.25, 5.9, z]} look={[0, 5.3, 0]}><Boy f={f} talk={talkAmt(line, f)} mood={line.mood} pos={[0, 0, 0]} /></World>;
};
const Wide = ({f, d, line, cta}) => {
  const z = interpolate(f, [0, d], [12.5, 10.8], clamp), lk = line.who === 'robot';
  return <World cam={[0, 3.0, z]} look={[0, 2.5, 0]}>
    <Boy f={f} scale={0.5} pos={[-1.45, 0, 0]} rotY={0.35} mood="happy" talk={!lk ? talkAmt(line, f) : 0} />
    <Robot f={f} scale={0.5} pos={[1.0, 3.3, 0.6]} rotY={-0.35} talk={lk ? talkAmt(line, f) : 0} />
  </World>;
};

// ---------- cenas 2D (máquina) ----------
const NightBg = () => {
  const bl = useMemo(() => { const R = rnd(5); return [...Array(26)].map((_, i) => ({x: i * 44 - 20, w: 36 + R() * 26, h: 160 + R() * 330, k: R()})); }, []);
  return (<AbsoluteFill style={{background: T.night}}>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 520, height: 520}}>
      {bl.map((b, i) => <div key={i} style={{position: 'absolute', left: b.x, bottom: 0, width: b.w, height: b.h, background: '#150a30', boxShadow: 'inset 0 0 0 2px #2b1560'}}>
        {[...Array(Math.floor(b.h / 40))].map((_, j) => <div key={j} style={{position: 'absolute', left: 8 + (j % 2) * 14, top: 14 + j * 40, width: 8, height: 8, background: (i * 7 + j * 3) % 5 === 0 ? '#ffe27a' : '#ff6fb5', opacity: 0.8}} />)}</div>)}
    </div>
  </AbsoluteFill>);
};
const Screen = ({children}) => <div style={{background: '#12141c', borderRadius: 18, margin: '0 28px', padding: '22px 26px', height: 520, fontFamily: 'Consolas,monospace', color: '#cfd6e6', fontSize: 30, lineHeight: 1.5, overflow: 'hidden', border: '2px solid #232838'}}>
  <div style={{display: 'flex', gap: 8, marginBottom: 16}}>{['#ff5f57', '#febc2e', '#28c840'].map((c) => <div key={c} style={{width: 14, height: 14, borderRadius: '50%', background: c}} />)}<span style={{marginLeft: 10, color: '#7d869c', fontSize: 24}}>Claude</span></div>{children}</div>;
const Machine = ({f, children, cards, d}) => {
  const q = pop(f);
  return (<div style={{position: 'absolute', left: 190, top: 330, width: 700, transform: `scale(${0.9 + 0.1 * q})`, opacity: q, fontFamily: SANS}}>
    <div style={{border: '5px solid #5ad0ff', borderRadius: 14, boxShadow: '0 0 40px #5ad0ff88, inset 0 0 30px #5ad0ff44', background: '#190a3f', textAlign: 'center', padding: '22px 0', marginBottom: 14}}>
      <span style={{fontSize: 62, color: T.neon, textShadow: `0 0 20px ${T.neon}, 0 0 40px ${T.neon}`}}>{BRAND.nome}</span></div>
    <div style={{border: '5px solid #5ad0ff', borderRadius: 14, boxShadow: '0 0 40px #5ad0ff55', background: '#190a3f', padding: '24px 0'}}>
      <Screen>{children}</Screen></div>
    <div style={{height: 330, background: T.body, borderRadius: '0 0 18px 18px', marginTop: -2, position: 'relative'}}>
      <div style={{position: 'absolute', left: 90, right: 90, top: 88, height: 26, background: '#2a0f35', borderRadius: 6}} /></div>
    {cards}
  </div>);
};
const Polaroid = ({f}) => (
  <div style={{position: 'absolute', left: 40, top: 1180, width: 200, height: 200, background: '#f4f2ee', borderRadius: 14, transform: 'rotate(-3deg)', boxShadow: '0 12px 30px rgba(0,0,0,.5)', padding: 14}}>
    <div style={{width: '100%', height: '100%', background: '#0b0b10', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28}}>
      {[0, 1].map((i) => <div key={i} style={{width: 22, height: f % 80 < 4 ? 4 : 50, background: '#ffd84a', boxShadow: '0 0 14px #ffd84a'}} />)}</div></div>
);
const Steps = ({active}) => (
  <div style={{position: 'absolute', top: 245, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 14, fontFamily: SANS}}>
    {(T.steps || ['DESCOBRE', 'PEDE', 'ESCOLHE']).map((t, i) => <div key={t} style={{padding: '8px 22px', borderRadius: 999, fontSize: 26, background: i === active ? '#e8743b' : i < active ? '#fff' : '#ffffff22', color: i === active ? '#fff' : i < active ? '#1a7f4a' : '#fff', border: '2px solid #ffffff55'}}>{i < active ? '✓ ' : `${i + 1} `}{t}</div>)}
  </div>
);
const typed = (s, f, st = 6, sp = 1.4) => s.slice(0, Math.max(0, Math.floor((f - st) * sp)));
const MachineScene = ({f, d, line}) => {
  const k = line.scene;
  const rows = [['Reel #1', '4,8 mi'], ['Reel #2', '3,9 mi'], ['Reel #3', '3,1 mi'], ['Reel #4', '2,7 mi']];
  let body;
  if (k === 'machine') body = <div><div style={{color: '#7dffb0'}}>✓ {BRAND.produto} pronto</div><div style={{marginTop: 24, color: '#7d869c'}}>Responder...{f % 24 < 12 ? '▌' : ''}</div></div>;
  if (k === 'step1') body = <div><div style={{color: '#7dffb0'}}>✓ skill radar-viral instalada</div>{rows.map(([a, b], i) => <div key={a} style={{opacity: pop(f, 14 + i * 7), color: '#fff'}}>▲ {a} <span style={{color: '#7d869c'}}>· {b}</span></div>)}</div>;
  if (k === 'step2') body = <div><div style={{color: '#8ab4ff'}}>&gt; {typed('faz meu Reels do nicho', f)}{f % 20 < 10 ? '▌' : ''}</div>{['roteiro', 'narração', 'legenda'].map((t, i) => <div key={t} style={{opacity: pop(f, 30 + i * 9), color: '#7dffb0'}}>✓ {t}</div>)}</div>;
  if (k === 'step3') body = <div><div style={{color: '#7d869c'}}>melhores vídeos:</div>{[['A', '9,4'], ['B', '9,1'], ['C', '8,8']].map(([a, b], i) => <div key={a} style={{opacity: pop(f, 8 + i * 8), color: i === 0 && f > 34 ? '#7dffb0' : '#fff'}}>{i === 0 && f > 34 ? '☑' : '☐'} Vídeo {a} <span style={{color: '#7d869c'}}>nota {b}</span></div>)}</div>;
  if (line.screen) body = <div>{line.screen.map(([txt, col], i) => <div key={i} style={{opacity: pop(f, 6 + i * 10), color: col || '#cfd6e6'}}>{txt}</div>)}</div>;
  if (k === 'cards') body = <div><div style={{color: '#7dffb0'}}>✓ 5 vídeos prontos</div><div style={{color: '#7d869c'}}>legenda + zoom aplicados</div></div>;
  const cards = (k === 'cards' || line.cards) ? [0, 1, 2, 3, 4].map((i) => { const q = pop(f, 6 + i * 5), rot = (i - 2) * 11; return (
    <div key={i} style={{position: 'absolute', left: 250 + (i - 2) * 95, top: 770 - q * 220, width: 210, height: 320, borderRadius: 18, transform: `rotate(${rot * q}deg)`, background: `linear-gradient(150deg,hsl(${200 + i * 35} 70% 50%),hsl(${250 + i * 35} 60% 25%))`, border: '4px solid #fff', boxShadow: '0 14px 30px rgba(0,0,0,.5)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', color: '#fff', fontFamily: SANS, fontSize: 26, paddingBottom: 14}}>VÍDEO {i + 1}</div>); }) : null;
  const act = line.act !== undefined ? line.act : k === 'step1' ? 0 : k === 'step2' ? 1 : k === 'step3' ? 2 : -1;
  return (<AbsoluteFill><NightBg />{act >= 0 && <Steps active={act} />}<Machine f={f} d={d} cards={cards}>{body}</Machine><Polaroid f={f} /></AbsoluteFill>);
};

// ---------- overlays ----------
const Banner = ({text, f}) => { const q = pop(f); return (
  <div style={{position: 'absolute', top: 110, left: 0, right: 0, textAlign: 'center', transform: `scale(${0.8 + 0.2 * q})`, opacity: q}}>
    <div style={{display: 'inline-block', position: 'relative', background: '#f6efe1', padding: '18px 54px', borderRadius: 8, transform: 'rotate(-1.5deg)', boxShadow: '0 10px 26px rgba(0,0,0,.35)', fontFamily: SANS, fontSize: 52, color: '#2a1a14'}}>
      {text}<div style={{position: 'absolute', left: -28, top: -10, width: 70, height: 30, background: '#e8d7a8cc', transform: 'rotate(-35deg)'}} /><div style={{position: 'absolute', right: -28, top: -10, width: 70, height: 30, background: '#e8d7a8cc', transform: 'rotate(35deg)'}} /></div></div>); };
const Caption = ({line, f}) => {
  const t = f / FPS, W = line.words, ch = []; for (let i = 0; i < W.length; i += 3) ch.push(W.slice(i, i + 3));
  let ci = 0; ch.forEach((c, i) => { if (t >= c[0].s - 0.02) ci = i; });
  const isR = line.who === 'robot';
  return (<div style={{position: 'absolute', left: 0, right: 0, top: 1470, textAlign: 'center', fontFamily: SANS}}>
    <div style={{display: 'inline-block', padding: '8px 26px', borderRadius: 999, fontSize: 30, letterSpacing: 2, background: isR ? '#e8743b' : '#f6efe1', color: isR ? '#fff' : '#6b3a1c', boxShadow: '0 6px 16px rgba(0,0,0,.35)'}}>{isR ? '✳ CLAUDE' : 'CLIPADOR'}</div>
    <div style={{marginTop: 18, display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', padding: '0 40px'}}>
      {ch[ci].map((w, i) => { const act = t >= w.s - 0.02 && t <= w.e + 0.08; return <span key={i} style={{padding: '8px 22px', borderRadius: 12, fontSize: 68, background: act ? '#e8743b' : '#5b2a14', color: '#fff', boxShadow: '0 8px 20px rgba(0,0,0,.4)', opacity: t >= w.s - 0.02 ? 1 : 0, transform: `scale(${act ? 1.08 : 1})`}}>{w.w.replace(/[.,!?]/g, '')}</span>; })}
    </div></div>);
};
const Timer = ({f, total}) => { const s = Math.max(0, Math.ceil((total - f) / FPS)); return <div style={{position: 'absolute', top: 50, right: 48, fontFamily: 'Consolas,monospace', fontSize: 30, color: '#fff', opacity: 0.85}}><span style={{color: '#ff4a4a'}}>● </span>0:{String(s).padStart(2, '0')}</div>; };
const CtaBtn = ({f}) => <div style={{position: 'absolute', top: 1290, left: 0, right: 0, textAlign: 'center', transform: `scale(${1 + Math.sin(f / 4) * 0.04})`}}><div style={{display: 'inline-block', background: '#ffe14a', color: '#2a1a14', padding: '22px 70px', borderRadius: 18, fontFamily: SANS, fontSize: 56, boxShadow: '0 10px 0 #b8941a, 0 18px 30px rgba(0,0,0,.4)'}}>SAIBA MAIS +</div></div>;

const Scene = ({line, index, total, start}) => {
  const f = useCurrentFrame(), d = line.frames, k = line.scene;
  const is3d = k === 'faceBoy' || k === 'wide' || k === 'wideCta';
  const flash = interpolate(f, [0, 4], [0.45, 0], clamp);
  return (<AbsoluteFill>
    {is3d && <AbsoluteFill style={{background: T.sky}} />}
    {k === 'faceBoy' && <FaceBoy f={f} d={d} line={line} />}
    {(k === 'wide' || k === 'wideCta') && <Wide f={f} d={d} line={line} />}
    {!is3d && <MachineScene f={f} d={d} line={line} />}
    {line.title && <Banner text={line.title} f={f} />}
    {k === 'wideCta' && <CtaBtn f={f} />}
    <Caption line={line} f={f} /><Timer f={start + f} total={total} />
    <AbsoluteFill style={{background: '#fff', opacity: flash, mixBlendMode: 'overlay'}} />
  </AbsoluteFill>);
};
export const VoxelVideo = ({m, theme}) => { Object.assign(T, theme || {}); const {lines, total} = build(m); return (
  <AbsoluteFill style={{background: '#1a0b3d'}}>
    <Audio src={staticFile('audio/music.mp3')} volume={0.08} loop />
    {lines.map((l, i) => (
      <Sequence key={l.id + i} from={l.start} durationInFrames={l.frames}>
        <Audio src={staticFile(`voz/${l.file}`)} volume={1} /><Audio src={staticFile('audio/whoosh.wav')} volume={0.2} />
        <Scene line={l} index={i} total={total} start={l.start} />
      </Sequence>))}
  </AbsoluteFill>); };
