import React from 'react';
import {AbsoluteFill, Easing, Freeze, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Opening2D} from './Opening2D';
import {gradientText, mutedGradientText, numberGradientText} from './Typography';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.24, 0.72, 0.2, 1);
const cyan = '#b5e4ec';
const gold = '#dfb879';

type MoleculeProps = {x: number; y: number; size: number; rotation: number; opacity: number};

const Molecule: React.FC<MoleculeProps> = ({x, y, size, rotation, opacity}) => (
  <g transform={`translate(${x} ${y}) rotate(${rotation}) scale(${size})`} opacity={opacity}>
    <path d="M-36 27L-9 7M9 7L36 27" fill="none" stroke={gold} strokeWidth="3" strokeLinecap="round"/>
    <circle r="22" fill="#163a42" stroke={cyan} strokeWidth="3"/>
    <circle cx="-43" cy="33" r="11" fill="#44301f" stroke={gold} strokeWidth="2.5"/>
    <circle cx="43" cy="33" r="11" fill="#44301f" stroke={gold} strokeWidth="2.5"/>
    <circle cx="-7" cy="-7" r="4" fill="#edf9f4" opacity=".8"/>
  </g>
);

export const MicroEntry: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const time = frame / fps;
  const handoff = interpolate(time, [0.08, 0.4], [0, 1], clamp);
  const zoom = interpolate(time, [0.24, 1.62], [1, 13], {...clamp, easing: ease});
  const dropFade = interpolate(time, [1.13, 1.68], [1, 0], clamp);
  const micro = interpolate(time, [0.48, 1.72], [0, 1], clamp);
  const glint = interpolate(time, [0.24, 0.7], [1, 0], clamp);
  const network = interpolate(time, [1.7, 2.4], [0, 1], {...clamp, easing: ease});
  const label = interpolate(time, [1.98, 2.48], [0, 1], clamp);
  const caption = interpolate(time, [0.45, 0.78, 1.25, 1.56], [0, 1, 1, 0], clamp);
  const title = interpolate(time, [2.32, 2.67], [0, 1], clamp);
  const drift = Math.sin(time * 2.9) * 7;
  // A 0.05 mL water drop has roughly 1.7 × 10²¹ molecules: 0.05 g / 18 g/mol × N_A.
  const multitude = Array.from({length: 180}, (_, i) => {
    const angle = i * 2.3999632297;
    const spread = Math.sqrt((i + 0.5) / 180);
    const reveal = interpolate(time, [2.05 + i * 0.004, 2.2 + i * 0.004], [0, 1], clamp);
    return {x: 960 + Math.cos(angle) * spread * 690, y: 540 + Math.sin(angle) * spread * 360, r: 1.5 + (i % 5) * 0.34, reveal};
  });

  return (
    <AbsoluteFill style={{background: '#17110f', overflow: 'hidden'}}>
      <AbsoluteFill style={{opacity: 1 - handoff}}>
        <Freeze frame={101}><Opening2D shortHook /></Freeze>
      </AbsoluteFill>
      <AbsoluteFill style={{opacity: handoff}}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{position: 'absolute'}}>
          <defs>
            <radialGradient id="microBg">
              <stop stopColor="#214148" stopOpacity={0.9 * micro}/>
              <stop offset=".52" stopColor="#17252a" stopOpacity={0.55 * micro}/>
              <stop offset="1" stopColor="#17110f"/>
            </radialGradient>
            <radialGradient id="dropFill">
              <stop stopColor="#416870" stopOpacity=".5"/>
              <stop offset="1" stopColor="#a8dfe7" stopOpacity=".12"/>
            </radialGradient>
            <linearGradient id="microTypography"><stop stopColor="#e6b878"/><stop offset=".48" stopColor="#fff0d1"/><stop offset="1" stopColor="#afe6ef"/></linearGradient>
            <clipPath id="dropClip">
              <path d="M960 431 C936 478 916 537 916 567 C916 603 936 626 960 635 C984 626 1004 603 1004 567 C1004 537 984 478 960 431Z"/>
            </clipPath>
          </defs>

          <rect width="1920" height="1080" fill="url(#microBg)"/>
          <g opacity={dropFade} transform={`translate(960 540) scale(${zoom}) translate(-960 -540)`}>
            <circle cx="960" cy="540" r="171" fill="none" stroke={gold} strokeOpacity=".6" strokeWidth="5" strokeDasharray="20 38"/>
            <path d="M960 431 C936 478 916 537 916 567 C916 603 936 626 960 635 C984 626 1004 603 1004 567 C1004 537 984 478 960 431Z" fill="url(#dropFill)" stroke={cyan} strokeWidth="10"/>
            <g clipPath="url(#dropClip)" fill={cyan} opacity={micro * .65}>
              <circle cx={943 + drift} cy="542" r="5"/><circle cx={976 - drift * .4} cy="578" r="4"/>
              <circle cx="965" cy="501" r="3"/><circle cx="939" cy="596" r="2.5"/>
            </g>
            <circle cx="946" cy="525" r="10" fill="#fff5d8" opacity={glint}/>
          </g>

          <g opacity={micro * .3} stroke={gold} strokeWidth="2" fill="none">
            <path d="M150 225H540M1380 225H1770M150 855H525M1395 855H1770"/>
            <path d="M150 225V380M1770 225V380M150 700V855M1770 700V855"/>
            <circle cx="960" cy="540" r="360" strokeDasharray="4 26"/>
          </g>

          <g fill={cyan}>
            {multitude.map((dot, i) => (
              <circle key={i} cx={dot.x + Math.sin(time * 2 + i) * 3} cy={dot.y + Math.cos(time * 1.7 + i) * 3} r={dot.r} opacity={dot.reveal * .42}/>
            ))}
          </g>

          <g opacity={network}>
            <path d="M520 386Q712 437 898 520M1010 532Q1228 408 1440 416M945 575Q855 746 664 805M1018 573Q1190 707 1402 774" fill="none" stroke={cyan} strokeOpacity=".26" strokeWidth="3" strokeDasharray="6 16"/>
            <Molecule x={960 + drift} y={540} size={2.25} rotation={-14 + Math.sin(time * 2) * 3} opacity={network}/>
            <Molecule x={510 + drift * .7} y={391} size={.9} rotation={33} opacity={network * .55}/>
            <Molecule x={1450 - drift} y={416} size={.83} rotation={-31} opacity={network * .55}/>
            <Molecule x={663 - drift * .6} y={808} size={.73} rotation={59} opacity={network * .45}/>
            <Molecule x={1410 + drift * .5} y={781} size={.8} rotation={-47} opacity={network * .45}/>
            <circle cx="960" cy="540" r={225 + Math.sin(time * 3) * 6} fill="none" stroke={gold} strokeOpacity={label * .3} strokeWidth="2"/>
          </g>

          <g opacity={label}>
            <path d="M1060 508L1258 445H1410" fill="none" stroke={gold} strokeWidth="2"/>
            <circle cx="1060" cy="508" r="5" fill={gold}/>
            <text x="1280" y="350" fill="url(#microTypography)" fontSize="27" letterSpacing="6" fontFamily="Noto Sans CJK SC, sans-serif">H₂O</text>
            <text x="1280" y="405" fill="url(#microTypography)" fontSize="38" letterSpacing="5" fontFamily="Noto Sans CJK SC, sans-serif">水分子</text>
          </g>
        </svg>
        <div style={{position:'absolute',right:135,top:104,fontFamily:'Noto Sans CJK SC, sans-serif',fontSize:46,letterSpacing:6,opacity:caption,...gradientText}}>再放大这一滴</div>
        <div style={{position:'absolute',left:145,bottom:105,fontFamily:'Noto Sans CJK SC, sans-serif',fontSize:42,letterSpacing:4,opacity:title,...gradientText}}>这一滴，约有 <span style={{fontSize:65,letterSpacing:1,...numberGradientText}}>10²¹</span> 个水分子</div>
        <div style={{position:'absolute',left:145,bottom:59,fontFamily:'Noto Sans CJK SC, sans-serif',fontSize:24,letterSpacing:2,opacity:title * .8,...mutedGradientText}}>以约 0.05 毫升一滴估算</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
