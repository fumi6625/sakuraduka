/* ===== 合格への道のり（めやす）の表示：マップのカード・ホームのミニカード・テスト記録 ===== */
/* 週ごとの「道のり」の折れ線（あなた）と、予定の線 */
function sparkSVG(){
 const ks=Object.keys(S.kh).sort();if(ks.length<2)return'';
 const me=ks.map(k=>S.kh[k]),pl=ks.map(k=>planFracN(dn(k)+6)),mx=Math.max(.12,...me,...pl)*1.12;
 const w=600,h=120,px=i=>12+i*(w-24)/(ks.length-1),py=v=>h-10-clamp(v,0,mx)*(h-20)/mx;
 const pts=a=>a.map((v,i)=>px(i).toFixed(1)+','+py(v).toFixed(1)).join(' ');
 return `<svg class="spark" viewBox="0 0 ${w} ${h}" role="img" aria-label="道のりの変化（週ごと）"><line x1="12" y1="${h-10}" x2="${w-12}" y2="${h-10}" stroke="rgba(255,255,255,.25)" stroke-width="2"/><polyline points="${pts(pl)}" fill="none" stroke="var(--yellow)" stroke-width="4" stroke-dasharray="10 8" opacity=".95"/><polyline points="${pts(me)}" fill="none" stroke="var(--team)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${px(ks.length-1).toFixed(1)}" cy="${py(me[me.length-1]).toFixed(1)}" r="9" fill="var(--team)" stroke="#000" stroke-width="3"/></svg><p class="mini" style="margin:0">折れ線：あなた（${ks.length}週間）／黄色のてんせん：予定</p>`;
}
function pathCard(){
 const P=pathNow(),m=pathMsg(P),pc=P.pace,pw=Math.round(pc.perWeek*10)/10;
 const rows=PSUBJ.map(s=>{const o=P.per[s];return `<div class="prow"><span class="pl">${SJN[s]}</span><div class="tank sm pb" style="--w:${Math.min(100,o.pct*100).toFixed(1)}%;--p:${(Math.min(1,o.plan)*100).toFixed(1)}%"><i></i></div><span class="pv">${pctTxt(o.pct)}</span></div>`}).join('');
 const proj=P.state==='early'?'2週間つづけると、入試の日までの見こみが出ます。':`このペース（週${pw}日${pc.acc!=null?'・正答率'+Math.round(pc.acc*100)+'%':''}）で入試の日まで続けると、予定の約<b>${pctTxt(P.proj)}</b>。${P.pf<1&&P.proj5>P.proj+.02?`週5日にすると、約<b>${pctTxt(P.proj5)}</b>。`:''}`;
 const last=S.tl.length?S.tl[S.tl.length-1]:null;
 const tl=last?`<p>最近のテスト・模試（${dateJa(last.d)}・${esc(last.label)}）：<b>${last.tot}点</b>　${last.tot>=NAI_SAFE?'安全圏のめやす（約'+NAI_SAFE+'点）をこえています。':last.tot>=NAI_LINE?'合格圏のめやす（約'+NAI_LINE+'点）。あと'+(NAI_SAFE-last.tot)+'点で安全圏。':'合格圏のめやす（約'+NAI_LINE+'点）まで、あと'+(NAI_LINE-last.tot)+'点。'}<span class="chp w">推定</span></p>`:`<p class="mini">テストや模試の点を記録すると、ここに「合格圏のめやすまで あと◯点」が出ます。</p>`;
 return `<div class="card path"><span class="lb">合格への道のり</span> <span class="chp w">めやす</span>
  <div class="ptop">${ring(clamp(P.f,0,1),ringTxt(P.f))}<div><b>${esc(m.head)}</b><span class="mini">${esc(m.sub)}</span></div></div>
  ${rows}<p class="mini" style="margin:2px 0 8px"><i class="ptick"></i>黄色い線＝きょうの予定。バーが線より右なら、予定より先。</p>
  ${sparkSVG()}
  <p>${proj}</p>${trendTxt()?`<p class="mini">${trendTxt()}</p>`:''}${tl}
  <p style="margin-top:8px"><button class="bt sm" data-page="diag">${ico('chart')}テストの点を記録する</button></p>
  <details class="fold"><summary>この見かたについて</summary>
   <p class="mini">「道のり」は、アプリの問題を どれだけ身につけたかを、点数にして表したものです。入試の日の予定（週5日・正答率85%でつづけた場合）を100%としています。</p>
   <p class="mini">推定のめやすで、<b>合格をほしょうするものではありません</b>。応用問題・過去問・作文などは入っていません。本当の実力は、学校のテストや模試の点で確かめてください。</p></details></div>`;
}
function pathMini(){
 const P=pathNow(),m=pathMsg(P);
 return `<button class="card pm" data-tab="map" aria-label="合格への道のり。くわしくはマップ"><span class="pmr">${ring(clamp(P.f,0,1),ringTxt(P.f))}</span><span class="pmt"><span class="lb sm c">合格への道のり</span><b>${esc(m.head)}</b><span class="mini">${esc(m.sub)}</span></span></button>`;
}
/* ----- テスト・模試の記録（診断ページ） ----- */
function naiLogHTML(){
 const L=S.tl.slice(-8).reverse();
 const rows=L.map(x=>`<div class="trow"><span class="mini">${dateJa(x.d)}<br>${esc(x.label)}</span><div class="tank sm tb" style="--w:${Math.min(100,x.tot/9).toFixed(1)}%;--p1:${NAI_LINE/9}%;--p2:${NAI_SAFE/9}%"><i></i></div><b>${x.tot}</b></div>`).join('');
 return `<div class="tlog"><h3 style="margin:14px 0 4px">テスト・模試の記録</h3>
  <p class="mini">学校のテストや模試が返ってきたら、上の「評定」と「学力検査の得点」を<b>実際の結果</b>にそろえてから、記録します（模試は5教科合計×0.9が目安）。おうちの人が確かめてから。</p>
  <div class="row"><select id="naiLabel" aria-label="記録の種類"><option>学校のテスト</option><option>校外の模試</option><option>通知表</option><option>自分で見積もり</option></select><button class="bt sm" data-act="naiLog">いまの総合点を記録する</button>${rows?'<button class="bt sm" data-act="naiUndo">いちばん新しい記録を消す</button>':''}</div>
  ${rows?`<div class="tlh mini">棒の黄色い線：合格圏のめやす（約${NAI_LINE}点）と安全圏のめやす（約${NAI_SAFE}点）。どちらも推定で、公式の合格ラインではありません。</div>${rows}`:'<p class="mini">まだ記録がありません。記録がたまると、点数の伸びが見えます。</p>'}</div>`;
}
