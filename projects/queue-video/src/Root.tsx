import React from 'react';
import {Composition,Series,staticFile,useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {Shot} from './Shot';
export const Film=()=>{const {fps}=useVideoConfig();return <>
 <Audio src={staticFile('audio/soundtrack-v02.m4a')} premountFor={fps}/>
 <Series>
 <Series.Sequence name="A01 换队的念头" durationInFrames={120} premountFor={fps}><Shot n={0}/></Series.Sequence>
 <Series.Sequence name="A02 换队" durationInFrames={120} premountFor={fps}><Shot n={1}/></Series.Sequence>
 <Series.Sequence name="A03 别人先走" durationInFrames={150} premountFor={fps}><Shot n={2}/></Series.Sequence>
 <Series.Sequence name="A04 人数" durationInFrames={150} premountFor={fps}><Shot n={3}/></Series.Sequence>
 <Series.Sequence name="A05 隐藏的任务" durationInFrames={180} premountFor={fps}><Shot n={4}/></Series.Sequence>
 <Series.Sequence name="A06 同时开始" durationInFrames={180} premountFor={fps}><Shot n={5}/></Series.Sequence>
 <Series.Sequence name="A07 六秒结束" durationInFrames={150} premountFor={fps}><Shot n={6}/></Series.Sequence>
 <Series.Sequence name="A08 工作量" durationInFrames={150} premountFor={fps}><Shot n={7}/></Series.Sequence>
 <Series.Sequence name="A09 揭示任务总量" durationInFrames={150} premountFor={fps}><Shot n={8}/></Series.Sequence>
 <Series.Sequence name="A10 算例边界" durationInFrames={150} premountFor={fps}><Shot n={9}/></Series.Sequence>
 <Series.Sequence name="A11 走出超市" durationInFrames={180} premountFor={fps}><Shot n={10}/></Series.Sequence>
 <Series.Sequence name="A12 任务条变申请" durationInFrames={120} premountFor={fps}><Shot n={11}/></Series.Sequence>
 <Series.Sequence name="A13 等待回音" durationInFrames={150} premountFor={fps}><Shot n={12}/></Series.Sequence>
 <Series.Sequence name="A14 创作草稿" durationInFrames={150} premountFor={fps}><Shot n={13}/></Series.Sequence>
 <Series.Sequence name="A15 别人的结果" durationInFrames={150} premountFor={fps}><Shot n={14}/></Series.Sequence>
 <Series.Sequence name="A16 想象的进度尺" durationInFrames={180} premountFor={fps}><Shot n={15}/></Series.Sequence>
 <Series.Sequence name="A17 离开队伍仍排队" durationInFrames={120} premountFor={fps}><Shot n={16}/></Series.Sequence>
 <Series.Sequence name="A18 误用刻度" durationInFrames={150} premountFor={fps}><Shot n={17}/></Series.Sequence>
 <Series.Sequence name="A19 折返" durationInFrames={150} premountFor={fps}><Shot n={18}/></Series.Sequence>
 <Series.Sequence name="A20 期限存在" durationInFrames={150} premountFor={fps}><Shot n={19}/></Series.Sequence>
 <Series.Sequence name="A21 面对决定" durationInFrames={180} premountFor={fps}><Shot n={20}/></Series.Sequence>
 <Series.Sequence name="A22 区分能做与等待" durationInFrames={120} premountFor={fps}><Shot n={21}/></Series.Sequence>
 <Series.Sequence name="A23 有些要等" durationInFrames={150} premountFor={fps}><Shot n={22}/></Series.Sequence>
 <Series.Sequence name="A24 补一条线" durationInFrames={150} premountFor={fps}><Shot n={23}/></Series.Sequence>
 <Series.Sequence name="A25 比较的条件" durationInFrames={150} premountFor={fps}><Shot n={24}/></Series.Sequence>
 <Series.Sequence name="A26 显露路径纵深" durationInFrames={180} premountFor={fps}><Shot n={25}/></Series.Sequence>
 <Series.Sequence name="A27 收起统一刻度" durationInFrames={120} premountFor={fps}><Shot n={26}/></Series.Sequence>
 <Series.Sequence name="A28 自己的一步" durationInFrames={150} premountFor={fps}><Shot n={27}/></Series.Sequence>
 <Series.Sequence name="A29 回到队伍" durationInFrames={150} premountFor={fps}><Shot n={28}/></Series.Sequence>
 <Series.Sequence name="A30 先看清再往前" durationInFrames={150} premountFor={fps}><Shot n={29}/></Series.Sequence>
 </Series></>};
export const Root=()=> <Composition id="QueueFilm" component={Film} width={1920} height={1080} fps={30} durationInFrames={4500}/>;
