/* ===== 算数の自動生成ドリル（小4の復習）：わり算の筆算・がい数・小数・同分母の分数・面積・計算のきまり・大きな数 ===== */
const comma=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,',');
const fq4=(n,d)=>n+'/'+d;
const mix4=(n,d)=>Math.floor(n/d)+'と'+(n%d)+'/'+d;

GEN.div_long={name:'わり算の筆算',f(r,lv){
 let d,Q,rem,N;
 if(lv===1){d=ri(r,2,9);Q=ri(r,11,99);rem=0}
 else if(lv===2){d=ri(r,2,9);Q=ri(r,101,999);rem=r()<.6?ri(r,1,d-1):0}
 else{d=ri(r,11,59);Q=ri(r,12,99);rem=r()<.6?ri(r,1,d-1):0}
 N=d*Q+rem;
 if(!rem)return{q:`${N} ÷ ${d} ＝ ？`,a:[String(Q)],disp:String(Q),exp:[`筆算で、上の位から順に「たてる→かける→引く→おろす」をくり返す`,`${N} ÷ ${d} ＝ ${Q}`],v:()=>Q*d===N};
 const askQ=r()<.5;
 return{q:`${N} ÷ ${d} を計算して、${askQ?'商（しょう）':'あまり'}を答えよう。`,a:[String(askQ?Q:rem)],disp:String(askQ?Q:rem),exp:[`筆算で、上の位から順に「たてる→かける→引く→おろす」をくり返す`,`${N} ÷ ${d} ＝ ${Q} あまり ${rem}`,`たしかめ：${d} × ${Q} ＋ ${rem} ＝ ${N}`],v:()=>d*Q+rem===N&&rem<d};
}};

GEN.round={name:'がい数',f(r,lv){
 const nm={10:'十',100:'百',1000:'千',10000:'一万'};
 const rd0=(n,u)=>Math.round(n/u+1e-9)*u;
 if(lv===1){const u=pick([10,100],r),n=ri(r,111,9899),a=rd0(n,u);
  return{q:`${comma(n)} を、${nm[u]}の位までのがい数にすると？（四捨五入）`,a:[String(a)],disp:comma(a),exp:[`${nm[u]}の位までのがい数は、その1つ下の位を四捨五入する`,`${comma(n)} → ${comma(a)}`],v:()=>a===Math.floor((n+u/2)/u)*u}}
 if(lv===2){const u=pick([100,1000],r),n=ri(r,1234,98765),a=rd0(n,u);
  return{q:`${comma(n)} を、${u===100?'百':'千'}の位までのがい数にすると？（四捨五入）`,a:[String(a)],disp:comma(a),exp:[`${u===100?'百':'千'}の位までのがい数は、その1つ下の位を四捨五入する`,`${comma(n)} → ${comma(a)}`],v:()=>a===Math.floor((n+u/2)/u)*u}}
 if(r()<.5){const n=ri(r,12345,987654);
  return{q:`${comma(n)} を、上から1けたのがい数にすると？（四捨五入）`,a:[String(rd0(n,10**(String(n).length-1)))],disp:comma(rd0(n,10**(String(n).length-1))),exp:[`上から2けた目を四捨五入する`,`${comma(n)} → ${comma(rd0(n,10**(String(n).length-1)))}`],v:()=>true}}
 const n=ri(r,1500,9500),m=ri(r,2,9),k=Math.round(n/100)*100;
 const a=rd0(n,100)*m;
 return{q:`1こ ${comma(n)}円のものを ${m}こ買う。代金を、1この値段を百の位までのがい数にして見つもると？`,a:[String(a)],unit:'円',disp:comma(a)+'円',exp:[`${comma(n)}円を四捨五入して ${comma(rd0(n,100))}円`,`${comma(rd0(n,100))} × ${m} ＝ ${comma(a)}`],v:()=>a===k*m};
}};

GEN.dec_add={name:'小数のたし算・ひき算',f(r,lv){
 let A,B,k,sub=r()<.5;
 if(lv===1){k=1;A=nz10(r,12,89);B=nz10(r,12,89)}
 else if(lv===2){k=r()<.5?1:2;A=k===1?nz10(r,12,199):nz10(r,101,899);B=k===1?nz10(r,12,199):nz10(r,101,899)}
 else{k=2;A=nz10(r,101,1999);B=nz10(r,11,899)}
 if(sub&&A<B){const t=A;A=B;B=t}
 if(sub&&A===B)A+=k===1?7:7;
 const R=sub?A-B:A+B,ans=dq(R,k),op=sub?'−':'＋';
 return{q:`${dq(A,k)} ${op} ${dq(B,k)} ＝ ？`,a:[ans],disp:ans,exp:['小数点の位置をそろえて、筆算で計算する',`${dq(A,k)} ${op} ${dq(B,k)} ＝ ${ans}`],v:()=>Math.abs(+ans-(sub?(A-B):(A+B))/10**k)<1e-9};
}};

GEN.frac_same={name:'同じ分母の分数のたし算・ひき算',f(r,lv){
 const d=lv===1?ri(r,4,9):ri(r,5,13);
 if(lv<3||r()<.5){
  const sub=r()<.5;let a,b;
  if(sub){a=ri(r,3,d-1);b=ri(r,1,a-1);if(lv>=2&&r()<.4){a=ri(r,d+1,d+d-1);b=ri(r,1,d-1)}}
  else{a=ri(r,1,d-2);b=lv===1?ri(r,1,d-1-a):ri(r,1,d-1)}
  const R=sub?a-b:a+b;
  if(R%d===0){return GEN.frac_same.f(r,lv)}
  const ans=fq4(R,d),acc=[ans];if(R>d)acc.push(mix4(R,d));
  const reduced=rd(R,d);if(reduced[1]>1&&reduced[1]!==d)acc.push(rs(reduced));
  return{q:`${fq4(a,d)} ${sub?'−':'＋'} ${fq4(b,d)} ＝ ？`,a:acc,disp:R>d?`${ans}（${mix4(R,d)}）`:ans,exp:['分母が同じときは、分母はそのままで、分子だけを計算する',`${a} ${sub?'−':'＋'} ${b} ＝ ${R}　→　${ans}`],v:()=>R===(sub?a-b:a+b)};
 }
 // 帯分数
 const w1=ri(r,1,4),w2=ri(r,1,3),a=ri(r,1,d-1),b=ri(r,1,d-1),sub=r()<.5;
 if(sub){let W=w1+w2,A=a,B=b;
  if(A<B){const t=A;A=B;B=t}
  const R=(W*d+A)-(w2*d+B);
  if(R%d===0)return GEN.frac_same.f(r,lv);
  const ans=R>d?mix4(R,d):fq4(R,d);
  return{q:`${W}と${fq4(A,d)} − ${w2}と${fq4(B,d)} ＝ ？`,a:[ans,fq4(R,d)],disp:ans,exp:['整数どうし、分数どうしを計算する',`整数：${W} − ${w2} ＝ ${W-w2}、分数：${A}/${d} − ${B}/${d} ＝ ${A-B}/${d}`,`答えは ${ans}`],v:()=>R===(W*d+A)-(w2*d+B)};
 }
 const R=(w1*d+a)+(w2*d+b);
 if(R%d===0)return GEN.frac_same.f(r,lv);
 const ans=mix4(R,d);
 return{q:`${w1}と${fq4(a,d)} ＋ ${w2}と${fq4(b,d)} ＝ ？`,a:[ans,fq4(R,d)],disp:ans,exp:['整数どうし、分数どうしをたす。分数が1をこえたら、整数にくり上げる',`整数：${w1} ＋ ${w2} ＝ ${w1+w2}、分数：${a}/${d} ＋ ${b}/${d} ＝ ${a+b}/${d}`,`答えは ${ans}`],v:()=>R===(w1*d+a)+(w2*d+b)};
}};

GEN.area_rect={name:'長方形・正方形の面積',f(r,lv){
 if(lv===1){const a=ri(r,3,15),b=ri(r,3,15);
  return{q:`たて ${a}cm、よこ ${b}cm の長方形の面積は？`,a:[String(a*b)],unit:'cm²',disp:a*b+'cm²',exp:['長方形の面積 ＝ たて × よこ',`${a} × ${b} ＝ ${a*b}`],v:()=>a*b===a*b}}
 if(lv===2){
  if(r()<.5){const a=ri(r,4,25);
   return{q:`1辺が ${a}cm の正方形の面積は？`,a:[String(a*a)],unit:'cm²',disp:a*a+'cm²',exp:['正方形の面積 ＝ 1辺 × 1辺',`${a} × ${a} ＝ ${a*a}`],v:()=>true}}
  const a=ri(r,3,12),b=ri(r,3,12),m=ri(r,2,3);
  return{q:`面積が ${a*b}cm² で、たてが ${a}cm の長方形がある。よこの長さは？`,a:[String(b)],unit:'cm',disp:b+'cm',exp:['よこ ＝ 面積 ÷ たて',`${a*b} ÷ ${a} ＝ ${b}`],v:()=>a*b/a===b&&m>0}}
 const t=ri(r,0,2);
 if(t===0){const a=ri(r,2,9),b=ri(r,2,9);
  return{q:`たて ${a}m、よこ ${b}m の長方形の面積は何 m²？また、何 cm² ？ cm² で答えよう。（1m² ＝ 10000cm²）`,a:[String(a*b*10000)],unit:'cm²',disp:comma(a*b*10000)+'cm²',exp:[`面積 ＝ ${a} × ${b} ＝ ${a*b}m²`,`1m² ＝ 10000cm² だから ${a*b} × 10000 ＝ ${a*b*10000}`],v:()=>true}}
 if(t===1){const a=ri(r,6,15),b=ri(r,6,15),c=ri(r,2,a-3),d=ri(r,2,b-3);
  return{q:`たて ${a}cm、よこ ${b}cm の長方形から、たて ${c}cm、よこ ${d}cm の長方形を切り取った。のこりの面積は？`,a:[String(a*b-c*d)],unit:'cm²',disp:(a*b-c*d)+'cm²',exp:[`もとの面積 ${a} × ${b} ＝ ${a*b}`,`切り取った面積 ${c} × ${d} ＝ ${c*d}`,`${a*b} − ${c*d} ＝ ${a*b-c*d}`],v:()=>true}}
 const a=ri(r,3,9),b=ri(r,3,9),c=ri(r,3,9),d=ri(r,2,9),S=a*b+c*d;
 return{q:`たて ${a}cm、よこ ${b}cm の長方形と、たて ${c}cm、よこ ${d}cm の長方形をくっつけた図形の面積は？`,a:[String(S)],unit:'cm²',disp:S+'cm²',exp:[`${a} × ${b} ＝ ${a*b}`,`${c} × ${d} ＝ ${c*d}`,`${a*b} ＋ ${c*d} ＝ ${S}`],v:()=>true};
}};

GEN.calc_rule={name:'計算のきまり',f(r,lv){
 if(lv===1){
  if(r()<.5){const a=ri(r,2,9),b=ri(r,2,9),c=ri(r,2,9),v=a+b*c;
   return{q:`${a} ＋ ${b} × ${c} ＝ ？`,a:[String(v)],disp:String(v),exp:['×と÷は、＋と−より先に計算する',`${b} × ${c} ＝ ${b*c}、${a} ＋ ${b*c} ＝ ${v}`],v:()=>v===a+b*c}}
  const a=ri(r,2,9),b=ri(r,2,9),c=ri(r,2,9),v=(a+b)*c;
  return{q:`（${a} ＋ ${b}）× ${c} ＝ ？`,a:[String(v)],disp:String(v),exp:['（　）の中を先に計算する',`${a} ＋ ${b} ＝ ${a+b}、${a+b} × ${c} ＝ ${v}`],v:()=>v===(a+b)*c}}
 if(lv===2){const t=ri(r,0,2);
  if(t===0){const a=ri(r,20,90),b=ri(r,2,9),c=ri(r,2,9),v=a-b*c;
   if(v<=0)return GEN.calc_rule.f(r,lv);
   return{q:`${a} − ${b} × ${c} ＝ ？`,a:[String(v)],disp:String(v),exp:['×を先に計算する',`${b} × ${c} ＝ ${b*c}、${a} − ${b*c} ＝ ${v}`],v:()=>v===a-b*c}}
  if(t===1){const c=ri(r,2,9),q1=ri(r,2,9),b=ri(r,2,9),a=c*q1,v=a/c+b*c;
   return{q:`${a} ÷ ${c} ＋ ${b} × ${c} ＝ ？`,a:[String(v)],disp:String(v),exp:['×と÷を先に、左から計算する',`${a} ÷ ${c} ＝ ${q1}、${b} × ${c} ＝ ${b*c}、${q1} ＋ ${b*c} ＝ ${v}`],v:()=>v===q1+b*c}}
  const a=ri(r,20,60),b=ri(r,2,9),c=ri(r,2,6),v=(a-b)*c;
  return{q:`（${a} − ${b}）× ${c} ＝ ？`,a:[String(v)],disp:String(v),exp:['（　）の中を先に計算する',`${a} − ${b} ＝ ${a-b}、${a-b} × ${c} ＝ ${v}`],v:()=>v===(a-b)*c}}
 const t=ri(r,0,2);
 if(t===0){const a=ri(r,2,9),b=ri(r,2,9),c=ri(r,2,9),d=ri(r,2,9),v=(a+b)*c-d;
  if(v<=0)return GEN.calc_rule.f(r,lv);
  return{q:`（${a} ＋ ${b}）× ${c} − ${d} ＝ ？`,a:[String(v)],disp:String(v),exp:['（　）の中、×÷、＋−の順に計算する',`${a} ＋ ${b} ＝ ${a+b}、${a+b} × ${c} ＝ ${(a+b)*c}、${(a+b)*c} − ${d} ＝ ${v}`],v:()=>v===(a+b)*c-d}}
 if(t===1){const a=ri(r,2,9),b=ri(r,2,9),k=pick([4,5,6,8,10,25],r),v=a*k+b*k;
  return{q:`${a} × ${k} ＋ ${b} × ${k} ＝ ？（（${a} ＋ ${b}）× ${k} と考えてもよい）`,a:[String(v)],disp:String(v),exp:[`分配のきまり：${a} × ${k} ＋ ${b} × ${k} ＝（${a} ＋ ${b}）× ${k}`,`${a+b} × ${k} ＝ ${v}`],v:()=>v===(a+b)*k}}
 const p=ri(r,2,9),n=ri(r,2,9),pr=p*n,
  g=pick([[25,4],[50,2],[125,8]],r),m=ri(r,2,9);
 const v=g[0]*m*g[1];
 return{q:`くふうして計算しよう。${g[0]} × ${m} × ${g[1]} ＝ ？`,a:[String(v)],disp:String(v),exp:[`かけ算は順番を入れかえてもよい：${g[0]} × ${g[1]} ＝ ${g[0]*g[1]}`,`${g[0]*g[1]} × ${m} ＝ ${v}`],v:()=>v===g[0]*g[1]*m&&pr===p*n};
}};

GEN.big_num={name:'大きな数（億・兆）',f(r,lv){
 if(lv===1){const o=ri(r,1,9),k=ri(r,1,9),h=ri(r,1,9),n=o*100000000+k*10000000+h*1000000;
  return{q:`${o}億${k}千${h}百万を数字で書くと？`,a:[String(n)],disp:comma(n),exp:[`${o}億 ＝ ${comma(o*100000000)}`,`${k}千${h}百万 ＝ ${comma(k*10000000+h*1000000)}`,`あわせて ${comma(n)}`],v:()=>true}}
 if(lv===2){
  const t=ri(r,0,2);
  if(t===0){const a=ri(r,2,98),b=ri(r,1,9999);const n=a*10000+b;
   return{q:`${a}万${b}を、数字で書くと？`,a:[String(n)],disp:comma(n),exp:[`${a}万 ＝ ${comma(a*10000)}`,`${comma(a*10000)} ＋ ${b} ＝ ${comma(n)}`],v:()=>true}}
  if(t===1){const a=ri(r,2,99),n=a*100000000;
   return{q:`${a}億は、一万を何こ集めた数？`,a:[String(a*10000)],unit:'こ',disp:comma(a*10000)+'こ',exp:['1億 ＝ 10000万',`${a}億 ＝ ${comma(a*10000)}万`],v:()=>n/10000===a*10000}}
  const n=ri(r,2,9)*1000000+ri(r,1,9)*10000,k=pick([10,100],r);
  return{q:`${comma(n)} を ${k}倍した数は？`,a:[String(n*k)],disp:comma(n*k),exp:[`${k}倍すると、0が${String(k).length-1}こふえて、位が${String(k).length-1}つ上がる`,`${comma(n)} × ${k} ＝ ${comma(n*k)}`],v:()=>true}}
 const t=ri(r,0,2);
 if(t===0){const a=ri(r,2,9);
  return{q:`${a}兆は、1億を何こ集めた数？`,a:[String(a*10000)],unit:'こ',disp:comma(a*10000)+'こ',exp:['1兆 ＝ 1万億 ＝ 10000億',`${a}兆 ＝ ${comma(a*10000)}億`],v:()=>true}}
 if(t===1){const a=ri(r,11,99),b=ri(r,11,99),s=a+b;
  return{q:`${a}億 ＋ ${b}億 ＝ ？（億を単位として答える。「○億」の ○ の数だけ書く）`,a:[String(s)],unit:'億',disp:s+'億',exp:['億が何こ分かで考える',`${a} ＋ ${b} ＝ ${s}`],v:()=>true}}
 const a=ri(r,2,9),b=ri(r,1,9),n=a*1000000000000+b*100000000;
 return{q:`${a}兆${b}億を、数字で書くと？`,a:[String(n)],disp:comma(n),exp:[`${a}兆 ＝ ${comma(a*1000000000000)}`,`${b}億 ＝ ${comma(b*100000000)}`,`あわせて ${comma(n)}`],v:()=>true};
}};

/* 3けた以上の答えは、コンマ入りも正解にする */
['div_long','round','dec_add','frac_same','area_rect','calc_rule','big_num'].forEach(id=>{const g=GEN[id],f0=g.f;g.f=(r,lv)=>{const o=f0(r,lv);o.a=o.a.concat(o.a.filter(x=>/^\d{4,}$/.test(x)).map(comma));return o}});
