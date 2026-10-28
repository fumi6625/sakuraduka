/* ===== きょうの一本道（画面に触れない部分） =====
   マスト＝きょうのルートで、自動で空になっていないステージ（保護者OKがオンのときの宿題は、おうちの人のOKがいるので入れない）。
   順番に1本の道でつなぐ：暗記 → 算数 → 今日の教科 → ミス退治 → （診断）→ 宿題 → ふりかえり */
const FLOW_NAME={hw:'宿題・提出物',mem:'暗記バトル',math:'算数ドリル',mis:'ミス退治',ref:'ふりかえり'};
const flowName=s=>s.id==='diag'?'ミニ診断（'+(SJN[s.subj]||s.subj)+'）':s.id==='sub'?String(s.t).split('：')[0]:(FLOW_NAME[s.id]||s.t);
const PINON=()=>!!(S.pinOn&&S.pin);
/* 暗証番号の確かめ。5回まちがえたら10分ロック（かたっぱしから試して、暗証番号をさぐられないように）。戻り値：'ok'｜'ng'｜'lock' */
const PIN_MAX=5,PIN_LOCK_MS=10*60000;
function pinTry(v){
 const f=S.pinFail||(S.pinFail={n:0,until:0}),now=Date.now();
 if(f.until>now)return'lock';
 if(String(v)===S.pin){f.n=0;f.until=0;return'ok'}
 f.n=(f.n||0)+1;
 if(f.n>=PIN_MAX){f.n=0;f.until=now+PIN_LOCK_MS}
 return f.until>now?'lock':'ng';
}
const pinLockMin=()=>{const f=S.pinFail;return f&&f.until>Date.now()?Math.ceil((f.until-Date.now())/60000):0};
const mustStages=route=>route.filter(s=>!s.auto&&!(s.id==='hw'&&PINON()));

/* きょうの一本道の状態。next＝次のマスト／redo＝すべて終わったのにクリアラインに届かないとき、やりなおす（正答4割未満の）ドリル
   ready＝きょうのマストがぜんぶ終わり、クリアラインにも届いた（やりなおす道が無いときは、行き止まりにしない） */
function flowState(date=today()){
 const route=routeFor(date),must=mustStages(route),rec=peekDay(date),tier=S.rt&&S.rt.d===date?S.rt.tier:tierFor(date);
 const next=must.find(s=>!s.done)||null,all=!next,ok=dayOK(rec,tier);
 const low=all&&!ok?must.filter(s=>s.kind==='session'&&lowRes(s.res)).sort((a,b)=>a.res.ok/a.res.n-b.res.ok/b.res.n):[];
 const redo=low[0]||null,ready=all&&(ok||!redo);
 const hw=route.find(s=>s.id==='hw');
 const left=must.filter(s=>!s.done).length;
 return{route,must,next,redo,target:next||redo,all,ok,ready,left,
  hwWait:!!(hw&&!hw.done&&PINON()),tier,
  steps:left+(redo?1:0)};   // 道にのこっている数
}
