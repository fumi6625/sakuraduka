/* ===== 今日のルート：ロードマップ → 毎日の教材 =====
   その日の「曜日」「月のカリキュラム(CUR)」「これまでの成績(SRS)」「いまの段階(ならし/ふつう/しっかり)」から、
   暗記 → 数学 → 今日の教科 → ミス退治 → 宿題チェック → ふりかえり を、実際の問題つきで組み立てる。
   組み立てた結果は日付ごとに保存し、1日のあいだ中身が変わらないようにする。
   【考え方】勉強の習慣づくりの途中の子向け。最初は「3分」から。量は段階的に増やす。*/
const curOf=date=>{const k=date.slice(0,7);let c=CUR[0];for(const x of CUR)if(x.from<=k)c=x;return c};
const MEMB=['EW','EV','JK','JI','JS','SQ','OQ'];
const ewOpen=it=>+it.grp<=2||(+it.grp===3&&today()>='2027-03-01')||(+it.grp===4&&today()>='2027-05-01');
const uniq=a=>{const s=new Set();return a.filter(x=>x&&!s.has(x.id)&&s.add(x.id))};
const seedOf=s=>(hashStr(s)%4e9)+1;
const genOne=(id,n,date,salt)=>{const lv=genLv(id);return Array.from({length:n},(_,i)=>makeGen(id,lv,seedOf(date+salt+id+i)))};
const genMix=(ids,n,date,salt)=>Array.from({length:n},(_,i)=>{const id=ids[(hashStr(date+salt)+i)%ids.length];return makeGen(id,genLv(id),seedOf(date+salt+id+i))});
const exSet=(ex,items)=>new Set([...ex,...items.map(i=>i.id)]);
const jn=a=>a.filter(Boolean).join('・');
function nextPassage(bank,ex,date){
 const items=BK[bank].items,pids=[...new Set(items.map(i=>i.pid))];
 for(const pid of pids){const qs=items.filter(i=>i.pid===pid);if(qs.some(q=>!S.srs[q.id])&&!qs.some(q=>ex.has(q.id)))return qs}
 if(!pids.length)return[];
 return items.filter(i=>i.pid===pids[hashStr(date+bank)%pids.length]&&!ex.has(i.id));
}
function pickSeenOrNew(banks,n,ex,date){
 let items=weakItems(n,it=>banks.includes(it.bank)&&!ex.has(it.id));
 if(items.length<n){const seen=shuffle(seenItems(it=>banks.includes(it.bank)&&!ex.has(it.id)&&!items.includes(it)),mulberry(seedOf(date+banks[0])));items=items.concat(seen.slice(0,n-items.length))}
 for(const b of banks){if(items.length>=n)break;items=items.concat(newItems(b,n-items.length,{ex:exSet(ex,items)}))}
 return items.slice(0,n);
}
/* ----- いまの段階（ならし → ふつう → しっかり）。最初の2週間は「毎日つづけること」だけが目標 ----- */
const TIERS={
 1:{name:'ならし',k:.45,line:'1つクリアで合格ライン',note:'まずは短く。毎日つづけることが目標。'},
 2:{name:'ふつう',k:.7,line:'2ステージで合格ライン',note:'すこしずつ増やす時期。'},
 3:{name:'しっかり',k:1,line:'2ステージで合格ライン',note:'本番にむけた、いつもの量。'}};
const EASY_M=['pn_add','pn_mul','lit_calc','lit_value','lin_eq'];
function recentAcc(date){
 let n=0,c=0;for(let i=1;i<=7;i++){const d=S.days[addDays(date,-i)];if(d){n+=d.n||0;c+=d.c||0}}
 return{n,acc:n?c/n:1};
}
function okDays(date){let ok=0;for(let i=1;i<=7;i++)if((S.days[addDays(date,-i)]||{}).ok)ok++;return ok}
const baseTier=date=>{const w=Math.max(0,Math.floor(diff(S.start||date,date)/7));return w<2?1:w<4?2:3};
function tierFor(date){
 if(S.light[date])return 1;
 if(S.tier&&S.tier!=='auto')return Math.max(1,Math.min(3,+S.tier));
 if(!S.start)S.start=date;
 const w=Math.max(0,Math.floor(diff(S.start,date)/7));
 let t=w<2?1:w<4?2:3;
 if(w>=1&&okDays(date)<=2)t=Math.max(1,t-1);   // おやすみが多い週は、1段階もどして立て直す
 return t;
}
/* 正答率が低い週は、新しい問題を減らす（つまずいているときに増やさない） */
function throttle(date){const r=recentAcc(date);return r.n>=30&&r.acc<.6?0.7:1}
/* 種類のちがう問題を交互に並べる（同じ種類が何問も続くと、飽きて集中が切れる） */
function interleave(items){
 const g=new Map();items.forEach(i=>{const key=i.k==='gen'?'gen':i.bank;if(!g.has(key))g.set(key,[]);g.get(key).push(i)});
 const lists=[...g.values()],out=[];
 for(let r=0;lists.some(l=>l.length>r);r++)lists.forEach(l=>{if(l[r])out.push(l[r])});
 return out;
}
/* 量をへらすとき：長文は外し、どの種類からも、まんべんなく残す */
function trimItems(items,k){
 if(k>=1)return items;
 const base=items.filter(i=>i.k!=='read'),n=Math.max(6,Math.round(base.length*k));
 return interleave(base).slice(0,n);
}
/* 曜日ごとの「今日の教科」 */
const WDP=[
 {t:'週ボス：10問しょうぶ',subj:'総',boss:1,short:'ボス'},
 {t:'英語の日：文法と長文',subj:'英',short:'英語'},
 {t:'国語の日：言葉と読解',subj:'国',short:'国語'},
 {t:'理科の日：一問一答と計算',subj:'理',short:'理科'},
 {t:'社会の日：一問一答と年表',subj:'社',short:'社会'},
 {t:'英語の日：リスニングと英作文',subj:'英',short:'英語'},
 {t:'弱点日：苦手をつぶす',subj:'総',short:'弱点'}];
/* 内訳（カテゴリごとの問題数と、そのうち新しい問題の数） */
function breakdown(items){
 const m=new Map();
 items.forEach(it=>{
  const label=it.k==='gen'?(GEN[it.gid]?GEN[it.gid].name:'計算'):it.k==='mist'?'学校のテストのミス':BK[it.bank]?BK[it.bank].name:'その他';
  const o=m.get(label)||{name:label,n:0,nw:0,subj:it.subj};o.n++;if(!S.srs[it.id])o.nw++;m.set(label,o);
 });
 return[...m.values()];
}
const itemCat=it=>it.k==='gen'?(GEN[it.gid]?GEN[it.gid].name:'計算'):it.k==='mist'?'学校のテストのミス':BK[it.bank]?BK[it.bank].name:'';
const descOf=items=>jn(breakdown(items).slice(0,4).map(b=>b.name+b.n+'問'));

function bMem(date,tier,cur,ex){
 const k=TIERS[tier].k*throttle(date),r=n=>Math.max(2,Math.round(n*k));
 const ews=newItems('EW',r(10),{pred:ewOpen,ex}),jks=newItems('JK',r(5),{prefs:cur.jk,ex});
 const sqs=tier>=2?newItems('SQ',r(4),{prefs:cur.sc,ex}):[],oqs=tier>=2?newItems('OQ',r(4),{prefs:cur.so,ex}):[];
 const sx=exSet(ex,[...ews,...jks,...sqs,...oqs]),due=dueItems(it=>MEMB.includes(it.bank)&&!sx.has(it.id),r(20));
 let items=interleave([...due,...ews,...jks,...sqs,...oqs]);
 const minN=tier===1?6:10;
 if(items.length<minN)items=items.concat(shuffle(seenItems(it=>MEMB.includes(it.bank)&&!items.includes(it)&&!ex.has(it.id)),mulberry(seedOf(date))).slice(0,minN-items.length));
 if(items.length<minN)items=items.concat(shuffle(BK.EW.items.filter(it=>ewOpen(it)&&!items.includes(it)&&!ex.has(it.id)),mulberry(seedOf(date+'x'))).slice(0,minN-items.length));
 return{t:'暗記バトル',subj:'総',items,desc:jn([due.length&&'ふくしゅう'+due.length+'問',ews.length&&'英単語 新'+ews.length,jks.length&&'漢字 新'+jks.length,(sqs.length+oqs.length)&&'理社 新'+(sqs.length+oqs.length)])||'まとめふくしゅう'};
}
function bMath(date,tier,cur,ex){
 const k=TIERS[tier].k*throttle(date),r=(n,m)=>Math.max(m,Math.round(n*k));
 const pool=tier===1?EASY_M:cur.m,main=pool[dn(date)%pool.length],nMain=r(12,4),nWarm=r(5,2),nApp=tier>=3?3:0;
 const items=[...genMix(tier===1?EASY_M:cur.rv,nWarm,date,'warm'),...genOne(main,nMain,date,'main'),...(nApp?genMix(cur.w,nApp,date,'app'):[])];
 const mq=tier>=2?newItems('MQ',tier>=3?2:1,{ex}):[],ms=tier>=3?newItems('MS',1,{ex:exSet(ex,mq)}):[];
 const mis=tier>=3?dueItems(it=>it.subj==='数'&&!ex.has(it.id),3):[];
 return{t:'数学ドリル',subj:'数',items:[...items,...mq,...ms,...mis],desc:jn(['テーマ「'+GEN[main].name+'」'+nMain+'問（Lv.'+genLv(main)+'）','ウォームアップ'+nWarm+'問',nApp&&'応用'+nApp+'問',(mq.length+ms.length+mis.length)&&'考え方・再戦'+(mq.length+ms.length+mis.length)+'問'])};
}
function bMis(date,tier,ex){
 const n=Math.max(4,Math.round(12*TIERS[tier].k));
 let items=dueItems(it=>{const s=S.srs[it.id];return s&&s.w>0&&!ex.has(it.id)},n),pre=false;
 if(!items.length){items=weakItems(Math.min(6,n),it=>!ex.has(it.id));pre=items.length>0}
 return{t:'ミス退治',subj:'総',items,desc:items.length?(pre?'再戦の予定はなし。苦手を先取りで'+items.length+'体':'まちがえた問題の再戦 '+items.length+'体'):'まだミスがありません（まちがえた問題は、ここに集まります）'};
}
function bBoss(date,cur,ex){
 const items=[...pickSeenOrNew(['JW','JG','JI','JK','JS'],2,ex,date),...genMix(cur.m,2,date,'boss'),...pickSeenOrNew(['EG','EW','EV'],2,ex,date),...pickSeenOrNew(['SQ'],2,ex,date),...pickSeenOrNew(['OQ'],2,ex,date)];
 return{t:WDP[0].t,subj:'総',boss:true,items,desc:'国2・数2・英2・理2・社2。8問以上でクリア！これまでの苦手が出やすい'};
}
function bWeak(date,cur,ex){
 const weak=weakItems(14,it=>!ex.has(it.id));let worst=null,wr=2;
 for(const id in S.gs){const g=S.gs[id];if(g.n>=4&&GEN[id]&&GEN[id].subj==='数'){const r=g.ok/g.n;if(r<wr){wr=r;worst=id}}}
 const gid=worst||cur.m[0];
 return{items:[...weak,...genOne(gid,6,date,'weak')],desc:jn([weak.length&&'まちがえた問題 '+weak.length+'問','計算「'+GEN[gid].name+'」6問'])};
}
function bSub(date,wd,cur,ex,tier){
 let items,p;const t=WDP[wd].t,subj=WDP[wd].subj;
 if(wd===1){
  const g=newItems('EG',8,{prefs:cur.g,ex}),sx=exSet(ex,g),dg=dueItems(it=>it.bank==='EG'&&!sx.has(it.id),8);
  const ev=[...dueItems(it=>it.bank==='EV'&&!sx.has(it.id),4),...newItems('EV',4,{ex:sx})].slice(0,4);
  const eo=[...dueItems(it=>it.bank==='EO'&&!sx.has(it.id),3),...newItems('EO',4,{ex:sx})].slice(0,4),er=nextPassage('ER',sx,date);
  items=[...dg,...g,...ev,...eo,...er];p=[(dg.length+g.length)&&'文法'+(dg.length+g.length)+'問',ev.length&&'不規則動詞'+ev.length,eo.length&&'並べかえ'+eo.length,er.length&&'長文1題']}
 else if(wd===2){
  const w=newItems('JW',6,{ex}),sx=exSet(ex,w),dw=dueItems(it=>['JW','JG','JI','JS','JC'].includes(it.bank)&&!sx.has(it.id),8);
  const gg=newItems('JG',6,{ex:sx}),ji=newItems('JI',5,{ex:exSet(sx,gg)}),js=newItems('JS',4,{ex:exSet(sx,[...gg,...ji])}),jr=nextPassage('JR',sx,date);
  const jc=tier>=3?newItems('JC',1,{ex:exSet(sx,[...gg,...ji,...js])}):[];
  items=[...dw,...w,...gg,...ji,...js,...jr,...jc];p=[(dw.length+w.length)&&'漢字・語句'+(dw.length+w.length)+'問',gg.length&&'文法・古文'+gg.length,(ji.length+js.length)&&'慣用句・類義対義'+(ji.length+js.length),jr.length&&'読解1題',jc.length&&'作文1']}
 else if(wd===3){
  const q=newItems('SQ',14,{prefs:cur.sc,ex}),sx=exSet(ex,q),dq=dueItems(it=>it.bank==='SQ'&&!sx.has(it.id),10),calc=genMix(cur.s,5,date,'sci');
  items=[...dq,...q,...calc];p=[(dq.length+q.length)&&'一問一答'+(dq.length+q.length)+'問','計算5問']}
 else if(wd===4){
  const q=newItems('OQ',14,{prefs:cur.so,ex}),sx=exSet(ex,q),dq=dueItems(it=>it.bank==='OQ'&&!sx.has(it.id),10);
  const ot=[...dueItems(it=>it.bank==='OT'&&!sx.has(it.id),1),...newItems('OT',2,{ex:sx})].slice(0,2);
  items=[...dq,...q,...ot];p=[(dq.length+q.length)&&'一問一答'+(dq.length+q.length)+'問',ot.length&&'年代ならべかえ'+ot.length]}
 else if(wd===5){
  const el=[...dueItems(it=>it.bank==='EL'&&!ex.has(it.id),3),...newItems('EL',5,{ex})].slice(0,7),sx=exSet(ex,el);
  const eo=newItems('EO',4,{ex:sx}),ec=newItems('EC',1,{ex:sx}),ew=dueItems(it=>it.bank==='EW'&&boxOf(it)>=3&&!sx.has(it.id),5),ev=dueItems(it=>it.bank==='EV'&&!sx.has(it.id),4);
  items=[...el,...ew,...ev,...eo,...ec];p=[el.length&&'リスニング'+el.length,ew.length&&'つづり'+ew.length,eo.length&&'並べかえ'+eo.length,ec.length&&'英作文1']}
 else if(wd===6){const b=bWeak(date,cur,ex);items=b.items;p=[b.desc]}
 else{return bBoss(date,cur,ex)}
 const k=TIERS[tier].k*throttle(date);
 if(k<1){items=trimItems(items,k);return{t,subj,items,desc:descOf(items)||'今日の教科'}}
 return{t,subj,items,desc:jn(p)||'今日の教科'};
}
const XPST={hw:10,mem:20,math:30,sub:30,mis:15,ref:5};
const STAGE_IC={hw:'book',mem:'brain',math:'calc',sub:'star',mis:'splat',ref:'pen'};
/* その日のルートを新しく組み立てる（保存はしない）。順番：暗記（かんたんな勝ち）→ 数学 → 今日の教科 → ミス退治 → 宿題チェック → ふりかえり */
function buildRoute(date,tier){
 const wd=dt(date).getDay(),cur=curOf(date),ex=new Set(),out=[];
 const add=(id,b)=>{b.items=uniq(b.items);b.items.forEach(i=>ex.add(i.id));out.push(Object.assign({id,kind:'session',min:estMin(b.items),brk:breakdown(b.items)},b))};
 add('mem',bMem(date,tier,cur,ex));
 add('math',bMath(date,tier,cur,ex));
 if(tier>=2||wd===0)add('sub',bSub(date,wd,cur,ex,tier));
 if(tier>=2)add('mis',bMis(date,tier,ex));
 out.push({id:'hw',t:'宿題・提出物',kind:'check',subj:'総',min:0,items:[],desc:'学校の宿題と提出物をおわらせる。内申に直結します。'+(S.pinOn&&S.pin?'おうちの人のOKが必要です。':'')});
 out.push({id:'ref',t:'ふりかえり',kind:'reflect',subj:'総',min:2,items:[],desc:'今日の自分に点数をつけて、データと くらべてみよう。'});
 return out;
}
/* 保存形式 ↔ 実体 */
const idToItem=id=>{
 if(ITEMS[id])return ITEMS[id];
 const m=/^G:([a-z0-9_]+):(\d):(\d+)$/.exec(id);
 return m&&GEN[m[1]]?makeGen(m[1],+m[2],+m[3]):null;
};
const packStage=s=>({id:s.id,t:s.t,kind:s.kind,subj:s.subj,desc:s.desc,boss:!!s.boss,min:s.min,brk:s.brk||[],ids:s.items.map(i=>i.id)});
function unpackRoute(date,rt){
 const rec=peekDay(date);
 return rt.stg.map((p,i)=>{
  const items=p.ids.map(idToItem).filter(Boolean),res=rec.stg[p.id]||null;
  const s={id:p.id,t:p.t,kind:p.kind,subj:p.subj,desc:p.desc,boss:p.boss,min:p.min,brk:p.brk,items,n:i+1,res,xp:XPST[p.id]};
  s.auto=s.kind==='session'&&items.length===0;s.done=!!res||s.auto;return s;
 });
}
/* きょうのルート（日付ごとに固定して保存） */
function routeFor(date=today()){
 const tier=tierFor(date);
 if(!S.rt||S.rt.d!==date||S.rt.tier!==tier){S.rt={d:date,tier,stg:buildRoute(date,tier).map(packStage)};save()}
 return unpackRoute(date,S.rt);
}
/* あしたの予告（問題は作らず、題名だけ） */
function previewDay(date){
 const wd=dt(date).getDay(),cur=curOf(date);
 return{date,wd,t:WDP[wd].t,short:WDP[wd].short,subj:WDP[wd].subj,theme:GEN[cur.m[dn(date)%cur.m.length]].name,boss:!!WDP[wd].boss};
}
/* ドリル一覧からの自由練習 */
const todayIds=()=>{const s=new Set();if(S.rt&&S.rt.d===today())S.rt.stg.forEach(p=>p.ids.forEach(i=>s.add(i)));return s};
function drillItems(spec){
 const n=spec.n||10;
 if(spec.type==='gen'){const lv=spec.lv||genLv(spec.id);return Array.from({length:n},(_,i)=>makeGen(spec.id,lv,newSeed()+i))}
 if(spec.type==='due'){return uniq(dueItems(null,n))}
 if(spec.type==='tf'){
  /* ツッコミバトル：すでに見た問題の中から、4択で出せるものを集める */
  const ok=it=>{if(it.k==='gen')return !!it.ch;if(['listen','read','self','order','seq','verb','mist'].includes(it.k))return false;if(it.k==='word'&&boxOf(it)>=4)return false;if(it.k==='yomi'&&boxOf(it)>=3)return false;return true};
  let pool=seenItems(it=>ok(it)&&!!BK[it.bank]);
  if(pool.length<n)pool=pool.concat(shuffle(Object.values(ITEMS).filter(it=>BK[it.bank]&&ok(it)&&!pool.includes(it))).slice(0,n*2));
  return shuffle(pool).slice(0,n);
 }
 const b=spec.id,ex=spec.fresh?todayIds():new Set();
 if(b==='ER'||b==='JR'){const q=nextPassage(b,ex,today());return q.length?q:BK[b].items.slice(0,3)}
 let items=[];
 if(spec.mode==='weak')items=weakItems(n,it=>it.bank===b);
 else if(spec.mode==='new')items=newItems(b,n,{ex});
 else{items=dueItems(it=>it.bank===b,n);
  if(items.length<n)items=items.concat(newItems(b,n-items.length,{ex:exSet(ex,items)}));
  if(items.length<n)items=items.concat(shuffle(seenItems(it=>it.bank===b&&!items.includes(it))).slice(0,n-items.length))}
 if(items.length<n)items=items.concat(shuffle(BK[b].items.filter(it=>!items.includes(it))).slice(0,n-items.length));
 return uniq(items).slice(0,n);
}
