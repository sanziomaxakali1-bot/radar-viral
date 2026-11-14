import React from 'react';
import {interpolate} from 'remotion';
import {Card, Thumb, Center, Pill, pop, clamp, SCENES, BLUE, ORANGE, SANS, BRAND} from './Video.jsx';
import {Robot, Creator} from './Chars.jsx';

const MONO = 'Consolas,"Courier New",monospace';
const GREEN = '#7dffb0';
const Win = ({title, children, style}) => (
  <Card style={{overflow: 'hidden', ...style}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '18px 26px', borderBottom: '1px solid #1f2433', background: '#0d1017'}}>
      {['#ff5f57', '#febc2e', '#28c840'].map((c) => <div key={c} style={{width: 20, height: 20, borderRadius: '50%', background: c}} />)}
      <span style={{marginLeft: 14, fontSize: 28, color: '#6b7388', fontFamily: MONO}}>{title}</span>
    </div>
    {children}
  </Card>
);
const Wrap = ({f, children, style}) => <Center style={{top: -120, ...style}}><div style={{transform: `scale(${0.88 + 0.12 * pop(f)})`, opacity: pop(f)}}>{children}</div></Center>;

const Meianoite = ({f, d}) => {
  const flip = f > d * 0.55, glow = 0.6 + Math.sin(f / 5) * 0.2;
  return (<Center style={{top: -120}}>
    <div style={{transform: `scale(${0.88 + 0.12 * pop(f)})`, opacity: pop(f), textAlign: 'center'}}>
      <Card style={{padding: '30px 80px', display: 'inline-block'}}>
        <span style={{fontSize: 170, fontFamily: MONO, letterSpacing: 8, color: flip ? GREEN : '#ff5a5a', textShadow: `0 0 40px ${flip ? GREEN : '#ff5a5a'}88`}}>{flip ? '00:00' : '23:59'}</span>
      </Card>
      <div style={{marginTop: 70, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 80}}>
        <div style={{position: 'relative'}}><Creator size={380} blink />
          <div style={{position: 'absolute', left: 250, top: -20, fontSize: 70 + Math.sin(f / 6) * 8, color: '#8b93a7', fontFamily: SANS}}>z z</div></div>
        <div style={{filter: `drop-shadow(0 0 ${60 * glow}px ${ORANGE})`, transform: `scale(${flip ? 1.08 : 1})`}}><Robot size={380} /></div>
      </div>
    </div>
  </Center>);
};
const Terminal = ({f, d}) => {
  const rows = [['00:00', 'Iniciando rotina do ' + BRAND.produto + '...'], ['00:01', 'Modo autônomo ativado'], ['00:02', 'Buscando Reels virais do nicho...'], ['00:03', 'Fila: roteiro > narração > edição'], ['00:04', 'Tudo rodando sozinho']];
  const shown = Math.min(rows.length, Math.floor(Math.max(0, f - 6) / Math.max(8, (d - 14) / rows.length)) + 1);
  return (<Wrap f={f}>
    <Win title="radar-viral · rotina noturna" style={{width: 920}}>
      <div style={{padding: '34px 38px', fontFamily: MONO, fontSize: 38, minHeight: 520}}>
        {rows.slice(0, shown).map(([t, x], i) => <div key={i} style={{marginBottom: 26, color: i === shown - 1 ? '#fff' : '#8b93a7'}}><span style={{color: BLUE}}>{t}</span>  {x}{i === shown - 1 && f % 20 < 10 ? <span style={{color: GREEN}}> ▌</span> : null}</div>)}
      </div>
    </Win>
    <div style={{position: 'absolute', right: -60, top: 560}}><Robot size={230} /></div>
  </Wrap>);
};
const Busca = ({f, d}) => {
  const n = Math.round(interpolate(f, [6, d - 8], [0, 100], clamp));
  const views = ['4,8 mi', '3,9 mi', '3,1 mi', '2,7 mi', '2,2 mi', '1,9 mi', '1,9 mi', '1,6 mi', '1,4 mi', '1,2 mi', '1,1 mi', '980 mil'];
  return (<Wrap f={f}>
    <Card style={{width: 920, padding: 36}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 38, marginBottom: 12}}><span>Seu nicho · últimos 7 dias</span><span style={{color: BLUE}}>{n}/100</span></div>
      <div style={{height: 14, background: '#1a1f2c', borderRadius: 7, marginBottom: 26}}><div style={{width: `${n}%`, height: '100%', borderRadius: 7, background: BLUE, boxShadow: `0 0 20px ${BLUE}`}} /></div>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18}}>
        {views.map((v, i) => { const q = pop(f, 6 + i * 3); return (<div key={i} style={{opacity: q, transform: `scale(${q})`}}><Thumb w={190} h={250} hue={(i * 37) % 360} r={20} /><div style={{fontSize: 30, color: '#9aa3b8', marginTop: 8}}>▶ {v}</div></div>); })}
      </div>
    </Card>
  </Wrap>);
};
const Analise = ({f}) => {
  const rows = [['Reel #1', 94], ['Reel #2', 91], ['Reel #3', 62], ['Reel #4', 55], ['Reel #5', 48]];
  return (<Wrap f={f}>
    <Card style={{width: 940, padding: 36}}>
      <div style={{fontSize: 38, marginBottom: 22, color: '#6b7388', fontFamily: MONO}}>análise · 100 Reels do nicho</div>
      {rows.map(([t, s], i) => { const q = pop(f, 6 + i * 6), g = interpolate(f, [8 + i * 6, 30 + i * 6], [0, 1], clamp), top = s > 80; return (
        <div key={t} style={{display: 'flex', alignItems: 'center', gap: 22, padding: '20px 14px', borderRadius: 20, marginBottom: 8, background: top ? '#0f2a1f' : 'transparent', border: top ? `2px solid ${GREEN}66` : '2px solid transparent', opacity: q}}>
          <span style={{width: 180, fontSize: 38}}>{t}</span>
          <div style={{flex: 1, height: 22, background: '#1a1f2c', borderRadius: 11}}><div style={{width: `${s * g}%`, height: '100%', borderRadius: 11, background: top ? GREEN : '#3a4256'}} /></div>
          <span style={{width: 90, fontSize: 44, color: top ? GREEN : '#6b7388', textAlign: 'right'}}>{Math.round(s * g)}</span>
        </div>); })}
      <div style={{marginTop: 18, fontSize: 32, color: GREEN, fontFamily: MONO}}>✓ melhores separados para modelar</div>
    </Card>
  </Wrap>);
};
const Estrutura = ({f, d}) => {
  const blocks = [['GANCHO', 1.2, '#2b6cff'], ['CONTEXTO', 1.5, '#7c3aed'], ['VIRADA', 1.3, '#d97757'], ['PROVA', 1.6, '#1f9d62'], ['CTA', 1, '#e11d74']];
  const bars = [...Array(46)].map((_, i) => 14 + ((i * 37) % 52));
  return (<Wrap f={f}>
    <Win title="estrutura_viral_01" style={{width: 940}}>
      <div style={{padding: 34}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 6, height: 130, marginBottom: 34}}>{bars.map((h, i) => <div key={i} style={{flex: 1, height: h * 1.6 * (0.6 + 0.4 * Math.sin(f / 5 + i)), background: '#2b3a5c', borderRadius: 4}} />)}</div>
        {blocks.map(([t, w, c], i) => { const q = pop(f, 8 + i * 7); return (
          <div key={t} style={{display: 'flex', alignItems: 'center', gap: 22, marginBottom: 18, opacity: q, transform: `translateX(${(1 - q) * 80}px)`}}>
            <div style={{width: 20, height: 20, borderRadius: '50%', background: c}} /><span style={{fontSize: 40, width: 220}}>{t}</span>
            <div style={{height: 28, width: `${w * 150}px`, borderRadius: 14, background: c}} /></div>); })}
      </div>
    </Win>
  </Wrap>);
};
const Roteiro = ({f}) => {
  const hl = interpolate(f, [14, 34], [0, 100], clamp);
  return (<Wrap f={f}>
    <div style={{width: 880, padding: 50, borderRadius: 24, background: '#f4efe3', color: '#1a1a1a', fontFamily: SANS, boxShadow: '0 40px 90px rgba(0,0,0,.7)', transform: 'rotate(-2deg)', position: 'relative'}}>
      <div style={{fontSize: 24, letterSpacing: 4, color: '#8a8372'}}>ROTEIRO · REEL #1</div>
      <div style={{fontSize: 52, margin: '16px 0 34px'}}>Enquanto eu durmo</div>
      <div style={{fontSize: 24, letterSpacing: 4, color: '#c2602f'}}>GANCHO · 0–3s</div>
      <div style={{fontSize: 46, lineHeight: 1.3, marginTop: 14, position: 'relative'}}>
        <span style={{backgroundImage: 'linear-gradient(#ffe66a,#ffe66a)', backgroundRepeat: 'no-repeat', backgroundSize: `${hl}% 100%`}}>“Enquanto você dorme, a sua IA já está editando o seu próximo Reels.”</span></div>
      <div style={{fontSize: 24, letterSpacing: 4, color: '#8a8372', marginTop: 34}}>CENA 1 · 3–8s</div>
      <div style={{fontSize: 34, color: '#555', marginTop: 8}}>A tela acende à meia-noite e a rotina começa sozinha.</div>
      <div style={{position: 'absolute', right: 40, top: 150, width: 130, height: 130, borderRadius: '50%', border: '8px solid #e11d48', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, transform: `scale(${pop(f, 30)})`}}>1,2s</div>
    </div>
  </Wrap>);
};
const Montagem = ({f, d}) => {
  const items = ['Narração', 'Animações', 'Legendas palavra por palavra'];
  const head = interpolate(f, [4, d - 4], [0, 1], clamp);
  const bars = [...Array(60)].map((_, i) => 14 + ((i * 53) % 46));
  return (<Wrap f={f}>
    <Win title="montagem · reels_01" style={{width: 940}}>
      <div style={{padding: 34}}>
        <div style={{position: 'relative', height: 120, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 26}}>
          {bars.map((h, i) => <div key={i} style={{flex: 1, height: h * 1.8, background: i / 60 < head ? BLUE : '#2b3a5c', borderRadius: 3}} />)}
          <div style={{position: 'absolute', left: `${head * 98}%`, top: -6, bottom: -6, width: 5, background: '#fff'}} />
        </div>
        <div style={{display: 'flex', gap: 10, marginBottom: 36}}>{['#2b6cff', '#d97757', '#1f9d62', '#7c3aed', '#e11d74', '#2b6cff'].map((c, i) => <div key={i} style={{flex: 1 + (i % 3), height: 64, borderRadius: 12, background: c, opacity: 0.85}} />)}</div>
        {items.map((t, i) => { const q = pop(f, 10 + i * 9); return <div key={t} style={{display: 'flex', alignItems: 'center', gap: 20, fontSize: 42, marginBottom: 18, opacity: q}}><span style={{color: GREEN, fontSize: 48}}>✓</span>{t}</div>; })}
      </div>
    </Win>
  </Wrap>);
};
const QA = ({f, d}) => {
  const n = Math.round(interpolate(f, [6, d - 8], [0, 788], clamp)), ang = interpolate(f, [4, 40], [-70, 20], clamp);
  return (<Wrap f={f}>
    <Win title="finalização · reels_01" style={{width: 940}}>
      <div style={{padding: 40, display: 'flex', gap: 40, alignItems: 'center'}}>
        <div style={{textAlign: 'center'}}>
          <svg width="340" height="230" viewBox="0 0 200 135"><path d="M20 120 A80 80 0 0 1 180 120" fill="none" stroke="#1a2236" strokeWidth="14" strokeLinecap="round" /><path d="M20 120 A80 80 0 0 1 180 120" fill="none" stroke={GREEN} strokeWidth="14" strokeLinecap="round" strokeDasharray="251" strokeDashoffset={251 * (1 - (ang + 70) / 120)} /><line x1="100" y1="120" x2="100" y2="58" stroke="#fff" strokeWidth="6" strokeLinecap="round" transform={`rotate(${ang} 100 120)`} /></svg>
          <div style={{fontSize: 34, color: '#8b93a7', fontFamily: MONO}}>-14,0 LUFS</div>
        </div>
        <div><div style={{fontSize: 30, color: '#6b7388', fontFamily: MONO}}>QUADROS REVISADOS</div><div style={{fontSize: 130, fontFamily: MONO, color: '#fff'}}>{n}</div><div style={{fontSize: 34, color: GREEN, fontFamily: MONO}}>0 erros</div></div>
      </div>
      <div style={{display: 'flex', gap: 8, padding: '0 40px 40px'}}>{[...Array(8)].map((_, i) => <Thumb key={i} w={100} h={130} hue={190 + i * 20} r={12} />)}</div>
    </Win>
  </Wrap>);
};
const Celular = ({f, d}) => {
  const tap = f > d * 0.62, q = pop(f);
  return (<Center style={{top: -140}}>
    <div style={{position: 'relative', transform: `scale(${0.88 + 0.12 * q})`, opacity: q}}>
      <Card style={{width: 520, height: 900, padding: 26, borderRadius: 80, border: '4px solid #2b3142'}}>
        <div style={{height: 560, borderRadius: 50, background: 'linear-gradient(160deg,#1b2a66,#0a0c11)', position: 'relative'}}>
          <div style={{position: 'absolute', left: 30, bottom: 30, right: 30, fontSize: 40, lineHeight: 1.2}}>Enquanto você dorme, a sua IA já está editando…</div></div>
        <div style={{marginTop: 32, padding: '28px 0', borderRadius: 30, textAlign: 'center', fontSize: 44, background: tap ? '#1f9d62' : `linear-gradient(90deg,#2b6cff,${BLUE})`, transform: `scale(${tap ? 0.96 : 1})`}}>{tap ? '✓ Publicado' : 'Aprovar e publicar'}</div>
      </Card>
      {['Instagram', 'TikTok', 'YouTube'].map((t, i) => { const p = pop(f, 12 + i * 7); return <div key={t} style={{position: 'absolute', left: i % 2 ? 560 : -250, top: 120 + i * 190, transform: `scale(${p})`}}><Pill style={{fontSize: 36}}>{t}</Pill></div>; })}
    </div>
  </Center>);
};
Object.assign(SCENES, {meianoite: Meianoite, terminal: Terminal, busca: Busca, analise: Analise, estrutura: Estrutura, roteiro: Roteiro, montagem: Montagem, qa: QA, celular: Celular});
