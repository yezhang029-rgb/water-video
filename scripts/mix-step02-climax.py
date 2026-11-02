"""Mix the 15.4s review clip with an intentional musical reveal; copy video bytes."""
import argparse
import json
import subprocess
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('--music', required=True)
parser.add_argument('--video', default='out/opening-scale-analogy-15p4s-v3-with-temp-music.mp4')
parser.add_argument('--output', default='out/release-assets/step-02-15p4s-v3-music-reveal.mp4')
args = parser.parse_args()

music_in = 6.2113
native_reveal = 18.4374
reveal = native_reveal - music_in
# Reading, accelerating pullback, brief space, native rhythmic entrance, preview tail.
gain_points = [(0,.40),(3.4,.40),(4.1,.46),(7.2,.40),(7.5,.32),
               (9.8,.34),(10.25,.38),(11.65,.46),(12.05,.20),
               (reveal-.025,.20),(reveal+.015,.62),(14.8,.56),(15.4,0)]
volume = '0'
for (a,va),(b,vb) in reversed(list(zip(gain_points,gain_points[1:]))):
    ramp = f'({va}+({vb-va})*(t-{a})/({b-a}))'
    volume = f'if(lt(t,{b}),{ramp},{volume})'

filters = (
    f"[1:a]atrim=start={music_in}:duration=15.4,asetpts=PTS-STARTPTS,"
    f"volume='{volume}':eval=frame,afade=t=in:d=0.003[m];"
    '[2:a]highpass=f=450,lowpass=f=3300,afade=t=in:d=0.45,'
    'afade=t=out:st=0.55:d=0.7,adelay=3850:all=1,volume=0.7[w];'
    '[3:a]highpass=f=450,lowpass=f=4800,afade=t=in:d=1.65,'
    'afade=t=out:st=1.65:d=0.3,adelay=10250:all=1,volume=0.85[r];'
    '[m][w][r]amix=inputs=3:duration=first:normalize=0,'
    'alimiter=limit=0.95:level=0:latency=1[a]'
)
out = Path(args.output)
out.parent.mkdir(parents=True,exist_ok=True)
subprocess.run([
    'ffmpeg','-y','-i',args.video,'-i',args.music,
    '-f','lavfi','-i','anoisesrc=color=pink:amplitude=0.07:duration=1.25:sample_rate=48000:seed=77',
    '-f','lavfi','-i','anoisesrc=color=pink:amplitude=0.12:duration=1.95:sample_rate=48000:seed=79',
    '-filter_complex',filters,'-map','0:v:0','-map','[a]',
    '-c:v','copy','-c:a','aac','-b:a','192k','-t','15.4','-movflags','+faststart',
    str(out),'-loglevel','error'
],check=True)
out.with_suffix('.music.json').write_text(json.dumps({
    'duration':15.4,'music_in':music_in,'native_rhythmic_entrance':native_reveal,
    'video_reveal':reveal,'gain_points':gain_points,
    'video_processing':'stream copy; no re-render or video encoding',
    'scope':'first musical reveal in this preview; galaxy work paused'
},indent=2)+'\n')
print(f'Created {out}; musical reveal at {reveal:.3f}s')
