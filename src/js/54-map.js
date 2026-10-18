/* ===== マップ：ナワバリマップ（500日をぬりつぶす）とロードマップ ===== */
const START_DAY='2026-10-18';
const openM=new Set();let mapInit=false;
const ring=p=>`<svg class="ring" viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="6"/><circle cx="22" cy="22" r="18" fill="none" stroke="var(--team)" stroke-width="6" stroke-linecap="round" stroke-dasharray="${(113.1*p).toFixed(1)} 113.1" transform="rotate(-90 22 22)"/><text x="22" y="26.5" text-anchor="middle" font-size="12" font-weight="900" style="fill:#fff">${Math.round(p*100)}</text></svg>`;
const goalsHTML=m=>m.g.map((g,i)=>{const on=!!S.ms[gid(m.k,i)];return `<button class="q" data-act="goal" data-a="${m.k}|${i}" aria-pressed="${on}"><span class="box">${on?'✓':''}</span><span><b>${esc(g[0])}</b></span><span class="xp">+${g[1]}</span></button>`}).join('');
function turfHTML(){
 const t=today(),exam=S.exam,months=[];
 for(let y=2026,m=10;y<2028||m<=3;){months.push(y+'-'+pad(m));m++;if(m>12){m=1;y++}if(y===2028&&m>3)break}
 return `<div class="turf">${months.map(k=>{
  const [y,m]=k.split('-').map(Number),nd=new Date(y,m,0).getDate();
  let cells='';
  for(let d=1;d<=31;d++){
   const ds=k+'-'+pad(d);
   if(d>nd||ds<START_DAY){cells+='<span class="tl x"></span>';continue}
   let c;
   if(ds===exam)c='exam';
   else if(ds>t)c='fut';
   else{const st=dayState(ds);c=st==='none'?'mis':st}
   if(ds===t)c+=' today';
   cells+=`<span class="tl ${c}" aria-hidden="true"></span>`;
  }
  return `<div class="mr"><span class="ml">${String(y).slice(2)}/${pad(m)}</span><div class="ms">${cells}</div></div>`}).join('')}</div>
  <div class="lg" style="margin-top:12px"><span><i style="background:var(--team);box-shadow:0 0 6px var(--team)"></i>ぜんぶクリア</span><span><i style="background:rgba(var(--team-rgb),.78)"></i>合格ライン</span><span><i style="background:rgba(var(--team-rgb),.38)"></i>ちょっとやった</span><span><i style="background:#2b2166"></i>おやすみ</span><span><i style="background:var(--yellow)"></i>入試</span></div>`;
}
function renderMap(){
 const T=totals(),t=today(),base=S.start&&S.start>START_DAY?S.start:START_DAY,el=Math.max(1,diff(base,t)+1),total=diff(START_DAY,S.exam)+1;
 const okSince=Object.keys(S.days).filter(d=>d>=base&&S.days[d].ok).length,rate=Math.min(100,Math.round(okSince/el*100));
 if(!mapInit){openM.add(curMonth());mapInit=true}
 $('#v-map').innerHTML=`<div class="card"><span class="lb">ナワバリマップ</span>
  <h2 style="margin-top:10px">500日を、ぜんぶ ぬりつぶせ！</h2>
  <p class="mini">1マス＝1日。合格ライン（2ステージ以上）をこえた日が、あなたの色にぬられていく。入試の日（黄色）まで、${Math.max(0,diff(t,S.exam))}日。</p>
  <div class="res"><div><b>${T.ok}<small>/${total}日</small></b><span>ぬった日</span></div><div><b>${rate}<small>%</small></b><span>ぬった率</span></div><div><b>${T.full}<small>日</small></b><span>ぜんぶクリア</span></div><div><b>${S.streak}<small>日</small></b><span>れんぞく（最高${S.best}）</span></div></div>
  <div class="res"><div><b>${T.n}<small>問</small></b><span>答えた問題</span></div><div><b>${T.n?Math.round(T.acc*100):0}<small>%</small></b><span>せいかい率</span></div><div><b>${T.mastered}<small>問</small></b><span>おぼえた問題</span></div><div><b>${T.hours.toFixed(1)}<small>時間</small></b><span>勉強した時間</span></div></div>
  ${turfHTML()}</div>
  <div class="sec"><h2>4つの章</h2></div><div class="grid" id="phases">${PH.map(p=>`<div class="card" style="margin:0"><span class="lb sm c">第${p.n}章</span><h3 style="margin-top:8px">${p.name}</h3><p class="mini">${p.span}</p><p>${p.aim}</p><p class="mini">学習時間の目安：${p.time}</p></div>`).join('')}</div>
  <div class="sec"><h2>月ごとのマイルストーン</h2></div>
  <p class="mini">学校のテストの時期は学校ごとにちがうので、月の目標は学校の年間予定にあわせてスライドしてOK。80%こえると宝箱が開く。</p>
  <div id="months">${ROADMAP.map(m=>{const st=mStat(m),cur=curMonth();
   return `<details class="m" data-k="${m.k}" data-now="${m.k===cur?1:0}" ${openM.has(m.k)?'open':''}><summary>${ring(st.p)}<span style="min-width:0"><b class="px">${m.label}</b> <span class="chp">第${m.ph}章</span>${S.mc[m.k]?'<span class="chp ok">クリア</span>':''}<br><span class="mini">${esc(m.th)}</span></span><span class="mini sp">${st.d}/${st.n}</span></summary><div class="mb"><p>${esc(m.intro)}</p>${goalsHTML(m)}<h4>教科のフォーカス</h4><div class="tw"><table class="k">${SJL.map((s,i)=>`<tr><th>${SJN[s]}</th><td>${esc(m.s[i])}</td></tr>`).join('')}</table></div><p style="margin-top:10px"><span class="chp w">関所・ボス</span> ${esc(m.boss)}</p><p><span class="chp xp">宝箱</span> ${esc(rwText(m))}</p></div></details>`}).join('')}</div>`;
}
function tileInfo(ds){
 const r=S.days[ds];
 if(!r||(!stageKeys(r).length&&!r.dx))return dateJa(ds)+'：おやすみ';
 const mins=sum(Object.values(r.min||{}));
 return dateJa(ds)+'：'+stageKeys(r).length+'ステージ・'+(r.n||0)+'問'+(r.n?'・正解'+Math.round((r.c||0)/r.n*100)+'%':'')+(mins?'・'+fmtMin(mins):'')+(r.full?'　全クリ！':'');
}
