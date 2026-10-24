/* ===== 画面の共通部品：アイコン・インクの飛沫・音・読み上げ・演出 ===== */
/* 色を白とまぜてやわらかくする（先生ごとのこい色を、明るいテーマの画面にあわせて使う） */
const soft=(hex,k=.55)=>{const n=parseInt(String(hex).replace('#',''),16);if(isNaN(n))return hex;const m=c=>Math.round(c+(255-c)*k);return 'rgb('+m(n>>16&255)+','+m(n>>8&255)+','+m(n&255)+')'};
const THEMES=[['normal','ふつう','白っぽい地・ほどよい色','#faf6ea','#ffffff','#f46e67','#254033',0],['soft','やさしい','クリーム地のパステル','#fdf3ec','#ffffff','#f7a9a3','#466455',0],['neon','ネオン','暗い地にあざやかな光（前の版）','#0a1714','#2f534a','#ff3f3d','#000000',1],['night','よる','落ち着いた暗い色','#17372a','#25523f','#e88179','#07110c',1],['pop','くっきり','白地に黒い線・あざやか','#fbfaf6','#ffffff','#ff5d5a','#111f18',0]];   // [キー, 名前, ひとこと, 地の色, カードの色, アクセント, 線の色, 暗い地か]  色の中身は style.css の html[data-theme=…]
const TEAMS={pink:['var(--t-pink)','ピンク'],lime:['var(--t-lime)','ライム'],cyan:['var(--t-cyan)','シアン'],orange:['var(--t-orange)','オレンジ'],purple:['var(--t-purple)','パープル']};
const ICO={
 home:'M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10',bolt:'M13 2L4 14h7l-1 8 9-12h-7z',flag:'M5 3v18M5 4h11l-2 4 2 4H5',
 gift:'M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7C10 3 6 4 7.5 7M12 7c2-4 6-3 4.5 0',menu:'M4 6h16M4 12h16M4 18h16',
 book:'M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 19V5M8 7h7',brain:'M7 5h9a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2zM9 10h6M9 14h4M3 8v9',
 calc:'M5 3h14v18H5zM8 7h8M8 12h2M12 12h2M8 16h2M12 16h2M16 12v4',star:'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',
 splat:'M5 20V10a7 7 0 0114 0v10l-3-2-2 2-2-2-2 2-2-2-3 2zM9.5 10.5v1.5M14.5 10.5v1.5',pen:'M4 20l1-4L16 5l3 3L8 19zM14 7l3 3',
 check:'M5 12l5 5 9-10',lock:'M6 11h12v9H6zM8 11V8a4 4 0 018 0v3',play:'M7 4l13 8-13 8z',vol:'M4 9v6h4l5 4V5L8 9zM16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11',
 close:'M6 6l12 12M18 6L6 18',back:'M15 5l-7 7 7 7',timer:'M12 8v5l3 2M9 2h6M12 4a8 8 0 100 16 8 8 0 000-16z',
 flask:'M9 3h6M10 3v6L5 19a2 2 0 002 2h10a2 2 0 002-2l-5-10V3M8 15h8',globe:'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
 trophy:'M8 4h8v5a4 4 0 01-8 0zM8 6H4v1a4 4 0 004 4M16 6h4v1a4 4 0 01-4 4M12 13v4M8 21h8M10 17h4',chest:'M4 10h16v10H4zM4 10a8 5 0 0116 0M12 14v2',
 flame:'M12 3c1 4 5 5 5 10a5 5 0 01-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-4-1-6 1-9z',coin:'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v10M9.5 9.5h4a1.7 1.7 0 010 3.4h-3a1.7 1.7 0 000 3.4h4',
 school:'M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6M10 11h4',user:'M12 4a4 4 0 100 8 4 4 0 000-8zM5 20c0-4 3-6 7-6s7 2 7 6',
 chat:'M4 5h16v11H9l-5 4zM8 9h8M8 12h5',chart:'M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-8',eng:'M5 19L12 4l7 15M8 14h8',jp:'M5 7h14M12 4v3M8 7c0 6 3 10 8 12M16 7c0 5-3 9-8 12',
 sci:'M9 3h6M10 3v6L5 19a2 2 0 002 2h10a2 2 0 002-2l-5-10V3',soc:'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
 math:'M5 5h14M5 19h14M17 5L7 19',all:'M12 3l3 6 6 1-4.5 4.5L17.5 21 12 18l-5.5 3 1-6.5L3 10l6-1z',sound:'M4 9v6h4l5 4V5L8 9z',
 pencil:'M4 20l1-4L16 5l3 3L8 19z',x:'M6 6l12 12M18 6L6 18',redo:'M20 12a8 8 0 11-3-6.2M20 4v5h-5',up:'M12 19V5M6 11l6-6 6 6',key:'M8 15a4 4 0 110-8 4 4 0 010 8zM11 11h9M17 11v4'
};
const ico=(n,cls='')=>`<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${ICO[n]||ICO.star}"/></svg>`;
const SJIC={国:'jp',数:'math',英:'eng',理:'sci',社:'soc',総:'all'};
const sjTag=s=>`<span class="sj" data-s="${s}">${SJN[s]||s}</span>`;
const f1=x=>Math.round(x*10)/10;

/* ----- はなまる（SVG）：シードで花びらの数・向きが決まる。花びらの丸＋まわりの星（関数名は飛沫のころのまま） ----- */
function splatPath(seed,N,R=100){
 const r=mulberry(seed),n=N&&N<12?N:6+Math.floor(r()*3),rot=r()*6.28,rv=R*1.02;
 const ch=2*rv*Math.sin(Math.PI/n),ar=f1(ch*.52);
 const pt=i=>{const a=rot+i/n*Math.PI*2;return[f1(Math.cos(a)*rv),f1(Math.sin(a)*rv)]};
 let d='M'+pt(0).join(',');
 for(let i=1;i<=n;i++){const p=pt(i%n);d+=`A${ar},${ar} 0 0 1 ${p[0]},${p[1]}`}
 return d+'Z';
}
const starPath=(x,y,s)=>`M${f1(x)},${f1(y-s)}Q${f1(x)},${f1(y)} ${f1(x+s)},${f1(y)}Q${f1(x)},${f1(y)} ${f1(x)},${f1(y+s)}Q${f1(x)},${f1(y)} ${f1(x-s)},${f1(y)}Q${f1(x)},${f1(y)} ${f1(x)},${f1(y-s)}Z`;
function splatSVG(seed,col,o={}){
 const r=mulberry(seed+7),R=100;let dr='';
 const K=Math.min(o.drops==null?6:o.drops,7);
 for(let i=0;i<K;i++){
  const a=(i/K+r()*.1)*Math.PI*2,dist=R*(1.5+r()*.35),s=R*(.14+r()*.1);
  dr+=`<path d="${starPath(Math.cos(a)*dist,Math.sin(a)*dist,s)}"/>`;
 }
 const ring=o.stroke?`<circle r="${R*.5}" fill="none" stroke-width="${(o.sw||6)*1.3}" style="stroke:rgba(var(--ink-rgb),.55)"/><circle r="${R*.2}" fill="${o.stroke}" stroke="none" opacity=".35"/>`:'';
 return `<svg viewBox="-200 -200 400 400" aria-hidden="true"${o.cls?` class="${o.cls}"`:''}><g fill="${col}"${o.stroke?` stroke="${o.stroke}" stroke-width="${o.sw||6}" stroke-linejoin="round"`:''}><path d="${splatPath(seed)}"/>${dr}</g>${ring}</svg>`;
}
const sakura=(r=1)=>`<g transform="scale(${r})"><g fill="#fff" stroke="var(--on)" stroke-width="5" stroke-linejoin="round">${[0,1,2,3,4].map(k=>`<ellipse cx="0" cy="-30" rx="19" ry="27" transform="rotate(${k*72})"/>`).join('')}</g><circle r="10" fill="var(--yellow)" stroke="var(--on)" stroke-width="4"/></g>`;
function avatarSVG(){
 return `<svg viewBox="-130 -130 260 260" aria-hidden="true"><g fill="var(--team)" stroke="var(--ink)" stroke-width="9" stroke-linejoin="round"><path d="${splatPath(11,12,96)}"/></g>${sakura(1.02)}</svg>`;
}
const lvHex=(lv,w=54)=>`<svg class="lvh" style="width:${w}px;height:${Math.round(w*1.1)}px" viewBox="0 0 60 66" aria-label="レベル${lv}"><polygon points="30,3 57,17 57,49 30,63 3,49 3,17" fill="var(--yellow)" stroke="var(--ink)" stroke-width="4" stroke-linejoin="round"/><polygon points="30,9 52,20 52,46 30,57 8,46 8,20" fill="none" style="stroke:rgba(var(--ink-rgb),.25)" stroke-width="2"/><text x="30" y="26" text-anchor="middle" font-size="11" font-weight="900" fill="var(--on)" font-family="var(--f-d)">Lv</text><text x="30" y="49" text-anchor="middle" font-size="${lv>=10?22:26}" fill="var(--on)" font-family="var(--f-d)">${lv}</text></svg>`;
function paintBg(){
 const b=$('#bg');if(!b)return;
 b.innerHTML=[[3,'var(--team)','var(--spl1)','right:-130px;top:60px;width:440px'],[8,'var(--cyan)','var(--spl2)','left:-160px;top:46%;width:400px'],[21,'var(--lime)','var(--spl3)','right:-90px;bottom:-70px;width:360px'],[30,'var(--yellow)','var(--spl4)','left:-100px;top:-90px;width:300px']].map(s=>`<div style="position:absolute;opacity:${s[2]};${s[3]}">${splatSVG(s[0],s[1],{drops:10,stroke:'var(--ink)',sw:5})}</div>`).join('');
}

/* ----- 音（効果音）と英語の読み上げ ----- */
const Snd=(()=>{
 let ac=null;
 const ctx=()=>{try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume();return ac}catch(e){return null}};
 const tone=(f,t0,dur,type,vol)=>{const c=ctx();if(!c||!S.sound)return;try{const o=c.createOscillator(),g=c.createGain(),t=c.currentTime+t0;o.type=type||'square';o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(vol||.07,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+dur+.02)}catch(e){}};
 return{unlock(){ctx()},ok(){tone(660,0,.09);tone(990,.08,.16)},ng(){tone(200,0,.2,'sawtooth',.06);tone(150,.14,.26,'sawtooth',.05)},tap(){tone(540,0,.04,'square',.035)},
  combo(n){tone(520+Math.min(n,12)*45,0,.1,'triangle',.08);tone(780+Math.min(n,12)*45,.07,.12,'triangle',.07)},
  clear(){[523,659,784,1046].forEach((f,i)=>tone(f,i*.11,.22,'square',.06))},lv(){[392,523,659,784,1046,1318].forEach((f,i)=>tone(f,i*.09,.26,'triangle',.09))}};
})();
const Tts={
 ok:typeof speechSynthesis!=='undefined',
 unlock(){if(!this.ok)return;try{speechSynthesis.getVoices();speechSynthesis.speak(new SpeechSynthesisUtterance(''))}catch(e){}},
 say(t,lang,rate){
  if(!this.ok||!S.sound||!t)return;
  try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang=lang||'en-US';u.rate=rate||.88;
   const vs=speechSynthesis.getVoices(),v=vs.find(x=>x.lang==='en-US'&&/Samantha|Ava|Allison|Nicky|Google US/i.test(x.name))||vs.find(x=>x.lang==='en-US')||vs.find(x=>/^en/.test(x.lang));
   if(v&&u.lang.indexOf('en')===0)u.voice=v;speechSynthesis.speak(u)}catch(e){}
 }
};

/* ----- 演出：インクのしぶき ----- */
const FX=(()=>{
 let P=[],run=false,cv,cx,SPL=[];
 /* 飛沫の粒：とげ12本の本体＋しずく円（画面の飛沫と同じ形） */
 try{SPL=[3,11,19,27,35,43].map(i=>{const q=new Path2D(splatPath(i,12,100)),r=mulberry(i+5);for(let k=0;k<3;k++){const a=r()*6.28,d=135+r()*40,rad=9+r()*9;q.moveTo(Math.cos(a)*d+rad,Math.sin(a)*d);q.arc(Math.cos(a)*d,Math.sin(a)*d,rad,0,7)}return q})}catch(e){SPL=[]}
 const init=()=>{cv=cv||$('#fx');if(cv&&!cx){cx=cv.getContext('2d')}return !!cx};
 const reduce=()=>window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
 function loop(){
  const W=innerWidth,H=innerHeight;if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H}
  cx.clearRect(0,0,W,H);
  P=P.filter(p=>p.life>0);
  P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=p.g;p.vx*=.992;p.life--;p.rot+=p.vr;
   const a=Math.min(1,p.life/18);cx.save();cx.globalAlpha=a;cx.translate(p.x,p.y);cx.rotate(p.rot);
   cx.fillStyle=p.c;cx.strokeStyle=INK;cx.lineWidth=2.5;
   if(p.sq){cx.fillRect(-p.r,-p.r*.55,p.r*2,p.r*1.1);cx.strokeRect(-p.r,-p.r*.55,p.r*2,p.r*1.1)}
   else if(SPL[p.pi]){const k=p.r/60;cx.scale(k,k);cx.lineWidth=2.5/k;cx.fill(SPL[p.pi]);cx.stroke(SPL[p.pi])}
   else{cx.beginPath();cx.ellipse(0,0,p.r,p.r*(p.el||1),0,0,7);cx.fill();cx.stroke()}
   cx.restore()});
  if(P.length)requestAnimationFrame(loop);else{run=false;cx.clearRect(0,0,W,H)}
 }
 const go=()=>{if(!run){run=true;requestAnimationFrame(loop)}};
 let INK='#000';
 const cols=()=>{const cs=getComputedStyle(document.documentElement),g=(k,d)=>cs.getPropertyValue(k).trim()||d;INK=g('--ink','#000');return[g('--team','#ff3d9a'),g('--yellow','#ffe81a'),g('--cyan','#1ee6ff'),g('--lime','#b8ff00'),'#ffffff',g('--orange','#ff8f1f')]};
 return{
  burst(x,y,n,spread){
   if(reduce()||!init())return;const C=cols();
   for(let i=0;i<(n||14);i++){const a=Math.random()*Math.PI*2,s=(spread||8)*(.35+Math.random());
    P.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-2.5,g:.2,r:12+Math.random()*14,pi:Math.random()*6|0,el:.55+Math.random()*.45,rot:Math.random()*6,vr:(Math.random()-.5)*.3,c:C[Math.random()*C.length|0],life:44+Math.random()*30})}
   go();
  },
  confetti(n,o){
   if(reduce()||!init())return;const C=cols(),sm=o&&o.small;   // small：小さい粒を少し（文字や「つぎ」のボタンにかぶらないように）
   for(let i=0;i<(n||90);i++){P.push({x:Math.random()*innerWidth,y:-20-Math.random()*220,vx:(Math.random()-.5)*3,vy:2+Math.random()*4,g:.06,r:sm?3.5+Math.random()*3:6+Math.random()*6,sq:1,rot:Math.random()*6,vr:(Math.random()-.5)*.35,c:C[Math.random()*C.length|0],life:sm?100+Math.random()*30:150+Math.random()*80})}
   go();
  },
  at(el,n){if(!el)return;const b=el.getBoundingClientRect();this.burst(b.left+b.width/2,b.top+b.height/2,n||14)}
 };
})();

/* ----- 小さな表示 ----- */
let toastT;
function toast(t){const e=$('#toast');if(!e)return;e.textContent=t;e.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>e.classList.remove('on'),2500)}
function openSheet(html,cls){const s=$('#sheet');s.innerHTML=`<div class="${cls||''}">${html}<p style="text-align:center;margin:14px 0 0"><button class="bt sm gh" data-act="sheetClose">とじる</button></p></div>`;s.hidden=false;s.scrollTop=0}
function closeSheet(){const s=$('#sheet');s.hidden=true;s.innerHTML=''}
function openOv(html){const o=$('#ov');o.innerHTML=`<div class="box">${html}</div>`;o.hidden=false}
function closeOv(){const o=$('#ov');o.hidden=true;o.innerHTML=''}
async function copyText(t){
 try{await navigator.clipboard.writeText(t);return true}catch(e){}
 try{const ta=document.createElement('textarea');ta.value=t;ta.setAttribute('readonly','');ta.style.cssText='position:fixed;left:0;top:0;opacity:0;font-size:16px';document.body.appendChild(ta);ta.focus();ta.select();ta.setSelectionRange(0,t.length);const ok=document.execCommand('copy');ta.remove();return ok}catch(e){return false}
}
const applyTeam=()=>document.documentElement.setAttribute('data-team',S.team||'pink');
const themeOf=k=>THEMES.find(t=>t[0]===k)||THEMES[0];
/* 画面の色（テーマ）。起動前にも head のスクリプトが同じことをする（ちらつかないように） */
const applyTheme=()=>{const t=themeOf(S.theme),q=n=>document.querySelector('meta[name='+n+']');document.documentElement.setAttribute('data-theme',t[0]);if(q('theme-color'))q('theme-color').setAttribute('content',t[3]);if(q('color-scheme'))q('color-scheme').setAttribute('content',t[7]?'dark':'light');if(q('apple-mobile-web-app-status-bar-style'))q('apple-mobile-web-app-status-bar-style').setAttribute('content',t[7]?'black-translucent':'default')};
const sjName=s=>SJN[s]||s;
const dateJa=d=>{const x=dt(d);return(x.getMonth()+1)+'/'+x.getDate()+'（'+'日月火水木金土'[x.getDay()]+'）'};
const fmtMin=m=>m>=60?Math.floor(m/60)+'時間'+(m%60?m%60+'分':''):m+'分';

/* ----- 上のバー（プレイヤーカード） ----- */
function renderHud(){
 const L=lvInfo(S.xp),d=diff(today(),S.exam);
 $('#nmN').textContent=S.nick||'ゲスト';
 $('#nmR').innerHTML='Lv.'+L.lv+'<span class="rn">　'+esc(L.name)+'</span>';
 $('#av').innerHTML=avatarSVG();
 $('#hud').innerHTML=`<div class="pl cd"><small>まとめの日まで</small><b>${Math.max(0,d)}</b><i>日</i></div><div class="pl fl"><small>れんぞく</small><b>${curStreak()}</b><i>日</i></div><div class="pl"><small>コイン</small><b>${S.coin}</b></div>`;
}
