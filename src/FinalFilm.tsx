import React from 'react';
import {Audio, Video} from '@remotion/media';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const font = '"Noto Sans CJK SC", "Source Han Sans SC", "Microsoft YaHei", sans-serif';
const ease = Easing.bezier(0.22, 0.72, 0.18, 1);

const fadeWindow = (frame: number, start: number, fadeIn: number, end: number, fadeOut: number) =>
  interpolate(frame, [start, start + fadeIn, end - fadeOut, end], [0, 1, 1, 0], clamp);

const Plate: React.FC<{
  src: string;
  progress: number;
  fromScale?: number;
  toScale?: number;
  fromX?: number;
  toX?: number;
  fromY?: number;
  toY?: number;
  opacity?: number;
  blur?: number;
  brightness?: number;
  saturate?: number;
  origin?: string;
}> = ({
  src,
  progress,
  fromScale = 1,
  toScale = 1.08,
  fromX = 0,
  toX = 0,
  fromY = 0,
  toY = 0,
  opacity = 1,
  blur = 0,
  brightness = 1,
  saturate = 1,
  origin = '50% 50%',
}) => {
  const p = ease(progress);
  const scale = interpolate(p, [0, 1], [fromScale, toScale]);
  const x = interpolate(p, [0, 1], [fromX, toX]);
  const y = interpolate(p, [0, 1], [fromY, toY]);
  return (
    <Img
      src={staticFile(src)}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transformOrigin: origin,
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        opacity,
        filter: `blur(${blur}px) brightness(${brightness}) saturate(${saturate})`,
      }}
    />
  );
};

const Grade: React.FC<{dark?: number; blue?: number}> = ({dark = 0.12, blue = 0.08}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at 50% 44%, transparent 30%, rgba(0,4,14,${dark}) 100%), linear-gradient(180deg, rgba(1,10,24,${blue}) 0%, transparent 42%, rgba(0,4,12,.2) 100%)`,
      pointerEvents: 'none',
    }}
  />
);

const Subtitle: React.FC<{children: React.ReactNode; opacity: number}> = ({children, opacity}) => (
  <div
    style={{
      position: 'absolute',
      left: 150,
      right: 150,
      bottom: 62,
      textAlign: 'center',
      color: '#f6fbff',
      fontFamily: font,
      fontSize: 44,
      lineHeight: 1.35,
      fontWeight: 560,
      letterSpacing: 2,
      opacity,
      textShadow: '0 3px 24px rgba(0,0,0,.94), 0 1px 5px rgba(0,0,0,.98)',
    }}
  >
    {children}
  </div>
);

const CornerTitle: React.FC<{children: React.ReactNode; opacity: number}> = ({children, opacity}) => (
  <div
    style={{
      position: 'absolute',
      right: 76,
      top: 64,
      color: '#f7fbff',
      fontFamily: font,
      fontSize: 48,
      fontWeight: 650,
      letterSpacing: 4,
      opacity,
      textShadow: '0 3px 22px rgba(0,0,0,.9)',
    }}
  >
    {children}
  </div>
);

const IntroVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill>
      <Video
        src={staticFile('assets/shot01-v2.mp4')}
        trimAfter={7 * fps}
        objectFit="cover"
        volume={(f) => interpolate(f, [0, 0.75 * fps, 3.25 * fps, 5.5 * fps, 7 * fps], [0.85, 0.85, 0.52, 0.12, 0], clamp)}
        style={{width: '100%', height: '100%'}}
      />
      <Grade dark={0.1} blue={0.01} />
      <CornerTitle opacity={fadeWindow(frame, 0.12 * fps, 0.42 * fps, 2.25 * fps, 0.55 * fps)}>
        一杯普通的水
      </CornerTitle>
    </AbsoluteFill>
  );
};

const MicroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = interpolate(frame, [0, 7 * fps], [0, 1], clamp);
  const handoff = interpolate(frame, [0.55 * fps, 1.7 * fps], [0, 1], clamp);
  const numberP = interpolate(frame, [3.45 * fps, 4.5 * fps], [0, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill style={{backgroundColor: '#020712'}}>
      <Plate
        src="assets/refined/intro-last.png"
        progress={interpolate(frame, [0, 1.55 * fps], [0, 1], clamp)}
        fromScale={1}
        toScale={5.6}
        origin="62.5% 30%"
        opacity={1 - handoff}
        brightness={interpolate(handoff, [0, 1], [1, 0.55])}
      />
      <Plate
        src="assets/refined/micro-entry.png"
        progress={p}
        fromScale={0.98}
        toScale={1.19}
        fromX={18}
        toX={-28}
        fromY={8}
        toY={-16}
        opacity={handoff}
        brightness={0.88 + handoff * 0.12}
        saturate={0.9}
      />
      <Grade dark={0.24} blue={0.12} />
      <CornerTitle opacity={fadeWindow(frame, 0.4 * fps, 0.45 * fps, 2.65 * fps, 0.5 * fps)}>
        其中一滴水
      </CornerTitle>
      <Subtitle opacity={fadeWindow(frame, 0.8 * fps, 0.35 * fps, 2.65 * fps, 0.45 * fps)}>里面是？</Subtitle>
      <Subtitle opacity={fadeWindow(frame, 2.75 * fps, 0.55 * fps, 6.75 * fps, 0.55 * fps)}>
        一滴水里，大约有{' '}
        <span style={{display: 'inline-block', color: '#d7f5ff', fontSize: 61, fontWeight: 720, transform: `scale(${0.92 + numberP * 0.08})`, opacity: numberP}}>
          10<sup style={{fontSize: 33}}>21</sup>
        </span>{' '}
        个水分子
      </Subtitle>
    </AbsoluteFill>
  );
};

const MoleculeWaveScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = interpolate(frame, [0, 10 * fps], [0, 1], clamp);
  const handoff = interpolate(frame, [0.45 * fps, 1.7 * fps], [0, 1], clamp);
  const pulse = interpolate(frame, [1.4 * fps, 3.0 * fps, 5.0 * fps, 7.0 * fps], [0.8, 1.04, 0.92, 1], clamp);
  return (
    <AbsoluteFill style={{backgroundColor: '#020712'}}>
      <Plate src="assets/refined/micro-entry.png" progress={p} fromScale={1.19} toScale={1.28} opacity={1 - handoff} brightness={0.92} saturate={0.9} />
      <Plate
        src="assets/refined/micro-wave.png"
        progress={p}
        fromScale={1.06}
        toScale={1.24}
        fromX={28}
        toX={-42}
        fromY={-8}
        toY={18}
        opacity={handoff}
        brightness={pulse}
        saturate={0.88}
      />
      <Grade dark={0.25} blue={0.11} />
      <Subtitle opacity={fadeWindow(frame, 0.6 * fps, 0.55 * fps, 5.0 * fps, 0.7 * fps)}>
        一个分子的运动，传递给周围的每一个邻居。
      </Subtitle>
      <div
        style={{
          position: 'absolute',
          left: 104,
          top: 142,
          width: 1080,
          color: '#f3fbff',
          fontFamily: font,
          fontSize: 67,
          lineHeight: 1.24,
          fontWeight: 690,
          letterSpacing: 6,
          opacity: fadeWindow(frame, 5.05 * fps, 0.8 * fps, 9.75 * fps, 0.75 * fps),
          textShadow: '0 4px 30px rgba(0,0,0,.9)',
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
  const p = interpolate(frame, [0, 11 * fps], [0, 1], clamp);
  const handoff = interpolate(frame, [0.35 * fps, 2.2 * fps], [0, 1], clamp);
  return (
    <AbsoluteFill style={{backgroundColor: '#01040a'}}>
      <Plate src="assets/refined/micro-wave.png" progress={p} fromScale={1.24} toScale={1.3} opacity={1 - handoff} brightness={0.9} saturate={0.85} />
      <Plate
        src="assets/refined/water-to-stars.png"
        progress={p}
        fromScale={1.12}
        toScale={0.97}
        fromX={-36}
        toX={42}
        opacity={handoff}
        brightness={0.9}
        saturate={0.86}
      />
      <Grade dark={0.2} blue={0.08} />
      <Subtitle opacity={fadeWindow(frame, 0.65 * fps, 0.65 * fps, 10.65 * fps, 0.75 * fps)}>
        当我们不断缩小，微观世界也像一片星海。
      </Subtitle>
    </AbsoluteFill>
  );
};

const ScaleMark: React.FC<{children: React.ReactNode; opacity: number; top: number}> = ({children, opacity, top}) => (
  <div
    style={{
      position: 'absolute',
      left: 86,
      top,
      color: 'rgba(220,241,249,.82)',
      fontFamily: font,
      fontSize: 23,
      fontWeight: 480,
      letterSpacing: 2.5,
      opacity,
      textShadow: '0 2px 12px rgba(0,0,0,.9)',
    }}
  >
    {children}
  </div>
);

const SolarSystemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = interpolate(frame, [0, 9 * fps], [0, 1], clamp);
  const handoff = interpolate(frame, [0.35 * fps, 1.8 * fps], [0, 1], clamp);
  return (
    <AbsoluteFill style={{backgroundColor: '#01040a'}}>
      <Plate src="assets/refined/water-to-stars.png" progress={p} fromScale={0.97} toScale={0.9} opacity={1 - handoff} brightness={0.82} />
      <Plate
        src="assets/refined/earth-system.png"
        progress={p}
        fromScale={1.18}
        toScale={0.98}
        fromX={60}
        toX={-18}
        opacity={handoff}
        brightness={0.87}
        saturate={0.82}
      />
      <Grade dark={0.25} blue={0.1} />
      <ScaleMark top={86} opacity={fadeWindow(frame, 1.4 * fps, 0.45 * fps, 4.4 * fps, 0.45 * fps)}>地球尺度 · 10⁷ m</ScaleMark>
      <ScaleMark top={128} opacity={fadeWindow(frame, 4.1 * fps, 0.45 * fps, 8.3 * fps, 0.55 * fps)}>太阳系尺度 · 10¹¹ m</ScaleMark>
      <Subtitle opacity={fadeWindow(frame, 0.75 * fps, 0.6 * fps, 8.6 * fps, 0.7 * fps)}>
        一个个体，也处在更大的系统里。
      </Subtitle>
    </AbsoluteFill>
  );
};

const GalaxyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = interpolate(frame, [0, 7 * fps], [0, 1], clamp);
  const handoff = interpolate(frame, [0.35 * fps, 1.8 * fps], [0, 1], clamp);
  return (
    <AbsoluteFill style={{backgroundColor: '#010306'}}>
      <Plate src="assets/refined/earth-system.png" progress={p} fromScale={0.98} toScale={0.72} opacity={1 - handoff} brightness={0.76} saturate={0.74} />
      <Plate
        src="assets/refined/galaxy.png"
        progress={p}
        fromScale={1.2}
        toScale={0.98}
        fromX={-28}
        toX={16}
        opacity={handoff}
        brightness={0.88}
        saturate={0.78}
      />
      <Grade dark={0.24} blue={0.07} />
      <Subtitle opacity={fadeWindow(frame, 0.7 * fps, 0.65 * fps, 6.75 * fps, 0.65 * fps)}>
        更大的整体，也由无数个体组成。
      </Subtitle>
    </AbsoluteFill>
  );
};

const ReturnScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = interpolate(frame, [0, 3.45 * fps], [0, 1], clamp);
  const handoff = interpolate(frame, [0.65 * fps, 2.15 * fps], [0, 1], clamp);
  const fadeBlack = interpolate(frame, [3.45 * fps, 3.5 * fps], [0, 1], clamp);
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Plate src="assets/refined/galaxy.png" progress={p} fromScale={0.98} toScale={2.3} opacity={1 - handoff} brightness={0.78} saturate={0.72} />
      <Plate
        src="assets/refined/drop-final.png"
        progress={p}
        fromScale={1.7}
        toScale={1.02}
        fromX={-110}
        toX={0}
        opacity={handoff * (1 - fadeBlack)}
        blur={interpolate(handoff, [0, 1], [9, 0])}
        brightness={0.76}
        saturate={0.72}
      />
      <Grade dark={0.32} blue={0.16} />
      <Subtitle opacity={fadeWindow(frame, 1.25 * fps, 0.55 * fps, 3.35 * fps, 0.45 * fps) * (1 - fadeBlack)}>
        一滴水很小，却藏着一个世界。
      </Subtitle>
      <AbsoluteFill style={{backgroundColor: '#000', opacity: fadeBlack}} />
    </AbsoluteFill>
  );
};

export const FinalFilm: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Sequence from={0} durationInFrames={7 * fps} premountFor={fps}><IntroVideo /></Sequence>
      <Sequence from={7 * fps} durationInFrames={7 * fps} premountFor={fps}><MicroScene /></Sequence>
      <Sequence from={14 * fps} durationInFrames={10 * fps} premountFor={fps}><MoleculeWaveScene /></Sequence>
      <Sequence from={24 * fps} durationInFrames={11 * fps} premountFor={fps}><StarMorphScene /></Sequence>
      <Sequence from={35 * fps} durationInFrames={9 * fps} premountFor={fps}><SolarSystemScene /></Sequence>
      <Sequence from={44 * fps} durationInFrames={7 * fps} premountFor={fps}><GalaxyScene /></Sequence>
      <Sequence from={51 * fps} durationInFrames={4 * fps} premountFor={fps}><ReturnScene /></Sequence>
      <Audio
        src={staticFile('assets/cosmic-score-v2.m4a')}
        volume={(frame) =>
          interpolate(
            frame,
            [0, 6 * fps, 8 * fps, 50 * fps, 54 * fps, 55 * fps],
            [0.22, 0.18, 0.52, 0.52, 0.38, 0],
            clamp,
          )
        }
      />
    </AbsoluteFill>
  );
};
