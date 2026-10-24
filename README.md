# Water Video

An 8-second, 1920×1080, 30fps Remotion sample built from the supplied cafe image.

```bash
npm install
npm run typecheck
npm run build
npm run render
npm run render:pour
npm run render:preview
npm run render:final
```

Outputs:

- `out/water-sample.mp4` — original eight-second sample
- `out/cafe-pour-shot.mp4` — seven-second café pour shot
- `out/water-final-55s-preview.mp4` — half-resolution review render
- `out/water-final-55s.mp4` — 1920×1080 final film

The 55-second film uses `public/assets/shot01.mp4` for its complete opening seven seconds.
