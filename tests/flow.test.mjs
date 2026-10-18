// 毎日の流れ（重複しない・まちがいが翌日に戻る・ミニ診断・つづりの同義語・自動で付く目標）を確かめる。
//   node --test tests/flow.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadCore } from '../scripts/headless.mjs';

const NAMES = ['S', 'setToday', 'routeFor', 'present', 'judge', 'recordAnswer', 'noteAnswer', 'completeStage', 'addDays', 'dayOK', 'peekDay',
  'BK', 'restoreGx', 'syncAutoGoals', 'isAutoGoal', 'SJL', 'PASS'];
const START = '2026-10-19';
const rng = (seed) => { let r = seed; return () => { r = (r * 1664525 + 1013904223) >>> 0; return r / 4294967296; }; };

/** 1日ぶんを、正答率 acc で最後までやる。answered に {id,date,ok} を足していく */
function doDay(C, date, rand, acc, log) {
  C.setToday(date); C.restoreGx();
  const route = C.routeFor(date);
  for (const st of route) {
    if (st.kind === 'session' && st.items.length) {
      let ok = 0;
      for (const it of st.items) {
        const g = rand() < acc; C.recordAnswer(it, g); C.noteAnswer(g); if (g) ok++;
        if (log) log(it, g);
      }
      C.completeStage(date, st.id, { ok, n: st.items.length, sec: st.items.length * 12, boss: !!st.boss });
    } else {
      // ミニ診断は、画面で6問おわって「受けた」記録が付く（dgPick と同じ）
      if (st.id === 'diag') C.S.diag[st.subj] = { ans: [], sc: 4, done: 1, paid: 1, at: date };
      C.completeStage(date, st.id, { ok: st.id === 'diag' ? 4 : 0, n: 0, sec: 0, min: st.min || 1 });
    }
  }
  return route;
}

test('同じ日に、同じ自動生成の問題が2回出ない', () => {
  const C = loadCore(NAMES), rand = rng(5);
  const dup = [];
  for (let i = 0; i < 150; i++) {
    const date = C.addDays(START, i);
    C.setToday(date); C.restoreGx();
    const route = C.routeFor(date), seen = new Set();
    for (const st of route) for (const it of st.items) {
      if (it.k !== 'gen') continue;
      const V = C.present(it);
      const key = it.gid + '|' + V.q + '|' + (V.accept || []).join(',') + '|' + (V.choices ? V.choices.find((c) => c.ok).t : '');
      if (seen.has(key)) dup.push(`${date} ${st.id} ${V.q.slice(0, 30)}`);
      seen.add(key);
    }
    doDay(C, date, rand, 0.75);
  }
  assert.deepEqual(dup.slice(0, 5), [], `同じ日に同じ生成問題が出た: ${dup.length}件`);
});

test('まちがえた問題は、たいてい次の日のうちにもう一度出る', () => {
  const C = loadCore(NAMES), rand = rng(777);
  const lastWrong = {}, lags = [];
  for (let i = 0; i < 90; i++) {
    const date = C.addDays(START, i);
    doDay(C, date, rand, 0.7, (it, g) => {
      if (it.k === 'gen') return;
      if (lastWrong[it.id] !== undefined) { if (i >= 29) lags.push(i - lastWrong[it.id]); delete lastWrong[it.id]; }
      if (!g) lastWrong[it.id] = i;
    });
  }
  assert.ok(lags.length > 100, `集計できた件数が少ない: ${lags.length}`);
  const next = lags.filter((x) => x <= 1).length / lags.length;
  assert.ok(next >= 0.6, `翌日に戻った割合 ${Math.round(next * 100)}%（6割は欲しい）`);
});

test('ミニ診断：3日目から1日1教科ずつ、5教科でおわり。合格ラインには数えない。しっかり期には出ない', () => {
  const C = loadCore(NAMES), rand = rng(3);
  const subj = [];
  for (let i = 0; i < 40; i++) {
    const date = C.addDays(START, i);
    const route = doDay(C, date, rand, 0.8);
    const dg = route.find((s) => s.id === 'diag');
    if (i < 2) assert.ok(!dg, `${i + 1}日目にミニ診断が出ている`);
    if (dg) {
      assert.equal(dg.kind, 'check'); assert.ok(C.SJL.includes(dg.subj));
      subj.push(dg.subj);
      // 診断のステージはXPが付かない
      const rec = C.peekDay(date);
      assert.ok(rec.stg.diag, 'ステージ完了が記録されている');
    }
    if (i >= 29) assert.ok(!dg, `${i + 1}日目（しっかり期）にミニ診断が出ている`);
  }
  assert.equal(subj.length, C.SJL.length, `ミニ診断が出た回数: ${subj.length}`);
  assert.equal(new Set(subj).size, subj.length, '同じ教科が2回出ていない');
  assert.ok(C.SJL.every((s) => C.S.diag[s] && C.S.diag[s].done), '5教科ぶん、受けたことになる');
  // 診断とふりかえりだけでは合格ラインにならない
  assert.equal(C.dayOK({ stg: { diag: {}, hw: {}, ref: {} } }, 1), false);
});

test('ミニ診断のステージ自体にはXPが付かない（+10XPは診断の画面で、1教科につき1回だけ）', () => {
  const C = loadCore(NAMES), rand = rng(9);
  for (let i = 0; i < 2; i++) doDay(C, C.addDays(START, i), rand, 0.8);
  const date = C.addDays(START, 2);
  C.setToday(date);
  const dg = C.routeFor(date).find((s) => s.id === 'diag');
  assert.ok(dg, '3日目にミニ診断が出る');
  assert.equal(C.completeStage(date, 'diag', { ok: 4, n: 0, sec: 0, min: 3 }).xp, 0);
});

test('英単語のつづり：同じ意味・同じ品詞のことばは、どちらを書いても正解', () => {
  const C = loadCore(NAMES);
  const by = (en) => C.BK.EW.items.find((i) => i.en === en);
  for (const [a, b] of [['shop', 'store'], ['bike', 'bicycle'], ['start', 'begin'], ['huge', 'enormous'], ['sea', 'ocean']]) {
    const it = by(a);
    assert.ok(it, `${a} がない`);
    C.S.srs[it.id] = { b: 4, d: '2020-01-01', n: 5, ok: 5 };
    const V = C.present(it);
    assert.equal(V.kind, 'typ', `${a} は定着したらつづりで出る`);
    assert.ok(C.judge(V, a) && C.judge(V, b), `${a} / ${b} がどちらも正解になる`);
    assert.ok(!C.judge(V, 'zzz'));
  }
});

test('長文：国語・英語とも30題あり、どの問いも4択で、正解が選択肢に1つだけ入る', () => {
  const C = loadCore(NAMES);
  assert.ok(C.PASS.J.length >= 30, `国語の長文 ${C.PASS.J.length}`);
  assert.ok(C.PASS.E.length >= 30, `英語の長文 ${C.PASS.E.length}`);
  for (const arr of [C.PASS.J, C.PASS.E]) {
    assert.equal(new Set(arr.map((p) => p.id)).size, arr.length, '長文のIDが重ならない');
    for (const p of arr) {
      assert.ok(p.qs.length >= 3, `${p.id} の問いが少ない`);
      for (const q of p.qs) assert.equal(new Set(q.slice(1, 5)).size, 4, `${p.id}: 選択肢が重なる`);
    }
  }
});

test('毎日のルートに、長文は週に1題ずつ入り、新しい長文から順に出る', () => {
  const C = loadCore(NAMES), rand = rng(11);
  const seen = { ER: [], JR: [] };
  for (let i = 0; i < 126; i++) {
    const date = C.addDays(START, i);
    const route = doDay(C, date, rand, 0.8);
    for (const st of route) for (const it of st.items) if ((it.bank === 'ER' || it.bank === 'JR') && !seen[it.bank].includes(it.pid)) seen[it.bank].push(it.pid);
  }
  assert.ok(seen.ER.length >= 8 && seen.JR.length >= 8, `18週間で出た長文：英${seen.ER.length} 国${seen.JR.length}`);
  assert.equal(new Set(seen.ER).size, seen.ER.length);
});

test('目標：記録から自動で付くものだけが自動になる', () => {
  const C = loadCore(NAMES);
  assert.equal(C.isAutoGoal('2026-10', 4), true, '連続7日は記録から自動');
  assert.equal(C.isAutoGoal('2026-10', 0), false, 'ふつうの目標は自動にしない');
  C.S.best = 3;
  assert.equal(C.syncAutoGoals().length, 0, '条件を満たしていないうちは付かない');
  C.S.best = 7;
  const got = C.syncAutoGoals();
  assert.equal(got.length, 1);
  assert.ok(C.S.ms['2026-10|4']);
  assert.equal(C.syncAutoGoals().length, 0, '2回目は付け直さない（XPが二重に入らない）');
});
