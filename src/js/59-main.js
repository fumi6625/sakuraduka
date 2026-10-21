/* ===== 起動・画面切りかえ・ボタンの動き ===== */
const VIEWS=['home','drill','map','reward','menu'];
const RENDER={home:renderHome,drill:renderDrill,map:renderMap,reward:renderReward,menu:renderMenu};
let tab='home';
function dockBadges(){
 const left=flowState().steps,due=sum(Object.values(dueByBank()));   // ホーム：一本道にのこっている数（れんらくをふくむ）
 const set=(id,n)=>{const e=$('#nb-'+id);if(!e)return;e.hidden=!n;e.textContent=n>99?'99+':n};
 set('home',left);set('drill',due);
}
function refresh(){
 autoGoals();renderHud();RENDER[tab]();dockBadges();
}
/* 記録から決まる目標は、達成したら自動でつく */
function autoGoals(){
 const rs=syncAutoGoals();if(!rs.length)return;
 rs.forEach((r,j)=>setTimeout(()=>{toast('マイルストーン達成 +'+r.xp+'XP（記録から自動）');Snd.ok()},400+j*2400));
 if(rs.some(r=>r.lv))setTimeout(()=>levelUp(rs.find(r=>r.lv).lv.to),1500);
 save();
}
function show(id){
 if(!RENDER[id])id='home';
 if(PG){PG='';$$('.pg').forEach(p=>p.hidden=true);document.body.style.overflow=PL?'hidden':''}
 tab=id;S.tab=id;
 VIEWS.forEach(v=>{$('#v-'+v).hidden=v!==id});
 $$('#dock button').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.tab===id)));
 refresh();scrollTo(0,0);save();
}
/* 1つのステージが終わったあとの共通の見せ方（宿題・ふりかえり・目標など、問題のないもの） */
function afterSimple(res,msg){
 const nb=checkBadges();save();
 const q=[];if(msg)q.push(msg);
 if(res&&res.streak)q.push('れんぞく '+S.streak+'日！'+(res.streak.bonus?' ボーナス +'+res.streak.bonus+'XP':''));
 if(res&&res.full){q.push('ぜんぶクリア！ボーナス +20XP');FX.confetti(120);Snd.clear()}
 nb.forEach(b=>q.push('バッジ獲得：'+b[1]));
 q.forEach((m,i)=>setTimeout(()=>toast(m),i*2300));
 if(res&&res.lv)setTimeout(()=>levelUp(res.lv.to),600);
 refresh();
}
/* 保護者OKがオンのとき、暗証番号がいる操作（目標・宿題・設定の変更など）。合っていたら fn を実行する */
let PIN_NEXT=null;
function needPin(msg,fn){
 if(!(S.pinOn&&S.pin)){fn();return}
 PIN_NEXT=fn;
 openSheet(`<h2>おうちの人のOK</h2><p>${esc(msg)}</p><div class="pinbox"><input id="gpIn" type="password" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="● ● ● ●" aria-label="暗証番号"></div><div class="row" style="justify-content:center"><button class="bt pri xl" data-act="pinGo">OKをもらった</button></div>`);
}
const ACT={
 /* ---- ステージ ---- */
 stageGo(id){const s=routeFor().find(x=>x.id===id);if(s)startStage(s)},
 /* ---- 一本道：つぎへ ---- */
 flowGo(){
  flowCdStop();closeOv();closeSheet();
  if(PG)closePage();
  if(PL)plClose();
  if(tab!=='home')show('home');   // 一本道の足場は、ホーム
  const F=flowState();
  if(F.target){startStage(F.target);return}
 },
 autoToggle(){const set=()=>{S.flowAuto=S.flowAuto?0:1;save();initInputs();toast(S.flowAuto?'つぎへ 自動でつなぐ：オン':'つぎへ 自動でつなぐ：オフ（ボタンで すすむ）')};if(S.flowAuto)needPin('「つぎへ 自動でつなぐ」を オフにします。',set);else set()},
 hwLen(m){hwLenM=+m;$$('#hwLen button').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.a===hwLenM)));hwTick(true)},
 hwGo(){
  const btn=$('#hwBtn');
  if(hwTimer){clearInterval(hwTimer.iv);hwTimer=null;hwTick(true);btn.textContent='タイマー スタート';return}
  Snd.unlock();hwTimer={end:Date.now()+hwLenM*60000,t0:Date.now()};hwTimer.iv=setInterval(()=>hwTick(),500);btn.textContent='ストップ';hwTick();
 },
 hwDone(){
  if(S.pinOn&&S.pin){const r=pinTry(($('#pinIn')||{}).value||'');save();if(r==='lock'){toast('まちがいが つづいたので、'+pinLockMin()+'分ほど あとで もう一度');return}if(r!=='ok'){toast('暗証番号がちがうよ。おうちの人に見せてね');return}}
  const st=routeFor().find(x=>x.id==='hw');let used=0;
  if(hwTimer){used=Math.round((Date.now()-hwTimer.t0)/60000);clearInterval(hwTimer.iv);hwTimer=null}
  const res=completeStage(today(),'hw',{n:0,min:used>0?used:st.min});
  closeSheet();FX.confetti(50);Snd.ok();afterSimple(res,res.first?(res.held?'宿題クリア！ XPは、ドリルで4割以上とれたら入るよ':'宿題クリア！ +'+res.xp+'XP'):'');
  flowBridge('hw');
 },
 refStar(i){
  if(refSelf)return;   // 自分の点は、さいしょの星で決まり（データの点を見てから、つけなおせないように）
  refSelf=+i;$$('#refStars button').forEach(b=>{b.setAttribute('aria-pressed',String(+b.dataset.a<=refSelf));b.disabled=true});
  const data=dayScore(),c=calibNote(refSelf,data);
  $('#refCmp').innerHTML=`<div class="cbx ${c.k}"><div class="cs"><span>自分</span><b>${refSelf}</b></div><div class="cs"><span>データ</span><b>${data}</b></div><p>${esc(c.t)}</p></div>`;
  $('#refGo').disabled=false;Snd.tap();
 },
 refDone(){
  if(!refSelf){toast('まず 星で点数をつけてね');return}
  const t=($('#refIn').value||'').trim()||'（ひとこと なし）',data=dayScore(),c=calibNote(refSelf,data);
  S.refl[today()]={t,s:refSelf,d:data};
  const res=completeStage(today(),'ref',{n:0,note:t,min:2});
  let bonus=null;if(res.first&&Math.abs(refSelf-data)<=1){bonus=addXP(5);res.xp+=5}
  closeSheet();FX.confetti(40);Snd.ok();
  afterSimple(res,res.first?(bonus?'ふりかえり完了！ めききボーナス +5XP':res.held?'ふりかえり完了！ XPは、ドリルで4割以上とれたら入るよ':'ふりかえり完了 +'+res.xp+'XP'):'');
  if(bonus&&!res.lv)setTimeout(()=>levelUp(bonus.to),700);
  flowBridge('ref');
 },
 tsukkomi(){
  const items=drillItems({type:'tf',n:10});
  if(items.length<4){toast('まだ見た問題が少ないよ。まず「暗記バトル」をやってからね');return}
  startSession({title:'ツッコミバトル',subj:'総',items,tf:true,desc:'ライバルが答えた。合ってる？ まちがってる？　見ぬけたら勝ち！',brk:[{name:'ライバルの答えチェック',n:items.length,nw:0}],min:Math.ceil(items.length*.3),xp:0});
 },
 plTF(v){answerQ(v==='1')},
 vow(){
  const at=S.at||'';
  openSheet(`<h2>やる時間を決めよう</h2><p class="mini">「何時に始めるか」を先に決めておくと、始めやすい。時間がきても通知は出ないので、ホームを開いたときに思い出せるよ。</p><div class="seg">${['16:00','17:00','18:00','19:00','20:00','21:00'].map(t=>`<button data-act="vowSet" data-a="${t}" aria-pressed="${at===t}">${t}</button>`).join('')}<button data-act="vowSet" data-a="none" aria-pressed="${!at}">きめない</button></div>`);
 },
 vowSet(t){S.at=t==='none'?'':t;save();closeSheet();renderHome();toast(S.at?'やくそく：'+S.at+' にスタート！':'やくそくを消した')},
 light(){const d=today(),set=()=>{S.light[d]=1;save();refresh();toast('いそがしい日モード：量をへらしたよ')};if(S.light[d]){delete S.light[d];save();refresh();toast('ふつうのルートにもどしたよ')}else if(!canLight(d))toast('ミニの日は 週2回まで。おうちの人と暗証番号を決めると、相談して使えるよ');else needPin('きょうを「ミニの日」にします（量をへらす）。',set)},
 nickSet(){const v=($('#nickIn').value||'').trim().slice(0,12);if(!v){toast('なまえを入れてね');return}S.nick=v;save();toast(v+'、よろしく！');FX.confetti(50);refresh()},
 /* ---- プレイヤー ---- */
 plGo(){plGo()},plQuit(){plQuit()},plClose(){closeOv();plClose()},plNext(){plNext()},
 plPick(i){answerQ(+i)},
 plKey(c){
  if(!PL||PL.phase!=='q')return;
  if(c==='⌫')PL.val=PL.val.slice(0,-1);else if(c==='C')PL.val='';else if(PL.val.length<24)PL.val+=c;
  const e=$('#lcdV');if(e)e.textContent=PL.val;Snd.tap();
 },
 plLet(c){
  if(!PL||PL.phase!=='q')return;
  const i=$('#tyIn');if(!i)return;
  if(c==='⌫')i.value=i.value.slice(0,-1);else if(i.value.length<24)i.value+=c;
  Snd.tap();
 },
 plNum(){if(PL&&PL.phase==='q'&&PL.val)answerQ(PL.val)},
 plTyp(){const i=$('#tyIn');if(PL&&PL.phase==='q'&&i&&i.value.trim())answerQ(i.value)},
 plHint(){const V=PL&&PL.V;if(!V||V.kind!=='typ')return;$('#hintT').textContent=V.len?'ヒント：「'+V.first+'」からはじまる '+V.len+'文字':'ひらがなで入力してね'},
 plSkip(){if(PL&&PL.phase==='q')answerQ(PL.V.kind==='order'?[]:'')},
 plTk(i){
  if(!PL||PL.phase!=='q')return;i=+i;const k=PL.chips.indexOf(i);
  if(k>=0)PL.chips.splice(k,1);else PL.chips.push(i);
  Snd.tap();drawOrder();
 },
 plReset(){if(PL&&PL.phase==='q'){PL.chips=[];drawOrder()}},
 plOrder(){if(PL&&PL.phase==='q'&&PL.chips.length===PL.V.tokens.length)answerQ(plRespOf())},
 plShow(){
  if(!PL||PL.phase!=='q')return;const V=PL.V,a=$('#selfAns');
  a.hidden=false;a.innerHTML=`<div class="rv">${esc(V.reveal||'（自分の言葉で言えたかな？）').replace(/\n/g,'<br>')}</div>${V.exp?`<div class="fbx">${esc(V.exp).replace(/\n/g,'<br>')}</div>`:''}<p class="mini">人の答案を採点するつもりで、<b>きびしめ</b>にチェックしよう。</p>`;
  $('#selfRow').innerHTML='<button class="bt ng xl" data-act="plSelf" data-a="0">ちがうところがあった</button><button class="bt pri xl" data-act="plSelf" data-a="1">ぜんぶ合ってた</button>';
 },
 plSelf(v){answerQ(v==='1')},
 plSay(){if(PL&&PL.V)Tts.say(PL.V.audio||PL.V.say)},
 plHome(){plClose();show('home');setTimeout(()=>{const n=$('.nowc');if(n)n.scrollIntoView({behavior:'smooth',block:'center'})},150)},
 ovClose(){closeOv()},sheetClose(){closeSheet()},back(){closePage()},
 /* ---- マイルストーン ---- */
 goal(a){
  const [k,i]=a.split('|');
  if(isAutoGoal(k,+i)){toast('この目標は、記録から自動で達成になります');return}
  if(S.ms[gid(k,+i)])ACT.goalDo(a);
  else needPin('この目標は、おうちの人が確かめてから つけよう。',()=>ACT.goalDo(a));
 },
 pinGo(){
  const r=pinTry(($('#gpIn')||{}).value||'');save();
  if(r==='lock'){toast('まちがいが つづいたので、'+pinLockMin()+'分ほど あとで もう一度');return}
  if(r!=='ok'){toast('暗証番号がちがうよ');return}
  const f=PIN_NEXT;PIN_NEXT=null;closeSheet();if(f)f();
 },
 pinLater(){S.pinSkip=today();save();refresh()},
 goalDo(a){
  const [k,i]=a.split('|'),r=toggleGoal(k,+i);
  if(r.on){toast('マイルストーン達成 +'+r.xp+'XP');Snd.ok();if(r.xp>=100)FX.confetti(70)}
  if(r.chest)setTimeout(()=>{toast('宝箱が開いた！ +100XP');FX.confetti(140);Snd.clear()},900);
  if(r.lv)setTimeout(()=>levelUp(r.lv.to),1500);
  checkBadges().forEach((b,j)=>setTimeout(()=>toast('バッジ獲得：'+b[1]),1800+j*2300));
  save();refresh();
 },
 tile(ds){toast(tileInfo(ds))},
 /* ---- ごほうび ---- */
 rwEdit(){if(rwEdit){rwEdit=false;renderReward();return}needPin('ごほうびのリストを編集します（保護者用）。',()=>{rwEdit=true;renderReward()})},
 shBuy(i){const s=S.shop[+i];if(!s||S.coin<s.c)return;S.coin-=s.c;logReward(s.n,s.c);save();toast('こうかんした：'+s.n+'（保護者に見せよう）');FX.confetti(60);Snd.clear();refresh()},
 shDel(i){S.shop.splice(+i,1);save();renderReward()},
 shAdd(){const n=$('#shN').value.trim(),c=Math.max(10,+$('#shC').value||100);if(!n)return;S.shop.push({n,c});save();renderReward()},
 gcDel(i){S.gacha.splice(+i,1);save();renderReward()},
 gcAdd(){const n=$('#gcN').value.trim();if(!n)return;S.gacha.push(n);save();renderReward()},
 gacha(){
  if(gcBusy)return;if(S.coin<150){toast('コインが足りない（150コイン）');return}if(!S.gacha.length){toast('景品を追加してね');return}
  Snd.unlock();gcBusy=true;S.coin-=150;const g=S.gacha[Math.random()*S.gacha.length|0],el=$('#gcOut');let n=0;
  const iv=setInterval(()=>{el.textContent=S.gacha[Math.random()*S.gacha.length|0];Snd.tap();
   if(++n>=12){clearInterval(iv);gcLast=g;logReward(g,150);FX.confetti(130);Snd.clear();gcBusy=false;save();renderHud();renderReward()}},85);
 },
 chGot(k){S.got[k]=!S.got[k];save();renderReward()},
 chEdit(k){editK=k;renderReward();const i=$('#chIn');if(i)i.focus()},
 chSave(k){const v=$('#chIn').value.trim();if(v)S.mrw[k]=v;else delete S.mrw[k];editK='';save();renderReward()},
 /* ---- ドリル・ミス ---- */
 drillOpen(key){drillSheet(key)},
 drillDue(){const items=drillItems({type:'due',n:10});if(!items.length){toast('ふくしゅう待ちの問題はありません');return}startSession({title:'ふくしゅうまとめ',subj:'総',items,skipBrief:true})},
 dsMode(m){DS.mode=m;drillSheet(DS.key)},dsN(n){DS.n=+n;drillSheet(DS.key)},dsLv(l){DS.lv=+l;drillSheet(DS.key)},
 drillGo(){drillGo()},
 mistDrill(){const items=weakItems(20).map(freshen);if(!items.length){toast('いまミスはありません');return}closePage();startSession({title:'ミス退治（自由練習）',subj:'総',items,skipBrief:true})},
 naiLog(){const c=naiCalc(),label=($('#naiLabel')||{}).value||'学校のテスト';needPin('テストの結果を記録します（目標の点ではなく、実際の点を入れてあるか確かめてから）。',()=>{S.tl.push({d:today(),tot:Math.round(c.tot),nn:Math.round(c.nn),gk:c.g,label});S.tl=S.tl.slice(-40);save();renderNaiLog();toast('記録した（めやす）')})},
 naiUndo(){if(!S.tl.length)return;needPin('いちばん新しい記録を消します。',()=>{S.tl.pop();save();renderNaiLog();toast('消した')})},
 msAdd(){
  const memo=$('#msMemo').value.trim();
  if(memo.length<2){toast('どんな問題か、ひとこと書いてね');return}
  addManualMistake($('#msSub').value,$('#msKind').value,memo);
  const r=mistakeXP();   // XPは、1日1回だけ（何回も登録してXPをかせげないように）
  $('#msMemo').value='';save();
  toast(r.xp?'ミスを登録した。あした再戦だ！ +'+r.xp+'XP':'ミスを登録した。あした再戦だ！（XPは1日1回）');
  renderMistPage();renderHud();if(r.lv)levelUp(r.lv.to)
 },
 /* ---- 診断・教科・AI先生 ---- */
 dgTab(s){S.dg=s;dgFb=false;save();renderDg()},dgNext(){dgFb=false;renderDg()},
 dgAgain(){S.diag[S.dg]={ans:[],sc:0,paid:1};dgFb=false;save();renderDg();renderDiagOut()},dgPick(j){dgPick(+j)},
 sjTab(s){S.sj=s;save();renderSubj()},
 async cpAg(i){const a=AGENTS[+i],ok=await copyText(COMMON+'\n\n'+a.body);$('#cpm'+i).textContent=ok?'コピーした！ Claudeのプロジェクトの指示に貼ろう':'コピーできなかった。「設定の中身を見る」から長押しでコピーしてね'},
 /* ---- 設定 ---- */
 team(k){if(!TEAMS[k])return;S.team=k;applyTeam();paintBg();save();initInputs();renderHud()},
 theme(k){if(!THEMES.some(t=>t[0]===k))return;S.theme=k;applyTheme();paintBg();save();initInputs();renderHud();refresh();toast('画面の色を「'+themeOf(k)[1]+'」にした')},
 sound(){S.sound=S.sound?0:1;save();initInputs();if(S.sound)Snd.ok()},
 pinToggle(){
  if(S.pinOn){needPin('保護者OKをオフにします。',()=>{S.pinOn=0;save();initInputs();toast('保護者OKをオフにした')});return}
  const v=($('#setPin').value||'').trim();
  if(!/^\d{4}$/.test(v)){toast('4けたの数字を入れてから、オンにしてね');return}
  S.pin=v;S.pinOn=1;save();initInputs();toast('保護者OKをオンにした。宿題のチェックに必要になります');
 },
 tierSet(v){if(!(S.pinOn&&S.pin)&&v!=='auto'){toast('量を決めるのは、おうちの人と暗証番号を決めてからにしよう（いまは「おまかせ」）');return}needPin('1日の量の段階を変えます。',()=>{S.tier=v==='auto'?'auto':+v;S.rt=null;save();initInputs();toast(v==='auto'?'段階：おまかせ（だんだん増える）':'段階を「'+TIERS[+v].name+'」にした')})},
 async report(){const t=reportText();$('#rpt').value=t;const ok=await copyText(t);toast(ok?'週報をコピーした':'下の文を長押しでコピーしてね')},
 bkMake(){$('#bk').value=btoa(unescape(encodeURIComponent(JSON.stringify(backupObj()))))},   // 暗証番号は入れない
 async bkCopy(){if(!$('#bk').value)ACT.bkMake();const ok=await copyText($('#bk').value);toast(ok?'バックアップをコピーした。メモアプリなどに保存してね':'長押しでコピーしてね')},
 bkLoad(){let o;try{o=JSON.parse(decodeURIComponent(escape(atob($('#bk').value.trim()))));if(!o||typeof o.xp!=='number')throw 0}catch(e){toast('復元できなかった。文字列をもう一度たしかめてね');return}needPin('バックアップから復元します。いまの記録は置きかわります（暗証番号は、いまのまま）。',()=>{restoreFrom(o);save();reloadAll();show(VIEWS.includes(S.tab)?S.tab:'home');toast('復元した')})},
 reroute(){S.rt=null;save();refresh();toast('きょうのルートを作り直した')},
 reset(){
  const b=$('#rstBtn');
  if(b.dataset.armed){delete b.dataset.armed;b.textContent='すべてリセット';needPin('すべての記録を消します。',()=>{S=fresh();save();reloadAll();show('home');toast('リセットした')});return}
  b.dataset.armed='1';b.textContent='本当に消す？ もう一度タップ';setTimeout(()=>{delete b.dataset.armed;if(b)b.textContent='すべてリセット'},4000);
 }
};
document.addEventListener('click',e=>{
 if(FCD&&!e.target.closest('[data-act="flowGo"]')&&!e.target.closest('#ov'))flowCdStop(true);   // さわったら、自動でつぎへ進むのを止める（レベルアップの表示を閉じるだけなら止めない）
 const t=e.target.closest('[data-act],[data-tab],[data-page]');
 if(!t){
  if(e.target.id==='sheet')closeSheet();
  else if(e.target.closest&&e.target.closest('#fb')&&PL&&PL.phase==='fb')PL.hold=true;
  return;
 }
 const d=t.dataset;
 if(d.act){if(t.tagName==='A')e.preventDefault();const f=ACT[d.act];if(f)f(d.a,t,e)}
 else if(d.tab)show(d.tab);
 else if(d.page)openPage(d.page);
});
document.addEventListener('change',e=>{
 const el=e.target;
 if(el.dataset.nai){const p=el.dataset.nai.split('|');if(el.value)S.nai[p[0]][p[1]]=+el.value;else delete S.nai[p[0]][p[1]];S.nai.set=1;checkBadges();save();naiOut()}
 else if(el.id==='setExam'&&el.value){S.exam=el.value;save();refresh()}
 else if(el.id==='vowIn'){S.at=el.value||'';save();toast(S.at?'やくそく：'+S.at+' に スタート！':'やくそくを消した');renderHome()}
});
document.addEventListener('input',e=>{
 const el=e.target;
 if(el.id==='naiT3'){S.nai.t3=+el.value;S.nai.set=1;save();naiOut()}
 else if(el.id==='naiGk'){S.nai.gk=+el.value;S.nai.set=1;save();naiOut()}
 else if(el.id==='setNick'){S.nick=el.value.slice(0,12);saveSoon();renderHud()}
 else if(el.id==='setPin'){el.value=el.value.replace(/\D/g,'').slice(0,4)}
 else if(el.dataset.memo!=null){S.memo[+el.dataset.memo]=el.value;saveSoon()}
});
document.addEventListener('keydown',e=>{
 if(!PL)return;
 if(e.key==='Enter'){
  if(PL.phase==='fb'){e.preventDefault();plNext();return}
  if(PL.phase==='q'&&PL.V){if(PL.V.kind==='typ')ACT.plTyp();else if(PL.V.kind==='num')ACT.plNum();else if(PL.V.kind==='order')ACT.plOrder()}
  return;
 }
 if(PL.phase!=='q'||!PL.V)return;
 if(PL.V.kind==='mc'&&/^[1-4a-d]$/i.test(e.key)){const i='1234'.includes(e.key)?+e.key-1:'abcd'.indexOf(e.key.toLowerCase());if(PL.V.choices[i])answerQ(i)}
 else if(PL.V.kind==='num'){
  if(/^[0-9.,\/xy=()π]$/.test(e.key))ACT.plKey(e.key);else if(e.key==='-')ACT.plKey('−');else if(e.key==='Backspace'){e.preventDefault();ACT.plKey('⌫')}
 }
 else if(PL.V.kind==='typ'){const i=$('#tyIn');if(i&&i.readOnly&&!e.metaKey&&!e.ctrlKey){if(/^[a-z]$/i.test(e.key))ACT.plLet(e.key.toLowerCase());else if(e.key==='Backspace'){e.preventDefault();ACT.plLet('⌫')}}}
});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!PL&&!PG)refresh()});
document.addEventListener('touchstart',()=>{},{passive:true});

/* ---- 開発用：?debug を付けると、テスト用の入り口が出る ---- */
if(/[?&]debug/.test(location.search))window.__sq={get S(){return S},get PL(){return PL},ACT,routeFor,flowState,present,judge,correctText,show,refresh,openPage,makeGen,GEN,BK,ITEMS,startSession,levelUp,setToday,completeStage,recordAnswer,drillItems,lvInfo};

/* ---- 初期化 ---- */
(function init(){
 applyTeam();applyTheme();paintBg();
 show('home');   // 起動は、いつもホーム（前に開いていたタブから始めると、きょうのミッションを見落とす）
})();
