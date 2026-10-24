/* 英文の並べかえ  書式：日本語|English[/別の正解]  （単語をタップして正しい順にならべる） */
let RAW_EO=`
#小5
わたしはサッカーが好きです。|I like soccer.
わたしは犬が好きです。|I like dogs.
わたしは音楽が好きです。|I like music.
わたしはバナナが好きではありません。|I don't like bananas.
あなたは何のスポーツが好きですか。|What sport do you like?
あなたは何の色が好きですか。|What color do you like?
あなたは何の食べ物が好きですか。|What food do you like?
あなたは何の教科が好きですか。|What subject do you like?
わたしはピアノがひけます。|I can play the piano.
わたしはじょうずに泳げます。|I can swim well.
わたしは速く走れます。|I can run fast.
わたしはギターがひけません。|I can't play the guitar.
あなたは自転車に乗れますか。|Can you ride a bike?
あなたは歌えますか。|Can you sing?
はい、できます。|Yes, I can.
いいえ、できません。|No, I can't.
わたしの誕生日は5月3日です。|My birthday is May third./My birthday is on May third.
あなたの誕生日はいつですか。|When is your birthday?
わたしの誕生日は10月です。|My birthday is in October.
子どもの日は5月5日です。|Children's Day is May fifth.
わたしは6時に起きます。|I get up at six.
わたしは7時に朝ごはんを食べます。|I eat breakfast at seven./I have breakfast at seven.
わたしは8時に学校へ行きます。|I go to school at eight.
わたしは9時にねます。|I go to bed at nine.
あなたは何時に起きますか。|What time do you get up?
あなたは何時に夕食を食べますか。|What time do you have dinner?/What time do you eat dinner?
わたしは毎日宿題をします。|I do my homework every day.
わたしは日曜日にテニスをします。|I play tennis on Sundays./I play tennis on Sunday./On Sundays, I play tennis.
わたしは動物園へ行きたいです。|I want to go to the zoo.
わたしは海へ行きたいです。|I want to go to the sea.
わたしはイタリアへ行きたいです。|I want to go to Italy.
わたしはオーストラリアへ行きたいです。|I want to go to Australia.
あなたはどこへ行きたいですか。|Where do you want to go?
わたしは図書館へ行きたいです。|I want to go to the library.
2つ目の角で左に曲がってください。|Turn left at the second corner.
駅はどこですか。|Where is the station?
郵便局は公園の近くにあります。|The post office is near the park.
病院は銀行のとなりにあります。|The hospital is next to the bank.
ようこそ、日本へ。|Welcome to Japan.
わたしはカレーライスがほしいです。|I want curry and rice.
あなたは何がほしいですか。|What would you like?/What do you want?
サラダとジュースをください。|Salad and juice, please.
これはいくらですか。|How much is this?
それは300円です。|It's three hundred yen./It is three hundred yen.
このぼうしはいくらですか。|How much is this cap?
わたしはイチゴが大好きです。|I love strawberries.
わたしの姉は歌がじょうずです。|My sister is good at singing./My sister is a good singer.
こちらはわたしの友だちです。|This is my friend.
彼は親切です。|He is kind.
彼女は親切です。|She is kind.
彼は走るのが速いです。|He can run fast.
わたしの町には大きな公園があります。|We have a big park in my town./My town has a big park.
わたしの町には図書館があります。|We have a library in my town.
わたしの好きな季節は夏です。|My favorite season is summer.
わたしの好きな教科は算数です。|My favorite subject is math.
わたしの好きな動物はネコです。|My favorite animal is the cat.
わたしの好きな色は青です。|My favorite color is blue.
わたしの名前はミキです。|My name is Miki.
わたしは10才です。|I am ten years old./I'm ten years old.
わたしはお年寄りにやさしくしたいです。|I want to be kind to old people.
わたしは理科が得意です。|I am good at science./I'm good at science.
わたしは家族と住んでいます。|I live with my family.
わたしは朝、犬を散歩させます。|I walk my dog in the morning./In the morning, I walk my dog.
わたしは夜、本を読みます。|I read books at night.
#小6
わたしは去年の夏、海へ行きました。|I went to the sea last summer./Last summer, I went to the sea.
わたしは海で泳ぎました。|I swam in the sea.
わたしは花火を見ました。|I saw fireworks.
わたしは祭りを楽しみました。|I enjoyed the festival.
わたしは友だちとサッカーを楽しみました。|I enjoyed playing soccer with my friends.
わたしはスイカを食べました。|I ate watermelon.
それはとてもおいしかったです。|It was delicious./It was very good.
それはとても楽しかったです。|It was a lot of fun./It was really fun.
わたしは京都を訪れました。|I visited Kyoto.
わたしは家族と奈良へ行きました。|I went to Nara with my family.
わたしたちは大仏を見ました。|We saw the Great Buddha.
わたしたちは電車で行きました。|We went there by train.
わたしはたくさん写真をとりました。|I took many pictures.
わたしは昨日、図書館へ行きました。|I went to the library yesterday.
わたしは宿題をしました。|I did my homework.
わたしはテレビを見ました。|I watched TV.
わたしは昨日、本を読みました。|I read a book yesterday.
わたしは祖母に会いました。|I met my grandmother.
わたしは日曜日に公園で遊びました。|I played in the park on Sunday.
わたしはカレーを作りました。|I made curry.
昨日は雨でした。|It was rainy yesterday.
昨日はいそがしかったです。|I was busy yesterday./Yesterday I was busy.
わたしの夢は医者になることです。|My dream is to be a doctor.
わたしの夢は先生になることです。|My dream is to be a teacher.
わたしの夢は消防士になることです。|My dream is to be a firefighter.
わたしの夢は野球選手になることです。|My dream is to be a baseball player.
わたしはパイロットになりたいです。|I want to be a pilot.
わたしはパン屋さんになりたいです。|I want to be a baker.
あなたは何になりたいですか。|What do you want to be?
わたしは人を助けたいです。|I want to help people.
わたしは動物が好きなので、獣医になりたいです。|I like animals, so I want to be a vet.
わたしは中学校で吹奏楽部に入りたいです。|I want to join the brass band in junior high school.
わたしは中学校でバスケットボールをしたいです。|I want to play basketball in junior high school.
わたしは中学校で英語を勉強したいです。|I want to study English in junior high school.
わたしは中学校でたくさんの友だちを作りたいです。|I want to make many friends in junior high school./I want to make a lot of friends in junior high school.
あなたは中学校で何をしたいですか。|What do you want to do in junior high school?
わたしは中学校の部活動を楽しみたいです。|I want to enjoy club activities in junior high school.
わたしは中学校の文化祭を楽しみたいです。|I want to enjoy the school festival in junior high school.
わたしたちの学校には大きな体育館があります。|We have a big gym in our school./Our school has a big gym.
わたしたちの学校には図書室があります。|We have a library in our school.
わたしたちは運動会をしました。|We had a sports day.
わたしは運動会でリレーを走りました。|I ran in the relay on sports day.
わたしたちは10月に音楽会がありました。|We had a music festival in October.
わたしは合唱コンクールでがんばりました。|I did my best in the chorus contest.
修学旅行はとても楽しかったです。|The school trip was a lot of fun./The school trip was really fun.
わたしの一番の思い出は修学旅行です。|My best memory is the school trip.
わたしの一番の思い出は運動会です。|My best memory is sports day./My best memory is the sports day.
わたしは友だちと遠足に行きました。|I went on a field trip with my friends.
あなたの一番の思い出は何ですか。|What is your best memory?
わたしの町には有名なお城があります。|We have a famous castle in my town./My town has a famous castle.
わたしの町は海の近くにあります。|My town is near the sea.
わたしの町にはすてきなレストランがあります。|We have a nice restaurant in my town./My town has a nice restaurant.
駅から海が見えます。|You can see the sea from the station.
その公園で桜を見られます。|You can see cherry blossoms in the park.
わたしの町は自然がゆたかです。|My town has beautiful nature./My town is rich in nature.
わたしはイタリアへ行ってピザを食べたいです。|I want to go to Italy and eat pizza.
わたしはカナダへ行って山を見たいです。|I want to go to Canada and see the mountains.
わたしはブラジルへ行ってサッカーを見たいです。|I want to go to Brazil and watch soccer.
わたしはフランスへ行きたいです。|I want to go to France.
わたしはエジプトでピラミッドを見たいです。|I want to see the pyramids in Egypt.
あなたはなぜその国へ行きたいのですか。|Why do you want to go to that country?
わたしは世界中を旅行したいです。|I want to travel around the world.
わたしは英語をじょうずに話したいです。|I want to speak English well.
わたしはじょうずに歌いたいです。|I want to sing well.
わたしは強くなるために毎日走ります。|I run every day to get strong.
佐藤先生、ありがとうございました。|Thank you, Mr. Sato./Thank you, Ms. Sato.
教えてくれてありがとう。|Thank you for teaching me.
わたしはこの学校が大好きです。|I love this school.
わたしはこの学校が好きです。|I like this school.
わたしは6年生です。|I am a sixth grader./I'm in the sixth grade.
わたしは3月に卒業するつもりです。|I'm going to graduate in March.
わたしは来年、中学生になります。|I'm going to be a junior high school student next year.
わたしは卒業式で歌いたいです。|I want to sing at the graduation ceremony.
わたしたちはクラスで花を植えました。|We planted flowers in our class.
わたしは昨日、友だちと遊びました。|I played with my friend yesterday.
わたしは先週、動物園へ行きました。|I went to the zoo last week.
わたしは動物園でパンダを見ました。|I saw pandas at the zoo.
わたしはその映画を見て、楽しみました。|I watched the movie and enjoyed it.
わたしの好きな行事は夏祭りです。|My favorite event is the summer festival.
わたしの好きな行事はクリスマスです。|My favorite event is Christmas.
`;
/* 英作文（自分で書いて、お手本と見くらべる）  書式：お題|お手本|ポイント */
let RAW_EC=`
#小5
好きな食べ物を英語で1文書こう。|I like pizza.|I like ～. の型。～に好きな物を入れる。
できることを英語で1文書こう。|I can play the piano.|I can ～. のあとに動作のことばを入れる。
自分の名前と好きなスポーツを2文で書こう。|I'm Ken. I like tennis.|I'm ～. で名前、I like ～. で好きなもの。
誕生日を英語で書こう。|My birthday is June fifth.|月の名前と、日づけは「序数（fifth など）」で書く。
朝起きる時刻を英語で書こう。|I get up at six thirty.|I get up at ～. の～に時刻を入れる。
行ってみたい国を英語で1文書こう。|I want to go to Brazil.|I want to go to ～. の～に国や場所を入れる。
好きな教科を英語で書こう。|I like science.|I like ～. 教科の名前を入れる。
自分の町にあるものを1文で書こう。|We have a big park in my town.|We have ～. 場所の名前を入れる。
できないことを英語で1文書こう。|I can't swim fast.|I can't ～.（can't は cannot の短い形）。
好きな動物とその理由を2文で書こう。|I like cats. They are cute.|1文目で好きなもの、2文目で They are ～.（理由）。
友だちを1人しょうかいしよう。（2文）|This is Aki. She is kind.|This is ～. で紹介、He / She is ～. で人がらを言う。
夏休みに行った場所を1文で書こう。|I went to the sea.|行った＝went。I went to ～.
#小6
夏休みの思い出を2文で書こう。|I went to the sea. I enjoyed swimming.|I went to ～. / I enjoyed ～ing.
夏休みに食べたものを2文で書こう。|I ate watermelon. It was delicious.|ate は eat の過去形。It was ～. で感想。
将来の夢を英語で書こう。|I want to be a doctor.|I want to be ～. で夢。My dream is to be ～. でもよい。
夢と、そのわけを2文で書こう。|My dream is to be a teacher. I like children.|My dream is to be ～. のあとに理由を1文。
一番の思い出を英語で書こう。|My best memory is our school trip. We saw many temples.|My best memory is ～. のあとに説明を1文。
中学校でしたいことを書こう。|I want to join the brass band.|I want to join ～. / I want to enjoy ～.
中学校で楽しみたい行事を書こう。|I want to enjoy the school festival.|I want to enjoy ～.
学校行事の思い出を2文で書こう。|We had a sports day. I ran in the relay.|We had ～. / I ～（過去形）で書く。
自分の町のおすすめを2文で書こう。|We have a nice castle. You can see it from the station.|We have ～. / You can ～.
行きたい国とやりたいことを2文で書こう。|I want to go to Canada. I want to see the mountains.|I want to go to ～. I want to ～.
先生に感謝を伝える1文を書こう。|Thank you for teaching me.|Thank you for ～ing.（～してくれてありがとう）。
卒業するまでにがんばりたいことを書こう。|I want to do my best in the chorus contest.|I want to do my best in ～.（～をがんばりたい）。
`;
/* リスニング（TTSで読み上げ）  書式：英文|問い|正解|誤1|誤2|誤3|日本語訳 */
let RAW_EL=`
#小5
I like soccer. I play it every Sunday.|話し手はいつサッカーをしますか。|毎週日曜日|毎週土曜日|毎日|毎週月曜日|every Sunday は毎週日曜日。
My birthday is in May. I am eleven years old.|話し手の誕生日は何月ですか。|5月|3月|7月|9月|in May は5月。
I can play the piano, but I can't play the guitar.|話し手がひけない楽器は何ですか。|ギター|バイオリン|ドラム|フルート|can't play the guitar はギターはひけない。
I get up at six. I eat breakfast at seven.|話し手は何時に朝ごはんを食べますか。|7時|6時|8時|9時|breakfast at seven は7時に朝食。
I want to go to Italy. I want to eat pizza there.|話し手は何をしたいですか。|イタリアでピザを食べる|イタリアでピザを作る|フランスでパンを食べる|イタリアで絵を見る|eat pizza there はそこでピザを食べる。
What do you want, Ken? Spaghetti, please.|ケンは何がほしいですか。|スパゲッティ|ピザ|サラダ|カレー|Spaghetti, please. でスパゲッティを注文。
How much is this cap? It's eight hundred yen.|ぼうしはいくらですか。|800円|80円|1800円|400円|eight hundred は800。
Go straight and turn right at the second corner.|どう行けばよいですか。|まっすぐ行って2つ目の角を右に曲がる|まっすぐ行って1つ目の角を右に曲がる|まっすぐ行って2つ目の角を左に曲がる|右に曲がってまっすぐ行く|turn right at the second corner は2つ目の角で右。
The library is next to the park.|図書館はどこにありますか。|公園のとなり|公園の前|駅のとなり|学校のうしろ|next to the park は公園のとなり。
My favorite color is blue. My bag is blue, too.|話し手の好きな色は何ですか。|青|赤|緑|黄色|favorite color is blue は青。
I have two dogs and one cat.|話し手は犬を何びき飼っていますか。|2ひき|1ぴき|3びき|4ひき|two dogs は犬2ひき。
My sister is good at swimming. She swims every day.|話し手の姉（妹）は何が得意ですか。|水泳|ダンス|歌|絵|good at swimming は水泳が得意。
Today is Monday. We have math and music.|今日の授業は何と何ですか。|算数と音楽|国語と音楽|算数と体育|理科と音楽|math and music は算数と音楽。
I like apples, but I don't like grapes.|話し手が好きではない果物は何ですか。|ぶどう|りんご|もも|みかん|don't like grapes はぶどうが好きでない。
I go to school at eight. I go home at three.|話し手は何時に家に帰りますか。|3時|8時|4時|2時|go home at three は3時に帰る。
My town has a big station and a small library.|町にあるのはどれですか。|大きな駅と小さな図書館|小さな駅と大きな図書館|大きな駅と大きな公園|小さな駅と小さな店|a big station and a small library。
Do you like cats, Mari? No, I don't. I like dogs.|マリは何が好きですか。|犬|ネコ|うさぎ|鳥|No, I don't. I like dogs. で犬が好き。
I eat lunch at school. I usually have rice and fish.|話し手は昼食に何を食べますか。|ごはんと魚|パンと魚|ごはんと肉|パンと卵|rice and fish はごはんと魚。
It is cold today. I wear a jacket and a cap.|話し手は何を身につけていますか。|ジャケットとぼうし|セーターとぼうし|ジャケットとくつ|セーターとくつした|jacket and a cap はジャケットとぼうし。
Hello, I'm Aya. I'm from Kyoto. Nice to meet you.|アヤはどこの出身ですか。|京都|大阪|奈良|神戸|from Kyoto は京都出身。
I have a math test on Friday.|テストはいつありますか。|金曜日|木曜日|水曜日|月曜日|on Friday は金曜日。
I can cook curry. My mother helps me.|話し手が作れる料理は何ですか。|カレー|ハンバーグ|スープ|サラダ|cook curry はカレーを作れる。
I clean my room every Saturday.|話し手はいつ部屋をそうじしますか。|毎週土曜日|毎週日曜日|毎日|毎週金曜日|every Saturday は毎週土曜日。
What day is it today? It's Wednesday.|今日は何曜日ですか。|水曜日|火曜日|木曜日|金曜日|It's Wednesday は水曜日。
My mother is a nurse. My father is a bus driver.|話し手の父の仕事は何ですか。|バスの運転手|看護師|先生|料理人|father is a bus driver。
I want a new bike. It's red and cool.|話し手がほしいものは何ですか。|赤い自転車|青い自転車|赤いかばん|新しいくつ|a new bike. It's red。
There are twenty children in my class.|クラスの人数は何人ですか。|20人|12人|30人|2人|twenty は20。
I'm hungry. Let's have some sandwiches.|話し手は何を食べようと言っていますか。|サンドイッチ|ケーキ|アイスクリーム|ピザ|sandwiches はサンドイッチ。
I like winter because I can ski.|話し手が冬を好きなのはなぜですか。|スキーができるから|雪が降るから|休みが長いから|ごはんがおいしいから|because I can ski はスキーができるから。
My grandfather lives in Nara. I visit him in August.|話し手はいつ祖父を訪ねますか。|8月|7月|9月|12月|in August は8月。
Look at that tall building. It's a hotel.|高い建物は何ですか。|ホテル|学校|病院|駅|It's a hotel はホテル。
#小6
I went to the sea last summer. I enjoyed swimming.|話し手は夏に何をしましたか。|海で泳いだ|山に登った|川で釣りをした|プールで遊んだ|went to the sea, enjoyed swimming。
Yesterday I watched a soccer game. It was exciting.|話し手は昨日何をしましたか。|サッカーの試合を見た|サッカーをした|野球を見た|サッカーの本を読んだ|watched a soccer game。
My dream is to be a doctor. I want to help sick people.|話し手の夢は何ですか。|医者になること|先生になること|歌手になること|パイロットになること|to be a doctor は医者。
I want to join the brass band in junior high school.|話し手は中学校で何をしたいですか。|吹奏楽部に入る|サッカー部に入る|美術部に入る|合唱部に入る|join the brass band は吹奏楽部に入る。
We had a sports day in October. I ran in the relay.|話し手は運動会で何をしましたか。|リレーで走った|玉入れをした|綱引きをした|ダンスをした|ran in the relay はリレーで走った。
I visited my grandmother in Hokkaido. We ate crab.|話し手は北海道で何を食べましたか。|カニ|魚|肉|くだもの|ate crab はカニを食べた。
Last weekend, I went to the library. I read two books.|話し手は図書館で何をしましたか。|本を2冊読んだ|本を3冊読んだ|本を2冊買った|本を2冊書いた|read two books は本を2冊読んだ。
I was busy last week. I had a piano concert on Saturday.|先週土曜日に何がありましたか。|ピアノの発表会|ダンスの発表会|サッカーの試合|水泳の大会|piano concert on Saturday。
Our school trip was to Nara. We saw a big Buddha.|修学旅行で何を見ましたか。|大仏|五重塔|お城|大きな橋|a big Buddha は大仏。
My best memory is the chorus contest. We practiced very hard.|一番の思い出は何ですか。|合唱コンクール|運動会|遠足|音楽会|chorus contest は合唱コンクール。
I went to the park and played badminton with my friends.|話し手は公園で何をしましたか。|バドミントンをした|バスケットボールをした|なわとびをした|おにごっこをした|played badminton はバドミントン。
Thank you for your help. I enjoyed this class very much.|話し手は何について話していますか。|授業が楽しかったこと|宿題が多かったこと|学校が遠いこと|テストが難しかったこと|enjoyed this class very much。
I am going to study English hard in junior high school.|話し手は中学校で何をがんばりたいですか。|英語の勉強|数学の勉強|運動|音楽|study English hard は英語をがんばる。
Our town has a famous castle. You can see it from the station.|お城はどこから見えますか。|駅|公園|学校|橋|from the station は駅から見える。
I want to go to France. I want to see the Eiffel Tower.|話し手が見たいものは何ですか。|エッフェル塔|自由の女神|万里の長城|ピラミッド|Eiffel Tower はエッフェル塔。
I went to Tokyo with my family. We took the Shinkansen.|話し手は何で東京へ行きましたか。|新幹線|飛行機|バス|車|took the Shinkansen は新幹線に乗った。
My brother was sick yesterday. He stayed home all day.|昨日、兄はどうしましたか。|1日中家にいた|学校へ行った|病院で働いた|友だちと遊んだ|stayed home all day。
I'm good at cooking. I made curry and rice for my family last night.|話し手は昨夜何を作りましたか。|カレーライス|ハンバーグ|スープ|ケーキ|made curry and rice。
At the summer festival, we danced and ate shaved ice.|夏祭りで何を食べましたか。|かき氷|わたあめ|やきそば|たこ焼き|shaved ice はかき氷。
My dream is to be a baker. I like making bread.|話し手は何を作るのが好きですか。|パン|ケーキ|クッキー|ピザ|making bread はパンを作る。
Our school is eighty years old. It has a big gym and a pool.|学校には何がありますか。|大きな体育館とプール|大きな図書館とプール|大きな体育館と畑|小さな体育館と庭|big gym and a pool。
We went camping last summer. We saw many stars at night.|夜に何を見ましたか。|たくさんの星|大きな月|ほたる|花火|many stars はたくさんの星。
When I was a child, I lived in Osaka. Now I live in Nagoya.|話し手は今どこに住んでいますか。|名古屋|大阪|京都|東京|Now I live in Nagoya。
I love my school. We have a lot of nice events.|話し手は学校についてどう思っていますか。|大好きだ|きらいだ|つまらない|こわい|love my school は学校が大好き。
Mr. Sato taught us music. He played the piano very well.|佐藤先生は何を教えましたか。|音楽|体育|算数|図工|taught us music は音楽を教えた。
I practiced soccer every day for the big game.|話し手は何のために練習しましたか。|試合|遠足|テスト|発表会|for the big game は大きな試合のため。
Next year, I'm going to be a junior high school student. I am happy.|話し手は来年どうなりますか。|中学生になる|高校生になる|大学生になる|6年生になる|junior high school student は中学生。
I want to go to America. I want to speak English there.|話し手がしたいことは何ですか。|アメリカで英語を話す|アメリカでピザを食べる|カナダで英語を話す|アメリカで英語を教える|speak English there はそこで英語を話す。
My friend gave me a card on my birthday. I was very happy.|友だちは誕生日に何をくれましたか。|カード|本|花|ケーキ|gave me a card はカードをくれた。
The Great Buddha in Nara is very big. Many people visit it.|奈良の何が大きいですか。|大仏|お城|橋|山|Great Buddha は大仏。
We cleaned our school yard. We planted flowers.|生徒は校庭で何をしましたか。|そうじをして花を植えた|そうじをして木を切った|そうじをして遊んだ|花を植えて遊んだ|cleaned と planted flowers。
I want to be a pilot. I like airplanes.|話し手の夢は何ですか。|パイロット|医者|警察官|消防士|be a pilot はパイロット。
My father and I went fishing last Sunday. I got two fish.|話し手は何びきの魚をつりましたか。|2ひき|1ぴき|3びき|5ひき|got two fish は2ひき。
On the weekend, we visited the science museum. We saw many robots.|博物館で何を見ましたか。|たくさんのロボット|大きな恐竜|宇宙船|古い車|many robots はロボット。
I have a lot of homework. I do it after dinner.|話し手はいつ宿題をしますか。|夕食のあと|夕食の前|朝|学校で|after dinner は夕食のあと。
Let's make a cake for Mom. Today is Mother's Day.|今日は何の日ですか。|母の日|父の日|子どもの日|誕生日|Mother's Day は母の日。
I like Japanese food. Sushi is my favorite.|話し手の一番好きな日本食は何ですか。|すし|てんぷら|そば|うどん|Sushi is my favorite。
I was shy at the speech contest, but I did my best.|話し手は弁論大会でどうでしたか。|はずかしかったが全力を出した|とても楽しかった|ねむかった|少しもはずかしくなかった|shy but did my best。
My junior high school has a big gym. I want to play basketball there.|話し手は中学校で何をしたいですか。|バスケットボールをする|バレーボールをする|テニスをする|水泳をする|play basketball there はそこでバスケットボールをする。
I went to the zoo with my sister. We saw a tiger.|話し手は動物園で何を見ましたか。|トラ|ライオン|ゾウ|キリン|saw a tiger はトラを見た。
Last night, I did my homework and went to bed at ten.|話し手は何時にねましたか。|10時|9時|11時|8時|went to bed at ten は10時にねた。
My uncle lives in Canada. I want to visit him.|話し手はだれを訪ねたいですか。|おじ|おば|祖父|いとこ|My uncle は おじ。
I enjoyed the school festival. I played in a band.|話し手は文化祭で何をしましたか。|バンドで演奏した|劇に出た|店を開いた|絵をかざった|played in a band。
This summer, I climbed Mt. Fuji with my father.|話し手はだれと富士山に登りましたか。|父|母|兄|友だち|with my father は父と。
I want to go to Brazil because I like soccer.|話し手がブラジルへ行きたいのはなぜですか。|サッカーが好きだから|海が好きだから|音楽が好きだから|料理が好きだから|because I like soccer。
Our class sold cookies at the school festival.|クラスは文化祭で何を売りましたか。|クッキー|ケーキ|ジュース|パン|sold cookies はクッキーを売った。
I'm going to study math and science in junior high school.|話し手が中学校で勉強したい教科はどれですか。|算数と理科|国語と社会|英語と音楽|体育と図工|math and science は算数と理科。
My mother made a birthday cake for me. It was strawberry cake.|どんなケーキでしたか。|イチゴのケーキ|チョコレートケーキ|チーズケーキ|バナナケーキ|strawberry cake はイチゴのケーキ。
We saw many deer in Nara Park.|奈良公園で何を見ましたか。|たくさんのシカ|たくさんのサル|たくさんの鳥|たくさんのウサギ|many deer はシカ。
`;
