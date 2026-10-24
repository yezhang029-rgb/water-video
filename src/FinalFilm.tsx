import React from 'react';
import {Audio, Video} from '@remotion/media';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  random,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const font = '"Noto Sans CJK SC", "Source Han Sans SC", "Microsoft YaHei", sans-serif';

const opacityWindow = (frame: number, start: number, fadeIn: number, end: number, fadeOut: number) =>
  interpolate(frame, [start, start + fadeIn, end - fadeOut, end], [0, 1, 1, 0], clamp);

const DeepBackground: React.FC<{glowX?: number; glowY?: number}> = ({glowX = 50, glowY = 48}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle at ${glowX}% ${glowY}%, #0e5b80 0%, #062c50 22%, #020e24 58%, #010611 100%)`,
    }}
  />
);

const Subtitle: React.FC<{children: React.ReactNode; opacity: number}> = ({children, opacity}) => (
  <div
    style={{
      position: 'absolute',
      left: 120,
      right: 120,
      bottom: 68,
      textAlign: 'center',
      color: '#f4fbff',
      fontFamily: font,
      fontSize: 46,
      fontWeight: 600,
      letterSpacing: 2,
      opacity,
      textShadow: '0 3px 20px rgba(0,0,0,.9), 0 1px 4px rgba(0,0,0,.95)',
    }}
  >
    {children}
  </div>
);

const CornerTitle: React.FC<{children: React.ReactNode; opacity: number}> = ({children, opacity}) => (
  <div
    style={{
      position: 'absolute',
      right: 84,
      top: 68,
      color: 'white',
      fontFamily: font,
      fontSize: 52,
      fontWeight: 700,
      letterSpacing: 3,
      opacity,
      textShadow: '0 3px 18px rgba(0,0,0,.9)',
    }}
  >
    {children}
  </div>
);

const ParticleField: React.FC<{
  count: number;
  color?: string;
  spread?: number;
  speed?: number;
  brightness?: number;
  seed: string;
}> = ({count, color = '#92dcff', spread = 1, speed = 1, brightness = 1, seed}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {Array.from({length: count}).map((_, i) => {
        const x = random(`${seed}-x-${i}`) * 1920;
        const y = random(`${seed}-y-${i}`) * 1080;
        const depth = 0.25 + random(`${seed}-z-${i}`) * 0.75;
        const size = 2 + depth * 9;
        const driftX = Math.sin(frame * 0.012 * speed + i * 1.7) * 24 * depth * spread;
        const driftY = Math.cos(frame * 0.009 * speed + i * 1.13) * 20 * depth * spread;
        const pulse = 0.55 + 0.45 * Math.sin(frame * 0.028 + i * 2.1);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: '50%',
              backgroundColor: color,
              opacity: (0.25 + depth * 0.55) * (0.75 + pulse * 0.25),
              translate: `${driftX}px ${driftY}px`,
              boxShadow: `0 0 ${10 + size * 2}px rgba(102,207,255,${0.35 * brightness})`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const HeroMolecule: React.FC<{progress: number}> = ({progress}) => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 18) * 14;
  return (
    <div style={{position: 'absolute', left: 960, top: 500, translate: `-50% calc(-50% + ${bob}px)`, scale: 0.75 + progress * 0.45}}>
      <div style={{position: 'absolute', left: -98, top: 36, width: 120, height: 8, rotate: '-27deg', backgroundColor: 'rgba(145,220,255,.5)', boxShadow: '0 0 16px #5ac8ff'}} />
      <div style={{position: 'absolute', left: 20, top: 36, width: 120, height: 8, rotate: '27deg', backgroundColor: 'rgba(145,220,255,.5)', boxShadow: '0 0 16px #5ac8ff'}} />
      <div style={{position: 'absolute', left: -70, top: -70, width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle at 36% 30%, #effcff, #37a7dc 42%, #07375b 75%)', boxShadow: '0 0 55px rgba(72,190,255,.8)'}} />
      <div style={{position: 'absolute', left: -154, top: 45, width: 72, height: 72, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, white, #8ed9ff 48%, #174f75)', boxShadow: '0 0 28px rgba(123,216,255,.7)'}} />
      <div style={{position: 'absolute', left: 82, top: 45, width: 72, height: 72, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, white, #8ed9ff 48%, #174f75)', boxShadow: '0 0 28px rgba(123,216,255,.7)'}} />
    </div>
  );
};

const IntroVideo: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill>
      <Video
        src={staticFile('assets/shot01.mp4')}
        trimAfter={7 * fps}
        objectFit="cover"
        volume={(f) => interpolate(f, [0, 0.75 * fps, 3.25 * fps, 5.5 * fps, 7 * fps], [1, 1, 0.68, 0.16, 0], clamp)}
        style={{width: '100%', height: '100%'}}
      />
    </AbsoluteFill>
  );
};

const MicroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const push = interpolate(frame, [0, 7 * fps], [0.35, 1], {...clamp, easing: Easing.bezier(0.3, 0, 0.1, 1)});
  return (
    <AbsoluteFill style={{opacity: interpolate(frame, [0, 0.7 * fps], [0, 1], clamp)}}>
      <DeepBackground glowX={62} glowY={52} />
      <ParticleField count={105} seed="micro" spread={0.45 + push} speed={0.65} />
      <HeroMolecule progress={push} />
      <CornerTitle opacity={opacityWindow(frame, 0.2 * fps, 0.5 * fps, 2.7 * fps, 0.5 * fps)}>其中一滴水</CornerTitle>
      <Subtitle opacity={opacityWindow(frame, 0.7 * fps, 0.35 * fps, 2.6 * fps, 0.45 * fps)}>里面是？</Subtitle>
      <Subtitle opacity={opacityWindow(frame, 2.65 * fps, 0.6 * fps, 6.8 * fps, 0.5 * fps)}>
        一滴水里，大约有 <span style={{fontSize: 64, fontWeight: 800, color: '#9ce8ff'}}>10<sup style={{fontSize: 36}}>21</sup></span> 个水分子
      </Subtitle>
    </AbsoluteFill>
  );
};

const MoleculeWaveScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const transfer = interpolate(frame, [0.7 * fps, 7.5 * fps], [0, 1], {...clamp, easing: Easing.bezier(0.25, 0.1, 0.2, 1)});
  return (
    <AbsoluteFill>
      <DeepBackground glowX={48} glowY={48} />
      <ParticleField count={145} seed="wave" spread={0.5 + transfer * 1.1} speed={1.3} brightness={1.2} />
      <HeroMolecule progress={0.2 + transfer * 0.25} />
      {[0, 1, 2, 3].map((i) => {
        const p = interpolate(frame, [(1.6 + i * 1.15) * fps, (5.4 + i * 1.15) * fps], [0, 1], clamp);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '51%',
              width: 480,
              height: 220,
              border: '3px solid rgba(112,214,255,.55)',
              borderRadius: '50%',
              translate: '-50% -50%',
              scale: 0.25 + p * 3.4,
              opacity: (1 - p) * 0.72,
              boxShadow: '0 0 28px rgba(70,190,255,.35)',
            }}
          />
        );
      })}
      <Subtitle opacity={opacityWindow(frame, 0.6 * fps, 0.5 * fps, 5.0 * fps, 0.6 * fps)}>一个分子的运动，传递给周围的每一个邻居。</Subtitle>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 155,
          textAlign: 'center',
          color: '#eafaff',
          fontFamily: font,
          fontSize: 66,
          fontWeight: 800,
          letterSpacing: 7,
          opacity: opacityWindow(frame, 5.1 * fps, 0.8 * fps, 9.8 * fps, 0.8 * fps),
          textShadow: '0 0 30px rgba(90,210,255,.55)',
        }}
      >
        庞大，由无数微小组成。
      </div>
    </AbsoluteFill>
  );
};

const StarMorphScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const morph = interpolate(frame, [0, 10.5 * fps], [0, 1], {...clamp, easing: Easing.bezier(0.2, 0.8, 0.15, 1)});
  return (
    <AbsoluteFill>
      <DeepBackground glowX={50 - morph * 18} glowY={50} />
      <ParticleField count={170} seed="stars" spread={0.8 + morph * 2.8} speed={0.7 + morph} color={morph > 0.5 ? '#f3f8ff' : '#86dcff'} brightness={1.7} />
      <div style={{position: 'absolute', left: 960, top: 520, width: 720, height: 720, borderRadius: '50%', translate: '-50% -50%', scale: 0.2 + morph * 2.4, opacity: (1 - morph) * 0.6, background: 'radial-gradient(circle, rgba(103,216,255,.35), rgba(14,82,129,.08) 48%, transparent 70%)'}} />
      <Subtitle opacity={opacityWindow(frame, 0.6 * fps, 0.7 * fps, 10.6 * fps, 0.8 * fps)}>当我们不断缩小，微观世界也像一片星海。</Subtitle>
    </AbsoluteFill>
  );
};

const SolarSystemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const reveal = interpolate(frame, [0, 2.3 * fps], [0, 1], {...clamp, easing: Easing.bezier(0.2, 0.8, 0.2, 1)});
  const travel = interpolate(frame, [1.6 * fps, 8.7 * fps], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DeepBackground glowX={22} glowY={48} />
      <ParticleField count={115} seed="solar-stars" spread={2.2} speed={0.35} color="#f7fbff" brightness={1.4} />
      <div style={{position: 'absolute', left: 330, top: 535, width: 230, height: 230, borderRadius: '50%', translate: '-50% -50%', background: 'radial-gradient(circle at 35% 35%, #fff9cc, #ffc34f 33%, #ff7d1a 65%, #9d2608)', boxShadow: '0 0 60px #ff9f31, 0 0 160px rgba(255,119,20,.5)', opacity: reveal}} />
      {[540, 750, 980, 1240].map((width, i) => (
        <div key={width} style={{position: 'absolute', left: 330, top: 535, width, height: width * 0.32, border: '2px solid rgba(120,190,230,.22)', borderRadius: '50%', translate: '-50% -50%', rotate: '-8deg', opacity: reveal}} />
      ))}
      <div style={{position: 'absolute', left: 330 + 760 * travel, top: 480 + Math.sin(travel * Math.PI * 2) * 75, width: 116, height: 116, borderRadius: '50%', background: 'radial-gradient(circle at 32% 30%, #d9ffff, #2688c2 37%, #124c72 58%, #07192d 78%)', boxShadow: '0 0 34px rgba(83,187,240,.7)', opacity: reveal}} />
      <div style={{position: 'absolute', left: 1100, top: 245, color: '#9ddcf7', fontFamily: font, fontSize: 25, letterSpacing: 2, opacity: opacityWindow(frame, 2.0 * fps, 0.5 * fps, 5.2 * fps, 0.5 * fps)}}>10⁷ m · 地球</div>
      <div style={{position: 'absolute', left: 1210, top: 310, color: '#9ddcf7', fontFamily: font, fontSize: 25, letterSpacing: 2, opacity: opacityWindow(frame, 4.8 * fps, 0.5 * fps, 8.6 * fps, 0.5 * fps)}}>10¹¹ m · 太阳系</div>
      <Subtitle opacity={opacityWindow(frame, 0.8 * fps, 0.6 * fps, 8.6 * fps, 0.7 * fps)}>一个个体，也处在更大的系统里。</Subtitle>
    </AbsoluteFill>
  );
};

const GalaxyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const reveal = interpolate(frame, [0, 5.4 * fps], [0, 1], {...clamp, easing: Easing.bezier(0.2, 0.8, 0.1, 1)});
  return (
    <AbsoluteFill>
      <DeepBackground glowX={50} glowY={50} />
      <ParticleField count={95} seed="deep-space" spread={3} speed={0.25} color="#fff5dc" brightness={1.2} />
      <div style={{position: 'absolute', left: 960, top: 520, width: 1250, height: 580, translate: '-50% -50%', rotate: `${-18 + reveal * 8}deg`, scale: 0.15 + reveal * 0.9, opacity: reveal}}>
        {Array.from({length: 230}).map((_, i) => {
          const arm = i % 4;
          const radius = Math.pow(random(`gal-r-${i}`), 0.72) * 560;
          const angle = radius * 0.022 + arm * Math.PI * 0.5 + random(`gal-a-${i}`) * 0.7;
          const x = 625 + Math.cos(angle) * radius;
          const y = 290 + Math.sin(angle) * radius * 0.34;
          const size = 2 + random(`gal-s-${i}`) * 6;
          return <div key={i} style={{position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: '50%', backgroundColor: i % 9 === 0 ? '#ffd7a8' : '#d9ecff', opacity: 0.35 + random(`gal-o-${i}`) * 0.65, boxShadow: `0 0 ${size * 3}px rgba(170,216,255,.8)`}} />;
        })}
        <div style={{position: 'absolute', left: 525, top: 210, width: 200, height: 150, borderRadius: '50%', background: 'radial-gradient(ellipse, #fff8d5, #9bd7ff 28%, rgba(55,120,190,.3) 58%, transparent 74%)', boxShadow: '0 0 70px rgba(109,185,255,.65)'}} />
      </div>
      <Subtitle opacity={opacityWindow(frame, 0.7 * fps, 0.7 * fps, 6.8 * fps, 0.7 * fps)}>更大的整体，也由无数个体组成。</Subtitle>
    </AbsoluteFill>
  );
};

const ReturnScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const arrival = interpolate(frame, [0, 2.6 * fps], [0, 1], {...clamp, easing: Easing.bezier(0.12, 0.75, 0.12, 1)});
  const fadeToBlack = interpolate(frame, [3.35 * fps, 3.5 * fps], [1, 0], clamp);
  return (
    <AbsoluteFill style={{backgroundColor: '#010713'}}>
      <ParticleField count={90} seed="return-stars" spread={4 - arrival * 3} speed={2.2} color="#dff5ff" brightness={1.5} />
      <Img src={staticFile('assets/drop-return.png')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: arrival * fadeToBlack, scale: 1 + arrival * 0.08, filter: `blur(${(1 - arrival) * 11}px) brightness(${0.28 + arrival * 0.34}) saturate(.72)`}} />
      <AbsoluteFill style={{backgroundColor: '#00132d', mixBlendMode: 'color', opacity: arrival * 0.72 * fadeToBlack}} />
      <div style={{position: 'absolute', inset: 0, clipPath: 'circle(112px at 68.5% 55%)', opacity: arrival * fadeToBlack}}>
        <Img src={staticFile('assets/drop-return.png')} style={{width: '100%', height: '100%', objectFit: 'cover', scale: 1 + arrival * 0.08, filter: 'brightness(1.12) saturate(1.08)'}} />
      </div>
      <Subtitle opacity={opacityWindow(frame, 0.35 * fps, 0.65 * fps, 3.25 * fps, 0.45 * fps) * fadeToBlack}>一滴水很小，却藏着一个世界。</Subtitle>
      <AbsoluteFill style={{backgroundColor: 'black', opacity: 1 - fadeToBlack}} />
    </AbsoluteFill>
  );
};

export const FinalFilm: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{backgroundColor: 'black'}}>
      <Sequence from={0} durationInFrames={7 * fps} premountFor={fps}><IntroVideo /></Sequence>
      <Sequence from={7 * fps} durationInFrames={7 * fps} premountFor={fps}><MicroScene /></Sequence>
      <Sequence from={14 * fps} durationInFrames={10 * fps} premountFor={fps}><MoleculeWaveScene /></Sequence>
      <Sequence from={24 * fps} durationInFrames={11 * fps} premountFor={fps}><StarMorphScene /></Sequence>
      <Sequence from={35 * fps} durationInFrames={9 * fps} premountFor={fps}><SolarSystemScene /></Sequence>
      <Sequence from={44 * fps} durationInFrames={7 * fps} premountFor={fps}><GalaxyScene /></Sequence>
      <Sequence from={51 * fps} durationInFrames={4 * fps} premountFor={fps}><ReturnScene /></Sequence>
      <Audio src={staticFile('assets/cosmic-score.m4a')} volume={0.78} />
    </AbsoluteFill>
  );
};
