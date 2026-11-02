"""Score the cumulative 25.5s review, preserving the existing video stream."""
import argparse
import json
import subprocess
from pathlib import Path

parser=argparse.ArgumentParser()
parser.add_argument('--music',required=True)
parser.add_argument('--video',default='out/opening-to-solar-25p5s-preview.mp4')
parser.add_argument('--output',default='out/release-assets/step-03-25p5s-v2-scored.mp4')
args=parser.parse_args()
# The gradient-caption layout adds 0.8s before the reveal and 0.3s to its tail.
music_in=5.4113
reveal=18.4374-music_in
points=[(0,.40),(3.4,.40),(4.1,.46),(7.2,.40),(8.3,.32),
        (10.6,.34),(11.05,.38),(12.45,.46),(12.85,.20),
        (reveal-.025,.20),(reveal+.015,.62),(15.9,.56),
        (16.5,.48),(17.1,.34),(19.6,.31),(21.2,.34),
        (21.5,.38),(22.7,.43),(23.75,.52),(24.8,.50),(25.5,0)]
volume='0'
for (a,va),(b,vb) in reversed(list(zip(points,points[1:]))):
    volume=f'if(lt(t,{b}),({va}+({vb-va})*(t-{a})/({b-a})),{volume})'

sources=[(1.25,.07,77),(1.95,.12,79),(1.8,.06,83),(1.3,.07,89)]
filters=(f"[1:a]atrim=start={music_in}:duration=25.5,asetpts=PTS-STARTPTS,volume='{volume}':eval=frame,afade=t=in:d=0.003[m];"
    '[2:a]highpass=f=450,lowpass=f=3300,afade=t=in:d=0.45,afade=t=out:st=0.55:d=0.7,adelay=3850:all=1,volume=0.7[w];'
    '[3:a]highpass=f=450,lowpass=f=4800,afade=t=in:d=1.65,afade=t=out:st=1.65:d=0.3,adelay=11050:all=1,volume=0.85[r];'
    '[4:a]highpass=f=550,lowpass=f=2600,afade=t=in:d=0.6,afade=t=out:st=0.8:d=1,adelay=17300:all=1,volume=0.35[l];'
    '[5:a]highpass=f=400,lowpass=f=3500,afade=t=in:d=0.45,afade=t=out:st=0.6:d=0.7,adelay=21500:all=1,volume=0.45[s];'
    '[m][w][r][l][s]amix=inputs=5:duration=first:normalize=0,alimiter=limit=0.95:level=0:latency=1[a]')
cmd=['ffmpeg','-y','-i',args.video,'-i',args.music]
for duration,amp,seed in sources:
    cmd+=['-f','lavfi','-i',f'anoisesrc=color=pink:amplitude={amp}:duration={duration}:sample_rate=48000:seed={seed}']
out=Path(args.output);out.parent.mkdir(parents=True,exist_ok=True)
cmd+=['-filter_complex',filters,'-map','0:v:0','-map','[a]',
      '-c:v','copy','-c:a','aac','-b:a','192k','-t','25.5','-movflags','+faststart',str(out),'-loglevel','error']
subprocess.run(cmd,check=True)
out.with_suffix('.music.json').write_text(json.dumps({
    'duration':25.5,'music_in':music_in,'reveal':reveal,'gain_points':points,
    'layout':'right-top analogy caption, gradient text; outward scene begins 16.5s',
    'processing':'existing video stream copied without re-rendering or re-encoding',
    'scope':'through inner solar-system diagram; no galaxy scene'
},indent=2)+'\n')
print(f'Created {out}; first reveal at {reveal:.3f}s; outward scene begins 16.5s')
