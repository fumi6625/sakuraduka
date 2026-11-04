/* ===== 状態（localStorageに保存） ===== */
const KEY='manabiQuest.v1';
let memStore=null;
const ls={get(){try{return localStorage.getItem(KEY)}catch(e){return memStore}},set(v){memStore=v;try{localStorage.setItem(KEY,v)}catch(e){}}};
const DEF={nick:'',team:'pink',sound:1,exam:'2028-03-01',xp:0,coin:0,streak:0,best:0,last:'',freeze:1,
 days:{},ms:{},mc:{},got:{},mrw:{},nai:{gk:70,set:0},diag:{},badges:{},shop:null,gacha:null,
 wk:{},memo:['','',''],tab:'home',sj:'数',dg:'国',srs:{},gx:{},gs:{},light:{},refl:{},rt:null,tot:{n:0,ok:0},rlog:[],tier:'auto',start:'',pin:'',pinOn:0,pinSkip:'',tf:{n:0,ok:0},at:'',subLast:{},sw:{},kh:{},tl:[],theme:'normal',flowAuto:1,pinFail:{n:0,until:0}};
const fresh=()=>{const o=JSON.parse(JSON.stringify(DEF));o.shop=SHOP0.map(x=>({n:x[0],c:x[1]}));o.gacha=GACHA0.slice();return o};
const norm=o=>{o=o||{};const r=Object.assign(fresh(),o);r.nai=Object.assign({},DEF.nai,o.nai);r.tot=Object.assign({n:0,ok:0},o.tot);r.tf=Object.assign({n:0,ok:0},o.tf);r.pinFail=Object.assign({n:0,until:0},o.pinFail);if(!r.shop)r.shop=fresh().shop;if(!r.gacha)r.gacha=fresh().gacha;return r};
let S;
try{S=norm(JSON.parse(ls.get()||'{}'))}catch(e){S=fresh()}
const save=()=>ls.set(JSON.stringify(S));
/* バックアップには、暗証番号（pin・pinOn・pinSkip）を入れない（文字列を読まれて、暗証番号がわかってしまわないように）。復元しても、いまの端末の暗証番号はそのまま */
const backupObj=()=>{const o=JSON.parse(JSON.stringify(S));delete o.pin;delete o.pinOn;delete o.pinSkip;delete o.pinFail;return o};
const restoreFrom=o=>{const k={pin:S.pin,pinOn:S.pinOn,pinSkip:S.pinSkip,pinFail:S.pinFail};S=norm(Object.assign({},o,k));return S};
let saveT=null;
const saveSoon=()=>{clearTimeout(saveT);saveT=setTimeout(save,300)};
const flushSave=()=>{if(saveT){clearTimeout(saveT);saveT=null}save()};
const blankDay=()=>({stg:{},min:{},ok:0,full:0,n:0,c:0,dx:0});
const dayRec=(d=today())=>S.days[d]||(S.days[d]=blankDay());
const peekDay=(d=today())=>S.days[d]||blankDay();
