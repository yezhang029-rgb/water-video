import React from 'react';
import {AbsoluteFill, Easing, Freeze, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {MicroEntry} from './MicroEntry';
import {gradientText, mutedGradientText, numberGradientText} from './Typography';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.2, 0.76, 0.2, 1);
const gold = '#dfb879';
const cyan = '#b5e4ec';
const font = 'Noto Sans CJK SC, sans-serif';

const Dots: React.FC<{time: number; opacity: number}> = ({time, opacity}) => (
  <g fill={cyan} opacity={opacity}>
    {Array.from({length: 180}, (_, i) => {
      const angle = i * 2.3999632297;
      const spread = Math.sqrt((i + 0.5) / 180);
      return (
        <circle
          key={i}
          cx={960 + Math.cos(angle) * spread * 690 + Math.sin(time * 2 + i) * 3}
          cy={540 + Math.sin(angle) * spread * 360 + Math.cos(time * 1.7 + i) * 3}
          r={1.5 + (i % 5) * 0.34}
          opacity=".42"
        />
      );
    })}
  </g>
);

const Molecule: React.FC<{scale: number; opacity: number}> = ({scale, opacity}) => (
  <g transform={`translate(960 540) rotate(-11) scale(${scale})`} opacity={opacity}>
    <path d="M-36 27L-9 7M9 7L36 27" fill="none" stroke={gold} strokeWidth="3" strokeLinecap="round"/>
    <circle r="22" fill="#163a42" stroke={cyan} strokeWidth="3"/>
    <circle cx="-43" cy="33" r="11" fill="#44301f" stroke={gold} strokeWidth="2.5"/>
    <circle cx="43" cy="33" r="11" fill="#44301f" stroke={gold} strokeWidth="2.5"/>
    <circle cx="-7" cy="-7" r="4" fill="#edf9f4" opacity=".8"/>
  </g>
);

export const ScaleAnalogy: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const time = frame / fps;
  const handoff = interpolate(time, [0.1, 0.95], [0, 1], clamp);
  const question = interpolate(time, [0.85, 1.1, 1.65, 1.85], [0, 1, 1, 0], clamp);
  const analogyHook = interpolate(time, [1.72, 2.05, 3.52, 3.92], [0, 1, 1, 0], clamp);
  const scaleIdea = interpolate(time, [2.45, 2.8, 3.68, 4.02], [0, 1, 1, 0], clamp);
  const ball = interpolate(time, [1.95, 2.65], [0, 1], {...clamp, easing: ease});
  const ruler = interpolate(time, [1.1, 1.8], [0, 1], clamp);
  const pull = interpolate(time, [3.85, 5.92], [0, 1], {...clamp, easing: ease});
  const moleculeScale = interpolate(time, [1.65, 2.55, 3.86, 5.05], [2.25, 1.35, 1.35, 0.05], {...clamp, easing: ease});
  const moleculeFade = interpolate(time, [4.35, 5.08], [1, 0], clamp);
  const dotFade = interpolate(time, [3.8, 5.05], [1, 0], clamp);
  const dropReveal = interpolate(time, [4.45, 5.55], [0, 1], clamp);
  const dropRadius = interpolate(time, [4.85, 6.3, 7.66], [1050, 390, 55], {...clamp, easing: ease});
  const dropX = interpolate(time, [4.85, 7.66], [960, 560], {...clamp, easing: ease});
  const moonReveal = interpolate(time, [6.62, 7.5], [0, 1], clamp);
  const countCallout = interpolate(time, [5.56, 5.98, 6.96, 7.36], [0, 1, 1, 0], clamp);
  const moonCallout = interpolate(time, [7.32, 7.7], [0, 1], clamp);
  const rulerRadius = interpolate(time, [1.65, 2.55], [160, 76], {...clamp, easing: ease});
  const rulerY = interpolate(time, [1.65, 2.55], [360, 430], {...clamp, easing: ease});
  const speedLines = interpolate(time, [3.85, 4.3, 6.15, 7], [0, 1, 1, 0], clamp);
  const expandingRuler = interpolate(time, [3.92, 5.42], [0, 1], {...clamp, easing: ease});
  const expandingRulerOpacity = interpolate(time, [3.92, 4.22, 5.15, 5.62], [0, 1, 1, 0], clamp);
  const stage = time < 4.13 ? '4 cm' : time < 4.63 ? '4 m' : time < 5.17 ? '4 km' : '≈ 600 km';

  return (
    <AbsoluteFill style={{background: '#15110f', overflow: 'hidden'}}>
      <AbsoluteFill style={{opacity: 1 - handoff}}><Freeze frame={113}><MicroEntry /></Freeze></AbsoluteFill>
      <AbsoluteFill style={{opacity: handoff}}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{position: 'absolute'}}>
          <defs>
            <radialGradient id="scaleBg"><stop stopColor="#203940"/><stop offset=".55" stopColor="#172125"/><stop offset="1" stopColor="#15110f"/></radialGradient>
            <radialGradient id="waterSphere"><stop stopColor="#2a606a" stopOpacity=".35"/><stop offset=".75" stopColor="#a7e1e9" stopOpacity=".07"/><stop offset="1" stopColor="#a7e1e9" stopOpacity=".19"/></radialGradient>
            <radialGradient id="moonFill"><stop stopColor="#534c42" stopOpacity=".22"/><stop offset="1" stopColor="#181714" stopOpacity=".07"/></radialGradient>
            <linearGradient id="scaleTypography"><stop stopColor="#e6b878"/><stop offset=".48" stopColor="#fff0d1"/><stop offset="1" stopColor="#afe6ef"/></linearGradient>
            <linearGradient id="scaleNumberTypography"><stop stopColor="#f0d397"/><stop offset=".45" stopColor="#ddf7ef"/><stop offset="1" stopColor="#8fdfed"/></linearGradient>
            <linearGradient id="scaleMutedTypography"><stop stopColor="#b69a72"/><stop offset=".48" stopColor="#c8c2ad"/><stop offset="1" stopColor="#9cbfc3"/></linearGradient>
          </defs>
          <rect width="1920" height="1080" fill="url(#scaleBg)"/>
          <g stroke={gold} strokeWidth="2" fill="none" opacity=".22">
            <path d="M145 170H520M1400 170H1775M145 900H525M1400 900H1775"/>
            <path d="M145 170V365M1775 170V365M145 700V900M1775 700V900"/>
            <circle cx="960" cy="540" r="290" strokeDasharray="4 22" opacity={1 - pull}/>
          </g>

          <Dots time={time + 3.8} opacity={dotFade}/>
          <g opacity={ruler * (1 - pull)} fill="none" stroke={gold} strokeWidth="2">
            <path d={`M${960 - rulerRadius} ${rulerY}H${960 + rulerRadius}M${960 - rulerRadius} ${rulerY - 18}V${rulerY + 18}M${960 + rulerRadius} ${rulerY - 18}V${rulerY + 18}`}/>
            <path d={`M960 ${540 - rulerRadius}V${rulerY + 20}`} opacity=".6"/>
            <circle cx="960" cy="540" r={rulerRadius} strokeDasharray="7 12" strokeOpacity=".55"/>
          </g>
          <Molecule scale={moleculeScale} opacity={moleculeFade}/>
          <text x={970 + rulerRadius} y={rulerY + 3} opacity={ruler * (1 - pull)} fill="url(#scaleTypography)" fontFamily={font} fontSize="27" letterSpacing="3">水分子 ≈ 0.3 nm</text>

          <g opacity={ball * (1 - pull)}>
            <circle cx="1440" cy="538" r="74" fill="#ded9c7" fillOpacity=".07" stroke="#eee5ce" strokeWidth="3"/>
            <path d="M1396 494Q1420 475 1450 480" fill="none" stroke="#eee5ce" strokeWidth="2" strokeOpacity=".55"/>
            <path d="M1185 540H1350" fill="none" stroke={gold} strokeWidth="2" strokeDasharray="7 12"/>
            <text x="1440" y="653" textAnchor="middle" fill="url(#scaleTypography)" fontFamily={font} fontSize="31" letterSpacing="3">乒乓球 · 4 cm</text>
          </g>

          <g opacity={speedLines} stroke={cyan} strokeWidth="2" fill="none">
            {Array.from({length: 20}, (_, i) => {
              const a = i * Math.PI / 10;
              const r0 = 110 + (i % 3) * 31;
              const r1 = r0 + 95 + pull * 420;
              return <path key={i} d={`M${960 + Math.cos(a) * r0} ${540 + Math.sin(a) * r0}L${960 + Math.cos(a) * r1} ${540 + Math.sin(a) * r1}`} opacity={.08 + .11 * (i % 3)}/>;
            })}
          </g>
          <g opacity={expandingRulerOpacity} fill="none" strokeWidth="2">
            <circle cx="960" cy="540" r={65 + expandingRuler * 760} stroke={cyan} strokeOpacity=".33" strokeDasharray="6 24"/>
            <circle cx="960" cy="540" r={30 + expandingRuler * 500} stroke={gold} strokeOpacity=".28" strokeDasharray="3 23"/>
            <circle cx="960" cy="540" r={7 + expandingRuler * 33} stroke={cyan} strokeOpacity=".8"/>
          </g>

          <g opacity={dropReveal}>
            <circle cx={dropX} cy="540" r={dropRadius} fill="url(#waterSphere)" stroke={cyan} strokeOpacity=".88" strokeWidth={interpolate(time, [4.9, 7.6], [5, 3], clamp)}/>
            <circle cx={dropX} cy="540" r={dropRadius * .82} fill="none" stroke={cyan} strokeOpacity=".12" strokeWidth="2" strokeDasharray="8 25"/>
          </g>

          <g opacity={moonReveal}>
            <circle cx="1265" cy="540" r="330" fill="url(#moonFill)" stroke={gold} strokeWidth="3" strokeOpacity=".7"/>
            <circle cx="1168" cy="429" r="48" fill="none" stroke={gold} strokeWidth="2" strokeOpacity=".16"/>
            <circle cx="1389" cy="612" r="66" fill="none" stroke={gold} strokeWidth="2" strokeOpacity=".13"/>
            <circle cx="1230" cy="704" r="35" fill="none" stroke={gold} strokeWidth="2" strokeOpacity=".15"/>
            <path d="M495 732H625M495 716V748M625 716V748M935 880H1595M935 863V897M1595 863V897" fill="none" stroke={gold} strokeWidth="2" strokeOpacity=".65"/>
            <text x="560" y="788" textAnchor="middle" fill="url(#scaleTypography)" fontFamily={font} fontSize="32" letterSpacing="3">这滴水</text>
            <text x="1265" y="938" textAnchor="middle" fill="url(#scaleTypography)" fontFamily={font} fontSize="32" letterSpacing="3">月球</text>
          </g>

          <path d="M150 98H505" stroke={gold} strokeOpacity=".55" strokeWidth="2"/>
          <text x="150" y="86" fill="url(#scaleMutedTypography)" fontFamily={font} fontSize="20" letterSpacing="5">SCALE</text>
          <text x="1772" y="90" textAnchor="end" fill="url(#scaleMutedTypography)" opacity=".62" fontFamily={font} fontSize="21" letterSpacing="3">假如同比放大</text>
          <g opacity={pull}>
            <text x="150" y="168" fill="url(#scaleTypography)" fontFamily={font} fontSize="34" letterSpacing="4">假想尺度</text>
            <text x="150" y="244" fill="url(#scaleNumberTypography)" fontFamily={font} fontSize="65" letterSpacing="2">{stage}</text>
          </g>
        </svg>

        <div style={{position:'absolute',right:145,bottom:105,fontFamily:font,fontSize:46,letterSpacing:4,opacity:question,...gradientText}}>10²¹，到底有多大？</div>
        <div style={{position:'absolute',right:145,top:148,fontFamily:font,fontSize:49,letterSpacing:5,opacity:analogyHook,...gradientText}}>拿乒乓球打个比方。</div>
        <div style={{position:'absolute',right:145,top:228,fontFamily:font,fontSize:35,letterSpacing:3,opacity:scaleIdea,...gradientText}}>如果一个水分子有它这么大……</div>
        <div style={{position:'absolute',left:145,bottom:104,fontFamily:font,fontSize:47,letterSpacing:3,opacity:countCallout,...gradientText}}>同一比例下，这滴水直径约 <span style={{fontSize:69,...numberGradientText}}>600 公里</span></div>
        <div style={{position:'absolute',left:145,bottom:104,fontFamily:font,fontSize:47,letterSpacing:3,opacity:moonCallout,...gradientText}}>相当于月球直径的 <span style={{fontSize:69,...numberGradientText}}>1/6</span></div>
        <div style={{position:'absolute',left:145,bottom:40,fontFamily:font,fontSize:28,letterSpacing:1,opacity:Math.max(countCallout,moonCallout) * .8,...mutedGradientText}}>水滴 0.05 mL · 分子约 0.3 nm · 同比放大示意</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
