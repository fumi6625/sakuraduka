// きょうの「一本道」と、暗証番号・抜け道の対策を確かめる。
//   node --test tests/contact.test.mjs
// ・マストの決め方（自動で空のステージ・保護者OKの宿題は入れない）／順番／ボタンが押せる条件
// ・正答4割未満のドリルは、やりなおして4割以上とれたら数える（行き止まりにしない・XPは二重にもらわない）
// ・アプリは自動では送らない（通信の部品を使っていない・カウントダウンは れんらくに進まない）
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCore } from '../scripts/headless.mjs';

const NAMES = ['S', 'XPST', 'backupObj', 'restoreFrom', 'pinTry', 'pinLockMin', 'mistakeXP', 'setToday', 'routeFor', 'recordAnswer', 'noteAnswer', 'completeStage', 'addDays', 'peekDay', 'dayOK', 'lowRes', 'norm', 'fresh',
  'flowState', 'mustStages', 'flowName', 'reportText', 'curStreak'];
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

test('一本道：順番どおりに「つぎ」が進み、ぜんぶ終わってクリアラインに届いたときだけ ready', () => {
  const C = fresh();
  const route = C.routeFor(START), must = C.mustStages(route);
  let F = C.flowState();
  assert.equal(F.next.id, must[0].id, '最初のつぎ＝いちばん上のマスト');
  assert.equal(F.ready, false);
  assert.equal(F.steps, must.length);
  for (let i = 0; i < must.length; i++) {
    F = C.flowState();
    assert.equal(F.next.id, must[i].id, `${i + 1}つ目のつぎ`);
    assert.equal(F.ready, false, 'のこりがあるあいだは押せない');
    play(C, START, F.next);
  }
  F = C.flowState();
  assert.equal(F.next, null);
  assert.equal(F.ok, true, '正答8割台で全部やったので、クリアライン');
  assert.equal(F.ready, true);
  assert.equal(F.steps, 0);
});

test('順番をとばしても、つぎは「まだのうちの先頭」。れんらくは、ぜんぶ終わるまで押せない', () => {
  const C = fresh();
  const must = C.mustStages(C.routeFor(START));
  play(C, START, must[must.length - 1]);   // いちばん最後を先にやる
  const F = C.flowState();
  assert.equal(F.next.id, must[0].id);
  assert.equal(F.ready, false);
});

test('ぜんぶ終わっても、正答4割に届かなかった日は押せない。やりなおして4割以上とれたら押せる（行き止まりにしない）', () => {
  const C = fresh();
  const route = C.routeFor(START), must = C.mustStages(route);
  must.forEach((s) => play(C, START, s, 0.1));   // ぜんぶ、てきとうに押した
  let F = C.flowState();
  assert.equal(F.all, true);
  assert.equal(F.ok, false, '正答4割未満のドリルは、クリアラインに数えない');
  assert.equal(F.ready, false);
  assert.ok(F.redo && F.redo.kind === 'session' && C.lowRes(F.redo.res), 'やりなおす先が出る');
  assert.equal(F.target, F.redo);
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
  assert.equal(F.ok, true, 'クリアラインに届いた（ならし期は、ドリル1つでOK）');
  assert.equal(F.ready, true);
  assert.equal(C.S.streak >= 1, true, '連続記録ものびる');
  // もう一度やっても、これ以上は数えない
  const again = play(C, START, st, 0.9);
  assert.equal(again.first, false);
  assert.equal(again.xp, 0);
});

test('てきとうに押し続けて、4割未満のやりなおしをくり返しても、XPもクリアラインも動かない', () => {
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

test('クリアラインに数えられるドリルが、どうやっても作れない日は、行き止まりにしない（redoが無ければ ready）', () => {
  const C = fresh();
  // 「ふつう」期（15日目〜）で、ドリルが1つしかない日をつくる（ふつう以上は、ドリル2つ必要なので、クリアラインには届かない）
  for (let i = 0; i < 14; i++) { const d = C.addDays(START, i); C.setToday(d); C.routeFor(d).forEach((st) => play(C, d, st)); }
  const date = C.addDays(START, 14);
  C.setToday(date);
  C.routeFor(date);
  C.S.rt.stg = C.S.rt.stg.filter((p) => ['mem', 'hw', 'ref'].includes(p.id));
  assert.equal(C.S.rt.tier, 2);
  C.flowState().must.forEach((s) => play(C, date, s, 0.9));
  const F = C.flowState(date);
  assert.equal(F.all, true);
  assert.equal(F.ok, false, 'ドリル1つだけでは、ふつう期のクリアラインに届かない');
  assert.equal(F.redo, null, 'やりなおす先もない');
  assert.equal(F.ready, true, 'それでも、れんらくは押せる');
});

test('保護者OKがオンのとき：宿題は一本道に入れない（hwWait で、おうちの人に見せる案内を出す）', () => {
  const C = fresh();
  C.S.nick = 'さくら'; C.S.pin = '4321'; C.S.pinOn = 1;
  const route = C.routeFor(START);
  C.mustStages(route).forEach((s) => play(C, START, s));
  const F = C.flowState();
  assert.equal(F.route.find((s) => s.id === 'hw').done, false, '宿題はまだ');
  assert.equal(F.ready, true, '宿題がまだでも、一本道は終わり');
  assert.equal(F.hwWait, true);
  // 暗証番号なしなら、宿題もマスト：やるまで押せない
  const C2 = fresh();
  C2.mustStages(C2.routeFor(START)).filter((s) => s.id !== 'hw').forEach((s) => play(C2, START, s));
  assert.equal(C2.flowState().ready, false, '宿題がまだ');
  assert.equal(C2.flowState().next.id, 'hw');
});

test('設定の保存：自動でつなぐ のはじめの値', () => {
  const C = fresh();
  assert.equal(C.norm({}).flowAuto, 1);
  assert.equal(C.norm({ flowAuto: 0 }).flowAuto, 0);
});

test('通信をしない（メールの自動送信などの部品を使っていない）。自動でつなぐ処理は、つぎのステージを始めるだけ', () => {
  const dir = path.join(root, 'src/js');
  const all = fs.readdirSync(dir).filter((f) => f.endsWith('.js')).map((f) => [f, fs.readFileSync(path.join(dir, f), 'utf8')]);
  const html = ['head.html', 'body.html'].map((f) => fs.readFileSync(path.join(root, 'src', f), 'utf8')).join('');
  for (const [f, src] of all) assert.ok(!/\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket|EventSource|importScripts|mailto:/.test(src), f + '：通信・メールを使っている');
  assert.ok(!/<form\b|\.submit\s*\(/.test(html + all.map((x) => x[1]).join('')), 'フォーム送信を使っていない');
  const flowJs = fs.readFileSync(path.join(dir, '58-flow.js'), 'utf8');
  const tick = flowJs.slice(flowJs.indexOf('function flowCdTick'), flowJs.indexOf('function flowCdStop'));
  assert.ok(tick.includes('ACT.flowGo'), 'カウントダウンが呼ぶのは「つぎへ」');
});

test('バックアップに暗証番号は入らない。復元しても、いまの端末の暗証番号はそのまま（文字列を読んで暗証番号を知られない）', () => {
  const C = fresh();
  C.S.pin = '4321'; C.S.pinOn = 1; C.S.pinSkip = '2026-10-01'; C.S.xp = 777;
  const text = JSON.stringify(C.backupObj());
  assert.ok(!text.includes('4321'), 'pin の値が文字列に入っていない');
  assert.ok(!/"pin(On|Skip|Fail)?"/.test(text), 'pin・pinOn・pinSkip・pinFail のキー自体が入っていない');
  assert.ok(text.includes('"xp":777') , '記録と宛先は入る');
  // 古いバックアップ（暗証番号が入っているもの）を復元しても、いまの端末の設定が残る
  const old = JSON.parse(text); old.pin = '0000'; old.pinOn = 0; old.xp = 5;
  const n = C.restoreFrom(old);
  assert.equal(n.pin, '4321'); assert.equal(n.pinOn, 1); assert.equal(n.xp, 5);
  // 暗証番号を決めていない端末では、復元しても暗証番号はつかない
  const D = fresh(); const m = D.restoreFrom({ xp: 9, pin: '1111', pinOn: 1 });
  assert.ok(!m.pin && !m.pinOn);
});

test('やりなおしたとき：1回目の結果が f にのこる', () => {
  const C = fresh();
  const route = C.routeFor(START), must = C.mustStages(route);
  must.forEach((s) => play(C, START, s, s.id === 'mem' ? 0.1 : 0.9));
  const mem = route.find((s) => s.id === 'mem'), first = { ...C.peekDay(START).stg.mem };
  assert.ok(C.lowRes(first), '1回目は4割未満');
  assert.equal(first.f, undefined);
  play(C, START, mem, 0.95);
  assert.deepEqual({ ...C.peekDay(START).stg.mem.f }, { ok: first.ok, n: first.n });
  play(C, START, mem, 0.95);
  assert.deepEqual({ ...C.peekDay(START).stg.mem.f }, { ok: first.ok, n: first.n });
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

