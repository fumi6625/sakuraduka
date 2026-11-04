/* ===== ごほうび：ランク・コイン・交換・ガチャ・宝箱・バッジ（買い物はしない。時間・権利・体験・ことば） ===== */
let editK='',gcBusy=false,gcLast='',rwEdit=false;
function renderReward(){
 const L=lvInfo(S.xp),nr=RANKS.find(r=>r[0]>L.lv),rl=(S.rlog||[]).slice(-6).reverse();
 $('#v-reward').innerHTML=`<div class="${rwEdit?'editing':''}"><div class="rwe"><button class="bt sm gh" data-act="rwEdit">${rwEdit?'編集をおわる':'編集する（保護者用）'}</button></div>
 <div class="card lvcard"><div class="lvrow">${lvHex(L.lv,96)}<div style="min-width:0"><span class="lb">いまのランク</span><h2 style="margin-top:10px;font-size:28px">${esc(L.name)}</h2><p class="mini" style="margin:2px 0 0">${nr?'Lv.'+nr[0]+' で「'+nr[1]+'」':'最高ランク！'}</p></div></div>
  <div class="tank" style="margin-top:12px"><i style="--w:${Math.round(L.pct*100)}%"></i></div>
  <p class="mini">${L.hi?`つぎのレベルまで あと ${L.hi-S.xp} XP（いま ${S.xp} XP）`:`いま ${S.xp} XP　最高レベル！`}</p>
  <div class="res"><div><b>${S.coin}</b><span>コイン</span></div><div><b>${S.xp}</b><span>XP（ずっと残る）</span></div><div><b>${S.freeze}</b><span>お休みトークン</span></div></div>
  <p class="mini">XPは消えない経験値。コインはXPと同時にたまり、下の「ごほうび」と交換できる。1日クリアで およそ100コイン。</p></div>
 <div class="grid">
  <div class="card"><h2>ごほうびリスト</h2><p class="mini">コインで交換。中身は「時間・権利・いっしょの体験・ことば」。買い物はしない。</p><div id="shop">${S.shop.map((s,i)=>`<div class="shop"><span>${esc(s.n)}</span><b class="px" style="color:var(--yellow-t)">${s.c}</b><button class="bt sm" data-act="shBuy" data-a="${i}" ${S.coin<s.c?'disabled':''}>こうかん</button><button class="bt sm gh del editonly" data-act="shDel" data-a="${i}" aria-label="削除">×</button></div>`).join('')}</div>
   <div class="row editonly" style="margin-top:10px"><input id="shN" type="text" placeholder="ごほうびの名前" style="flex:1;min-width:150px"><input id="shC" type="number" min="10" step="10" value="100" style="width:96px"><button class="bt sm" data-act="shAdd">追加</button></div>
   <p class="mini">中身は親子で決める。ゲームや動画の時間は「事前に決めた長さ」だけ。</p>
   ${rl.length?`<h4>こうかんの記録</h4>${rl.map(x=>`<div class="mini">${dateJa(x.d)}　${esc(x.n)}</div>`).join('')}`:''}</div>
  <div class="card"><h2>ごほうびガチャ（150コイン）</h2><div class="gacha" id="gcOut">${gcLast?esc('『'+gcLast+'』！'):'？'}</div>
   <div class="row" style="justify-content:center"><button class="bt pri xl" data-act="gacha" ${S.coin<150?'disabled':''}>まわす！</button></div>
   <h4>景品リスト</h4><div id="gcList" class="gcl">${S.gacha.map((g,i)=>`<span class="chp">${esc(g)} <a href="#" class="editonly" data-act="gcDel" data-a="${i}" aria-label="削除" style="text-decoration:none;padding:10px;font-size:18px">×</a></span>`).join(' ')}</div>
   <div class="row editonly" style="margin-top:8px"><input id="gcN" type="text" placeholder="景品を追加" style="flex:1;min-width:150px"><button class="bt sm" data-act="gcAdd">追加</button></div></div>
 </div>
 <div class="card"><h2>宝箱（月・章のごほうび）</h2><p class="mini">月のマイルストーンを80%こえると開く。保護者と相談して書きかえてOK。【】は章のクリア報酬。</p><div id="chests">${ROADMAP.map(m=>{const st=mStat(m),open=!!S.mc[m.k],got=!!S.got[m.k];
  const body=editK===m.k?`<span style="flex:1;min-width:200px"><b>${m.label}</b><br><input id="chIn" type="text" value="${esc(rwText(m))}" style="width:100%"></span><button class="bt sm pri" data-act="chSave" data-a="${m.k}">保存</button>`
   :`<span style="flex:1;min-width:200px"><b>${m.label}</b>　${esc(rwText(m))}<br><span class="mini">${open?'宝箱が開いた！':'マイルストーン '+st.d+'/'+st.n+'（80%で開く）'}</span></span>${open?`<button class="bt sm ${got?'':'pri'}" data-act="chGot" data-a="${m.k}">${got?'受けとり済み':'受けとった'}</button>`:`<span class="chp">${ico('lock')}ロック中</span>`}<button class="bt sm gh editonly" data-act="chEdit" data-a="${m.k}">書きかえ</button>`;
  return `<div class="shop">${body}</div>`}).join('')}</div></div>
 <div class="card"><h2>バッジ　<span class="mini">${Object.keys(S.badges).length}/${BADGES.length}</span></h2><div class="badges">${BADGES.map(b=>`<div class="bd ${S.badges[b[0]]?'on':''}"><i>${S.badges[b[0]]?'★':'🔒'}</i><b>${b[1]}</b><span>${b[2]}</span></div>`).join('')}</div></div>
 <div class="card"><h2>ごほうびの5つのルール</h2><ol>
  <li>前もって決めて、紙かこのページに書く。後から変えない。</li><li>結果（点数）だけでなく、やったこと（行動）にも出す。</li><li>決めたごほうびは、24時間以内に渡す。</li><li>点数が悪くても、もらったごほうびは取りあげない。</li><li>買い物はごほうびにしない。使うのは「時間・権利・いっしょの体験・ことば」だけ。</li></ol></div></div>`;
}
function logReward(n,c){S.rlog=S.rlog||[];S.rlog.push({d:today(),n,c});if(S.rlog.length>60)S.rlog.shift()}
