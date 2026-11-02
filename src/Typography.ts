import type {CSSProperties} from 'react';

const clippedGradient = (backgroundImage: string): CSSProperties => ({
  backgroundImage,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  WebkitTextFillColor: 'transparent',
});

export const gradientText = clippedGradient('linear-gradient(98deg, #e6b878 0%, #fff0d1 48%, #afe6ef 100%)');
export const numberGradientText = clippedGradient('linear-gradient(98deg, #f0d397 0%, #ddf7ef 45%, #8fdfed 100%)');
export const mutedGradientText = clippedGradient('linear-gradient(98deg, #b69a72 0%, #c8c2ad 48%, #9cbfc3 100%)');
