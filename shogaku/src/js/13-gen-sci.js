/* ===== 理科の計算ドリル（自動生成・無限）：ふりこ・ものがとける量・てこ ===== */
GEN.pendulum={name:'ふりこの周期',subj:'理',f(r,lv){
 if(lv===1){const N=pick([10,10,20],r),T=N===10?ri(r,10,20):ri(r,20,40),t=nf(T/N);
  return{q:`ふりこが ${N}往復するのに ${T}秒かかった。1往復にかかる時間は何秒？`,a:[t],unit:'秒',disp:t+'秒',exp:[`1往復の時間 ＝ ${N}往復の時間 ÷ ${N}`,`${T} ÷ ${N} ＝ ${t}`],v:()=>Math.abs(+t*N-T)<1e-9}}
 if(lv===2){
  if(r()<.4){const long=r()<.5,c=long?'ふりこの長さを長くする':'ふりこの長さを短くする',ws=['おもりを重くする','おもりを軽くする',long?'ふれはばを大きくする':'ふれはばを小さくする'];
   return{q:long?'ふりこが1往復する時間を、長くするには？':'ふりこが1往復する時間を、短くするには？',ch:[c,...ws],disp:c,exp:['1往復の時間は、ふりこの長さできまる。長いほど長くなる','おもりの重さやふれはばを変えても、1往復の時間は変わらない'],v:()=>!ws.includes(c)}}
  const t10=ri(r,11,19),n=pick([10,20,30],r),tot=nf(t10*n/10);
  return{q:`あるふりこは、1往復に ${nf(t10/10)}秒かかる。${n}往復では何秒かかる？`,a:[tot],unit:'秒',disp:tot+'秒',exp:['全体の時間 ＝ 1往復の時間 × 往復の数',`${nf(t10/10)} × ${n} ＝ ${tot}`],v:()=>Math.abs(+tot-t10/10*n)<1e-9}}
 if(r()<.5){const m=ri(r,120,180),d=ri(r,1,6),xs=[m-d,m,m+d],avg=nf(m/10),T=m;
  return{q:`ふりこが 10往復する時間を 3回はかると、${xs.map(x=>nf(x/10)).join('秒、')}秒だった。3回の平均から、1往復の時間を求めると何秒？`,a:[nf(T/100)],unit:'秒',disp:nf(T/100)+'秒',exp:[`3回の平均 ＝（${xs.map(x=>nf(x/10)).join(' ＋ ')}）÷ 3 ＝ ${avg}秒`,`1往復 ＝ ${avg} ÷ 10 ＝ ${nf(T/100)}秒`],v:()=>sum(xs)===3*m}}
 const T=ri(r,100,200),w1=pick([10,20,30],r),w2=w1+pick([10,20,30],r);
 return{q:`${w1}gのおもりをつけたふりこは、10往復に ${nf(T/10)}秒かかった。ふりこの長さとふれはばは そのままで、おもりを ${w2}gに変えると、10往復は何秒かかる？`,a:[nf(T/10)],unit:'秒',disp:nf(T/10)+'秒',exp:['ふりこが往復する時間は、おもりの重さでは変わらない',`だから、同じ ${nf(T/10)}秒`],v:()=>true};
}};

GEN.dissolve={name:'ものがとける量',subj:'理',f(r,lv){
 const S=pick([['食塩',18,[10,20,30],20],['ミョウバン',3,[3,4,5],20],['ホウ酸',2.5,[2,3,4],20]],r),per50=S[1],name=S[0],SAFE=S[2];
 const lim=W=>nf(per50*W/50);
 if(lv===1){const k=ri(r,2,8),W=50*k,ans=lim(W);
  return{q:`水 50mL に、${name}は 20℃で ${nf(per50)}g までとける。水 ${W}mL には、何gまでとける？`,a:[ans],unit:'g',disp:ans+'g',exp:['とける量は、水の量に比例する',`${W}mL は 50mL の ${k}倍だから ${nf(per50)} × ${k} ＝ ${ans}`],v:()=>Math.abs(+ans-per50*W/50)<1e-9}}
 if(lv===2){const W=pick([100,150,200],r),L=per50*W/50;
  if(r()<.5){const x=nf(+(L*pick([.4,.5,.6],r)).toFixed(2)),rest=nf(L-+x);
   return{q:`水 ${W}mL に、${name}を ${x}g とかした。20℃で、あと何g とかすことができる？（20℃で水 50mL に ${nf(per50)}g までとける）`,a:[rest],unit:'g',disp:rest+'g',exp:[`${W}mL にとける量 ＝ ${nf(per50)} × ${W/50} ＝ ${nf(L)}g`,`あとにとける量 ＝ ${nf(L)} − ${x} ＝ ${rest}`],v:()=>Math.abs(+rest+ +x-L)<1e-9}}
  const x=nf(+(L+pick([1,2,3,4],r)*(per50>5?2:.5)).toFixed(2)),left=nf(+x-L);
  return{q:`20℃の水 ${W}mL に、${name}を ${x}g 入れてよくかきまぜた。とけのこるのは何g？（20℃で水 50mL に ${nf(per50)}g までとける）`,a:[left],unit:'g',disp:left+'g',exp:[`${W}mL にとける量 ＝ ${nf(per50)} × ${W/50} ＝ ${nf(L)}g`,`とけのこり ＝ ${x} − ${nf(L)} ＝ ${left}`],v:()=>Math.abs(+left+L-+x)<1e-9}}
 const t=ri(r,0,1);
 if(t===0){const W=pick([50,100,150,200],r),s=pick(SAFE.map(x=>x*W/100),r),tot=W+s;
  return{q:`水 ${W}g に ${name} ${s}g をすべてとかした。できた水よう液の重さは何g？`,a:[String(tot)],unit:'g',disp:tot+'g',exp:['ものがとけても、全体の重さは変わらない（とけたものの重さも ふくまれる）',`${W} ＋ ${s} ＝ ${tot}`],v:()=>tot-s===W}}
 const W=pick([100,150,200,250],r),L=per50*W/50,ans=nf(W+L);
 return{q:`20℃の水 ${W}g に、${name}をとけるだけとかした。できた水よう液の重さは何g？（20℃で水 50g に ${nf(per50)}g までとける）`,a:[ans],unit:'g',disp:ans+'g',exp:[`とけた ${name} ＝ ${nf(per50)} × ${W/50} ＝ ${nf(L)}g`,`水よう液の重さ ＝ ${W} ＋ ${nf(L)} ＝ ${ans}`],v:()=>Math.abs(+ans-W-L)<1e-9};
}};

GEN.lever={name:'てこのつりあい',subj:'理',f(r,lv){
 /* 支点から左右のうでに おもりを下げる。（おもりの重さ × 支点からのきょり）が 左右で等しいとき つりあう */
 if(lv===1){let w1,d1,d2,t=0;do{w1=pick([10,20,30,40,60],r);d1=ri(r,1,6);d2=ri(r,1,6)}while((d1===d2||w1*d1%d2)&&t++<300);
  if(w1*d1%d2||d1===d2){w1=30;d1=4;d2=2}
  const w2=w1*d1/d2;
  return{q:`てこが水平につりあっている。支点から左へ ${d1}めもりのところに ${w1}g のおもり。右へ ${d2}めもりのところには、何g のおもり？`,a:[String(w2)],unit:'g',disp:w2+'g',exp:['つりあうとき、おもりの重さ × 支点からのきょり が、左右で等しい',`左：${w1} × ${d1} ＝ ${w1*d1}　→　右：□ × ${d2} ＝ ${w1*d1}　→　□ ＝ ${w2}`],v:()=>w1*d1===w2*d2}}
 if(lv===2){let w1,d1,w2,t=0;do{w1=pick([10,20,30,40,60],r);d1=ri(r,2,6);w2=pick([10,20,30,40,60,15,45],r)}while((w1===w2||w1*d1%w2||w1*d1/w2>8)&&t++<300);
  if(w1*d1%w2||w1*d1/w2>8||w1===w2){w1=40;d1=3;w2=20}
  const d2=w1*d1/w2;
  return{q:`てこが水平につりあっている。支点から左へ ${d1}めもりのところに ${w1}g のおもり。右に ${w2}g のおもりを下げるなら、支点から右へ何めもりのところ？`,a:[String(d2)],unit:'めもり',disp:d2+'めもり',exp:['つりあうとき、おもりの重さ × 支点からのきょり が、左右で等しい',`左：${w1} × ${d1} ＝ ${w1*d1}　→　右：${w2} × □ ＝ ${w1*d1}　→　□ ＝ ${d2}`],v:()=>w1*d1===w2*d2}}
 let a,b,d1,d2,d3,w3,t=0;
 do{a=pick([10,20,30,40],r);b=pick([10,20,30,40],r);d1=ri(r,1,5);d2=ri(r,1,5);d3=ri(r,2,6);w3=(a*d1+b*d2)/d3}while((d1===d2||!Number.isInteger(w3)||w3>150)&&t++<500);
 if(!Number.isInteger(w3)||w3>150||d1===d2){a=20;b=30;d1=2;d2=4;d3=4;w3=40}
 return{q:`てこが水平につりあっている。支点から左へ ${d1}めもりに ${a}g、${d2}めもりに ${b}g のおもりを下げた。右へ ${d3}めもりのところには、何g のおもりを下げればよい？`,a:[nf(w3)],unit:'g',disp:nf(w3)+'g',exp:[`左の 回す力：${a} × ${d1} ＋ ${b} × ${d2} ＝ ${a*d1+b*d2}`,`右：□ × ${d3} ＝ ${a*d1+b*d2}　→　□ ＝ ${nf(w3)}`],v:()=>Math.abs(w3*d3-(a*d1+b*d2))<1e-9};
}};
