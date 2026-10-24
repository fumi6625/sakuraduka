/* 月ごとのカリキュラム：ロードマップの「教科のフォーカス」を、毎日の教材につなぐ表。
   m=今日のテーマ（算数ジェネレータ）／rv=ふくしゅう計算／w=応用・文章題（速さ・割合・単位量あたりなど）／s=理科の計算
   g=英語の表現のタグ／sc=理科のタグ／so=社会のタグ／jk=漢字の学年（'小5'・'小6'）
   2026-10〜2027-03＝5年の2・3学期（＋1学期の復習）、2027-04〜2028-02＝6年（学期の順）、2027-08・2028-01〜02＝5・6年の総復習 */
const MATH_ALL=['dec_mul','dec_div','vol','angle','multiple','frac_add','frac_dec','avg','per_unit','speed','area','percent','circle_len','frac_mul','frac_div','frac_mix','letter_x','ratio','circle_area','prism_vol','prop_inv','comb','scale','stat6'];
const SCI_ALL=['pendulum','dissolve','lever'];
const CUR=[
 {from:'2026-10',m:['dec_div','dec_mul','angle','multiple'],rv:['dec_mul','vol','area'],w:['per_unit','speed'],s:['pendulum','dissolve'],g:['あいさつ・自己紹介','好きなもの','できること'],sc:['地学/天気','生物/発芽と成長','生物/メダカ'],so:['地理/国土','地理/気候'],jk:['小5']},
 {from:'2026-11',m:['angle','multiple','dec_div','frac_add'],rv:['dec_mul','dec_div','vol'],w:['per_unit','percent'],s:['pendulum','dissolve'],g:['できること','誕生日・月日','好きなもの'],sc:['生物/メダカ','生物/花と実','地学/天気'],so:['地理/気候','地理/農業','地理/水産業'],jk:['小5']},
 {from:'2026-12',m:['frac_add','frac_dec','multiple','avg'],rv:['dec_div','angle','multiple'],w:['per_unit','avg'],s:['pendulum','dissolve'],g:['誕生日・月日','時間と日課','できること'],sc:['生物/人のたんじょう','物理/ふりこ','地学/流れる水'],so:['地理/農業','地理/水産業','地理/工業'],jk:['小5']},
 {from:'2027-01',m:['avg','per_unit','frac_add','speed'],rv:['frac_add','frac_dec','angle'],w:['speed','per_unit'],s:['pendulum','dissolve'],g:['時間と日課','行きたい所・したいこと','道案内'],sc:['地学/流れる水','化学/とけ方','物理/ふりこ'],so:['地理/工業','地理/情報','地理/環境と災害'],jk:['小5']},
 {from:'2027-02',m:['speed','percent','per_unit','area'],rv:['avg','per_unit','frac_add'],w:['percent','speed'],s:['pendulum','dissolve'],g:['道案内','注文・ねだん','人の紹介'],sc:['化学/とけ方','物理/ふりこ','物理/電磁石'],so:['地理/環境と災害','地理/情報','地理/国土'],jk:['小5']},
 {from:'2027-03',m:['percent','area','circle_len','frac_dec'],rv:['speed','avg','dec_div'],w:['percent','per_unit'],s:['pendulum','dissolve'],g:['注文・ねだん','人の紹介','道案内'],sc:['物理/電磁石','物理/ふりこ','化学/とけ方'],so:['地理/国土','地理/気候','地理/農業','地理/工業'],jk:['小5']},
 {from:'2027-04',m:['frac_mul','letter_x','frac_dec'],rv:['frac_add','dec_div','area'],w:['percent','speed'],s:['pendulum','lever'],g:['町・地域','人の紹介'],sc:['化学/燃焼','生物/人の体'],so:['公民/憲法','歴史/古代'],jk:['小5','小6']},
 {from:'2027-05',m:['frac_mul','frac_div','letter_x'],rv:['frac_add','frac_dec','percent'],w:['per_unit','percent'],s:['lever','dissolve'],g:['町・地域','過去のできごと'],sc:['生物/人の体','物理/てこ'],so:['公民/憲法','公民/政治','歴史/古代'],jk:['小5','小6']},
 {from:'2027-06',m:['frac_div','frac_mix','letter_x'],rv:['frac_mul','speed','percent'],w:['speed','percent'],s:['lever','pendulum'],g:['過去のできごと','将来の夢'],sc:['生物/植物の養分と水','物理/てこ'],so:['歴史/古代','歴史/中世'],jk:['小6']},
 {from:'2027-07',m:['frac_mix','frac_div','letter_x','ratio'],rv:['frac_mul','frac_div','area'],w:['percent','per_unit'],s:['lever','dissolve'],g:['将来の夢','過去のできごと'],sc:['生物/生物と環境','生物/植物の養分と水'],so:['歴史/中世','歴史/近世'],jk:['小6']},
 {from:'2027-08',m:MATH_ALL,rv:MATH_ALL,w:['speed','percent','per_unit'],s:SCI_ALL,g:[],sc:[],so:[],jk:['小5','小6']},
 {from:'2027-09',m:['ratio','scale','frac_mix'],rv:['frac_div','letter_x','percent'],w:['percent','speed'],s:['lever','pendulum'],g:['思い出','将来の夢'],sc:['地学/月と太陽','地学/大地のつくり'],so:['歴史/近世','歴史/近代'],jk:['小6']},
 {from:'2027-10',m:['circle_area','prism_vol','scale'],rv:['ratio','frac_div','area'],w:['percent','speed'],s:['lever','dissolve'],g:['思い出','中学校でしたいこと'],sc:['地学/大地のつくり','物理/電気の利用'],so:['歴史/近代','歴史/現代'],jk:['小6']},
 {from:'2027-11',m:['prop_inv','prism_vol','circle_area'],rv:['ratio','scale','frac_mix'],w:['per_unit','speed'],s:['lever','pendulum'],g:['中学校でしたいこと','思い出'],sc:['物理/電気の利用','化学/水溶液'],so:['歴史/現代','国際/世界と日本'],jk:['小6']},
 {from:'2027-12',m:['prop_inv','comb','stat6'],rv:['circle_area','prism_vol','ratio'],w:['percent','per_unit'],s:['lever','dissolve'],g:['中学校でしたいこと','思い出'],sc:['化学/水溶液','物理/てこ'],so:['国際/世界と日本','公民/政治'],jk:['小6']},
 {from:'2028-01',m:MATH_ALL,rv:MATH_ALL,w:['speed','percent','per_unit'],s:SCI_ALL,g:[],sc:[],so:[],jk:['小5','小6']},
 {from:'2028-02',m:MATH_ALL,rv:MATH_ALL,w:['speed','percent','per_unit'],s:SCI_ALL,g:[],sc:[],so:[],jk:['小5','小6']}
];
