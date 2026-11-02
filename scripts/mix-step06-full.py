"""Score the 55s full review and crossfade the music tail to its opening source position."""
import argparse
import json
import subprocess
from pathlib import Path

parser=argparse.ArgumentParser()
parser.add_argument('--music',required=True)
parser.add_argument('--video',default='out/water-film-2d-55s-v1-clean.mp4')
parser.add_argument('--output',default='out/release-assets/step-06-55s-v1-full-review.mp4')
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
        (42.8,.30),(44.6,.32),(46.3,.30),(47,.30),(48.6,.28),
        (49.5,.26),(51.2,.34),(53.4,.30),(54.1,.26),(55,.26)]
volume='0'
for (a,va),(b,vb) in reversed(list(zip(points,points[1:]))):
    volume=f'if(lt(t,{b}),({va}+({vb-va})*(t-{a})/({b-a})),{volume})'
sources=[(1.25,.07,77),(1.95,.12,79),(1.8,.06,83),(1.3,.07,89),
         (2.3,.13,97),(1.6,.05,101),(1.2,.035,103)]
filters=(f"[1:a]atrim=start={music_in}:duration=54.9,asetpts=PTS-STARTPTS,volume='{volume}':eval=frame,afade=t=in:d=0.003[main];"
    f'[11:a]atrim=start={music_in-1}:duration=1,asetpts=PTS-STARTPTS,volume=0.4,afade=t=out:st=0.997:d=0.003[loop];'
    '[main][loop]acrossfade=d=0.9:c1=tri:c2=tri[m];'
    '[2:a]highpass=f=450,lowpass=f=3300,afade=t=in:d=0.45,afade=t=out:st=0.55:d=0.7,adelay=3850:all=1,volume=0.7[w];'
    '[3:a]highpass=f=450,lowpass=f=4800,afade=t=in:d=1.65,afade=t=out:st=1.65:d=0.3,adelay=11050:all=1,volume=0.85[r];'
    '[4:a]highpass=f=550,lowpass=f=2600,afade=t=in:d=0.6,afade=t=out:st=0.8:d=1,adelay=17300:all=1,volume=0.35[l];'
    '[5:a]highpass=f=400,lowpass=f=3500,afade=t=in:d=0.45,afade=t=out:st=0.6:d=0.7,adelay=21500:all=1,volume=0.45[s];'
    '[6:a]highpass=f=380,lowpass=f=4600,afade=t=in:d=1.9,afade=t=out:st=1.9:d=0.4,adelay=28700:all=1,volume=0.8[g];'
    '[7:a]highpass=f=600,lowpass=f=2600,afade=t=in:d=0.6,afade=t=out:st=0.7:d=0.9,adelay=35700:all=1,volume=0.4[p];'
    '[8:a]highpass=f=600,lowpass=f=2200,afade=t=in:d=0.45,afade=t=out:st=0.5:d=0.7,adelay=40000:all=1,volume=0.35[h];'
    '[9:a]highpass=f=800,lowpass=f=6000,adelay=49500:all=1,volume=0.75[k];'
    '[10:a]highpass=f=300,lowpass=f=1800,afade=t=in:d=0.02,afade=t=out:st=0.15:d=0.55,adelay=49500:all=1,volume=0.18[q];'
    '[m][w][r][l][s][g][p][h][k][q]amix=inputs=10:duration=first:normalize=0,alimiter=limit=0.95:level=0:latency=1[a]')
cmd=['ffmpeg','-y','-i',args.video,'-i',args.music]
for duration,amp,seed in sources:
    cmd+=['-f','lavfi','-i',f'anoisesrc=color=pink:amplitude={amp}:duration={duration}:sample_rate=48000:seed={seed}']
cmd+=['-f','lavfi','-i','aevalsrc=0.07*sin(2*PI*1800*t)*exp(-23*t)+0.025*sin(2*PI*2950*t)*exp(-32*t):s=48000:d=0.35',
      '-f','lavfi','-i','anoisesrc=color=pink:amplitude=0.035:duration=0.7:sample_rate=48000:seed=107',
      '-i',args.music]
# Keep the tail on an independent decoder: this FFmpeg build produces empty
# acrossfade output when long/short trims originate from the same asplit input.
out=Path(args.output);out.parent.mkdir(parents=True,exist_ok=True)
cmd+=['-filter_complex',filters,'-map','0:v:0','-map','[a]',
      '-c:v','copy','-c:a','aac','-b:a','192k','-t','55','-movflags','+faststart',str(out),'-loglevel','error']
subprocess.run(cmd,check=True)
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(out)]))
video=[s for s in probe['streams'] if s['codec_type']=='video']
audio=[s for s in probe['streams'] if s['codec_type']=='audio']
assert len(video)==len(audio)==1,'Output must contain both video and audio'
assert int(video[0]['nb_frames'])==1650 and abs(float(audio[0]['duration'])-55)<.025,'Incomplete review output'
out.with_suffix('.music.json').write_text(json.dumps({
    'duration':55,'music_in':music_in,'first_reveal':reveal,'galaxy_reveal':galaxy_reveal,
    'gain_points':points,'ending_starts':47,'cup_contact':49.5,
    'music_loop_crossfade':{'start':54,'duration':.9,'native_pre_roll':[music_in-1,music_in]},
    'video_processing':'stream copy','scope':'full review; not yet a published final release'
},indent=2)+'\n')
print(f'Created {out}; complete 55s review with opening-position music return.')
