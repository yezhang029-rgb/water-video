"""Extend the scored cumulative review through the 47s philosophical turn."""
import argparse
import json
import subprocess
from pathlib import Path

parser=argparse.ArgumentParser()
parser.add_argument('--music',required=True)
parser.add_argument('--video',default='out/opening-to-perspective-47s-v1-clean.mp4')
parser.add_argument('--output',default='out/release-assets/step-05-47s-v1-perspective.mp4')
args=parser.parse_args()
music_in=5.4113
reveal=18.4374-music_in
galaxy_reveal=36.5018-music_in
points=[(0,.40),(3.4,.40),(4.1,.46),(7.2,.40),(8.3,.32),
        (10.6,.34),(11.05,.38),(12.45,.46),(12.85,.20),
        (reveal-.025,.20),(reveal+.015,.62),(15.9,.56),
        (16.5,.48),(17.1,.34),(19.6,.31),(21.2,.34),
        (21.5,.38),(22.7,.43),(23.75,.52),(24.8,.50),
        (25.5,.44),(26.3,.34),(28.2,.38),(29.2,.40),(30.1,.48),
        (30.82,.22),(galaxy_reveal-.025,.22),(galaxy_reveal+.015,.66),
        (33.7,.58),(35,.44),(36.7,.30),(39.7,.28),(41.5,.24),
        (42.8,.30),(44.6,.32),(46.3,.30),(47,0)]
volume='0'
for (a,va),(b,vb) in reversed(list(zip(points,points[1:]))):
    volume=f'if(lt(t,{b}),({va}+({vb-va})*(t-{a})/({b-a})),{volume})'
sources=[(1.25,.07,77),(1.95,.12,79),(1.8,.06,83),(1.3,.07,89),
         (2.3,.13,97),(1.6,.05,101),(1.2,.035,103)]
filters=(f"[1:a]atrim=start={music_in}:duration=47,asetpts=PTS-STARTPTS,volume='{volume}':eval=frame,afade=t=in:d=0.003[m];"
    '[2:a]highpass=f=450,lowpass=f=3300,afade=t=in:d=0.45,afade=t=out:st=0.55:d=0.7,adelay=3850:all=1,volume=0.7[w];'
    '[3:a]highpass=f=450,lowpass=f=4800,afade=t=in:d=1.65,afade=t=out:st=1.65:d=0.3,adelay=11050:all=1,volume=0.85[r];'
    '[4:a]highpass=f=550,lowpass=f=2600,afade=t=in:d=0.6,afade=t=out:st=0.8:d=1,adelay=17300:all=1,volume=0.35[l];'
    '[5:a]highpass=f=400,lowpass=f=3500,afade=t=in:d=0.45,afade=t=out:st=0.6:d=0.7,adelay=21500:all=1,volume=0.45[s];'
    '[6:a]highpass=f=380,lowpass=f=4600,afade=t=in:d=1.9,afade=t=out:st=1.9:d=0.4,adelay=28700:all=1,volume=0.8[g];'
    '[7:a]highpass=f=600,lowpass=f=2600,afade=t=in:d=0.6,afade=t=out:st=0.7:d=0.9,adelay=35700:all=1,volume=0.4[p];'
    '[8:a]highpass=f=600,lowpass=f=2200,afade=t=in:d=0.45,afade=t=out:st=0.5:d=0.7,adelay=40000:all=1,volume=0.35[h];'
    '[m][w][r][l][s][g][p][h]amix=inputs=8:duration=first:normalize=0,alimiter=limit=0.95:level=0:latency=1[a]')
cmd=['ffmpeg','-y','-i',args.video,'-i',args.music]
for duration,amp,seed in sources:
    cmd+=['-f','lavfi','-i',f'anoisesrc=color=pink:amplitude={amp}:duration={duration}:sample_rate=48000:seed={seed}']
out=Path(args.output);out.parent.mkdir(parents=True,exist_ok=True)
cmd+=['-filter_complex',filters,'-map','0:v:0','-map','[a]',
      '-c:v','copy','-c:a','aac','-b:a','192k','-t','47','-movflags','+faststart',str(out),'-loglevel','error']
subprocess.run(cmd,check=True)
out.with_suffix('.music.json').write_text(json.dumps({
    'duration':47,'music_in':music_in,'first_reveal':reveal,'galaxy_reveal':galaxy_reveal,
    'gain_points':points,'new_scene_starts':35,'video_processing':'stream copy',
    'scope':'perspective limits and thinking observer; final human interaction/loop not yet included'
},indent=2)+'\n')
print(f'Created {out}; reflective passage begins 35s, without the previous preview-tail fade.')
