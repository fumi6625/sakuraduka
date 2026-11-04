/* ===== きょうの一本道（画面） =====
   ホーム／結果画面／ドリルタブ／宿題・ふりかえり・診断のあと、どこからでも「つぎ」へ1タップでつながる。
   結果画面と宿題・ふりかえりのあとは、数秒でつぎのステージが始まる（どこかをタップすると止まる）。
   */
const hmOf=t=>{const d=new Date(t);return pad(d.getHours())+':'+pad(d.getMinutes())};

/* 1つのステージを始める（ホームのボタン・結果画面の「つぎへ」・ドリルタブのカードで共通） */
function startStage(s){
 if(s.id==='hw'){hwSheet();return}
 if(s.id==='ref'){refSheet();return}
 if(s.id==='diag'){S.dg=s.subj;openPage('diag');return}
 if(s.auto){toast('いまは再戦するミスがありません。ミスが出ると、ここに集まります');return}
 const redo=s.done&&lowRes(s.res),count=!s.done||redo;   // 正答4割未満だったドリルは、やりなおして4割以上とれたら数える
 startSession({title:s.t,subj:s.subj,items:s.items,skipBrief:!s.boss,stageId:count?s.id:null,boss:s.boss,
  desc:redo?'ゆっくり読んで、もう一度！ 4割以上とれたら、きょうの合格ラインに数えるよ':s.done?'クリア済みのステージです。もう一度やってもOK（XPは自由練習あつかい）':s.desc,
  brk:s.brk,min:s.min,xp:count?s.xp:0,redo:redo});
}

/* 一本道のバー（ホームはボタン／結果画面は見るだけ）。さいごの「れんらく」は、押せるまで鍵 */
function routeBar(F,wd,live){
 const T=live?'button':'div';
 const nodes=F.route.map(s=>{
  const cls=s.auto?'auto':s===F.target?'now':s.done?'done':'',par=s.id==='hw'&&PINON()&&!s.done?' par':'';
  return `<${T} class="nd ${cls}${par}"${live?` data-act="stageGo" data-a="${s.id}"`:''}><span class="dot">${s.done&&!s.auto&&s!==F.target?ico('check'):ico(stageIcon(s))}</span>${esc(stageShort(s,wd))}</${T}>`}).join('');
 return `<div class="route" aria-label="きょうの流れ">${nodes}</div>`;
}
/* マストがぜんぶ終わったときのカード（おかわりへ） */
function goalCard(F){
 const due=sum(Object.values(dueByBank())),hw=F.hwWait?'<p class="mini hwn">宿題は、おうちの人に見せて OK をもらってね。</p>':'';
 return `<div class="nowc cleared goalc"><div class="sp1">${splatSVG(14,'#fff',{drops:9,stroke:'var(--ink)',sw:5})}</div><span class="lb y">ぜんぶクリア！</span>
  <h2>きょうは、もうバッチリ！</h2>${hw}
  <p class="mini oka">まだ元気なら「おかわり」。好きな教材を、好きなだけ。（1日60XPまで）</p>
  <div class="row">${due?`<button class="bt cy" data-act="drillDue">ふくしゅう ${Math.min(10,due)}問</button>`:''}<button class="bt" data-tab="drill">おかわりドリル</button><button class="bt cy" data-act="tsukkomi">ツッコミバトル</button></div></div>`;
}

/* つぎへ進むブロック。F.target があれば「つぎのステージ」 */
function nextBlock(F,o={}){
 const t=F.target,rest=o.rest===false?'':`<button class="bt gh sm" data-act="plHome">${ico('home')}ひとやすみ（ホームへ）</button>`;
 if(t){
  const redo=t===F.redo,m=t.kind==='session'?`約${Math.max(1,t.min)}分・${t.items.length}問`:t.id==='diag'?'約3分・6問':t.id==='ref'?'約2分':'',lab=t.id==='diag'?'ミニ診断（'+SJN[t.subj]+'）':flowName(t);
  return `<div class="nxt"><span class="lb sm y">${redo?'もう一度':'つぎ'}</span>
   <button class="bt pri xl w100 nxb" data-act="flowGo"><span><b>${esc(lab)}</b><small>${redo?'4割以上とれたら、きょうの合格ラインに数えるよ':m}</small></span>${ico('play')}${o.cd?'<i class="cdb" id="cdb"></i>':''}</button>
   ${o.cd?'<p class="nxc" id="nxc"></p>':''}${rest}</div>`;
 }
 return '';
}

/* ----- 自動でつぎへ：数秒のカウントダウン。さわると止まる／画面を見ていないとき・ほかの表示が出ているときは始めない ----- */
let FCD=null;
function flowCdStart(sec){
 flowCdStop();
 if(!$('#nxc'))return;
 FCD={end:Date.now()+sec*1000,total:sec*1000,iv:setInterval(flowCdTick,250)};flowCdTick();
}
function flowCdTick(){
 if(!FCD)return;
 const el=$('#nxc');
 if(!el){flowCdStop();return}
 if(!$('#ov').hidden){FCD.end+=250;return}   // レベルアップなどの表示中は待つ
 if(Date.now()-FCD.end>1500){flowCdStop(true);return}   // 画面を離れて、あとで戻ったとき：いきなり始めない
 const left=Math.ceil((FCD.end-Date.now())/1000),bar=$('#cdb');
 if(bar)bar.style.width=Math.min(100,Math.max(0,(1-(FCD.end-Date.now())/FCD.total)*100))+'%';   // ボタンの下の帯が、6秒でのびる
 if(left>0){el.textContent='つぎが '+left+'びょうで はじまるよ（どこかをタップで とまる）';return}
 const seen=!document.hidden;
 flowCdStop();
 if(seen)ACT.flowGo();else el.textContent='';
}
function flowCdStop(note){
 if(FCD){clearInterval(FCD.iv);FCD=null}
 const el=$('#nxc'),bar=$('#cdb');if(bar)bar.style.width='0';
 if(el&&note)el.textContent='じぶんの ペースで どうぞ';
}
/* 宿題・ふりかえりのあと：つぎへつなぐ（自動でつなぐのがオンなら、カウントダウンつき）。
   一本道に入っていないステージ（保護者OKがオンのときの、おうちの人がつける宿題）のあとは、何もしない */
function flowBridge(id){
 setTimeout(()=>{
  if(PL||PG)return;
  const F=flowState();
  if(id&&!F.must.some(s=>s.id===id))return;
  if(F.next&&S.flowAuto){openSheet(`<h2>ナイス！</h2>${nextBlock(F,{cd:true,rest:false})}`,'bridge');flowCdStart(6)}
  else if(F.redo)openSheet(`<h2>あと一歩！</h2><p>せいかいが 4わりに とどいた ドリルが あると、きょうの合格ライン。もう一度 やってみよう。</p>${nextBlock(F,{rest:false})}`,'bridge');   // やりなおしは、自動では始めない
 },900);
}

/* ----- ドリルタブの上：きょうのミッションの「つづき」（ホームと同じ主役のカード。ドリルタブにいても、道からはぐれない） ----- */
function missionCard(F){
 const t=F.target;
 if(t){
  const m=t.kind==='session'?`約${Math.max(1,t.min)}分・${t.items.length}問`:t.id==='diag'?'約3分・6問':t.id==='ref'?'約2分':'';
  return `<div class="nowc mis" data-s="${t.subj}"><div class="sp1">${splatSVG(9,'var(--yellow)',{drops:7,stroke:'var(--ink)',sw:5})}</div>
   <span class="lb">${t===F.redo?'もう一度 やること':'きょうの つづき'}</span>
   <div class="nrow"><div class="nico">${ico(stageIcon(t))}</div><div class="ntx"><h2>${esc(flowName(t))}</h2><p>${m?m+'・':''}のこり${F.steps}つ</p></div></div>
   <button class="bt pri xl w100" data-act="flowGo">${t===F.redo?'もう一度！':'つづける！'}</button></div>`;
 }
 return '';
}
/* 診断ページ：診断も一本道のひとつ。おわったら、そのまま つぎへ */
function diagFlowNext(){const F=flowState();return F.route.some(s=>s.id==='diag'&&s.subj===S.dg)&&F.target?nextBlock(F,{rest:false}):''}
