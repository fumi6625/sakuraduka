/* ===== 教材バンク：生データ → 問題オブジェクト → 出題の形 ===== */
const RAW={
 EW:typeof RAW_EW==='string'?RAW_EW:'',EV:typeof RAW_EV==='string'?RAW_EV:'',EG:typeof RAW_EG==='string'?RAW_EG:'',
 EO:typeof RAW_EO==='string'?RAW_EO:'',EL:typeof RAW_EL==='string'?RAW_EL:'',EC:typeof RAW_EC==='string'?RAW_EC:'',
 JK:typeof RAW_JK==='string'?RAW_JK:'',JW:typeof RAW_JW==='string'?RAW_JW:'',JI:typeof RAW_JI==='string'?RAW_JI:'',
 JS:typeof RAW_JS==='string'?RAW_JS:'',JG:typeof RAW_JG==='string'?RAW_JG:'',JC:typeof RAW_JC==='string'?RAW_JC:'',
 MQ:typeof RAW_MQ==='string'?RAW_MQ:'',MS:typeof RAW_MS==='string'?RAW_MS:'',SQ:typeof RAW_SQ==='string'?RAW_SQ:'',
 OQ:typeof RAW_OQ==='string'?RAW_OQ:'',OT:typeof RAW_OT==='string'?RAW_OT:''};
const PASS={E:typeof PASS_E!=='undefined'?PASS_E:[],J:typeof PASS_J!=='undefined'?PASS_J:[]};
const BANKS=[
 ['EW','英単語','英'],['EV','不規則動詞','英'],['EG','英文法','英'],['EO','英文の並べかえ','英'],['EL','リスニング','英'],['ER','英語の長文','英'],['EC','英作文','英'],
 ['JK','漢字の読み','国'],['JW','漢字の書き','国'],['JI','慣用句・ことわざ・四字熟語','国'],['JS','類義語・対義語','国'],['JG','国語の文法・敬語・古文','国'],['JR','国語の読解','国'],['JC','作文','国'],
 ['MQ','数学のきほん','数'],['MS','数学の考え方','数'],['SQ','理科 一問一答','理'],['OQ','社会 一問一答','社'],['OT','社会 年代ならべかえ','社']];
const BK={};const ITEMS={};
BANKS.forEach(b=>{BK[b[0]]={id:b[0],name:b[1],subj:b[2],items:[]}});
const reg=it=>{ITEMS[it.id]=it;BK[it.bank].items.push(it);return it};
const each=(raw,fn)=>{let g='';raw.split('\n').forEach(l=>{l=l.trim();if(!l||l.startsWith('//'))return;if(l[0]==='#'){g=l.slice(1).trim();return}fn(l.split('|').map(x=>x.trim()),g)})};
const mcRow=(bank,subj)=>(f,g)=>{const w=f.slice(2,5).filter(Boolean);if(f.length<5||w.length<3)return;reg({id:bank+':'+hid(f[0]),bank,subj,k:'mc',tag:g,q:f[0],c:f[1],w,exp:f[5]||''})};
each(RAW.EW,(f,g)=>{if(f.length<2)return;reg({id:'EW:'+f[0],bank:'EW',subj:'英',k:'word',en:f[0],ja:f[1],pos:f[2]||'x',grp:g,tag:'語'+g})});
each(RAW.EV,f=>{if(f.length<3)return;reg({id:'EV:'+f[0],bank:'EV',subj:'英',k:'verb',base:f[0],past:f[1],pp:f[2],ja:f[3]||'',tag:'不規則'})});
each(RAW.EG,mcRow('EG','英'));each(RAW.JW,mcRow('JW','国'));each(RAW.JG,mcRow('JG','国'));each(RAW.MQ,mcRow('MQ','数'));
each(RAW.EL,(f,g)=>{const w=f.slice(3,6).filter(Boolean);if(f.length<6||w.length<3)return;reg({id:'EL:'+hid(f[0]+f[1]),bank:'EL',subj:'英',k:'listen',tag:g,text:f[0],q:f[1],c:f[2],w,exp:f[6]||''})});
each(RAW.EO,(f,g)=>{if(f.length<2)return;const alts=f[1].split('/').map(x=>x.trim());reg({id:'EO:'+hid(f[1]),bank:'EO',subj:'英',k:'order',tag:g,ja:f[0],en:alts[0],alts})});
each(RAW.EC,(f,g)=>{if(f.length<2)return;reg({id:'EC:'+hid(f[0]),bank:'EC',subj:'英',k:'self',tag:g,q:f[0],a:f[1],exp:f[2]||''})});
each(RAW.JC,(f,g)=>{if(f.length<2)return;reg({id:'JC:'+hid(f[0]),bank:'JC',subj:'国',k:'self',tag:g,q:f[0],a:f[1],exp:f[2]||''})});
each(RAW.MS,(f,g)=>{if(f.length<2)return;reg({id:'MS:'+hid(f[0]),bank:'MS',subj:'数',k:'self',tag:g,q:f[0],a:f[1],exp:f[2]||''})});
each(RAW.JK,(f,g)=>{if(f.length<2)return;reg({id:'JK:'+f[0],bank:'JK',subj:'国',k:'yomi',tag:g,w:f[0],r:f[1],m:f[2]||''})});
each(RAW.JI,(f,g)=>{if(f.length<2)return;reg({id:'JI:'+f[0],bank:'JI',subj:'国',k:'term',tag:g,w:f[0],m:f[1]})});
each(RAW.JS,(f,g)=>{if(f.length<2)return;reg({id:'JS:'+f[0]+g,bank:'JS',subj:'国',k:'syn',tag:g,w:f[0],m:f[1]})});
each(RAW.SQ,(f,g)=>{if(f.length<2)return;reg({id:'SQ:'+hid(f[0]),bank:'SQ',subj:'理',k:'qa',tag:g,q:f[0],a:f[1],exp:f[2]||''})});
each(RAW.OQ,(f,g)=>{if(f.length<2)return;reg({id:'OQ:'+hid(f[0]),bank:'OQ',subj:'社',k:'qa',tag:g,q:f[0],a:f[1],exp:f[2]||''})});
each(RAW.OT,(f,g)=>{const seq=(f[0]||'').split('<').map(x=>x.trim()).filter(Boolean);if(seq.length<3)return;reg({id:'OT:'+hid(f[0]),bank:'OT',subj:'社',k:'seq',tag:g,seq,exp:f[1]||''})});
const regPass=(bank,subj,arr)=>arr.forEach(p=>p.qs.forEach((x,i)=>reg({id:bank+':'+p.id+':'+i,bank,subj,k:'read',tag:p.title,pid:p.id,title:p.title,text:p.text,q:x[0],c:x[1],w:[x[2],x[3],x[4]],exp:x[5]||''})));
regPass('ER','英',PASS.E);regPass('JR','国',PASS.J);

/* ----- 選択肢づくり ----- */
const POSJ={n:'名詞',v:'動詞',adj:'形容詞',adv:'副詞',prep:'前置詞',conj:'接続詞',pron:'代名詞',aux:'助動詞',int:'間投詞',num:'数詞',x:'語'};
const tagKeys=it=>{const p=(it.tag||'').split('/'),ks=[];for(let i=p.length;i>=1;i--)ks.push(it.bank+'|'+p.slice(0,i).join('/'));ks.push(it.bank+'|');return ks};
const POOL={};
['SQ','OQ','JI','JS'].forEach(b=>BK[b].items.forEach(it=>tagKeys(it).forEach(k=>(POOL[k]||(POOL[k]=[])).push(it))));
const EWPOS={};BK.EW.items.forEach(it=>(EWPOS[it.pos]||(EWPOS[it.pos]=[])).push(it));
const lenOK=(a,b)=>{const x=String(a).length,y=String(b).length;return x<=y*2+2&&y<=x*2+2};
/* 片方がもう片方をふくむ（例：「土一揆」と「正長の土一揆」）ものは、まぎらわしいので、まちがいの選択肢に使わない */
const nested=(a,b)=>{a=String(a);b=String(b);const s=a.length<=b.length?a:b,l=s===a?b:a;return s.length>=2&&l.includes(s)};
function distractQA(it,f,n=3){
 const ans=it[f],seen=new Set([ans]),out=[],keys=tagKeys(it);
 for(const pass of [0,1]){
  for(const k of keys){
   const pool=POOL[k]||[];
   if(pool.length<n+2&&k!==keys[keys.length-1])continue;
   for(const c of shuffle(pool)){
    if(out.length>=n)break;
    if(c.id===it.id||seen.has(c[f])||nested(c[f],ans))continue;
    if(f==='w'&&c.m===it.m)continue;
    if(pass===0&&!lenOK(c[f],ans))continue;
    seen.add(c[f]);out.push(c[f]);
   }
   if(out.length>=n)break;
  }
  if(out.length>=n)break;
 }
 return out;
}
const mt=s=>String(s).split(/[;；、,，／/・]/).map(x=>x.trim()).filter(Boolean);
const shareMean=(a,b)=>{const A=mt(a);return mt(b).some(x=>A.includes(x))};
/* つづりで答える問題：同じ品詞で、日本語の意味が重なる別の英単語（shop と store など）も正解にする */
const SYN_EW={};
const synOf=it=>SYN_EW[it.id]||(SYN_EW[it.id]=[it.en,...BK.EW.items.filter(x=>x.id!==it.id&&x.pos===it.pos&&shareMean(it.ja,x.ja)).map(x=>x.en)]);
function distractEW(it,f){
 const out=[],seen=new Set([it[f]]);
 for(const pool of [EWPOS[it.pos]||[],BK.EW.items]){
  for(const c of shuffle(pool)){
   if(out.length>=3)break;
   if(c.id===it.id||seen.has(c[f])||shareMean(it.ja,c.ja))continue;
   seen.add(c[f]);out.push(c[f]);
  }
  if(out.length>=3)break;
 }
 return out;
}
function distractYomi(it){
 const L=it.r.length,out=[],seen=new Set([it.r]);
 for(const c of shuffle(BK.JK.items)){
  if(out.length>=3)break;
  if(c.id===it.id||seen.has(c.r)||Math.abs(c.r.length-L)>1)continue;
  seen.add(c.r);out.push(c.r);
 }
 return out;
}
const edForm=b=>/e$/.test(b)?b+'d':/[^aeiou]y$/.test(b)?b.slice(0,-1)+'ied':b+'ed';
function evChoices(it,askPP){
 const form=(askPP?it.pp:it.past).split('/')[0];
 const cands=[askPP?it.past:it.pp,edForm(it.base),it.base,...shuffle(BK.EV.items.filter(x=>x.id!==it.id)).slice(0,5).map(x=>(askPP?x.pp:x.past).split('/')[0])];
 const out=[];
 for(const c of cands){const cc=c.split('/')[0];if(cc!==form&&!out.includes(cc))out.push(cc);if(out.length>=3)break}
 return mkC(form,out);
}
const mkC=(c,ws)=>shuffle([{t:c,ok:1},...ws.slice(0,3).map(t=>({t,ok:0}))]);
const boxOf=it=>{const s=S.srs[it.id];return s?s.b:-1};
const parity=it=>hashStr(it.id+dn(today()))%2;

/* ----- 出題の形（V）を作る ----- */
function present(it){
 const b=boxOf(it);
 switch(it.k){
  case 'word':
   if(b>=4)return{kind:'typ',q:it.ja,sub:'英語で書こう（'+POSJ[it.pos]+'）',accept:synOf(it),ph:'つづり',len:it.en.length,first:it.en[0],say:it.en,exp:it.en+'　＝　'+it.ja};
   if(b>=2)return{kind:'mc',q:it.ja,sub:'英語にすると？',choices:mkC(it.en,distractEW(it,'en')),say:it.en,exp:it.en+'　＝　'+it.ja};
   return{kind:'mc',q:it.en,sub:'意味は？',choices:mkC(it.ja,distractEW(it,'ja')),audio:it.en,say:it.en,exp:it.en+'　＝　'+it.ja};
  case 'verb':{
   const pp=parity(it)===1,form=pp?it.pp:it.past,acc=form.split('/'),ex=it.base+' – '+it.past+' – '+it.pp+'　（'+it.ja+'）';
   if(b>=3)return{kind:'typ',q:it.base+'（'+it.ja+'）',sub:(pp?'過去分詞形':'過去形')+'を書こう',accept:acc,ph:pp?'過去分詞':'過去形',len:acc[0].length,first:acc[0][0],exp:ex};
   return{kind:'mc',q:it.base+'（'+it.ja+'）',sub:(pp?'過去分詞形':'過去形')+'は？',choices:evChoices(it,pp),exp:ex}}
  case 'mc':return{kind:'mc',q:it.q,sub:it.tag,choices:mkC(it.c,it.w),exp:it.exp};
  case 'listen':return{kind:'mc',q:it.q,sub:'英文を聞いて答えよう',choices:mkC(it.c,it.w),audio:it.text,reveal:it.text,exp:it.exp};
  case 'read':return{kind:'mc',q:it.q,sub:'長文読解',passage:{title:it.title,text:it.text},choices:mkC(it.c,it.w),exp:it.exp};
  case 'yomi':{
   const ex=it.w+'（'+it.r+'）'+(it.m?'　'+it.m:'');
   if(b>=3)return{kind:'typ',q:it.w,sub:'読みを ひらがなで書こう',accept:[it.r],ph:'よみ',hira:1,exp:ex};
   return{kind:'mc',q:it.w,sub:'読みは？',choices:mkC(it.r,distractYomi(it)),exp:ex}}
  case 'term':
   if(b>=3&&parity(it)===1)return{kind:'mc',q:it.m,sub:'あてはまる'+it.tag+'は？',choices:mkC(it.w,distractQA(it,'w')),exp:it.w+'：'+it.m};
   return{kind:'mc',q:'「'+it.w+'」',sub:it.tag+'の意味は？',choices:mkC(it.m,distractQA(it,'m')),exp:it.w+'：'+it.m};
  case 'syn':return{kind:'mc',q:'「'+it.w+'」',sub:it.tag==='対義語'?'反対の意味の言葉は？':'意味が近い言葉は？',choices:mkC(it.m,distractQA(it,'m')),exp:it.w+(it.tag==='対義語'?'　⇔　':'　≒　')+it.m};
  case 'qa':return{kind:'mc',q:it.q,sub:it.tag.split('/')[1]||it.tag,choices:mkC(it.a,distractQA(it,'a')),exp:it.exp};
  case 'order':{const t=it.en.split(' ');let s=shuffle(t);for(let i=0;i<8&&s.join(' ')===t.join(' ');i++)s=shuffle(t);
   return{kind:'order',q:it.ja,sub:'英語を正しい順にならべよう',tokens:s,answers:it.alts,join:' ',exp:it.en}}
  case 'seq':{let s=shuffle(it.seq);for(let i=0;i<8&&s.join('')===it.seq.join('');i++)s=shuffle(it.seq);
   return{kind:'order',q:'古い順に ならべよう',sub:it.tag,tokens:s,answers:[it.seq.join('\u0001')],join:'\u0001',exp:it.seq.join(' → ')+(it.exp?'　'+it.exp:'')}}
  case 'self':return{kind:'self',q:it.q,sub:it.tag,reveal:it.a,exp:it.exp};
  case 'gen':return{kind:it.ch?'mc':'num',q:it.q,sub:GEN[it.gid]?GEN[it.gid].name:'',choices:it.ch?mkC(it.ch[0],it.ch.slice(1)):null,accept:it.accept,unit:it.unit||'',disp:it.disp,exp:it.exp};
  case 'mist':return{kind:'self',q:it.q,sub:'学校のテストで まちがえた問題',reveal:it.a||'（自分の言葉で答えを言ってみよう）',exp:it.exp||''};
 }
 return{kind:'self',q:String(it.q||''),reveal:'',exp:''};
}

/* ----- 判定 ----- */
const normA=s=>String(s).replace(/[\s　]/g,'').replace(/[−‐‑–—－ー]/g,'-').replace(/＋/g,'+').replace(/[，、]/g,',').replace(/＝/g,'=').replace(/：/g,':').replace(/[０-９ａ-ｚＡ-Ｚ]/g,c=>String.fromCharCode(c.charCodeAt(0)-65248)).replace(/pi/gi,'π').replace(/sqrt/gi,'√').replace(/（/g,'(').replace(/）/g,')').toLowerCase().replace(/^\+/,'');
const toHira=s=>String(s).replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-96)).replace(/[\s　]/g,'');
function judge(V,resp){
 if(V.kind==='mc')return !!(V.choices[resp]&&V.choices[resp].ok);
 if(V.kind==='num')return V.accept.some(a=>normA(a)===normA(resp));
 if(V.kind==='typ')return V.accept.some(a=>V.hira?toHira(a)===toHira(resp):String(a).toLowerCase()===String(resp).trim().toLowerCase().replace(/\s+/g,' '));
 if(V.kind==='order')return V.answers.includes(resp.join(V.join));
 if(V.kind==='tf')return V.truth===resp;
 return !!resp;
}
const correctText=V=>V.kind==='tf'?(V.truth?'合ってる（'+V.claim+'）':'ちがう！　正解は「'+V.okText+'」'):V.kind==='mc'?V.choices.find(c=>c.ok).t:V.kind==='order'?V.answers[0].split(V.join).join(V.join==='\u0001'?' → ':' '):V.kind==='self'?V.reveal:(V.disp||V.accept[0]);

/* ライバルの答えをチェックする形（○か×か）。4択の問題から作る */
function toTF(V){
 const ok=V.choices.find(c=>c.ok),ws=V.choices.filter(c=>!c.ok),right=Math.random()<.5;
 return{kind:'tf',q:V.q,sub:'ライバルの答えを チェック！',claim:right?ok.t:pick(ws).t,truth:right,okText:ok.t,exp:V.exp,passage:V.passage,say:V.say};
}
