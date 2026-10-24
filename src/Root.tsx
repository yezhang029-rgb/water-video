import React from 'react';
import {AbsoluteFill, Composition, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const fontFamily = '"Noto Sans CJK SC", "Source Han Sans SC", "Microsoft YaHei", sans-serif';

const FullFrame: React.FC<{
  src: string;
  opacity?: number;
  scale?: number;
  x?: number;
  y?: number;
  blur?: number;
  brightness?: number;
  saturate?: number;
}> = ({src, opacity = 1, scale = 1, x = 0, y = 0, blur = 0, brightness = 1, saturate = 1}) => (
  <Img
    src={staticFile(src)}
    style={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      opacity,
      scale,
      translate: `${x}px ${y}px`,
      filter: `blur(${blur}px) brightness(${brightness}) saturate(${saturate})`,
    }}
  />
);

const Caption: React.FC<{children: React.ReactNode; topRight?: boolean; opacity: number}> = ({children, topRight, opacity}) => (
  <div
    style={{
      position: 'absolute',
      right: topRight ? 86 : undefined,
      left: topRight ? undefined : 0,
      bottom: topRight ? undefined : 64,
      top: topRight ? 70 : undefined,
      width: topRight ? 'auto' : '100%',
      textAlign: topRight ? 'right' : 'center',
      color: 'white',
      fontFamily,
      fontSize: topRight ? 54 : 48,
      fontWeight: 700,
      letterSpacing: 2,
      opacity,
      textShadow: '0 3px 16px rgba(0,0,0,.85), 0 1px 4px rgba(0,0,0,.95)',
    }}
  >
    {children}
  </div>
);

export const WaterSample: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const firstEnd = 0.75 * fps;
  const secondEnd = 2.6 * fps;
  const thirdEnd = 4.6 * fps;
  const lockEnd = 6 * fps;
  const introBreath = Math.sin(frame / 7) * 2.5;
  const firstToSecond = interpolate(frame, [firstEnd, secondEnd], [0, 1], {...clamp, easing: Easing.bezier(0.2, 0.75, 0.2, 1)});
  const secondToThird = interpolate(frame, [secondEnd, thirdEnd], [0, 1], {...clamp, easing: Easing.bezier(0.2, 0.8, 0.3, 1)});
  const transitionPulse = interpolate(frame, [secondEnd, secondEnd + 7, secondEnd + 16], [0, 1, 0], clamp);
  const finalPush = interpolate(frame, [lockEnd, 8 * fps], [0, 1], {...clamp, easing: Easing.bezier(0.2, 0.7, 0.15, 1)});

  return (
    <AbsoluteFill style={{backgroundColor: '#031426', overflow: 'hidden'}}>
      {frame < firstEnd && (
        <FullFrame src="keyframe-01.png" scale={1.015 + frame / 5200} x={introBreath} y={Math.cos(frame / 9) * 1.8} />
      )}

      {frame >= firstEnd && frame < secondEnd && (
        <>
          <FullFrame src="keyframe-01.png" opacity={1 - firstToSecond} scale={1.04 + firstToSecond * 0.1} blur={firstToSecond * 3} brightness={1 - firstToSecond * 0.14} />
          <FullFrame src="keyframe-02.png" opacity={firstToSecond} scale={1.01 + firstToSecond * 0.05} x={-firstToSecond * 12} blur={(1 - firstToSecond) * 4} brightness={0.9} />
        </>
      )}

      {frame >= secondEnd && frame < thirdEnd && (
        <>
          <FullFrame src="keyframe-02.png" opacity={1 - secondToThird} scale={1.07 + secondToThird * 0.18} x={-secondToThird * 46} blur={transitionPulse * 18} brightness={0.88} />
          <FullFrame src="keyframe-03.png" opacity={secondToThird} scale={1.02 + secondToThird * 0.1} x={(1 - secondToThird) * 42} blur={transitionPulse * 12} brightness={0.93} />
          {transitionPulse > 0 && <FullFrame src="keyframe-03.png" opacity={transitionPulse * 0.22} scale={1.08} x={-56} blur={22} brightness={1.12} />}
        </>
      )}

      {frame >= thirdEnd && frame < lockEnd && (
        <>
          <FullFrame src="keyframe-03.png" scale={1.13} x={-22} blur={7} brightness={0.74} saturate={0.82} />
          <div style={{position: 'absolute', inset: 0, clipPath: 'circle(112px at 69% 55%)'}}>
            <FullFrame src="keyframe-03.png" scale={1.13} x={-22} brightness={1.08} saturate={1.08} />
          </div>
        </>
      )}

      {frame >= lockEnd && (
        <>
          <FullFrame src="keyframe-03.png" scale={1.25 + finalPush * 4.8} x={-55 - finalPush * 540} y={-20 - finalPush * 170} blur={finalPush * 12} brightness={0.9 - finalPush * 0.55} saturate={1 - finalPush * 0.35} />
          <AbsoluteFill style={{backgroundColor: '#001c3e', opacity: finalPush * 0.88, mixBlendMode: 'color'}} />
          <AbsoluteFill style={{background: 'radial-gradient(circle at 62% 48%, rgba(39,119,166,.15), rgba(0,8,28,.82))', opacity: finalPush}} />
        </>
      )}

      <Sequence from={0} durationInFrames={Math.round(0.75 * fps)} premountFor={fps}>
        <Caption topRight opacity={interpolate(frame, [0, 7, firstEnd - 5, firstEnd], [0, 1, 1, 0], clamp)}>一杯普通的水</Caption>
      </Sequence>
      <Sequence from={Math.round(6 * fps)} durationInFrames={Math.round(2 * fps)} premountFor={fps}>
        <Caption topRight opacity={interpolate(frame, [lockEnd, lockEnd + 12], [0, 1], clamp)}>其中一滴水</Caption>
        <Caption opacity={interpolate(frame, [lockEnd + 10, lockEnd + 25], [0, 1], clamp)}>里面是？</Caption>
      </Sequence>
      <Audio src={staticFile('soundtrack.wav')} volume={1} />
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => (
  <Composition
    id="WaterSample"
    component={WaterSample}
    durationInFrames={240}
    fps={30}
    width={1920}
    height={1080}
  />
);
