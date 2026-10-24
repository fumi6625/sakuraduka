/* ===== 算数の自動生成ドリル（6年）：分数・文字と式・比・円・柱の体積・比例・場合の数・縮図・代表値 ===== */
const fq=x=>x[0]+'/'+x[1];                                  // 分数の表示
const mq=(w,x)=>w+'と'+x[0]+'/'+x[1];                         // 帯分数の表示
const impr=(w,x)=>[w*x[1]+x[0],x[1]];                         // 帯分数 → 仮分数
const rr=(a,b)=>Math.abs(rv(a)-rv(b))<1e-9;

GEN.frac_mul={name:'分数のかけ算',f(r,lv){
 if(lv===1){const x=pfr(r,ri(r,3,9)),n=ri(r,2,9),res=rmul(x,[n,1]);
  return{q:`${fq(x)} × ${n} ＝ ？（約分する）`,a:fa(res),disp:fd(res),exp:['分母はそのままで、分子にかける',`${x[0]} × ${n} ＝ ${x[0]*n}　→　${x[0]*n}/${x[1]}`+(gcd(x[0]*n,x[1])>1?`　約分して ${rs(res)}`:'')],v:()=>rr(res,[x[0]*n,x[1]])}}
 if(lv===2){const x=pfr(r,ri(r,3,9)),y=pfr(r,ri(r,3,9)),res=rmul(x,y);
  return{q:`${fq(x)} × ${fq(y)} ＝ ？（約分する）`,a:fa(res),disp:fd(res),exp:['分子どうし、分母どうしをかける（先に約分するとラク）',`${x[0]*y[0]}/${x[1]*y[1]}`+(gcd(x[0]*y[0],x[1]*y[1])>1?`　約分して ${rs(res)}`:'')],v:()=>rr(res,[x[0]*y[0],x[1]*y[1]])}}
 const t=ri(r,0,2);
 if(t===0){const w=ri(r,1,3),x=pfr(r,ri(r,2,6)),y=pfr(r,ri(r,3,8)),A=impr(w,x),res=rmul(A,y);
  return{q:`${mq(w,x)} × ${fq(y)} ＝ ？（約分する）`,a:fa(res),disp:fd(res),exp:[`帯分数を仮分数に直す：${mq(w,x)} ＝ ${fq(A)}`,`${fq(A)} × ${fq(y)} ＝ ${rs(res)}`],v:()=>Math.abs(rv(res)-(w+x[0]/x[1])*y[0]/y[1])<1e-9}}
 if(t===1){const x=pfr(r,ri(r,2,5)),y=pfr(r,ri(r,3,6)),z=pfr(r,ri(r,3,7)),res=rmul(rmul(x,y),z);
  return{q:`${fq(x)} × ${fq(y)} × ${fq(z)} ＝ ？（約分する）`,a:fa(res),disp:fd(res),exp:['3つの分数も、分子どうし・分母どうしをかける',`${x[0]*y[0]*z[0]}/${x[1]*y[1]*z[1]}　約分して ${rs(res)}`],v:()=>Math.abs(rv(res)-rv(x)*rv(y)*rv(z))<1e-9}}
 const x=pfr(r,ri(r,2,5)),y=pfr(r,ri(r,3,8)),res=rmul(x,y);
 return{q:`1m の重さが ${fq(x)}kg のぼうがある。このぼう ${fq(y)}m の重さは何kg？`,a:fa(res),unit:'kg',disp:fd(res)+'kg',exp:['（1mの重さ）×（長さ）で求める',`${fq(x)} × ${fq(y)} ＝ ${rs(res)}`],v:()=>rr(res,[x[0]*y[0],x[1]*y[1]])};
}};

GEN.frac_div={name:'分数のわり算',f(r,lv){
 if(lv===1){const x=pfr(r,ri(r,2,9)),n=ri(r,2,9),res=rdiv(x,[n,1]);
  return{q:`${fq(x)} ÷ ${n} ＝ ？（約分する）`,a:fa(res),disp:fd(res),exp:['整数でわるときは、分母にその整数をかける',`${x[0]}/${x[1]*n}`+(gcd(x[0],x[1]*n)>1?`　約分して ${rs(res)}`:'')],v:()=>rr(res,[x[0],x[1]*n])}}
 if(lv===2){let x,y;do{x=pfr(r,ri(r,2,9));y=pfr(r,ri(r,2,9))}while(rr(x,y));const res=rdiv(x,y);
  return{q:`${fq(x)} ÷ ${fq(y)} ＝ ？（約分する）`,a:fa(res),disp:fd(res),exp:['わる数の分母と分子を入れかえて、かけ算にする',`${fq(x)} × ${y[1]}/${y[0]} ＝ ${rs(res)}`],v:()=>Math.abs(rv(res)-rv(x)/rv(y))<1e-9}}
 const t=ri(r,0,2);
 if(t===0){const w=ri(r,1,3),x=pfr(r,ri(r,2,6)),y=pfr(r,ri(r,3,8)),A=impr(w,x),res=rdiv(A,y);
  return{q:`${mq(w,x)} ÷ ${fq(y)} ＝ ？（約分する）`,a:fa(res),disp:fd(res),exp:[`帯分数を仮分数に直す：${mq(w,x)} ＝ ${fq(A)}`,`${fq(A)} × ${y[1]}/${y[0]} ＝ ${rs(res)}`],v:()=>Math.abs(rv(res)-(w+x[0]/x[1])/rv(y))<1e-9}}
 if(t===1){const n=ri(r,2,9),y=pfr(r,ri(r,2,8)),res=rdiv([n,1],y);
  return{q:`${n} ÷ ${fq(y)} ＝ ？（約分する）`,a:fa(res),disp:fd(res),exp:['整数は ○/1 と考える。わる数の分母と分子を入れかえてかける',`${n} × ${y[1]}/${y[0]} ＝ ${rs(res)}`],v:()=>Math.abs(rv(res)-n/rv(y))<1e-9}}
 const y=pfr(r,ri(r,3,8)),k=ri(r,2,9),x=rmul(y,[k,1]);
 return{q:`${rs(x)}L のジュースを、${fq(y)}L ずつコップに入れる。何はいに なる？`,a:[String(k)],unit:'はい',disp:k+'はい',exp:['全体 ÷ 1つ分 ＝ いくつ分',`${rs(x)} ÷ ${fq(y)} ＝ ${rs(x)} × ${y[1]}/${y[0]} ＝ ${k}`],v:()=>rr(rdiv(x,y),[k,1])};
}};

const DEC=[['0.1',[1,10]],['0.2',[1,5]],['0.25',[1,4]],['0.4',[2,5]],['0.5',[1,2]],['0.6',[3,5]],['0.75',[3,4]],['0.8',[4,5]],['1.5',[3,2]],['2.5',[5,2]],['1.2',[6,5]]];
GEN.frac_mix={name:'分数・小数のまじった計算',f(r,lv){
 const d=pick(DEC,r),x=pfr(r,pick([3,4,5,6,8,10],r)),sw=r()<.5;
 const dFix=`小数を分数に直す：${d[0]} ＝ ${fq(d[1])}`;
 if(lv===1){const add=r()<.5;let A=sw?d:[fq(x),x],B=sw?[fq(x),x]:d;
  let a=sw?d[1]:x,b=sw?x:d[1],sA=sw?d[0]:fq(x),sB=sw?fq(x):d[0];
  if(!add&&rv(a)<rv(b)){[a,b]=[b,a];[sA,sB]=[sB,sA]}
  const res=add?radd(a,b):rsub(a,b);
  if(rv(res)<=0)return GEN.frac_mix.f(r,lv);
  return{q:`${sA} ${add?'＋':'−'} ${sB} ＝ ？（分数で答える）`,a:fa(res),disp:fd(res),exp:[dFix,`通分して計算：${fq(a)} ${add?'＋':'−'} ${fq(b)} ＝ ${rs(res)}`],v:()=>Math.abs(rv(res)-(add?rv(a)+rv(b):rv(a)-rv(b)))<1e-9}}
 if(lv===2){const mul=r()<.5,a=sw?d[1]:x,b=sw?x:d[1],sA=sw?d[0]:fq(x),sB=sw?fq(x):d[0],res=mul?rmul(a,b):rdiv(a,b);
  return{q:`${sA} ${mul?'×':'÷'} ${sB} ＝ ？（分数で答える）`,a:fa(res),disp:fd(res),exp:[dFix,mul?`${fq(a)} × ${fq(b)} ＝ ${rs(res)}`:`${fq(a)} × ${b[1]}/${b[0]} ＝ ${rs(res)}`],v:()=>Math.abs(rv(res)-(mul?rv(a)*rv(b):rv(a)/rv(b)))<1e-9}}
 const y=pfr(r,pick([2,3,4,5,6],r)),z=pfr(r,pick([3,4,5,6,8],r)),mul=r()<.5,tail=r()<.5;
 const head=mul?rmul(d[1],y):rdiv(d[1],y),res=tail?radd(head,z):rsub(head,z);
 if(rv(res)<=0)return GEN.frac_mix.f(r,lv);
 return{q:`${d[0]} ${mul?'×':'÷'} ${fq(y)} ${tail?'＋':'−'} ${fq(z)} ＝ ？（分数で答える）`,a:fa(res),disp:fd(res),exp:[dFix,`先に${mul?'かけ算':'わり算'}：${d[0]} ${mul?'×':'÷'} ${fq(y)} ＝ ${rs(head)}`,`${rs(head)} ${tail?'＋':'−'} ${fq(z)} ＝ ${rs(res)}`],v:()=>Math.abs(rv(res)-((mul?rv(d[1])*rv(y):rv(d[1])/rv(y))+(tail?1:-1)*rv(z)))<1e-9};
}};

GEN.letter_x={name:'文字と式（xを求める）',f(r,lv){
 const X=ri(r,2,20);
 if(lv===1){const t=ri(r,0,3),a=ri(r,2,9);
  if(t===0){const b=X+a;return{q:`x ＋ ${a} ＝ ${b}　のとき、x は？`,a:[String(X)],disp:String(X),exp:['たし算の逆は、ひき算',`x ＝ ${b} − ${a} ＝ ${X}`],v:()=>X+a===b}}
  if(t===1){const b=X-a>0?X-a:X;const aa=X-b;if(aa<=0)return GEN.letter_x.f(r,lv);return{q:`x − ${aa} ＝ ${b}　のとき、x は？`,a:[String(X)],disp:String(X),exp:['ひき算の逆は、たし算',`x ＝ ${b} ＋ ${aa} ＝ ${X}`],v:()=>X-aa===b}}
  if(t===2){const b=a*X;return{q:`${a} × x ＝ ${b}　のとき、x は？`,a:[String(X)],disp:String(X),exp:['かけ算の逆は、わり算',`x ＝ ${b} ÷ ${a} ＝ ${X}`],v:()=>a*X===b}}
  const b=X,xv=a*X;return{q:`x ÷ ${a} ＝ ${b}　のとき、x は？`,a:[String(xv)],disp:String(xv),exp:['わり算の逆は、かけ算',`x ＝ ${b} × ${a} ＝ ${xv}`],v:()=>xv/a===b}}
 if(lv===2){const t=ri(r,0,2),a=ri(r,2,9),b=ri(r,2,30);
  if(t===0){const c=a*X+b;return{q:`${a} × x ＋ ${b} ＝ ${c}　のとき、x は？`,a:[String(X)],disp:String(X),exp:[`まず ＋${b} をもどす：${a} × x ＝ ${c} − ${b} ＝ ${c-b}`,`x ＝ ${c-b} ÷ ${a} ＝ ${X}`],v:()=>a*X+b===c}}
  if(t===1){const c=a*X-b;if(c<=0)return GEN.letter_x.f(r,lv);return{q:`${a} × x − ${b} ＝ ${c}　のとき、x は？`,a:[String(X)],disp:String(X),exp:[`まず −${b} をもどす：${a} × x ＝ ${c} ＋ ${b} ＝ ${c+b}`,`x ＝ ${c+b} ÷ ${a} ＝ ${X}`],v:()=>a*X-b===c}}
  const p=ri(r,3,12)*10,c=p*X+b*10;
  return{q:`1本 ${p}円のえんぴつを x本と、${b*10}円のけしゴムを買ったら、${c}円だった。x は？`,a:[String(X)],disp:String(X),exp:[`式：${p} × x ＋ ${b*10} ＝ ${c}`,`${p} × x ＝ ${c} − ${b*10} ＝ ${c-b*10}`,`x ＝ ${c-b*10} ÷ ${p} ＝ ${X}`],v:()=>p*X+b*10===c}}
 const t=ri(r,0,3),a=ri(r,2,9),b=ri(r,2,12);
 if(t===0){const c=a*(X+b);return{q:`（x ＋ ${b}）× ${a} ＝ ${c}　のとき、x は？`,a:[String(X)],disp:String(X),exp:[`かっこの中を先に求める：x ＋ ${b} ＝ ${c} ÷ ${a} ＝ ${c/a}`,`x ＝ ${c/a} − ${b} ＝ ${X}`],v:()=>(X+b)*a===c}}
 if(t===1){const xv=a*X,c=X+b;return{q:`x ÷ ${a} ＋ ${b} ＝ ${c}　のとき、x は？`,a:[String(xv)],disp:String(xv),exp:[`まず ＋${b} をもどす：x ÷ ${a} ＝ ${c} − ${b} ＝ ${X}`,`x ＝ ${X} × ${a} ＝ ${xv}`],v:()=>xv/a+b===c}}
 if(t===2){const c=a*X+b*X;return{q:`${a} × x ＋ ${b} × x ＝ ${c}　のとき、x は？`,a:[String(X)],disp:String(X),exp:[`x が ${a}個と ${b}個で、あわせて x が ${a+b}個`,`${a+b} × x ＝ ${c}　→　x ＝ ${c} ÷ ${a+b} ＝ ${X}`],v:()=>(a+b)*X===c}}
 const n=ri(r,3,9),k=ri(r,2,6)*10,c=n*X+k*3;
 return{q:`1さつ x円のノートを ${n}さつと、${k}円のえんぴつを 3本買ったら、${c}円だった。ノート1さつのねだん x は？`,a:[String(X)],unit:'円',disp:X+'円',exp:[`式：${n} × x ＋ ${k} × 3 ＝ ${c}`,`${n} × x ＝ ${c} − ${k*3} ＝ ${n*X}`,`x ＝ ${n*X} ÷ ${n} ＝ ${X}`],v:()=>n*X+k*3===c};
}};

GEN.ratio={name:'比',f(r,lv){
 if(lv===1){
  let m,n;do{m=ri(r,1,9);n=ri(r,1,9)}while(m===n||gcd(m,n)>1);
  if(r()<.5){const g=ri(r,2,9);
   return{q:`${g*m}:${g*n} を、いちばん簡単な整数の比にすると？`,a:[`${m}:${n}`],disp:`${m}:${n}`,exp:['比の両方を、同じ数でわっても比は変わらない',`${g*m} と ${g*n} を ${g} でわって ${m}:${n}`],v:()=>(g*m)/g===m&&(g*n)/g===n&&gcd(m,n)===1}}
  const x=rd(m,n);
  return{q:`${m}:${n} の比の値（ひのあたい）は？`,a:fa(x),disp:fd(x),exp:['比の値 ＝ 前の数 ÷ 後ろの数',`${m} ÷ ${n} ＝ ${fq(x)}`],v:()=>Math.abs(rv(x)-m/n)<1e-9}}
 if(lv===2){const a=ri(r,1,9),b=ri(r,2,9),k=ri(r,2,9);if(a===b)return GEN.ratio.f(r,lv);
  if(r()<.5)return{q:`${a}:${b} ＝ ${a*k}:x　のとき、x は？`,a:[String(b*k)],disp:String(b*k),exp:[`前の数が ${a} から ${a*k} で ${k}倍`,`後ろの数も ${k}倍：${b} × ${k} ＝ ${b*k}`],v:()=>a*(b*k)===b*(a*k)};
  return{q:`${a}:${b} ＝ x:${b*k}　のとき、x は？`,a:[String(a*k)],disp:String(a*k),exp:[`後ろの数が ${b} から ${b*k} で ${k}倍`,`前の数も ${k}倍：${a} × ${k} ＝ ${a*k}`],v:()=>a*(b*k)===b*(a*k)}}
 const t=ri(r,0,2);
 if(t===0){let a,b;do{a=ri(r,1,7);b=ri(r,1,7)}while(a===b||gcd(a,b)>1);const T=(a+b)*ri(r,2,9),big=Math.max(a,b)*T/(a+b),small=Math.min(a,b)*T/(a+b);
  return{q:`${T}cm のひもを ${a}:${b} に分ける。長いほうは何cm？`,a:[String(big)],unit:'cm',disp:big+'cm',exp:[`全体は ${a} ＋ ${b} ＝ ${a+b} 個分。1個分は ${T} ÷ ${a+b} ＝ ${T/(a+b)}cm`,`長いほうは ${Math.max(a,b)} 個分：${T/(a+b)} × ${Math.max(a,b)} ＝ ${big}`],v:()=>big+small===T}}
 if(t===1){let a,b;do{a=ri(r,1,8);b=ri(r,2,9)}while(a===b||gcd(a,b)>1);const k=ri(r,2,8),A=a*k,B=b*k;
  return{q:`あきらさんとさくらさんの持っているシールの数の比は ${a}:${b}。あきらさんが ${A}まいのとき、さくらさんは何まい？`,a:[String(B)],unit:'まい',disp:B+'まい',exp:[`${a} が ${A} だから、1にあたる数は ${A} ÷ ${a} ＝ ${k}`,`さくらさんは ${b} にあたるので ${k} × ${b} ＝ ${B}`],v:()=>A*b===B*a}}
 let a,b;do{a=ri(r,2,7);b=ri(r,2,7)}while(a===b||gcd(a,b)>1);const k=ri(r,2,6),W=b*k,H=a*k;
 return{q:`たてとよこの長さの比が ${a}:${b} の長方形がある。よこが ${W}cm のとき、たては何cm？`,a:[String(H)],unit:'cm',disp:H+'cm',exp:[`${b} が ${W}cm だから、1にあたる長さは ${W} ÷ ${b} ＝ ${k}cm`,`たては ${a} にあたるので ${k} × ${a} ＝ ${H}`],v:()=>H*b===W*a};
}};

GEN.circle_area={name:'円の面積',f(r,lv){
 const A2=(x)=>nf(x*314/100);
 if(lv===1){const R=ri(r,2,12),S=A2(R*R);
  return{q:`半径が ${R}cm の円の面積は何cm²？（円周率は 3.14）`,a:[S],unit:'cm²',disp:S+'cm²',exp:['円の面積 ＝ 半径 × 半径 × 円周率',`${R} × ${R} × 3.14 ＝ ${S}`],v:()=>Math.abs(+S-R*R*3.14)<1e-9}}
 if(lv===2){const d=ri(r,2,12)*2,R=d/2,S=A2(R*R);
  return{q:`直径が ${d}cm の円の面積は何cm²？（円周率は 3.14）`,a:[S],unit:'cm²',disp:S+'cm²',exp:[`半径 ＝ ${d} ÷ 2 ＝ ${R}cm`,`${R} × ${R} × 3.14 ＝ ${S}`],v:()=>Math.abs(+S-R*R*3.14)<1e-9}}
 const t=ri(r,0,2);
 if(t===0){const R=ri(r,2,10),S=nf(R*R*3.14/2);
  return{q:`半径 ${R}cm の半円の面積は何cm²？（円周率は 3.14）`,a:[S],unit:'cm²',disp:S+'cm²',exp:[`円の面積：${R} × ${R} × 3.14 ＝ ${A2(R*R)}`,`半円は、その半分：${A2(R*R)} ÷ 2 ＝ ${S}`],v:()=>Math.abs(+S-R*R*3.14/2)<1e-9}}
 if(t===1){const R=ri(r,4,12),s=ri(r,2,R-1),S=A2(R*R-s*s);
  return{q:`半径 ${R}cm の円から、同じ中心で半径 ${s}cm の円をくりぬいた。のこりの面積は何cm²？（円周率は 3.14）`,a:[S],unit:'cm²',disp:S+'cm²',exp:[`大きい円：${R} × ${R} × 3.14 ＝ ${A2(R*R)}`,`小さい円：${s} × ${s} × 3.14 ＝ ${A2(s*s)}`,`${A2(R*R)} − ${A2(s*s)} ＝ ${S}`],v:()=>Math.abs(+S-(R*R-s*s)*3.14)<1e-9}}
 const d=ri(r,2,10)*2,C=nf(d*3.14),R=d/2,S=A2(R*R);
 return{q:`円周が ${C}cm の円の面積は何cm²？（円周率は 3.14）`,a:[S],unit:'cm²',disp:S+'cm²',exp:[`直径 ＝ ${C} ÷ 3.14 ＝ ${d}cm、半径 ＝ ${R}cm`,`面積 ＝ ${R} × ${R} × 3.14 ＝ ${S}`],v:()=>Math.abs(d*3.14-+C)<1e-9&&Math.abs(+S-R*R*3.14)<1e-9};
}};

GEN.prism_vol={name:'角柱・円柱の体積',f(r,lv){
 const U='cm³';
 const tri=()=>{let b,h;do{b=ri(r,3,14);h=ri(r,3,12)}while(b*h%2);return[b,h,b*h/2]};
 if(lv===1){
  if(r()<.5){const S=ri(r,10,60),H=ri(r,3,12),V=S*H;
   return{q:`底面積が ${S}cm²、高さが ${H}cm の角柱の体積は？`,a:[String(V)],unit:U,disp:V+U,exp:['柱の体積 ＝ 底面積 × 高さ',`${S} × ${H} ＝ ${V}`],v:()=>V/H===S}}
  const[b,h,S]=tri(),H=ri(r,3,12),V=S*H;
  return{q:`底面が、底辺 ${b}cm・高さ ${h}cm の三角形で、高さが ${H}cm の三角柱の体積は？`,a:[String(V)],unit:U,disp:V+U,exp:[`底面積：${b} × ${h} ÷ 2 ＝ ${S}cm²`,`体積 ＝ ${S} × ${H} ＝ ${V}`],v:()=>V*2===b*h*H}}
 if(lv===2){
  if(r()<.7){const R=ri(r,2,10),H=ri(r,3,15),V=nf(R*R*H*314/100);
   return{q:`底面の半径が ${R}cm、高さが ${H}cm の円柱の体積は？（円周率は 3.14）`,a:[V],unit:U,disp:V+U,exp:[`底面積：${R} × ${R} × 3.14 ＝ ${nf(R*R*314/100)}cm²`,`体積 ＝ ${nf(R*R*314/100)} × ${H} ＝ ${V}`],v:()=>Math.abs(+V-R*R*3.14*H)<1e-9}}
  const[b,h,S]=tri(),H=ri(r,4,15),V=S*H;
  return{q:`底面が、底辺 ${b}cm・高さ ${h}cm の三角形で、高さが ${H}cm の三角柱の体積は？`,a:[String(V)],unit:U,disp:V+U,exp:[`底面積：${b} × ${h} ÷ 2 ＝ ${S}cm²`,`体積 ＝ ${S} × ${H} ＝ ${V}`],v:()=>V*2===b*h*H}}
 const t=ri(r,0,2);
 if(t===0){let a,b,h;do{a=ri(r,2,8);b=ri(r,a+1,12);h=ri(r,3,8)}while((a+b)*h%2);const H=ri(r,3,10),S=(a+b)*h/2,V=S*H;
  return{q:`底面が、上底 ${a}cm・下底 ${b}cm・高さ ${h}cm の台形で、高さが ${H}cm の四角柱の体積は？`,a:[String(V)],unit:U,disp:V+U,exp:[`底面積：（${a} ＋ ${b}）× ${h} ÷ 2 ＝ ${S}cm²`,`体積 ＝ ${S} × ${H} ＝ ${V}`],v:()=>V*2===(a+b)*h*H}}
 if(t===1){const R=ri(r,2,10),H=ri(r,3,12),V=nf(R*R*314/100*H);
  return{q:`体積が ${V}cm³、底面の半径が ${R}cm の円柱がある。高さは何cm？（円周率は 3.14）`,a:[String(H)],unit:'cm',disp:H+'cm',exp:[`底面積：${R} × ${R} × 3.14 ＝ ${nf(R*R*314/100)}cm²`,`高さ ＝ 体積 ÷ 底面積 ＝ ${V} ÷ ${nf(R*R*314/100)} ＝ ${H}`],v:()=>Math.abs(R*R*3.14*H-+V)<1e-9}}
 const R=ri(r,2,8),H=ri(r,3,12),V=nf(R*R*314*H/200);
 return{q:`円柱を たてに半分に切った立体（底面が半円・半径 ${R}cm、高さ ${H}cm）の体積は？（円周率は 3.14）`,a:[V],unit:U,disp:V+U,exp:[`底面積（半円）：${R} × ${R} × 3.14 ÷ 2 ＝ ${nf(R*R*314/200)}cm²`,`体積 ＝ ${nf(R*R*314/200)} × ${H} ＝ ${V}`],v:()=>Math.abs(+V-R*R*3.14*H/2)<1e-9};
}};

const PROP_P=['1本80円のえんぴつの、本数と代金','時速60kmで進む車の、時間と道のり','1mが150gのはり金の、長さと重さ','正方形の1辺の長さと、まわりの長さ','1分に3L入る水そうの、時間と水の量','1こ50円のあめの、こ数と代金'];
const PROP_I=['面積が24cm²の長方形の、たてとよこ','12kmの道のりを進む、速さと時間','同じ仕事をする、人数とかかる日数','60ページの本を読む、1日のページ数と日数','1200円を分けるときの、人数と1人分','24このあめを分けるときの、人数と1人分'];
GEN.prop_inv={name:'比例と反比例',f(r,lv){
 if(lv===1){const k=ri(r,2,9),x1=ri(r,2,6),x2=ri(r,x1+1,12),y1=k*x1,y2=k*x2;
  return{q:`y は x に比例している。x が ${x1} のとき y は ${y1}。x が ${x2} のとき、y は？`,a:[String(y2)],disp:String(y2),exp:[`比例は y ÷ x がいつも同じ：${y1} ÷ ${x1} ＝ ${k}`,`y ＝ ${k} × ${x2} ＝ ${y2}`],v:()=>y1*x2===y2*x1}}
 const inv=()=>{const x1=pick([2,3,4,5,6],r),y1=ri(r,2,12),P=x1*y1,xs=divs(P).filter(d=>d!==x1&&d<=24),x2=pick(xs.length?xs:[1],r),y2=P/x2;
  return{q:`y は x に反比例している。x が ${x1} のとき y は ${y1}。x が ${x2} のとき、y は？`,a:[nf(y2)],disp:nf(y2),exp:[`反比例は x × y がいつも同じ：${x1} × ${y1} ＝ ${P}`,`y ＝ ${P} ÷ ${x2} ＝ ${nf(y2)}`],v:()=>x1*y1===x2*y2}};
 if(lv===2){
  if(r()<.5)return inv();
  const P=pick([12,18,24,30,36,48,60],r),x=pick(divs(P).filter(d=>d>=2&&d<=12),r),y=P/x;
  return{q:`x と y は反比例していて、式は y ＝ ${P} ÷ x。x が ${x} のとき、y は？`,a:[String(y)],disp:String(y),exp:[`式の x に ${x} を入れる`,`y ＝ ${P} ÷ ${x} ＝ ${y}`],v:()=>y*x===P}}
 const t=ri(r,0,2);
 if(t<2){const wantInv=t===0,ok=wantInv?PROP_I:PROP_P,ng=wantInv?PROP_P:PROP_I,c=pick(ok,r),ws=[];
  const pool=ng.slice();while(ws.length<3){const w=pool.splice(Math.floor(r()*pool.length),1)[0];ws.push(w)}
  const nm=wantInv?'反比例（はんぴれい）':'比例';
  return{q:`次のうち、${nm}の関係になっているのは？`,ch:[c,...ws],disp:c,exp:wantInv?['一方が2倍・3倍になると、もう一方が 1/2・1/3 になるのが反比例','（かけ算 x × y がいつも同じ）']:['一方が2倍・3倍になると、もう一方も2倍・3倍になるのが比例','（わり算 y ÷ x がいつも同じ）'],v:()=>(wantInv?PROP_I:PROP_P).includes(c)&&ws.every(w=>(wantInv?PROP_P:PROP_I).includes(w))}}
 return inv();
}};

GEN.comb={name:'場合の数',f(r,lv){
 const F=n=>n<=1?1:n*F(n-1);
 const perm=(n,k)=>k===0?1:n*perm(n-1,k-1);
 const brute=(n,k,ordered)=>{let c=0;const go=(used,cnt,last)=>{if(cnt===k){c++;return}for(let i=ordered?0:last+1;i<n;i++)if(ordered?!used.includes(i):true)go([...used,i],cnt+1,i)};go([],0,-1);return c};
 const NM=['A','B','C','D','E','F','G','H'];
 if(lv===1){
  if(r()<.7){const n=ri(r,3,4),L=NM.slice(0,n),ans=F(n);
   return{q:`${L.join('、')} の ${n}人が 1列にならぶ。ならび方は何通り？`,a:[String(ans)],unit:'通り',disp:ans+'通り',exp:[n===3?'1番目は3通り、2番目は2通り、3番目は1通り':'1番目は4通り、2番目は3通り、3番目は2通り、4番目は1通り',n===3?'3 × 2 × 1 ＝ 6':'4 × 3 × 2 × 1 ＝ 24'],v:()=>brute(n,n,true)===ans}}
  const a=ri(r,2,4),b=ri(r,2,4),ans=a*b;
  return{q:`シャツが ${a}種類、ズボンが ${b}種類ある。シャツとズボンの組み合わせは何通り？`,a:[String(ans)],unit:'通り',disp:ans+'通り',exp:[`シャツ1種類ごとに、ズボンが ${b}通り`,`${a} × ${b} ＝ ${ans}`],v:()=>{let c=0;for(let i=0;i<a;i++)for(let j=0;j<b;j++)c++;return c===ans}}}
 if(lv===2){const t=ri(r,0,2);
  if(t===0){const n=ri(r,4,7),ans=perm(n,2);
   return{q:`${n}人の中から、委員長と副委員長を 1人ずつえらぶ。えらび方は何通り？`,a:[String(ans)],unit:'通り',disp:ans+'通り',exp:[`委員長は ${n}通り。そのうえで副委員長は、のこりの ${n-1}通り`,`${n} × ${n-1} ＝ ${ans}`],v:()=>brute(n,2,true)===ans}}
  if(t===1){const n=ri(r,4,5),ans=perm(n,3),cs=Array.from({length:n},(_, i)=>i+1);
   return{q:`${cs.join('、')} の数字カードが 1まいずつある。3まい えらんで ならべ、3けたの整数を作る。何通りできる？`,a:[String(ans)],unit:'通り',disp:ans+'通り',exp:[`百の位は ${n}通り、十の位は ${n-1}通り、一の位は ${n-2}通り`,`${n} × ${n-1} × ${n-2} ＝ ${ans}`],v:()=>brute(n,3,true)===ans}}
  const k=ri(r,3,4),ans=2**k;
  return{q:`10円玉を ${k}回なげる。表と裏の出方は、全部で何通り？`,a:[String(ans)],unit:'通り',disp:ans+'通り',exp:['1回ごとに、表か裏の 2通り',`${Array(k).fill(2).join(' × ')} ＝ ${ans}`],v:()=>{let c=1;for(let i=0;i<k;i++)c*=2;return c===ans}}}
 const t=ri(r,0,2);
 if(t<2){const n=ri(r,4,8),ans=n*(n-1)/2;
  return{q:`${n}チームで、どのチームとも 1回ずつ試合をする。試合は全部で何試合？`,a:[String(ans)],unit:'試合',disp:ans+'試合',exp:[`1チームが ${n-1}試合、${n}チームで ${n} × ${n-1} ＝ ${n*(n-1)}`,`1試合を2回数えているので 2 でわって ${ans}`],v:()=>brute(n,2,false)===ans}}
 const n=ri(r,5,7),ans=n*(n-1)*(n-2)/6;
 return{q:`${n}人の中から、そうじ当番を 3人えらぶ。えらび方は何通り？（順番は関係ない）`,a:[String(ans)],unit:'通り',disp:ans+'通り',exp:[`順番を決めてえらぶと ${n} × ${n-1} × ${n-2} ＝ ${n*(n-1)*(n-2)}通り`,`同じ3人を 3 × 2 × 1 ＝ 6通りに数えているので ${n*(n-1)*(n-2)} ÷ 6 ＝ ${ans}`],v:()=>brute(n,3,false)===ans};
}};

GEN.scale={name:'拡大図・縮図・縮尺',f(r,lv){
 if(lv===1){const s=pick([100,200,500,1000,2000,5000,10000],r),c=ri(r,2,12),m=c*s/100;
  return{q:`縮尺（しゅくしゃく）1/${s} の地図で、2地点が ${c}cm はなれている。実際の きょりは何m？`,a:[nf(m)],unit:'m',disp:nf(m)+'m',exp:[`実際の長さ ＝ 地図の長さ × ${s}`,`${c} × ${s} ＝ ${c*s}cm ＝ ${nf(m)}m`],v:()=>Math.abs(m*100-c*s)<1e-9}}
 if(lv===2){const s=pick([100,200,500,1000,2000,5000],r),c=ri(r,2,15),m=c*s/100;
  return{q:`実際は ${m}m の長さを、縮尺 1/${s} の図にかく。図では何cm？`,a:[String(c)],unit:'cm',disp:c+'cm',exp:[`${m}m ＝ ${m*100}cm`,`図の長さ ＝ 実際の長さ ÷ ${s}　→　${m*100} ÷ ${s} ＝ ${c}`],v:()=>c*s===m*100}}
 const t=ri(r,0,2);
 if(t===0){const k=ri(r,2,4),a=ri(r,2,9),b=a*k;
  return{q:`三角形 ABC の辺 AB（${a}cm）を ${k}倍に拡大（かくだい）した図で、対応する辺の長さは何cm？`,a:[String(b)],unit:'cm',disp:b+'cm',exp:['拡大図では、対応する辺の長さは どれも同じ倍率になる',`${a} × ${k} ＝ ${b}`],v:()=>b/a===k}}
 if(t===1){const a=ri(r,2,6),k=ri(r,2,4),b=a*k,c=ri(r,2,8),d=c*k;
  return{q:`2つの図形は拡大図と縮図の関係。辺 ${a}cm が ${b}cm に対応している。${c}cm の辺に対応する辺は何cm？`,a:[String(d)],unit:'cm',disp:d+'cm',exp:[`倍率は ${b} ÷ ${a} ＝ ${k}倍`,`${c} × ${k} ＝ ${d}`],v:()=>b*c===a*d}}
 const s=pick([25000,50000],r),c=pick(s===25000?[4,8,12,16,2,6]:[2,4,6,8,10],r),km=c*s/100000;
 return{q:`縮尺 1/${s} の地図で、2地点が ${c}cm はなれている。実際のきょりは何km？`,a:[nf(km)],unit:'km',disp:nf(km)+'km',exp:[`${c} × ${s} ＝ ${c*s}cm`,`${c*s}cm ＝ ${nf(km)}km（100000cm ＝ 1km）`],v:()=>Math.abs(km*100000-c*s)<1e-9};
}};

GEN.stat6={name:'代表値（平均・中央値・最頻値）',f(r,lv){
 const mk=n=>{const xs=[];for(let i=0;i<n;i++)xs.push(ri(r,2,10));return xs};
 const med=a=>{const s=[...a].sort((x,y)=>x-y),n=s.length;return n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2};
 const modeOf=a=>{const c={};a.forEach(x=>c[x]=(c[x]||0)+1);const m=Math.max(...Object.values(c)),k=Object.keys(c).filter(x=>c[x]===m);return k.length===1?+k[0]:null};
 const show=a=>a.join('、');
 if(lv===1){
  if(r()<.5){const n=ri(r,3,5);let xs,t=0;do xs=mk(n);while(sum(xs)%n&&t++<500);if(sum(xs)%n)xs[0]+=n-sum(xs)%n;
   const m=sum(xs)/n;return{q:`${show(xs)} の平均は？`,a:[String(m)],disp:String(m),exp:['平均 ＝ 合計 ÷ 個数',`${xs.join(' ＋ ')} ＝ ${sum(xs)}　→　${sum(xs)} ÷ ${n} ＝ ${m}`],v:()=>m*n===sum(xs)}}
  const n=pick([5,7],r),xs=mk(n),m=med(xs),s=[...xs].sort((a,b)=>a-b);
  return{q:`${show(xs)} の中央値（ちゅうおうち）は？`,a:[String(m)],disp:String(m),exp:['小さい順にならべて、まん中の数が中央値',`${s.join('、')}　→　まん中は ${m}`],v:()=>s[(n-1)/2]===m}}
 if(lv===2){
  if(r()<.5){let xs,m,t=0;do{xs=mk(ri(r,6,9));m=modeOf(xs)}while(m===null&&t++<500);
   if(m===null){xs=[3,5,5,7,8,5];m=5}
   return{q:`${show(xs)} の最頻値（さいひんち）は？`,a:[String(m)],disp:String(m),exp:['いちばん多く出てくる値が最頻値',`${m} が ${xs.filter(x=>x===m).length}回で、いちばん多い`],v:()=>xs.filter(x=>x===m).length===Math.max(...xs.map(y=>xs.filter(x=>x===y).length))}}
  const n=ri(r,5,7),xs=mk(n),mx=Math.max(...xs),mn=Math.min(...xs);
  if(mx===mn)return GEN.stat6.f(r,lv);
  return{q:`${show(xs)} の、最大値と最小値の差（はんい）は？`,a:[String(mx-mn)],disp:String(mx-mn),exp:[`最大値は ${mx}、最小値は ${mn}`,`${mx} − ${mn} ＝ ${mx-mn}`],v:()=>mx-mn===Math.max(...xs)-Math.min(...xs)}}
 if(r()<.5){const n=pick([4,6],r),xs=mk(n),m=med(xs),s=[...xs].sort((a,b)=>a-b);
  return{q:`${show(xs)} の中央値は？`,a:[nf(m)],disp:nf(m),exp:['小さい順にならべる。データの数が偶数のときは、まん中の2つの平均',`${s.join('、')}　→　（${s[n/2-1]} ＋ ${s[n/2]}）÷ 2 ＝ ${nf(m)}`],v:()=>Math.abs(m*2-(s[n/2-1]+s[n/2]))<1e-9}}
 const n=ri(r,4,6),xs=mk(n-1),mean=ri(r,4,8),x=mean*n-sum(xs);
 if(x<1||x>15)return GEN.stat6.f(r,lv);
 return{q:`${n}このデータがあり、そのうち ${n-1}こは ${show(xs)}。${n}こ全部の平均が ${mean} のとき、のこりの 1こは？`,a:[String(x)],disp:String(x),exp:[`合計 ＝ 平均 × 個数 ＝ ${mean} × ${n} ＝ ${mean*n}`,`のこり ＝ ${mean*n} − ${sum(xs)} ＝ ${x}`],v:()=>(sum(xs)+x)/n===mean};
}};
