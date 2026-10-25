#!/usr/bin/env bash
set -euo pipefail

output="${1:-public/assets/cosmic-score-v2.m4a}"

ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "sine=frequency=55:sample_rate=48000:duration=55" \
  -f lavfi -i "sine=frequency=82.41:sample_rate=48000:duration=55" \
  -f lavfi -i "sine=frequency=110:sample_rate=48000:duration=55" \
  -f lavfi -i "anoisesrc=color=pink:amplitude=0.08:sample_rate=48000:duration=55" \
  -f lavfi -i "sine=frequency=880:sample_rate=48000:duration=0.9" \
  -f lavfi -i "anoisesrc=color=white:amplitude=0.16:sample_rate=48000:duration=1.4" \
  -f lavfi -i "sine=frequency=46:sample_rate=48000:duration=1.5" \
  -filter_complex '
    [0:a]lowpass=f=260,volume=0.052[d0];
    [1:a]lowpass=f=420,volume=0.032[d1];
    [2:a]lowpass=f=620,volume=0.016[d2];
    [3:a]highpass=f=35,lowpass=f=1250,volume=0.12[n0];
    [4:a]highpass=f=500,afade=t=out:st=0.04:d=0.84,volume=0.20,adelay=6100:all=1[drop];
    [5:a]highpass=f=260,lowpass=f=4700,afade=t=in:st=0:d=0.48,afade=t=out:st=0.55:d=0.82,volume=0.13,asplit=6[w1][w2][w3][w4][w5][w6];
    [w1]adelay=6400:all=1[wd1];
    [w2]adelay=13400:all=1[wd2];
    [w3]adelay=23400:all=1[wd3];
    [w4]adelay=34400:all=1[wd4];
    [w5]adelay=43400:all=1[wd5];
    [w6]adelay=50400:all=1[wd6];
    [6:a]lowpass=f=95,afade=t=out:st=0:d=1.45,volume=0.16,asplit=6[i1][i2][i3][i4][i5][i6];
    [i1]adelay=6800:all=1[id1];
    [i2]adelay=13800:all=1[id2];
    [i3]adelay=23800:all=1[id3];
    [i4]adelay=34800:all=1[id4];
    [i5]adelay=43800:all=1[id5];
    [i6]adelay=50800:all=1[id6];
    [d0][d1][d2][n0][drop][wd1][wd2][wd3][wd4][wd5][wd6][id1][id2][id3][id4][id5][id6]
    amix=inputs=17:normalize=0:duration=longest,
    afade=t=in:st=0:d=2.5,
    afade=t=out:st=53.4:d=1.6,
    alimiter=limit=0.78,
    loudnorm=I=-24:LRA=7:TP=-2,
    pan=stereo|c0=c0|c1=c0,
    haas=left_delay=2.05:right_delay=2.35[out]
  ' \
  -map '[out]' -t 55 -c:a aac -b:a 256k "$output"
