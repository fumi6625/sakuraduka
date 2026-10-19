/* ===== プレイヤー：1問ずつ答える画面（ミッション確認 → 出題 → 結果） ===== */
let PL=null;
const PRAISE=['ナイス！','いいね！','その調子！','かんぺき！','やるじゃん！','ズバリ！'];
const MISS=['おしい！','つぎは いける！','ここがのびしろ！','あとで再戦だ！'];
const plRoot=()=>$('#plr');

/* o:{title,subj,items,stageId,boss,desc,brk,min,xp,again} */
function startSession(o){
 Snd.unlock();Tts.unlock();
 let prog=null;
 if(o.stageId&&S.rt&&S.rt.d===today()){S.rt.p=S.rt.p||{};prog=S.rt.p[o.stageId]||null}
 const done=new Set(prog?Object.keys(prog.r):[]);
 PL={o,total:o.items.length,queue:[],segs:[],ok:prog?prog.ok:0,combo:0,maxCombo:prog?prog.cb||0:0,sec:prog?prog.sec||0:0,qT:0,log:[],newMast:0,phase:'brief',cur:null,V:null,val:'',chips:[],resumed:!!(prog&&done.size),hold:false,timer:null,prog};
 o.items.forEach((it,i)=>{
  if(done.has(it.id)){PL.segs[i]=prog.r[it.id]?1:2}
  else{PL.queue.push({it,rep:0,idx:i});PL.segs[i]=0}
 });
 const r=plRoot();r.hidden=false;document.body.style.overflow='hidden';document.body.classList.add('inpl');
 if(o.skipBrief)plGo();else renderBrief();
}
function renderBrief(){
 const o=PL.o,left=PL.queue.length;
 plRoot().innerHTML=`<div class="plt"><button class="bt sm gh" data-act="plQuit">${ico('back')}もどる</button></div>
 <div class="plb mid"><div class="bf" data-s="${o.subj}">
  <span class="lb">${o.boss?'ボスバトル':'ミッション'}</span>
  <h1>${esc(o.title)} ${sjTag(o.subj)}</h1>
  <p class="bfd">${esc(o.desc||'')}</p>
  <div class="bfl">${(o.brk||[]).map(b=>`<div class="bfi"><span>${esc(b.name)}</span>${b.nw?`<i>あたらしい ${b.nw}</i>`:''}<b>${b.n}<small>問</small></b></div>`).join('')}</div>
  <div class="chips"><span class="chp">約${o.min||estMin(o.items)}分</span><span class="chp">${PL.total}問${PL.resumed?'（のこり'+left+'問）':''}</span>${o.xp?`<span class="chp xp">+${o.xp}XP</span>`:''}</div>
  <p class="rule">${o.tf?'ライバルの答えを、きびしい目でチェック！ <b>まちがいを見つけるのは、あなたの得意技</b>。':o.boss?'<b>8問以上せいかい</b>でボスをたおせる！まちがえてもXPはもらえる。':'まちがえた問題は、このあとすぐもう一度出ます。そして あした「ミス退治」で再戦。5問ごとにラウンドクリア！'}</p>
  <button class="bt pri xl" data-act="plGo">${PL.resumed?'つづきから':'スタート！'}</button>
 </div></div>`;
}
function plGo(){
 PL.phase='q';PL.t0=Date.now();
 nextQ();
}
function topBar(){
 const o=PL.o,n=Math.min(PL.total,PL.segs.filter(x=>x).length+(PL.phase==='q'?1:0));
 let prog;
 if(o.boss){
  const need=8,hit=Math.min(need,PL.ok);
  prog=`<div class="boss"><span class="bn">${ico('splat')}シミボス</span><div class="hp">${Array.from({length:need},(_,i)=>`<i class="${i<hit?'broken':''}">♥</i>`).join('')}</div></div>`;
 }else if(PL.total<=36){
  const ci=PL.cur?PL.cur.idx:-1;
  prog=`<div class="segs">${PL.segs.map((s,i)=>`<i class="${s===1?'ok':s===2?'ng':''}${i===ci?' cur':''}"></i>`).join('')}</div>`;
 }else{
  prog=`<div class="tank sm"><i style="--w:${Math.round(PL.segs.filter(x=>x).length/PL.total*100)}%"></i></div>`;
 }
 return `<div class="plt"><button class="bt sm gh" data-act="plQuit" aria-label="やめる">${ico('close')}</button><div class="ttl">${sjTag(o.subj)}<b>${esc(o.title)}</b></div><div class="cnt"><b>${n}</b>/${PL.total}</div></div>${prog}`;
}
function nextQ(){
 clearTimeout(PL.timer);
 const e=PL.queue.shift();
 if(!e){finishSession();return}
 PL.cur=e;PL.V=present(e.it);if(PL.o.tf&&PL.V.kind==='mc')PL.V=toTF(PL.V);PL.val='';PL.chips=[];PL.phase='q';PL.qT=Date.now();PL.hint=false;
 renderQ();
 if(PL.roundFlag){PL.roundFlag=false;roundBanner()}
 if(PL.V.audio)setTimeout(()=>{if(PL&&PL.cur===e&&PL.phase==='q')Tts.say(PL.V.audio)},250);
}
function choiceCols(V){const m=Math.max(...V.choices.map(c=>String(c.t).length));return m<=14?'c2':'c1'}
function renderQ(){
 plRoot().classList.remove('fbon');
 const {V,cur:e}=PL,it=e.it,isNew=!e.rep&&!S.srs[it.id]&&it.k!=='gen'&&it.k!=='mist';
 const ql=String(V.q).length,long=ql>70?' long':(ql<=8&&(V.kind==='mc'||V.kind==='tf'||V.kind==='self'||V.kind==='typ')||ql<=12&&V.kind==='tf')?' short':'';
 let ans='';
 const useKb=V.kind==='typ'&&!V.hira&&V.len>0&&V.accept.every(a=>/^[A-Za-z]+$/.test(a));
 if(V.kind==='mc'){
  ans=`<div class="chs ${choiceCols(V)}">${V.choices.map((c,i)=>`<button class="ch" data-act="plPick" data-a="${i}"><span class="ab">${'ABCD'[i]}</span><span class="ct">${esc(c.t)}</span></button>`).join('')}</div>`;
 }else if(V.kind==='tf'){
  ans=`<div class="rival"><i>ライバルの答え</i><p>「${esc(V.claim)}」</p></div><div class="tfb"><button class="tfy" data-act="plTF" data-a="1"><b>○</b>合ってる</button><button class="tfn" data-act="plTF" data-a="0"><b>×</b>ちがう！</button></div>`;
 }else if(V.kind==='num'){
  const A=V.accept.join(''),alpha=/[xy=π±()]/.test(A);
  const keys=['7','8','9','⌫','4','5','6','C','1','2','3'];
  const ex=[];if(/\./.test(A))ex.push('.');if(/\//.test(A))ex.push('/');if(/,/.test(A))ex.push(',');
  if(alpha)['x','y','=','π','(',')','±','²'].forEach(c=>{if(c==='x'||c==='y'||c==='='||c==='('||c===')'||(c==='π'&&/π|pi/i.test(A))||(c==='±'&&/±/.test(A))||(c==='²'&&/²/.test(A)))ex.push(c)});
  const k=(c,cls)=>`<button class="key${/[0-9]/.test(c)?'':' fn'}${cls?' '+cls:''}" data-act="plKey" data-a="${c}"${c==='⌫'?' aria-label="1文字消す"':c==='C'?' aria-label="ぜんぶ消す"':''}>${c}</button>`;
  ans=`<div class="lcd"><span id="lcdV" class="v"></span><span class="u">${V.unit&&V.unit.length<=3?esc(V.unit):''}</span></div>${V.unit&&V.unit.length>3?`<div class="hint">${esc(V.unit)}</div>`:''}
  ${ex.length?`<div class="kx">${ex.map(c=>k(c)).join('')}</div>`:''}
  <div class="kp">${keys.map(c=>k(c)).join('')}<button class="key go" data-act="plNum">こたえる</button>${k('0','w2')}${k('−')}</div>
  <div class="row act"><button class="bt sm gh" data-act="plSkip">わからない</button></div>`;
 }else if(V.kind==='typ'&&useKb){
  /* 英語のつづり：画面のキーボード（iPadの標準キーボードは出さない。自動修正・大文字化もなし） */
  const kr=['qwertyuiop','asdfghjkl','zxcvbnm'];
  ans=`<div class="tyw"><input id="tyIn" type="text" readonly inputmode="none" autocomplete="off" placeholder="${esc(Array(V.len).fill('_').join(' '))}" aria-label="こたえ"><button class="bt pri xl" data-act="plTyp">こたえる</button></div>
  <div class="hint"><button class="bt sm gh" data-act="plHint">ヒント</button> <span id="hintT"></span></div>
  <div class="kb">${kr.map((r,i)=>`<div class="kr">${[...r].map(c=>`<button class="key" data-act="plLet" data-a="${c}">${c}</button>`).join('')}${i===2?'<button class="key fn bk" data-act="plLet" data-a="⌫" aria-label="1文字消す">⌫</button>':''}</div>`).join('')}</div>
  <div class="row act"><button class="bt sm gh" data-act="plSkip">わからない</button></div>`;
 }else if(V.kind==='typ'){
  ans=`<div class="tyw"><input id="tyIn" type="text" autocapitalize="none" autocorrect="off" autocomplete="off" spellcheck="false" placeholder="${esc(V.ph||'')}" aria-label="こたえ"><button class="bt pri xl" data-act="plTyp">こたえる</button></div>
  <div class="hint">${V.len?'<button class="bt sm gh" data-act="plHint">ヒント</button> ':''}<span id="hintT"></span></div>
  <div class="row act"><button class="bt sm gh" data-act="plSkip">わからない</button></div>`;
 }else if(V.kind==='order'){
  ans=`<div class="slots" id="slots" style="--rows:${Math.max(2,Math.ceil(V.tokens.length/3))}"></div><div class="bank" id="bank"></div>
  <div class="row act"><button class="bt sm gh" data-act="plReset">やりなおし</button><button class="bt sm gh" data-act="plSkip">わからない</button><button class="bt pri xl" id="ordGo" data-act="plOrder" disabled>こたえる</button></div>`;
 }else{
  ans=`<div class="selfans" id="selfAns" hidden></div><div class="row act" id="selfRow"><button class="bt cy xl" data-act="plShow">こたえを見る</button></div>`;
 }
 const pass=V.passage?`<details class="pass" open><summary>${ico('book')}長文を読む：${esc(V.passage.title)}</summary><div class="ptx">${esc(V.passage.text)}</div></details>`:'';
 const aud=V.audio?`<button class="bt sm cy sayb" data-act="plSay" aria-label="もう一度きく">${ico('vol')}もう一度きく</button>`:'';
 plRoot().innerHTML=`${topBar()}<div class="plb"><div class="qa ${V.kind}${useKb?' kbd':''}">
  <div class="qcard" data-s="${it.subj}"><div class="qsp">${splatSVG(hashStr(it.id)%97,'#fff',{drops:5})}</div><div class="qm"><span class="cat">${esc(itemCat(it))}</span>${e.rep?'<span class="chp w">リトライ</span>':''}${isNew?'<span class="chp t">新しい問題</span>':''}</div>
  <div class="qbody">${V.sub&&V.sub!==itemCat(it)?`<div class="qs">${esc(V.sub)}</div>`:''}${pass}<div class="qt${long}">${esc(V.q)}</div>${aud}</div></div>
  <div class="ans">${ans}</div></div></div><div class="fb" id="fb"></div><div class="cmb" id="cmb" hidden></div>`;
 if(V.kind==='order')drawOrder();
 if(V.kind==='typ'&&!useKb)setTimeout(()=>{const i=$('#tyIn');if(i)i.focus()},120);
 plRoot().querySelector('.plb').scrollTop=0;
}
function drawOrder(){
 const V=PL.V,used=new Set(PL.chips);
 const tk=(i,a)=>`<button class="tk" data-act="plTk" data-a="${i}">${esc(V.tokens[i])}</button>`;
 $('#slots').innerHTML=PL.chips.length?PL.chips.map(tk).join(''):'<span class="ph">ここに ならべる（下の言葉をタップ）</span>';
 $('#bank').innerHTML=V.tokens.map((t,i)=>used.has(i)?`<span class="tk gap">${esc(t)}</span>`:tk(i)).join('');
 const g=$('#ordGo');if(g)g.disabled=PL.chips.length!==V.tokens.length;
}
function plRespOf(){
 const V=PL.V;
 if(V.kind==='order')return PL.chips.map(i=>V.tokens[i]);
 return null;
}
function answerQ(resp){
 if(!PL||PL.phase!=='q')return;
 const V=PL.V,e=PL.cur,it=e.it;
 const ok=judge(V,resp);
 PL.phase='fb';
 PL.sec+=Math.min(120,(Date.now()-PL.qT)/1000);
 let lvTxt='';
 if(e.rep===0){
  const before=boxOf(it);
  if(V.kind==='tf'){if(!ok)recordAnswer(it,false);S.tf.n++;if(ok)S.tf.ok++}else lvTxt=recordAnswer(it,ok);
  noteAnswer(ok);
  const after=boxOf(it);if(after>=4&&before<4)PL.newMast++;
  PL.segs[e.idx]=ok?1:2;if(ok)PL.ok++;
  const ans=PL.segs.filter(x=>x).length;if(ans%5===0&&ans<PL.total){PL.roundFlag=true;PL.rn=ans/5}
  PL.log.push({it,V,ok,resp});
  if(PL.o.stageId&&S.rt&&S.rt.d===today()){
   const p=(S.rt.p=S.rt.p||{})[PL.o.stageId]||(S.rt.p[PL.o.stageId]={r:{},ok:0,cb:0,sec:0});
   p.r[it.id]=ok?1:0;p.ok=PL.ok;p.cb=PL.maxCombo;p.sec=Math.round(PL.sec);
  }
  saveSoon();
 }
 if(ok){PL.combo++;PL.maxCombo=Math.max(PL.maxCombo,PL.combo)}else PL.combo=0;
 if(!ok&&e.rep<2){PL.queue.splice(Math.min(3,PL.queue.length),0,{it,rep:e.rep+1,idx:e.idx})}
 showFb(ok,V,resp,lvTxt);
}
function showFb(ok,V,resp,lvTxt){
 const root=plRoot(),fb=$('#fb'),ct=correctText(V),exp=String(V.exp||'').trim();
 /* 選んだ答えの色分け */
 if(V.kind==='mc'){
  $$('.ch',root).forEach((b,i)=>{b.disabled=true;if(V.choices[i].ok)b.classList.add('ok');else if(i===resp)b.classList.add('ng');else b.classList.add('dim')});
 }else if(V.kind==='tf'){
  $$('.tfb button',root).forEach(b=>{b.disabled=true;const yes=b.classList.contains('tfy');b.classList.add(yes===V.truth?'ok':(yes===resp?'ng':'dim'))});
 }else{
  $$('.ans button, .ans input',root).forEach(b=>b.disabled=true);
 }
 const anchor=(V.kind==='mc'&&$$('.ch.ok',root)[0])||(V.kind==='tf'&&$$('.tfb button.ok',root)[0])||$('.qcard',root);
 if(ok){Snd.ok();if(PL.combo>=3)setTimeout(()=>Snd.combo(PL.combo),160);FX.at(anchor,PL.combo>=5?24:12)}
 else{Snd.ng();const q=$('.qcard',root);q&&q.classList.add('shake')}
 if(V.say&&(ok||V.kind==='mc'))setTimeout(()=>Tts.say(V.say),320);
 const cm=$('#cmb');if(PL.combo>=3){cm.hidden=false;cm.innerHTML=`<b>COMBO</b> ×${PL.combo}`;cm.classList.remove('pop');void cm.offsetWidth;cm.classList.add('pop')}else cm.hidden=true;
 const bossHit=PL.o.boss&&ok?'<span class="chp xp">ダメージ！</span>':'';
 const lvMsg=lvTxt==='up'?'<span class="chp ok">レベルUP！むずかしくなるよ</span>':lvTxt==='down'?'<span class="chp">ちょっとやさしくするよ</span>':'';
 const rev=V.reveal&&V.kind!=='self'?`<div class="fbx"><small>英文</small> ${esc(V.reveal)}</div>`:'';
 const re=PL.cur.rep<2&&!ok?`<span class="chp w">このあと もう一度</span>`:'';
 if(ok){
  const short=exp&&exp.length<=70?exp:'';
  fb.className='fb ok on';
  fb.innerHTML=`<div class="fbh"><b>${V.kind==='tf'?pick(['ナイスツッコミ！','見ぬいた！','するどい！']):pick(PRAISE)}</b>${bossHit}${lvMsg}</div>${V.kind!=='mc'&&V.kind!=='self'&&V.kind!=='tf'&&ct?`<div class="fbc"><small>こたえ</small> <b>${esc(ct)}</b></div>`:''}${short&&V.kind!=='self'?`<div class="fbx">${esc(short)}</div>`:''}${rev}<button class="bt pri w100" data-act="plNext">つぎへ ▶</button>`;
  PL.hold=false;
  PL.timer=setTimeout(()=>{if(PL&&PL.phase==='fb'&&!PL.hold)plNext()},900+Math.min(2600,(short.length+(V.reveal?V.reveal.length:0))*45));
 }else{
  fb.className='fb ng on';
  fb.innerHTML=`<div class="fbh"><b>${V.kind==='tf'?pick(['だまされた！','ツッコミそこね！','おしい！']):pick(MISS)}</b>${re}${lvMsg}</div>${V.kind==='self'?'':`<div class="fbc"><small>せいかいは</small> <b>${esc(ct)}</b></div>${exp?`<div class="fbx">${esc(exp).replace(/\n/g,'<br>')}</div>`:''}`}${rev}<button class="bt pri xl w100" data-act="plNext">わかった！つぎへ ▶</button>`;
 }
 /* 下から出るパネルが答えのボタンをかくさないよう、パネルの高さぶんだけ問題エリアをちぢめる */
 root.classList.add('fbon');
 requestAnimationFrame(()=>{root.style.setProperty('--fbh',fb.offsetHeight+'px');const g=$('.ch.ok',root)||$('.tfb button.ok',root);if(g)try{g.scrollIntoView({block:'nearest'})}catch(e){}});
}
function plNext(){
 if(!PL||PL.phase!=='fb')return;
 clearTimeout(PL.timer);
 const fb=$('#fb');if(fb)fb.className='fb';
 plRoot().classList.remove('fbon');
 nextQ();
}

/* 5問ごとの「ラウンドクリア」（集中が切れる前に、小さなゴールをつくる） */
function roundBanner(){
 const r=plRoot(),n=PL.rn||1,left=PL.total-PL.segs.filter(x=>x).length;
 const b=document.createElement('div');b.className='rbn';b.innerHTML=`<span>ROUND ${n}</span><b>CLEAR!</b><small>あと${left}問</small>`;
 document.body.appendChild(b);Snd.combo(6);FX.burst(innerWidth*.2,innerHeight*.3,6,8);FX.burst(innerWidth*.8,innerHeight*.3,6,8);
 setTimeout(()=>{if(b.parentNode)b.parentNode.removeChild(b)},1300);
}

/* ----- ステージ終了 ----- */
function finishSession(){
 PL.phase='done';clearTimeout(PL.timer);
 const o=PL.o,n=PL.total,ok=PL.ok,sec=Math.round(PL.sec);
 const acc=n?ok/n:1,win=o.boss?ok>=8:true;
 let res=null,drill=null;
 const stageDone=o.stageId&&!(peekDay().stg[o.stageId]);
 if(stageDone){
  res=completeStage(today(),o.stageId,{ok,n,sec,combo:PL.maxCombo,boss:!!o.boss});
  if(S.rt&&S.rt.p)delete S.rt.p[o.stageId];
 }else{drill=drillXP(ok)}
 const nb=checkBadges();
 flushSave();
 renderResult({o,n,ok,sec,acc,win,res,drill,nb});
}
function renderResult(R){
 const {o,n,ok,sec,acc,win,res,drill,nb}=R,miss=PL.log.filter(x=>!x.ok);
 const xp=res?res.xp+(res.fullBonus||0):drill?drill.xp:0;
 const rank=rankOfAcc(acc);
 const head=o.boss?(win?'BOSS DOWN!':'おしい！'):acc>=.5||n===0?'CLEAR!':'おつかれ！';
 plRoot().innerHTML=`<div class="plb mid"><div class="rs2" data-rank="${rank}">
  <div class="splw">${splatSVG(hashStr(o.title)%97,'var(--team)',{drops:7,stroke:'#000',sw:5})}</div>
  <div class="clear">${head}</div>
  <div class="rk"><i>${rank}</i><span>ランク</span></div>
  <p class="rt">${esc(o.title)}${o.boss?(win?'　ボスをたおした！':'　あと'+(8-ok)+'問でたおせた…'):''}</p>
  <div class="rtl"><div><b>${ok}<small>/${n}</small></b><span>せいかい</span></div><div><b id="xpV">+0</b><span>XP${res&&res.fullBonus?'（全クリ+'+res.fullBonus+'）':drill&&!drill.xp?'（きょうの自由練習は上限）':''}</span></div><div><b>×${PL.maxCombo}</b><span>さいだいコンボ</span></div><div><b>${fmtMin(Math.max(1,Math.round(sec/60)))}</b><span>かかった時間</span></div></div>
  ${res&&res.low?`<p class="nt"><span class="chp w">正答が4割に届かなかったので、今回はXPなし。ゆっくり読んで、もう一度やってみよう</span></p>`:''}
  ${PL.newMast?`<p class="nt"><span class="chp ok">★ あたらしく おぼえた ${PL.newMast}問</span></p>`:''}
  ${miss.length?`<p class="nt"><span class="chp w">まちがえた ${miss.length}問 → あした「ミス退治」で再戦</span></p>`:'<p class="nt"><span class="chp ok">ノーミス！</span></p>'}
  ${res&&res.streak?`<p class="nt"><span class="chp xp">${ico('flame')} れんぞく ${S.streak}日！${res.streak.bonus?' ボーナス +'+res.streak.bonus+'XP':''}</span></p>`:''}
  ${miss.length?`<details class="fold"><summary>まちがえた問題を見なおす（${miss.length}）</summary>${miss.map(m=>`<div class="mrow"><div class="mq">${esc(String(m.V.q).slice(0,160))}</div><div class="ma"><small>せいかい</small> <b>${esc(correctText(m.V))}</b></div>${m.V.exp?`<div class="mx">${esc(m.V.exp).replace(/\n/g,'<br>')}</div>`:''}</div>`).join('')}</details>`:''}
  <div class="row act" style="justify-content:center"><button class="bt pri xl" data-act="plHome">${o.stageId&&res?'つぎへ':'ホームへ'}</button></div>
 </div></div>`;
 /* XPカウントアップと演出 */
 const el=$('#xpV');let t=0;const iv=setInterval(()=>{t++;const v=Math.round(xp*Math.min(1,t/18));if(el)el.textContent='+'+v;if(t>=18)clearInterval(iv)},40);
 Snd.clear();FX.confetti(win?110:40);
 const msgs=[];
 nb.forEach(b=>msgs.push('バッジ獲得：'+b[1]));
 if(res&&res.streak&&res.streak.freeze)msgs.push('お休みトークンで連続記録を守った！');
 if(res&&res.streak&&res.streak.gotFreeze)msgs.push('お休みトークンを1枚ゲット');
 if(res&&res.full)msgs.push('ぜんぶクリア！ボーナス +20XP');
 if(drill&&drill.xp)msgs.push('自由練習ボーナス +'+drill.xp+'XP');
 msgs.forEach((m,i)=>setTimeout(()=>toast(m),900+i*2400));
 const lv=(res&&res.lv)||(drill&&drill.lv);
 if(lv)setTimeout(()=>levelUp(lv.to),1000);
 renderHud();
}
function levelUp(lv){
 Snd.lv();FX.confetti(140);
 const r=rankOf(lv),first=RANKS.some(x=>x[0]===lv);
 openOv(`<span class="big">LEVEL UP!</span>${lvHex(lv,96)}<p style="font-size:20px;margin:10px 0 2px"><b class="px">Lv.${lv}　${esc(r)}</b></p><p class="mini">${first?'ランクが上がった！新しい称号だ。':'つぎのレベルへ、また一歩。'}</p><p><button class="bt pri xl" data-act="ovClose">やった！</button></p>`);
}
function plClose(){
 clearTimeout(PL&&PL.timer);try{speechSynthesis.cancel()}catch(e){}
 PL=null;const r=plRoot();r.hidden=true;r.innerHTML='';document.body.style.overflow='';document.body.classList.remove('inpl');
 flushSave();refresh();
}
function plQuit(){
 if(!PL)return;
 if(PL.phase==='brief'||PL.phase==='done'||!PL.o.stageId&&PL.segs.every(x=>!x)){plClose();return}
 openOv(`<span class="big" style="font-size:30px;color:#fff">ひとやすみ？</span><p>ここまでの答えは保存されています。${PL.o.stageId?'あとで「つづきから」できます。':''}</p><div class="row" style="justify-content:center"><button class="bt pri" data-act="ovClose">つづける</button><button class="bt ng" data-act="plClose">やめる</button></div>`);
}
