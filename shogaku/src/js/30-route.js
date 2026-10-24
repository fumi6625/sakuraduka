/* ===== 今日のルート：ロードマップ → 毎日の教材 =====
   その日の「曜日」「月のカリキュラム(CUR)」「これまでの成績(SRS)」「いまの段階(ならし/ふつう/しっかり)」から、
   暗記 → 算数 → 今日の教科 → ミス退治 → 宿題チェック → ふりかえり を、実際の問題つきで組み立てる。
   組み立てた結果は日付ごとに保存し、1日のあいだ中身が変わらないようにする。
   【考え方】勉強の習慣づくりの途中の子向け。最初は「3分」から。量は段階的に増やす。*/
const curOf=date=>{const k=date.slice(0,7);let c=CUR[0];for(const x of CUR)if(x.from<=k)c=x;return c};
const MEMB=['EW','EV','JK','JI','JS','SQ','OQ'];
const EW_OPEN3='2027-03-01',EW_OPEN4='2027-06-01';   // 群3（6年前半）・群4（6年後半）が開く日
const ewOpen=it=>+it.grp<=2||(+it.grp===3&&today()>=EW_OPEN3)||(+it.grp===4&&today()>=EW_OPEN4);
/* 新しい英単語を n 語えらぶ。群1（5年前半）・群2（5年後半）・群3（6年前半・2027-03〜）・群4（6年後半・2027-06〜）を、
   「まだ出ていない語の数」に比例した割合で並行して出す（開いたばかりの群がたくさん出て、どの群も卒業までに出きる。週に3日の子でも群3・4が届く。
   5年の2学期の子には、群2がいちばん「いま」の語。群1をやりきるまで待たない）。足りない群は、ほかの群でおぎなう。通し番号は日ごとにずらして、まんべんなく回す */
function ewNew(n,ex,date=today()){
 const out=[],open=[1,2,...(date>=EW_OPEN3?[3]:[]),...(date>=EW_OPEN4?[4]:[])],left={};
 open.forEach(g=>left[g]=0);
 for(const it of BK.EW.items)if(left[+it.grp]!==undefined&&!S.srs[it.id]&&!ex.has(it.id))left[+it.grp]++;
 for(let i=0;i<n;i++){
  const sx=exSet(ex,out),tot=open.reduce((a,g)=>a+left[g],0);let r=tot?(dn(date)*3+i)%tot:0,g=open[0];
  for(const x of open){if(r<left[x]){g=x;break}r-=left[x]}
  let a=newItems('EW',1,{pred:it=>+it.grp===g,ex:sx});
  if(!a.length)a=newItems('EW',1,{pred:ewOpen,ex:sx});
  if(!a.length)break;
  out.push(a[0]);if(left[+a[0].grp]>0)left[+a[0].grp]--;
 }
 return out;
}
const uniq=a=>{const s=new Set();return a.filter(x=>x&&!s.has(x.id)&&s.add(x.id))};
const seedOf=s=>(hashStr(s)%4e9)+1;
/* 生成問題：同じ日に、同じ文・同じ答えの問題は出さない（種を変えて引き直す。ex に「K:文」を記録する） */
const genKey=g=>'K:'+g.q+'|'+(g.accept||[]).join(',')+'|'+(g.ch?g.ch[0]:'');
function pickGen(id,date,salt,i,ex){
 const lv=genLv(id);
 for(let t=0;t<40;t++){
  const g=makeGen(id,lv,seedOf(date+salt+id+i+(t?'#'+t:''))),k=genKey(g);
  if(!ex||!ex.has(k)){if(ex)ex.add(k);return g}
 }
 return ex?null:makeGen(id,lv,seedOf(date+salt+id+i));   // 出しきった（これ以上ちがう問題が作れない）
}
/* 再戦に回ってきた生成問題も、同じ日に同じ内容が重ならないようにする */
/* 再戦：まちがえた自動生成の問題は、同じ型・同じレベルの「新しい数字」で出しなおす（答えの丸おぼえを防ぐ）。
   記録（箱・ミス回数）は元の問題のまま。保存してある問題の中身だけを入れかえる（その日のうちは同じ中身） */
function freshen(it){
 if(!it||it.k!=='gen'||!GEN[it.gid]||!S.gx[it.id]||it.fd===DN())return it;   // fd：中身を入れかえた日（1日1回だけ）
 const k0=genKey(it);
 for(let t=0;t<12;t++){
  const v=makeGen(it.gid,it.lv,seedOf('F'+DN()+it.id+t));
  if(genKey(v)===k0)continue;
  v.id=it.id;v.fd=DN();S.gx[it.id]=snap(v);ITEMS[it.id]=Object.assign({bank:'MG',k:'gen'},S.gx[it.id]);return ITEMS[it.id];
 }
 return it;
}
const claimGen=(items,ex)=>items.map(freshen).filter(i=>{if(i.k!=='gen')return true;const k=genKey(i);if(ex.has(k))return false;ex.add(k);return true});
const genOne=(id,n,date,salt,ex)=>Array.from({length:n},(_,i)=>pickGen(id,date,salt,i,ex)).filter(Boolean);
const genMix=(ids,n,date,salt,ex)=>Array.from({length:n},(_,i)=>pickGen(ids[(hashStr(date+salt)+i)%ids.length],date,salt,i,ex)).filter(Boolean);
const exSet=(ex,items)=>new Set([...ex,...items.map(i=>i.id)]);
const jn=a=>a.filter(Boolean).join('／');
/* 長文を出す順：短いもの2題につき、長いもの（ふつうの2倍以上、または800字以上の読解）を1題ずつ混ぜる。長いものが、データの最後に回って届かないのを防ぐ */
const PASS_ORD={};
function passOrder(bank){
 if(PASS_ORD[bank])return PASS_ORD[bank];
 const items=BK[bank].items,pids=[...new Set(items.map(i=>i.pid))],len={};
 items.forEach(i=>{if(!(i.pid in len))len[i.pid]=String(i.text||'').length});
 const med=pids.map(p=>len[p]).sort((a,b)=>a-b)[pids.length>>1]||0,th=Math.min(med*2,800),L=pids.filter(p=>len[p]>=th),Sh=pids.filter(p=>len[p]<th);
 if(!L.length||!Sh.length)return PASS_ORD[bank]=pids;
 const out=[];let a=0,b=0;
 while(a<Sh.length||b<L.length){for(let k=0;k<2&&a<Sh.length;k++)out.push(Sh[a++]);if(b<L.length)out.push(L[b++])}
 return PASS_ORD[bank]=out;
}
function nextPassage(bank,ex,date){
 const items=BK[bank].items,pids=passOrder(bank);
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
 1:{name:'ならし',k:.45,line:'1つクリアでクリアライン',note:'まずは短く。毎日つづけることが目標。'},
 2:{name:'ふつう',k:.7,line:'2ステージでクリアライン',note:'すこしずつ増やす時期。'},
 3:{name:'しっかり',k:1,line:'2ステージでクリアライン',note:'いつもの量。'}};
const EASY_M=['dec_mul','dec_div','frac_add','avg','area'];
function recentAcc(date){
 let n=0,c=0;for(let i=1;i<=7;i++){const d=S.days[addDays(date,-i)];if(d){n+=d.n||0;c+=d.c||0}}
 return{n,acc:n?c/n:1};
}
function okDays(date,from=1,to=7){let ok=0;for(let i=from;i<=to;i++)if((S.days[addDays(date,-i)]||{}).ok)ok++;return ok}
/* クリアラインをこえた日の数（これまで）。段階は、日にちではなく、この日数で進む */
function doneDays(date){let n=0;for(const d in S.days)if(d<date&&S.days[d].ok)n++;return n}
/* おやすみ明け：7日以上あいたあとは、量をもどして、すこしずつ戻す。n＝戻ってからやった日数、g＝あいた日数 */
function breakInfo(date){
 const days=Object.keys(S.days).filter(d=>d<date&&stageKeys(S.days[d]).length).sort();
 if(!days.length)return{n:99,g:0};
 if(diff(days[days.length-1],date)>=8)return{n:0,g:diff(days[days.length-1],date)};
 for(let i=days.length-1;i>0;i--)if(diff(days[i-1],days[i])>=8)return{n:days.length-i,g:diff(days[i-1],days[i])};
 return{n:99,g:0};
}
/* 段階と量を決める「やった日数」。ふだんはクリアラインをこえた日の数。7日以上休んだあとは、あいた日数に応じて少なめから始めて、1日ごとに3日ぶんずつ戻す */
function effD(date){
 const D=doneDays(date),b=breakInfo(date);
 return b.n>=99?D:Math.min(D,(b.g>=21?0:b.g>=14?7:14)+3*b.n);
}
const baseTier=date=>{const D=effD(date);return D<14?1:D<28?2:3};
/* 量は、やった日数に合わせて、段階の中でも少しずつ増える（ならし .40→.53／ふつう .55→.75／しっかり .8→1.0） */
/* 先週まではよくやっていたのに、この1週間にやすんだ（クリアラインの日が2日以下）ときは、段階はそのままで量だけ少なめにして、
   やった日ごとに戻す（0日.7／1日.85／2日.95）。段階をいきなり1つ下げたり上げたりしない（3日めに量が急にはね上がらない）。
   7日以上あいたあとは、別の仕組み（breakInfo／effD）で戻す */
function easeF(date){
 if(!S.start||breakInfo(date).n<99||diff(S.start,date)<7)return 1;
 const o=okDays(date);
 return o<=2&&okDays(date,8,14)>=4?[.7,.85,.95][o]:1;
}
const kOf=(date,tier)=>{
 if(S.tier&&S.tier!=='auto')return TIERS[tier].k;
 const D=effD(date),e=easeF(date);
 if(tier===1)return (.4+Math.min(13,D)*.01)*e;                              // ならし：.40 → .53
 if(tier===2)return (.55+Math.min(14,Math.max(0,D-14))*.014)*e;             // ふつう：.55 → .75
 return Math.min(1,.8+Math.max(0,D-28)*.005)*e;                             // しっかり：.8 → 1.0
};
/* 1日のマスト（その日の一本道で必ずやる分）の量のばいりつ。むかしの1.5倍。ただし、ならしの最初の2週間は、むかしの量から始めて、なめらかに1.5倍へ（急に増やさない）。
   おやすみの日（light）は増やさない。段階を手で決めているときは、ならし1.25／それ以外1.5 */
const MUL=1.5;
function mulOf(date,tier){
 if(S.light[date])return 1;
 if(S.tier&&S.tier!=='auto')return tier===1?1+(MUL-1)/2:MUL;
 return tier===1?1+(MUL-1)*Math.min(1,effD(date)/14):MUL;
}
function tierFor(date){
 if(S.light[date])return 1;
 if(S.tier&&S.tier!=='auto')return Math.max(1,Math.min(3,+S.tier));
 if(!S.start)S.start=date;
 return baseTier(date);   // やすんだ週の立て直しは、段階ではなく量（easeF）でやる。もともと週に2日の子は、もどさない
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
function trimItems(items,k,keep=[]){
 if(k>=1)return items;
 const reads=items.filter(i=>i.k==='read'),base=items.filter(i=>i.k!=='read'),n=Math.max(6,Math.round(base.length*k));
 const out=interleave(base).slice(0,n),ks=new Set(keep),miss=base.filter(i=>ks.has(i.id)&&!out.includes(i));
 for(const m of miss){let j=out.length-1;while(j>=0&&ks.has(out[j].id))j--;if(j<0)break;out.splice(j,1,m)}   // 新しい問題の下限ぶん（keep）は、うしろの問題とかえて残す
 return k>=.8?out.concat(reads):out;   // しっかり期に入ったら長文を戻す（ふつう期までは外す）
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
/* 「今日の教科」の決め方：ふつうは曜日どおり。やすんで、ある教科の日が1週間以上あいたら、その教科を先に回す
   （週に数日しかやらない子でも、全教科にふれるように）。教科ごとに「最後にやった日」から数える。曜日どおりの教科には3日ぶんの有利をつける */
function subTypeFor(date,wd){
 let best=wd,bs=-1;
 for(const t of [1,2,3,4,5,6,0]){const l=S.subLast[t],sc=(l?diff(l,date):99)+(t===wd?3:0);if(sc>bs){bs=sc;best=t}}
 return best;
}
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

/* 復習の対象になる教材（長文は、1題ずつ「今日の教科」で出すので、ここには入れない） */
const REVB=it=>!!BK[it.bank]&&it.bank!=='ER'&&it.bank!=='JR';
/* 古い問題（箱4以上＝おぼえた）の復習。いちばん長く出ていないものから、教科（国・数・英・理・社）を順番にまわして選ぶ。
   （前は箱の低い順に選んでいたので、箱5〜6は、期限が来てもほとんど出なかった） */
function oldDue(ex,limit,date,stale){
 const t=DN(),by={};
 for(const id in S.srs){const s=S.srs[id];if(s.b<4||s.d>t||ex.has(id))continue;const it=ITEMS[id];if(!it||!REVB(it)||it.k==='self')continue;(by[it.subj||'?']||(by[it.subj||'?']=[])).push([(t-s.d)/BOXD[s.b],it])}   // 間隔にくらべて、おくれが大きいものから（箱5〜6も、期限をすぎたら順に回ってくる）
 const keys=Object.keys(by).sort(),lists=keys.map(k=>by[k].sort((a,b)=>b[0]-a[0])),pos=keys.map(()=>0),out=[],n=keys.length;
 const stride=keys.map(k=>1/(OLDW[k]||1)),pass=keys.map((_,j)=>((j+dn(date))%Math.max(1,n))*.01);   // 教科ごとの重み（理・社は、おぼえる量が多いので多め）で、順番に回す
 while(out.length<limit){
  let b=-1;for(let j=0;j<n;j++)if(pos[j]<lists[j].length&&(b<0||pass[j]<pass[b]))b=j;
  if(b<0)break;
  out.push(lists[b][pos[b]++][1]);pass[b]+=stride[b];
 }
 return out;
}
const OLDW={'英':1,'国':1,'数':.6,'理':1.4,'社':1.4};
/* 暗記バトル：1回の長さは決まっている（ならし8問→ふつう13問→しっかり14〜18問）。
   まずは「まちがえたて・おくれの大きい復習」でうめ、のこりを新しい問題にする。新しい問題は、最低3問は入れて前に進む。
   復習がたまっているほど新しい問題は少なく、つまずいている週も新しい問題だけ減らす（長さは変えない）。
   古い問題（箱4以上＝おぼえた）の復習も、毎日かならず少し回す（新しい問題ばかり先に進んで、前にやった問題をわすれないように）。
   6年のおわりの3か月（12月〜）は、新しい問題を少なめにして、古い問題のふくしゅうを6〜8割まで厚くする（全教科を、まんべんなく） */
function bMem(date,tier,cur,ex){
 const kk=kOf(date,tier),th=throttle(date),M=mulOf(date,tier);
 const late=date>='2028-01-15'?2:date>='2027-12-01'?1:0;
 const total=tier>=3?Math.round((14+22*Math.max(0,kk-.8)/.2)*M):Math.max(6,Math.round(18*kk*M)),minNew=[3,2,1][late],slots=total-minNew;   // しっかり期は、1問ずつが短い暗記バトルを、21問から54問まで少しずつ長くする（むかしの1.5倍）
 const old1=oldDue(ex,Math.min(slots,Math.round(slots*[.17,.6,.8][late])),date,late>0),x1=exSet(ex,old1);
 const young=dueItems(it=>REVB(it)&&!x1.has(it.id)&&boxOf(it)<=3,slots-old1.length);
 const old2=oldDue(exSet(x1,young),slots-old1.length-young.length,date,late>0);   // わかい復習が足りない日は、古い復習でうめる
 const due=[...young,...old1,...old2];
 const newN=Math.max(minNew,Math.round((total-due.length)*th));
 const PAT=tier>=2?['EW','SQ','EW','OQ','JG','EW','OQ','JK','SQ','EW','JI','OQ','EW','JG','SQ','EW','JK','EW','JI','JS']:effD(date)>=7?['EW','JK','EW','SQ','JK','OQ','EW']:['EW','JK','EW','EW','JK'];   // 新しい問題の配分（20回で：英単語7・社会3・理科3・国語の文法2・漢字2・ことわざ2・類義語1）。日ごとに先頭をずらして、まんべんなく回す
 const cnt={EW:0,JK:0,SQ:0,OQ:0,JG:0,JI:0,JS:0};for(let j=0;j<newN;j++)cnt[PAT[(dn(date)*3+j)%PAT.length]]++;
 const sx=exSet(ex,due);
 const ews=ewNew(cnt.EW,sx,date),jks=newItems('JK',cnt.JK,{prefs:cur.jk,ex:sx});
 const sqs=cnt.SQ?newItems('SQ',cnt.SQ,{prefs:cur.sc,ex:sx}):[],oqs=cnt.OQ?newItems('OQ',cnt.OQ,{prefs:cur.so,ex:sx}):[];
 const jgs=cnt.JG?newItems('JG',cnt.JG,{ex:sx}):[],jis=cnt.JI?newItems('JI',cnt.JI,{ex:sx}):[],jss=cnt.JS?newItems('JS',cnt.JS,{ex:sx}):[];
 /* 新しい漢字（読み・書き）は、ならし期がおわったら毎日かならず入れる（復習がたまっても、漢字だけが出ないまま卒業しないように。読み1〜2・書き0〜1 ＝ 1日に平均2問ほど） */
 const kq=tier>=2?[1+(dn(date)%3===0?1:0),dn(date)%3===1?0:1]:[0,0],kx=exSet(sx,[...ews,...jks,...sqs,...oqs,...jgs,...jis,...jss]);
 const kjk=kq[0]?newItems('JK',kq[0],{prefs:cur.jk,ex:kx}):[],kjw=kq[1]?newItems('JW',kq[1],{ex:exSet(kx,kjk)}):[];
 const kew=tier>=2?ewNew(1+(dn(date)%3===0?1:0),exSet(kx,[...kjk,...kjw]),date):[];   // 英単語も、毎日かならず新しい語を1〜2つ足す（週に3日の子でも、6年の語（群3・4）まで届くように）
 const fresh=[...ews,...jks,...kjk,...kjw,...kew,...sqs,...oqs,...jgs,...jis,...jss],lack=newN-(fresh.length-kjk.length-kjw.length-kew.length);
 if(lack>0)fresh.push(...ewNew(lack,exSet(sx,fresh),date));   // 出しきった教材の分は、英単語でおぎなう
 let items=interleave([...due,...fresh]);
 const minN=Math.round((tier===1?6:10)*M);
 if(items.length<minN)items=items.concat(shuffle(seenItems(it=>MEMB.includes(it.bank)&&!items.includes(it)&&!ex.has(it.id)),mulberry(seedOf(date))).slice(0,minN-items.length));
 if(items.length<minN)items=items.concat(shuffle(BK.EW.items.filter(it=>ewOpen(it)&&!items.includes(it)&&!ex.has(it.id)),mulberry(seedOf(date+'x'))).slice(0,minN-items.length));
 const nw=k=>fresh.filter(i=>i.bank===k).length;
 return{t:'暗記バトル',subj:'総',items,desc:jn([due.length&&'ふくしゅう'+due.length+'問',nw('EW')&&'英単語 新'+nw('EW'),(nw('JK')+nw('JW'))&&'漢字 新'+(nw('JK')+nw('JW')),(nw('SQ')+nw('OQ'))&&'理社 新'+(nw('SQ')+nw('OQ')),(nw('JG')+nw('JI')+nw('JS'))&&'国語 新'+(nw('JG')+nw('JI')+nw('JS'))])||'まとめふくしゅう'};
}
/* 直近14日の算数ドリルの正答率（30問に満たないときは null） */
function mathAcc(date){
 let n=0,c=0;for(let i=1;i<=14;i++){const m=((S.days[addDays(date,-i)]||{}).stg||{}).math;if(m){n+=m.n||0;c+=m.ok||0}}
 return n>=30?c/n:null;
}
function bMath(date,tier,cur,ex){
 const late=date>='2028-01-15'?2:date>='2027-12-01'?1:0,M=mulOf(date,tier),k=kOf(date,tier)*throttle(date)*[1,.75,.6][late]*M,r=(n,m)=>Math.max(Math.round(m*M),Math.round(n*k));   // 6年のおわりの3か月は、算数の計算ドリルをへらして、そのぶん暗記・ふくしゅうの教科にまわす
 const ma=mathAcc(date),full=tier===1||dn(date)%2===0||(ma!=null&&ma<.75);   // ふつう以上は、算数を1日おきにしっかり。ほかの日はかるめ（計算の感覚をたもつ）。ただし、直近の算数の正答率が75%を切っているあいだは、毎日しっかり
 const pool=tier===1?EASY_M:cur.m,main=pool[dn(date)%pool.length],nMain=full?r(tier===1?8:6,3):r(4,3),nWarm=full?r(3,2):r(2,2),kk3=kOf(date,tier),nApp=full&&tier>=3&&kk3>=.9?1:0;   // 応用・考え方・再戦は、しっかり期のなかほど（少し慣れてから）で入れる
 const mis=full&&tier>=3&&kk3>=.9?claimGen(dueItems(it=>it.subj==='数'&&!ex.has(it.id),6),ex).slice(0,2):[];
 const items=[...genMix(tier===1?EASY_M:cur.rv,nWarm,date,'warm',ex),...genOne(main,nMain,date,'main',ex),...(nApp?genMix(cur.w,nApp,date,'app',ex):[])];
 const want=nWarm+nMain+nApp;
 if(items.length<want)items.push(...genMix(tier===1?EASY_M:[...cur.rv,...cur.m],want-items.length,date,'fill',ex));   // ひとつのテーマで、ちがう問題を作りきれないときは、ほかのテーマで補う
 const mq=full&&tier>=2?newItems('MQ',1,{ex}):[],ms=full&&tier>=3&&kk3>=.85?newItems('MS',1,{ex:exSet(ex,mq)}):[];
 const warm=items.slice(0,nWarm),core=items.slice(nWarm,nWarm+nMain),tail=items.slice(nWarm+nMain);
 return{t:'算数ドリル',subj:'数',items:[...warm,...mq,...ms,...core,...tail,...mis],desc:jn(['テーマ「'+GEN[main].name+'」'+nMain+'問（Lv.'+genLv(main)+'）','ウォームアップ'+nWarm+'問',nApp&&'応用'+nApp+'問',(mq.length+ms.length+mis.length)&&'考え方・再戦'+(mq.length+ms.length+mis.length)+'問'])};
}
const misDesc=(n,pre)=>n?(pre?'再戦の予定はなし。苦手を先取りで'+n+'体':'まちがえた問題の再戦 '+n+'体'):'まだミスがありません（まちがえた問題は、ここに集まります）';
function bMis(date,tier,ex){
 const M=mulOf(date,tier),n=Math.max(Math.round(4*M),Math.round(8*kOf(date,tier)*M)),gmax=Math.max(2,Math.round(3*kOf(date,tier)*M));   // 計算の再戦は3体まで（算数ドリルと合わせて、算数ばかりにならないように）。のこりは暗記・読解のミス
 let g=0,items=claimGen(dueItems(it=>{const s=S.srs[it.id];return s&&s.w>0&&!ex.has(it.id)},n*4),ex).filter(it=>it.k!=='gen'||++g<=gmax).slice(0,n),pre=false;
 if(!items.length){items=claimGen(weakItems(Math.min(6,n)*2,it=>!ex.has(it.id)),ex).slice(0,Math.min(6,n));pre=items.length>0}
 return{t:'ミス退治',subj:'総',items,pre,desc:misDesc(items.length,pre)};
}
function bBoss(date,cur,ex){
 const items=[...pickSeenOrNew(['JW','JG','JI','JK','JS'],2,ex,date),...genMix(cur.m,2,date,'boss',ex),...pickSeenOrNew(['EG','EW','EV'],2,ex,date),...pickSeenOrNew(['SQ'],2,ex,date),...pickSeenOrNew(['OQ'],2,ex,date)];
 return{t:WDP[0].t,subj:'総',boss:true,items,desc:'国2・数2・英2・理2・社2。8問以上でクリア！これまでの苦手が出やすい'};
}
function bWeak(date,cur,ex,M=1){
 const weak=claimGen(weakItems(Math.round(20*M),it=>!ex.has(it.id)),ex).slice(0,Math.round(14*M));let worst=null,wr=2;
 for(const id in S.gs){const g=S.gs[id];if(g.n>=4&&GEN[id]&&GEN[id].subj==='数'){const r=g.ok/g.n;if(r<wr){wr=r;worst=id}}}
 const gid=worst||cur.m[0];
 return{items:[...weak,...genOne(gid,Math.round(6*M),date,'weak',ex)],desc:jn([weak.length&&'まちがえた問題 '+weak.length+'問','計算「'+GEN[gid].name+'」'+Math.round(6*M)+'問'])};
}
function bSub(date,wd0,cur,ex,tier){
 const wd=tier>=2?subTypeFor(date,wd0):wd0;   // この先の wd は「今日の教科の種類」（0ボス・1英・2国・3理・4社・5英2・6弱点）
 let items,p,keep=[];const t=WDP[wd].t,subj=WDP[wd].subj;
 /* 復習がたまっているときだけ、新しい問題をへらす。たまり＝復習される教材の、まだ若い（箱0〜3）期限切れ。
    教科（教材）ごとに数えるので、たまっていない教科は減らさない。その日の主役の教科は、下限まで必ず新しい問題を入れる */
 const M=mulOf(date,tier),m=n=>Math.round(n*M),th=throttle(date),all=dueCount(true,REVB),gb=all>260?.6:all>160?.8:1;
 const nn=(b,n,min=1)=>{const y=dueCount(true,it=>it.bank===b);return Math.max(m(min),Math.round(n*M*(y>60?.4:y>30?.7:1)*gb*th))};
 if(wd===1){
  const g=newItems('EG',nn('EG',6,3),{prefs:cur.g,ex}),sx=exSet(ex,g),dg=dueItems(it=>it.bank==='EG'&&!sx.has(it.id),m(6));
  const ev=[...dueItems(it=>it.bank==='EV'&&!sx.has(it.id),m(2)),...newItems('EV',nn('EV',2),{ex:sx})];
  const eo=[...dueItems(it=>it.bank==='EO'&&!sx.has(it.id),m(3)),...newItems('EO',nn('EO',4),{ex:sx})].slice(0,m(4)),er=nextPassage('ER',sx,date);
  const ewm=ewNew(nn('EW',3,2),exSet(sx,[...ev,...eo]),date);
  keep=g.slice(0,3);
  items=[...dg,...g,...ewm,...ev,...eo,...er];p=[(dg.length+g.length)&&'文法'+(dg.length+g.length)+'問',ewm.length&&'新しい単語'+ewm.length,ev.length&&'不規則動詞'+ev.length,eo.length&&'並べかえ'+eo.length,er.length&&'長文1題']}
 else if(wd===2){
  const w=newItems('JW',nn('JW',5,3),{ex}),sx=exSet(ex,w),dw=dueItems(it=>['JW','JG','JI','JS','JC'].includes(it.bank)&&!sx.has(it.id),m(6));
  const gg=newItems('JG',nn('JG',7,4),{ex:sx}),ji=newItems('JI',nn('JI',4,2),{ex:exSet(sx,gg)}),js=newItems('JS',nn('JS',3),{ex:exSet(sx,[...gg,...ji])}),jr=nextPassage('JR',sx,date);
  const jc=tier>=3?newItems('JC',1,{ex:exSet(sx,[...gg,...ji,...js])}):[],jk=newItems('JK',nn('JK',3,2),{prefs:cur.jk,ex:exSet(sx,[...gg,...ji,...js])});
  keep=w.slice(0,2);
  items=[...dw,...gg,...ji,...js,...w,...jk,...jr,...jc];p=[(dw.length+w.length+jk.length)&&'漢字・語句'+(dw.length+w.length+jk.length)+'問',gg.length&&'文法・古文'+gg.length,(ji.length+js.length)&&'慣用句・類義対義'+(ji.length+js.length),jr.length&&'読解1題',jc.length&&'作文1']}
 else if(wd===3){
  const q=newItems('SQ',nn('SQ',8,5),{prefs:cur.sc,ex}),sx=exSet(ex,q),dq=dueItems(it=>it.bank==='SQ'&&!sx.has(it.id),m(6)),calc=genMix(cur.s,m(4),date,'sci',ex);
  items=[...dq,...q,...calc];p=[(dq.length+q.length)&&'一問一答'+(dq.length+q.length)+'問',calc.length&&'計算'+calc.length+'問']}
 else if(wd===4){
  const q=newItems('OQ',nn('OQ',10,6),{prefs:cur.so,ex}),sx=exSet(ex,q),dq=dueItems(it=>it.bank==='OQ'&&!sx.has(it.id),m(6));
  const ot=[...dueItems(it=>it.bank==='OT'&&!sx.has(it.id),1),...newItems('OT',nn('OT',2),{ex:sx})].slice(0,2);
  items=[...dq,...q,...ot];p=[(dq.length+q.length)&&'一問一答'+(dq.length+q.length)+'問',ot.length&&'年代ならべかえ'+ot.length]}
 else if(wd===5){
  const el=[...dueItems(it=>it.bank==='EL'&&!ex.has(it.id),m(3)),...newItems('EL',nn('EL',5),{ex})].slice(0,m(7)),sx=exSet(ex,el);
  const eo=newItems('EO',nn('EO',4),{ex:sx}),ec=newItems('EC',1,{ex:sx}),ewn=ewNew(nn('EW',4,2),sx,date),ew=dueItems(it=>it.bank==='EW'&&boxOf(it)>=3&&!sx.has(it.id),m(5)),ev=[...dueItems(it=>it.bank==='EV'&&!sx.has(it.id),m(2)),...newItems('EV',nn('EV',2),{ex:sx})];
  keep=ec;
  items=[...el,...ew,...ewn,...ev,...eo,...ec];p=[el.length&&'リスニング'+el.length,(ew.length+ewn.length)&&'単語'+(ew.length+ewn.length),eo.length&&'並べかえ'+eo.length,ec.length&&'英作文1']}
 else if(wd===6){const b=bWeak(date,cur,ex,M);items=b.items;p=[b.desc]}
 else{return Object.assign(bBoss(date,cur,ex),{ty:0,short:WDP[0].short})}
 const k=kOf(date,tier),ty=wd,short=WDP[wd].short;
 const kp=keep.map(i=>i.id);
 if(k<1){items=trimItems(items,k,kp);return{t,subj,items,ty,short,keep:kp,desc:descOf(items)||'今日の教科'}}
 return{t,subj,items,ty,short,keep:kp,desc:jn(p)||'今日の教科'};
}
const XPST={hw:10,mem:20,math:30,sub:30,mis:15,ref:5,diag:0};
const STAGE_IC={hw:'book',mem:'brain',math:'calc',sub:'star',mis:'splat',ref:'pen',diag:'chart'};
/* ミニ診断：3日目から、受けていない教科を1日1教科ずつ（6問・約3分）。いまの実力を知るため */
const diagNext=date=>doneDays(date)>=2?SJL.find(s=>!(S.diag[s]&&S.diag[s].done)):null;
/* 1日の上限（見積りの分）。ならし15／ふつう30／しっかり45。超えた日は、暗記バトルは残して、算数→今日の教科→ミス退治の後ろの問題から外す（長文は外さない） */
const CAPMIN={1:15,2:30,3:45};
function capDay(out,tier){
 const cap=CAPMIN[tier]||36,sess=out.filter(s=>s.kind==='session'),fixed=out.filter(s=>s.kind!=='session').reduce((t,s)=>t+(s.min||0),0);
 const total=()=>sess.reduce((t,s)=>t+s.min,0)+fixed;
 for(const [id,floor] of [['math',14],['sub',12],['mis',6]]){
  const st=sess.find(s=>s.id===id);if(!st)continue;
  let cut=false;
  const keep=new Set(st.keep||[]);   // その日の主役の教科の「新しい問題」の下限ぶんは、上限をこえても外さない（復習ばかりで新しい問題がゼロにならないように）
  while(total()>cap&&st.items.length>floor){
   let j=st.items.length-1;while(j>=0&&(st.items[j].k==='read'||keep.has(st.items[j].id)))j--;
   if(j<0)break;
   st.items.splice(j,1);st.min=estMin(st.items);cut=true;
  }
  if(cut){st.brk=breakdown(st.items);st.desc=id==='mis'?misDesc(st.items.length,st.pre):(descOf(st.items)||st.desc)}
 }
 return out;
}
/* 毎日、理科か社会の問題を、最低1問は出す（国・数・英にかたよらないように）。ほかの教材でぜんぜん出ない日は、暗記バトルに1問足す。
   理科と社会は、日がわりで交互に。足す問題は、復習の期限がきたもの → あたらしい問題 → 見たことのある問題 の順 */
function ensureRS(out,date,cur,ex){
 if(out.some(s=>s.items.some(it=>it.subj==='理'||it.subj==='社')))return;
 const mem=out.find(s=>s.id==='mem');if(!mem)return;
 let it=null;
 for(const b of dn(date)%2?['SQ','OQ']:['OQ','SQ']){
  it=dueItems(x=>x.bank===b&&!ex.has(x.id),1)[0]||newItems(b,1,{prefs:b==='SQ'?cur.sc:cur.so,ex})[0]||shuffle(seenItems(x=>x.bank===b&&!ex.has(x.id)),mulberry(seedOf(date+b)))[0];
  if(it)break;
 }
 if(!it)return;
 mem.items.splice(Math.min(2,mem.items.length),0,it);ex.add(it.id);
 mem.min=estMin(mem.items);mem.brk=breakdown(mem.items);mem.desc=jn([mem.desc,(it.bank==='SQ'?'理科':'社会')+'1問']);
}
/* その日のルートを新しく組み立てる（保存はしない）。順番：暗記（かんたんな勝ち）→ 算数 → 今日の教科 → ミス退治 → 宿題チェック → ふりかえり */
function buildRoute(date,tier){
 const wd=dt(date).getDay(),cur=curOf(date),ex=new Set(),out=[];
 const add=(id,b)=>{b.items=uniq(b.items);b.items.forEach(i=>ex.add(i.id));out.push(Object.assign({id,kind:'session',min:estMin(b.items),brk:breakdown(b.items)},b))};
 add('mem',bMem(date,tier,cur,ex));
 add('math',bMath(date,tier,cur,ex));
 if(tier>=2)add('sub',bSub(date,wd,cur,ex,tier));   // 今日の教科（週ボスをふくむ）は、ならし期が終わってから
 if(tier>=2&&(tier>=3||effD(date)>=17))add('mis',bMis(date,tier,ex));   // ミス退治は、ふつう期に入って3日してから（今日の教科とミス退治がいっぺんに出て、量が急にふえないように）
 const dg=tier<=2?diagNext(date):null;
 if(dg)out.push({id:'diag',t:'ミニ診断：'+SJN[dg],kind:'check',subj:dg,min:3,items:[],desc:'いまの実力を知る。6問・約3分。点数が低くても大丈夫。（+10XP）'});
 out.push({id:'hw',t:'宿題・提出物',kind:'check',subj:'総',min:0,items:[],desc:'学校の宿題と提出物をおわらせる。'+(S.pinOn&&S.pin?'おうちの人のOKが必要です。':'')});
 out.push({id:'ref',t:'ふりかえり',kind:'reflect',subj:'総',min:2,items:[],desc:'今日の自分に点数をつけて、データと くらべてみよう。'});
 ensureRS(out,date,cur,ex);
 return capDay(out,tier);
}
/* 保存形式 ↔ 実体 */
const idToItem=id=>{
 if(ITEMS[id])return ITEMS[id];
 const m=/^G:([a-z0-9_]+):(\d):(\d+)$/.exec(id);
 return m&&GEN[m[1]]?makeGen(m[1],+m[2],+m[3]):null;
};
const packStage=s=>({id:s.id,t:s.t,kind:s.kind,subj:s.subj,desc:s.desc,boss:!!s.boss,min:s.min,brk:s.brk||[],ty:s.ty,short:s.short,ids:s.items.map(i=>i.id)});
function unpackRoute(date,rt){
 const rec=peekDay(date);
 return rt.stg.map((p,i)=>{
  const items=p.ids.map(idToItem).filter(Boolean),res=rec.stg[p.id]||null;
  const s={id:p.id,t:p.t,kind:p.kind,subj:p.subj,desc:p.desc,boss:p.boss,min:p.min,brk:p.brk,ty:p.ty,short:p.short,items,n:i+1,res,xp:XPST[p.id]};
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
 const wd0=dt(date).getDay(),cur=curOf(date),wd=doneDays(date)>=14?subTypeFor(date,wd0):wd0;
 return{date,wd,t:WDP[wd].t,short:WDP[wd].short,subj:WDP[wd].subj,theme:GEN[cur.m[dn(date)%cur.m.length]].name,boss:!!WDP[wd].boss};
}
/* ドリル一覧からの自由練習 */
const todayIds=()=>{const s=new Set();if(S.rt&&S.rt.d===today())S.rt.stg.forEach(p=>p.ids.forEach(i=>s.add(i)));return s};
function drillItems(spec){
 const n=spec.n||10;
 if(spec.type==='gen'){const lv=spec.lv||genLv(spec.id);return Array.from({length:n},(_,i)=>makeGen(spec.id,lv,newSeed()+i))}
 if(spec.type==='due'){return uniq(dueItems(null,n).map(freshen))}
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
