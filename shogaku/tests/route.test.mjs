// 毎日のルート・段階（ならし→ふつう→しっかり）・クリアライン・ツッコミバトルの動きを確かめる。
//   node --test tests/route.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadCore } from '../scripts/headless.mjs';

const NAMES = ['S', 'setToday', 'routeFor', 'present', 'judge', 'recordAnswer', 'noteAnswer', 'completeStage', 'addDays', 'dayOK', 'dayScore', 'calibNote',
  'toTF', 'drillItems', 'BK', 'ITEMS', 'GEN', 'makeGen', 'tierFor', 'baseTier', 'TIERS', 'peekDay', 'stageKeys', 'correctText', 'drillXP', 'curStreak', 'correctText'];
const START = '2026-10-19';

/** 1日ぶんを、正答率 acc で最後までやる（宿題・ふりかえりも）。やった日のクリアライン判定も返す */
function doDay(C, date, acc = 0.8, only = null) {
  C.setToday(date);
  const route = C.routeFor(date);
  for (const st of route) {
    if (only && !only.includes(st.id)) continue;
    if (st.kind === 'session' && st.items.length) {
      let ok = 0;
      for (const it of st.items) { const g = Math.random() < acc; C.recordAnswer(it, g); C.noteAnswer(g); if (g) ok++; }
      C.completeStage(date, st.id, { ok, n: st.items.length, sec: st.items.length * 12, boss: !!st.boss });
    } else C.completeStage(date, st.id, { ok: 0, n: 0, sec: 0, min: 1 });
  }
  return route;
}

test('段階：最初の2週間は「ならし」、そのあと少しずつ増える', () => {
  const C = loadCore(NAMES);
  const tiers = [];
  for (let i = 0; i < 42; i++) { const d = C.addDays(START, i); doDay(C, d, 0.8); tiers.push(C.S.rt.tier); }
  assert.deepEqual([...new Set(tiers.slice(0, 14))], [1], '1〜14日目はならし');
  assert.deepEqual([...new Set(tiers.slice(14, 28))], [2], '15〜28日目はふつう');
  assert.deepEqual([...new Set(tiers.slice(28))], [3], '29日目からしっかり');
});

test('おやすみが多い週のあとは、段階はそのままで、量を少なめにして、やった日ごとに戻す（急にはね上がらない）', () => {
  const C = loadCore(NAMES);
  for (let i = 0; i < 80; i++) doDay(C, C.addDays(START, i), 0.8);
  // 81〜87日目をほぼ休む（2日だけやる）
  for (const i of [80, 83]) doDay(C, C.addDays(START, i), 0.8, ['mem']);
  const d = C.addDays(START, 88);
  C.setToday(d);
  assert.equal(C.tierFor(d), 3, '段階はしっかりのまま');
  const mem = [];
  for (let i = 88; i < 98; i++) {
    const route = doDay(C, C.addDays(START, i), 1);
    mem.push(route.find((s) => s.id === 'mem').items.length);
  }
  assert.ok(mem[0] <= 16, `戻った日は少なめ：${mem[0]}問`);
  assert.equal(mem[mem.length - 1], 36, `しばらくして、いつもの量：${mem.join(',')}`);
  for (let i = 1; i < mem.length; i++) assert.ok(mem[i] - mem[i - 1] <= 12, `1日で急にふえない：${mem.join(',')}`);
});

test('ならし期は、短くて、宿題とふりかえり以外は暗記と算数だけ', () => {
  const C = loadCore(NAMES);
  const route = doDay(C, START, 0.8);
  const ids = route.map((s) => s.id);
  assert.ok(ids.includes('mem') && ids.includes('math') && ids.includes('hw') && ids.includes('ref'));
  assert.ok(!ids.includes('sub') && !ids.includes('mis'));
  const n = route.reduce((t, s) => t + s.items.length, 0);
  assert.ok(n <= 24, `1日の問題数が多すぎる: ${n}`);
  assert.ok(ids.indexOf('mem') < ids.indexOf('hw'), '宿題チェックは、ドリルのあと');
});

test('どの日も：ステージが空でない・同じ問題が重複しない・全問が出題できる', () => {
  const C = loadCore(NAMES);
  for (let i = 0; i < 45; i++) {
    const d = C.addDays(START, i);
    const route = doDay(C, d, 0.7);
    const seen = new Set();
    for (const st of route) {
      if (st.kind === 'session' && st.id !== 'mis') assert.ok(st.items.length > 0, `${d} ${st.id} が空`);
      for (const it of st.items) {
        assert.ok(!seen.has(it.id), `${d} 重複: ${it.id}`); seen.add(it.id);
        const V = C.present(it);
        assert.ok(V && V.q, `${d} ${it.id} が出題できない`);
      }
    }
  }
});

test('ルートは1日のあいだ変わらない（問題に答えても、ほかのステージの中身が動かない）', () => {
  const C = loadCore(NAMES);
  C.setToday(START);
  const a = C.routeFor().map((s) => s.items.map((i) => i.id).join(','));
  const r = C.routeFor();
  for (const it of r[0].items) { C.recordAnswer(it, true); C.noteAnswer(true); }
  const b = C.routeFor().map((s) => s.items.map((i) => i.id).join(','));
  assert.deepEqual(a, b);
});

test('クリアライン：ならし期はドリル1つ、ふつう以上はドリル＋もう1つ', () => {
  const C = loadCore(NAMES);
  C.setToday(START);
  C.routeFor();
  C.completeStage(START, 'hw', { n: 0, min: 5 });
  assert.equal(C.dayOK(C.peekDay(START), 1), false, '宿題だけではクリアラインにならない');
  C.completeStage(START, 'mem', { ok: 5, n: 6, sec: 60 });
  assert.equal(C.dayOK(C.peekDay(START), 1), true);
  assert.equal(C.peekDay(START).ok, 1, 'ならし期は mem + hw で連続記録');
  const rec = { stg: { mem: {} } };
  assert.equal(C.dayOK(rec, 2), false); assert.equal(C.dayOK(rec, 3), false);
  assert.equal(C.dayOK({ stg: { mem: {}, math: {} } }, 2), true);
});

test('ステージのXPは1日1回だけ', () => {
  const C = loadCore(NAMES);
  C.setToday(START); C.routeFor();
  const r1 = C.completeStage(START, 'mem', { ok: 5, n: 6, sec: 60 });
  const r2 = C.completeStage(START, 'mem', { ok: 6, n: 6, sec: 60 });
  assert.ok(r1.xp > 0 && r1.first); assert.equal(r2.xp, 0); assert.equal(r2.first, false);
});

test('自己採点とデータ採点の比較', () => {
  const C = loadCore(NAMES);
  assert.equal(C.calibNote(5, 2).k, 'amai');
  assert.equal(C.calibNote(1, 4).k, 'kibishii');
  assert.equal(C.calibNote(3, 3).k, 'ok');
  C.setToday(START); C.routeFor();
  assert.equal(C.dayScore(START), 1, 'まだやっていない日は1');
  C.completeStage(START, 'mem', { ok: 10, n: 10, sec: 60 });
  C.completeStage(START, 'math', { ok: 10, n: 10, sec: 60 });
  assert.ok(C.dayScore(START) >= 4);
});

test('ツッコミバトル：4択の問題から ○× を作り、判定できる', () => {
  const C = loadCore(NAMES);
  C.setToday(START);
  for (const it of C.BK.EW.items.slice(0, 30)) C.recordAnswer(it, true);
  const items = C.drillItems({ type: 'tf', n: 10 });
  assert.ok(items.length >= 8, 'ツッコミ用の問題が集まる');
  let right = 0, wrong = 0;
  for (let i = 0; i < 200; i++) {
    const it = items[i % items.length], V = C.present(it);
    if (V.kind !== 'mc') continue;
    const T = C.toTF(V);
    assert.equal(T.kind, 'tf');
    assert.equal(C.judge(T, T.truth), true); assert.equal(C.judge(T, !T.truth), false);
    assert.ok(C.correctText(T).length > 0);
    if (T.truth) { right++; assert.equal(T.claim, T.okText); } else { wrong++; assert.notEqual(T.claim, T.okText); }
  }
  assert.ok(right > 20 && wrong > 20, '正しい／まちがいが、まんべんなく出る');
});

test('算数の正答率が低い（75%未満）あいだは、かるめの日をなくして毎日しっかり。高いときは、いつものとおり1日おき', () => {
  const C = loadCore([...NAMES, 'mathAcc']);
  for (let i = 0; i < 60; i++) doDay(C, C.addDays(START, i), 0.85);
  const days = [60, 61, 62, 63].map((i) => C.addDays(START, i));
  const mathN = (acc) => {
    // 直前14日の算数ドリルの成績を、正答率 acc にそろえる
    for (let j = 1; j <= 14; j++) { const d = C.S.days[C.addDays(days[0], -j)]; if (d && d.stg.math) { d.stg.math.n = 8; d.stg.math.ok = Math.round(8 * acc); } }
    return days.map((d) => { C.setToday(d); C.S.rt = null; return C.routeFor(d).find((s) => s.id === 'math').items.length; });
  };
  const good = mathN(0.9), weak = mathN(0.55);
  C.setToday(days[0]);
  assert.ok(C.mathAcc(days[0]) < 0.75, `算数の正答率 ${C.mathAcc(days[0])}`);
  assert.ok(Math.max(...good) - Math.min(...good) >= 3, `ふつうの子は、1日おきに多い・少ない：${good}`);
  assert.ok(Math.min(...weak) >= Math.min(...good) + 2 && Math.min(...weak) >= 10, `苦手な子は毎日しっかり：${weak}（ふつう ${good}）`);
});

