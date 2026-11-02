import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {gradientText} from './Typography';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.22, 0.72, 0.18, 1);
const gold = '#dfb879';
const water = '#b5e4ec';

export const Opening2D: React.FC<{shortHook?: boolean}> = ({shortHook = false}) => {
  const currentFrame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const frame = shortHook
    ? interpolate(
        currentFrame,
        [0, 0.4 * fps, 1.4 * fps, 2 * fps, 3.4 * fps],
        [2.2 * fps, 2.8 * fps, 5.3 * fps, 5.65 * fps, 7 * fps],
        clamp,
      )
    : currentFrame;
  const tilt = interpolate(frame, [0.7 * fps, 3.25 * fps], [0, 64], {...clamp, easing: ease});
  const pourIn = interpolate(frame, [2.05 * fps, 2.8 * fps], [0, 1], {...clamp, easing: ease});
  const pourOut = interpolate(frame, [5.45 * fps, 5.95 * fps], [1, 0], clamp);
  const pour = pourIn * pourOut;
  const groundHit = interpolate(frame, [2.45 * fps, 3.1 * fps], [0, 1], clamp);
  const hit = interpolate(frame, [4.95 * fps, 5.55 * fps], [0, 1], clamp);
  const separate = interpolate(frame, [5.3 * fps, 5.75 * fps], [0, 1], clamp);
  const lock = interpolate(frame, [5.65 * fps, 7 * fps], [0, 1], {...clamp, easing: ease});
  const rise = interpolate(frame, [5.35 * fps, 7 * fps], [0, 1], {...clamp, easing: ease});
  const radians = (tilt * Math.PI) / 180;
  const lipX = 965 + 26 * Math.cos(radians) + 285 * Math.sin(radians);
  const lipY = 745 + 26 * Math.sin(radians) - 285 * Math.cos(radians);
  const impactX = lipX + 58;
  const drained = interpolate(frame, [2.05 * fps, 5.95 * fps], [0, 87], {...clamp, easing: Easing.bezier(0.32, 0.38, 0.72, 0.95)});
  const waveEnvelope = interpolate(frame, [0.8 * fps, 1.8 * fps, 5.25 * fps, 6.15 * fps], [0, 1, 1, 0], clamp);
  const wave = Math.sin(frame * 0.19) * 9 * waveEnvelope;
  const waterLevel = -195 + drained;
  const surfaceLeft = waterLevel + 88 * Math.tan(radians) + wave;
  const surfaceRight = waterLevel - 88 * Math.tan(radians) - wave;
  const liquidSurface = `M-120 ${surfaceLeft} C-55 ${surfaceLeft - wave * 1.5}, 55 ${surfaceRight + wave * 1.5}, 120 ${surfaceRight}`;
  const dropX = impactX + 4 + rise * 20;
  const dropY = 887 - rise * 385;
  const cameraScale = 1 + lock * 2.5;
  const cameraX = 960 - lock * cameraScale * (dropX - 960);
  const cameraY = 540 - lock * cameraScale * (dropY - 540);
  const smallTitle = shortHook
    ? interpolate(currentFrame, [0, 0.12 * fps, 1.8 * fps, 2.2 * fps], [1, 1, 1, 0], clamp)
    : interpolate(frame, [0, 0.45 * fps, 3.9 * fps, 4.35 * fps], [0, 1, 1, 0], clamp);
  const finalTitle = shortHook
    ? interpolate(currentFrame, [2.5 * fps, 2.95 * fps], [0, 1], clamp)
    : interpolate(frame, [5.9 * fps, 6.45 * fps], [0, 1], clamp);

  return (
    <AbsoluteFill style={{background: '#100e0e'}}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{position: 'absolute'}}>
        <defs>
          <radialGradient id="amber"><stop stopColor="#493021" stopOpacity=".56"/><stop offset="1" stopColor="#100e0e" stopOpacity="0"/></radialGradient>
          <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f9daa3" stopOpacity=".75"/><stop offset=".48" stopColor="#adced0" stopOpacity=".48"/><stop offset="1" stopColor="#f5d19a" stopOpacity=".75"/></linearGradient>
          <linearGradient id="stream" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#dceef0" stopOpacity=".2"/><stop offset=".5" stopColor="#dceef0" stopOpacity=".95"/><stop offset="1" stopColor="#dceef0" stopOpacity=".3"/></linearGradient>
          <linearGradient id="openingTypography"><stop stopColor="#e1b477"/><stop offset=".48" stopColor="#f8e4bf"/><stop offset="1" stopColor="#aedee8"/></linearGradient>
          <filter id="soft"><feGaussianBlur stdDeviation="22"/></filter>
          <clipPath id="glassInside" clipPathUnits="userSpaceOnUse"><path d="M-84-291L-59-12H59L84-291Z"/></clipPath>
        </defs>

        <g transform={`translate(${cameraX} ${cameraY}) scale(${cameraScale}) translate(${-960} ${-540})`}>
          <rect width="1920" height="1080" fill="url(#amber)"/>
          <g opacity={0.13 * (1 - lock * .7)} stroke={gold} strokeWidth="2">
            <path d="M175 0V680M390 0V700M602 0V690M1480 0V695M1690 0V700"/>
            <path d="M175 165H602M175 460H602M1480 170H1690M1480 475H1690"/>
          </g>
          <g opacity={0.1 * (1 - lock * .8)} fill="#e1a96a" filter="url(#soft)">
            <ellipse cx="300" cy="655" rx="42" ry="110"/>
            <ellipse cx="1570" cy="660" rx="45" ry="125"/>
            <ellipse cx="1740" cy="615" rx="33" ry="95"/>
          </g>
          <path d="M0 750H1100V822H0Z" fill="#3b291e" fillOpacity=".22"/>
          <path d="M100 750Q650 733 1100 750" fill="none" stroke={gold} strokeOpacity=".62" strokeWidth="3"/>
          <path d="M1100 750V822" stroke={gold} strokeOpacity=".38" strokeWidth="3"/>
          <path d="M0 905Q960 894 1920 905" fill="none" stroke={gold} strokeOpacity=".4" strokeWidth="2"/>
          <path d="M100 948Q960 933 1820 948" fill="none" stroke={gold} strokeOpacity=".11" strokeWidth="2"/>

          <ellipse cx={impactX} cy="902" rx={12 + groundHit * 90} ry={2 + groundHit * 8} fill="#a5dce6" fillOpacity={groundHit * .12} stroke={water} strokeOpacity={groundHit * .54} strokeWidth="2"/>
          <path d={`M${impactX - 126 * groundHit} 904 Q${impactX} ${893 - 8 * groundHit} ${impactX + 126 * groundHit} 904`} fill="none" stroke={water} strokeOpacity={groundHit * .25} strokeWidth="2"/>

          <g transform={`translate(965 745) rotate(${tilt}) translate(-64 10)`} fill="none" stroke="url(#glass)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity={1 - lock}>
            <g clipPath="url(#glassInside)">
              <path d={`${liquidSurface} L120 20 H-120Z`} fill={water} fillOpacity=".16" stroke="none"/>
              <path d={liquidSurface} stroke={water} strokeOpacity=".8" strokeWidth="3"/>
            </g>
            <path d="M-90-295L-64-10Q-63 0-45 0H45Q63 0 64-10L90-295"/>
            <ellipse cx="0" cy="-295" rx="90" ry="19"/>
            <path d="M-55-18Q0-10 55-18" stroke={gold} strokeOpacity=".35" strokeWidth="2"/>
            <path d="M-45 0Q0 8 45 0" stroke={gold} strokeOpacity=".55"/>
          </g>

          <path d={`M${lipX.toFixed(1)} ${lipY.toFixed(1)} C${lipX + 25} ${lipY + 48}, ${impactX - 8} 817, ${impactX} 895`} fill="none" stroke="url(#stream)" strokeWidth={5 + pour * 3} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - pourIn} opacity={pourOut * (1 - lock * .55)}/>
          <path d={`M${lipX.toFixed(1)} ${lipY.toFixed(1)} C${lipX + 25} ${lipY + 48}, ${impactX - 8} 817, ${impactX} 895`} fill="none" stroke="#eefaff" strokeWidth="1.7" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - pourIn} opacity={pourOut * .86 * (1 - lock * .55)}/>
          <g opacity={hit * (1 - lock * .8)} fill="none" stroke={water} strokeWidth="2.5" strokeLinecap="round">
            <path d={`M${impactX} 896Q${impactX - 29} 840 ${impactX - 62} 856`} strokeDasharray="75" strokeDashoffset={75 * (1 - hit)}/>
            <path d={`M${impactX} 896Q${impactX + 24} 844 ${impactX + 65} 862`} strokeDasharray="78" strokeDashoffset={78 * (1 - hit)}/>
            <path d={`M${impactX - 16} 898Q${impactX} 872 ${impactX + 21} 898`} opacity=".75"/>
          </g>
          <g opacity={hit * (1 - lock)} fill={water}>
            <circle cx={impactX - 62} cy="859" r="4"/><circle cx={impactX + 65} cy="860" r="3"/><circle cx={impactX - 32} cy="841" r="2.5"/>
          </g>
          <path d={`M${dropX} ${dropY - 16 - lock * 13} C${dropX - 8 - lock * 6} ${dropY - 1}, ${dropX - 11 - lock * 7} ${dropY + 13 + lock * 8}, ${dropX} ${dropY + 17 + lock * 10} C${dropX + 11 + lock * 7} ${dropY + 13 + lock * 8}, ${dropX + 8 + lock * 6} ${dropY - 1}, ${dropX} ${dropY - 16 - lock * 13}Z`} fill="#a8dfe7" fillOpacity={separate * .17} stroke={water} strokeWidth="3" opacity={separate}/>
          <circle cx={dropX - 4} cy={dropY - 4} r="3" fill="#fff5d8" opacity={separate * .9}/>
          <circle cx={dropX} cy={dropY} r={31 + lock * 17} fill="none" stroke={gold} strokeWidth="1.6" strokeOpacity={separate * lock * .7} strokeDasharray="6 11"/>
          <path d="M135 110H470" stroke={gold} strokeOpacity=".5" strokeWidth="2"/>
          <text x="135" y="97" fill="url(#openingTypography)" fontSize="19" letterSpacing="5" fontFamily="Noto Sans CJK SC, sans-serif" opacity={1 - lock}>THE WATER</text>
        </g>
      </svg>
      <div style={{position:'absolute',right:125,top:103,fontFamily:'Noto Sans CJK SC, sans-serif',fontSize:52,letterSpacing:7,opacity:smallTitle,...gradientText}}>{shortHook ? '一杯水里，有什么？' : '一杯普通的水'}</div>
      <div style={{position:'absolute',left:145,bottom:110,fontFamily:'Noto Sans CJK SC, sans-serif',fontSize:44,letterSpacing:4,opacity:finalTitle,...gradientText}}>其中一滴水</div>
    </AbsoluteFill>
  );
};
