/* 英語の長文  qs の並び：[問い, 正解, 誤1, 誤2, 誤3, 解説] */
const PASS_E=[
{id:'e01',title:'A Trip to Kyoto',text:`Last Sunday, I went to Kyoto with my family. We took a train from Osaka, and it took about forty minutes. First, we visited a famous temple. There were many people from foreign countries. I took a lot of pictures there. For lunch, we ate soba at a small restaurant. In the afternoon, we walked in a bamboo forest. It was very quiet and beautiful. I want to visit Kyoto again in autumn.`,qs:[
[`筆者は京都までどうやって行きましたか。`,`電車で`,`バスで`,`車で`,`自転車で`,`We took a train from Osaka.（電車で行った）`],
[`筆者は昼食に何を食べましたか。`,`そば`,`うどん`,`ラーメン`,`すし`,`we ate soba（そばを食べた）`],
[`筆者は午後、どこを歩きましたか。`,`竹林`,`公園`,`川沿い`,`商店街`,`walked in a bamboo forest（竹林を歩いた）`],
[`筆者が次に京都へ行きたいのはいつですか。`,`秋`,`春`,`夏`,`冬`,`visit Kyoto again in autumn（秋にまた行きたい）`]]},
{id:'e02',title:'My Dream',text:`I want to be a vet in the future. I love animals, and I have a dog named Pochi. When Pochi was sick last year, a kind vet helped him. I was very moved. Now I volunteer at an animal shelter every Saturday. I wash dogs and walk with them. It is hard work, but I am happy to see them smile. To become a vet, I must study science and English hard.`,qs:[
[`筆者の将来の夢は何ですか。`,`獣医になること`,`医者になること`,`先生になること`,`歌手になること`,`I want to be a vet（獣医になりたい）`],
[`筆者が毎週土曜日にしていることは何ですか。`,`動物保護施設でボランティアをする`,`犬を飼う`,`病院で働く`,`英語を教える`,`volunteer at an animal shelter every Saturday`],
[`獣医になるために、筆者は何を一生懸命勉強しなければなりませんか。`,`理科と英語`,`数学と国語`,`社会と音楽`,`美術と体育`,`I must study science and English hard.`],
[`去年ポチが病気のとき、だれが助けてくれましたか。`,`やさしい獣医`,`筆者の友だち`,`筆者の姉`,`先生`,`a kind vet helped him`]]},
{id:'e03',title:'A New Classmate',text:`Emma is a new student in our class. She came from Canada last month. She speaks Japanese a little, and she is learning it every day. At lunch time, she tried to eat with chopsticks, but it was difficult. We showed her how to use them. After many tries, she could pick up a small bean! She said, "Thank you. I'm happy to be your friend." Now she is a member of our baseball club. She is the best pitcher in the club.`,qs:[
[`エマはどこから来ましたか。`,`カナダ`,`アメリカ`,`オーストラリア`,`イギリス`,`She came from Canada last month.`],
[`エマが昼食で難しいと感じたことは何ですか。`,`はしを使うこと`,`日本語を読むこと`,`歩いて帰ること`,`野球をすること`,`she tried to eat with chopsticks, but it was difficult`],
[`エマが入っている部活は何ですか。`,`野球部`,`サッカー部`,`テニス部`,`吹奏楽部`,`a member of our baseball club`],
[`本文の内容に合うものはどれですか。`,`エマは野球部でいちばん上手な投手だ`,`エマは日本語がまったく話せない`,`エマは先月日本へ来た男の子だ`,`エマははしを使うのが得意だ`,`the best pitcher in the club`]]},
{id:'e04',title:'The School Festival',text:`Our school festival was held last week. My class opened a cafe. We worked for two weeks to prepare for it. Ken made colorful posters, and Yuki decorated the room with flowers. I was in charge of tea. On the first day, only twenty people came. So we walked around the school with signs. On the second day, many people visited us, and we sold two hundred cups of tea! I learned that working together is important.`,qs:[
[`筆者のクラスは学園祭で何をしましたか。`,`カフェを開いた`,`劇をした`,`お化け屋敷をした`,`映画を上映した`,`My class opened a cafe.`],
[`筆者は何を担当しましたか。`,`お茶`,`ポスター`,`花のかざりつけ`,`会計`,`I was in charge of tea.`],
[`2日目に売れたお茶は何杯ですか。`,`200杯`,`20杯`,`2杯`,`220杯`,`we sold two hundred cups of tea`],
[`筆者が学んだことは何ですか。`,`協力することの大切さ`,`お金の大切さ`,`早起きの大切さ`,`英語の大切さ`,`working together is important`]]},
{id:'e05',title:'Recycling at Our School',text:`In our school, students collect plastic bottles every Friday. We wash the bottles and put them in a big box. Last year, we collected about 3,000 bottles. A company made them into new things, like T-shirts and bags. Our teacher said, "A plastic bottle can have a second life." Now, many students bring their own water bottles, so we use fewer plastic bottles. I think we should think about the earth more.`,qs:[
[`生徒たちは毎週何曜日にペットボトルを集めますか。`,`金曜日`,`月曜日`,`水曜日`,`日曜日`,`every Friday`],
[`昨年、約何本のペットボトルが集まりましたか。`,`3,000本`,`300本`,`30,000本`,`1,300本`,`about 3,000 bottles`],
[`会社はペットボトルを何にしましたか。`,`Tシャツやかばん`,`机やいす`,`ペンやノート`,`おもちゃや靴`,`T-shirts and bags`],
[`今、多くの生徒がしていることは何ですか。`,`自分の水筒を持ってくる`,`ペットボトルをたくさん買う`,`会社で働く`,`ごみを燃やす`,`bring their own water bottles`]]},
{id:'e06',title:'A Letter from Australia',text:`Dear Ken, How are you? I'm in Sydney now. It's December, but it is summer here! Yesterday was Christmas Day. My family went to the beach, and we swam in the sea. We also had a barbecue. It was very different from Christmas in Japan. I miss you. Please write to me soon. Your friend, Mike`,qs:[
[`マイクは今どこにいますか。`,`シドニー`,`東京`,`ロンドン`,`ニューヨーク`,`I'm in Sydney now.`],
[`オーストラリアの12月はどんな季節ですか。`,`夏`,`冬`,`春`,`秋`,`It's December, but it is summer here!`],
[`マイクの家族はクリスマスに何をしましたか。`,`海で泳いでバーベキューをした`,`スキーをした`,`家でケーキを作った`,`映画を見た`,`swam in the sea / had a barbecue`],
[`マイクはケンに何をしてほしいと言っていますか。`,`すぐに手紙を書いてほしい`,`オーストラリアに来てほしい`,`写真を送ってほしい`,`電話してほしい`,`Please write to me soon.`]]},
{id:'e07',title:'My Grandmother\'s Garden',text:`My grandmother has a small garden behind her house. She grows tomatoes, cucumbers, and many kinds of flowers. Every weekend, I visit her and help with the work. At first, I didn't like it because I got dirty. But last summer, she gave me a big tomato from the garden. It was so sweet and fresh! Now I enjoy working in the garden. My grandmother says, "Plants need time and love, just like people."`,qs:[
[`祖母の庭はどこにありますか。`,`家の裏`,`学校の近く`,`駅のそば`,`公園の中`,`behind her house`],
[`筆者が最初、手伝いを好きではなかった理由は何ですか。`,`体がよごれるから`,`つかれるから`,`暑いから`,`虫がこわいから`,`I didn't like it because I got dirty.`],
[`昨年の夏、祖母は筆者に何をくれましたか。`,`大きなトマト`,`花束`,`きゅうり`,`ケーキ`,`she gave me a big tomato`],
[`祖母の言葉の意味に最も近いものはどれですか。`,`植物にも人にも時間と愛情が必要だ`,`植物は人より強い`,`庭の仕事は簡単だ`,`人は植物から学べない`,`Plants need time and love, just like people.`]]},
{id:'e08',title:'Learning to Ride a Bike',text:`When I was seven, I couldn't ride a bike. My friends could ride, and I felt sad. My father said, "Let's practice together." Every evening, we went to the park. I fell down many times, and my knees hurt. I wanted to give up. But my father said, "You can do it. Don't stop." After two weeks, I finally rode the bike without his help. He clapped his hands and smiled. I will never forget that day.`,qs:[
[`筆者は何歳のとき自転車に乗れませんでしたか。`,`7歳`,`5歳`,`10歳`,`12歳`,`When I was seven`],
[`筆者は練習をどこでしましたか。`,`公園`,`学校の校庭`,`家の中`,`駅前`,`we went to the park`],
[`筆者が自転車に乗れるようになるまで、どのくらいかかりましたか。`,`2週間`,`2日`,`2か月`,`1年`,`After two weeks`],
[`筆者が「その日を忘れない」と言っているのはなぜですか。`,`父と練習して成功した日だから`,`自転車をもらった日だから`,`けがをした日だから`,`友だちに勝った日だから`,`父と練習し、ついに自分で乗れた日。`]]},
{id:'e09',title:'A Surprising Present',text:`Last month was my birthday. My best friend Aya gave me a small box. I opened it and found an old book. On the cover, there was a note: "This is the first book I read in English." I was surprised because I knew the book was very special for her. I asked, "Why do you give it to me?" She answered, "Because you also love English. I hope you will enjoy it." I was very happy and said, "Thank you. I will take good care of it."`,qs:[
[`アヤは筆者に何をあげましたか。`,`古い本`,`新しい本`,`ペン`,`ノート`,`found an old book`],
[`本の表紙にはどんなメモがありましたか。`,`彼女が初めて英語で読んだ本だ`,`彼女が好きな色の本だ`,`彼女のお気に入りの歌手の本だ`,`彼女が祖母からもらった本だ`,`This is the first book I read in English.`],
[`アヤが本をあげた理由は何ですか。`,`筆者も英語が好きだから`,`筆者の誕生日が近いから`,`本が重いから`,`もう読み終わったから`,`Because you also love English.`],
[`筆者は最後にどう言いましたか。`,`大切にする`,`返す`,`売る`,`読まない`,`I will take good care of it.`]]},
{id:'e10',title:'Volunteer Day',text:`Last Sunday, our class joined a volunteer activity at the beach. At first, the beach looked beautiful, but we found many cans, bottles, and plastic bags. In two hours, we filled thirty bags with garbage. A man who lives near the beach said, "Thank you. You made the beach clean again." I felt proud. I learned that one small action can change a place. I will not throw away garbage anywhere.`,qs:[
[`クラスは日曜日にどこで活動しましたか。`,`浜辺`,`公園`,`川`,`学校`,`at the beach`],
[`2時間でどれくらいのごみを集めましたか。`,`30袋`,`3袋`,`13袋`,`300袋`,`we filled thirty bags with garbage`],
[`浜辺の近くに住む男性は何と言いましたか。`,`ありがとう。浜辺がきれいになった`,`ごみを持ち帰って`,`また来てください`,`もう少し働いて`,`Thank you. You made the beach clean again.`],
[`筆者が学んだことは何ですか。`,`小さな行動が場所を変える`,`大人は何もしない`,`ごみはなくならない`,`友だちは大切だ`,`one small action can change a place`]]},
{id:'e11',title:'Life in Space',text:`Astronauts live on the International Space Station for about six months. In space, there is almost no gravity, so everything floats. Astronauts sleep in sleeping bags that are fixed to the wall. They also exercise for about two hours every day. Why? Without gravity, muscles and bones become weak. Food is another problem. They cannot cook with fire, so most of their meals are dried or packed in special bags. Even so, many astronauts say that looking at the earth from space is the best part of their job.`,qs:[
[`宇宙飛行士は国際宇宙ステーションに約どのくらい滞在しますか。`,`約6か月`,`約6日`,`約6週間`,`約6年`,`for about six months`],
[`宇宙飛行士が毎日約2時間運動する理由は何ですか。`,`無重力では筋肉や骨が弱くなるから`,`時間が余るから`,`寒いから`,`食事を消化するため`,`Without gravity, muscles and bones become weak.`],
[`宇宙での食事について正しいものはどれですか。`,`火を使えないので、乾燥食品や特別な袋に入った食事が多い`,`毎日火で調理する`,`地球から料理人が来る`,`食事はしない`,`They cannot cook with fire.`],
[`多くの宇宙飛行士が仕事でいちばんよいと言うことは何ですか。`,`宇宙から地球を見ること`,`眠ること`,`運動すること`,`食事をすること`,`looking at the earth from space is the best part`]]},
{id:'e12',title:'Why We Need Sleep',text:`Many students stay up late to study or play games. However, sleep is very important for teenagers. Scientists say that students aged thirteen to eighteen need eight to ten hours of sleep every night. While we sleep, our brains organize what we have learned during the day. If we do not sleep enough, it becomes difficult to remember things and to concentrate. That is why a good night's sleep is more helpful than studying until midnight.`,qs:[
[`13歳から18歳の生徒は、1日何時間の睡眠が必要だと書かれていますか。`,`8〜10時間`,`5〜6時間`,`11〜12時間`,`3〜4時間`,`eight to ten hours of sleep every night`],
[`眠っている間に脳は何をしますか。`,`日中に学んだことを整理する`,`何もしない`,`新しいことを学ぶ`,`体を動かす`,`our brains organize what we have learned during the day`],
[`睡眠が足りないとどうなりますか。`,`覚えることや集中することが難しくなる`,`背が高くなる`,`体重が増える`,`夢をよく見る`,`it becomes difficult to remember things and to concentrate`],
[`筆者がいちばん言いたいことは何ですか。`,`夜ふかしの勉強より、十分な睡眠が役に立つ`,`もっと遅くまで勉強すべきだ`,`ゲームは勉強に役立つ`,`睡眠は短いほどよい`,`a good night's sleep is more helpful than studying until midnight`]]}
];
