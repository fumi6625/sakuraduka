/* ===== 数学の自動生成ドリル（続き）図形・確率・データ・中3 ===== */
GEN.geo_tri={name:'三角形の角',f(r,lv){
 const t=lv===1?0:ri(r,1,3);
 if(t===0){const a=ri(r,30,85),b=ri(r,30,85),c=180-a-b;
  return{q:`三角形の2つの内角が ${a}°、${b}° のとき、残りの内角は？`,a:[String(c)],unit:'°',disp:c+'°',exp:['三角形の内角の和は 180°',`180 − ${a} − ${b} ＝ ${c}`],v:()=>a+b+c===180}}
 if(t===1){const top=2*ri(r,10,80),base=(180-top)/2;
  return{q:`AB＝AC の二等辺三角形で、頂角 ∠A が ${top}° のとき、底角 ∠B は？`,a:[String(base)],unit:'°',disp:base+'°',exp:['二等辺三角形の底角は等しい','底角 ＝ (180 − 頂角) ÷ 2',`(180 − ${top}) ÷ 2 ＝ ${base}`],v:()=>top+2*base===180}}
 if(t===2){const base=ri(r,25,75),top=180-2*base;
  return{q:`AB＝AC の二等辺三角形で、底角 ∠B が ${base}° のとき、頂角 ∠A は？`,a:[String(top)],unit:'°',disp:top+'°',exp:['底角が2つ等しいので、2つの底角の和は '+2*base+'°',`頂角 ＝ 180 − ${2*base} ＝ ${top}`],v:()=>top+2*base===180}}
 const a=ri(r,30,80),b=ri(r,30,80);
 return{q:`△ABC で ∠A＝${a}°、∠B＝${b}° のとき、頂点 C の外角は？`,a:[String(a+b)],unit:'°',disp:(a+b)+'°',exp:['三角形の外角は、それととなり合わない2つの内角の和に等しい',`${a} + ${b} ＝ ${a+b}`],v:()=>true};
}};
GEN.geo_poly={name:'多角形の角',f(r,lv){
 const t=pick(lv===1?[0,1,5,6]:[0,1,2,3,4,5,6,7],r),N=lv===1?[5,6,8,9,10,12]:[5,6,8,9,10,12,15,18,20,24];
 if(t===0){const n=ri(r,5,12);return{q:`${n}角形の内角の和は？`,a:[String((n-2)*180)],unit:'°',disp:(n-2)*180+'°',exp:['n角形の内角の和は 180° × (n − 2)',`180 × (${n} − 2) ＝ ${(n-2)*180}`],v:()=>true}}
 if(t===1){const n=pick(N,r),v=180-360/n;return{q:`正${n}角形の1つの内角は？`,a:[String(v)],unit:'°',disp:v+'°',exp:['外角は 360° ÷ n',`外角 ＝ 360 ÷ ${n} ＝ ${360/n}°　→　内角 ＝ 180 − ${360/n} ＝ ${v}°`],v:()=>true}}
 if(t===2){const n=pick(N,r);return{q:`正${n}角形の1つの外角は？`,a:[String(360/n)],unit:'°',disp:360/n+'°',exp:['多角形の外角の和は 360°','正多角形の外角は 360° ÷ n',`360 ÷ ${n} ＝ ${360/n}`],v:()=>true}}
 if(t===3){const n=ri(r,5,12),S=(n-2)*180;return{q:`内角の和が ${S}° の多角形は何角形？`,a:[String(n)],unit:'角形',disp:n+'角形',exp:['180 × (n − 2) ＝ '+S,`n − 2 ＝ ${S} ÷ 180 ＝ ${n-2}　→　n ＝ ${n}`],v:()=>true}}
 if(t===5){const n=lv===1?4:pick([4,5,6],r),S=(n-2)*180;let g=null,x=0;
  for(let k=0;k<300&&!g;k++){const a=[];let rest=S;for(let i=0;i<n-2;i++){const v=ri(r,60,140);a.push(v);rest-=v}const xx=ri(r,50,150),last=rest-xx;if(last>=50&&last<=165){a.push(last);g=a;x=xx}}
  if(!g){g=n===4?[85,95,110]:n===5?[100,110,95,120]:[120,110,130,125,115];x=S-sum(g)}
  return{q:`${n}角形の内角のうち ${n-1}つが ${g.map(v=>v+'°').join('、')} のとき、残りの1つの内角は？`,a:[String(x)],unit:'°',disp:x+'°',exp:[`${n}角形の内角の和は 180° × (${n} − 2) ＝ ${S}°`,`残りの角 ＝ ${S} − (${g.join(' ＋ ')}) ＝ ${S} − ${sum(g)} ＝ ${x}`],v:()=>sum(g)+x===S}}
 if(t===6){if(lv===1||r()<.6){const n=ri(r,4,14),d=n*(n-3)/2;return{q:`${n}角形の対角線の本数は？`,a:[String(d)],unit:'本',disp:d+'本',exp:[`1つの頂点からは、自分と両どなりをのぞく ${n-3}本の対角線がひける`,`対角線の本数 ＝ ${n} × ${n-3} ÷ 2 ＝ ${d}（2回ずつ数えるので÷2）`],v:()=>true}}
  const n=ri(r,5,12),d=n*(n-3)/2;return{q:`対角線の本数が ${d}本の多角形は、何角形？`,a:[String(n)],unit:'角形',disp:n+'角形',exp:['n角形の対角線の本数は n × (n − 3) ÷ 2',`${n} × ${n-3} ÷ 2 ＝ ${d}　→　${n}角形`],v:()=>true}}
 if(t===7){const n=pick([5,6,8,9,10,12,15,18,20,24],r),v=180-360/n;return{q:`1つの内角が ${v}° の正多角形は、正何角形？`,a:[String(n)],unit:'角形',disp:'正'+n+'角形',exp:[`内角が ${v}° なので、外角は 180 − ${v} ＝ ${360/n}°`,'外角の和 360° ÷ 1つの外角 ＝ 辺の数',`360 ÷ ${360/n} ＝ ${n}`],v:()=>true}}
 const e=pick([30,36,40,45,60,72],r);return{q:`1つの外角が ${e}° の正多角形は、正何角形？`,a:[String(360/e)],unit:'角形',disp:'正'+360/e+'角形',exp:['外角の和 360° ÷ 1つの外角 ＝ 辺の数',`360 ÷ ${e} ＝ ${360/e}`],v:()=>true};
}};
const PAIRS=(()=>{const a=[];for(let i=1;i<=6;i++)for(let j=1;j<=6;j++)a.push([i,j]);return a})();
GEN.prob={name:'確率',f(r,lv){
 const fa=(n,d)=>({a:fracAcc(n,d),disp:fr(n,d)}),PR=[2,3,5,7,11,13,17,19];
 const comb=(m,j)=>{let a=1;for(let i=0;i<j;i++)a=a*(m-i)/(i+1);return Math.round(a)};
 if(lv===1){
  const t=ri(r,0,3);
  if(t===1){   // 数字カード
   const n=pick([10,12,15,20],r),all=Array.from({length:n},(_,i)=>i+1),k=ri(r,3,n-3);
   const C=[['偶数',x=>x%2===0],['奇数',x=>x%2===1],['3の倍数',x=>x%3===0],['4の倍数',x=>x%4===0],['5の倍数',x=>x%5===0],['素数',x=>PR.includes(x)],[k+'以上の数',x=>x>=k],[k+'以下の数',x=>x<=k],[k+'より大きい数',x=>x>k],['2けたの数',x=>x>=10]],c=pick(C,r),ok=all.filter(c[1]);
   if(ok.length&&ok.length<n)return Object.assign({q:`1から${n}までの数字を1つずつ書いた${n}枚のカードから、1枚引くとき、${c[0]}が出る確率は？（約分した分数で）`,unit:'例 1/2',exp:[`カードの引き方は全部で ${n}通り（どれも同じ確からしさ）`,`${c[0]}は ${ok.join('、')} の ${ok.length}通り`,`確率 ＝ ${ok.length}/${n} ＝ ${fr(ok.length,n)}`],v:()=>true},fa(ok.length,n))}
  if(t===2){   // 袋の玉
   const R=ri(r,1,9),W=ri(r,1,9),col=r()<.5?'赤玉':'白玉',n=col==='赤玉'?R:W,all=R+W;
   return Object.assign({q:`赤玉${R}個、白玉${W}個が入った袋から、1個取り出すとき、${col}が出る確率は？（約分した分数で）`,unit:'例 3/8',exp:[`玉の取り出し方は全部で ${all}通り（どれも同じ確からしさ）`,`${col}は ${n}個`,`確率 ＝ ${n}/${all} ＝ ${fr(n,all)}`],v:()=>true},fa(n,all))}
  if(t===3){   // 3色の玉
   const R=ri(r,1,6),W=ri(r,1,6),B=ri(r,1,6),c=pick([['赤玉',R],['白玉',W],['青玉',B]],r),all=R+W+B;
   return Object.assign({q:`赤玉${R}個、白玉${W}個、青玉${B}個が入った袋から、1個取り出すとき、${c[0]}が出る確率は？（約分した分数で）`,unit:'例 1/3',exp:[`玉の取り出し方は全部で ${R}＋${W}＋${B} ＝ ${all}通り`,`${c[0]}は ${c[1]}個`,`確率 ＝ ${c[1]}/${all} ＝ ${fr(c[1],all)}`],v:()=>true},fa(c[1],all))}
  const k=ri(r,2,5),F=[1,2,3,4,5,6],C=[['偶数の目',[2,4,6]],['奇数の目',[1,3,5]],['3の倍数の目',[3,6]],[k+'以上の目',F.filter(x=>x>=k)],[k+'以下の目',F.filter(x=>x<=k)],['素数の目',[2,3,5]],['6の約数の目',[1,2,3,6]],['1の目',[1]],[k+'の目',[k]],[k+'以外の目',F.filter(x=>x!==k)]],c=pick(C,r);
  return Object.assign({q:`1つのさいころを投げるとき、${c[0]}が出る確率は？（約分した分数で）`,unit:'例 1/3',exp:['目の出方は全部で 6通り（どれも同じ確からしさ）',`${c[0]}は ${c[1].join('、')} の ${c[1].length}通り`,`確率 ＝ ${c[1].length}/6 ＝ ${fr(c[1].length,6)}`],v:()=>true},fa(c[1].length,6))}
 if(lv===2){
  if(r()<.2){const n=ri(r,2,4),k=ri(r,0,n),num=comb(n,k),den=2**n;
   return Object.assign({q:`${n}枚の硬貨を同時に投げるとき、表がちょうど ${k} 枚出る確率は？（約分した分数で）`,unit:'例 3/8',exp:[`${n}枚の表裏の出方は全部で 2を${n}回かけて ${den}通り`,`表が ${k}枚になるのは ${num}通り（樹形図で数える）`,`確率 ＝ ${num}/${den} ＝ ${fr(num,den)}`],v:()=>num>0},fa(num,den))}
  const K=[
   ()=>{const k=ri(r,3,11);return{t:`目の和が ${k} になる`,p:(a,b)=>a+b===k}},
   ()=>{const k=ri(r,6,10);return{t:`目の和が ${k} 以上になる`,p:(a,b)=>a+b>=k}},
   ()=>{const k=ri(r,4,8);return{t:`目の和が ${k} 以下になる`,p:(a,b)=>a+b<=k}},
   ()=>{const k=ri(r,2,4);return{t:`目の和が ${k} の倍数になる`,p:(a,b)=>(a+b)%k===0}},
   ()=>{const k=pick([4,6,8,9,10,12],r);return{t:`目の積が ${k} になる`,p:(a,b)=>a*b===k}},
   ()=>{const k=ri(r,2,5);return{t:`2つとも ${k} 以上の目が出る`,p:(a,b)=>a>=k&&b>=k}},
   ()=>{const d=ri(r,1,4);return{t:`目の差（大きいほう − 小さいほう）が ${d} になる`,p:(a,b)=>Math.abs(a-b)===d}},
   ()=>({t:'2つとも同じ目が出る',p:(a,b)=>a===b}),
   ()=>({t:'目の積が偶数になる',p:(a,b)=>(a*b)%2===0}),
   ()=>({t:'少なくとも一方が 6 の目になる',p:(a,b)=>a===6||b===6}),
   ()=>({t:'大きいさいころの目が、小さいさいころの目より大きくなる',p:(a,b)=>a>b})],c=pick(K,r)(),ok=PAIRS.filter(x=>c.p(x[0],x[1])),n=ok.length;
  if(n>0&&n<36){const lst=n<=6?'：'+ok.map(x=>`(${x[0]},${x[1]})`).join(' '):'';
   return Object.assign({q:`大小2つのさいころを同時に投げるとき、${c.t}確率は？（約分した分数で）`,unit:'例 1/6',exp:['目の出方は全部で 6 × 6 ＝ 36通り（表にすると数えやすい）',`${c.t}のは ${n}通り${lst}`,`確率 ＝ ${n}/36 ＝ ${fr(n,36)}`],v:()=>n>0},fa(n,36))}
  return Object.assign({q:'大小2つのさいころを同時に投げるとき、2つとも同じ目が出る確率は？（約分した分数で）',unit:'例 1/6',exp:['目の出方は全部で 36通り','同じ目は (1,1)(2,2)(3,3)(4,4)(5,5)(6,6) の 6通り','確率 ＝ 6/36 ＝ 1/6'],v:()=>true},fa(6,36))}
 const R=ri(r,2,7),W=ri(r,2,7),T=R+W,C2=m=>m*(m-1)/2,t=ri(r,0,3),all=C2(T);
 const num=t===0?C2(R):t===1?R*W:t===2?C2(R)+C2(W):all-C2(W),lab=t===0?'2個とも赤玉':t===1?'赤玉と白玉が1個ずつ':t===2?'2個が同じ色':'少なくとも1個は赤玉';
 const ex=[`玉の取り出し方は全部で ${T}個から2個 ＝ ${all}通り`,t===0?`赤玉2個は ${R}個から2個 ＝ ${C2(R)}通り`:t===1?`赤1個 × 白1個 ＝ ${R} × ${W} ＝ ${R*W}通り`:t===2?`赤2個 ${C2(R)}通り ＋ 白2個 ${C2(W)}通り ＝ ${num}通り`:`「少なくとも1個は赤」＝ 全部 − 「2個とも白」＝ ${all} − ${C2(W)} ＝ ${num}通り`,`確率 ＝ ${num}/${all} ＝ ${fr(num,all)}`];
 return Object.assign({q:`赤玉${R}個、白玉${W}個が入った袋から、同時に2個取り出すとき、${lab}である確率は？（約分した分数で）`,unit:'例 3/10',exp:ex,v:()=>num>0&&num<=all},fa(num,all));
}};
GEN.stat={name:'データの活用',f(r,lv){
 const n=lv===1?5:lv===2?(r()<.5?6:7):9;let d,t=0,mode;
 do{
  const m=ri(r,6,15);d=[];for(let i=0;i<n-1;i++)d.push(ri(r,Math.max(1,m-6),m+8));d[1]=d[0];
  d.push(m*n-sum(d));
  const cnt={};d.forEach(x=>{cnt[x]=(cnt[x]||0)+1});const mx=Math.max(...Object.values(cnt));
  const ms=Object.keys(cnt).filter(k=>cnt[k]===mx);mode=ms.length===1?+ms[0]:null;
 }while((d[n-1]<1||d[n-1]>30||mode===null)&&t++<200);
 const s=d.slice().sort((a,b)=>a-b),med=a=>{const k=a.length;return k%2?a[(k-1)/2]:(a[k/2-1]+a[k/2])/2},mean=sum(d)/n;
 const typ=lv===3?3:ri(r,0,lv===1?3:2),lst=d.join('、'),sl=s.join('、'),f=x=>String(+x.toFixed(2));
 if(typ===0)return{q:`データ ${lst} の平均値は？`,a:[f(mean)],disp:f(mean),exp:[`合計 ＝ ${sum(d)}、個数 ＝ ${n}`,`平均 ＝ ${sum(d)} ÷ ${n} ＝ ${f(mean)}`],v:()=>true};
 if(typ===1)return{q:`データ ${lst} の中央値（メジアン）は？`,a:[f(med(s))],disp:f(med(s)),exp:[`小さい順に並べる：${sl}`,n%2?`真ん中の値（${(n+1)/2}番目）が中央値 ＝ ${f(med(s))}`:`真ん中の2つの平均：(${s[n/2-1]} + ${s[n/2]}) ÷ 2 ＝ ${f(med(s))}`],v:()=>true};
 if(typ===2)return{q:`データ ${lst} の最頻値（モード）は？`,a:[String(mode)],disp:String(mode),exp:['いちばん多く出てくる値が最頻値',`${mode} が最も多い`],v:()=>true};
 if(lv<3)return{q:`データ ${lst} の範囲（レンジ）は？`,a:[String(s[n-1]-s[0])],disp:String(s[n-1]-s[0]),exp:['範囲 ＝ 最大値 − 最小値',`${s[n-1]} − ${s[0]} ＝ ${s[n-1]-s[0]}`],v:()=>true};
 const q1=med(s.slice(0,4)),q3=med(s.slice(5));
 return{q:`データ ${lst} の四分位範囲は？`,a:[f(q3-q1)],disp:f(q3-q1),exp:[`小さい順：${sl}`,`第1四分位数 ＝ 下半分（${s.slice(0,4).join('、')}）の中央値 ＝ ${f(q1)}`,`第3四分位数 ＝ 上半分（${s.slice(5).join('、')}）の中央値 ＝ ${f(q3)}`,`四分位範囲 ＝ ${f(q3)} − ${f(q1)} ＝ ${f(q3-q1)}`],v:()=>true};
}};
const ev=(p,x)=>p.reduce((a,c)=>a*x+c,0);
const mulP=(p,q)=>{const o=Array(p.length+q.length-1).fill(0);p.forEach((a,i)=>q.forEach((b,j)=>{o[i+j]+=a*b}));return o};
const pStr=p=>q2(p[0],p[1],p[2]);
GEN.expand={name:'式の展開',f(r,lv){
 let L,R,expr,wr,ex;
 if(lv===1){const a=rnz(r,-7,7),b=rnz(r,-7,7);L=[1,a];R=[1,b];expr=`(${lin(1,a)})(${lin(1,b)})`;
  const s=a+b,p=a*b;wr=[[1,-s,p],[1,s,-p],[1,p,s],[1,s,p+s]];ex=[`(x ＋ ${pr(a)})(x ＋ ${pr(b)}) ＝ x² ＋ (${pr(a)} ＋ ${pr(b)})x ＋ ${pr(a)}×${pr(b)}`,`x の係数は和 ${sg(s)}、定数項は積 ${sg(p)}`]}
 else if(lv===2){const a=ri(r,2,15),t=ri(r,0,4);
  if(t===0){L=[1,a];R=[1,a];expr=`(${lin(1,a)})²`;wr=[[1,0,a*a],[1,a,a*a],[1,2*a,a],[1,-2*a,a*a]];ex=[`(x ＋ ${a})² ＝ x² ＋ 2×${a}×x ＋ ${a}²`,`（真ん中の項は 2ab。a²＋b² だけにしない）`]}
  else if(t===1){L=[1,-a];R=[1,-a];expr=`(${lin(1,-a)})²`;wr=[[1,0,a*a],[1,-a,a*a],[1,2*a,a*a],[1,-2*a,-a*a]];ex=[`(x − ${a})² ＝ x² − 2×${a}×x ＋ ${a}²`,`（最後の ${a}² は ＋ のまま）`]}
  else if(t===3){const p=ri(r,2,4),q=rnz(r,-9,9);L=[p,q];R=[p,q];expr=`(${lin(p,q)})²`;wr=[[p*p,0,q*q],[p*p,p*q,q*q],[p,2*p*q,q*q],[p*p,-2*p*q,q*q]];ex=[`(${lin(p,q)})² ＝ (${p}x)² ＋ 2×${p}x×${pr(q)} ＋ ${pr(q)}²`,`真ん中の項は 2ab ＝ ${sg(2*p*q)}x`]}
  else if(t===4){const p=ri(r,2,4),q=ri(r,2,9);L=[p,q];R=[p,-q];expr=`(${lin(p,q)})(${lin(p,-q)})`;wr=[[p*p,0,q*q],[p*p,2*p*q,-q*q],[p,0,-q*q],[p*p,-2*p*q,-q*q]];ex=[`(${lin(p,q)})(${lin(p,-q)}) ＝ (${p}x)² − ${q}²`,'（和と差の積：真ん中の項が消える）']}
  else{L=[1,a];R=[1,-a];expr=`(${lin(1,a)})(${lin(1,-a)})`;wr=[[1,0,a*a],[1,2*a,-a*a],[1,-2*a,-a*a],[1,a,-a*a]];ex=[`(x ＋ ${a})(x − ${a}) ＝ x² − ${a}²`,'（和と差の積：真ん中の項が消える）']}}
 else{const p=pick([2,3],r),q=rnz(r,-5,5),s=rnz(r,-5,5),u=pick([1,2],r);L=[p,q];R=[u,s];expr=`(${lin(p,q)})(${lin(u,s)})`;
  const A=p*u,B=p*s+q*u,C=q*s;wr=[[A,p*s-q*u,C],[A,B,-C],[A,p*q+u*s,C],[A,B,C+B]];ex=[`${lin(p,q)} と ${lin(u,s)} を分配：${p}x×(${lin(u,s)}) ＋ ${pr(q)}×(${lin(u,s)})`,`＝ (${q2(A,p*s,0)}) ＋ (${q2(0,q*u,q*s)}) ＝ ${q2(A,B,C)}`]}
 const P=mulP(L,R),ans=pStr(P);
 return{q:`${expr} を展開すると？`,ch:uniq4(ans,wr.map(pStr),k=>q2(P[0],P[1]+k,P[2])),a:[],disp:ans,exp:ex,v:()=>[-2,1,3,5].every(x=>ev(L,x)*ev(R,x)===ev(P,x))};
}};
const fct=(k,r1,r2)=>{const a=[r1,r2].sort((x,y)=>x-y);const body=a[0]===a[1]?`(${lin(1,a[0])})²`:`(${lin(1,a[0])})(${lin(1,a[1])})`;return(k===1?'':k)+body};
GEN.factor={name:'因数分解',f(r,lv){
 let expr,ans,wr,ex,cs,poly,k=1;
 if(lv===1){let a=rnz(r,-12,12),b=rnz(r,-12,12),t=0;while(a===b&&t++<30)b=rnz(r,-12,12);cs=[a,b];poly=[1,a+b,a*b];expr=q2(1,a+b,a*b);ans=fct(1,a,b);wr=[fct(1,-a,-b),fct(1,a,-b),fct(1,-a,b),`(${lin(1,a*b)})(x + 1)`];ex=[`かけて ${sg(a*b)}、たして ${sg(a+b)} になる2つの数を探す`,`${sg(a)} と ${sg(b)}　→　${ans}`]}
 else if(lv===2){const a=ri(r,2,15),t=ri(r,0,2);
  if(t===0){cs=[-a,a];poly=[1,0,-a*a];expr=q2(1,0,-a*a);ans=fct(1,-a,a);wr=[fct(1,a,a),fct(1,-a,-a),`(${lin(1,a*a)})(x + 1)`,`(x − ${a*a})(x + 1)`];ex=['平方の差：x² − a² ＝ (x ＋ a)(x − a)',`${a}² ＝ ${a*a} なので　${ans}`]}
  else if(t===1){cs=[a,a];poly=[1,2*a,a*a];expr=q2(1,2*a,a*a);ans=fct(1,a,a);wr=[fct(1,-a,-a),fct(1,a,-a),`(x + ${a*a})(x + 1)`,`(x + ${2*a})(x + ${a})`];ex=['完全平方：x² ＋ 2ax ＋ a² ＝ (x ＋ a)²',`${a}² ＝ ${a*a}、2×${a} ＝ ${2*a} なので　${ans}`]}
  else{cs=[-a,-a];poly=[1,-2*a,a*a];expr=q2(1,-2*a,a*a);ans=fct(1,-a,-a);wr=[fct(1,a,a),fct(1,a,-a),`(x − ${a*a})(x − 1)`,`(x − ${2*a})(x − ${a})`];ex=['完全平方：x² − 2ax ＋ a² ＝ (x − a)²',`${ans}`]}}
 else{k=ri(r,2,6);let a=rnz(r,-7,7),b=rnz(r,-7,7),t=0;while(a===b&&t++<30)b=rnz(r,-7,7);cs=[a,b];poly=[k,k*(a+b),k*a*b];expr=q2(k,k*(a+b),k*a*b);ans=fct(k,a,b);wr=[fct(1,a,b),fct(k,-a,-b),fct(k,a,-b),`${k}(${lin(1,a*b)})(x + 1)`];ex=[`まず共通因数 ${k} でくくる：${k}(${q2(1,a+b,a*b)})`,`かっこの中を因数分解：${ans}`]}
 return{q:`${expr} を因数分解すると？`,ch:uniq4(ans,wr,j=>fct(k,cs[0]+j,cs[1])),a:[],disp:ans,exp:ex,v:()=>[-3,2,4,7].every(x=>k*(x+cs[0])*(x+cs[1])===ev(poly,x))};
}};
const simpRad=n=>{let k=1,m=n;for(let i=Math.floor(Math.sqrt(n));i>=2;i--){if(m%(i*i)===0){k=i;m=m/(i*i);break}}if(m===1)return String(k);return(k===1?'':k)+'√'+m};
GEN.sqrt={name:'平方根',f(r,lv){
 const M=[2,3,5,6,7],M2=[2,3,5,6,7,10,11,13],cf=(j,m)=>(j===1?'':j)+'√'+m;
 /* 「a√b」「√b」「n」の値。誤答が正解と同じ値（√63 と 3√7 など）にならないよう、のぞくために使う */
 const rv=s=>{const m=String(s).replace(/\s/g,'').match(/^(\d*)(?:√(\d+))?$/);if(!m||(!m[1]&&!m[2]))return NaN;return(m[1]===''?1:+m[1])*(m[2]?Math.sqrt(+m[2]):1)},dv=(c,ws)=>ws.filter(w=>!(Math.abs(rv(w)-rv(c))<1e-9));
 if(lv===1&&r()<.3){const a=ri(r,2,7),m=pick(M2,r);return{q:`${a}√${m} ＝ √□ の □ にあてはまる数は？`,a:[String(a*a*m)],disp:String(a*a*m),exp:['根号の外の数は、2乗して根号の中に入れる',`${a}√${m} ＝ √(${a}² × ${m}) ＝ √${a*a*m}`],v:()=>true}}
 if(lv===1){const k=ri(r,2,9),m=pick(M2,r),N=k*k*m,ans=k+'√'+m;
  return{q:`√${N} を a√b の形（b はできるだけ小さい整数）にすると？`,ch:uniq4(ans,dv(ans,[m+'√'+k,(k*k)+'√'+m,k+'√'+(m*2)]),j=>(k+j)+'√'+m),a:[],disp:ans,exp:[`${N} ＝ ${k*k} × ${m}（${k}² × ${m}）`,`√${N} ＝ √${k*k} × √${m} ＝ ${ans}`],v:()=>true}}
 if(lv===2){const k=ri(r,2,5),m=pick(M,r),N=k*k*m,ds=[];for(let d=2;d<N;d++)if(N%d===0&&d<=30&&N/d<=30)ds.push(d);const ds2=ds.filter(d=>!Number.isInteger(Math.sqrt(d))&&!Number.isInteger(Math.sqrt(N/d))),d=pick(ds2.length?ds2:ds,r),e=N/d,ans=k+'√'+m;
  return{q:`√${d} × √${e} を計算すると？`,ch:uniq4(ans,dv(ans,['√'+(d+e),m+'√'+k,(k*k)+'√'+m]),j=>(k+j)+'√'+m),a:[],disp:ans,exp:[`√a × √b ＝ √(ab)　→　√${d} × √${e} ＝ √${N}`,`${N} ＝ ${k*k} × ${m} なので　√${N} ＝ ${ans}`],v:()=>d*e===N}}
 if(r()<.5){const m=pick(M2,r);let k1=ri(r,1,6),k2=ri(r,1,6);if(k1===1&&k2===1)k1=2;const a=k1*k1*m,b=k2*k2*m,ans=(k1+k2)+'√'+m;
  return{q:`√${a} ＋ √${b} を計算すると？`,ch:uniq4(ans,dv(ans,['√'+(a+b),(k1*k2)+'√'+m,(k1+k2)+'√'+(2*m)]),j=>(k1+k2+j)+'√'+m),a:[],disp:ans,exp:[`それぞれ簡単にする：√${a} ＝ ${simpRad(a)}、√${b} ＝ ${simpRad(b)}`,`ルートの中が同じなので係数をたす：${k1} ＋ ${k2} ＝ ${k1+k2}　→　${ans}`],v:()=>true}}
 const m=pick(M2,r),j=ri(r,1,6),c=j*m,ans=cf(j,m);
 return{q:`${c}/√${m} の分母を有理化すると？`,ch:uniq4(ans,dv(ans,[c+'√'+m,j+'/√'+m,(c*m)+'√'+m]),q=>(j+q)+'√'+m),a:[],disp:ans,exp:[`分母と分子に √${m} をかける：${c}×√${m} ÷ (√${m}×√${m})`,`＝ ${c}√${m} ÷ ${m} ＝ ${ans}`],v:()=>true};
}};
const rootAcc=rs=>{const u=[...new Set(rs)].sort((a,b)=>a-b),perms=u.length===1?[u]:[u,[...u].reverse()],a=[];perms.forEach(p=>{const s=p.map(String);a.push('x='+s.join(','),s.join(','),'x='+s.join(',x='))});return a};
GEN.quad_eq={name:'二次方程式',f(r,lv){
 if(lv===1){let a=rnz(r,-9,9),b=rnz(r,-9,9),t=0;while(a===b&&t++<30)b=rnz(r,-9,9);
  return{q:`${q2(1,-(a+b),a*b)} ＝ 0 の解は？（解が2つのときは「2,3」のように）`,a:rootAcc([a,b]),disp:'x ＝ '+[a,b].sort((x,y)=>x-y).map(sg).join('、'),exp:[`因数分解：(x ${a<0?'+':'−'} ${Math.abs(a)})(x ${b<0?'+':'−'} ${Math.abs(b)}) ＝ 0`,`x ＝ ${sg(a)}、${sg(b)}`],v:()=>a*a-(a+b)*a+a*b===0&&b*b-(a+b)*b+a*b===0}}
 if(lv===2){const k=ri(r,2,12);
  if(r()<.4)return{q:`x² ＝ ${k*k} の解は？（解が2つのときは「3,−3」のように）`,a:['x=±'+k,'±'+k,'x='+k+',-'+k,k+',-'+k,'-'+k+','+k,'x=-'+k+','+k,'x='+k+',x=-'+k],disp:'x ＝ ±'+k,exp:[`x² ＝ ${k*k} のとき x は ${k*k} の平方根`,`x ＝ ±${k}`],v:()=>true};
  const a=rnz(r,-9,9);
  return{q:`(x ${a<0?'+':'−'} ${Math.abs(a)})² ＝ ${k*k} の解は？（解が2つのときは「3,−3」のように）`,a:rootAcc([a+k,a-k]),disp:'x ＝ '+[a+k,a-k].sort((x,y)=>x-y).map(sg).join('、'),exp:[`x ${a<0?'+':'−'} ${Math.abs(a)} ＝ ±${k}`,`x ＝ ${sg(a)} ± ${k}　→　x ＝ ${sg(a+k)}、${sg(a-k)}`],v:()=>true}}
 if(r()<.5){const a=ri(r,1,5),q=rnz(r,-15,15),b=-a*q;
  return{q:`${q2(a,b,0)} ＝ 0 の解は？（解が2つのときは「0,3」のように）`,a:rootAcc([0,q]),disp:'x ＝ '+[0,q].sort((x,y)=>x-y).map(sg).join('、'),exp:[`共通因数 ${a===1?'':a}x でくくる：${a===1?'':a}x(x ${q<0?'+':'−'} ${Math.abs(q)}) ＝ 0`,`x ＝ 0 または x ＝ ${sg(q)}`],v:()=>true}}
 let a=rnz(r,-7,7),b=rnz(r,-7,7),t=0;const k=ri(r,2,5);while(a===b&&t++<30)b=rnz(r,-7,7);
 return{q:`${q2(k,-k*(a+b),k*a*b)} ＝ 0 の解は？（解が2つのときは「2,3」のように）`,a:rootAcc([a,b]),disp:'x ＝ '+[a,b].sort((x,y)=>x-y).map(sg).join('、'),exp:[`両辺を ${k} でわる：${q2(1,-(a+b),a*b)} ＝ 0`,`因数分解して　x ＝ ${sg(a)}、${sg(b)}`],v:()=>true};
}};
GEN.quad_fn={name:'関数 y＝ax²',f(r,lv){
 if(lv===1){const a=rnz(r,-5,6),x=rnz(r,-6,6),v=a*x*x;
  return{q:`関数 y ＝ ${a===1?'':a===-1?MI:sg(a)}x² で、x ＝ ${sg(x)} のとき y の値は？`,a:[String(v)],disp:sg(v),exp:[`x に ${pr(x)} を入れる：${pr(a)}×${pr(x)}²`,`${pr(x)}² ＝ ${x*x} なので　${pr(a)} × ${x*x} ＝ ${sg(v)}`],v:()=>true}}
 if(lv===2){const a=rnz(r,-5,6),p=ri(r,-5,3),q=p+ri(r,1,5);
  return{q:`関数 y ＝ ${a===1?'':a===-1?MI:sg(a)}x² で、x が ${sg(p)} から ${sg(q)} まで増加するときの変化の割合は？`,a:[String(a*(p+q))],disp:sg(a*(p+q)),exp:[`y の増加量 ＝ ${pr(a)}×${pr(q)}² − ${pr(a)}×${pr(p)}² ＝ ${sg(a*q*q)} − ${pr(a*p*p)} ＝ ${sg(a*(q*q-p*p))}`,`x の増加量 ＝ ${pr(q)} − ${pr(p)} ＝ ${q-p}`,`変化の割合 ＝ ${sg(a*(q*q-p*p))} ÷ ${q-p} ＝ ${sg(a*(p+q))}（ a × (p＋q) でも求まる）`],v:()=>(q*q-p*p)%(q-p)===0}}
 const a=ri(r,1,6),p=ri(r,1,6),q=ri(r,1,7),mx=a*Math.max(p*p,q*q);
 return{q:`関数 y ＝ ${a===1?'':a}x² で、x の変域が ${MI}${p} ≦ x ≦ ${q} のとき、y の最大値は？`,a:[String(mx)],disp:String(mx),exp:[`a > 0 なので、x の絶対値が大きいほど y が大きい`,`x ＝ ${MI}${p} のとき y ＝ ${a*p*p}、x ＝ ${q} のとき y ＝ ${a*q*q}`,`大きいほう　${mx}`],v:()=>true};
}};
GEN.pythag={name:'三平方の定理',f(r,lv){
 const T=[[3,4,5],[5,12,13],[8,15,17],[7,24,25],[6,8,10],[9,12,15],[20,21,29]];
 if(lv===1){const t0=pick(T,r),kk=t0[2]<=17?pick([1,2,3,4],r):pick([1,2],r),t=t0.map(x=>x*kk);
  if(r()<.5)return{q:`直角三角形で、直角をはさむ2辺が ${t[0]}cm、${t[1]}cm のとき、斜辺は？`,a:[String(t[2])],unit:'cm',disp:t[2]+'cm',exp:['三平方の定理：a² ＋ b² ＝ c²',`${t[0]}² ＋ ${t[1]}² ＝ ${t[0]**2+t[1]**2} ＝ ${t[2]}²`],v:()=>t[0]**2+t[1]**2===t[2]**2}
  return{q:`直角三角形で、斜辺が ${t[2]}cm、1辺が ${t[0]}cm のとき、もう1辺は？`,a:[String(t[1])],unit:'cm',disp:t[1]+'cm',exp:['三平方の定理：a² ＋ b² ＝ c²',`${t[2]}² − ${t[0]}² ＝ ${t[2]**2-t[0]**2} ＝ ${t[1]}²`],v:()=>true}}
 if(lv===2){let a=ri(r,2,12),b=ri(r,2,12),t=0;while(Number.isInteger(Math.sqrt(a*a+b*b))&&t++<50){a=ri(r,2,12);b=ri(r,2,12)}
  const n=a*a+b*b,ans=simpRad(n);
  return{q:`直角をはさむ2辺が ${a}cm、${b}cm の直角三角形の斜辺は？`,ch:uniq4(ans,[String(a+b),'√'+(a*b),simpRad(n-1)],j=>simpRad(n+j)),a:[],unit:'cm',disp:ans+'cm',exp:[`斜辺² ＝ ${a}² ＋ ${b}² ＝ ${n}`,ans==='√'+n?`斜辺 ＝ √${n}（cm）`:`斜辺 ＝ √${n} ＝ ${ans}（cm）`],v:()=>true}}
 if(r()<.5){const a=ri(r,2,15),ans=a+'√2';
  return{q:`1辺が ${a}cm の正方形の対角線の長さは？`,ch:uniq4(ans,[String(2*a),a+'√3',(a*a)+'√2'],j=>(a+j)+'√2'),a:[],disp:ans+'cm',exp:['対角線は、直角二等辺三角形の斜辺','辺の比は 1 : 1 : √2',`${a} × √2 ＝ ${ans}`],v:()=>true}}
 const t=pick(T.slice(0,5),r),k=ri(r,1,2),x1=rnz(r,-3,3),y1=rnz(r,-3,3),sx=r()<.5?1:-1,sy=r()<.5?1:-1,x2=x1+sx*t[0]*k,y2=y1+sy*t[1]*k;
 return{q:`座標平面上の2点 A(${sg(x1)}, ${sg(y1)})、B(${sg(x2)}, ${sg(y2)}) の間の距離は？`,a:[String(t[2]*k)],disp:String(t[2]*k),exp:[`x の差 ${Math.abs(x2-x1)}、y の差 ${Math.abs(y2-y1)} を直角をはさむ2辺とみる`,`√(${Math.abs(x2-x1)}² ＋ ${Math.abs(y2-y1)}²) ＝ √${(Math.abs(x2-x1))**2+(Math.abs(y2-y1))**2} ＝ ${t[2]*k}`],v:()=>true};
}};
GEN.area_vol={name:'円・立体の計量',f(r,lv){
 const P=n=>n===1?['π','pi','1π','1pi']:[n+'π',n+'pi'],pi_=n=>(n===1?'':n)+'π';
 if(lv===1){const rr=ri(r,2,20),t=ri(r,0,3),d=2*rr;
  if(t===0)return{q:`半径 ${rr}cm の円の面積は？（π を使って）`,a:P(rr*rr),unit:'cm²',disp:rr*rr+'π cm²',exp:['円の面積 ＝ π × 半径²',`π × ${rr}² ＝ ${rr*rr}π`],v:()=>true};
  if(t===1)return{q:`半径 ${rr}cm の円の周の長さは？（π を使って）`,a:P(2*rr),unit:'cm',disp:2*rr+'π cm',exp:['円周 ＝ 2 × π × 半径',`2 × π × ${rr} ＝ ${2*rr}π`],v:()=>true};
  if(t===2)return{q:`直径 ${d}cm の円の面積は？（π を使って）`,a:P(rr*rr),unit:'cm²',disp:rr*rr+'π cm²',exp:[`半径 ＝ 直径 ÷ 2 ＝ ${rr}cm`,'円の面積 ＝ π × 半径²',`π × ${rr}² ＝ ${rr*rr}π`],v:()=>true};
  return{q:`直径 ${d}cm の円の周の長さは？（π を使って）`,a:P(d),unit:'cm',disp:d+'π cm',exp:['円周 ＝ π × 直径',`π × ${d} ＝ ${d}π`],v:()=>true}}
 if(lv===2){
  if(r()<.5){const TH=[30,45,60,72,90,120,135,150,180,210,240,270,300],area=r()<.5;let c=null;
   for(let k=0;k<200&&!c;k++){const rr=pick([2,3,4,5,6,8,9,10,12,15],r),th=pick(TH,r),v=area?rr*rr*th/360:2*rr*th/360;if(Number.isInteger(v))c=[rr,th,v]}
   if(!c)c=[6,90,area?9:3];
   const [rr,th,v]=c;
   if(area)return{q:`半径 ${rr}cm、中心角 ${th}° のおうぎ形の面積は？（π を使って）`,a:P(v),unit:'cm²',disp:pi_(v)+' cm²',exp:['おうぎ形の面積 ＝ 円の面積 × 中心角/360',`${rr*rr}π × ${th}/360 ＝ ${pi_(v)}`],v:()=>true};
   return{q:`半径 ${rr}cm、中心角 ${th}° のおうぎ形の弧の長さは？（π を使って）`,a:P(v),unit:'cm',disp:pi_(v)+' cm',exp:['弧の長さ ＝ 円周 × 中心角/360',`${2*rr}π × ${th}/360 ＝ ${pi_(v)}`],v:()=>true}}
  const rr=ri(r,2,9),h=ri(r,2,12);
  if(r()<.5)return{q:`底面の半径 ${rr}cm、高さ ${h}cm の円柱の体積は？（π を使って）`,a:P(rr*rr*h),unit:'cm³',disp:rr*rr*h+'π cm³',exp:['円柱の体積 ＝ 底面積 × 高さ',`π × ${rr}² × ${h} ＝ ${rr*rr*h}π`],v:()=>true};
  return{q:`底面の半径 ${rr}cm、高さ ${h}cm の円柱の表面積は？（π を使って）`,a:P(2*rr*(rr+h)),unit:'cm²',disp:2*rr*(rr+h)+'π cm²',exp:['表面積 ＝ 底面積×2 ＋ 側面積',`底面 ${rr*rr}π×2 ＝ ${2*rr*rr}π、側面 ＝ 2π×${rr}×${h} ＝ ${2*rr*h}π`,`合計 ${2*rr*(rr+h)}π`],v:()=>true}}
 const t=ri(r,0,4);
 if(t===0){const rr=pick([3,6,9,12],r),h=ri(r,2,12),v=rr*rr*h/3;return{q:`底面の半径 ${rr}cm、高さ ${h}cm の円錐の体積は？（π を使って）`,a:P(v),unit:'cm³',disp:v+'π cm³',exp:['円錐の体積 ＝ 底面積 × 高さ × 1/3',`π × ${rr}² × ${h} × 1/3 ＝ ${v}π`],v:()=>Number.isInteger(v)}}
 if(t===1){const rr=pick([3,6,9],r),v=4*rr*rr*rr/3;return{q:`半径 ${rr}cm の球の体積は？（π を使って）`,a:P(v),unit:'cm³',disp:v+'π cm³',exp:['球の体積 ＝ 4/3 × π × 半径³',`4/3 × π × ${rr}³ ＝ ${v}π`],v:()=>Number.isInteger(v)}}
 if(t===2){const rr=ri(r,2,12);return{q:`半径 ${rr}cm の球の表面積は？（π を使って）`,a:P(4*rr*rr),unit:'cm²',disp:4*rr*rr+'π cm²',exp:['球の表面積 ＝ 4 × π × 半径²',`4π × ${rr}² ＝ ${4*rr*rr}π`],v:()=>true}}
 if(t===3){const rr=pick([3,6,9],r),v=2*rr*rr*rr/3;return{q:`半径 ${rr}cm の半球の体積は？（π を使って）`,a:P(v),unit:'cm³',disp:v+'π cm³',exp:['半球の体積 ＝ 球の体積の半分','4/3 × π × 半径³ × 1/2 ＝ 2/3 × π × 半径³',`2/3 × π × ${rr}³ ＝ ${v}π`],v:()=>Number.isInteger(v)}}
 const rr=ri(r,2,10);return{q:`半径 ${rr}cm の半球の表面積は？（底面の円もふくむ。π を使って）`,a:P(3*rr*rr),unit:'cm²',disp:3*rr*rr+'π cm²',exp:['曲面の部分 ＝ 球の表面積の半分 ＝ 2π × 半径²','底面の円 ＝ π × 半径²',`2π×${rr}² ＋ π×${rr}² ＝ ${2*rr*rr}π ＋ ${rr*rr}π ＝ ${3*rr*rr}π`],v:()=>true};
}};
GEN.similar={name:'相似',f(r,lv){
 let a=ri(r,1,7),b=ri(r,a+1,11),t=0;while(gcd(a,b)!==1&&t++<50){a=ri(r,1,7);b=ri(r,a+1,11)}
 if(lv===1){const vol=r()<.5;return{q:`相似な2つの${vol?'立体':'図形'}の相似比が ${a}：${b} のとき、${vol?'体積比':'面積比'}は？（例 4:9）`,a:[vol?`${a**3}:${b**3}`:`${a*a}:${b*b}`],disp:vol?`${a**3}：${b**3}`:`${a*a}：${b*b}`,exp:[vol?'体積比は相似比の3乗':'面積比は相似比の2乗',vol?`${a}³ : ${b}³ ＝ ${a**3} : ${b**3}`:`${a}² : ${b}² ＝ ${a*a} : ${b*b}`],v:()=>true}}
 if(lv===2){const s=ri(r,2,4),u=ri(r,2,4),ab=a*s,de=b*s,bc=a*u,ef=b*u;
  return{q:`△ABC ∽ △DEF で、AB＝${ab}cm、DE＝${de}cm、BC＝${bc}cm のとき、EF は？`,a:[String(ef)],unit:'cm',disp:ef+'cm',exp:[`相似比 AB：DE ＝ ${ab}：${de}（簡単にすると ${a}：${b}）`,`BC：EF ＝ ${a}：${b} なので　EF ＝ ${bc} × ${b} ÷ ${a} ＝ ${ef}`],v:()=>true}}
 const m=ri(r,1,4),A=a*a*m,B=b*b*m;
 return{q:`相似比が ${a}：${b} の2つの三角形がある。小さいほうの面積が ${A}cm² のとき、大きいほうの面積は？`,a:[String(B)],unit:'cm²',disp:B+'cm²',exp:[`面積比 ＝ ${a}² : ${b}² ＝ ${a*a} : ${b*b}`,`${A} ÷ ${a*a} ＝ ${m}　→　${m} × ${b*b} ＝ ${B}`],v:()=>true};
}};
GEN.circle_ang={name:'円周角',f(r,lv){
 const t=lv===1?ri(r,0,1):ri(r,0,3);
 if(t===0){const c=2*ri(r,20,85);return{q:`中心角が ${c}° の弧に対する円周角は？`,a:[String(c/2)],unit:'°',disp:c/2+'°',exp:['円周角は、同じ弧に対する中心角の半分',`${c} ÷ 2 ＝ ${c/2}`],v:()=>true}}
 if(t===1){const a=ri(r,20,85);return{q:`円周角が ${a}° の弧に対する中心角は？`,a:[String(2*a)],unit:'°',disp:2*a+'°',exp:['中心角は、同じ弧に対する円周角の2倍',`${a} × 2 ＝ ${2*a}`],v:()=>true}}
 if(t===2){const a=ri(r,50,130);return{q:`四角形ABCDが円に内接している。∠A＝${a}° のとき、対角の ∠C は？`,a:[String(180-a)],unit:'°',disp:180-a+'°',exp:['円に内接する四角形の対角の和は 180°',`180 − ${a} ＝ ${180-a}`],v:()=>true}}
 if(r()<.3)return{q:'線分ABが円の直径で、点Cが円周上（A、B以外）にあるとき、∠ACB は？',a:['90'],unit:'°',disp:'90°',exp:['直径に対する円周角は 90°（半円の弧に対する円周角）'],v:()=>true};
 const th=ri(r,15,75);return{q:`線分ABが円の直径で、点Cが円周上（A、B以外）にある。∠CAB ＝ ${th}° のとき、∠ABC は？`,a:[String(90-th)],unit:'°',disp:90-th+'°',exp:['直径に対する円周角なので ∠ACB ＝ 90°',`三角形の内角の和は 180° なので　180 − 90 − ${th} ＝ ${90-th}`],v:()=>true};
}};
GEN.eq_trans={name:'等式の変形',f(r,lv){
 const bank=[
  ()=>{const a=ri(r,3,20);return{q:`x ＋ y ＝ ${a} を y について解くと？`,c:`y ＝ ${a} − x`,w:[`y ＝ x − ${a}`,`y ＝ ${a} + x`,`y ＝ −${a} − x`],e:['x を右辺へ移項（符号が変わる）',`y ＝ ${a} − x`]}},
  ()=>{const m=ri(r,2,5),n=ri(r,2,5),k=ri(r,6,20);return{q:`${m}x ＋ ${n}y ＝ ${k} を y について解くと？`,c:`y ＝ (${k} − ${m}x)/${n}`,w:[`y ＝ (${k} + ${m}x)/${n}`,`y ＝ ${k} − ${m}x/${n}`,`y ＝ (${m}x − ${k})/${n}`],e:[`${m}x を右辺へ移項：${n}y ＝ ${k} − ${m}x`,`両辺を ${n} でわる：y ＝ (${k} − ${m}x)/${n}`]}},
  ()=>({q:'S ＝ (a ＋ b)h/2 を h について解くと？',c:'h ＝ 2S/(a + b)',w:['h ＝ 2S(a + b)','h ＝ S/(2(a + b))','h ＝ (a + b)/2S'],e:['両辺に 2 をかける：2S ＝ (a ＋ b)h','両辺を (a ＋ b) でわる：h ＝ 2S/(a ＋ b)']}),
  ()=>({q:'V ＝ πr²h/3 を h について解くと？',c:'h ＝ 3V/(πr²)',w:['h ＝ V/(3πr²)','h ＝ 3Vπr²','h ＝ πr²/3V'],e:['両辺に 3 をかける：3V ＝ πr²h','両辺を πr² でわる：h ＝ 3V/(πr²)']}),
  ()=>({q:'m ＝ (a ＋ b ＋ c)/3 を c について解くと？',c:'c ＝ 3m − a − b',w:['c ＝ 3m + a + b','c ＝ m/3 − a − b','c ＝ 3(m − a − b)'],e:['両辺に 3 をかける：3m ＝ a ＋ b ＋ c','a、b を移項：c ＝ 3m − a − b']}),
  ()=>{const m=ri(r,2,9),n=ri(r,1,12);return{q:`y ＝ ${m}x ＋ ${n} を x について解くと？`,c:`x ＝ (y − ${n})/${m}`,w:[`x ＝ (y + ${n})/${m}`,`x ＝ y − ${n}/${m}`,`x ＝ ${m}(y − ${n})`],e:[`${n} を移項：y − ${n} ＝ ${m}x`,`両辺を ${m} でわる：x ＝ (y − ${n})/${m}`]}},
  ()=>{const a=ri(r,2,7),b=ri(r,2,7),c=ri(r,3,20);return{q:`${a}x − ${b}y ＝ ${c} を y について解くと？`,c:`y ＝ (${a}x − ${c})/${b}`,w:[`y ＝ (${a}x + ${c})/${b}`,`y ＝ (${c} − ${a}x)/${b}`,`y ＝ ${a}x − ${c}/${b}`],e:[`${a}x を右辺へ移項：−${b}y ＝ ${c} − ${a}x`,`両辺を −${b} でわる：y ＝ (${a}x − ${c})/${b}`]}},
  ()=>({q:'ℓ ＝ 2πr を r について解くと？',c:'r ＝ ℓ/(2π)',w:['r ＝ 2πℓ','r ＝ ℓ/π','r ＝ 2ℓ/π'],e:['両辺を 2π でわる','r ＝ ℓ/(2π)']}),
  ()=>({q:'v ＝ u ＋ at を t について解くと？',c:'t ＝ (v − u)/a',w:['t ＝ (v + u)/a','t ＝ v − u/a','t ＝ a(v − u)'],e:['u を移項：v − u ＝ at','両辺を a でわる：t ＝ (v − u)/a']}),
  ()=>({q:'S ＝ ah/2 を a について解くと？',c:'a ＝ 2S/h',w:['a ＝ S/(2h)','a ＝ 2Sh','a ＝ h/2S'],e:['両辺に 2 をかける：2S ＝ ah','両辺を h でわる：a ＝ 2S/h']}),
  ()=>{const m=ri(r,2,9),n=ri(r,1,12);return{q:`y ＝ ${m}x − ${n} を x について解くと？`,c:`x ＝ (y + ${n})/${m}`,w:[`x ＝ (y − ${n})/${m}`,`x ＝ y + ${n}/${m}`,`x ＝ ${m}(y + ${n})`],e:[`${n} を移項：y + ${n} ＝ ${m}x`,`両辺を ${m} でわる：x ＝ (y + ${n})/${m}`]}},
  ()=>{const k=ri(r,2,7);return{q:`a ＝ (b ＋ c)/${k} を c について解くと？`,c:`c ＝ ${k}a − b`,w:[`c ＝ ${k}a + b`,`c ＝ a/${k} − b`,`c ＝ ${k}(a − b)`],e:[`両辺に ${k} をかける：${k}a ＝ b ＋ c`,`b を移項：c ＝ ${k}a − b`]}},
  ()=>{const m=ri(r,2,6),k=ri(r,3,21);return{q:`${m}(x − y) ＝ ${k} を y について解くと？`,c:`y ＝ x − ${k}/${m}`,w:[`y ＝ x + ${k}/${m}`,`y ＝ ${k}/${m} − x`,`y ＝ ${m}x − ${k}`],e:[`両辺を ${m} でわる：x − y ＝ ${k}/${m}`,`x を移項して符号をかえる：y ＝ x − ${k}/${m}`]}}];
 const set=lv===1?[0,1,5,6,10]:lv===2?[1,2,5,6,10,11,12,8,9]:[2,3,4,7,8,9,11,12,6];
 const o=bank[pick(set,r)]();
 return{q:o.q,ch:[o.c,...o.w],a:[],disp:o.c,exp:o.e,v:()=>true};
}};
