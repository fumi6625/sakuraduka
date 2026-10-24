/* 英語の長文（小学校）  qs の並び：[問い, 正解, 誤1, 誤2, 誤3, 解説]。e01〜e12＝5年向け（40〜70語）、e13〜e24＝6年向け（60〜100語）。設問4つ（日本語3・英語1） */
const PASS_E=[
{id:'e01',title:'My Name Is Yuki',text:`Hello. My name is Yuki. I am eleven years old. I live in Osaka with my father, my mother and my little brother. I like music. I can play the piano. I play it every day after school. I want to play the piano for my friends at the school festival.`,qs:[
[`ユキは何才ですか。`,`11才`,`10才`,`12才`,`9才`,`I am eleven years old.（11才）`],
[`ユキは、自分をふくめて何人家族ですか。`,`4人`,`3人`,`5人`,`6人`,`父・母・弟とユキで4人。`],
[`ユキはいつピアノをひきますか。`,`毎日、放課後`,`毎週日曜日`,`朝ごはんの前`,`夏休みだけ`,`every day after school（毎日放課後）`],
[`What does Yuki want to do at the school festival?`,`Play the piano for her friends.`,`Sing with her brother.`,`Dance with her friends.`,`Listen to music alone.`,`I want to play the piano for my friends at the school festival.`]]},
{id:'e02',title:'My Favorite Food',text:`I like Italian food. My favorite food is pizza. I eat it with my family on Saturday. My father makes the pizza. He puts tomatoes, cheese and green peppers on it. I don't like green peppers, so I don't eat them. My mother makes a salad. We enjoy our dinner together.`,qs:[
[`筆者の一番好きな食べ物は何ですか。`,`ピザ`,`スパゲッティ`,`サラダ`,`カレー`,`My favorite food is pizza.`],
[`ピザを作るのはだれですか。`,`父`,`母`,`筆者`,`兄`,`My father makes the pizza.`],
[`筆者が食べないものは何ですか。`,`ピーマン`,`トマト`,`チーズ`,`サラダ`,`I don't like green peppers, so I don't eat them.`],
[`When does the writer eat pizza with his or her family?`,`On Saturday.`,`On Sunday.`,`On Friday.`,`Every day.`,`I eat it with my family on Saturday.`]]},
{id:'e03',title:'My Dog Momo',text:`I have a dog. Her name is Momo. She is white and small. She is three years old. Momo likes balls. I play with her in the park every morning. She can run very fast. She can't swim, but she likes water. I love Momo very much.`,qs:[
[`モモはどんな犬ですか。`,`白くて小さい`,`黒くて大きい`,`茶色くて小さい`,`白くて大きい`,`She is white and small.`],
[`筆者はいつモモと公園で遊びますか。`,`毎朝`,`毎晩`,`毎週日曜日`,`学校のあと`,`in the park every morning（毎朝）`],
[`モモは何才ですか。`,`3才`,`2才`,`5才`,`1才`,`She is three years old.`],
[`What can Momo do?`,`She can run very fast.`,`She can swim very well.`,`She can open the door.`,`She can sing a song.`,`She can run very fast. She can't swim.`]]},
{id:'e04',title:'My Weekend',text:`On Saturday, I get up at eight. I eat breakfast and clean my room. In the afternoon, I play soccer with my friends in the park. On Sunday, I go to the library with my mother. I read books there. I like Sundays because I can read my favorite books.`,qs:[
[`土曜日の午後、筆者は何をしますか。`,`友だちとサッカーをする`,`図書館へ行く`,`部屋をそうじする`,`母と買い物に行く`,`I play soccer with my friends in the park.`],
[`筆者は土曜日に何時に起きますか。`,`8時`,`7時`,`9時`,`6時`,`I get up at eight.`],
[`筆者は日曜日にだれと図書館へ行きますか。`,`母`,`父`,`友だち`,`姉`,`go to the library with my mother`],
[`Why does the writer like Sundays?`,`The writer can read favorite books.`,`The writer can play soccer.`,`The writer can sleep late.`,`The writer can watch TV.`,`I like Sundays because I can read my favorite books.`]]},
{id:'e05',title:'My Birthday',text:`My birthday is on May tenth. This year, I will be eleven. My mother will make a big cake for me. It will be a strawberry cake. My friends will come to my house. We will play games and sing songs. My father will give me a new bag. I am very happy.`,qs:[
[`筆者の誕生日はいつですか。`,`5月10日`,`5月1日`,`10月5日`,`3月10日`,`My birthday is on May tenth.`],
[`母はどんなケーキを作りますか。`,`イチゴのケーキ`,`チョコレートケーキ`,`バナナケーキ`,`チーズケーキ`,`It will be a strawberry cake.`],
[`筆者は父から何をもらいますか。`,`新しいかばん`,`新しい自転車`,`新しい本`,`新しいぼうし`,`My father will give me a new bag.`],
[`What will the writer do with friends?`,`Play games and sing songs.`,`Watch a movie.`,`Go to the zoo.`,`Make a cake.`,`We will play games and sing songs.`]]},
{id:'e06',title:'My Day',text:`I get up at six thirty. I wash my face and eat breakfast at seven. I go to school at eight. I like P.E. and music. I eat lunch at school at twelve thirty. I go home at three thirty. After that, I do my homework. I take a bath at eight and go to bed at nine thirty.`,qs:[
[`筆者は何時に起きますか。`,`6時30分`,`7時`,`6時`,`7時30分`,`I get up at six thirty.`],
[`筆者の好きな教科は何ですか。`,`体育と音楽`,`算数と理科`,`国語と社会`,`図工と英語`,`I like P.E. and music.`],
[`筆者は学校から帰ったあと、まず何をしますか。`,`宿題をする`,`ふろに入る`,`ねる`,`昼ごはんを食べる`,`After that, I do my homework.`],
[`What time does the writer go to bed?`,`At nine thirty.`,`At nine.`,`At eight.`,`At ten thirty.`,`go to bed at nine thirty`]]},
{id:'e07',title:'My School',text:`I go to Sakura Elementary School. It is near my house. I walk to school with my friends. We have a big playground and a small garden. In the garden, we grow flowers and vegetables. My favorite place is the library. I read a lot of books there. I like my school.`,qs:[
[`筆者はどうやって学校へ行きますか。`,`友だちと歩いて`,`自転車で`,`バスで`,`母の車で`,`I walk to school with my friends.`],
[`学校の小さな庭では何を育てていますか。`,`花と野菜`,`花と木`,`野菜と果物`,`米と豆`,`we grow flowers and vegetables`],
[`筆者の一番好きな場所はどこですか。`,`図書室`,`校庭`,`庭`,`体育館`,`My favorite place is the library.`],
[`Where is the school?`,`It is near the writer's house.`,`It is far from the writer's house.`,`It is next to the station.`,`It is in a big park.`,`It is near my house.`]]},
{id:'e08',title:'My Friend Ken',text:`This is my friend Ken. He is eleven years old. He is tall and kind. He is good at basketball. He can run fast and jump high. He likes music, too. He can play the drums. Ken is very funny. We always laugh together in class. He is my best friend.`,qs:[
[`ケンはどんな人ですか。`,`背が高くて親切`,`背が低くて親切`,`背が高くておとなしい`,`背が低くて元気`,`He is tall and kind.`],
[`ケンは何が得意ですか。`,`バスケットボール`,`サッカー`,`水泳`,`野球`,`He is good at basketball.`],
[`ケンは何の楽器ができますか。`,`ドラム`,`ピアノ`,`ギター`,`フルート`,`He can play the drums.`],
[`What do the writer and Ken do in class?`,`They laugh together.`,`They sing together.`,`They study alone.`,`They play basketball.`,`We always laugh together in class.`]]},
{id:'e09',title:'Summer in Okinawa',text:`Last summer, I went to Okinawa with my family. We went there by plane. The sea was very blue and beautiful. I swam in the sea every day. I saw many colorful fish. We ate Okinawa soba and goya champuru. They were delicious. I want to go to Okinawa again.`,qs:[
[`筆者は何で沖縄へ行きましたか。`,`飛行機`,`船`,`新幹線`,`バス`,`We went there by plane.`],
[`海はどんなでしたか。`,`とても青くて美しかった`,`とても冷たかった`,`とてもあらかった`,`とてもよごれていた`,`The sea was very blue and beautiful.`],
[`筆者は海で何を見ましたか。`,`色とりどりの魚`,`大きなカメ`,`クジラ`,`イルカ`,`I saw many colorful fish.`],
[`What did the writer eat in Okinawa?`,`Okinawa soba and goya champuru.`,`Sushi and tempura.`,`Pizza and salad.`,`Curry and rice.`,`We ate Okinawa soba and goya champuru.`]]},
{id:'e10',title:'My Town',text:`I live in a small town. We have a big park, a library and a station. There is a river near the park. In spring, we can see beautiful cherry blossoms there. Many people come to the park. We don't have a movie theater, but we have a nice bookstore. I like my town.`,qs:[
[`町には何がありますか。`,`大きな公園、図書館、駅`,`大きな公園、映画館、駅`,`小さな公園、図書館、駅`,`大きな公園、図書館、動物園`,`We have a big park, a library and a station.`],
[`春に公園では何が見られますか。`,`美しい桜`,`美しいバラ`,`美しい雪`,`美しい紅葉`,`In spring, we can see beautiful cherry blossoms there.`],
[`町にないものは何ですか。`,`映画館`,`本屋`,`駅`,`川`,`We don't have a movie theater.`],
[`What is near the park?`,`A river.`,`A station.`,`A school.`,`A hospital.`,`There is a river near the park.`]]},
{id:'e11',title:'Winter Holiday',text:`I like winter. In winter, we have a long holiday. On New Year's Day, we eat special food called osechi. I like sweet black beans the best. My grandmother gives me otoshidama. This year, I got three thousand yen. I want to buy a new book with it.`,qs:[
[`お正月に食べる特別な料理を何といいますか。`,`おせち`,`おもち`,`おぞうに`,`年越しそば`,`special food called osechi`],
[`筆者が一番好きなものは何ですか。`,`あまい黒豆`,`かまぼこ`,`えび`,`数の子`,`I like sweet black beans the best.`],
[`筆者はお年玉をいくらもらいましたか。`,`3000円`,`300円`,`5000円`,`1000円`,`I got three thousand yen.`],
[`What does the writer want to buy?`,`A new book.`,`A new bag.`,`A new game.`,`A new coat.`,`I want to buy a new book with it.`]]},
{id:'e12',title:'Sports Day',text:`Our sports day is in October. I am in the red team. I will run in the relay. I practice running every day after school. My friend Mika is on the white team. She will do a dance. We want to win, but we also want to have fun. My family will come to see me.`,qs:[
[`運動会はいつですか。`,`10月`,`5月`,`9月`,`11月`,`Our sports day is in October.`],
[`筆者は何の種目に出ますか。`,`リレー`,`ダンス`,`玉入れ`,`綱引き`,`I will run in the relay.`],
[`ミカは何組ですか。`,`白組`,`赤組`,`青組`,`黄組`,`Mika is on the white team.`],
[`Who will come to see the writer?`,`The writer's family.`,`The writer's friends.`,`The writer's teacher.`,`Mika.`,`My family will come to see me.`]]},
{id:'e13',title:'My Dream',text:`My dream is to be a doctor. When I was six years old, I was sick and went to the hospital. A kind doctor helped me, and I felt better soon. I want to be a doctor like her. I want to help sick people. To be a doctor, I need to study hard, especially science and English. I study every day, and I never give up.`,qs:[
[`筆者の夢は何ですか。`,`医者になること`,`看護師になること`,`先生になること`,`薬屋になること`,`My dream is to be a doctor.`],
[`筆者が夢をもったきっかけは何ですか。`,`病気のときに親切な医者に助けられたこと`,`家族が医者だったこと`,`テレビで医者を見たこと`,`学校に医者が来たこと`,`A kind doctor helped me, and I felt better soon.`],
[`筆者が特に勉強している教科は何ですか。`,`理科と英語`,`国語と算数`,`社会と音楽`,`体育と図工`,`especially science and English`],
[`What does the writer do every day?`,`Study hard.`,`Visit a hospital.`,`Help sick people.`,`Read a story.`,`I study every day, and I never give up.`]]},
{id:'e14',title:'Summer Camp',text:`Last August, I went to a summer camp in the mountains with my classmates. We stayed there for three days. On the first day, we made curry and rice. It was difficult, but it was delicious. On the second day, we climbed a mountain. It was hard, but the view from the top was great. At night, we saw many stars. It was the best summer memory.`,qs:[
[`キャンプは何日間でしたか。`,`3日間`,`2日間`,`5日間`,`1週間`,`We stayed there for three days.`],
[`1日目に何をしましたか。`,`カレーを作った`,`山に登った`,`魚をつった`,`星を見た`,`On the first day, we made curry and rice.`],
[`山の頂上からの景色はどうでしたか。`,`すばらしかった`,`よく見えなかった`,`こわかった`,`つまらなかった`,`the view from the top was great`],
[`What did the writer see at night?`,`Many stars.`,`Fireworks.`,`A big moon.`,`Fireflies.`,`At night, we saw many stars.`]]},
{id:'e15',title:'A Trip to Hokkaido',text:`During summer vacation, I visited my aunt in Hokkaido. She lives in Sapporo. We went to a big farm and I saw many cows. I drank fresh milk and ate ice cream. It was very good. We also went to Otaru and saw old buildings near the sea. The weather was cool and nice. I want to go there again in winter and see snow.`,qs:[
[`筆者はだれを訪ねましたか。`,`おば`,`祖母`,`いとこ`,`友だち`,`I visited my aunt in Hokkaido.`],
[`農場で筆者は何をしましたか。`,`牛を見て、牛乳を飲みアイスを食べた`,`馬に乗った`,`野菜を育てた`,`バターを作った`,`I saw many cows. I drank fresh milk and ate ice cream.`],
[`小樽では何を見ましたか。`,`海の近くの古い建物`,`大きな時計台`,`広い花畑`,`高い山`,`saw old buildings near the sea`],
[`What does the writer want to do in winter?`,`See snow in Hokkaido.`,`Visit Okinawa.`,`Go to the sea.`,`Eat fresh fish.`,`I want to go there again in winter and see snow.`]]},
{id:'e16',title:'Summer Festival',text:`Our town has a summer festival every August. Last year, I went to the festival with my friends. We wore yukata and walked around the shrine. There were many food stands. I ate shaved ice and my friend ate takoyaki. At night, we watched fireworks. They were big and beautiful. We took many pictures. I am looking forward to this year's festival.`,qs:[
[`夏祭りはいつ開かれますか。`,`毎年8月`,`毎年7月`,`毎年9月`,`毎年6月`,`a summer festival every August`],
[`筆者は夏祭りで何を着ましたか。`,`浴衣`,`制服`,`体操服`,`パジャマ`,`We wore yukata.`],
[`筆者は何を食べましたか。`,`かき氷`,`たこ焼き`,`わたあめ`,`やきそば`,`I ate shaved ice and my friend ate takoyaki.`],
[`What did they do at night?`,`They watched fireworks.`,`They danced.`,`They played games.`,`They cooked dinner.`,`At night, we watched fireworks.`]]},
{id:'e17',title:'Italy',text:`I want to go to Italy someday. I want to eat real pizza and pasta there. I also want to see the Colosseum in Rome. My teacher says that it is two thousand years old. In Venice, there are many canals, and people go around the town by boat. I want to take a boat ride. I am studying a little Italian now.`,qs:[
[`筆者が行きたい国はどこですか。`,`イタリア`,`フランス`,`スペイン`,`ギリシャ`,`I want to go to Italy someday.`],
[`筆者がローマで見たいものは何ですか。`,`コロッセオ`,`エッフェル塔`,`ピサの斜塔`,`ベネツィアの運河`,`I also want to see the Colosseum in Rome.`],
[`ベネチアでは人々は何で町を移動しますか。`,`船`,`自転車`,`電車`,`馬車`,`people go around the town by boat`],
[`What is the writer doing now?`,`Studying a little Italian.`,`Cooking pasta.`,`Visiting Rome.`,`Teaching Italian.`,`I am studying a little Italian now.`]]},
{id:'e18',title:'School Trip to Nara',text:`Last month, our class went to Nara on a school trip. We went there by bus. First, we visited Todaiji Temple and saw the Great Buddha. It was much bigger than I thought. Next, we went to Nara Park. There were many deer. We gave them special crackers, and one deer bowed to me. I laughed a lot. It was a wonderful trip.`,qs:[
[`奈良へは何で行きましたか。`,`バス`,`電車`,`飛行機`,`船`,`We went there by bus.`],
[`東大寺で何を見ましたか。`,`大仏`,`五重塔`,`大きな門`,`古いお城`,`we visited Todaiji Temple and saw the Great Buddha`],
[`シカにあげたものは何ですか。`,`特別なせんべい`,`にんじん`,`パン`,`草`,`We gave them special crackers.`],
[`What did one deer do?`,`It bowed to the writer.`,`It ran away.`,`It ate the writer's lunch.`,`It slept on the grass.`,`one deer bowed to me`]]},
{id:'e19',title:'Sports Day Relay',text:`Last October, we had a sports day. I was the last runner of the red team in the relay. I was very nervous. The white team was ahead of us, but I ran as fast as I could. Finally, I passed the last runner of the white team and we won! My classmates shouted, "Good job!" I was so happy. I learned that I should never give up.`,qs:[
[`筆者はリレーで何番目の走者でしたか。`,`最後の走者`,`最初の走者`,`2番目の走者`,`3番目の走者`,`I was the last runner of the red team.`],
[`走る前、筆者はどんな気持ちでしたか。`,`とてもきんちょうしていた`,`とてもねむかった`,`とてもうれしかった`,`とてもおこっていた`,`I was very nervous.`],
[`レースの結果はどうなりましたか。`,`赤組が勝った`,`白組が勝った`,`引き分けだった`,`雨で中止になった`,`I passed the last runner of the white team and we won!`],
[`What did the writer learn?`,`The writer should never give up.`,`The writer should run alone.`,`The writer should practice less.`,`The writer should not be nervous.`,`I learned that I should never give up.`]]},
{id:'e20',title:'Chorus Contest',text:`In November, we had a chorus contest at school. Our class sang a song about friends. We practiced every day for a month. At first, our voices were not together, and some students did not want to practice. Our teacher said, "Listen to each other." After that, our song became much better. We did not win first prize, but we were proud of our song.`,qs:[
[`合唱コンクールはいつありましたか。`,`11月`,`10月`,`12月`,`9月`,`In November, we had a chorus contest.`],
[`クラスは何についての歌を歌いましたか。`,`友だち`,`家族`,`季節`,`ふるさと`,`a song about friends`],
[`先生はどんなアドバイスをしましたか。`,`おたがいの声を聞くこと`,`大きな声で歌うこと`,`毎日家で練習すること`,`笑顔で歌うこと`,`Our teacher said, "Listen to each other."`],
[`How did the class feel after the contest?`,`They were proud of their song.`,`They were angry.`,`They were tired of singing.`,`They were sad about the teacher.`,`We did not win first prize, but we were proud of our song.`]]},
{id:'e21',title:'Junior High School',text:`Next April, I will enter junior high school. I am excited, but a little nervous. I will have new teachers and new classmates. I will also study English more. I want to join the tennis club because I like playing tennis with my brother. I also want to join the English club and make friends from other countries. I will do my best.`,qs:[
[`筆者はいつ中学校に入りますか。`,`来年の4月`,`来年の9月`,`今年の4月`,`再来年の4月`,`Next April, I will enter junior high school.`],
[`筆者が入りたいスポーツのクラブは何ですか。`,`テニス部`,`バスケ部`,`卓球部`,`水泳部`,`I want to join the tennis club.`],
[`筆者はなぜそのクラブに入りたいのですか。`,`兄とテニスをするのが好きだから`,`友だちが入るから`,`親にすすめられたから`,`有名な部だから`,`because I like playing tennis with my brother`],
[`What does the writer want to do in the English club?`,`Make friends from other countries.`,`Sing English songs.`,`Teach English to children.`,`Write letters to teachers.`,`make friends from other countries`]]},
{id:'e22',title:'My Grandfather\'s Farm',text:`My grandfather has a small farm in the country. He grows rice, tomatoes and sweet potatoes. Every summer, I go to his house and help him. In the morning, we pick tomatoes. They are red and sweet. In the afternoon, we swim in the river near the farm. In autumn, we dig up sweet potatoes together. My grandfather says, "Food is a gift from the earth."`,qs:[
[`祖父は何を育てていますか。`,`米、トマト、サツマイモ`,`米、キュウリ、ジャガイモ`,`麦、トマト、サツマイモ`,`米、トマト、ニンジン`,`He grows rice, tomatoes and sweet potatoes.`],
[`夏の朝に、筆者は何をしますか。`,`トマトをつむ`,`川で泳ぐ`,`米を植える`,`いもをほる`,`In the morning, we pick tomatoes.`],
[`秋には何をしますか。`,`サツマイモをほる`,`トマトを植える`,`稲かりをする`,`くりを拾う`,`In autumn, we dig up sweet potatoes together.`],
[`What does the writer's grandfather say?`,`Food is a gift from the earth.`,`Farming is very easy.`,`Rice is better than bread.`,`Summer is the best season.`,`My grandfather says, "Food is a gift from the earth."`]]},
{id:'e23',title:'Cleaning the River',text:`Last Sunday, our town had a river cleaning day. About fifty people joined it. My friends and I picked up cans, plastic bags and bottles. In two hours, we collected twenty bags of trash. After that, a woman gave us cold tea and said, "Thank you for helping our town." I felt very good. I think we should keep our town clean.`,qs:[
[`川そうじの日には何人くらい参加しましたか。`,`約50人`,`約15人`,`約500人`,`約5人`,`About fifty people joined it.`],
[`2時間で何をどれだけ集めましたか。`,`ごみ20袋`,`ごみ12袋`,`空きかん50個`,`ペットボトル20本`,`we collected twenty bags of trash`],
[`そうじのあと、女の人は筆者たちに何をくれましたか。`,`冷たいお茶`,`あたたかいスープ`,`おかし`,`ジュース`,`a woman gave us cold tea`],
[`What does the writer think?`,`We should keep our town clean.`,`We should clean only at home.`,`We should stop using cans.`,`We should not join town events.`,`I think we should keep our town clean.`]]},
{id:'e24',title:'Thank You, Our School',text:`In March, we will graduate from elementary school. I have many memories of this school. I made good friends, learned many things and enjoyed events like the sports day and the school trip. My teachers always helped me when I had trouble. I want to say thank you to them. In junior high school, I will study harder and make more good memories. I will never forget this school.`,qs:[
[`筆者はいつ小学校を卒業しますか。`,`3月`,`4月`,`12月`,`7月`,`In March, we will graduate from elementary school.`],
[`筆者は小学校でどんな行事を楽しみましたか。`,`運動会と修学旅行`,`音楽会と遠足`,`学芸会と運動会`,`水泳大会と修学旅行`,`events like the sports day and the school trip`],
[`先生はこまったときにどうしてくれましたか。`,`いつも助けてくれた`,`しかった`,`何もしなかった`,`家に送ってくれた`,`My teachers always helped me when I had trouble.`],
[`What will the writer do in junior high school?`,`Study harder and make more good memories.`,`Forget this school.`,`Join the same class.`,`Stop making friends.`,`In junior high school, I will study harder and make more good memories.`]]}
];
