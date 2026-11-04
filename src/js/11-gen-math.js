/* ===== 数学の自動生成ドリル（無限に出る）中1〜中2 =====
   各ジェネレータ f(r, lv) は { q, a:[許す答え], disp, exp:[解説], ch?:[正解,誤1,誤2,誤3], unit?, v:()=>検算 } を返す。
   lv は 1〜3。r は乱数（再現できる）。*/
const GEN={};
const ri=(r,a,b)=>a+Math.floor(r()*(b-a+1));
const rnz=(r,a,b)=>{let v=0,t=0;while(!v&&t++<60)v=ri(r,a,b);return v||1};
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){const t=a%b;a=b;b=t}return a};
const lcm=(a,b)=>Math.abs(a*b)/gcd(a,b);
const MI='−';
const sg=n=>n<0?MI+Math.abs(n):String(n);
const pr=n=>n<0?'('+MI+Math.abs(n)+')':String(n);
const lin=(a,b,v='x')=>{let s='';if(a!==0)s+=(a===1?'':a===-1?MI:sg(a))+v;if(b!==0)s+=s?(b<0?' '+MI+' '+Math.abs(b):' + '+b):sg(b);return s||'0'};
const lxy=(a,b)=>(a===1?'x':a===-1?MI+'x':sg(a)+'x')+(b<0?' '+MI+' '+(b===-1?'':Math.abs(b))+'y':' + '+(b===1?'':b)+'y');
const q2=(a,b,c,v='x')=>{const t=[];if(a)t.push([a,v+'²']);if(b)t.push([b,v]);if(c)t.push([c,'']);let s='';t.forEach((x,i)=>{const k=x[0],m=x[1],ab=Math.abs(k),co=(ab===1&&m)?'':String(ab);s+=i===0?(k<0?MI:'')+co+m:(k<0?' '+MI+' ':' + ')+co+m});return s||'0'};
const fr=(n,d)=>{const g=gcd(n,d)||1;n/=g;d/=g;if(d<0){n=-n;d=-d}return d===1?String(n):n+'/'+d};
const uniq4=(c,ws,fill)=>{const o=[c];for(const w of ws){if(w!==c&&!o.includes(w))o.push(w);if(o.length>=4)return o}let k=1;while(o.length<4&&k<80){const w=fill(k++);if(w!==c&&!o.includes(w))o.push(w)}return o};
const decOK=(n,d)=>{const g=gcd(n,d);d/=g;while(d%2===0)d/=2;while(d%5===0)d/=5;return d===1};
const fracAcc=(n,d)=>{const g=gcd(n,d);n/=g;d/=g;const a=[n+'/'+d];if(d===1)a.push(String(n));else if(decOK(n,d))a.push(String(+(n/d).toFixed(6)));return a};

GEN.pn_add={name:'正負の数の加減',f(r,lv){
 const n=[2,3,4][lv-1],lim=[9,15,20][lv-1];
 const a=rnz(r,-lim,lim),sc=[a];let q=sg(a);
 for(let i=1;i<n;i++){const b=rnz(r,-lim,lim),plus=r()<.5;q+=(plus?' + ':' − ')+pr(b);sc.push(plus?b:-b)}
 const val=sum(sc),P=sum(sc.filter(x=>x>0)),N=-sum(sc.filter(x=>x<0));
 return{q:q+' ＝ ？',a:[String(val)],disp:sg(val),exp:['ひき算は、符号を変えてたし算に直す：'+sc.map(pr).join(' + '),N===0?'負の数はないので、正の数の和 '+P+' がそのまま答え ＝ '+sg(val):P===0?'正の数はないので、負の数の和 '+MI+N+' がそのまま答え ＝ '+sg(val):'正の数の和 '+P+'、負の数の和 '+MI+N+' なので '+P+' − '+N+' ＝ '+sg(val)],v:()=>val===sum(sc)};
}};
GEN.pn_mul={name:'正負の数の乗除・累乗',f(r,lv){
 if(lv===1){
  if(r()<.5){const a=rnz(r,-9,9),b=rnz(r,-9,9),v=a*b;
   return{q:`${pr(a)} × ${pr(b)} ＝ ？`,a:[String(v)],disp:sg(v),exp:[v>0?'同じ符号どうしの積は ＋':'ちがう符号どうしの積は −',Math.abs(a)+' × '+Math.abs(b)+' ＝ '+Math.abs(v)+'　→　'+sg(v)],v:()=>v===a*b};}
  const k=rnz(r,-9,9),d=rnz(r,-9,9),n=k*d;
  return{q:`${pr(n)} ÷ ${pr(d)} ＝ ？`,a:[String(k)],disp:sg(k),exp:[k>0?'同じ符号どうしの商は ＋':'ちがう符号どうしの商は −',Math.abs(n)+' ÷ '+Math.abs(d)+' ＝ '+Math.abs(k)+'　→　'+sg(k)],v:()=>k*d===n};
 }
 if(lv===2){
  const t=ri(r,0,5);
  if(t===0){const a=ri(r,2,12),v=a*a;return{q:`(${MI}${a})² ＝ ？`,a:[String(v)],disp:String(v),exp:[`(${MI}${a})² は (${MI}${a}) を2回かける：(${MI}${a}) × (${MI}${a}) ＝ ${v}`],v:()=>v===(-a)**2}}
  if(t===1){const a=ri(r,2,12),v=-a*a;return{q:`${MI}${a}² ＝ ？`,a:[String(v)],disp:sg(v),exp:[`${MI}${a}² は「${a}² に − をつけたもの」：${MI}(${a} × ${a}) ＝ ${sg(v)}`,`(${MI}${a})² とは別もの。かっこがあるか必ず確認`],v:()=>v===-(a*a)}}
  if(t===3){const a=ri(r,2,6),b=ri(r,2,6),v=a*a*(-b);return{q:`(${MI}${a})² × (${MI}${b}) ＝ ？`,a:[String(v)],disp:sg(v),exp:[`(${MI}${a})² ＝ ${a*a}`,`${a*a} × (${MI}${b}) ＝ ${sg(v)}（ちがう符号の積は −）`],v:()=>v===(-a)**2*(-b)}}
  if(t===4){const a=ri(r,2,9),b=ri(r,2,9),v=b*b-a*a;return{q:`${MI}${a}² ＋ ${b}² ＝ ？`,a:[String(v)],disp:sg(v),exp:[`${MI}${a}² ＝ ${MI}${a*a}（${a}² に − をつけたもの）`,`${b}² ＝ ${b*b}`,`${sg(-a*a)} ＋ ${b*b} ＝ ${sg(v)}`],v:()=>v===-(a*a)+b*b}}
  if(t===5){const a=ri(r,2,4),v=a**4;return{q:`(${MI}${a})⁴ ＝ ？`,a:[String(v)],disp:String(v),exp:[`(${MI}${a})⁴ ＝ (${MI}${a}) を4回かける`,'マイナスが4個（偶数個）なので答えは ＋',`${a}⁴ ＝ ${v}`],v:()=>v===(-a)**4}}
  const b=ri(r,2,5),v=(-b)**3;return{q:`(${MI}${b})³ ＝ ？`,a:[String(v)],disp:sg(v),exp:[`(${MI}${b})³ ＝ (${MI}${b}) × (${MI}${b}) × (${MI}${b})`,'マイナスが3個（奇数個）なので答えは −',`${b}³ ＝ ${b**3}　→　${sg(v)}`],v:()=>v===(-b)**3};
 }
 const a=ri(r,2,4),b=ri(r,2,5),d=ri(r,2,4),k=ri(r,1,4),c=d*k,v=a*a*b+k;
 return{q:`(${MI}${a})² × ${b} − ${c} ÷ (${MI}${d}) ＝ ？`,a:[String(v)],disp:String(v),exp:[`累乗が先：(${MI}${a})² ＝ ${a*a}　→　${a*a} × ${b} ＝ ${a*a*b}`,`わり算：${c} ÷ (${MI}${d}) ＝ ${MI}${k}`,`ひき算：${a*a*b} − (${MI}${k}) ＝ ${a*a*b} + ${k} ＝ ${v}`],v:()=>v===(-a)**2*b-c/(-d)};
}};
GEN.lit_calc={name:'文字式の計算',f(r,lv){
 let A,B,q,wr,exp;
 if(lv===1){
  const a=rnz(r,-6,6),b=rnz(r,-9,9),c=rnz(r,-6,6),d=rnz(r,-9,9),sub=r()<.5;
  A=sub?a-c:a+c;B=sub?b-d:b+d;q=`(${lin(a,b)}) ${sub?'−':'+'} (${lin(c,d)})`;
  wr=sub?[[a-c,b+d],[a+c,b-d],[a+c,b+d]]:[[a-c,b+d],[a+c,b-d],[a-c,b-d]];
  exp=[sub?'かっこの前が − なので、かっこの中の符号がすべて変わる':'かっこをそのままはずす','x の項：'+((sub?a-c:a+c)===0?'なし（0）':sg(sub?a-c:a+c)+'x')+' ／ 数の項：'+sg(B)];
 }else{
  const a=rnz(r,-5,5),d=rnz(r,lv===3?-5:2,5),b=rnz(r,1,4),e=rnz(r,1,4),c=rnz(r,-6,6),f=rnz(r,-6,6);
  A=a*b-d*e;B=a*c-d*f;
  q=`${sg(a)}(${lin(b,c)}) − ${pr(d)}(${lin(e,f)})`;
  wr=[[a*b+d*e,a*c-d*f],[a*b-d*e,a*c+d*f],[a*b+d*e,a*c+d*f],[a*b-d*e,c-d*f]];
  exp=['分配法則でかっこをはずす：'+lin(a*b,a*c)+'　＋('+lin(-d*e,-d*f)+')','同類項をまとめる：x の項 '+sg(A)+'、数の項 '+sg(B)];
 }
 if(A===0&&B===0)return GEN.lit_calc.f(r,lv);
 const ans=lin(A,B);
 return{q:q+' を計算すると？',ch:uniq4(ans,wr.map(p=>lin(p[0],p[1])),k=>lin(A+(k%2?k:-k),B+(k%3?-k:k))),a:[],disp:ans,exp,v:()=>true};
}};
GEN.lit_value={name:'式の値',f(r,lv){
 if(lv===1){const a=rnz(r,-5,5),b=rnz(r,-9,9),x=rnz(r,-5,5),v=a*x+b;
  return{q:`x ＝ ${sg(x)} のとき、${lin(a,b)} の値は？`,a:[String(v)],disp:sg(v),exp:[`x に ${pr(x)} を入れる：${a}×${pr(x)} ${b<0?'−':'+'} ${Math.abs(b)}`,'＝ '+sg(v)],v:()=>v===a*x+b}}
 if(lv===2){const a=rnz(r,1,4),b=rnz(r,-5,5),x=rnz(r,-4,-1),v=a*x*x+b*x;
  return{q:`x ＝ ${sg(x)} のとき、${q2(a,b,0)} の値は？`,a:[String(v)],disp:sg(v),exp:[`x² は ${pr(x)}² ＝ ${x*x}。x は ${pr(x)}`,`${a}×${x*x} ${b<0?'−':'+'} ${Math.abs(b)}×${pr(x)} ＝ ${a*x*x} ${b*x<0?'−':'+'} ${Math.abs(b*x)} ＝ ${sg(v)}`],v:()=>v===a*x*x+b*x}}
 const p=rnz(r,-4,6),q=rnz(r,1,5),a=rnz(r,-4,4),b=rnz(r,-4,4),v=p*a-q*b;
 return{q:`a ＝ ${sg(a)}、b ＝ ${sg(b)} のとき、${lin(p,0,'a')} − ${q===1?'':q}b の値は？`,a:[String(v)],disp:sg(v),exp:[`a に ${pr(a)}、b に ${pr(b)} を入れる：${p}×${pr(a)} − ${q}×${pr(b)}`,`＝ ${sg(p*a)} − ${pr(q*b)} ＝ ${sg(v)}`],v:()=>v===p*a-q*b};
}};
GEN.lin_eq={name:'一次方程式',f(r,lv){
 const x0=rnz(r,-9,9),ac=[String(x0),'x='+sg(x0)];
 if(lv===1){const a=rnz(r,-8,8),b=rnz(r,-12,12),c=a*x0+b;
  return{q:`${lin(a,b)} ＝ ${sg(c)}　の x は？`,a:ac,disp:'x ＝ '+sg(x0),exp:[`数を右へ移項：${lin(a,0)} ＝ ${sg(c)} − ${pr(b)} ＝ ${sg(c-b)}`,`x ＝ ${sg(c-b)} ÷ ${pr(a)} ＝ ${sg(x0)}`],v:()=>a*x0+b===c}}
 if(lv===2){let a=rnz(r,-6,6),c=rnz(r,-6,6);if(a===c)c=a+1||2;const b=rnz(r,-10,10),d=a*x0+b-c*x0;
  return{q:`${lin(a,b)} ＝ ${lin(c,d)}　の x は？`,a:ac,disp:'x ＝ '+sg(x0),exp:[`x の項を左、数を右に集める：${lin(a-c,0)} ＝ ${sg(d)} − ${pr(b)} ＝ ${sg(d-b)}`,`x ＝ ${sg(d-b)} ÷ ${pr(a-c)} ＝ ${sg(x0)}`],v:()=>a*x0+b===c*x0+d}}
 let a=rnz(r,2,6),c=rnz(r,-5,5);if(a===c)c=a+1;const b=rnz(r,-5,5),d=a*(x0-b)-c*x0;
 return{q:`${a}(x ${b<0?'+':'−'} ${Math.abs(b)}) ＝ ${lin(c,d)}　の x は？`,a:ac,disp:'x ＝ '+sg(x0),exp:[`かっこをはずす：${lin(a,-a*b)} ＝ ${lin(c,d)}`,`x の項を左、数を右へ：${lin(a-c,0)} ＝ ${sg(d)} + ${a*b<0?pr(-a*b):a*b}　→　${lin(a-c,0)} ＝ ${sg(d+a*b)}`,`x ＝ ${sg(d+a*b)} ÷ ${pr(a-c)} ＝ ${sg(x0)}`],v:()=>a*(x0-b)===c*x0+d};
}};
GEN.lin_frac={name:'分数をふくむ方程式',f(r,lv){
 const p=pick(lv===1?[2,3,4]:[2,3,4,5,6],r);let s=pick(lv===1?[2,3,4]:[3,4,5,6],r);if(s===p)s=p+1;
 const L=lcm(p,s),k=rnz(r,-3,3),x0=L*k,a=rnz(r,-5,5),b=x0/p+a-x0/s;
 const t=(c,v)=>c===0?'':(c<0?' − '+Math.abs(c):' + '+c);
 return{q:`x/${p}${t(a)} ＝ x/${s}${t(b)}　の x は？`,a:[String(x0),'x='+sg(x0)],disp:'x ＝ '+sg(x0),exp:[`分母 ${p} と ${s} の最小公倍数 ${L} を両辺にかけて分母をはらう`,`${L/p}x${t(L*a)} ＝ ${L/s}x${t(L*b)}`,`x の項を左、数を右へ：${lin(L/p-L/s,0)} ＝ ${sg(L*b-L*a)}　→　x ＝ ${sg(x0)}`],v:()=>x0/p+a===x0/s+b};
}};
GEN.lin_word={name:'方程式の文章題',f(r,lv){
 const t=lv===1?0:lv===2?1:ri(r,1,2);
 if(t===0){const x0=ri(r,3,12),a=pick([40,50,60,80,100,120,150],r),b=pick([100,150,200,250,300],r),c=a*x0+b;
  return{q:`1個${a}円のりんごを何個か買い、${b}円の箱代も払ったら、合計は${c}円になった。りんごは何個買った？`,a:[String(x0)],unit:'個',disp:x0+'個',exp:[`りんごの数を x 個とすると　${a}x ＋ ${b} ＝ ${c}`,`${a}x ＝ ${c} − ${b} ＝ ${c-b}　→　x ＝ ${x0}`],v:()=>a*x0+b===c}}
 if(t===1){const x0=ri(r,4,15),a=ri(r,2,6),k=ri(r,1,3),c=a+k,tot=k*x0,b=ri(r,1,tot-1),d=tot-b;
  return{q:`みかんを何人かの子どもに配る。1人に${a}個ずつ配ると${b}個あまり、${c}個ずつ配ると${d}個足りない。子どもは何人？`,a:[String(x0)],unit:'人',disp:x0+'人',exp:[`子どもを x 人とする。みかんの数は　${a}x ＋ ${b}　と　${c}x − ${d}`,`${a}x ＋ ${b} ＝ ${c}x − ${d}　→　${k}x ＝ ${b+d}　→　x ＝ ${x0}`],v:()=>a*x0+b===c*x0-d}}
 const x0=ri(r,8,16),a=ri(r,2,6),S=2*x0+a;
 return{q:`兄は弟より${a}歳年上で、2人の年齢の和は${S}歳。弟は何歳？`,a:[String(x0)],unit:'歳',disp:x0+'歳',exp:[`弟を x 歳とすると、兄は x ＋ ${a} 歳　　x ＋ (x ＋ ${a}) ＝ ${S}`,`2x ＝ ${S-a}　→　x ＝ ${x0}`],v:()=>x0+(x0+a)===S};
}};
GEN.sim_add={name:'連立方程式（加減法）',f(r,lv){
 const x0=rnz(r,-6,6),y0=rnz(r,-6,6);let a1,b1,a2,b2,t=0;
 do{
  if(lv===1){b1=rnz(r,1,5);b2=-b1;a1=rnz(r,-5,5)||1;a2=rnz(r,-5,5)||1}
  else if(lv===2){b1=r()<.5?1:-1;b2=rnz(r,2,4)*(r()<.5?1:-1);a1=rnz(r,-5,5)||1;a2=rnz(r,-5,5)||1}
  else{b1=pick([2,3,-2,-3],r);b2=pick([3,4,5,-3,-4,-5],r);a1=rnz(r,-5,5);a2=rnz(r,-5,5)}
 }while(a1*b2-a2*b1===0&&t++<200);
 const c1=a1*x0+b1*y0,c2=a2*x0+b2*y0,L=lcm(b1,b2),m=L/Math.abs(b1),n=L/Math.abs(b2);
 const A1=a1*m,B1=b1*m,C1=c1*m,A2=a2*n,B2=b2*n,C2=c2*n,add=B1+B2===0,X=add?A1+A2:A1-A2,Cx=add?C1+C2:C1-C2;
 const st=[],adj=m!==1||n!==1,e1=adj?'①′':'①',e2=adj?'②′':'②';
 if(adj)st.push(`y の係数の絶対値をそろえる：${[m!==1?'①×'+m:'',n!==1?'②×'+n:''].filter(Boolean).join('、')}　→　①′ ${lxy(A1,B1)} ＝ ${sg(C1)}、②′ ${lxy(A2,B2)} ＝ ${sg(C2)}`);
 st.push(`${e1}と${e2}を${add?'たす':'ひく（'+e1+' − '+e2+'）'}と y が消える：${lin(X,0)} ＝ ${sg(Cx)}　→　x ＝ ${sg(x0)}`);
 st.push(`x ＝ ${sg(x0)} を①に代入すると　y ＝ ${sg(y0)}`);
 return{q:`①　${lxy(a1,b1)} ＝ ${sg(c1)}\n②　${lxy(a2,b2)} ＝ ${sg(c2)}`,a:['x='+sg(x0)+',y='+sg(y0),sg(x0)+','+sg(y0),'('+sg(x0)+','+sg(y0)+')'],unit:'x,y の順に（例 x=3,y=2）',disp:'x ＝ '+sg(x0)+'、y ＝ '+sg(y0),exp:st,v:()=>a1*x0+b1*y0===c1&&a2*x0+b2*y0===c2&&X*x0===Cx&&X!==0};
}};
GEN.sim_sub={name:'連立方程式（代入法）',f(r,lv){
 const x0=rnz(r,-5,5),y0=rnz(r,-6,6);let a,c,d,t=0;
 do{a=rnz(r,-3,3);c=rnz(r,-4,4);d=rnz(r,lv===1?1:-4,4)||1}while(c+d*a===0&&t++<100);
 const b=y0-a*x0,e=c*x0+d*y0,X=c+d*a,Rhs=e-d*b;
 return{q:`①　y ＝ ${lin(a,b)}\n②　${lxy(c,d)} ＝ ${sg(e)}`,a:['x='+sg(x0)+',y='+sg(y0),sg(x0)+','+sg(y0),'('+sg(x0)+','+sg(y0)+')'],unit:'x,y の順に（例 x=3,y=2）',disp:'x ＝ '+sg(x0)+'、y ＝ '+sg(y0),exp:[`①を②の y に代入：${c===0?'':c===1?'x':c===-1?MI+'x':sg(c)+'x'} ${d<0?'−':'+'} ${Math.abs(d)===1?'':Math.abs(d)}(${lin(a,b)}) ＝ ${sg(e)}`,`かっこをはずして整理：${lin(X,0)} ＝ ${sg(Rhs)}　→　x ＝ ${sg(x0)}`,`①に代入して　y ＝ ${sg(y0)}`],v:()=>X*x0===Rhs&&y0===a*x0+b&&c*x0+d*y0===e};
}};
GEN.sim_word={name:'連立方程式の文章題',f(r,lv){
 if(lv===1){const x0=ri(r,8,30),y0=ri(r,2,x0-1),S=x0+y0,D=x0-y0;
  return{q:`2つの数の和は ${S}、差は ${D} です。大きいほうの数は？`,a:[String(x0)],disp:String(x0),exp:[`大きい数を x、小さい数を y とする：x ＋ y ＝ ${S}、x − y ＝ ${D}`,`たすと 2x ＝ ${S+D}　→　x ＝ ${x0}`],v:()=>x0+y0===S&&x0-y0===D}}
 let a1,b1,a2,b2,t=0;
 do{a1=ri(r,1,lv===2?4:7);b1=ri(r,1,lv===2?4:7);a2=ri(r,1,lv===2?4:7);b2=ri(r,1,lv===2?4:7)}while((a1*b2-a2*b1===0||(a1===a2&&b1===b2))&&t++<100);
 const tpl=r()<.5;
 const p=tpl?pick([40,50,60,80,90,100,120],r):pick([500,600,800,1000,1200],r),n=tpl?pick([100,120,150,180,200,250],r):pick([300,400,500,600,700],r);
 const c1=a1*p+b1*n,c2=a2*p+b2*n,askN=r()<.5,nm=tpl?['鉛筆1本','ノート1冊']:['大人1人','子ども1人'];
 const s1=tpl?`鉛筆${a1}本とノート${b1}冊で${c1}円`:`大人${a1}人と子ども${b1}人で${c1}円`,s2=tpl?`鉛筆${a2}本とノート${b2}冊で${c2}円`:`大人${a2}人と子ども${b2}人で${c2}円`;
 const ans=askN?n:p;
 return{q:`${s1}、${s2}です。${nm[askN?1:0]}の値段は？`,a:[String(ans)],unit:'円',disp:ans+'円',exp:[`${nm[0]}を x円、${nm[1]}を y円とする：${lxy(a1,b1)} ＝ ${c1}、${lxy(a2,b2)} ＝ ${c2}`,`加減法で解くと　x ＝ ${p}、y ＝ ${n}`,`答え：${nm[askN?1:0]}は ${ans}円`],v:()=>a1*p+b1*n===c1&&a2*p+b2*n===c2&&a1*b2-a2*b1!==0};
}};
GEN.prop={name:'比例・反比例',f(r,lv){
 if(lv===1||r()<.5){const k=rnz(r,-6,6),x1=rnz(r,1,6),x2=rnz(r,-6,8);
  return{q:`y は x に比例し、x ＝ ${x1} のとき y ＝ ${sg(k*x1)} です。x ＝ ${sg(x2)} のとき y は？`,a:[String(k*x2)],disp:sg(k*x2),exp:[`y ＝ ax とおく。x ＝ ${x1}、y ＝ ${sg(k*x1)} を入れると a ＝ ${sg(k)}`,`y ＝ ${k===1?'':k===-1?MI:sg(k)}x に x ＝ ${sg(x2)} を入れて　y ＝ ${sg(k*x2)}`],v:()=>true}}
 const P=pick([12,18,24,30,36,40,48,60],r),x1=pick([1,2,3,4,6].filter(d=>P%d===0),r),sgn=r()<.5?1:-1,divs=[1,2,3,4,5,6,8,10,12].filter(d=>P%d===0&&d!==x1),x2=pick(divs,r);
 return{q:`y は x に反比例し、x ＝ ${x1} のとき y ＝ ${sg(sgn*P/x1)} です。x ＝ ${x2} のとき y は？`,a:[String(sgn*P/x2)],disp:sg(sgn*P/x2),exp:[`y ＝ a/x とおく。x ＝ ${x1}、y ＝ ${sg(sgn*P/x1)} を入れると a ＝ ${sg(sgn*P)}（xy が一定）`,`x ＝ ${x2} のとき　y ＝ ${sg(sgn*P)} ÷ ${x2} ＝ ${sg(sgn*P/x2)}`],v:()=>true};
}};
GEN.lf_form={name:'一次関数の式',f(r,lv){
 const a=rnz(r,-5,5),b=rnz(r,-8,8),f=(A,B)=>'y ＝ '+lin(A,B);
 if(lv===1)return{q:`グラフが、傾き ${sg(a)}、切片 ${sg(b)} の直線になる一次関数の式は？`,ch:uniq4(f(a,b),[f(b,a),f(-a,b),f(a,-b)],k=>f(a+k,b)),a:[],disp:f(a,b),exp:['y ＝ ax ＋ b の a が傾き、b が切片',`a ＝ ${sg(a)}、b ＝ ${sg(b)} を入れて　${f(a,b)}`],v:()=>true};
 if(lv===2){const p=rnz(r,-4,4),q=a*p+b;
  return{q:`傾きが ${sg(a)} で、点 (${sg(p)}, ${sg(q)}) を通る直線の式は？`,ch:uniq4(f(a,b),[f(a,q),f(a,q+a*p),f(a,-b)],k=>f(a,b+k)),a:[],disp:f(a,b),exp:[`y ＝ ${lin(a,0)} ＋ b に x ＝ ${sg(p)}、y ＝ ${sg(q)} を入れる`,`${sg(q)} ＝ ${pr(a)}×${pr(p)} ＋ b　→　b ＝ ${sg(b)}`,`答え：${f(a,b)}`],v:()=>a*p+b===q};}
 const x1=rnz(r,-3,3);let x2=rnz(r,-3,4);if(x2===x1)x2=x1+2;const y1=a*x1+b,y2=a*x2+b;
 return{q:`2点 (${sg(x1)}, ${sg(y1)})、(${sg(x2)}, ${sg(y2)}) を通る直線の式は？`,ch:uniq4(f(a,b),[f(-a,b),f(a,-b),f(a,y1)],k=>f(a,b+k)),a:[],disp:f(a,b),exp:[`傾き ＝ (${sg(y2)} − ${pr(y1)}) ÷ (${sg(x2)} − ${pr(x1)}) ＝ ${sg(a)}`,`y ＝ ${lin(a,0)} ＋ b に (${sg(x1)}, ${sg(y1)}) を入れて b ＝ ${sg(b)}`,`答え：${f(a,b)}`],v:()=>true};
}};
GEN.lf_rate={name:'変化の割合・増加量',f(r,lv){
 const a=rnz(r,-5,5),b=rnz(r,-6,6),p=rnz(r,-3,2),d=ri(r,2,5),qq=p+d;
 if(lv===1)return{q:`一次関数 y ＝ ${lin(a,b)} の変化の割合は？`,a:[String(a)],disp:sg(a),exp:['一次関数 y ＝ ax ＋ b の変化の割合は、いつも a（傾き）'],v:()=>true};
 if(lv===2)return{q:`一次関数 y ＝ ${lin(a,b)} で、x が ${sg(p)} から ${sg(qq)} まで増加するとき、y の増加量は？`,a:[String(a*d)],disp:sg(a*d),exp:[`x の増加量は ${sg(qq)} − ${pr(p)} ＝ ${d}`,`y の増加量 ＝ 変化の割合 × x の増加量 ＝ ${sg(a)} × ${d} ＝ ${sg(a*d)}`],v:()=>true};
 return{q:`一次関数で、x ＝ ${sg(p)} のとき y ＝ ${sg(a*p+b)}、x ＝ ${sg(qq)} のとき y ＝ ${sg(a*qq+b)} です。変化の割合は？`,a:[String(a)],disp:sg(a),exp:[`変化の割合 ＝ (y の増加量) ÷ (x の増加量)`,`＝ (${sg(a*qq+b)} − ${pr(a*p+b)}) ÷ (${sg(qq)} − ${pr(p)}) ＝ ${sg(a*d)} ÷ ${d} ＝ ${sg(a)}`],v:()=>true};
}};
GEN.lf_cross={name:'2直線の交点',f(r,lv){
 const x0=rnz(r,-5,5);let a1=rnz(r,-4,4),a2=rnz(r,-4,4),t=0;while(a1===a2&&t++<50)a2=rnz(r,-4,4);
 if(lv===3&&a1===-1)a1=2;
 const b1=rnz(r,-6,6),y0=a1*x0+b1,ac=['('+sg(x0)+','+sg(y0)+')',sg(x0)+','+sg(y0)];
 if(lv<3){const b2=y0-a2*x0;
  return{q:`2つの直線　y ＝ ${lin(a1,b1)}　と　y ＝ ${lin(a2,b2)}　の交点の座標は？`,a:ac,unit:'(x, y) の形で',disp:`(${sg(x0)}, ${sg(y0)})`,exp:['交点の座標は、2つの式を同時に満たす（連立方程式の解）',`${lin(a1,b1)} ＝ ${lin(a2,b2)} を解いて　x ＝ ${sg(x0)}`,`y ＝ ${lin(a1,b1)} に入れて　y ＝ ${sg(y0)}`],v:()=>a1*x0+b1===a2*x0+b2}}
 const c2=x0+y0;
 return{q:`2つの直線　y ＝ ${lin(a1,b1)}　と　x ＋ y ＝ ${sg(c2)}　の交点の座標は？`,a:ac,unit:'(x, y) の形で',disp:`(${sg(x0)}, ${sg(y0)})`,exp:[`y ＝ ${lin(a1,b1)} を x ＋ y ＝ ${sg(c2)} に代入：x ＋ (${lin(a1,b1)}) ＝ ${sg(c2)}`,`${lin(1+a1,0)} ＝ ${sg(c2-b1)}　→　x ＝ ${sg(x0)}`,`y ＝ ${sg(y0)}`],v:()=>1+a1!==0&&x0+a1*x0+b1===c2};
}};
