/* ===== 算数の自動生成ドリル（5年）：無限に出る =====
   各ジェネレータ f(r, lv) は { q, a:[許す答え], disp, exp:[解説], ch?:[正解,誤1,誤2,誤3], unit?, v:()=>検算 } を返す。
   lv は 1〜3。r は乱数（再現できる）。円周率は 3.14 を使う。*/
const GEN={};
const ri=(r,a,b)=>a+Math.floor(r()*(b-a+1));
const rnz=(r,a,b)=>{let v=0,t=0;while(!v&&t++<60)v=ri(r,a,b);return v||1};
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){const t=a%b;a=b;b=t}return a};
const lcm=(a,b)=>Math.abs(a*b)/gcd(a,b);
const nf=x=>String(+(+x).toFixed(6));
const nz10=(r,a,b)=>{let v,t=0;do v=ri(r,a,b);while(v%10===0&&t++<60);return v};   // 10の倍数でない（小数で 5.0 のようにならない）
const dq=(n,k)=>nf(n/10**k);                                                       // 整数 n を 10^k 分の1にした小数の表示
const uniq4=(c,ws,fill)=>{const o=[c];for(const w of ws){if(w!==c&&!o.includes(w))o.push(w);if(o.length>=4)return o}let k=1;while(o.length<4&&k<80){const w=fill(k++);if(w!==c&&!o.includes(w))o.push(w)}return o};
const decOK=(n,d)=>{const g=gcd(n,d);d/=g;while(d%2===0)d/=2;while(d%5===0)d/=5;return d===1};
/* 分数は [分子,分母]（約分ずみ）で扱う */
const rd=(n,d)=>{const g=gcd(n,d)||1;n/=g;d/=g;if(d<0){n=-n;d=-d}return[n,d]};
const rs=x=>x[1]===1?String(x[0]):x[0]+'/'+x[1];
const mixS=x=>x[1]>1&&x[0]>x[1]?Math.floor(x[0]/x[1])+'と'+(x[0]%x[1])+'/'+x[1]:rs(x);
const rv=x=>x[0]/x[1];
const radd=(a,b)=>rd(a[0]*b[1]+b[0]*a[1],a[1]*b[1]);
const rsub=(a,b)=>rd(a[0]*b[1]-b[0]*a[1],a[1]*b[1]);
const rmul=(a,b)=>rd(a[0]*b[0],a[1]*b[1]);
const rdiv=(a,b)=>rd(a[0]*b[1],a[1]*b[0]);
const fa=x=>{const a=[rs(x)];if(x[1]>1&&x[0]>x[1])a.push(mixS(x));if(x[1]>1&&decOK(x[0],x[1]))a.push(nf(x[0]/x[1]));return a};
const fd=x=>x[1]>1&&x[0]>x[1]?rs(x)+'（'+mixS(x)+'）':rs(x);
const pfr=(r,d)=>{let n,t=0;do n=ri(r,1,d-1);while(gcd(n,d)>1&&t++<30);return[n,d]};   // 約分できない真分数
const divs=n=>{const o=[];for(let i=1;i<=n;i++)if(n%i===0)o.push(i);return o};

GEN.dec_mul={name:'小数のかけ算',f(r,lv){
 let A,ka,B,kb,q,unit='',w=null;
 if(lv===1){A=nz10(r,12,99);ka=1;B=ri(r,2,9);kb=0}
 else if(lv===2){A=nz10(r,12,99);ka=1;B=nz10(r,12,99);kb=1}
 else if(r()<.5){A=nz10(r,101,499);ka=2;B=nz10(r,12,99);kb=1}
 else{A=nz10(r,12,99);ka=1;B=nz10(r,12,99);kb=1;
  const T=[[(a,b)=>`1mの重さが ${a}kg の鉄のぼうがある。${b}m の重さは？`,'kg'],[(a,b)=>`1Lで ${a}m² ぬれるペンキがある。${b}L では何m² ぬれる？`,'m²'],[(a,b)=>`1分間に ${a}L ずつ水が出る。${b}分間では何L？`,'L']];
  w=pick(T,r);unit=w[1]}
 const P=A*B,s=ka+kb,ans=dq(P,s),sa=dq(A,ka),sb=dq(B,kb);
 q=w?w[0](sa,sb):`${sa} × ${sb} ＝ ？`;
 return{q,a:[ans],disp:ans+unit,unit,exp:[`小数点がないものとして整数で計算：${A} × ${B} ＝ ${P}`,kb?`小数点の右は ${ka}けた＋${kb}けた＝${s}けた。${P} の右から ${s}けたのところに小数点を打つ`:`小数点の右は ${ka}けた。${P} の右から ${ka}けたのところに小数点を打つ`,`答えは ${ans}`],v:()=>Math.abs(+ans-(A/10**ka)*(B/10**kb))<1e-9};
}};

GEN.dec_div={name:'小数のわり算',f(r,lv){
 let q,ans,exp,chk;
 if(lv===1){const d=ri(r,2,9),Q=nz10(r,12,99),N=Q*d;ans=dq(Q,1);
  q=`${dq(N,1)} ÷ ${d} ＝ ？`;exp=[`わられる数を10倍して、整数どうしで計算：${N} ÷ ${d} ＝ ${Q}`,`10倍した分をもどして、${Q} を 10 でわる → ${ans}`];chk=()=>Math.abs(N/10/d-Q/10)<1e-9}
 else if(lv===2){
  if(r()<.5){const D=nz10(r,12,99),Qi=ri(r,2,40),N=D*Qi;ans=String(Qi);
   q=`${dq(N,1)} ÷ ${dq(D,1)} ＝ ？`;exp=[`わる数を整数にするため、わられる数もわる数も10倍する：${N} ÷ ${D}`,`${N} ÷ ${D} ＝ ${Qi}`];chk=()=>Math.abs(N/D-Qi)<1e-9}
  else{const D=nz10(r,12,99),Q=nz10(r,12,60),N=D*Q;ans=dq(Q,1);
   q=`${dq(N,2)} ÷ ${dq(D,1)} ＝ ？`;exp=[`わる数を整数にするため、わられる数もわる数も10倍する：${dq(N,1)} ÷ ${D}`,`${dq(N,1)} ÷ ${D} ＝ ${ans}`];chk=()=>Math.abs(N/100/(D/10)-Q/10)<1e-9}}
 else if(r()<.5){let D,Qi,t=0;do{D=pick([2,4,5,8,15,25],r);Qi=ri(r,2,30)}while(Qi*D%10!==0&&t++<200);
  if(Qi*D%10!==0){D=5;Qi=ri(r,2,15)*2}
  const N=Qi*D/10;ans=String(Qi);q=`${N} ÷ ${dq(D,1)} ＝ ？`;
  exp=[`わる数を整数にするため、わられる数もわる数も10倍する：${N*10} ÷ ${D}`,`${N*10} ÷ ${D} ＝ ${Qi}`];chk=()=>Math.abs(N/(D/10)-Qi)<1e-9}
 else{const b=pick([4,5,8,20,25],r);let a,t=0;do a=ri(r,b+1,5*b);while(a%b===0&&t++<50);
  ans=nf(a/b);q=`${a} ÷ ${b} ＝ ？（わりきれるまで計算する）`;
  exp=[`わりきれるまで、0 をつけてわり進める`,`${a} ÷ ${b} ＝ ${ans}`];chk=()=>Math.abs(a/b-+ans)<1e-9}
 return{q,a:[ans],disp:ans,exp,v:chk};
}};

GEN.vol={name:'直方体・立方体の体積',f(r,lv){
 if(lv===1){const a=ri(r,2,9),b=ri(r,2,9),c=ri(r,2,9),V=a*b*c;
  return{q:`たて ${a}cm、よこ ${b}cm、高さ ${c}cm の直方体の体積は？`,a:[String(V)],unit:'cm³',disp:V+'cm³',exp:['直方体の体積 ＝ たて × よこ × 高さ',`${a} × ${b} × ${c} ＝ ${V}`],v:()=>V===a*b*c}}
 if(lv===2){
  if(r()<.5){const a=ri(r,3,12),V=a**3;
   return{q:`1辺が ${a}cm の立方体の体積は？`,a:[String(V)],unit:'cm³',disp:V+'cm³',exp:['立方体の体積 ＝ 1辺 × 1辺 × 1辺',`${a} × ${a} × ${a} ＝ ${V}`],v:()=>V===a*a*a}}
  const a=ri(r,2,9),b=ri(r,2,9),c=ri(r,3,12),V=a*b*c;
  return{q:`体積が ${V}cm³、たてが ${a}cm、よこが ${b}cm の直方体がある。高さは？`,a:[String(c)],unit:'cm',disp:c+'cm',exp:['体積 ＝ たて × よこ × 高さ だから、高さ ＝ 体積 ÷（たて × よこ）',`${V} ÷（${a} × ${b}）＝ ${V} ÷ ${a*b} ＝ ${c}`],v:()=>a*b*c===V}}
 const t=ri(r,0,2);
 if(t===0){let a,b,c,k=0;do{a=pick([10,20,25,30,40,50],r);b=pick([10,20,25,30,40,50],r);c=pick([10,20,25,30,40,50],r)}while(a*b*c%1000!==0&&k++<200);
  if(a*b*c%1000!==0){a=20;b=50;c=30}
  const L=a*b*c/1000;
  return{q:`内のりが たて ${a}cm、よこ ${b}cm、高さ ${c}cm の水そうがある。入る水は何L？（1L ＝ 1000cm³）`,a:[String(L)],unit:'L',disp:L+'L',exp:[`体積 ＝ ${a} × ${b} × ${c} ＝ ${a*b*c}cm³`,`1L ＝ 1000cm³ だから ${a*b*c} ÷ 1000 ＝ ${L}`],v:()=>L*1000===a*b*c}}
 if(t===1){const a=ri(r,2,6),b=ri(r,2,6),c10=nz10(r,11,29),V=a*b*c10/10;
  return{q:`たて ${a}m、よこ ${b}m、高さ ${dq(c10,1)}m の直方体の体積は？`,a:[nf(V)],unit:'m³',disp:nf(V)+'m³',exp:['体積 ＝ たて × よこ × 高さ',`${a} × ${b} × ${dq(c10,1)} ＝ ${nf(V)}`],v:()=>Math.abs(V-a*b*c10/10)<1e-9}}
 const a=ri(r,6,10),b=ri(r,6,10),c=ri(r,3,8),d=ri(r,2,a-2),e=ri(r,2,b-2),V=a*b*c-d*e*c;
 return{q:`たて ${a}cm、よこ ${b}cm、高さ ${c}cm の直方体から、たて ${d}cm、よこ ${e}cm、高さ ${c}cm の直方体を切り取った。残りの体積は？`,a:[String(V)],unit:'cm³',disp:V+'cm³',exp:[`もとの体積：${a} × ${b} × ${c} ＝ ${a*b*c}`,`切り取った体積：${d} × ${e} × ${c} ＝ ${d*e*c}`,`${a*b*c} − ${d*e*c} ＝ ${V}`],v:()=>V===c*(a*b-d*e)};
}};

GEN.angle={name:'三角形・四角形・多角形の角',f(r,lv){
 const U='度';
 if(lv===1){let a,b;do{a=ri(r,25,85);b=ri(r,25,85)}while(a+b>150);const c=180-a-b;
  return{q:`三角形の 2つの角が ${a}度と ${b}度。のこりの角は何度？`,a:[String(c)],unit:U,disp:c+U,exp:['三角形の 3つの角の和は 180度',`180 − ${a} − ${b} ＝ ${c}`],v:()=>a+b+c===180}}
 if(lv===2){
  if(r()<.5){let a,b,c;do{a=ri(r,60,120);b=ri(r,60,120);c=ri(r,60,120)}while(a+b+c>330);const d=360-a-b-c;
   return{q:`四角形の 3つの角が ${a}度、${b}度、${c}度。のこりの角は何度？`,a:[String(d)],unit:U,disp:d+U,exp:['四角形の 4つの角の和は 360度',`360 − ${a} − ${b} − ${c} ＝ ${d}`],v:()=>a+b+c+d===360}}
  const top=ri(r,10,50)*2,base=(180-top)/2;
  return{q:`二等辺三角形で、頂角（とうかく）が ${top}度。ひとつの底角（ていかく）は何度？`,a:[String(base)],unit:U,disp:base+U,exp:['三角形の 3つの角の和は 180度。2つの底角は等しい',`（180 − ${top}）÷ 2 ＝ ${base}`],v:()=>top+2*base===180}}
 const t=ri(r,0,2);
 if(t===0){const n=ri(r,5,10),S=(n-2)*180,nm=['','','','','','五','六','七','八','九','十'][n];
  return{q:`${nm}角形の 内角の和は何度？`,a:[String(S)],unit:U,disp:S+U,exp:[`${nm}角形は、1つの頂点から対角線をひくと ${n-2}この三角形に分けられる`,`180 × ${n-2} ＝ ${S}`],v:()=>S===180*(n-2)}}
 if(t===1){const n=pick([5,6,8,9,10,12],r),nm={5:'五',6:'六',8:'八',9:'九',10:'十',12:'十二'}[n],e=(n-2)*180/n;
  return{q:`正${nm}角形の 1つの角は何度？`,a:[String(e)],unit:U,disp:e+U,exp:[`内角の和は 180 × ${n-2} ＝ ${(n-2)*180}度`,`正多角形は角がみな等しいので ${(n-2)*180} ÷ ${n} ＝ ${e}`],v:()=>e*n===(n-2)*180}}
 let s=[],x;do{s=[ri(r,85,140),ri(r,85,140),ri(r,85,140),ri(r,85,140)];x=540-s[0]-s[1]-s[2]-s[3]}while(x<60||x>170);
 return{q:`五角形の 4つの角が ${s.join('度、')}度。のこりの角は何度？`,a:[String(x)],unit:U,disp:x+U,exp:['五角形の内角の和は 180 × 3 ＝ 540度',`540 − ${s.join(' − ')} ＝ ${x}`],v:()=>sum(s)+x===540};
}};

GEN.multiple={name:'倍数・約数（公倍数・公約数）',f(r,lv){
 const lst=(n,m)=>{const o=[];for(let i=n;i<=m;i+=n)o.push(i);return o.join('、')};
 const lcmQ=()=>{let a,b;do{a=ri(r,2,9);b=ri(r,2,9)}while(a===b||gcd(a,b)===a||gcd(a,b)===b);const L=lcm(a,b);
  return{q:`${a} と ${b} の最小公倍数（さいしょうこうばいすう）は？`,a:[String(L)],disp:String(L),exp:[`${a} の倍数：${lst(a,L)}`,`${b} の倍数：${lst(b,L)}`,`はじめて同じになる ${L} が最小公倍数`],v:()=>L%a===0&&L%b===0&&L===lcm(a,b)}};
 const gcdQ=()=>{let m,n;do{m=ri(r,1,9);n=ri(r,1,9)}while(m===n||gcd(m,n)>1||m*n===1);const g=ri(r,2,9),a=g*m,b=g*n;
  return{q:`${a} と ${b} の最大公約数（さいだいこうやくすう）は？`,a:[String(g)],disp:String(g),exp:[`${a} の約数：${divs(a).join('、')}`,`${b} の約数：${divs(b).join('、')}`,`共通する数の中でいちばん大きい ${g} が最大公約数`],v:()=>a%g===0&&b%g===0&&gcd(a,b)===g}};
 if(lv===1){
  if(r()<.5)return lcmQ();
  const n=pick([12,16,18,20,24,28,30,32,36,40,45,48],r),d=divs(n);
  return{q:`${n} の約数は、全部で何こある？`,a:[String(d.length)],unit:'こ',disp:d.length+'こ',exp:[`小さい順に書き出す：${d.join('、')}`,`全部で ${d.length}こ`],v:()=>d.length===divs(n).length&&d.every(x=>n%x===0)}}
 if(lv===2){
  if(r()<.4)return gcdQ();
  let a,b;do{a=ri(r,4,15);b=ri(r,4,15)}while(a===b||lcm(a,b)>90||gcd(a,b)===a||gcd(a,b)===b);const L=lcm(a,b);
  return{q:`A のバスは ${a}分おき、B のバスは ${b}分おきに出る。同時に出発したあと、次に同時に出るのは何分後？`,a:[String(L)],unit:'分後',disp:L+'分後',exp:[`${a} と ${b} の最小公倍数を求める`,`${a} の倍数：${lst(a,L)}`,`${b} の倍数：${lst(b,L)}　→　${L}分後`],v:()=>L%a===0&&L%b===0&&L===lcm(a,b)}}
 const t=ri(r,0,2);
 if(t===0){let a,b;do{a=ri(r,2,9);b=ri(r,2,9)}while(a===b||lcm(a,b)>40);const L=lcm(a,b),n=Math.floor(100/L);
  return{q:`1から 100 までの整数のうち、${a} でも ${b} でもわりきれる数は何こ？`,a:[String(n)],unit:'こ',disp:n+'こ',exp:[`${a} と ${b} の最小公倍数は ${L}。公倍数は ${L} の倍数`,`100 ÷ ${L} ＝ ${n}あまり ${100-n*L} だから ${n}こ`],v:()=>{let c=0;for(let i=1;i<=100;i++)if(i%a===0&&i%b===0)c++;return c===n}}}
 if(t===1){let a,b,c;do{a=ri(r,2,9);b=ri(r,2,9);c=ri(r,2,9)}while(new Set([a,b,c]).size<3||lcm(lcm(a,b),c)>120);const L=lcm(lcm(a,b),c);
  return{q:`${a}、${b}、${c} の最小公倍数は？`,a:[String(L)],disp:String(L),exp:[`まず ${a} と ${b} の最小公倍数 ${lcm(a,b)} を求める`,`${lcm(a,b)} と ${c} の最小公倍数が答え ＝ ${L}`],v:()=>L%a===0&&L%b===0&&L%c===0}}
 let m,n;do{m=ri(r,2,9);n=ri(r,2,9)}while(m===n||gcd(m,n)>1);const g=ri(r,2,6),a=g*m,b=g*n,k=m*n;
 return{q:`たて ${a}cm、よこ ${b}cm の長方形の紙を、あまりなく同じ大きさの正方形に切り分ける。いちばん大きい正方形で切ると、何まいできる？`,a:[String(k)],unit:'まい',disp:k+'まい',exp:[`1辺は ${a} と ${b} の最大公約数 ${g}cm`,`たて ${a} ÷ ${g} ＝ ${m}まい、よこ ${b} ÷ ${g} ＝ ${n}まい`,`${m} × ${n} ＝ ${k}`],v:()=>gcd(a,b)===g&&(a/g)*(b/g)===k};
}};

/* 分数のたし算・ひき算：terms=[{n,d,s,m}]（n/d は仮分数にしたもの。m は帯分数で書く）*/
const asQ=T=>T.map((t,i)=>(i?(t.s>0?' ＋ ':' − '):'')+(t.m?mixS([t.n,t.d]):t.n+'/'+t.d)).join('');
const asVal=T=>T.reduce((x,t)=>t.s>0?radd(x,[t.n,t.d]):rsub(x,[t.n,t.d]),[0,1]);
function asExp(T,res){
 const ex=[],ds=[...new Set(T.map(t=>t.d))],L=ds.reduce(lcm,1);
 if(T.some(t=>t.m))ex.push('帯分数を仮分数に直す：'+T.map((t,i)=>(i?(t.s>0?' ＋ ':' − '):'')+t.n+'/'+t.d).join(''));
 let N=0;T.forEach(t=>{N+=t.s*t.n*(L/t.d)});
 if(ds.length>1)ex.push(`分母 ${ds.join('・')} の最小公倍数 ${L} にそろえる：`+T.map((t,i)=>(i?(t.s>0?' ＋ ':' − '):'')+(t.n*L/t.d)+'/'+L).join(''));
 ex.push(`分子を計算して ${N}/${L}`+(gcd(N,L)>1?`、約分して ${rs(res)}`:''));
 if(res[1]>1&&res[0]>res[1])ex.push(`帯分数にすると ${mixS(res)}`);
 return ex;
}
GEN.frac_add={name:'分数のたし算・ひき算',f(r,lv){
 let T;
 if(lv===1){
  const P=[[2,4],[3,6],[2,6],[4,8],[5,10],[2,8],[4,12],[3,9],[6,12],[5,5],[7,7],[6,6],[9,9],[8,8]],p=pick(P,r),x=pfr(r,p[0]),y=p[1]===p[0]?pfr(r,p[1]):pfr(r,p[1]);
  let a=x,b=y,s=r()<.5?1:-1;if(p[0]===p[1]&&x[0]===y[0]&&s<0)s=1;
  if(s<0&&rv(a)<rv(b)){const t=a;a=b;b=t}
  if(s<0&&rv(a)===rv(b))s=1;
  T=[{n:a[0],d:a[1],s:1},{n:b[0],d:b[1],s}]}
 else if(lv===2){let d1,d2;do{d1=ri(r,2,9);d2=ri(r,2,9)}while(d1===d2||(d1%d2===0)||(d2%d1===0));
  let a=pfr(r,d1),b=pfr(r,d2),s=r()<.5?1:-1;if(s<0&&rv(a)<rv(b)){const t=a;a=b;b=t}
  T=[{n:a[0],d:a[1],s:1},{n:b[0],d:b[1],s}]}
 else if(r()<.5){const D=[2,3,4,5,6,10,12];let d1=pick(D,r),d2=pick(D,r),d3=pick(D,r),k=0;
  while(new Set([d1,d2,d3]).size<2&&k++<20)d2=pick(D,r);
  const a=pfr(r,d1),b=pfr(r,d2),c=pfr(r,d3);
  T=[{n:a[0],d:a[1],s:1},{n:b[0],d:b[1],s:1},{n:c[0],d:c[1],s:-1}];
  if(rv(asVal(T))<=0)T[2].s=1}
 else{const D=[2,3,4,5,6,8],d1=pick(D,r),d2=pick(D,r),w1=ri(r,1,3),w2=ri(r,1,3),a=pfr(r,d1),b=pfr(r,d2);
  let s=r()<.5?1:-1;const A=[w1*d1+a[0],d1],B=[w2*d2+b[0],d2];
  if(s<0&&rv(A)<=rv(B))s=1;
  T=[{n:A[0],d:A[1],s:1,m:1},{n:B[0],d:B[1],s,m:1}]}
 const res=asVal(T);
 return{q:asQ(T)+' ＝ ？（約分する）',a:fa(res),disp:fd(res),exp:asExp(T,res),v:()=>{const x=T.reduce((z,t)=>z+t.s*t.n/t.d,0);return Math.abs(x-rv(res))<1e-9&&gcd(res[0],res[1])===1}};
}};

GEN.frac_dec={name:'分数と小数・整数',f(r,lv){
 if(lv===1){const d=pick([2,4,5,8,10,20,25],r),n=ri(r,1,d-1),ans=nf(n/d);
  return{q:`${n}/${d} を小数で表すと？`,a:[ans],disp:ans,exp:['分数は「分子 ÷ 分母」',`${n} ÷ ${d} ＝ ${ans}`],v:()=>Math.abs(n/d-+ans)<1e-9}}
 if(lv===2){let n;do n=ri(r,1,99);while(n%10===0&&r()<.7);const x=rd(n,100);
  return{q:`${dq(n,2)} を分数で表すと？（約分する）`,a:[rs(x)],disp:rs(x),exp:[`${dq(n,2)} ＝ ${n}/100`,`約分して ${rs(x)}`],v:()=>Math.abs(rv(x)-n/100)<1e-9&&gcd(x[0],x[1])===1}}
 const t=ri(r,0,2);
 if(t===0){let a,b;do{a=ri(r,2,11);b=ri(r,2,11)}while(a%b===0||a===b);const x=rd(a,b);
  return{q:`${a} ÷ ${b} の商を、分数で表すと？（約分する）`,a:fa(x),disp:fd(x),exp:['整数どうしのわり算の商は、分数で表せる：わられる数が分子、わる数が分母',`${a} ÷ ${b} ＝ ${a}/${b}`+(gcd(a,b)>1?` ＝ ${rs(x)}`:'')],v:()=>Math.abs(rv(x)-a/b)<1e-9}}
 if(t===1){const d=ri(r,2,9),w=ri(r,1,4),n=pfr(r,d)[0],imp=w*d+n,ans=w+'と'+n+'/'+d;
  return{q:`仮分数 ${imp}/${d} を、帯分数で表すと？`,a:[ans],disp:ans,exp:[`${imp} ÷ ${d} ＝ ${w}あまり ${n}`,`整数部分が ${w}、分子が ${n} だから ${ans}`],v:()=>w*d+n===imp}}
 const n=pick([125,15,25,35,45,75,225,12,24,16,32],r),w=pick([1,2],r),tot=w*100+(n<100?n:n%100),x=rd(tot,100);
 return{q:`${dq(tot,2)} を分数で表すと？（約分する）`,a:fa(x),disp:fd(x),exp:[`${dq(tot,2)} ＝ ${tot}/100`,`約分して ${rs(x)}`+(x[0]>x[1]?`（${mixS(x)}）`:'')],v:()=>Math.abs(rv(x)-tot/100)<1e-9};
}};

GEN.avg={name:'平均',f(r,lv){
 if(lv===1){const n=ri(r,3,4);let xs,t=0;do{xs=[];for(let i=0;i<n;i++)xs.push(ri(r,50,100))}while(sum(xs)%n!==0&&t++<500);
  if(sum(xs)%n!==0)xs[n-1]+=n-sum(xs)%n;const m=sum(xs)/n;
  return{q:`テストの点が ${xs.join('点、')}点。平均は何点？`,a:[String(m)],unit:'点',disp:m+'点',exp:['平均 ＝ 合計 ÷ 個数',`合計：${xs.join(' ＋ ')} ＝ ${sum(xs)}`,`${sum(xs)} ÷ ${n} ＝ ${m}`],v:()=>sum(xs)===m*n}}
 if(lv===2){const n=ri(r,4,8),m=ri(r,40,95);
  if(r()<.5)return{q:`${n}人の平均点が ${m}点だった。${n}人の合計点は何点？`,a:[String(m*n)],unit:'点',disp:m*n+'点',exp:['合計 ＝ 平均 × 個数',`${m} × ${n} ＝ ${m*n}`],v:()=>m*n/n===m};
  const S=m*n;return{q:`合計が ${S}点で、平均が ${m}点だった。人数は何人？`,a:[String(n)],unit:'人',disp:n+'人',exp:['個数 ＝ 合計 ÷ 平均',`${S} ÷ ${m} ＝ ${n}`],v:()=>S/m===n}}
 if(r()<.5){let m,x,m2,t=0;do{m=ri(r,60,90);x=ri(r,50,100);m2=(4*m+x)/5}while(!Number.isInteger(m2)&&t++<500);
  if(!Number.isInteger(m2)){m=80;x=100;m2=84}
  return{q:`4回のテストの平均が ${m}点。5回目をうけて、5回の平均が ${m2}点になった。5回目は何点？`,a:[String(x)],unit:'点',disp:x+'点',exp:[`5回の合計 ＝ ${m2} × 5 ＝ ${m2*5}`,`4回の合計 ＝ ${m} × 4 ＝ ${m*4}`,`5回目 ＝ ${m2*5} − ${m*4} ＝ ${x}`],v:()=>m*4+x===m2*5}}
 let n1,n2,a,b,t=0,M;do{n1=ri(r,2,6);n2=ri(r,2,6);a=ri(r,30,50);b=ri(r,30,50);M=(n1*a+n2*b)/(n1+n2)}while((!Number.isInteger(M)||a===b)&&t++<800);
 if(!Number.isInteger(M)){n1=2;n2=3;a=40;b=30;M=34}
 return{q:`男子 ${n1}人の平均が ${a}kg、女子 ${n2}人の平均が ${b}kg。${n1+n2}人全体の平均は何kg？`,a:[String(M)],unit:'kg',disp:M+'kg',exp:[`男子の合計：${a} × ${n1} ＝ ${a*n1}`,`女子の合計：${b} × ${n2} ＝ ${b*n2}`,`全体の平均 ＝（${a*n1} ＋ ${b*n2}）÷ ${n1+n2} ＝ ${M}`],v:()=>M*(n1+n2)===n1*a+n2*b};
}};

GEN.per_unit={name:'単位量あたりの大きさ',f(r,lv){
 if(lv===1){const A=ri(r,2,20),d=ri(r,5,100)*10,P=A*d;
  return{q:`人口 ${P}人、面積 ${A}km² の町がある。人口密度（じんこうみつど）は、1km²あたり何人？`,a:[String(d)],unit:'人',disp:d+'人',exp:['人口密度 ＝ 人口 ÷ 面積',`${P} ÷ ${A} ＝ ${d}`],v:()=>d*A===P}}
 if(lv===2){const A=pick([2,4,5,8,10,20,25],r),B=ri(r,3,60),q=B/A,ans=nf(q),t=ri(r,0,2);
  const T=[[`${A}m² の畑から、いもが ${B}kg とれた。1m² あたり何kg とれた？`,'kg'],[`ガソリン ${A}L で ${B}km 走る車は、1L あたり何km 走る？`,'km'],[`${A}分間で ${B}L の水が出る。1分間あたり何L？`,'L']][t];
  return{q:T[0],a:[ans],unit:T[1],disp:ans+T[1],exp:['1あたりの大きさ ＝ 全体 ÷ いくつ分',`${B} ÷ ${A} ＝ ${ans}`],v:()=>Math.abs(q*A-B)<1e-9}}
 const t=ri(r,0,2);
 if(t===0){const A=ri(r,3,15),d=ri(r,5,60)*10,P=A*d;
  return{q:`人口密度が 1km² あたり ${d}人の町がある。面積が ${A}km² のとき、人口は何人？`,a:[String(P)],unit:'人',disp:P+'人',exp:['人口 ＝ 人口密度 × 面積',`${d} × ${A} ＝ ${P}`],v:()=>P/A===d}}
 if(t===1){const L=ri(r,2,5),k=ri(r,8,20),X=ri(r,6,15),KM=k*X;
  return{q:`1Lで ${k}km 走る車で ${KM}km 走るには、ガソリンは何L必要？`,a:[String(X)],unit:'L',disp:X+'L',exp:['1Lで走れる道のり ×（使うL数）＝ 走る道のり',`${KM} ÷ ${k} ＝ ${X}`],v:()=>k*X===KM};}
 const n=ri(r,3,6),k=ri(r,5,15),m=ri(r,7,12),T=n*k,ans=k*m;
 return{q:`${n}L で ${T}m² ぬれるペンキがある。${m}L では何m² ぬれる？`,a:[String(ans)],unit:'m²',disp:ans+'m²',exp:[`1Lあたり：${T} ÷ ${n} ＝ ${k}m²`,`${m}L では：${k} × ${m} ＝ ${ans}`],v:()=>ans/m===T/n};
}};

GEN.speed={name:'速さ・道のり・時間',f(r,lv){
 if(lv===1){
  if(r()<.5){const v=ri(r,3,12)*10,t=ri(r,2,6),d=v*t;
   return{q:`${d}km を ${t}時間で走る電車の速さは、時速何km？`,a:[String(v)],unit:'km/時',disp:'時速 '+v+'km',exp:['速さ ＝ 道のり ÷ 時間',`${d} ÷ ${t} ＝ ${v}`],v:()=>v*t===d}}
  const v=ri(r,4,12)*10,t=ri(r,3,12),d=v*t;
  return{q:`${d}m を ${t}分で歩く人の速さは、分速何m？`,a:[String(v)],unit:'m/分',disp:'分速 '+v+'m',exp:['速さ ＝ 道のり ÷ 時間',`${d} ÷ ${t} ＝ ${v}`],v:()=>v*t===d}}
 if(lv===2){const t=ri(r,0,2);
  if(t===0){const v=ri(r,4,10)*10,h=ri(r,2,6),d=v*h;
   return{q:`時速 ${v}km の車が ${h}時間走ると、道のりは何km？`,a:[String(d)],unit:'km',disp:d+'km',exp:['道のり ＝ 速さ × 時間',`${v} × ${h} ＝ ${d}`],v:()=>d/h===v}}
  if(t===1){const v=ri(r,5,12)*10,m=ri(r,4,15),d=v*m;
   return{q:`分速 ${v}m で ${d}m 歩くには、何分かかる？`,a:[String(m)],unit:'分',disp:m+'分',exp:['時間 ＝ 道のり ÷ 速さ',`${d} ÷ ${v} ＝ ${m}`],v:()=>v*m===d}}
  const v=ri(r,3,9)*10,h=ri(r,2,8),d=v*h;
  return{q:`${d}km はなれた町まで、時速 ${v}km で進むと何時間かかる？`,a:[String(h)],unit:'時間',disp:h+'時間',exp:['時間 ＝ 道のり ÷ 速さ',`${d} ÷ ${v} ＝ ${h}`],v:()=>v*h===d}}
 const t=ri(r,0,3);
 if(t===0){const v=pick([5,10,15,20,25],r),k=v*3.6;
  return{q:`秒速 ${v}m で走る電車の速さは、時速何km？（1時間 ＝ 3600秒）`,a:[nf(k)],unit:'km/時',disp:'時速 '+nf(k)+'km',exp:[`1時間 ＝ 3600秒だから、1時間に進む道のりは ${v} × 3600 ＝ ${v*3600}m`,`${v*3600}m ＝ ${nf(k)}km`],v:()=>Math.abs(v*3600/1000-k)<1e-9}}
 if(t===1){const k=ri(r,1,8)*3,m=k*1000/60;
  return{q:`時速 ${k}km は、分速何m？（1時間 ＝ 60分）`,a:[String(m)],unit:'m/分',disp:'分速 '+m+'m',exp:[`時速 ${k}km ＝ 1時間に ${k*1000}m 進む`,`${k*1000} ÷ 60 ＝ ${m}`],v:()=>m*60===k*1000}}
 if(t===2){let v,m,x=0,k=0;do{v=ri(r,3,9)*10;m=pick([10,15,20,30,40,45],r);k=v*m/60}while(!Number.isInteger(k)&&x++<300);
  if(!Number.isInteger(k)){v=60;m=20;k=20}
  return{q:`時速 ${v}km で ${m}分間走ると、道のりは何km？`,a:[String(k)],unit:'km',disp:k+'km',exp:[`${m}分 ＝ ${m}/60 時間`,`${v} × ${m} ÷ 60 ＝ ${k}`],v:()=>k*60===v*m}}
 const a=ri(r,4,9)*10,b=ri(r,4,9)*10,m=ri(r,3,10);
 return{q:`2人が 同じ場所から反対向きに歩き出す。分速は ${a}m と ${b}m。${m}分後に、2人は何m はなれている？`,a:[String((a+b)*m)],unit:'m',disp:(a+b)*m+'m',exp:[`1分間にはなれる道のり：${a} ＋ ${b} ＝ ${a+b}m`,`${a+b} × ${m} ＝ ${(a+b)*m}`],v:()=>a*m+b*m===(a+b)*m};
}};

GEN.area={name:'三角形・四角形の面積',f(r,lv){
 const U='cm²';
 if(lv===1){
  if(r()<.5){const b=ri(r,3,15),h=ri(r,3,12),S=b*h;
   return{q:`底辺 ${b}cm、高さ ${h}cm の平行四辺形の面積は？`,a:[String(S)],unit:U,disp:S+U,exp:['平行四辺形の面積 ＝ 底辺 × 高さ',`${b} × ${h} ＝ ${S}`],v:()=>S===b*h}}
  let b,h;do{b=ri(r,3,16);h=ri(r,3,12)}while(b*h%2);const S=b*h/2;
  return{q:`底辺 ${b}cm、高さ ${h}cm の三角形の面積は？`,a:[String(S)],unit:U,disp:S+U,exp:['三角形の面積 ＝ 底辺 × 高さ ÷ 2',`${b} × ${h} ÷ 2 ＝ ${S}`],v:()=>S*2===b*h}}
 if(lv===2){
  if(r()<.5){let a,b,h;do{a=ri(r,3,10);b=ri(r,a+1,16);h=ri(r,3,10)}while((a+b)*h%2);const S=(a+b)*h/2;
   return{q:`上底 ${a}cm、下底 ${b}cm、高さ ${h}cm の台形の面積は？`,a:[String(S)],unit:U,disp:S+U,exp:['台形の面積 ＝（上底 ＋ 下底）× 高さ ÷ 2',`（${a} ＋ ${b}）× ${h} ÷ 2 ＝ ${S}`],v:()=>S*2===(a+b)*h}}
  let a,b;do{a=ri(r,4,16);b=ri(r,4,16)}while(a*b%2);const S=a*b/2;
  return{q:`対角線が ${a}cm と ${b}cm のひし形の面積は？`,a:[String(S)],unit:U,disp:S+U,exp:['ひし形の面積 ＝ 対角線 × 対角線 ÷ 2',`${a} × ${b} ÷ 2 ＝ ${S}`],v:()=>S*2===a*b}}
 const t=ri(r,0,2);
 if(t===0){const b=ri(r,3,14),h=ri(r,3,12),S=b*h/2;
  if(b*h%2)return GEN.area.f(r,lv);
  return{q:`面積が ${S}cm²、底辺が ${b}cm の三角形がある。高さは何cm？`,a:[String(h)],unit:'cm',disp:h+'cm',exp:['三角形の面積 ＝ 底辺 × 高さ ÷ 2 だから、高さ ＝ 面積 × 2 ÷ 底辺',`${S} × 2 ÷ ${b} ＝ ${h}`],v:()=>b*h===S*2}}
 if(t===1){let a,b,h;do{a=ri(r,3,9);b=ri(r,a+1,14);h=ri(r,3,10)}while((a+b)*h%2);const S=(a+b)*h/2;
  return{q:`上底 ${a}cm、下底 ${b}cm で、面積が ${S}cm² の台形がある。高さは何cm？`,a:[String(h)],unit:'cm',disp:h+'cm',exp:['台形の面積 ＝（上底 ＋ 下底）× 高さ ÷ 2 だから、高さ ＝ 面積 × 2 ÷（上底 ＋ 下底）',`${S} × 2 ÷（${a} ＋ ${b}）＝ ${S*2} ÷ ${a+b} ＝ ${h}`],v:()=>S*2===(a+b)*h}}
 const b=ri(r,3,12),h=ri(r,3,10),S=b*h;
 return{q:`面積が ${S}cm²、高さが ${h}cm の平行四辺形がある。底辺は何cm？`,a:[String(b)],unit:'cm',disp:b+'cm',exp:['平行四辺形の面積 ＝ 底辺 × 高さ だから、底辺 ＝ 面積 ÷ 高さ',`${S} ÷ ${h} ＝ ${b}`],v:()=>b*h===S};
}};

GEN.percent={name:'割合・百分率・歩合',f(r,lv){
 const P=pick([20,25,40,50,80,100,200,250,400,500],r);
 const pOf=(B)=>{let p,t=0;do p=ri(r,2,98);while(B*p%100!==0&&t++<200);return B*p%100===0?p:50};
 if(lv===1){
  if(r()<.7){const p=pOf(P),A=P*p/100;
   return{q:`${A} は ${P} の何％？`,a:[String(p)],unit:'％',disp:p+'％',exp:['割合 ＝ 比べる量 ÷ もとにする量',`${A} ÷ ${P} ＝ ${nf(A/P)}　→　100をかけて ${p}％`],v:()=>A*100/P===p}}
  const n=ri(r,1,99),x=dq(n,2);
  return{q:`割合 ${x} を、百分率（ひゃくぶんりつ）で表すと？`,a:[String(n)],unit:'％',disp:n+'％',exp:['割合の 0.01 が 1％',`${x} × 100 ＝ ${n}　→　${n}％`],v:()=>Math.abs(n/100-+x)<1e-9}}
 if(lv===2){const t=ri(r,0,2);
  if(t===0){const p=pOf(P),A=P*p/100;
   return{q:`${P}人の ${p}％ は、何人？`,a:[String(A)],unit:'人',disp:A+'人',exp:['比べる量 ＝ もとにする量 × 割合',`${p}％ ＝ ${dq(p,2)}　→　${P} × ${dq(p,2)} ＝ ${A}`],v:()=>A*100===P*p}}
  if(t===1){const w=ri(r,1,9),f=ri(r,1,9),ans=w+'割'+f+'分';
   return{q:`${dq(w*10+f,2)} を、歩合（ぶあい）で表すと？（例：3割5分）`,a:[ans],disp:ans,exp:['割合の 0.1 が 1割、0.01 が 1分',`${dq(w*10+f,2)} ＝ ${w}割${f}分`],v:()=>Math.abs((w*10+f)/100-+dq(w*10+f,2))<1e-9}}
  const w=ri(r,1,9),f=ri(r,1,9),p=w*10+f;
  return{q:`${w}割${f}分 は、何％？`,a:[String(p)],unit:'％',disp:p+'％',exp:['1割 ＝ 10％、1分 ＝ 1％',`${w}割${f}分 ＝ ${w*10}％ ＋ ${f}％ ＝ ${p}％`],v:()=>w*10+f===p}}
 const t=ri(r,0,2);
 if(t===0){const B=pick([20,40,50,60,80,100,120,200,250,300,400],r),p=pOf(B),A=B*p/100;
  return{q:`ある数の ${p}％ が ${A}。ある数は？`,a:[String(B)],disp:String(B),exp:['もとにする量 ＝ 比べる量 ÷ 割合',`${p}％ ＝ ${dq(p,2)}　→　${A} ÷ ${dq(p,2)} ＝ ${B}`],v:()=>B*p===A*100}}
 if(t===1){const Pr=ri(r,3,20)*100,w=ri(r,1,5),ans=Pr*(10-w)/10;
  return{q:`定価 ${Pr}円の品物を ${w}割引きで売る。ねだんは何円？`,a:[String(ans)],unit:'円',disp:ans+'円',exp:[`${w}割引き ＝ 定価の ${10-w}割で売る`,`${Pr} × ${dq(10-w,1)} ＝ ${ans}`],v:()=>ans*10===Pr*(10-w)}}
 const B=ri(r,4,30)*50,p=pick([10,20,30,40,50],r),ans=B*(100+p)/100;
 return{q:`去年の来場者は ${B}人。今年は去年より ${p}％ふえた。今年は何人？`,a:[String(ans)],unit:'人',disp:ans+'人',exp:[`${p}％ふえたので、去年の ${100+p}％ ＝ ${dq(100+p,2)}倍`,`${B} × ${dq(100+p,2)} ＝ ${ans}`],v:()=>ans*100===B*(100+p)};
}};

GEN.circle_len={name:'円周',f(r,lv){
 const L=(d)=>nf(d*314/100);
 if(lv===1){const d=ri(r,2,20),c=L(d);
  return{q:`直径が ${d}cm の円の、円周は何cm？（円周率は 3.14）`,a:[c],unit:'cm',disp:c+'cm',exp:['円周 ＝ 直径 × 円周率',`${d} × 3.14 ＝ ${c}`],v:()=>Math.abs(+c-d*3.14)<1e-9}}
 if(lv===2){const R=ri(r,2,15),d=2*R,c=L(d);
  return{q:`半径が ${R}cm の円の、円周は何cm？（円周率は 3.14）`,a:[c],unit:'cm',disp:c+'cm',exp:[`直径 ＝ 半径 × 2 ＝ ${d}cm`,`円周 ＝ 直径 × 3.14 ＝ ${d} × 3.14 ＝ ${c}`],v:()=>Math.abs(+c-2*R*3.14)<1e-9}}
 if(r()<.5){const d=ri(r,3,30),c=L(d);
  return{q:`円周が ${c}cm の円の、直径は何cm？（円周率は 3.14）`,a:[String(d)],unit:'cm',disp:d+'cm',exp:['直径 ＝ 円周 ÷ 円周率',`${c} ÷ 3.14 ＝ ${d}`],v:()=>Math.abs(d*3.14-+c)<1e-9}}
 const d=ri(r,2,10)*2,c=nf(d*3.14/2+d);
 return{q:`直径 ${d}cm の半円の、まわりの長さは何cm？（円周率は 3.14）`,a:[c],unit:'cm',disp:c+'cm',exp:[`曲がった部分は、円周の半分：${d} × 3.14 ÷ 2 ＝ ${nf(d*3.14/2)}`,`まっすぐな部分（直径）：${d}`,`${nf(d*3.14/2)} ＋ ${d} ＝ ${c}`],v:()=>Math.abs(+c-(d*3.14/2+d))<1e-9};
}};
