/* ===== ジェネレータ共通：問題の作成・成績・レベル自動調整 ===== */
Object.keys(GEN).forEach(id=>{if(!GEN[id].subj)GEN[id].subj='数'});
function makeGen(id,lv,seed){
 const g=GEN[id],o=g.f(mulberry(seed),lv);
 return{id:'G:'+id+':'+lv+':'+seed,bank:'MG',subj:g.subj,k:'gen',gid:id,lv,tag:id,q:o.q,accept:o.a||[],disp:o.disp,exp:(o.exp||[]).join('\n'),ch:o.ch||null,unit:o.unit||'',v:o.v};
}
const genLv=id=>(S.gs[id]&&S.gs[id].lv)||1;
const newSeed=()=>Math.floor(Math.random()*4e9)+1;
/* 正答率が高いと難しく、低いとやさしく（直近10問で判断） */
function genResult(id,ok){
 const s=S.gs[id]||(S.gs[id]={lv:1,rc:[],n:0,ok:0});
 s.n++;if(ok)s.ok++;s.rc.push(ok?1:0);if(s.rc.length>10)s.rc.shift();
 if(s.rc.length>=8){const acc=sum(s.rc)/s.rc.length;
  if(acc>=.85&&s.lv<3){s.lv++;s.rc=[];return'up'}
  if(acc<=.5&&s.lv>1){s.lv--;s.rc=[];return'down'}}
 return'';
}
const GEN_SUBJ=s=>Object.keys(GEN).filter(id=>GEN[id].subj===s);
