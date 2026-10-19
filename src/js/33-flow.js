/* ===== きょうの一本道と、おうちの人への「完了れんらく」（画面に触れない部分） =====
   マスト＝きょうのルートで、自動で空になっていないステージ（保護者OKがオンのときの宿題は、おうちの人のOKがいるので入れない）。
   順番に1本の道でつなぐ：暗記 → 数学 → 今日の教科 → ミス退治 → （診断）→ 宿題 → ふりかえり → 完了れんらく。
   「完了れんらく」は、マストがぜんぶ終わって、きょうの合格ラインにも届いたときだけ押せる。
   送るのは、子どもが押したときに開くメール作成画面（mailto）か、コピー・共有。アプリが自動で送ることはない
   （子どもが自分で押すこと自体が「やった」のアピールになるので）。tests/contact.test.mjs が、通信をしていないことも見張る */
const FLOW_NAME={hw:'宿題・提出物',mem:'暗記バトル',math:'数学ドリル',mis:'ミス退治',ref:'ふりかえり'};
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

/* きょうの一本道の状態。next＝次のマスト／redo＝すべて終わったのに合格ラインに届かないとき、やりなおす（正答4割未満の）ドリル
   ready＝れんらくボタンが押せる（マストがぜんぶ終わり、合格ラインにも届いた。やりなおす道が無いときは、行き止まりにしない） */
function flowState(date=today()){
 const route=routeFor(date),must=mustStages(route),rec=peekDay(date),tier=S.rt&&S.rt.d===date?S.rt.tier:tierFor(date);
 const next=must.find(s=>!s.done)||null,all=!next,ok=dayOK(rec,tier);
 const low=all&&!ok?must.filter(s=>s.kind==='session'&&lowRes(s.res)).sort((a,b)=>a.res.ok/a.res.n-b.res.ok/b.res.n):[];
 const redo=low[0]||null,ready=all&&(ok||!redo);
 const hw=route.find(s=>s.id==='hw');
 const left=must.filter(s=>!s.done).length,sent=!!rec.ct;
 return{route,must,next,redo,target:next||redo,all,ok,ready,left,sent,sentAt:rec.ct||0,
  hwWait:!!(hw&&!hw.done&&PINON()),tier,
  steps:left+(redo?1:0)+(ready&&!sent?1:0)};   // 道にのこっている数（れんらくをふくむ）
}

/* ----- メールアドレス（このiPadの中だけに保存。コードや資料には入れない） ----- */
const cleanMail=v=>String(v||'').normalize('NFKC').replace(/\s+/g,'');
const validMail=v=>/^[A-Za-z0-9._+\-]+@[A-Za-z0-9\-]+(\.[A-Za-z0-9\-]+)+$/.test(v)&&v.length<=100;
const mailAddrs=()=>{const m=S.mail||{};return[...new Set([cleanMail(m.m),cleanMail(m.f)].filter(validMail))]};   // おかあさん・おとうさんの順
const mailWho=()=>{const m=S.mail||{},f=validMail(cleanMail(m.f)),o=validMail(cleanMail(m.m));return f&&!o?'おとうさん':o&&!f?'おかあさん':'おかあさん・おとうさん'};
const mdw=d=>{const x=dt(d);return(x.getMonth()+1)+'/'+x.getDate()+' '+'日月火水木金土'[x.getDay()]};
/* 送る文（子どもの言葉で、短く）。subject＝件名、body＝本文、text＝コピー・共有用 */
function mailText(F,date=today()){
 const rec=peekDay(date),nick=S.nick;
 const rf=S.refl&&S.refl[date];
 /* 数のあるドリルは、せいかいの数。やりなおしたときは、1回目も書く。自分でつけるもの（宿題・ふりかえり）は、そう分かるように */
 const rows=F.must.map(s=>{
  const r=s.res;let t='・'+flowName(s);
  if(s.kind==='session'&&r&&r.n)t+='　'+r.ok+'/'+r.n+(r.f?'（1回目 '+r.f.ok+'/'+r.f.n+'→やりなおし）':'');
  else if(s.id==='hw')t+='（じぶんでチェック）';
  else if(s.id==='ref'&&rf&&rf.s)t+='　自分'+rf.s+'点'+(rf.d!=null?'／データ'+rf.d+'点':'');
  return t;
 });
 const ss=F.must.filter(s=>s.kind==='session'&&s.res&&s.res.n),n=sum(ss.map(s=>s.res.n)),ok=sum(ss.map(s=>s.res.ok)),min=sum(Object.values(rec.min||{}));
 const L=[mailWho()+'へ','','きょう（'+mdw(date)+'）の ノルマ、ぜんぶ おわったよ！','','■ やったこと',...rows,'','■ きょうの まとめ'];
 if(n)L.push('・せいかい '+ok+'/'+n+'（'+Math.round(ok/n*100)+'%）');
 if(min)L.push('・べんきょうした時間 約'+min+'分');
 L.push('・きょうの量：'+(TIERS[F.tier]?TIERS[F.tier].name:'')+(S.light&&S.light[date]?'（ミニの日）':''));
 if(curStreak())L.push('・れんぞく '+curStreak()+'日');
 if(F.hwWait)L.push('','宿題は、おうちの人の OK が まだです。見てね！');
 L.push('','（さくらクエスト：'+(nick||'子ども')+'が じぶんで ボタンを おして つくった れんらく）');
 const subject='【さくらクエスト】きょうの ノルマ、おわったよ！'+(nick?'（'+nick+'）':''),body=L.join('\n');
 return{subject,body,text:subject+'\n\n'+body};
}
/* メール作成画面を開くリンク（宛先は , でつなぐ。本文の改行は CRLF） */
const mailtoURL=(to,m)=>'mailto:'+to.join(',')+'?subject='+encodeURIComponent(m.subject)+'&body='+encodeURIComponent(m.body.replace(/\n/g,'\r\n'));
/* 「れんらくボタンを押した」記録。押せる状態（ready）のときだけ記録できる */
function markContact(date=today()){
 const F=flowState(date);if(!F.ready)return false;
 const d=dayRec(date);d.ct=Date.now();d.cn=(d.cn||0)+1;return true;
}
