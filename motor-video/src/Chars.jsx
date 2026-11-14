import React from 'react';
import {Img, staticFile} from 'remotion';
export const cfg = {real: false};

// Mascote estilo Claude: corpo laranja quadradão, bracinhos laterais, 2 olhos pretos, 4 perninhas
export const Robot = ({size = 300, blink = false, happy = false, wave = 0}) => {
  if (cfg.real) { const k = size / 710; return (
    <div style={{width: size, height: size, position: 'relative', overflow: 'hidden', mixBlendMode: 'screen', WebkitMaskImage: 'radial-gradient(closest-side,#000 82%,transparent 100%)', maskImage: 'radial-gradient(closest-side,#000 82%,transparent 100%)'}}>
      <Img src={staticFile('img/robo.png')} style={{position: 'absolute', width: 752 * k, height: 1344 * k, left: size / 2 - 410 * k, top: size / 2 - 495 * k}} />
    </div>); }
  const C = '#d97757', D = '#b95c3e';
  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      <ellipse cx="100" cy="186" rx="64" ry="8" fill="#000" opacity=".4" />
      {[56, 80, 106, 130].map((x, i) => <rect key={i} x={x} y="138" width="14" height="26" rx="5" fill={D} />)}
      <rect x="10" y={98 - wave * 22} width="26" height="24" rx="9" fill={C} transform={`rotate(${-wave * 25} 36 110)`} />
      <rect x="164" y="98" width="26" height="24" rx="9" fill={C} />
      <rect x="30" y="58" width="140" height="92" rx="16" fill={C} />
            <defs><linearGradient id="cl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#000" /></linearGradient></defs>
      {happy ? (<>
        <path d="M62 96 Q72 80 82 96" stroke="#1a1410" strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M118 96 Q128 80 138 96" stroke="#1a1410" strokeWidth="9" fill="none" strokeLinecap="round" />
      </>) : (<>
        <rect x="66" y={blink ? 96 : 82} width="14" height={blink ? 4 : 28} rx="5" fill="#1a1410" />
        <rect x="120" y={blink ? 96 : 82} width="14" height={blink ? 4 : 28} rx="5" fill="#1a1410" />
      </>)}
      <ellipse cx="54" cy="116" rx="9" ry="5" fill="#ff9d8a" opacity=".55" />
      <ellipse cx="146" cy="116" rx="9" ry="5" fill="#ff9d8a" opacity=".55" />
    </svg>
  );
};

// Criador fofinho (chibi 2D): cabeção, olhos brilhantes, bochechas, moletom
export const Creator = ({size = 300, shrug = 0, mood = 'happy', blink = false}) => {
  const skin = '#f6cfa8', hair = '#3a2a24', hood = '#4f9bff', hoodD = '#3a7fe0';
  const armY = 138 - shrug * 14;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      <ellipse cx="100" cy="190" rx="50" ry="7" fill="#000" opacity=".4" />
      <path d="M50 190 Q50 132 100 128 Q150 132 150 190 Z" fill={hood} />
      <path d="M78 130 Q100 150 122 130 L116 126 Q100 140 84 126 Z" fill={hoodD} />
      <rect x="86" y="150" width="28" height="24" rx="8" fill={hoodD} opacity=".6" />
      <ellipse cx="42" cy={armY + 14} rx="13" ry="26" fill={hood} transform={`rotate(${14 + shrug * 22} 46 ${armY})`} />
      <ellipse cx="158" cy={armY + 14} rx="13" ry="26" fill={hood} transform={`rotate(${-14 - shrug * 22} 154 ${armY})`} />
      <circle cx="38" cy={armY + 38 - shrug * 8} r="10" fill={skin} />
      <circle cx="162" cy={armY + 38 - shrug * 8} r="10" fill={skin} />
      <rect x="88" y="112" width="24" height="22" rx="8" fill={skin} />
      <circle cx="100" cy="76" r="54" fill={skin} />
      <ellipse cx="48" cy="82" rx="9" ry="12" fill={skin} /><ellipse cx="152" cy="82" rx="9" ry="12" fill={skin} />
      <path d="M44 74 Q40 22 100 20 Q160 22 156 74 Q150 46 124 46 Q100 56 76 44 Q50 46 44 74 Z" fill={hair} />
      <path d="M70 30 Q92 10 128 26" stroke={hair} strokeWidth="12" fill="none" strokeLinecap="round" />
      {mood === 'wow' ? (<>
        <ellipse cx="78" cy="82" rx="13" ry="16" fill="#fff" /><ellipse cx="122" cy="82" rx="13" ry="16" fill="#fff" />
        <circle cx="78" cy="84" r="8" fill="#241a16" /><circle cx="122" cy="84" r="8" fill="#241a16" />
        <circle cx="75" cy="79" r="3.5" fill="#fff" /><circle cx="119" cy="79" r="3.5" fill="#fff" />
        <ellipse cx="100" cy="112" rx="9" ry="11" fill="#7a2f2f" />
      </>) : (<>
        {blink ? (<><path d="M66 84 H90" stroke="#241a16" strokeWidth="5" strokeLinecap="round" /><path d="M110 84 H134" stroke="#241a16" strokeWidth="5" strokeLinecap="round" /></>) : (<>
          <ellipse cx="78" cy="84" rx="11" ry="14" fill="#241a16" /><ellipse cx="122" cy="84" rx="11" ry="14" fill="#241a16" />
          <circle cx="74" cy="78" r="4.5" fill="#fff" /><circle cx="118" cy="78" r="4.5" fill="#fff" />
          <circle cx="82" cy="90" r="2" fill="#fff" /><circle cx="126" cy="90" r="2" fill="#fff" />
        </>)}
        {mood === 'worried' ? (<>
          <path d="M62 70 L90 60" stroke={hair} strokeWidth="5" strokeLinecap="round" /><path d="M138 70 L110 60" stroke={hair} strokeWidth="5" strokeLinecap="round" />
          <path d="M88 116 Q100 108 112 116" stroke="#7a2f2f" strokeWidth="5" fill="none" strokeLinecap="round" />
        </>) : (
          <path d="M84 106 Q100 124 116 106 Q100 112 84 106 Z" fill="#7a2f2f" stroke="#7a2f2f" strokeWidth="4" strokeLinejoin="round" />
        )}
      </>)}
      <ellipse cx="62" cy="104" rx="10" ry="6" fill="#ff8f8f" opacity=".5" /><ellipse cx="138" cy="104" rx="10" ry="6" fill="#ff8f8f" opacity=".5" />
    </svg>
  );
};
