// 「6年生のまとめへの道のり」（身につき具合の見こみ・予定との差・まとめの日の見こみ・伸び・週報の文）を確かめる。
//   node --test tests/path.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadCore } from '../scripts/headless.mjs';
import { planCurve } from '../scripts/plan-curve.mjs';

const NAMES = ['S', 'setToday', 'routeFor', 'recordAnswer', 'noteAnswer', 'completeStage', 'addDays', 'restoreGx', 'monday',
  'pathNow', 'pathMsg', 'pathReportLine', 'accTrend', 'knowNow', 'PLAN_PATH'];
const START = '2026-10-19';
const rng = (seed) => { let r = seed; return () => { r = (r * 1664525 + 1013904223) >>> 0; return r / 4294967296; }; };

/** days日ぶん、曜日が dows（0=日…6=土）の日だけ、正答率 acc で最後までやる。 */
function run(C, days, { dows = [1, 2, 3, 4, 5], acc = 0.85, seed = 7, from = 0 } = {}) {
  const rand = rng(seed);
  for (let i = from; i < from + days; i++) {
    const date = C.addDays(START, i);
    C.setToday(date);
    if (!dows.includes(new Date(date + 'T00:00:00').getDay())) continue;
    C.restoreGx();
    for (const st of C.routeFor(date)) {
      if (st.kind === 'session' && st.items.length) {
        let ok = 0;
        for (const it of st.items) { const g = rand() < acc; C.recordAnswer(it, g); C.noteAnswer(g); if (g) ok++; }
        C.completeStage(date, st.id, { ok, n: st.items.length, sec: st.items.length * 12, boss: !!st.boss });
      } else {
        if (st.id === 'diag') C.S.diag[st.subj] = { ans: [], sc: 4, done: 1, paid: 1, at: date };
        C.completeStage(date, st.id, { ok: st.id === 'diag' ? 4 : 0, n: 0, sec: 0, min: st.min || 1 });
      }
    }
  }
  const end = C.addDays(START, from + days - 1);
  C.setToday(end);
  return end;
}

test('予定のカーブ（15-plan-path.js）が、いまの教材とルートで作りなおした値と同じ（古くなっていない）', () => {
  const cur = loadCore(['PLAN_PATH']).PLAN_PATH, now = planCurve();
  assert.equal(cur.d.join(), now.d.join(), '日付のならびがちがう');
  const off = [];
  for (const s of Object.keys(now.K)) if (cur.K[s].join() !== now.K[s].join()) off.push(`${s}：終わり ${cur.K[s].at(-1)} → ${now.K[s].at(-1)}`);
  assert.deepEqual(off, [], '教材やルートを変えました。node scripts/plan-curve.mjs で予定のカーブを作りなおしてください');
});

test('予定のカーブ：5教科とも、日がたつと増える（大きく減らない）。6年生のまとめの日に、はじめの数倍になる', () => {
  const { PLAN_PATH: P } = loadCore(['PLAN_PATH']);
  for (const s of ['英', '国', '数', '理', '社']) {
    const v = P.K[s];
    assert.equal(v.length, P.d.length, s + 'の点の数');
    assert.equal(v[0], 0);
    for (let i = 1; i < v.length; i++) assert.ok(v[i] >= v[i - 1] * 0.97, `${s}：${P.d[i]} で減りすぎ ${v[i - 1]}→${v[i]}`);
    assert.ok(v.at(-1) > 100, `${s}の6年生のまとめの日 ${v.at(-1)}`);
  }
});

test('はじめの10日は「はじめの一歩」。予定のパーセントではなく、やった分を見せる', () => {
  const C = loadCore(NAMES);
  run(C, 4);
  const P = C.pathNow();
  assert.equal(P.state, 'early');
  assert.equal(C.pathMsg(P).head, 'はじめの一歩');
  assert.ok(P.f > 0 && P.f < 0.1, `f=${P.f}`);
});

test('週5日・正答率85%で続けた子は「予定どおり」か「先」。週3日の子は「あと◯日分」で、週5日にした見こみは上がる', () => {
  const A = loadCore(NAMES), B = loadCore(NAMES);
  run(A, 150, { dows: [1, 2, 3, 4, 5], seed: 11 });
  run(B, 150, { dows: [1, 3, 5], seed: 11 });
  const pa = A.pathNow(), pb = B.pathNow();
  assert.ok(['on', 'ahead'].includes(pa.state), `週5日の子：${pa.state}（off=${pa.off}）`);
  assert.ok(pa.f > pb.f, `週5日 ${pa.f} / 週3日 ${pb.f}`);
  assert.ok(['behind', 'far'].includes(pb.state), `週3日の子：${pb.state}（off=${pb.off}）`);
  assert.ok(B.pathMsg(pb).head.startsWith('予定まで') || B.pathMsg(pb).head.startsWith('ここから'), B.pathMsg(pb).head);
  assert.ok(pb.proj5 > pb.proj + 0.02, `週5日にした見こみ ${pb.proj5} / このまま ${pb.proj}`);
  assert.ok(Math.abs(pa.proj5 - pa.proj) < 0.12, `すでに週5日の子は、あまり変わらない ${pa.proj5} / ${pa.proj}`);
  assert.ok(pa.proj > pb.proj, '見こみも、週5日の子のほうが上');
  assert.ok(pa.pace.perWeek > 4 && pb.pace.perWeek < 3.5, `ペース ${pa.pace.perWeek} / ${pb.pace.perWeek}`);
});

test('長く休むと、忘れるぶん「道のり」は少しさがる（そして、また始めれば戻る）', () => {
  const C = loadCore(NAMES);
  const d1 = run(C, 60);
  const before = C.pathNow(d1).f;
  C.setToday(C.addDays(START, 60 + 45));
  const after = C.pathNow(C.addDays(START, 60 + 45)).f;
  assert.ok(after < before, `休んだあと ${after} / 休む前 ${before}`);
  assert.ok(after > before * 0.6, `さがりすぎ ${after} / ${before}`);
  const msg = C.pathMsg(C.pathNow(C.addDays(START, 60 + 45)));
  assert.ok(!/サボ|さぼ|だめ|ダメ|怠|遅れ|おくれ|努力不足/.test(msg.head + msg.sub), msg.head + msg.sub);
});

test('教科ごとの正答率が週ごとにたまり、2週間ぶんで「直近の正答率」が出る', () => {
  const C = loadCore(NAMES);
  assert.equal(C.accTrend().now, null);
  run(C, 20, { acc: 0.8, seed: 3 });
  const t = C.accTrend();
  assert.ok(t.now != null && t.now > 0.55 && t.now < 0.95, `正答率 ${t.now}`);
  const mon = C.monday(C.addDays(START, 19));
  assert.ok(C.S.sw[mon] && Object.keys(C.S.sw[mon]).length >= 3, '教科ごとの記録');
  assert.ok(Object.keys(C.S.kh).length >= 2, '週ごとの道のりの記録');
  for (const k in C.S.kh) assert.ok(C.S.kh[k] >= 0 && C.S.kh[k] < 1.6, `${k}: ${C.S.kh[k]}`);
});

test('一言はどの状態でも責めない。週報の文は「推定のめやす」と添え、確率を数字で出さない', () => {
  const C = loadCore(NAMES);
  for (const state of ['early', 'ahead', 'on', 'behind', 'far']) for (const off of [-300, -45, -12, 0, 12, 40]) {
    const m = C.pathMsg({ state, off });
    assert.ok(m.head && m.sub, state);
    assert.ok(!/サボ|さぼ|だめ|ダメ|怠|遅れ|おくれ|努力不足|やる気がない|合格|確率/.test(m.head + m.sub), `${state}/${off}: ${m.head} ${m.sub}`);
  }
  run(C, 25);
  C.S.tl.push({ d: C.addDays(START, 20), tot: 72, gk: 72, label: '算数のテスト' });
  const line = C.pathReportLine();
  assert.match(line, /6年生のまとめへの道のり（めやす）/);
  assert.match(line, /推定のめやすです/);
  assert.match(line, /72点/);
  assert.ok(!/合格圏|安全圏|640|700/.test(line), '点数のめやすの線は出さない');
  assert.ok(!/合格|確率/.test(line), line);
});
