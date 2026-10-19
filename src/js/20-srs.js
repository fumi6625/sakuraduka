/* ===== 間隔反復（SRS）：まちがえた問題ほど何度も出る ===== */
const BOXD=[1,2,4,8,16,32,64];            // 箱ごとの次回までの日数
const DN=()=>dn(today());
/* 1回目の答えだけを記録する。はじめて正解＝すでに知っていた（箱2から）、まちがい＝箱0（あした再戦） */
function srsAnswer(it,ok){
 const t=DN();let s=S.srs[it.id];
 if(!s)s={b:ok?2:0,n:0,w:0,d:0};
 else s.b=ok?Math.min(6,s.b+1):Math.max(0,s.b-2);
 s.n++;if(!ok)s.w++;
 s.d=t+BOXD[s.b];S.srs[it.id]=s;
}
const snap=it=>({id:it.id,subj:it.subj,k:it.k,gid:it.gid,lv:it.lv,tag:it.tag,q:it.q,a:it.a,accept:it.accept,disp:it.disp,exp:it.exp,ch:it.ch,unit:it.unit,fd:it.fd});
/* 自動生成問題・学校のテストのミスは、まちがえたときだけ保存して再戦に回す */
function recordAnswer(it,ok){
 let lv='';
 if(it.k==='gen'){
  lv=genResult(it.gid,ok);
  if(!ok){S.gx[it.id]=snap(it);ITEMS[it.id]=Object.assign({bank:'MG',k:'gen'},S.gx[it.id]);srsAnswer(it,false)}   // その場で復習の対象に（ページを開きっぱなしでも、あしたの再戦に出る）
  else if(S.srs[it.id]){srsAnswer(it,true);if(S.srs[it.id].b>=5)delete S.gx[it.id]}
  return lv;
 }
 srsAnswer(it,ok);
 if(it.k==='mist'&&ok&&S.srs[it.id].b>=5)delete S.gx[it.id];
 return lv;
}
/* 起動時・復元時：保存してあった再戦用の問題を復元 */
function restoreGx(){
 Object.keys(ITEMS).forEach(id=>{if(ITEMS[id].bank==='MG')delete ITEMS[id]});
 Object.keys(S.gx).forEach(id=>{const o=S.gx[id];ITEMS[id]=Object.assign({bank:'MG',k:'gen'},o)});
}
restoreGx();
function addManualMistake(subj,cause,memo){
 const id='M:'+Date.now(),it={id,bank:'MG',subj,k:'mist',tag:cause,q:memo||'（学校のテストの問題）',a:'',exp:'原因：'+cause};
 ITEMS[id]=it;S.gx[id]=snap(it);S.srs[id]={b:0,n:0,w:1,d:DN()+1};return it;
}
/* ----- えらび方 ----- */
/* 復習の順番：まちがえたばかり（箱が小さい＝間隔が短い）ものを先に。同じ箱なら、おくれが大きい順 */
function dueItems(pred,limit){
 const t=DN(),out=[];
 for(const id in S.srs){const s=S.srs[id];if(s.d>t)continue;const it=ITEMS[id];if(!it||(pred&&!pred(it)))continue;out.push([t-s.d,s.b,it])}
 out.sort((a,b)=>a[1]-b[1]||b[0]-a[0]);
 return out.slice(0,limit).map(x=>x[2]);
}
/* いま復習の期限がきている問題の数。young=true なら、まちがえたばかり・おぼえかけ（箱0〜3）だけ数える。
   これがたまりすぎたら、新しい問題を減らして、復習を先にする（長くおぼえている箱4以上のおくれは数えない） */
/* 期限が来た復習の数。young：まだ若い（箱0〜3）ものだけ／pred：数える教材をしぼる */
function dueCount(young,pred){const t=DN();let n=0;for(const id in S.srs){const s=S.srs[id];if(s.d>t||(young&&s.b>3))continue;const it=ITEMS[id];if(it&&(!pred||pred(it)))n++}return n}
function newItems(bank,n,o={}){
 const ex=o.ex||new Set(),out=[],items=BK[bank].items;
 const ok=it=>!S.srs[it.id]&&!ex.has(it.id)&&(!o.pred||o.pred(it));
 if(o.prefs&&o.prefs.length)for(const it of items){if(out.length>=n)break;if(ok(it)&&o.prefs.some(p=>(it.tag||'').startsWith(p)))out.push(it)}
 for(const it of items){if(out.length>=n)break;if(ok(it)&&!out.includes(it))out.push(it)}
 return out;
}
const seenItems=(pred)=>Object.keys(S.srs).map(id=>ITEMS[id]).filter(it=>it&&(!pred||pred(it)));
const weakItems=(n,pred)=>{
 const out=[];for(const id in S.srs){const s=S.srs[id],it=ITEMS[id];if(!it||s.w<1||s.b>=4||(pred&&!pred(it)))continue;out.push([s.w*3-s.b,it])}
 out.sort((a,b)=>b[0]-a[0]);return out.slice(0,n).map(x=>x[1]);
};
function bankStats(b){
 const items=BK[b].items;let seen=0,mast=0;
 items.forEach(it=>{const s=S.srs[it.id];if(s){seen++;if(s.b>=4)mast++}});
 return{total:items.length,seen,mast};
}
const mistakeStats=()=>{let all=0,dead=0;for(const id in S.srs){const s=S.srs[id];if(s.w>0){all++;if(s.b>=4)dead++}}return{all,dead,open:all-dead}};
const totalItems=()=>Object.values(BK).reduce((t,b)=>t+b.items.length,0);
const SEC={word:8,verb:10,mc:14,listen:22,read:26,yomi:8,term:9,syn:9,qa:9,order:35,seq:30,self:45,gen:32,mist:40};
const estMin=items=>Math.max(1,Math.ceil(sum(items.map(it=>(SEC[it.k]||12)+(it.k==='read'&&items.indexOf(it)===items.findIndex(x=>x.pid===it.pid)?70:0)))*1.5/60));   // 1.5倍＝まちがえた問題のやりなおし・読み直し・タップのおくれを見こむ
