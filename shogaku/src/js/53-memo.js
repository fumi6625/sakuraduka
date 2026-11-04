/* ===== メモ（手書き） =====
   出題中に「メモ」を押すと、問題が透ける白いシートが出て、指やペンで書ける（計算のとちゅうを書く用）。
   ペンの色は5色。細い線。「とじる」でシートは消えるが、書いた線は残り、答えるあいだも見える。次の問題で、まっさらにもどる */
const MEMO_COLORS=[['くろ','#222222'],['あか','#e0352b'],['あお','#1d6fd8'],['みどり','#1f9a4d'],['オレンジ','#f08a00']];
const MEMO_PEN=2.2,MEMO_ERASE=24;
let MM=null;
function memoEnsure(){
 if(MM)return MM;
 const w=document.createElement('div');w.id='memo';w.hidden=true;
 w.innerHTML=`<canvas id="mmc"></canvas><div class="mmtb" role="toolbar" aria-label="メモのどうぐ"><div class="mmg">${MEMO_COLORS.map((c,i)=>`<button class="mmc" data-act="memoColor" data-a="${i}" aria-label="${c[0]}" style="--pc:${c[1]}"></button>`).join('')}<button class="bt sm gh mmb" data-act="memoEraser">けしゴム</button></div><div class="mmg"><button class="bt sm gh mmb" data-act="memoUndo">${ico('redo')}もどす</button><button class="bt sm gh mmb" data-act="memoClear">ぜんぶ消す</button><button class="bt sm pri mmb" data-act="memoClose">とじる</button></div></div>`;
 document.body.appendChild(w);
 const cv=w.querySelector('canvas'),M={w,cv,cx:cv.getContext('2d'),strokes:[],ci:0,er:false,open:false,pen:false,cur:null};
 const pt=e=>{const r=cv.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]};
 cv.addEventListener('pointerdown',e=>{
  if(!M.open)return;
  if(e.pointerType==='pen')M.pen=true;else if(M.pen&&e.pointerType==='touch')return;   // ペンを使っているあいだは、手のひら（タッチ）を無視
  e.preventDefault();try{cv.setPointerCapture(e.pointerId)}catch(x){}
  M.cur={c:MEMO_COLORS[M.ci][1],w:M.er?MEMO_ERASE:MEMO_PEN,er:M.er,pts:[pt(e)],id:e.pointerId};M.strokes.push(M.cur);memoSeg(M.cur,0);
 });
 cv.addEventListener('pointermove',e=>{
  if(!M.cur||e.pointerId!==M.cur.id)return;e.preventDefault();
  const a=e.getCoalescedEvents?e.getCoalescedEvents():[e];
  for(const x of(a.length?a:[e])){M.cur.pts.push(pt(x));memoSeg(M.cur,M.cur.pts.length-2)}
 });
 const up=e=>{if(M.cur&&e.pointerId===M.cur.id)M.cur=null};
 cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
 window.addEventListener('resize',()=>{if(MM)memoFit()});
 MM=M;memoFit();return M;
}
function memoFit(){
 const M=MM,d=window.devicePixelRatio||1,w=window.innerWidth,h=window.innerHeight;
 M.cv.width=Math.round(w*d);M.cv.height=Math.round(h*d);M.cx.setTransform(d,0,0,d,0,0);memoRedraw();
}
function memoSeg(s,i){
 const cx=MM.cx,p=s.pts[i],q=s.pts[i+1]||p;
 cx.globalCompositeOperation=s.er?'destination-out':'source-over';cx.strokeStyle=s.c;cx.fillStyle=s.c;cx.lineWidth=s.w;cx.lineCap='round';cx.lineJoin='round';
 cx.beginPath();cx.moveTo(p[0],p[1]);cx.lineTo(q[0]+.01,q[1]);cx.stroke();
}
function memoRedraw(){
 const M=MM;M.cx.clearRect(0,0,M.cv.width,M.cv.height);
 M.strokes.forEach(s=>{for(let i=0;i<s.pts.length;i++)memoSeg(s,i)});
}
function memoShow(){
 const M=MM;if(!M)return;
 M.w.hidden=!(M.open||M.strokes.length);M.w.classList.toggle('on',M.open);
 M.w.querySelectorAll('.mmc').forEach((b,i)=>b.classList.toggle('sel',!M.er&&i===M.ci));
 const eb=M.w.querySelector('[data-act=memoEraser]');if(eb)eb.classList.toggle('sel',M.er);
}
function memoOpen(){const M=memoEnsure();M.open=true;memoShow()}
function memoClose(){if(!MM)return;MM.open=false;MM.cur=null;memoShow()}
function memoReset(){if(!MM)return;MM.strokes=[];MM.open=false;MM.cur=null;MM.er=false;memoRedraw();memoShow()}
function memoColor(i){const M=memoEnsure();M.ci=i;M.er=false;memoShow()}
function memoEraser(){const M=memoEnsure();M.er=!M.er;memoShow()}
function memoUndo(){if(!MM)return;MM.strokes.pop();memoRedraw();memoShow()}
function memoClear(){if(!MM)return;MM.strokes=[];memoRedraw();memoShow()}
