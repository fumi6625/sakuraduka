/* ===== ホーム：「いま やること」が1つだけ大きく出る画面 =====
   習慣づくりの途中の子向け。
   → 迷わせない（次の1つだけを大きく）／短く区切る／すぐ勝てる／自己申告にたよらない */
const STAGE_SHORT={hw:'宿題',mem:'暗記',math:'数学',mis:'ミス退治',ref:'ふりかえり',diag:'診断'};
const stageShort=(s,wd)=>s.id==='sub'?(s.short||WDP[wd].short):STAGE_SHORT[s.id];
const SUB_IC={英:'eng',国:'jp',理:'sci',社:'soc',総:'bolt'};
const stageIcon=s=>s.id==='sub'?(s.boss?'trophy':SUB_IC[s.subj]||'star'):STAGE_IC[s.id];
const starsOf=(ok,n)=>{if(!n)return'';const a=ok/n;return a>=.95?'★★★':a>=.8?'★★☆':'★☆☆'};
const rankOfAcc=a=>a>=.95?'S':a>=.85?'A':a>=.7?'B':'C';
const GREET=['今日の一歩が、500日後の合格につながる。','続けている人が、いちばん強い。','昨日の自分より、1ミリ前へ。','まちがいは伸びしろ。','3分でも、立派な前進。','ノートを開いた時点で、もう勝ってる。','焦らなくていい。止まらなければいい。','わからないを見つけた日は、大成長の日。','小さな「できた」を集めよう。','桜は、冬のあいだに力をためて咲く。','未来の自分が、今日の自分を見ている。','やるのは、目の前の1問だけ。'];
const stageMeta=s=>s.kind==='session'?`<span class="chp">約${Math.max(1,s.min)}分</span><span class="chp">${s.items.length}問</span><span class="chp xp">+${s.xp}XP</span>`:(s.xp?`<span class="chp xp">+${s.xp}XP</span>`:`<span class="chp">約${s.min||3}分</span>`);
const goBtn=s=>s.id==='hw'?'チェックする':s.id==='ref'?'ふりかえる':'スタート！';

function stageCard(s){
 const r=s.res,isS=s.kind==='session',cls=s.done?'done':'';
 let det='';
 if(s.auto)det=`<p class="ds">${esc(s.desc)}</p>`;
 else if(s.done&&r){
  det=`<div class="rs"><b class="stars">${starsOf(r.ok,r.n)}</b>${isS&&r.n?`<span>${r.ok}/${r.n} せいかい</span>`:''}${s.id==='ref'&&r.note?`<span>「${esc(r.note)}」</span>`:''}<span class="chp xp">+${r.xp}XP</span>${r.sec?`<span class="chp">${fmtMin(Math.max(1,Math.round(r.sec/60)))}</span>`:''}</div>`;
 }else{
  det=`<p class="ds">${esc(s.desc)}</p><div class="mt">${stageMeta(s)}</div>`;
 }
 const label=s.auto?'':s.done?'もう一度':s.id==='hw'?'チェック':s.id==='ref'?'かく':'はじめる';
 return `<article class="st ${cls}${s.auto?' auto':''}" data-s="${s.subj}"><div class="no">${ico(s.done?'check':stageIcon(s))}<b>${s.n}</b></div>
  <div class="sbd"><h3>${esc(s.t)} ${sjTag(s.subj)}</h3>${det}</div>
  ${label?`<div class="go"><button class="bt${s.done?' gh sm':''}" data-act="stageGo" data-a="${s.id}">${label}</button></div>`:''}</article>`;
}
function weekStrip(date){
 const mon=monday(date),days=[1,2,3,4,5,6,0],sub=S.rt&&S.rt.d===date?S.rt.stg.find(x=>x.id==='sub'):null;
 return `<div class="week">${days.map((wd,i)=>{
  const d=addDays(mon,i),W=WDP[wd],past=d<date,isT=d===date,st=dayState(d),lab=isT&&sub&&sub.short?(sub.ty===0?'ボス':sub.short):(W.boss?'ボス':W.short);   // 今日は、やすんだ教科を先に回した日なら、その教科の名前を出す
  return `<div class="wd ${isT?'today':past?'past':''} ${past&&(st==='ok'||st==='full')?'ok':''}"><b>${'日月火水木金土'[wd]}</b><span>${lab}</span><i>${dt(d).getDate()}日</i></div>`}).join('')}</div>`;
}
function monthMini(){
 const m=ROADMAP.find(x=>x.k===curMonth()),st=mStat(m);
 return `<div class="card"><div class="rowh"><h2>今月のマイルストーン</h2><span class="lb sm c">${esc(m.label)}</span><span class="sp mini px">${st.d}/${st.n}</span></div>
  <p class="mini">${esc(m.th)}</p>${m.g.map((g,i)=>{const on=!!S.ms[gid(m.k,i)];return `<button class="q" data-act="goal" data-a="${m.k}|${i}" aria-pressed="${on}"><span class="box">${on?'✓':''}</span><span>${esc(goalText(m,i))}</span><span class="xp">+${g[1]}</span></button>`}).join('')}
  <p style="margin-top:10px"><button class="bt sm" data-tab="map">ぜんぶの月を見る</button></p></div>`;
}
/* いまの段階の説明（ならし → ふつう → しっかり） */
function tierNote(date,tier){
 const T=TIERS[tier],base=baseTier(date);
 if(S.light[date])return'きょうは「ミニ」でOK。やった日は ぬられる。';
 if(S.tier&&S.tier!=='auto')return'段階は保護者が決めています。';
 if(tier<base||easeF(date)<1)return'おやすみが多かったので、量を へらしたよ。やった日ごとに もどすよ。';
 if(breakInfo(date).n<99)return'おやすみ明けなので、少なめから。1日ごとに もどすよ。';
 if(tier===1){const d=Math.max(0,14-doneDays(date));return d>0?'まずは短く。あと'+d+'日で「ふつう」へ。':'つづけると「ふつう」へ。'}
 if(tier===2){const d=Math.max(0,28-doneDays(date));return d>0?'あと'+d+'日で「しっかり」へ。':'もうすぐ「しっかり」へ。'}
 return T.note;
}
const nowHM=()=>{const d=new Date();return pad(d.getHours())+':'+pad(d.getMinutes())};
function vowChip(okDay){
 if(okDay)return'';
 const at=S.at||'',late=at&&nowHM()>at;
 return `<button class="vowb${late?' late':''}" data-act="vow">${ico('timer')}${late?'やくそくの時間をすぎたよ。3分だけ！':at?'やくそく '+at+' にスタート':'やくそくの時間を決める'}</button>`;
}
const briefDesc=(d,n=22)=>{
 d=String(d||'');
 if(!d.includes('／')){const k=d.indexOf('。');return k>=0&&k<d.length-1?d.slice(0,k+1):d.length>40?d.slice(0,39)+'…':d}   // 「／」がない説明は、文の途中で切らない
 let out='';for(const p of String(d||'').split('／')){const nx=out?out+'／'+p:p;if(nx.length>n&&out)break;out=nx}return out.length>n?out.slice(0,n-1)+'…':out};
function nowCard(next,tier,okDay,rec){
 const T=TIERS[tier],isS=next.kind==='session';
 const need=dayNeed(rec,tier);
 const goal=okDay?`<span class="chp ok">✓ きょうの合格ライン達成！</span> れんぞく ${curStreak()}日`:`<span class="chp w">合格ライン</span> ${tier===1?'どれか1つクリアでOK！':'あと'+Math.max(1,need)+'つクリアでOK！'}`;
 return `<div class="nowc" data-s="${next.subj}"><div class="sp1">${splatSVG(9,'var(--yellow)',{drops:7,stroke:'var(--ink)',sw:5})}</div>
  <span class="lb">${next.redo?'もう一度 やること':'いま やること'}</span>
  <div class="nrow"><div class="nico">${ico(stageIcon(next))}</div><div class="ntx"><h2>${esc(next.t)}</h2><p>${esc(briefDesc(next.desc))}</p></div></div>
  <div class="chips">${isS?`<span class="chp">約${Math.max(1,next.min)}分</span><span class="chp">${next.items.length}問</span>`:next.xp?'':`<span class="chp">約${next.min||3}分</span>`}${next.xp||isS?`<span class="chp xp">+${next.xp}XP</span>`:''}</div>
  <button class="bt pri xl w100" data-act="stageGo" data-a="${next.id}">${goBtn(next)}</button>
  <p class="goal">${goal}</p><p class="tnote">${esc(tierNote(today(),tier))}</p>${vowChip(okDay)}</div>`;
}
function renderHome(){
 const date=today(),F=flowState(date),route=F.route,tier=S.rt.tier,T=TIERS[tier],wd=dt(date).getDay(),W=WDP[wd];
 const real=route.filter(s=>!s.auto),next=F.target,todo=real.filter(s=>!s.done&&s!==next),done=real.filter(s=>s.done);   // next＝一本道のつぎ（保護者OKの宿題は、おうちの人と）
 const rec=peekDay(date),okDay=dayOK(rec,tier),light=!!S.light[date];
 const appMin=sum(F.must.filter(s=>!s.done&&s.kind==='session').map(s=>s.min));
 const mustDone=F.must.filter(s=>s.done).length;
 const tm=previewDay(addDays(date,1));
 const intro=!S.nick?`<div class="card"><h2>はじめに：呼び名を決めよう</h2><p class="mini">本名は入れない。あとから変えられます。</p><div class="row"><input id="nickIn" type="text" maxlength="12" placeholder="ニックネーム" style="flex:1;min-width:180px"><button class="bt" data-act="nickSet">きまり！</button></div></div>`:'';
 const pinAsk=(S.nick&&!S.pin&&doneDays(date)>=1&&(!S.pinSkip||diff(S.pinSkip,date)>=7))?`<div class="card"><h2>おうちの人へ</h2><p class="mini">4けたの暗証番号を決めると、宿題のOKと月の目標が「自己申告」ではなくなります。</p><div class="row"><button class="bt pri" data-page="family">決める</button><button class="bt gh" data-act="pinLater">あとで</button></div></div>`:'';
 const diagTip=(!SJL.every(s=>S.diag[s]&&S.diag[s].done)&&S.tot.n<40)?`<div class="tomorrow"><span class="lb sm c">おすすめ</span><span>ミニ診断（約10分）で、いまの実力を知ろう。</span><button class="bt sm sp" data-page="diag">診断へ</button></div>`:'';
 const L=`
 <div class="hero cmp" data-s="${W.subj}">
  <div class="sp1">${splatSVG(5,'var(--team)',{stroke:'var(--ink)',sw:4})}</div>
  <div class="t1"><span class="lb sm">きょうのミッション</span><span class="date">${dateJa(date)}</span><span class="chp t">${T.name}モード</span></div>
  <div class="gp"><div class="tank"><i style="--w:${Math.round(mustDone/F.must.length*100)}%"></i></div><b>${mustDone}/${F.must.length}</b>${appMin?`<span class="mini left-min">のこり約${appMin}分</span>`:''}</div>
 </div>
 ${next?nowCard(next===F.redo?Object.assign({},next,{done:false,redo:true,desc:'ゆっくり読んで もう一度。4割以上でOK！'}):next,tier,okDay,rec):goalCard(F)}
 ${routeBar(F,wd,true)}
 ${todo.length?`<details class="fold later"><summary><span class="lb sm y">このあと</span><span class="lt">${todo.length}つ</span></summary><div class="stages">${todo.map(stageCard).join('')}</div></details>`:''}
 ${done.length?`<details class="fold cleared-list"><summary>クリアしたステージ（${done.length}）</summary><div class="stages">${done.map(stageCard).join('')}</div></details>`:''}
${intro}${diagTip}${pinAsk}
 <div class="busy"><button class="sw" data-act="light" aria-pressed="${light}" aria-label="ミニモード"></button><span>きょうは ミニでいく（いそがしい・つかれた日。量をへらす。ドリル1つで れんぞく記録はセーフ）${S.pinOn&&S.pin?'':`<small class="mini"> 週2回まで（今週あと${Math.max(0,2-lightUsed(date))}回）</small>`}</span></div>`;
 const R=`
 ${pathMini()}
 <div class="card"><div class="rowh"><h2>今週の流れ</h2></div>${weekStrip(date)}
  <div class="tomorrow"><span class="lb sm o">あした</span><span><b>${esc(tm.t)}</b><br><span class="mini">数学のテーマ：${esc(tm.theme)}</span></span></div></div>
 ${monthMini()}`;
 $('#v-home').innerHTML=`<p class="mini" style="margin:2px 4px 6px">${esc(GREET[dt(date).getDate()%GREET.length])}</p><div class="home2"><div>${L}</div><div>${R}</div></div>`;
}

/* ----- 宿題チェック（保護者OKつき）・ふりかえり（自己採点とデータの比較） ----- */
let hwTimer=null,hwLenM=25;
function hwSheet(){
 const s=routeFor().find(x=>x.id==='hw'),done=!!s.res,pin=S.pinOn&&S.pin;
 openSheet(`<h2>宿題・提出物</h2><p>ぜんぶ終わらせよう。<b>提出物を落とさない</b>のが、内申にいちばん効く。</p>
  <div class="timer" id="hwT">25:00</div>
  <div class="seg" id="hwLen">${[15,25,40].map(m=>`<button data-act="hwLen" data-a="${m}" aria-pressed="${m===25}">${m}分</button>`).join('')}</div>
  <div class="row" style="justify-content:center"><button class="bt cy" data-act="hwGo" id="hwBtn">集中タイマー スタート</button></div>
  <h4 style="text-align:center;margin-top:16px">おわったら</h4>
  ${pin?`<div class="pinbox"><b>おうちの人のOK</b><p class="mini" style="margin:2px 0 8px">見せて、4けたの番号を入れてもらう。</p><input id="pinIn" type="password" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="● ● ● ●" aria-label="暗証番号"></div>`:`<p class="mini" style="text-align:center">おうちの人に見せてから押そう。</p>`}
  <div class="row" style="justify-content:center;margin-top:12px"><button class="bt pri xl" data-act="hwDone">${done?'もう一度おわった':pin?'OKをもらった！':'おわった！'} +${XPST.hw}XP</button></div>`);
 hwTick(true);
}
function hwTick(reset){
 const el=$('#hwT');if(!el){if(hwTimer){clearInterval(hwTimer.iv);hwTimer=null}return}
 if(reset||!hwTimer){el.textContent=pad(hwLenM)+':00';return}
 const left=Math.max(0,hwTimer.end-Date.now()),sec=Math.ceil(left/1000);
 el.textContent=pad(Math.floor(sec/60))+':'+pad(sec%60);
 if(left<=0){clearInterval(hwTimer.iv);hwTimer=null;Snd.clear();FX.confetti(60);toast('時間だ！おつかれさま');const b=$('#hwBtn');if(b)b.textContent='集中タイマー スタート'}
}
let refSelf=0;
function calibStats(){
 const v=Object.values(S.refl).filter(x=>x&&x.s&&x.d);if(v.length<3)return'';
 const a=v.filter(x=>x.s-x.d>=2).length,k=v.filter(x=>x.s-x.d<=-2).length,o=v.length-a-k;
 return `<p class="mini">いままでの ${v.length}回：ちょうどいい ${o}回／高め ${a}回／低め ${k}回</p>`;
}
function refSheet(){
 refSelf=0;
 const rv=Object.keys(S.refl).sort().slice(-3).reverse();
 openSheet(`<h2>ふりかえり</h2><p>まず、<b>今日の自分に点数</b>をつけよう（5が最高）。そのあと、データとくらべるよ。</p>
  <div class="stars5" id="refStars">${[1,2,3,4,5].map(i=>`<button data-act="refStar" data-a="${i}" aria-pressed="false" aria-label="${i}点"><span>★</span><small>${i}</small></button>`).join('')}</div>
  <div id="refCmp" class="calib"></div>
  <label for="refIn">今日できたことを1つ（小さくていい）</label>
  <input id="refIn" type="text" maxlength="60" placeholder="例：連立方程式の符号ミスが減った" style="width:100%">
  <div class="row" style="justify-content:center;margin-top:12px"><button class="bt pri xl" data-act="refDone" id="refGo" disabled>おしまい +${XPST.ref}XP</button></div>
  ${calibStats()}
  ${rv.length?`<h4>これまでのふりかえり</h4>${rv.map(d=>`<div class="say"><span class="mini">${dateJa(d)}${S.refl[d].s?'　自分'+S.refl[d].s+'点／データ'+S.refl[d].d+'点':''}</span><br>${esc(S.refl[d].t)}</div>`).join('')}`:''}`);
}
