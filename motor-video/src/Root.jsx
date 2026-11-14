import React from 'react';
import {Composition} from 'remotion';
import {Video, build, FPS, BRAND} from './Video.jsx';
import './ScenesRef.jsx';
import {VoxelVideo} from './Voxel.jsx';
import {PixelVideo} from './Pixel.jsx';
import {VslVideo} from './Vsl.jsx';
import projetos from './projetos.json'; // gerado por scripts/gerar-voz.mjs

const MARCA_PADRAO = {...BRAND};
const COMPONENTES = {
  vsl: VslVideo, // estilo escuro: janelas de app + Reels em celulares + personagem (Leo/Radi)
  voxel: VoxelVideo, // 3D de blocos: dialogo personagem x robo
  pixel: PixelVideo, // pixel-art estilo "streamer"
  classico: Video, // 2D com mascote
};
const Envolve = ({comp, m, marca, theme}) => {
  Object.assign(BRAND, MARCA_PADRAO, marca || {});
  const C = COMPONENTES[comp] || VslVideo;
  return <C m={m} theme={theme} />;
};
export const Root = () => (<>
  {Object.entries(projetos).map(([id, p]) => (
    <Composition key={id} id={id} component={Envolve} defaultProps={{comp: p.comp, m: p.linhas, marca: p.marca, theme: p.theme}}
      durationInFrames={build(p.linhas).total} fps={FPS} width={1080} height={1920} />
  ))}
</>);
