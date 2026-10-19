// きょうの「一本道」と、おうちの人への「完了れんらく」を確かめる。
//   node --test tests/contact.test.mjs
// ・マストの決め方（自動で空のステージ・保護者OKの宿題は入れない）／順番／ボタンが押せる条件
// ・正答4割未満のドリルは、やりなおして4割以上とれたら数える（行き止まりにしない・XPは二重にもらわない）
// ・メールアドレスの形／mailto の作り方（宛先・件名・本文）／押した記録は「押せる状態」のときだけ
// ・アプリは自動では送らない（通信の部品を使っていない・カウントダウンは れんらくに進まない）
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCore } from '../scripts/headless.mjs';

const NAMES = ['S', 'XPST', 'backupObj', 'restoreFrom', 'pinTry', 'pinLockMin', 'mistakeXP', 'setToday', 'routeFor', 'recordAnswer', 'noteAnswer', 'completeStage', 'addDays', 'peekDay', 'dayOK', 'lowRes', 'norm', 'fresh',
  'flowState', 'mustStages', 'markContact', 'mailText', 'mailtoURL', 'mailAddrs', 'mailWho', 'cleanMail', 'validMail', 'flowName', 'reportText', 'curStreak'];
const START = '2026-10-19';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** 1つのステージを、正答率 acc で最後までやる（ドリルは答えを記録、宿題・ふりかえりはそのまま完了） */
function play(C, date, st, acc = 0.85) {
  if (st.kind === 'session' && st.items.length) {
    let ok = 0;
    const n = st.items.length, hit = Math.round(n * acc);
    st.items.forEach((it, i) => { const g = i < hit; C.recordAnswer(it, g); C.noteAnswer(g); if (g) ok++; });
    return C.completeStage(date, st.id, { ok, n, sec: n * 12, boss: !!st.boss });
  }
  return C.completeStage(date, st.id, { ok: 0, n: 0, sec: 0, min: 1 });
}
const fresh = () => { const C = loadCore(NAMES); C.setToday(START); return C; };

test('マスト：自動で空のステージは入れない。保護者OKがオンのときだけ、宿題も入れない', () => {
  const C = fresh();
  const route = C.routeFor(START);
  const off = C.mustStages(route).map((s) => s.id);
  assert.ok(off.includes('hw') && off.includes('ref') && off.includes('mem') && off.includes('math'), '暗証番号なし：宿題もマスト');
  assert.ok(C.mustStages(route).every((s) => !s.auto), '自動で空のステージはマストに入れない');
  C.S.pin = '1234'; C.S.pinOn = 1;
  const on = C.mustStages(route).map((s) => s.id);
  assert.ok(!on.includes('hw') && on.includes('ref') && on.includes('mem'), '保護者OK：宿題はおうちの人のOKがいるので、マストに入れない');
});

test('一本道：順番どおりに「つぎ」が進み、ぜんぶ終わって合格ラインに届いたときだけ ready', () => {
  const C = fresh();
  const route = C.routeFor(START), must = C.mustStages(route);
  let F = C.flowState();
  assert.equal(F.next.id, must[0].id, '最初のつぎ＝いちばん上のマスト');
  assert.equal(F.ready, false);
  assert.equal(F.steps, must.length + 0, '道にのこっている数＝マストの数（れんらくはまだ数えない）');
  assert.equal(C.markContact(START), false, 'まだ押せない：記録もできない');
  assert.equal(C.peekDay(START).ct, undefined);
  for (let i = 0; i < must.length; i++) {
    F = C.flowState();
    assert.equal(F.next.id, must[i].id, `${i + 1}つ目のつぎ`);
    assert.equal(F.ready, false, 'のこりがあるあいだは押せない');
    play(C, START, F.next);
  }
  F = C.flowState();
  assert.equal(F.next, null);
  assert.equal(F.ok, true, '正答8割台で全部やったので、合格ライン');
  assert.equal(F.ready, true);
  assert.equal(F.sent, false);
  assert.equal(F.steps, 1, 'のこりは「れんらく」だけ');
  assert.equal(C.markContact(START), true);
  const rec = C.peekDay(START);
  assert.ok(rec.ct > 0 && rec.cn === 1);
  F = C.flowState();
  assert.equal(F.sent, true);
  assert.equal(F.steps, 0);
  assert.equal(C.markContact(START), true, '押しなおしてもよい（メールが開かなかったときのため）');
  assert.equal(C.peekDay(START).cn, 2);
});

test('順番をとばしても、つぎは「まだのうちの先頭」。れんらくは、ぜんぶ終わるまで押せない', () => {
  const C = fresh();
  const must = C.mustStages(C.routeFor(START));
  play(C, START, must[must.length - 1]);   // いちばん最後を先にやる
  const F = C.flowState();
  assert.equal(F.next.id, must[0].id);
  assert.equal(F.ready, false);
  assert.equal(C.markContact(START), false);
});

test('ぜんぶ終わっても、正答4割に届かなかった日は押せない。やりなおして4割以上とれたら押せる（行き止まりにしない）', () => {
  const C = fresh();
  const route = C.routeFor(START), must = C.mustStages(route);
  must.forEach((s) => play(C, START, s, 0.1));   // ぜんぶ、てきとうに押した
  let F = C.flowState();
  assert.equal(F.all, true);
  assert.equal(F.ok, false, '正答4割未満のドリルは、合格ラインに数えない');
  assert.equal(F.ready, false);
  assert.ok(F.redo && F.redo.kind === 'session' && C.lowRes(F.redo.res), 'やりなおす先が出る');
  assert.equal(F.target, F.redo);
  assert.equal(C.markContact(START), false);
  const before = C.S.xp;
  assert.equal(C.peekDay(START).stg[F.redo.id].xp, 0, '4割未満はXPなし');
  // やりなおし（4割以上）→ 数える。XPは、ここで1回だけ入る
  const id = F.redo.id, st = route.find((s) => s.id === id);
  const r = play(C, START, st, 0.9);
  assert.equal(r.first, true, 'やりなおしは「はじめて数える」あつかい');
  assert.ok(r.xp > 0 && C.S.xp > before, 'XPが入る');
  const n = st.items.length, ok = Math.round(n * 0.9);
  assert.equal(C.peekDay(START).stg[id].xp, Math.round(C.XPST[id] * (0.4 + 0.6 * ok / n)) + (ok === n ? 10 : 0), 'そのステージのXP＝ふつうに1回クリアしたぶん（二重にならない）');
  assert.equal(C.S.xp - before, r.xp + r.fullBonus, '入ったXPは、返ってきた数と同じ');
  F = C.flowState();
  assert.equal(F.ok, true, '合格ラインに届いた（ならし期は、ドリル1つでOK）');
  assert.equal(F.ready, true);
  assert.equal(C.S.streak >= 1, true, '連続記録ものびる');
  // もう一度やっても、これ以上は数えない
  const again = play(C, START, st, 0.9);
  assert.equal(again.first, false);
  assert.equal(again.xp, 0);
});

test('てきとうに押し続けて、4割未満のやりなおしをくり返しても、XPも合格ラインも動かない', () => {
  const C = fresh();
  const route = C.routeFor(START);
  C.mustStages(route).forEach((s) => play(C, START, s, 0));
  const F = C.flowState(), st = route.find((s) => s.id === F.redo.id);
  const xp = C.S.xp;
  const r = play(C, START, st, 0.05);
  assert.equal(r.first, false);
  assert.equal(r.low, true, '「4割に届かなかった」と画面に出せる');
  assert.equal(C.S.xp, xp);
  assert.equal(C.flowState().ready, false);
});

test('合格ラインに数えられるドリルが、どうやっても作れない日は、行き止まりにしない（redoが無ければ ready）', () => {
  const C = fresh();
  // 「ふつう」期（15日目〜）で、ドリルが1つしかない日をつくる（ふつう以上は、ドリル2つ必要なので、合格ラインには届かない）
  for (let i = 0; i < 14; i++) { const d = C.addDays(START, i); C.setToday(d); C.routeFor(d).forEach((st) => play(C, d, st)); }
  const date = C.addDays(START, 14);
  C.setToday(date);
  C.routeFor(date);
  C.S.rt.stg = C.S.rt.stg.filter((p) => ['mem', 'hw', 'ref'].includes(p.id));
  assert.equal(C.S.rt.tier, 2);
  C.flowState().must.forEach((s) => play(C, date, s, 0.9));
  const F = C.flowState(date);
  assert.equal(F.all, true);
  assert.equal(F.ok, false, 'ドリル1つだけでは、ふつう期の合格ラインに届かない');
  assert.equal(F.redo, null, 'やりなおす先もない');
  assert.equal(F.ready, true, 'それでも、れんらくは押せる');
});

test('保護者OKがオンのとき：宿題はれんらくの条件に入れない。メールには「宿題はOKがまだ」と書く', () => {
  const C = fresh();
  C.S.nick = 'さくら'; C.S.pin = '4321'; C.S.pinOn = 1;
  const route = C.routeFor(START);
  C.mustStages(route).forEach((s) => play(C, START, s));
  const F = C.flowState();
  assert.equal(F.route.find((s) => s.id === 'hw').done, false, '宿題はまだ');
  assert.equal(F.ready, true, 'それでも、れんらくは押せる（おうちの人が来てからOKを入れるため）');
  assert.equal(F.hwWait, true);
  const M = C.mailText(F);
  assert.ok(/宿題は、おうちの人の OK が まだです/.test(M.body));
  assert.ok(!M.body.includes('4321') && !M.text.includes('4321'), '暗証番号は、文に入れない');
  // 暗証番号なしなら、宿題もマスト：やるまで押せない
  const C2 = fresh();
  C2.mustStages(C2.routeFor(START)).filter((s) => s.id !== 'hw').forEach((s) => play(C2, START, s));
  assert.equal(C2.flowState().ready, false, '宿題がまだ');
  assert.equal(C2.flowState().next.id, 'hw');
});

test('メールアドレス：形を確かめる（全角・空白は直す。複数・改行・ヘッダ注入はだめ）', () => {
  const C = fresh();
  assert.equal(C.cleanMail('  Ａｂｃ＠Example.com '), 'Abc@Example.com', '全角と空白を直す');
  for (const ok of ['a@b.com', 'taro.yamada+quiz@mail.example.co.jp', 'a_b-c@sub.domain.jp', 'x..y@ezweb.ne.jp'])
    assert.ok(C.validMail(ok), ok + ' はOK');
  for (const ng of ['', 'a', 'a@b', '@b.com', 'a@b..', 'a@b.com,c@d.com', 'a@b.com;c@d.com', 'a@b.com\nbcc:x@y.com', 'a@b.com?cc=x@y.com', '<a@b.com>', 'a@b.c%0Abcc:x@y.com', 'a@b.com&body=1'])
    assert.ok(!C.validMail(C.cleanMail(ng)), JSON.stringify(ng) + ' はだめ');
  for (const raw of ['a b@c.com', 'a@b.com\n', 'a@b.com\nbcc:x@y.com'])
    assert.ok(!C.validMail(raw), '空白・改行が入ったままの ' + JSON.stringify(raw) + ' はだめ（保存の前に、空白は取りのぞく）');
  C.S.mail = { f: 'otosan@example.com', m: ' okasan@example.com ' };
  assert.deepEqual([...C.mailAddrs()], ['okasan@example.com', 'otosan@example.com'], 'おかあさん・おとうさんの順');
  assert.equal(C.mailWho(), 'おかあさん・おとうさん');
  C.S.mail = { f: 'otosan@example.com', m: 'otosan@example.com' };
  assert.equal(C.mailAddrs().length, 1, '同じアドレスは1つにまとめる');
  C.S.mail = { f: 'otosan@example.com', m: 'こわれた' };
  assert.equal(C.mailWho(), 'おとうさん');
  C.S.mail = { f: '', m: 'okasan@example.com' };
  assert.equal(C.mailWho(), 'おかあさん');
  C.S.mail = { f: '', m: '' };
  assert.equal(C.mailAddrs().length, 0);
});

test('mailto：宛先は , でつなぎ、件名・本文は1つずつ正しく符号化される', () => {
  const C = fresh();
  C.S.nick = 'さくら'; C.S.mail = { f: 'otosan@example.com', m: 'okasan@example.com' };
  C.mustStages(C.routeFor(START)).forEach((s) => play(C, START, s, 0.8));
  const F = C.flowState(), M = C.mailText(F), url = C.mailtoURL(C.mailAddrs(), M);
  assert.ok(url.startsWith('mailto:okasan@example.com,otosan@example.com?subject='));
  assert.ok(!/[\s"<>]/.test(url), 'URLに空白・改行・引用符が残っていない');
  const [head, q] = url.split('?'), params = q.split('&');
  assert.equal(params.length, 2, 'subject と body だけ（本文の & で枝分かれしない）');
  assert.equal(decodeURIComponent(params[0].slice('subject='.length)), M.subject);
  assert.equal(decodeURIComponent(params[1].slice('body='.length)), M.body.replace(/\n/g, '\r\n'), '本文の改行は CRLF');
  assert.ok(url.length < 2300, 'メールアプリに渡せる長さ');
  assert.ok(M.subject.includes('さくら'), '件名に呼び名');
  for (const s of F.must) assert.ok(M.body.includes(C.flowName(s)), C.flowName(s) + ' が本文に入っている');
  assert.ok(/せいかい \d+\/\d+（\d+%）/.test(M.body), '正答の数と率が入っている（自己申告ではなく、記録から）');
  assert.ok(M.body.startsWith('おかあさん・おとうさんへ'));
  assert.ok(M.text.startsWith(M.subject));
  // 呼び名なしなら、件名にかっこを付けない
  C.S.nick = '';
  assert.ok(!/（.*）$/.test(C.mailText(F).subject));
});

test('週報に「完了れんらく」の日数が出る', () => {
  const C = fresh();
  const must = C.mustStages(C.routeFor(START));
  must.forEach((s) => play(C, START, s));
  assert.ok(/完了れんらく（子どもがボタンを押した日）：0\/7日/.test(C.reportText()));
  C.markContact(START);
  assert.ok(/完了れんらく（子どもがボタンを押した日）：1\/7日/.test(C.reportText()));
});

test('設定の保存：メールの宛先・自動でつなぐ のはじめの値。古いバックアップにも入る', () => {
  const C = fresh();
  const a = C.norm({});
  assert.deepEqual({ ...a.mail }, { f: '', m: '' });
  assert.equal(a.flowAuto, 1);
  const b = C.norm({ mail: { f: 'a@b.com' }, flowAuto: 0 });
  assert.deepEqual({ ...b.mail }, { f: 'a@b.com', m: '' });
  assert.equal(b.flowAuto, 0);
});

test('自動では送らない：通信の部品を使っていない／自動でつなぐ処理は れんらくに進まない', () => {
  const dir = path.join(root, 'src/js');
  const all = fs.readdirSync(dir).filter((f) => f.endsWith('.js')).map((f) => [f, fs.readFileSync(path.join(dir, f), 'utf8')]);
  const html = ['head.html', 'body.html'].map((f) => fs.readFileSync(path.join(root, 'src', f), 'utf8')).join('');
  for (const [f, src] of all) {
    assert.ok(!/\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket|EventSource|importScripts/.test(src), f + '：通信をしている');
  }
  assert.ok(!/<form\b|\.submit\s*\(/.test(html + all.map((x) => x[1]).join('')), 'フォーム送信を使っていない');
  const flowJs = fs.readFileSync(path.join(dir, '58-flow.js'), 'utf8');
  const tick = flowJs.slice(flowJs.indexOf('function flowCdTick'), flowJs.indexOf('function flowCdStop'));
  assert.ok(tick.includes('ACT.flowGo') && !/contact|mail|markContact/i.test(tick), 'カウントダウンが呼ぶのは「つぎへ」だけ');
  // 「押した」の記録は、押せる状態のときだけ。呼び出し元は、クリックの処理（ACT・リンクのクリック）だけ
  const callers = all.filter(([f, s]) => /contactMark\s*\(/.test(s.replace(/function contactMark\s*\(/, ''))).map((x) => x[0]);
  assert.deepEqual(callers.sort(), ['59-main.js']);
  const mainJs = all.find((x) => x[0] === '59-main.js')[1];
  const seg = (a, b) => mainJs.slice(mainJs.indexOf(a), mainJs.indexOf(b));
  const count = (t) => (t.match(/contactMark\s*\(/g) || []).length;
  const allowed = [seg(' async mailCopy(', ' async mailShare('), seg(' async mailShare(', ' mailSetup('), ...mainJs.split('\n').filter((l) => l.includes('data-mailsent'))].map(count).reduce((a, b) => a + b, 0);
  assert.ok(allowed >= 3 && count(mainJs) === allowed, 'contactMark は、コピー・共有・メールを開くリンクのクリックでだけ呼ぶ');
  assert.ok(!/setTimeout\([^)]*contactMark|setInterval\([^)]*contactMark/.test(mainJs + flowJs), 'タイマーから呼ばない');
});

test('バックアップに暗証番号は入らない。復元しても、いまの端末の暗証番号はそのまま（文字列を読んで暗証番号を知られない）', () => {
  const C = fresh();
  C.S.pin = '4321'; C.S.pinOn = 1; C.S.pinSkip = '2026-10-01'; C.S.xp = 777; C.S.mail = { f: 'a@example.com', m: '' };
  const text = JSON.stringify(C.backupObj());
  assert.ok(!text.includes('4321'), 'pin の値が文字列に入っていない');
  assert.ok(!/"pin(On|Skip|Fail)?"/.test(text), 'pin・pinOn・pinSkip・pinFail のキー自体が入っていない');
  assert.ok(text.includes('"xp":777') && text.includes('a@example.com'), '記録と宛先は入る');
  // 古いバックアップ（暗証番号が入っているもの）を復元しても、いまの端末の設定が残る
  const old = JSON.parse(text); old.pin = '0000'; old.pinOn = 0; old.xp = 5;
  const n = C.restoreFrom(old);
  assert.equal(n.pin, '4321'); assert.equal(n.pinOn, 1); assert.equal(n.xp, 5);
  assert.equal(n.mail.f, 'a@example.com');
  // 暗証番号を決めていない端末では、復元しても暗証番号はつかない
  const D = fresh(); const m = D.restoreFrom({ xp: 9, pin: '1111', pinOn: 1 });
  assert.ok(!m.pin && !m.pinOn);
});

test('やりなおしたとき：1回目の結果がのこり、メールに「1回目 1/7→やりなおし」と書く。自分でつけるものは、そう書く', () => {
  const C = fresh();
  C.S.nick = 'さくら';
  const route = C.routeFor(START), must = C.mustStages(route);
  must.forEach((s) => play(C, START, s, s.id === 'mem' ? 0.1 : 0.9));   // 暗記だけ、てきとうに押した
  const mem = route.find((s) => s.id === 'mem'), first = { ...C.peekDay(START).stg.mem };
  assert.ok(C.lowRes(first), '1回目は4割未満');
  assert.equal(first.f, undefined, '1回目には、f（やりなおし前の結果）はない');
  play(C, START, mem, 0.95);   // やりなおし
  const now = C.peekDay(START).stg.mem;
  assert.deepEqual({ ...now.f }, { ok: first.ok, n: first.n }, '1回目の結果がのこる');
  play(C, START, mem, 0.95);   // もう一度やっても、1回目の記録は変わらない
  assert.deepEqual({ ...C.peekDay(START).stg.mem.f }, { ok: first.ok, n: first.n });
  C.S.refl[START] = { t: 'x', s: 4, d: 3 };
  const M = C.mailText(C.flowState());
  assert.ok(new RegExp('暗記バトル　\\d+/\\d+（1回目 ' + first.ok + '/' + first.n + '→やりなおし）').test(M.body), M.body);
  assert.ok(/数学ドリル　\d+\/\d+\n/.test(M.body) && !/数学ドリル.*1回目/.test(M.body), 'やりなおしていないドリルには、1回目と書かない');
  assert.ok(/宿題・提出物（じぶんでチェック）/.test(M.body), '宿題は、じぶんでチェックしたと分かる');
  assert.ok(/ふりかえり　自分4点／データ3点/.test(M.body), 'ふりかえりは、自分の点とデータの点');
});

test('やりなおしのセッションは、おぼえ具合（箱）・答えた数に記録しない（見たばかりの答えを、もう一度答えるだけなので）', () => {
  const src = fs.readFileSync(path.join(root, 'src/js/52-player.js'), 'utf8');
  const f = src.slice(src.indexOf('function answerQ'), src.indexOf('function showFb'));
  assert.ok(f.includes('PL.o.redo') && f.includes('recordAnswer(') && f.includes('noteAnswer('));
  assert.ok(f.indexOf('PL.o.redo') < f.indexOf('recordAnswer('), 'redo の判定が、記録より前にある');
  assert.ok(fs.readFileSync(path.join(root, 'src/js/58-flow.js'), 'utf8').includes('redo:redo'), 'startStage が redo を渡している');
});

test('暗証番号：5回まちがえたら10分ロック。ロック中は正しい番号でも通らない。時間がたつか、成功すれば回数がもどる', () => {
  const C = fresh(); C.S.pin = '4321'; C.S.pinOn = 1;
  for (let i = 0; i < 4; i++) assert.equal(C.pinTry('0000'), 'ng');
  assert.equal(C.pinTry('4321'), 'ok', '4回まちがえたあとでも、正しければ通り、回数はもどる');
  for (let i = 0; i < 4; i++) assert.equal(C.pinTry('1111'), 'ng');
  assert.equal(C.pinTry('2222'), 'lock', '5回目のまちがいでロック');
  assert.equal(C.pinTry('4321'), 'lock', 'ロック中は、正しい番号でも通らない');
  assert.ok(C.pinLockMin() >= 9 && C.pinLockMin() <= 10, 'のこりは約10分');
  C.S.pinFail.until = Date.now() - 1;   // 時間がたった
  assert.equal(C.pinTry('4321'), 'ok');
  assert.equal(C.pinLockMin(), 0);
});

test('学校のテストのミスの登録：XPは1日1回だけ（何回登録しても、かせげない）', () => {
  const C = fresh();
  const a = C.mistakeXP(START), xp1 = C.S.xp;
  assert.equal(a.xp, 5); assert.equal(xp1, 5);
  for (let i = 0; i < 30; i++) assert.equal(C.mistakeXP(START).xp, 0);
  assert.equal(C.S.xp, 5, '30回登録しても、XPはふえない');
  assert.equal(C.mistakeXP(C.addDays(START, 1)).xp, 5, 'つぎの日は、また1回');
  assert.equal(C.S.xp, 10);
});

test('メール文：きょうの量（ならし／ふつう／しっかり）と、ミニの日を書く', () => {
  const C = fresh();
  const route = C.routeFor(START);
  C.mustStages(route).forEach((s) => play(C, START, s));
  assert.ok(/・きょうの量：ならし\n/.test(C.mailText(C.flowState()).body) || /・きょうの量：ならし$/m.test(C.mailText(C.flowState()).body));
  const D = fresh();
  D.S.light[START] = 1;
  D.mustStages(D.routeFor(START)).forEach((s) => play(D, START, s));
  assert.ok(/・きょうの量：ならし（ミニの日）/.test(D.mailText(D.flowState()).body), 'ミニの日と分かる');
});

test('メール文は、ならし・ふつう・しっかりのどの日でも短い（mailto が長くなりすぎない）。日付は「10/19 月」の形', () => {
  const C = fresh();
  C.S.nick = 'さくらさくら'; C.S.mail = { f: 'otosan@example.com', m: 'okasan@example.com' }; C.S.pin = '1234'; C.S.pinOn = 1;
  let max = 0;
  for (let i = 0; i < 45; i++) {
    const d = C.addDays(START, i); C.setToday(d);
    for (const st of C.routeFor(d)) play(C, d, st, i % 3 === 0 ? 0.2 : 0.85);
    const F = C.flowState(d), M = C.mailText(F, d), u = C.mailtoURL(C.mailAddrs(), M);
    max = Math.max(max, u.length);
    assert.ok(/きょう（\d+\/\d+ [日月火水木金土]）の ノルマ/.test(M.body), M.body.split('\n')[2]);
  }
  assert.ok(max < 2300, `45日のうち最長のURLが ${max} 文字`);
});
