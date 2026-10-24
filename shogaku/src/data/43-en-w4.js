/* 英単語（小学校） 書式：英語|日本語|品詞 */
let RAW_EW=`
#4
job|仕事|n
doctor|医者|n
nurse|看護師|n
dentist|歯医者|n
vet|獣医|n
scientist|科学者|n
astronaut|宇宙飛行士|n
pilot|パイロット|n
singer|歌手|n
dancer|ダンサー|n
artist|芸術家|n
writer|作家|n
actor|俳優|n
comedian|お笑い芸人|n
baker|パン屋さん|n
chef|シェフ|n
farmer|農家|n
fisherman|漁師|n
florist|花屋さん|n
carpenter|大工|n
firefighter|消防士|n
police officer|警察官|n
bus driver|バスの運転手|n
soccer player|サッカー選手|n
baseball player|野球選手|n
designer|デザイナー|n
programmer|プログラマー|n
engineer|技術者|n
fashion designer|ファッションデザイナー|n
cartoonist|漫画家|n
announcer|アナウンサー|n
flight attendant|客室乗務員|n
zookeeper|動物園の飼育員|n
dream|夢|n
future|未来|n
memory|思い出|n
trip|旅行|n
school trip|修学旅行|n
field trip|遠足|n
sports day|運動会|n
sports festival|体育祭|n
school festival|文化祭；学芸会|n
music festival|音楽会|n
summer vacation|夏休み|n
winter vacation|冬休み|n
graduation|卒業|n
entrance ceremony|入学式|n
club|クラブ|n
brass band|吹奏楽部|n
chorus|合唱|n
junior high school|中学校|n
elementary school|小学校|n
event|行事|n
festival|祭り|n
fireworks|花火|n
bon dance|盆おどり|n
New Year|お正月|n
Christmas|クリスマス|n
Halloween|ハロウィン|n
present|プレゼント|n
card|カード|n
party|パーティー|n
country|国|n
world|世界|n
Japan|日本|n
America|アメリカ|n
the U.K.|イギリス|n
China|中国|n
Korea|韓国|n
India|インド|n
Australia|オーストラリア|n
Canada|カナダ|n
France|フランス|n
Italy|イタリア|n
Germany|ドイツ|n
Brazil|ブラジル|n
Egypt|エジプト|n
Thailand|タイ|n
Singapore|シンガポール|n
Spain|スペイン|n
Russia|ロシア|n
Kenya|ケニア|n
Peru|ペルー|n
Mexico|メキシコ|n
Africa|アフリカ|n
Asia|アジア|n
Europe|ヨーロッパ|n
language|言語|n
culture|文化|n
food|食べ物|n
sushi|すし|n
tempura|てんぷら|n
miso soup|みそしる|n
kimono|着物|n
origami|折り紙|n
kabuki|歌舞伎|n
sumo|相撲|n
manga|漫画|n
anime|アニメ|n
tea ceremony|茶道|n
cherry blossom|桜|n
Mt. Fuji|富士山|n
delicious|おいしい|adj
tasty|おいしい|adj
sweet|あまい|adj
sour|すっぱい|adj
salty|しょっぱい|adj
spicy|からい|adj
bitter|にがい|adj
fresh|新鮮な|adj
good|よい|adj
great|すばらしい|adj
nice|すてきな|adj
beautiful|美しい|adj
pretty|かわいい|adj
cute|かわいい|adj
kind|親切な|adj
funny|おもしろい|adj
fun|楽しい|adj
exciting|わくわくする|adj
interesting|興味深い|adj
difficult|むずかしい|adj
easy|やさしい；かんたんな|adj
popular|人気のある|adj
famous|有名な|adj
special|特別な|adj
strong|強い|adj
fast|速い|adj
tall|背が高い|adj
long|長い|adj
short|短い；背が低い|adj
old|古い；年をとった|adj
new|新しい|adj
young|若い|adj
happy|うれしい；幸せな|adj
sad|悲しい|adj
angry|おこった|adj
tired|つかれた|adj
hungry|おなかがすいた|adj
thirsty|のどがかわいた|adj
sleepy|ねむい|adj
busy|いそがしい|adj
shy|はずかしがりの|adj
brave|勇敢な|adj
smart|かしこい|adj
friendly|人なつっこい|adj
very|とても|adv
too|～も；あまりにも|adv
always|いつも|adv
usually|ふつうは|adv
sometimes|ときどき|adv
never|一度も～ない|adv
often|よく|adv
well|じょうずに|adv
now|今|adv
then|そのとき|adv
and|そして|conj
but|しかし|conj
or|または|conj
because|なぜなら|conj
if|もし～なら|conj
want to|～したい|aux
can|～できる|aux
will|～するつもり|aux
must|～しなければならない|aux
let's|～しましょう|aux
wow|わあ|int
oh|おお|int
`;
