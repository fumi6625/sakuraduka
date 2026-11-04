/* 月ごとのカリキュラム：ロードマップの「教科のフォーカス」を、毎日の教材につなぐ表。
   m=今日のテーマ（数学ジェネレータ）／rv=ふくしゅう計算／w=応用・文章題／s=理科の計算
   g=英文法のタグ／sc=理科のタグ／so=社会のタグ／jk=漢字の難しさ */
const MATH_ALL=['pn_mul','lit_calc','lin_eq','sim_add','lf_cross','geo_tri','prob','expand','factor','quad_eq','sqrt'];
const SCI_ALL=['ohm','power','dens','press','speed','conc','work','hooke','chem_ratio','buoy'];
const CUR=[
 {from:'2026-10',m:['pn_add','lit_calc','lin_eq','sim_add','prop'],rv:['pn_mul','lit_value','lin_eq'],w:['lin_word','sim_word'],s:['ohm','dens','speed'],g:['不定詞','動名詞','比較','受け身'],sc:['化学','物理/電流'],so:['歴史/中世','歴史/近世','地理/日本'],jk:['基本']},
 {from:'2026-11',m:['sim_add','sim_sub','sim_word','lf_form','lf_rate'],rv:['lin_eq','lit_calc','pn_add'],w:['sim_word','lin_word'],s:['ohm','power','chem_ratio'],g:['不定詞','動名詞','比較','受け身','接続詞'],sc:['化学/化学変化','物理/電流'],so:['歴史/中世','歴史/近世'],jk:['基本','標準']},
 {from:'2026-12',m:['lf_form','lf_rate','lf_cross','sim_word','lit_calc'],rv:['sim_add','sim_sub','lin_eq'],w:['sim_word','lin_word'],s:['ohm','power','press'],g:['受け身','接続詞','助動詞','比較'],sc:['物理','化学'],so:['歴史/近世','歴史/近代'],jk:['標準']},
 {from:'2027-01',m:['pn_add','pn_mul','lit_calc','lit_value','lin_eq','lin_frac','prop'],rv:['sim_add','lf_form'],w:['lin_word'],s:['dens','speed','conc'],g:['be・一般動詞','疑問・否定','過去','進行形','未来','助動詞','代名詞'],sc:['生物','地学/天気'],so:['地理/世界','地理/日本'],jk:['基本']},
 {from:'2027-02',m:['geo_tri','geo_poly','prob','stat','lf_cross'],rv:['sim_add','lin_eq','lf_form'],w:['sim_word','prob'],s:['press','work','hooke'],g:['不定詞','動名詞','比較','受け身','前置詞'],sc:['生物','化学/化学変化','物理/電流'],so:['歴史/近代','地理/日本'],jk:['標準']},
 {from:'2027-03',m:['expand','factor','sqrt','sim_word','prob'],rv:['geo_tri','lf_cross','lin_eq'],w:['sim_word','prob'],s:['ohm','conc','work'],g:['現在完了','関係代名詞','その他'],sc:['化学','物理'],so:['歴史/近代','歴史/現代'],jk:['標準']},
 {from:'2027-04',m:['expand','factor','sqrt','pn_mul','lit_calc'],rv:['sim_add','lf_cross','geo_poly'],w:['sim_word'],s:['work','buoy','speed'],g:['現在完了','関係代名詞','その他','不定詞'],sc:['物理/運動','生物/細胞'],so:['歴史/現代','公民/政治'],jk:['標準','発展']},
 {from:'2027-05',m:['sqrt','quad_eq','expand','factor','lf_cross'],rv:['sim_add','prob','geo_tri'],w:['sim_word','lin_word'],s:['work','speed','hooke'],g:['関係代名詞','現在完了','その他'],sc:['物理/運動','化学/イオン'],so:['公民/政治','公民/経済'],jk:['標準','発展']},
 {from:'2027-06',m:['quad_eq','quad_fn','sqrt','factor','prob'],rv:['expand','lf_cross','sim_add'],w:['sim_word','prob'],s:['conc','chem_ratio','ohm'],g:['関係代名詞','現在完了','その他'],sc:['化学/イオン','生物/遺伝'],so:['公民/経済','公民/国際'],jk:['標準','発展']},
 {from:'2027-07',m:['quad_eq','quad_fn','factor','stat','prob'],rv:['sqrt','expand','lf_cross'],w:['sim_word','prob'],s:['ohm','power','work'],g:['その他','現在完了'],sc:['物理','化学'],so:['公民','歴史'],jk:['発展']},
 {from:'2027-08',m:MATH_ALL,rv:MATH_ALL,w:['sim_word','prob'],s:SCI_ALL,g:[],sc:[],so:[],jk:['標準','発展']},
 {from:'2027-09',m:['pythag','similar','circle_ang','quad_fn','area_vol'],rv:['quad_eq','factor','sqrt','lf_cross'],w:['sim_word','prob'],s:['ohm','power','press','work','buoy'],g:['その他'],sc:['生物/遺伝','地学/天体','物理/運動'],so:['公民','歴史/現代'],jk:['発展']},
 {from:'2027-10',m:['pythag','similar','circle_ang','area_vol','prob','stat'],rv:['quad_eq','quad_fn','factor'],w:['sim_word','prob'],s:SCI_ALL,g:[],sc:[],so:[],jk:['発展']},
 {from:'2027-11',m:['quad_eq','quad_fn','lf_cross','sim_word','prob','pythag','similar','area_vol','geo_poly','expand','factor','sqrt'],rv:MATH_ALL,w:['sim_word','prob'],s:SCI_ALL,g:[],sc:[],so:[],jk:['発展']}
];
