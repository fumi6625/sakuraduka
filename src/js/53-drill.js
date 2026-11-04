/* ===== ドリル：好きな教材を、好きなだけ（おかわり）／ミス図鑑 ===== */
const SUBJ_BANKS={数:['MQ','MS'],英:['EW','EV','EG','EO','EL','ER','EC'],国:['JK','JW','JI','JS','JG','JR','JC'],理:['SQ'],社:['OQ','OT']};
const BANK_IC={EW:'eng',EV:'redo',EG:'book',EO:'pen',EL:'vol',ER:'book',EC:'pencil',JK:'jp',JW:'pencil',JI:'chat',JS:'chat',JG:'book',JR:'book',JC:'pen',MQ:'math',MS:'bolt',SQ:'sci',OQ:'soc',OT:'flag'};
const BANK_HINT={EW:'つづり・意味・音声',EV:'過去形・過去分詞',EG:'文法の4択',EO:'語を並べて英文に',EL:'聞いて答える',ER:'長文読解（1題ずつ）',EC:'英作文（自己採点）',JK:'読みを答える',JW:'漢字を選ぶ・書く',JI:'意味と使い方',JS:'対義語・類義語',JG:'品詞・敬語・古文・漢文',JR:'読解（1題ずつ）',JC:'作文の型',MQ:'定義・性質・公式',MS:'考え方（自己採点）',SQ:'理科の一問一答',OQ:'社会の一問一答',OT:'年代の並べかえ'};
function dueByBank(){
 const t=DN(),m={};
 /* 「待ち」は まだ定着していない（箱0〜3）だけ。おぼえた問題の見なおしは、毎日のミッションが順番に出す */
 for(const id in S.srs){const s=S.srs[id];if(s.d<=t&&s.b<=3){const it=ITEMS[id];if(it)m[it.bank]=(m[it.bank]||0)+1}}
 return m;
}
let DS={key:'',mode:'due',n:20,lv:0};
function bankCard(b,due){
 const bk=BK[b],st=bankStats(b),pct=st.total?Math.round(st.mast/st.total*100):0,d=due[b]||0;
 return `<button class="dc" data-act="drillOpen" data-a="bank:${b}" data-s="${bk.subj}"><div class="dh">${ico(BANK_IC[b]||'star')}<b>${esc(bk.name)}</b>${d?`<span class="nb">待ち${d}</span>`:''}</div>
  <div class="dn">${st.total}問　<span>出題済み ${st.seen}</span></div>
  <div class="tank sm g"><i style="--w:${pct}%"></i></div><div class="dm">おぼえた ${st.mast}（${pct}%）</div></button>`;
}
function genCard(id){
 const g=GEN[id],s=S.gs[id],lv=genLv(id);
 return `<button class="dc gen" data-act="drillOpen" data-a="gen:${id}" data-s="${g.subj}"><div class="dh">${ico(g.subj==='数'?'calc':'flask')}<b>${esc(g.name)}</b></div>
  <div class="dn"><span class="chp t">Lv.${lv}</span> ${s&&s.n?`${s.n}問　正答率 ${Math.round(s.ok/s.n*100)}%`:'まだ未挑戦'}</div></button>`;
}
function renderDrill(){
 const due=dueByBank(),totalDue=sum(Object.values(due)),ms=mistakeStats(),mis=missionCard(flowState()),pb=mis?'gh':'';   // 一本道がのこっているあいだは、おかわりのボタンを控えめに（きょうの つづき が主役）
 const cta=totalDue?`<div class="cta"><div style="flex:1;min-width:220px"><h3>ふくしゅう待ち ${totalDue}問</h3><p>日がたって忘れかけた問題を、先にたおしておこう。</p></div><button class="bt ${pb||'pri xl'}" data-act="drillDue">まとめて10問</button></div>`:`<div class="tomorrow"><span class="lb sm l">ばっちり</span><span>いまの ふくしゅう待ちは ありません。好きな教材で「あたらしい問題」を。</span></div>`;
 let html=`${mis}<div class="card"><span class="lb">ドリル</span><p style="margin:10px 0 2px">好きな教材を、好きなだけ。<b>まちがえた問題は、あした また出る</b>から、まちがえるほど強くなる。</p>
  <p class="mini">きょうのミッションとは別の「おかわり」。ここでの自由練習は1日60XPまで。</p></div>${cta}
  <div class="tsk"><div style="flex:1;min-width:220px"><span class="lb sm o">あたらしい</span><h3 style="margin-top:8px">ツッコミバトル</h3><p class="mini" style="margin:2px 0 0">ライバルの答えは合ってる？ まちがってる？　まちがいを見つけるのが得意なあなたの出番。10問。</p></div><button class="bt ${pb||'cy xl'}" data-act="tsukkomi">やってみる</button></div>
  <div class="row" style="margin:6px 0 4px"><button class="bt cy" data-page="mist">${ico('splat')}ミス図鑑（のこり${ms.open}体）</button></div>`;
 ['数','英','国','理','社'].forEach(s=>{
  const banks=(SUBJ_BANKS[s]||[]).filter(b=>BK[b].items.length);
  const gens=GEN_SUBJ(s);
  html+=`<div class="sec" data-s="${s}"><h2>${SJN[s]}</h2></div><div class="dgrid">${banks.map(b=>bankCard(b,due)).join('')}${gens.map(genCard).join('')}</div>`;
 });
 $('#v-drill').innerHTML=html;
}
function drillSheet(key){
 const [type,id]=key.split(':');
 if(DS.key!==key){DS={key,mode:'due',n:20,lv:0}}
 if(type==='gen'){
  const g=GEN[id],cl=genLv(id),s=S.gs[id];
  if(![5,10,20].includes(DS.n))DS.n=10;
  openSheet(`<h2>${esc(g.name)}</h2><p class="mini">${s&&s.n?`いままで ${s.n}問・正答率 ${Math.round(s.ok/s.n*100)}%。`:''}正答率に合わせて むずかしさ（Lv.1〜3）が自動で変わります。</p>
   <h4>むずかしさ</h4><div class="seg">${[[0,'おまかせ（いまLv.'+cl+'）'],[1,'Lv.1'],[2,'Lv.2'],[3,'Lv.3']].map(x=>`<button data-act="dsLv" data-a="${x[0]}" aria-pressed="${DS.lv===x[0]}">${x[1]}</button>`).join('')}</div>
   <h4>問題数</h4><div class="seg">${[5,10,20].map(n=>`<button data-act="dsN" data-a="${n}" aria-pressed="${DS.n===n}">${n}問</button>`).join('')}</div>
   <p style="text-align:center"><button class="bt pri xl" data-act="drillGo">スタート！</button></p>`);
  return;
 }
 const bk=BK[id],st=bankStats(id),due=dueByBank()[id]||0,weak=weakItems(1,it=>it.bank===id).length,pas=id==='ER'||id==='JR';
 if(![10,20,30].includes(DS.n))DS.n=20;
 openSheet(`<h2>${esc(bk.name)}</h2><p class="mini">${esc(BANK_HINT[id]||'')}　全${st.total}問・出題済み${st.seen}・おぼえた${st.mast}</p>
  <div class="chips" style="display:flex;gap:8px;flex-wrap:wrap;margin:6px 0 10px"><span class="chp ${due?'w':''}">ふくしゅう待ち ${due}</span><span class="chp">にがて ${weak?'あり':'なし'}</span></div>
  ${pas?'<p class="mini">長文は1題（4問）ずつ出ます。</p>':`<h4>どれをやる？</h4><div class="seg">${[['due','ふくしゅう＋あたらしい'],['new','あたらしい問題'],['weak','にがて・ミス']].map(x=>`<button data-act="dsMode" data-a="${x[0]}" aria-pressed="${DS.mode===x[0]}"${x[0]==='weak'&&!weak?' disabled style="opacity:.4"':''}>${x[1]}</button>`).join('')}</div>
  <h4>問題数</h4><div class="seg">${[10,20,30].map(n=>`<button data-act="dsN" data-a="${n}" aria-pressed="${DS.n===n}">${n}問</button>`).join('')}</div>`}
  <p style="text-align:center"><button class="bt pri xl" data-act="drillGo">スタート！</button></p>`);
}
function drillGo(){
 const [type,id]=DS.key.split(':');
 let items;
 if(type==='gen')items=drillItems({type:'gen',id,n:DS.n,lv:DS.lv||0});
 else items=drillItems({type:'bank',id,mode:DS.mode,n:DS.n,fresh:true});
 if(!items.length){toast('この条件の問題がありません');return}
 closeSheet();
 startSession({title:(type==='gen'?GEN[id].name:BK[id].name)+'ドリル',subj:type==='gen'?GEN[id].subj:BK[id].subj,items,skipBrief:true,desc:''});
}

/* ----- ミス図鑑 ----- */
function itemLabel(it){
 switch(it.k){
  case'word':return it.en+'　'+it.ja;case'verb':return it.base+' – '+it.past+' – '+it.pp;case'yomi':return it.w+'（'+it.r+'）';
  case'term':case'syn':return it.w+(it.tag==='対義語'?'　⇔　':it.tag==='類義語'?'　≒　':'：')+it.m;
  case'order':return it.ja;case'seq':return it.seq.join(' → ');case'listen':return it.q;
  default:return String(it.q||'');
 }
}
function mistList(){
 return Object.keys(S.srs).filter(id=>S.srs[id].w>0&&ITEMS[id]).map(id=>({it:ITEMS[id],s:S.srs[id]})).sort((a,b)=>((a.s.b>=4)-(b.s.b>=4))||(b.s.w-a.s.w));
}
function renderMistPage(){
 const ms=mistakeStats(),L=mistList().slice(0,80);
 $('#pg-mist .body').innerHTML=`<div class="res"><div><b>${ms.all}</b><span>登録したミス</span></div><div><b>${ms.dead}</b><span>たおした（箱4以上）</span></div><div><b>${ms.open}</b><span>のこり</span></div></div>
 <p class="mini">まちがえた問題は「あした」「4日後」「8日後」「16日後」…と、だんだん間をあけて また出ます。連続で正解して、箱4に入ったら「たおした」。計算のミスは、<b>数字を変えた同じ型の問題</b>で再戦します（答えを丸おぼえしても たおせません）。</p>
 <div class="row" style="margin:8px 0"><button class="bt pri" data-act="mistDrill"${ms.open?'':' disabled'}>ミスだけで練習（20問）</button></div>
 <div class="card"><h2>学校のテストのミスを登録</h2><p class="mini">テストや宿題でまちがえた問題を、あとで再戦できます。</p>
  <div class="row"><div><label for="msSub">教科</label><select id="msSub">${SJL.map(s=>`<option value="${s}">${SJN[s]}</option>`).join('')}</select></div><div><label for="msKind">原因</label><select id="msKind"><option>知識不足</option><option>理解不足</option><option>ケアレス</option><option>時間不足</option></select></div></div>
  <div class="row" style="margin-top:8px"><input id="msMemo" type="text" placeholder="どんな問題？（例：連立の符号ミス）" style="flex:1;min-width:200px"><button class="bt pri sm" data-act="msAdd">登録 +5XP</button></div></div>
 ${L.length?`<div class="card"><h2>ミス一覧（多い順）</h2>${L.map(x=>`<div class="shop"><span>${sjTag(x.it.subj)} ${esc(itemLabel(x.it).slice(0,70))}</span><span class="chp ${x.s.b>=4?'ok':'w'}">${x.s.b>=4?'たおした':'箱'+x.s.b+'/4'}</span><span class="mini">${x.s.w}回ミス</span></div>`).join('')}${ms.all>80?'<p class="mini">（多い順に80件まで表示）</p>':''}</div>`:'<p class="mini">まだミスはありません。ミスは「伸びしろ」。出たらここに集まります。</p>'}`;
}
