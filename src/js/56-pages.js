/* ===== メニューとサブページ（桜塚高校・診断・教科ガイド・AI先生・ミス図鑑・おうちの人） ===== */
const MENU=[
 ['school','桜塚高校','学校の情報・入試のしくみ・目標ライン','school','#ff5fa8'],
 ['diag','診断・内申シミュレーター','いまの実力と、目標までのきょり','chart','#1ee6ff'],
 ['subj','教科ガイド','教科ごとの作戦・お手本ドリル','book','#ffe81a'],
 ['ai','AI先生チーム','相談・練習・作戦会議の相手（9人）','chat','#b8ff00'],
 ['mist','ミス図鑑','まちがえた問題の一覧と再戦','splat','#ff8f1f'],
 ['family','おうちの人・設定','週報・バックアップ・チームカラー','user','#a98bff']];
function renderMenu(){
 $('#v-menu').innerHTML=`<div class="card"><span class="lb">メニュー</span><div class="mtiles">${MENU.map(m=>`<button class="mtile" data-page="${m[0]}" style="--mc:${m[4]}"><span class="mi">${ico(m[3])}</span><b>${m[1]}</b><span>${m[2]}</span></button>`).join('')}</div></div>
 <div class="card"><h2>このアプリの使いかた</h2><ol class="steps">
  <li><b>ホーム</b>を開く。「いま やること」のカードの<b>スタート！</b>を押すだけ。</li>
  <li>問題に答える。まちがえた問題は、すぐ もう一度出る。<b>5問ごとにラウンドクリア</b>。あしたも「ミス退治」で再戦。</li>
  <li>ドリルを<b>1つクリアで合格ライン</b>（れんぞく記録セーフ。ふつう以上は2つ）。ぜんぶクリアで大ボーナス。</li>
  <li>XPで<b>ランク</b>が上がり、コインで<b>ごほうび</b>と交換。やった日が<b>マップ</b>に ぬられていく。</li></ol>
  <p class="mini">iPadは Safari の共有ボタン →「ホーム画面に追加」で、アプリのように全画面で使えます。記録はこのiPadの中に保存されます（月1回、バックアップを）。</p></div>`;
}
let PG='';
function openPage(id){
 if(!$('#pg-'+id))return;
 PG=id;$$('.pg').forEach(p=>p.hidden=p.id!=='pg-'+id);
 if(id==='diag'){renderNai();renderDg();renderDiagOut()}
 if(id==='subj')renderSubj();
 if(id==='ai')renderAgents();
 if(id==='family')initInputs();
 if(id==='mist')renderMistPage();
 document.body.style.overflow='hidden';
 const p=$('#pg-'+id);p.scrollTop=0;
}
function closePage(){PG='';$$('.pg').forEach(p=>p.hidden=true);document.body.style.overflow='';refresh()}

/* ----- 診断 ----- */
const ADV={A:{s:'桜塚レベルの入口',t:'標準問題を確実に。B問題の過去問や応用問題に早めに挑戦しよう。'},B:{s:'標準の力',t:'教科書レベルを完璧にして、ミスの原因をつぶすのが近道。'},C:{s:'基礎からやり直し',t:'中1の内容から、短く毎日。基礎のぬけを埋めるチャンス。'}};
const lvl=(sc,n)=>sc>=n-1?'A':sc>=Math.ceil(n/2)?'B':'C';
function renderNai(){
 const sel=(g,s)=>`<select data-nai="${g}|${s}" aria-label="${s}の${g==='a'?'中1':'中2'}の評定"><option value="">－</option>${[5,4,3,2,1].map(v=>`<option value="${v}" ${+S.nai[g][s]===v?'selected':''}>${v}</option>`).join('')}</select>`;
 $('#naiBox').innerHTML='<b></b><b>中1（確定）</b><b>中2（最新）</b>'+NAI_SUBJ.map(s=>`<span>${s}</span>${sel('a',s)}${sel('b',s)}`).join('');
 $('#naiT3').value=S.nai.t3;$('#naiGk').value=S.nai.gk;naiOut();renderNaiLog();
}
/* 内申・学力検査の点から、総合点を計算する（通常枠＝学力検査×1.4＋内申点×0.6） */
function naiCalc(){
 const est=o=>{const v=NAI_SUBJ.map(s=>+o[s]).filter(Boolean);return v.length?sum(v)/v.length*9:0};
 let a=est(S.nai.a),b=est(S.nai.b);const c=+S.nai.t3,g=+S.nai.gk;
 const na=NAI_SUBJ.filter(s=>+S.nai.a[s]).length,nb=NAI_SUBJ.filter(s=>+S.nai.b[s]).length;
 if(!a)a=27;if(!b)b=27;
 const nn=a*2+b*2+c*6;
 return{c,g,na,nb,nn,tot:g*1.4+nn*.6,tk:g*.6+nn*1.4};
}
function naiOut(){
 const {c,g,na,nb,nn,tot,tk}=naiCalc(),line=NAI_LINE,safe=NAI_SAFE;
 $('#naiT3v').textContent=c+'/45（平均'+(c/9).toFixed(1)+'）';$('#naiGkv').textContent=g+'/450（'+Math.round(g/4.5)+'%）';
 const msg=tot>=safe?`安全圏の目安（約${safe}点）をこえています。この目標を落とさないことが大事。`:tot>=line?`合格圏の目安（約${line}点）に届いています。あと${Math.ceil(safe-tot)}点で安全圏。`:`合格圏の目安（約${line}点）まで、あと${Math.ceil(line-tot)}点。学力検査をあと${Math.ceil((line-tot)/1.4)}点、または中3の評定合計をあと${Math.ceil((line-tot)/3.6)}点のばす計算。`;
 $('#naiOut').innerHTML=`<div class="res"><div><b>${nn.toFixed(0)}</b><span>内申点<i>450点満点</i></span></div><div><b>${tot.toFixed(0)}</b><span>総合点（通常枠）<i>900点満点・タイプⅠ</i></span></div><div><b>${tk.toFixed(0)}</b><span>特色枠の点（参考）<i>900点満点</i></span></div></div><p>${msg}</p><p class="mini">${na<9||nb<9?`入力した評定は中1が${na}/9教科、中2が${nb}/9教科。未入力ぶんは、入力した教科の平均（ゼロのときは3.0）で補って計算しています。`:''}通常枠＝学力検査×1.4＋内申点×0.6。特色枠は上位10%だけが先に合格するので、点数は参考です。</p>`;
}
const renderNaiLog=()=>{const el=$('#naiLog');if(!el)return;const v=($('#naiLabel')||{}).value;el.innerHTML=naiLogHTML();if(v)$('#naiLabel').value=v};
let dgFb=false;
function renderDg(){
 $('#dgTabs').innerHTML=SJL.map(s=>`<button class="bt sm" data-act="dgTab" data-a="${s}" aria-pressed="${S.dg===s}">${SJN[s]}${S.diag[s]&&S.diag[s].done?' ✓':''}</button>`).join('');
 const s=S.dg,list=DIAG[s],n=list.length,r=S.diag[s]||(S.diag[s]={ans:[],sc:0});
 if(r.done&&!dgFb){const L=lvl(r.sc,n);$('#quizBox').innerHTML=`<div class="res"><div><b>${r.sc}/${n}</b><span>${SJN[s]}の得点</span></div><div><b>${L}</b><span>${ADV[L].s}</span></div></div><p>${ADV[L].t}</p><button class="bt" data-act="dgAgain">もう一度やる</button>`;return}
 const qi=dgFb?r.ans.length-1:r.ans.length,q=list[qi],ch=dgFb?r.ans[qi]:-1;
 $('#quizBox').innerHTML=`<p class="mini">${SJN[s]}　${qi+1}/${n}　<span class="chp">${q.l}</span></p><p style="white-space:pre-wrap"><b>${esc(q.q)}</b></p>`+q.o.map((o,j)=>`<button class="opt${dgFb&&j===q.a?' ok':dgFb&&j===ch?' ng':''}" data-act="dgPick" data-a="${j}" ${dgFb?'disabled':''}>${'ABCD'[j]}．${esc(o)}</button>`).join('')+(dgFb?`<div class="exp"><b>${ch===q.a?'正解！':'おしい！'}</b>　${esc(q.e)}</div><p><button class="bt pri" data-act="dgNext">${r.ans.length>=n?'結果を見る':'つぎへ'}</button></p>`:'');
}
function radar(v){
 const cx=150,cy=140,R=100,pt=(i,k)=>{const a=-Math.PI/2+i*2*Math.PI/5;return[cx+Math.cos(a)*R*k,cy+Math.sin(a)*R*k]};
 const poly=k=>SJL.map((_,i)=>pt(i,k).map(x=>x.toFixed(1)).join(',')).join(' ');
 const me=SJL.map((_,i)=>pt(i,Math.max(v[i],.04)).map(x=>x.toFixed(1)).join(',')).join(' ');
 return `<svg class="radar" viewBox="0 0 300 290" role="img" aria-label="5教科の診断レーダー">${[.33,.66,1].map(k=>`<polygon points="${poly(k)}" fill="none" stroke="rgba(255,255,255,.25)"/>`).join('')}${SJL.map((_,i)=>{const p=pt(i,1);return `<line x1="${cx}" y1="${cy}" x2="${p[0].toFixed(1)}" y2="${p[1].toFixed(1)}" stroke="rgba(255,255,255,.2)"/>`}).join('')}<polygon points="${poly(5/6)}" fill="none" stroke="#ffe81a" stroke-dasharray="5 4" stroke-width="2"/><polygon points="${me}" fill="var(--team)" fill-opacity=".35" stroke="var(--team)" stroke-width="3"/>${SJL.map((s,i)=>{const p=pt(i,1.2);return `<text x="${p[0].toFixed(1)}" y="${(p[1]+5).toFixed(1)}" text-anchor="middle" font-size="14" font-weight="900" style="fill:#fff">${SJN[s]}</text>`}).join('')}<text x="150" y="284" text-anchor="middle" font-size="11" style="fill:#c4bdf2">点線＝桜塚レベルの入口（6問中5問）</text></svg>`;
}
function renderDiagOut(){
 if(!SJL.some(s=>S.diag[s]&&S.diag[s].done)){$('#diagOut').innerHTML='<p class="mini">ミニ診断を受けると、ここにレーダーチャートと「最初にやること」が出ます。</p>';return}
 const v=SJL.map(s=>S.diag[s]&&S.diag[s].done?S.diag[s].sc/DIAG[s].length:0);
 $('#diagOut').innerHTML=radar(v)+`<div class="tw"><table><tr><th>教科</th><th>得点</th><th>レベル</th><th>最初にやること</th></tr>${SJL.map(s=>{const r=S.diag[s];if(!r||!r.done)return `<tr><th>${SJN[s]}</th><td colspan="3" class="mini">未受験</td></tr>`;const L=lvl(r.sc,DIAG[s].length);return `<tr><th>${SJN[s]}</th><td>${r.sc}/${DIAG[s].length}</td><td><span class="chp ${L==='A'?'ok':L==='B'?'':'w'}">${L}</span> ${ADV[L].s}</td><td>${ADV[L].t}</td></tr>`}).join('')}</table></div><p class="mini">A＝桜塚レベルの入口／B＝標準の力／C＝基礎からやり直し。6問のミニ診断なので、目安として使ってください。</p>`;
}
function dgPick(j){
 const r=S.diag[S.dg],list=DIAG[S.dg];if(dgFb||r.done)return;
 const qi=r.ans.length;r.ans.push(j);if(j===list[qi].a)r.sc++;dgFb=true;
 let res=null;
 if(r.ans.length>=list.length){
  r.done=1;r.at=today();if(!r.paid){r.paid=1;res=addXP(10);toast(SJN[S.dg]+'の診断　+10XP')}
  const st=S.rt&&S.rt.d===today()?S.rt.stg.find(x=>x.id==='diag'&&x.subj===S.dg):null;   // きょうのルートの診断ステージを、クリアにする
  if(st)completeStage(today(),'diag',{ok:r.sc,n:0,sec:0,min:3});
 }
 const nb=checkBadges();nb.forEach(b=>setTimeout(()=>toast('バッジ獲得：'+b[1]),1200));
 save();renderDg();renderDiagOut();renderHud();if(res)levelUp(res.to);
}

/* ----- 教科ガイド ----- */
function renderSubj(){
 if(!SJ.some(x=>x.id===S.sj))S.sj='数';
 $('#sjTabs').innerHTML=SJL.map(s=>`<button class="bt sm" data-act="sjTab" data-a="${s}" aria-pressed="${S.sj===s}">${SJN[s]}</button>`).join('');
 const a=SJ.find(x=>x.id===S.sj),dg=S.diag[a.id],L=dg&&dg.done?lvl(dg.sc,DIAG[a.id].length):null;
 const li=arr=>arr.map(x=>`<li>${x}</li>`).join('');
 $('#sjBody').innerHTML=`<div class="card"><div class="rowh"><h2 style="margin:0">${SJN[a.id]}の作戦</h2>${L?`<span class="chp ${L==='A'?'ok':L==='B'?'':'w'}">診断：${L}（${ADV[L].s}）</span>`:'<span class="chp">診断：未受験</span>'}</div>
 <p><b>目標：</b>${a.goal}</p>
 <div class="grid"><div><h4>1週間のリズム</h4><ul>${li(a.rhythm)}</ul></div><div><h4>ドリルの型</h4><ul>${li(a.kata)}</ul></div></div>
 <h4>つまずきTOP3と直し方</h4><div class="tw"><table class="k">${a.traps.map(t=>`<tr><th>${t[0]}</th><td>${t[1]}</td></tr>`).join('')}</table></div>
 <h4>章ごとの課題</h4><div class="tw"><table class="k">${a.ph.map((x,i)=>`<tr><th>第${i+1}章</th><td>${x}</td></tr>`).join('')}</table></div>
 <h4>iPadの使い方</h4><p>${a.ipad}</p>
 <h4>AI先生へのたのみ方</h4>${a.ask.map(x=>`<div class="say">${x}</div>`).join('')}
 <p style="margin-top:12px"><button class="bt pri" data-tab="drill" data-close="1">${SJN[a.id]}のドリルをやる</button></p></div>
 <div class="card"><h2>お手本ドリル（解説つき）</h2><p class="mini">まず自分で解いて、「解説を見る」をタップ。練習問題も同じ型で。</p>
 ${a.ex.map((e,i)=>`<details class="fold"><summary>${i+1}．${e.t}</summary><div class="say"><b>問題</b>　${e.q}</div><details class="fold"><summary>解説を見る</summary><ol>${li(e.s)}</ol><div class="say"><b>答え</b>　${e.a}</div><p><b>練習</b>　${e.pq}</p><details class="fold"><summary>練習の答え</summary><div class="say">${e.pa}</div></details></details></details>`).join('')}</div>`;
 $('#wkTable').innerHTML='<tr><th>曜日</th><th>今日の教科</th><th>やり方</th></tr>'+WK.slice(1).concat([WK[0]]).map(w=>`<tr><th>${w[0]}</th><td>${w[1]}</td><td>${w[2]}</td></tr>`).join('');
}

/* ----- AI先生 ----- */
function renderAgents(){
 $('#agents').innerHTML=AGENTS.map((a,i)=>`<div class="card ag" style="margin:0"><div class="rowh"><span class="disk" style="--c:${a.c}">${a.mark}</span><div style="min-width:0"><h3>${a.name}</h3><div class="mini">${a.role}</div></div></div>
 <p class="mini"><b>呼ぶとき：</b>${a.when}</p>
 <div><b class="mini">最初の一言の例</b>${a.starter.map(x=>`<div class="say">${esc(x)}</div>`).join('')}</div>
 <div class="row" style="align-items:center"><button class="bt pri sm" data-act="cpAg" data-a="${i}">設定をコピー</button><span class="mini" id="cpm${i}"></span></div>
 <details><summary class="mini">設定の中身を見る</summary><pre class="code">${esc(COMMON+'\n\n'+a.body)}</pre></details></div>`).join('');
}

/* ----- 設定・バックアップ ----- */
function initInputs(){
 $('#setNick').value=S.nick;$('#setExam').value=S.exam;
 $('#setTeam').innerHTML=Object.keys(TEAMS).map(k=>`<button data-act="team" data-a="${k}" aria-pressed="${S.team===k}"><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:${TEAMS[k][0]};border:2px solid #000;vertical-align:-2px;margin-right:6px"></span>${TEAMS[k][1]}</button>`).join('');
 $('#setSound').setAttribute('aria-pressed',String(!!S.sound));
 $('#setTier').innerHTML=[['auto','おまかせ'],[1,'ならし'],[2,'ふつう'],[3,'しっかり']].map(x=>`<button data-act="tierSet" data-a="${x[0]}" aria-pressed="${String(S.tier)===String(x[0])}">${x[1]}</button>`).join('');
 $('#setPin').value=S.pin||'';$('#setPinOn').setAttribute('aria-pressed',String(!!(S.pinOn&&S.pin)));
 $$('[data-memo]').forEach(i=>i.value=S.memo[i.dataset.memo]||'');
}
function reloadAll(){
 restoreGx();applyTeam();paintBg();renderHud();initInputs();
}
