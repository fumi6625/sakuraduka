/* ===== 理科の計算ドリル（自動生成・無限）===== */
const nf=x=>String(+(+x).toFixed(4));
GEN.ohm={name:'オームの法則',subj:'理',f(r,lv){
 const Rs=[5,10,15,20,25,30,40,50],It=ri(r,1,10),R=pick(Rs,r),I=It/10,V=It*R/10;
 if(lv===1){const t=ri(r,0,2);
  if(t===0)return{q:`抵抗 ${R}Ω の電熱線に ${nf(I)}A の電流が流れた。加えた電圧は？`,a:[nf(V)],unit:'V',disp:nf(V)+'V',exp:['オームの法則　V ＝ I × R',`${nf(I)} × ${R} ＝ ${nf(V)}`],v:()=>Math.abs(I*R-V)<1e-9};
  if(t===1)return{q:`抵抗 ${R}Ω の電熱線に ${nf(V)}V の電圧を加えた。流れる電流は？`,a:[nf(I)],unit:'A',disp:nf(I)+'A',exp:['オームの法則　I ＝ V ÷ R',`${nf(V)} ÷ ${R} ＝ ${nf(I)}`],v:()=>Math.abs(V/R-I)<1e-9};
  return{q:`電熱線に ${nf(V)}V の電圧を加えると ${nf(I)}A の電流が流れた。電熱線の抵抗は？`,a:[String(R)],unit:'Ω',disp:R+'Ω',exp:['オームの法則　R ＝ V ÷ I',`${nf(V)} ÷ ${nf(I)} ＝ ${R}`],v:()=>Math.abs(V/I-R)<1e-9}}
 if(lv===2){const P=[[20,30,12],[30,60,20],[10,40,8],[15,60,12],[20,20,10],[30,30,15],[60,60,30],[12,6,4],[40,40,20],[10,15,6]];
  if(r()<.5){const a=pick(Rs,r),b=pick(Rs,r);return{q:`${a}Ω と ${b}Ω の抵抗を直列につないだ。全体の抵抗は？`,a:[String(a+b)],unit:'Ω',disp:(a+b)+'Ω',exp:['直列つなぎの全体の抵抗は、和になる',`${a} ＋ ${b} ＝ ${a+b}`],v:()=>true}}
  const p=pick(P,r);return{q:`${p[0]}Ω と ${p[1]}Ω の抵抗を並列につないだ。全体の抵抗は？`,a:[String(p[2])],unit:'Ω',disp:p[2]+'Ω',exp:['並列つなぎ：1/R ＝ 1/R₁ ＋ 1/R₂（または R ＝ R₁R₂ ÷ (R₁＋R₂)）',`${p[0]}×${p[1]} ÷ (${p[0]}＋${p[1]}) ＝ ${p[0]*p[1]} ÷ ${p[0]+p[1]} ＝ ${p[2]}`],v:()=>p[0]*p[1]/(p[0]+p[1])===p[2]}}
 if(r()<.5){let a,b,Vv,tt=0;do{a=pick(Rs,r);b=pick(Rs,r);Vv=ri(r,2,12)*3}while(!Number.isInteger(Vv*10/(a+b))&&tt++<200);
  const Ie=Vv/(a+b);return{q:`${nf(Vv)}V の電源に ${a}Ω と ${b}Ω の抵抗を直列につないだ。回路を流れる電流は？`,a:[nf(Ie)],unit:'A',disp:nf(Ie)+'A',exp:[`全体の抵抗 ＝ ${a} ＋ ${b} ＝ ${a+b}Ω`,`I ＝ V ÷ R ＝ ${nf(Vv)} ÷ ${a+b} ＝ ${nf(Ie)}`],v:()=>Math.abs(Math.round(Ie*10)/10-Ie)<1e-9}}
 const P=[[20,30,12],[30,60,20],[10,40,8],[15,60,12],[20,20,10],[30,30,15]];let p,Vv,tt=0;
 do{p=pick(P,r);Vv=pick([6,12,24,30,36,60],r)}while(!Number.isInteger(Vv/p[2]*10)&&tt++<200);
 const It2=Vv/p[2];return{q:`${Vv}V の電源に ${p[0]}Ω と ${p[1]}Ω の抵抗を並列につないだ。電源から流れ出る全体の電流は？`,a:[nf(It2)],unit:'A',disp:nf(It2)+'A',exp:[`並列の全体の抵抗 ＝ ${p[0]}×${p[1]} ÷ ${p[0]+p[1]} ＝ ${p[2]}Ω`,`I ＝ ${Vv} ÷ ${p[2]} ＝ ${nf(It2)}`,`（別解：${nf(Vv/p[0])}A ＋ ${nf(Vv/p[1])}A ＝ ${nf(It2)}A）`],v:()=>Math.abs(Math.round(It2*10)/10-It2)<1e-9&&Math.abs(Vv/p[0]+Vv/p[1]-It2)<1e-9};
}};
GEN.power={name:'電力・電力量',subj:'理',f(r,lv){
 if(lv===1){const I=pick([0.5,1,1.5,2,3,5,8,10],r),P=100*I;return{q:`100V の電源につなぐと ${nf(I)}A の電流が流れる電気器具の消費電力は？`,a:[nf(P)],unit:'W',disp:nf(P)+'W',exp:['電力（W）＝ 電圧（V）× 電流（A）',`100 × ${nf(I)} ＝ ${nf(P)}`],v:()=>true}}
 if(lv===2){if(r()<.5){const P=pick([300,500,600,800,1000,1200],r),t=ri(r,2,10),J=P*60*t;return{q:`${P}W の電熱器を ${t}分間使ったときに発生する熱量は？`,a:[String(J)],unit:'J',disp:J+'J',exp:['熱量（J）＝ 電力（W）× 時間（秒）',`${t}分 ＝ ${60*t}秒　→　${P} × ${60*t} ＝ ${J}`],v:()=>true}}
  const P=pick([100,200,500,800,1000,1500,2000],r),h=ri(r,2,6),k=P*h/1000;return{q:`${P}W の電気器具を ${h}時間使ったときの電力量は？`,a:[nf(k)],unit:'kWh',disp:nf(k)+'kWh',exp:['電力量（kWh）＝ 電力（kW）× 時間（h）',`${P}W ＝ ${nf(P/1000)}kW　→　${nf(P/1000)} × ${h} ＝ ${nf(k)}`],v:()=>true}}
 const P=pick([200,500,800,1000],r),W=pick([2,3,5],r)*P*10,t=W/P;
 return{q:`消費電力 ${P}W の電気器具が、ある時間に ${W}J の電気エネルギーを使った。何秒間使った？`,a:[String(t)],unit:'秒',disp:t+'秒',exp:['電力量（J）＝ 電力（W）× 時間（秒）より、時間 ＝ 電力量 ÷ 電力',`${W} ÷ ${P} ＝ ${t}`],v:()=>P*t===W};
}};
GEN.dens={name:'密度',subj:'理',f(r,lv){
 const rho10=pick([8,9,10,27,79,89,113,193],r),V=pick([10,20,50,100],r),m=rho10*V/10,rho=rho10/10;
 if(lv===1)return{q:`体積 ${V}cm³ で質量 ${m}g の物質の密度は？`,a:[nf(rho)],unit:'g/cm³',disp:nf(rho)+'g/cm³',exp:['密度（g/cm³）＝ 質量（g）÷ 体積（cm³）',`${m} ÷ ${V} ＝ ${nf(rho)}`],v:()=>true};
 if(lv===2)return{q:`密度 ${nf(rho)}g/cm³ の金属が ${V}cm³ ある。質量は？`,a:[String(m)],unit:'g',disp:m+'g',exp:['質量 ＝ 密度 × 体積',`${nf(rho)} × ${V} ＝ ${m}`],v:()=>true};
 return{q:`密度 ${nf(rho)}g/cm³ の金属の質量が ${m}g のとき、体積は？`,a:[String(V)],unit:'cm³',disp:V+'cm³',exp:['体積 ＝ 質量 ÷ 密度',`${m} ÷ ${nf(rho)} ＝ ${V}`],v:()=>true};
}};
GEN.press={name:'圧力',subj:'理',f(r,lv){
 const S=pick([0.1,0.2,0.25,0.5,2,4],r),Pa=pick([20,40,50,100,200,400],r),F=Pa*S;
 if(lv===1&&Number.isInteger(F))return{q:`${nf(F)}N の力が ${nf(S)}m² の面積にはたらくとき、圧力は？`,a:[String(Pa)],unit:'Pa',disp:Pa+'Pa',exp:['圧力（Pa）＝ 力（N）÷ 面積（m²）',`${nf(F)} ÷ ${nf(S)} ＝ ${Pa}`],v:()=>true};
 if(lv<=2&&Number.isInteger(F))return{q:`圧力 ${Pa}Pa が、面積 ${nf(S)}m² の面にはたらいている。この面を押す力は？`,a:[String(F)],unit:'N',disp:F+'N',exp:['力（N）＝ 圧力（Pa）× 面積（m²）',`${Pa} × ${nf(S)} ＝ ${nf(F)}`],v:()=>true};
 const m=pick([2,3,5,6,10],r),S2=pick([0.5,2,4,5],r),p=10*m/S2;
 return{q:`質量 ${m}kg の物体を、面積 ${nf(S2)}m² の面を下にして床に置いた。床にはたらく圧力は？（100gの物体にはたらく重力を1Nとする）`,a:[nf(p)],unit:'Pa',disp:nf(p)+'Pa',exp:[`${m}kg の重さ ＝ ${10*m}N`,`圧力 ＝ ${10*m} ÷ ${nf(S2)} ＝ ${nf(p)}`],v:()=>true};
}};
GEN.speed={name:'速さ',subj:'理',f(r,lv){
 if(lv===1){const t=ri(r,2,10),v=ri(r,2,15);return{q:`${v*t}m を ${t}秒で進んだ。速さは？`,a:[String(v)],unit:'m/s',disp:v+'m/s',exp:['速さ ＝ 距離 ÷ 時間',`${v*t} ÷ ${t} ＝ ${v}`],v:()=>true}}
 if(lv===2){const k=ri(r,1,8);if(r()<.5)return{q:`時速 ${18*k}km は、秒速何m？`,a:[String(5*k)],unit:'m/s',disp:5*k+'m/s',exp:['1km ＝ 1000m、1時間 ＝ 3600秒','km/h を 3.6 でわると m/s',`${18*k} ÷ 3.6 ＝ ${5*k}`],v:()=>true};
  return{q:`秒速 ${5*k}m は、時速何km？`,a:[String(18*k)],unit:'km/h',disp:18*k+'km/h',exp:['m/s に 3.6 をかけると km/h',`${5*k} × 3.6 ＝ ${18*k}`],v:()=>true}}
 const v=ri(r,2,12),t=ri(r,2,8);return{q:`秒速 ${v}m で ${t}分間進むと、進んだ距離は？`,a:[String(v*60*t)],unit:'m',disp:v*60*t+'m',exp:['距離 ＝ 速さ × 時間（単位をそろえる）',`${t}分 ＝ ${60*t}秒　→　${v} × ${60*t} ＝ ${v*60*t}`],v:()=>true};
}};
GEN.conc={name:'濃度',subj:'理',f(r,lv){
 if(lv<3){const p=pick([5,10,15,20,25,30],r),T=pick([100,200,300,400,500],r),s=p*T/100,w=T-s;
  if(lv===1||r()<.5)return{q:`水 ${w}g に食塩 ${s}g を溶かした。質量パーセント濃度は？`,a:[String(p)],unit:'%',disp:p+'%',exp:['濃度（%）＝ 溶質の質量 ÷ 溶液の質量 × 100','溶液の質量 ＝ 水 ＋ 食塩 ＝ '+w+' ＋ '+s+' ＝ '+T,`${s} ÷ ${T} × 100 ＝ ${p}`],v:()=>true};
  return{q:`濃度 ${p}% の食塩水 ${T}g に溶けている食塩は何g？`,a:[String(s)],unit:'g',disp:s+'g',exp:['溶質 ＝ 溶液の質量 × 濃度/100',`${T} × ${p}/100 ＝ ${s}`],v:()=>true}}
 const D=[[20,20,10],[30,30,20],[10,10,5],[40,20,10],[15,15,10],[30,15,10]],d=pick(D,r),s=d[0],T=s*100/d[1],T2=s*100/d[2];
 return{q:`濃度 ${d[1]}% の食塩水 ${T}g に水を加えて、濃度 ${d[2]}% にしたい。加える水は何g？`,a:[String(T2-T)],unit:'g',disp:(T2-T)+'g',exp:[`食塩の質量は変わらない：${T} × ${d[1]}/100 ＝ ${s}g`,`${d[2]}% の食塩水の質量 ＝ ${s} ÷ ${d[2]}/100 ＝ ${T2}g`,`加える水 ＝ ${T2} − ${T} ＝ ${T2-T}g`],v:()=>true};
}};
GEN.work={name:'仕事と仕事率',subj:'理',f(r,lv){
 if(lv===1){const F=pick([2,5,10,20,30,50],r),s=ri(r,2,10);return{q:`${F}N の力で物体を力の向きに ${s}m 動かした。この力がした仕事は？`,a:[String(F*s)],unit:'J',disp:F*s+'J',exp:['仕事（J）＝ 力（N）× 力の向きに動かした距離（m）',`${F} × ${s} ＝ ${F*s}`],v:()=>true}}
 if(lv===2){const W=pick([60,120,200,300,600],r),t=pick([2,3,4,5,10],r);return{q:`${W*t}J の仕事を ${t}秒でした。仕事率は？`,a:[String(W)],unit:'W',disp:W+'W',exp:['仕事率（W）＝ 仕事（J）÷ 時間（秒）',`${W*t} ÷ ${t} ＝ ${W}`],v:()=>true}}
 const F=2*ri(r,2,15),h=ri(r,1,5);
 if(r()<.5)return{q:`動滑車を使って、重さ ${F}N の物体を ${h}m 持ち上げる。ひもを引く力は？（滑車・ひもの重さは無視）`,a:[String(F/2)],unit:'N',disp:F/2+'N',exp:['動滑車を使うと、引く力は物体の重さの半分'],v:()=>true};
 return{q:`動滑車を使って、物体を ${h}m 持ち上げる。ひもを引く距離は？`,a:[String(2*h)],unit:'m',disp:2*h+'m',exp:['動滑車では、力が半分になるかわりに、ひもを引く距離は2倍','仕事の大きさは変わらない（仕事の原理）'],v:()=>true};
}};
GEN.hooke={name:'ばねの力',subj:'理',f(r,lv){
 const a=pick([1,1.5,2,2.5,4,5],r),F=ri(r,2,8),ex=a*F;
 if(lv===1)return{q:`1N の力を加えると ${nf(a)}cm のびるばねがある。${F}N の力を加えると、ばねののびは？`,a:[nf(ex)],unit:'cm',disp:nf(ex)+'cm',exp:['ばねののびは、加えた力に比例する（フックの法則）',`${nf(a)} × ${F} ＝ ${nf(ex)}`],v:()=>true};
 if(lv===2)return{q:`1N の力で ${nf(a)}cm のびるばねが ${nf(ex)}cm のびているとき、加えている力は？`,a:[String(F)],unit:'N',disp:F+'N',exp:['のび ÷ 1Nあたりののび ＝ 力',`${nf(ex)} ÷ ${nf(a)} ＝ ${F}`],v:()=>true};
 const L=pick([10,12,15,20],r);
 return{q:`自然の長さが ${L}cm で、1N の力で ${nf(a)}cm のびるばねに ${F}N の力を加えた。ばね全体の長さは？`,a:[nf(L+ex)],unit:'cm',disp:nf(L+ex)+'cm',exp:[`のび ＝ ${nf(a)} × ${F} ＝ ${nf(ex)}cm`,`全体の長さ ＝ 自然の長さ ＋ のび ＝ ${L} ＋ ${nf(ex)} ＝ ${nf(L+ex)}`],v:()=>true};
}};
GEN.chem_ratio={name:'化学変化の質量比',subj:'理',f(r,lv){
 if(lv===1){const k=ri(r,2,6),m=4*k;return{q:`銅と酸素は 4：1 の質量の比で結びつく。銅 ${m}g を完全に酸化させると、できる酸化銅は何g？`,a:[String(5*k)],unit:'g',disp:5*k+'g',exp:[`銅 ${m}g と結びつく酸素 ＝ ${m} × 1/4 ＝ ${k}g`,`酸化銅 ＝ ${m} ＋ ${k} ＝ ${5*k}g`],v:()=>true}}
 if(lv===2){const k=ri(r,1,5),m=3*k;return{q:`マグネシウムと酸素は 3：2 の質量の比で結びつく。マグネシウム ${m}g を完全に燃やしたとき、結びつく酸素は何g？`,a:[String(2*k)],unit:'g',disp:2*k+'g',exp:[`マグネシウム：酸素 ＝ 3：2`,`${m} ÷ 3 × 2 ＝ ${2*k}`],v:()=>true}}
 const k=ri(r,1,4),m=7*k;return{q:`鉄と硫黄は 7：4 の質量の比で過不足なく反応する。鉄 ${m}g と過不足なく反応する硫黄は何g？`,a:[String(4*k)],unit:'g',disp:4*k+'g',exp:[`鉄：硫黄 ＝ 7：4`,`${m} ÷ 7 × 4 ＝ ${4*k}`],v:()=>true};
}};
GEN.buoy={name:'浮力',subj:'理',f(r,lv){
 const w=ri(r,3,12)/2*2,b=ri(r,1,Math.floor(w)-1);
 if(lv===1)return{q:`空気中で ${w}N のおもりを水中に入れたら、ばねばかりは ${w-b}N を示した。おもりにはたらく浮力は？`,a:[String(b)],unit:'N',disp:b+'N',exp:['浮力 ＝ 空気中での重さ − 水中でのばねばかりの値',`${w} − ${w-b} ＝ ${b}`],v:()=>true};
 if(lv===2)return{q:`空気中で ${w}N のおもりに、水中で ${b}N の浮力がはたらく。水中でのばねばかりの値は？`,a:[String(w-b)],unit:'N',disp:w-b+'N',exp:['水中での値 ＝ 空気中での重さ − 浮力',`${w} − ${b} ＝ ${w-b}`],v:()=>true};
 return{q:`重さ ${w}N の物体が水に浮いて静止している。この物体にはたらく浮力は？`,a:[String(w)],unit:'N',disp:w+'N',exp:['浮いて静止しているとき、重力と浮力はつり合っている','浮力 ＝ 重さ'],v:()=>true};
}};
