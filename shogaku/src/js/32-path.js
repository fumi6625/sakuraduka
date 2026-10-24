/* ===== 6年生のまとめへの近づき具合（推定）：いまの身につき具合・予定との差・まとめの日の見こみ =====
   K（実力の見こみ）＝おぼえ具合の部分点。見ていない問題は0点、見た問題は箱が高いほど高い点（箱0＝.08 … 箱6＝1）。
   期限をすぎた復習は、少しだけ（最大3割）ひく。算数は、計算のテーマごとのレベルも点にする。
   予定＝「週5日・正答率85%で続けた子」のKの進み（15-plan-path.js。scripts/plan-curve.mjs が作る）。
   ここで出すのは「予定に対して、いまどこにいるか」と「このペースだと、どこまで行けるか」のめやす。比べたり、あおったりするものではない。 */
const KW=[.08,.2,.38,.58,.8,.92,1];
const PSUBJ=['英','国','数','理','社'];
const PBANKS={英:['EW','EV','EG','EO','EL','EC'],国:['JK','JW','JI','JS','JG','JC'],数:['MQ','MS'],理:['SQ'],社:['OQ','OT']};
const BANK_PS={};PSUBJ.forEach(s=>PBANKS[s].forEach(b=>{BANK_PS[b]=s}));
function knowNow(date=today()){
 const t=dn(date),k={英:0,国:0,数:0,理:0,社:0};
 for(const id in S.srs){
  const it=ITEMS[id],sj=it&&BANK_PS[it.bank];if(!sj)continue;
  const s=S.srs[id],over=Math.max(0,t-s.d);
  k[sj]+=KW[s.b]*(1-Math.min(.3,over/(8*BOXD[s.b])));
 }
 let mp=0;for(const id in GEN)if(GEN[id].subj==='数')mp+=((S.gs[id]&&S.gs[id].lv)||1)-1;
 k.数+=4*mp;   // 計算の力：テーマのレベル（1〜3）が上がるほど
 return k;
}
/* ----- 予定のカーブ（月末ごとの点を、日ごとにつなぐ） ----- */
const PLAN_X=PLAN_PATH.d.map(dn),planEnd=s=>PLAN_PATH.K[s][PLAN_X.length-1];
function planAtN(s,x){
 const v=PLAN_PATH.K[s];
 if(x<=PLAN_X[0])return v[0];
 for(let i=1;i<PLAN_X.length;i++)if(x<=PLAN_X[i])return v[i-1]+(v[i]-v[i-1])*(x-PLAN_X[i-1])/(PLAN_X[i]-PLAN_X[i-1]);
 return v[v.length-1];
}
const planFracN=x=>sum(PSUBJ.map(s=>planAtN(s,x)/planEnd(s)))/5;
/* 直近4週間のペース：クリアラインの日の数（週あたり）と、正答率 */
function paceNow(date=today()){
 const span=Math.min(28,Math.max(1,diff(S.start||date,date)+1));
 let ok=0,n=0,c=0;
 for(let i=0;i<span;i++){const d=S.days[addDays(date,-i)];if(d){if(d.ok)ok++;n+=d.n||0;c+=d.c||0}}
 return{perWeek:ok/span*7,acc:n>=40?c/n:null,span};
}
/* いまの位置。f＝5教科の道のり（6年生のまとめの日の予定を1とした平均）、fp＝きょうの予定、off＝予定より何日分 先（＋）／おくれ（−）か、
   proj＝いまの4週間のペースを6年生のまとめの日まで続けたときの見こみ、proj5＝週5日にしたときの見こみ */
function pathNow(date=today()){
 const k=knowNow(date),per={},tNow=dn(date),lo=PLAN_X[0],hi=PLAN_X[PLAN_X.length-1];
 PSUBJ.forEach(s=>{per[s]={k:k[s],pct:k[s]/planEnd(s),plan:planAtN(s,tNow)/planEnd(s)}});
 const f=sum(PSUBJ.map(s=>per[s].pct))/5,fp=planFracN(tNow);
 let off;
 if(f>=planFracN(hi))off=Math.max(0,hi-tNow);
 else if(f<=planFracN(lo))off=lo-tNow;
 else{let a=lo,b=hi;for(let i=0;i<24;i++){const m=(a+b)/2;if(planFracN(m)<f)a=m;else b=m}off=Math.round(b-tNow)}
 off=clamp(off,-999,999);
 const pc=paceNow(date),pf=clamp(pc.perWeek/5,.2,1.4),af=pc.acc==null?1:clamp((pc.acc-.3)/.55,.3,1.15),left=Math.max(0,1-fp);
 const dd=doneDays(date),state=dd<10?'early':off>=14?'ahead':off>-14?'on':off>-60?'behind':'far';   // 同じペースの子でも ±20日ほどはゆれるので、「予定どおり」は ±14日
 return{per,f,fp,off,state,pace:pc,pf,af,proj:date>=S.exam?f:Math.min(1.6,f+left*pf*af),proj5:Math.min(1.6,f+left*Math.max(1,pf)*af)};
}
/* 週ごとの記録（折れ線用）：その週の最後にたまったKの道のり */
function snapPath(date=today()){const P=pathNow(date);S.kh[monday(date)]=Math.round(P.f*10000)/10000;return P}
/* 正答率の伸び：直近4週間と、その前の4週間（教科ごと。sj を省くと5教科まとめて） */
function accTrend(sj){
 const w0=monday(today());let n1=0,c1=0,n0=0,c0=0;
 for(let i=0;i<8;i++){const o=S.sw[addDays(w0,-7*i)];if(!o)continue;for(const s of sj?[sj]:PSUBJ){const x=o[s];if(!x)continue;if(i<4){n1+=x[0];c1+=x[1]}else{n0+=x[0];c0+=x[1]}}}
 return{now:n1>=15?c1/n1:null,prev:n0>=15?c0/n0:null,n:n1};
}
function logSw(sj,ok,date=today()){
 if(!PSUBJ.includes(sj))return;
 const w=monday(date),o=S.sw[w]||(S.sw[w]={}),x=o[sj]||(o[sj]=[0,0]);x[0]++;if(ok)x[1]++;
}
/* ----- 言い方（画面と週報で共通） ----- */
const pctN=x=>Math.round(clamp(x,0,1.6)*100);
const pctTxt=x=>{const p=pctN(x);return p>=150?'150%以上':p+'%'};
const ringTxt=x=>{const p=pctN(x);return p>=150?'150+':p+'%'};   // 輪の中の字（せまいので短く）
/* 一言：責めない。「予定より先」か「あと◯日分」で、次の一歩が見える言い方 */
function pathMsg(P){
 const a=Math.abs(P.off),dayTxt=a>=60?'約'+Math.round(a/30)+'か月分':a+'日分';
 if(P.state==='early')return{head:'はじめの一歩',sub:'まずは3分から。やった分だけ、力がたまっていく。'};
 if(P.state==='ahead')return{head:'予定より '+dayTxt+' 先！',sub:'この調子。きょうも1つ、ぬろう。'};
 if(P.state==='on')return{head:'予定どおり',sub:'いいペース。このまま つづけよう。'};
 if(P.state==='behind')return{head:'予定まで あと '+dayTxt,sub:'きょうの1つ目をクリアすると、一歩 近づくよ。'};
 return{head:'ここからが のびしろ',sub:'1日やるごとに、ちゃんと たまる。きょうの3分から。'};
}
const trendTxt=()=>{
 let best=null;
 for(const s of PSUBJ){const t=accTrend(s);if(t.now!=null&&t.prev!=null){const g=t.now-t.prev;if(g>=.03&&(!best||g>best.g))best={s,g}}}
 const all=accTrend(),line=all.now!=null?`正答率（直近4週間）${Math.round(all.now*100)}%`+(all.prev!=null?`（その前の4週間 ${Math.round(all.prev*100)}%）`:''):'';
 return[line,best?`のびたところ：${SJN[best.s]} 正答率 +${Math.round(best.g*100)}%`:''].filter(Boolean).join('　');
};
/* 週報に入れる文（保護者向け）。推定であることを必ず添える */
function pathReportLine(date=today()){
 const P=pathNow(date),m=pathMsg(P),pw=Math.round(P.pace.perWeek*10)/10,tl=S.tl.length?S.tl[S.tl.length-1]:null;
 const a=[`6年生のまとめへの道のり（めやす）：予定の${pctTxt(P.f)}・${m.head}`];
 if(P.state!=='early')a.push(`　いまの週${pw}日のペースで6年生のまとめの日まで続けると、予定の約${pctTxt(P.proj)}（週5日なら約${pctTxt(P.proj5)}）`);
 if(tl)a.push(`　最近のテスト：${tl.tot}点（${tl.label}）`);
 a.push('　※推定のめやすです。くらべる材料ではなく、次の一歩を決めるために使ってください');
 return a.join('\n');
}
