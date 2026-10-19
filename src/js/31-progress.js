/* ===== 進み具合：レベル・XP・連続記録・ステージ完了・バッジ・月の目標（画面に触れない部分） ===== */
const LVMAX=40;
const LVX=n=>n<=0?0:Math.round(40000*Math.pow(n/LVMAX,1.5));      // レベル n に必要な累計XP
const lvOf=xp=>{let l=1;while(l<LVMAX&&xp>=LVX(l))l++;return l};
const RANKS=[[1,'ルーキー'],[5,'わかば'],[10,'つぼみ'],[15,'ほころび'],[20,'五分咲き'],[25,'満開'],[30,'花吹雪'],[35,'サクラ名人'],[40,'サクラマスター']];
const rankOf=l=>{let r=RANKS[0][1];RANKS.forEach(x=>{if(l>=x[0])r=x[1]});return r};
const lvInfo=xp=>{const lv=lvOf(xp),lo=LVX(lv-1),hi=lv>=LVMAX?null:LVX(lv);return{lv,name:rankOf(lv),lo,hi,pct:hi?(xp-lo)/(hi-lo):1}};
function addXP(n){
 const b=lvOf(S.xp);S.xp=Math.max(0,S.xp+n);S.coin=Math.max(0,S.coin+n);const a=lvOf(S.xp);
 return a>b?{from:b,to:a}:null;
}
const hours=()=>Object.values(S.days).reduce((t,d)=>t+Object.values(d.min||{}).reduce((a,b)=>a+b,0),0)/60;
const wkWins=()=>Object.values(S.wk).filter(w=>w.sc>=8).length;
/* 「ミニの日」：暗証番号（保護者OK）を決めていないときは、1週間に2回まで。毎日ミニにして、連続記録だけ守るのを防ぐ */
const lightUsed=date=>{const m=monday(date);return Object.keys(S.light).filter(d=>S.light[d]&&monday(d)===m).length};
const canLight=date=>!!(S.pinOn&&S.pin)||lightUsed(date)<2;

/* ----- 連続記録 ----- */
const stageKeys=rec=>Object.keys(rec.stg||{});
/* 合格ラインの日：ならし期は「ドリルを1つ」、ふつう以上は「ドリル1つ＋もう1つ」。
   数えるのは「正答4割以上のドリル」と、保護者OK（暗証番号）をオンにしているときの「宿題」だけ。
   てきとうに押したドリルや、自己採点のふりかえりでは、連続記録をのばせない */
const goodOf=rec=>{
 const pin=!!(S.pinOn&&S.pin),k=stageKeys(rec).filter(x=>x!=='diag');
 return{sess:k.filter(x=>{if(x==='hw'||x==='ref')return false;const g=rec.stg[x];return !g.n||g.ok/g.n>=.4}).length,hw:pin&&k.includes('hw')?1:0};
};
/* 正答4割に届かなかったドリル（goodOf の反対）。やりなおして4割以上とれたら、合格ラインに数える */
const lowRes=g=>!!(g&&g.n&&g.ok/g.n<.4);
const dayOK=(rec,tier)=>{const g=goodOf(rec);return tier===1?g.sess>=1:(g.sess>=1&&g.sess+g.hw>=2)};
/* 合格ラインまで、あと何つか */
const dayNeed=(rec,tier)=>{const g=goodOf(rec);return tier===1?Math.max(0,1-g.sess):Math.max(g.sess>=1?0:1,2-g.sess-g.hw)};
const curStreak=()=>{const t=today();if(S.last===t||S.last===addDays(t,-1))return S.streak;if(S.last===addDays(t,-2)&&S.freeze>0)return S.streak;return 0};
const STREAK_BONUS={3:30,7:70,14:150,30:300,60:500,100:1000};
function streakUp(){
 const t=today(),out={freeze:false,bonus:0,gotFreeze:false};
 if(S.last===t)return out;
 if(S.last===addDays(t,-1))S.streak++;
 else if(S.last===addDays(t,-2)&&S.freeze>0){S.freeze--;S.streak++;out.freeze=true}
 else S.streak=1;
 S.last=t;S.best=Math.max(S.best,S.streak);
 if(S.streak%7===0&&S.freeze<2){S.freeze++;out.gotFreeze=true}
 out.bonus=STREAK_BONUS[S.streak]||0;
 if(out.bonus)addXP(out.bonus);
 return out;
}

/* ----- ステージ完了：XPの計算・保存・全クリ判定 ----- */
function stageXP(id,r){
 const base=XPST[id]||0,n=r.n||0,ok=r.ok||0;
 if(r.boss)return ok>=8?80:ok>=4?30:0;
 if(!n)return base;
 if(n>=5&&ok/n<.4)return 0;   // 正答が4割に届かないときは、XPなし（てきとうに押してXPをかせげないように）
 return Math.round(base*(0.4+0.6*ok/n))+(n>=5&&ok===n?10:0);
}
/* r: {ok,n,sec,combo,boss,min,note}   戻り値は画面に出す内容 */
function completeStage(date,id,r){
 const d=dayRec(date),old=d.stg[id],redo=!!old&&lowRes(old)&&!lowRes(r);   // 4割未満だったドリルは、やりなおして4割以上とれたら数える（道をふさがない）
 const out={xp:0,first:!old||redo,lv:null,streak:null,full:false,fullBonus:0,coin:0};
 if(!out.first){if(lowRes(old)&&lowRes(r))out.low=true;return out}
 const had=goodOf(d).sess>=1;   // この前までに、正答4割以上のドリルがあったか
 const was=redo?(old.xp||0):0;   // やりなおしのときは、前に入ったXPを引く（二重にもらわない）
 out.xp=Math.max(0,stageXP(id,r)-was);
 if((r.n||0)>=5&&(r.ok||0)/r.n<.4)out.low=true;
 const st=(S.rt&&S.rt.d===date?S.rt.stg.find(x=>x.id===id):null)||{};
 const mins=r.min!=null?r.min:Math.max(1,Math.round((r.sec||0)/60)),sj=st.subj||'総';
 d.stg[id]=Object.assign({ok:r.ok||0,n:r.n||0,xp:out.xp+was,sec:(redo?old.sec||0:0)+(r.sec||0),cb:Math.max(r.combo||0,redo?old.cb||0:0),at:Date.now(),note:r.note||''},redo?{f:old.f||{ok:old.ok,n:old.n}}:{});   // f＝やりなおす前の「1回目」の結果（れんらくのメールにも載せる）
 d.min[sj]=(d.min[sj]||0)+mins;
 const good=goodOf(d).sess>=1;
 /* 宿題・ふりかえり・全クリのXPは、その日に「正答4割以上のドリル」が1つあるときだけ。ない日の宿題・ふりかえりのXPは預かって、あとでドリルがとれたら入る */
 if(!good&&(id==='hw'||id==='ref')){d.pend=(d.pend||0)+out.xp;d.stg[id].xp=0;out.xp=0;out.held=true}
 else if(good&&!had&&d.pend){out.xp+=d.pend;d.pend=0}
 if(id==='sub'&&st.ty!==undefined)S.subLast[st.ty]=date;   // どの教科の日を、いつやったか（やすんだ教科を先に回すために覚えておく）
 if(r.boss){const k=monday(date),prev=S.wk[k]?S.wk[k].x:0;S.wk[k]={sc:r.ok,x:Math.max(prev,out.xp)}}
 out.lv=addXP(out.xp);
 const tier=S.rt&&S.rt.d===date?S.rt.tier:3;
 if(dayOK(d,tier)&&!d.ok){d.ok=1;out.streak=streakUp()}
 const rt=S.rt&&S.rt.d===date?S.rt.stg:[];
 if(!d.full&&good&&rt.length&&rt.every(p=>d.stg[p.id]||(p.kind==='session'&&!p.ids.length))){d.full=1;out.full=true;out.fullBonus=20;const l2=addXP(20);out.lv=out.lv||l2}
 out.coin=out.xp+out.fullBonus;
 snapPath(date);   // 週ごとの「合格への道のり」の記録
 return out;
}
/* 自由練習のXP（1日60まで）。ルート外の練習をたくさんしても、やりすぎにならないように */
function drillXP(ok,date=today()){
 const d=dayRec(date),give=Math.max(0,Math.min(Math.floor(ok/2),60-(d.dx||0)));
 d.dx=(d.dx||0)+give;const lv=give?addXP(give):null;return{xp:give,lv};
}
function noteAnswer(ok,date=today()){
 S.tot.n++;if(ok)S.tot.ok++;
 const d=dayRec(date);d.n=(d.n||0)+1;if(ok)d.c=(d.c||0)+1;
}
/* 学校のテストのミスを登録したときのXP：1日1回だけ（何回も登録してXPをかせげないように） */
function mistakeXP(date=today()){const d=dayRec(date);if(d.mx)return{xp:0,lv:null};d.mx=1;return{xp:5,lv:addXP(5)}}
function addMinutes(sj,m,date=today()){const d=dayRec(date);d.min[sj]=(d.min[sj]||0)+m}

/* ----- マスター数（おぼえた問題） ----- */
const masteredCount=pred=>{let n=0;for(const id in S.srs){if(S.srs[id].b>=4){const it=ITEMS[id];if(it&&(!pred||pred(it)))n++}}return n};
const masteredBy=b=>masteredCount(it=>it.bank===b);

/* ----- バッジ ----- */
const gid=(k,i)=>k+'|'+i;
const phDone=n=>ROADMAP.filter(m=>m.ph===n).every(m=>S.mc[m.k]);
const BADGES=[
 ['first','はじめの一歩','初めてステージをクリア',()=>Object.values(S.days).some(d=>stageKeys(d).length>0)],
 ['s3','3日連続','3日続けた',()=>S.best>=3],['s7','7日連続','1週間続けた',()=>S.best>=7],['s14','14日連続','2週間続けた',()=>S.best>=14],
 ['s30','30日連続','1か月続けた',()=>S.best>=30],['s100','100日連続','100日続けた',()=>S.best>=100],
 ['q100','100問','合計100問に答えた',()=>S.tot.n>=100],['q1000','1,000問','合計1,000問に答えた',()=>S.tot.n>=1000],
 ['q5000','5,000問','合計5,000問に答えた',()=>S.tot.n>=5000],['q20000','20,000問','合計20,000問に答えた',()=>S.tot.n>=20000],
 ['w100','英単語100語','英単語を100語おぼえた',()=>masteredBy('EW')>=100],['w300','英単語300語','英単語を300語おぼえた',()=>masteredBy('EW')>=300],['w450','英単語450語','英単語を450語おぼえた',()=>masteredBy('EW')>=450],
 ['k80','漢字80語','漢字の読みを80語おぼえた',()=>masteredBy('JK')>=80],
 ['all500','500問マスター','500問をおぼえた（箱4以上）',()=>masteredCount()>=500],['all1500','1500問マスター','1500問をおぼえた（箱4以上）',()=>masteredCount()>=1500],
 ['diag','現在地を知った','ミニ診断を5教科おわらせた',()=>SJL.every(s=>S.diag[s]&&S.diag[s].done)],
 ['nai','内申の作戦','内申の目標を決めた',()=>!!S.nai.set],
 ['mist10','ミス退治 10体','ミスを10体たおした',()=>mistakeStats().dead>=10],['mist50','ミス退治 50体','ミスを50体たおした',()=>mistakeStats().dead>=50],
 ['boss3','週ボス3勝','週ボスを3回クリア',()=>wkWins()>=3],['boss10','週ボス10勝','週ボスを10回クリア',()=>wkWins()>=10],
 ['full7','全クリ7日','全ステージクリアを7日',()=>Object.values(S.days).filter(d=>d.full).length>=7],
 ['h50','50時間','学習が合計50時間',()=>hours()>=50],['h100','100時間','学習が合計100時間',()=>hours()>=100],
 ['h300','300時間','学習が合計300時間',()=>hours()>=300],['h500','500時間','学習が合計500時間',()=>hours()>=500],
 ['m1','最初の宝箱','月のマイルストーンを初クリア',()=>Object.keys(S.mc).length>=1],
 ['p1','第1章クリア','土台づくりを完了',()=>phDone(1)],['p2','第2章クリア','内申と基礎の完成',()=>phDone(2)],
 ['p3','第3章クリア','実戦力を完了',()=>phDone(3)],['p4','最終章クリア','ゴールに到達',()=>phDone(4)],
 ['eiken','英検に挑戦','英検の目標をクリア',()=>!!(S.ms[gid('2027-06',0)]||S.ms[gid('2027-10',1)])],
 ['lv10','Lv.10','レベル10に到達',()=>lvOf(S.xp)>=10],['lv20','Lv.20','レベル20に到達',()=>lvOf(S.xp)>=20],
 ['lv30','Lv.30','レベル30に到達',()=>lvOf(S.xp)>=30],['lv40','Lv.40 サクラマスター','最高レベルに到達',()=>lvOf(S.xp)>=40]
];
/* 新しく取れたバッジの名前を返す */
function checkBadges(){
 const got=[];BADGES.forEach(b=>{if(!S.badges[b[0]]&&b[3]()){S.badges[b[0]]=today();got.push(b)}});return got;
}

/* ----- 月のマイルストーン ----- */
/* 記録から自動で決まる目標（自己申告にしない）。キー：月|番号 */
/* ペース：直近4週間に、合格ラインをこえた日の割合（週5日を1とする。いちばん下は .5。はじめの2週間は1）。
   数のある自動の目標は、この子のペースでそろえる（週3日の子が、どの月も達成0にならないように）。週5日の子は、そのままの数 */
function paceF(date=today()){
 if(!S.start)return 1;
 const span=Math.min(28,diff(S.start,date)+1);
 if(span<14)return 1;
 let n=0;for(let i=0;i<span;i++)if((S.days[addDays(date,-i)]||{}).ok)n++;
 return clamp(n/(span*5/7),.5,1);
}
/* 記録から自動で決まる目標（自己申告にしない）。キー：月|番号。n＝ふつうのペース（週5日・正答率8割台）で、その月までに届く数（scripts/simulate.mjs と tests で確かめる） */
const qaStat=()=>{let n=0,w=0;for(const id in S.srs){const it=ITEMS[id];if(it&&(it.bank==='SQ'||it.bank==='OQ')){n+=S.srs[id].n;w+=S.srs[id].w}}return{n,acc:n?1-w/n:0}};
const mathDays90=()=>Object.values(S.days).filter(d=>d.stg&&d.stg.math&&d.stg.math.n>=6&&d.stg.math.ok/d.stg.math.n>=.9).length;
const GOAL_AUTO={
 '2026-10|1':{f:()=>SJL.every(s=>S.diag[s]&&S.diag[s].done)},
 '2026-10|4':{f:()=>S.best>=7},
 '2026-11|1':{n:40,f:n=>bankStats('EW').seen>=n},
 '2026-11|2':{n:3,min:2,f:n=>mathDays90()>=n},
 '2026-11|3':{f:()=>{const m=mistakeStats();return m.all>=10&&m.dead>=5}},
 '2027-02|2':{n:800,f:n=>{const q=qaStat();return q.n>=n&&q.acc>=.8}},
 '2027-02|3':{n:100,mis:1,f:n=>mistakeStats().dead>=n},
 '2027-05|3':{n:250,mis:1,f:n=>mistakeStats().dead>=n},
 '2028-02|2':{n:600,mis:1,f:n=>mistakeStats().dead>=n}};
const isAutoGoal=(k,i)=>!!GOAL_AUTO[gid(k,i)];
/* ミスの数の目標は、まちがいの少ない子（正答率が高い子）には、数をへらす（できる子ほど届かなくならないように）。正答率8.5割までは、そのまま */
const missF=()=>S.tot.n>=200?clamp((1-S.tot.ok/S.tot.n)/.15,.4,1):1;
const goalN=key=>{const g=GOAL_AUTO[key];return g&&g.n?Math.max(g.min||1,Math.round(g.n*paceF()*(g.mis?missF():1))):0};
const goalOK=key=>{const g=GOAL_AUTO[key];return !!g&&g.f(goalN(key))};
/* 目標の文：数のある自動の目標は、{n} を、この子のペースの数にする */
const goalText=(m,i)=>{const n=goalN(gid(m.k,i));return n?m.g[i][0].replace('{n}',n):m.g[i][0]};
function syncAutoGoals(){
 const out=[];
 for(const key in GOAL_AUTO){if(S.ms[key])continue;if(goalOK(key)){const [k,i]=key.split('|');out.push(toggleGoal(k,+i))}}
 return out;
}
const mStat=m=>{const n=m.g.length,d=m.g.filter((_,i)=>S.ms[gid(m.k,i)]).length;return{n,d,p:n?d/n:0,clear:d>=Math.ceil(n*.8)}};
const curMonth=()=>{const mk=today().slice(0,7);if(mk<=ROADMAP[0].k)return ROADMAP[0].k;const L=ROADMAP[ROADMAP.length-1].k;return mk>=L?L:mk};
const rwText=m=>S.mrw[m.k]||m.rw;
/* 目標をタップ（オン／オフ）。戻り値：{xp, lv, chest} */
function toggleGoal(k,i){
 const m=ROADMAP.find(x=>x.k===k),id=gid(k,i),xp=m.g[i][1],out={xp:0,lv:null,chest:false,on:false};
 if(S.ms[id]){delete S.ms[id];addXP(-xp)}
 else{S.ms[id]=1;out.on=true;out.xp=xp;out.lv=addXP(xp)}
 if(mStat(m).clear&&!S.mc[k]){S.mc[k]=1;out.chest=true;out.lv=out.lv||addXP(100)}
 return out;
}

/* ----- 今日のデータ採点（1〜5）：自己採点とくらべて、自分の甘さ・厳しさに気づくため ----- */
function dayScore(date=today()){
 const rec=peekDay(date),keys=stageKeys(rec).filter(k=>k!=='hw'&&k!=='ref'&&k!=='diag');
 if(!keys.length)return 1;
 const n=sum(keys.map(k=>rec.stg[k].n||0)),ok=sum(keys.map(k=>rec.stg[k].ok||0)),acc=n?ok/n:0;
 const rt=(S.rt&&S.rt.d===date)?S.rt.stg.filter(p=>p.kind==='session'&&p.ids.length):[];
 const comp=rt.length?Math.min(1,keys.length/rt.length):1;
 return clamp(Math.round((comp*.5+acc*.5)*5),1,5);
}
/* 自己採点（self）とデータ採点（data）のちがいから、ひとことを返す */
function calibNote(self,data){
 const d=self-data;
 if(d>=2)return{k:'amai',t:'ちょっと高めにつけたかも。データだと'+data+'点。まちがえた問題を1つ見なおしてみよう。'};
 if(d<=-2)return{k:'kibishii',t:'ちょっと低めにつけたかも。データだと'+data+'点。できたところも、ちゃんと数えよう。'};
 return{k:'ok',t:'いい目をしてる！データの'+data+'点とほぼ同じ。自分をちゃんと見られているよ。'};
}

/* ----- 日ごとの状態（ナワバリマップ用） ----- */
function dayState(date){
 const r=S.days[date];if(!r)return'none';
 if(r.full)return'full';if(r.ok)return'ok';return stageKeys(r).length||(r.dx||0)>0?'part':'none';
}
/* 学習の合計（保護者・マップ用） */
function totals(){
 let days=0,full=0,ok=0;
 for(const d in S.days){const r=S.days[d];if(stageKeys(r).length)days++;if(r.ok)ok++;if(r.full)full++}
 return{days,ok,full,n:S.tot.n,acc:S.tot.n?S.tot.ok/S.tot.n:0,hours:hours(),mastered:masteredCount()};
}

/* ----- 週報（保護者に見せる文） ----- */
function reportText(){
 const mon=monday(today()),days=[...Array(7)].map((_,i)=>addDays(mon,i));let ok=0,full=0,n=0,c=0;const min={};
 days.forEach(d=>{const r=S.days[d];if(r){ok+=r.ok?1:0;full+=r.full?1:0;n+=r.n||0;c+=r.c||0;for(const k in r.min)min[k]=(min[k]||0)+r.min[k]}});
 const tot=sum(Object.values(min)),w=S.wk[mon],m=ROADMAP.find(x=>x.k===curMonth()),st=mStat(m),L=lvInfo(S.xp),ms=mistakeStats();
 return `【さくらクエスト 週報】${S.nick||'（呼び名なし）'}\n期間：${mon}〜${days[6]}\n合格ラインの日：${ok}/7日（全ステージクリア：${full}日）　いまの段階：${TIERS[S.rt&&S.rt.tier||1].name}\n連続記録：${curStreak()}日\n答えた問題：${n}問（正解 ${c}問・${n?Math.round(c/n*100):0}%）\n学習時間：${tot}分（${Object.keys(min).map(k=>SJN[k]+min[k]+'分').join('、')||'記録なし'}）\n週ボス：${w?w.sc+'/10問':'まだ'}\nミス：登録${ms.all}体／たおした${ms.dead}体／のこり${ms.open}体\nおぼえた問題（箱4以上）：${masteredCount()}問\n${pathReportLine()}\n今月のマイルストーン：${st.d}/${st.n}\nレベル：Lv.${L.lv}「${L.name}」（${S.xp}XP）\nひとこと：`;
}
