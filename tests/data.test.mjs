// 教材データの選択肢の質と、新しい教材がルートに入ることを確かめる。
//   node --test tests/data.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadCore } from '../scripts/headless.mjs';

const NAMES = ['S', 'setToday', 'routeFor', 'present', 'recordAnswer', 'noteAnswer', 'completeStage', 'addDays', 'BK'];
const START = '2026-10-19';
const nested = (a, b) => { a = String(a); b = String(b); const s = a.length <= b.length ? a : b, l = s === a ? b : a; return s.length >= 2 && l.includes(s); };

test('まちがいの選択肢に、正解をふくむ（またはふくまれる）言葉を使わない', () => {
  const C = loadCore(NAMES);
  const bad = [];
  for (const b of Object.keys(C.BK)) for (const it of C.BK[b].items) {
    if (!['qa', 'term', 'syn'].includes(it.k)) continue;
    const V = C.present(it);
    if (V.kind !== 'mc') continue;
    const ok = V.choices.find((c) => c.ok).t;
    for (const c of V.choices) if (!c.ok && nested(c.t, ok)) bad.push(`${it.id}: 「${ok}」と「${c.t}」`);
  }
  assert.deepEqual(bad.slice(0, 5), [], `まぎらわしい選択肢が ${bad.length} 件`);
});

test('しっかり期：国語の日に作文の問題、数学ドリルに「考え方」の問題が入る', () => {
  const C = loadCore(NAMES);
  let jc = 0, ms = 0;
  for (let i = 0; i < 70; i++) {
    const d = C.addDays(START, i);
    C.setToday(d);
    const route = C.routeFor(d);
    if (i >= 49) {
      const sub = route.find((s) => s.id === 'sub'), math = route.find((s) => s.id === 'math');
      if (sub && sub.items.some((it) => it.bank === 'JC')) jc++;
      if (math && math.items.some((it) => it.bank === 'MS')) ms++;
    }
    for (const st of route) {
      if (st.kind === 'session' && st.items.length) {
        for (const it of st.items) { C.recordAnswer(it, true); C.noteAnswer(true); }
        C.completeStage(d, st.id, { ok: st.items.length, n: st.items.length, sec: st.items.length * 12, boss: !!st.boss });
      } else C.completeStage(d, st.id, { ok: 0, n: 0, sec: 0, min: 1 });
    }
  }
  assert.ok(jc >= 2, `作文が出た日: ${jc}`);
  assert.ok(ms >= 10, `考え方が出た日: ${ms}`);
});

test('一問一答：答えが人物・年・できごと・きまり・組織の問いは、まちがいの選択肢も同じ型（型で消去できない）', () => {
  const C = loadCore(['BK', 'distractQA', 'qGroup']);
  const ans = {};
  for (const b of ['SQ', 'OQ']) for (const it of C.BK[b].items) { const g = C.qGroup(it); if (g) (ans[g] = ans[g] || new Set()).add(it.a); }
  const bad = []; let n = 0;
  for (const b of ['SQ', 'OQ']) for (const it of C.BK[b].items) {
    const g = C.qGroup(it);
    if (!['year', 'person', 'event', 'law', 'org', 'culture', 'gas'].includes(g)) continue;
    for (let k = 0; k < 2; k++) for (const d of C.distractQA(it, 'a')) { n++; if (!ans[g].has(d)) bad.push(`${it.q.slice(0, 24)}｜答え「${it.a}」×「${d}」`); }
  }
  assert.ok(n > 600, `調べた選択肢 ${n}`);
  assert.ok(bad.length / n < 0.02, `型ちがい ${bad.length}/${n}：${bad.slice(0, 3).join(' ／ ')}`);
});

test('類義語・対義語：まちがいの選択肢に、正解や見出しと意味が近い語（同じグループ）を入れない', () => {
  const C = loadCore(['BK', 'present', 'jsC']);
  const bad = [];
  for (const it of C.BK.JS.items) for (let k = 0; k < 6; k++) {
    const V = C.present(it);
    if (V.kind !== 'mc') continue;
    const ok = V.choices.find((c) => c.ok).t, g1 = C.jsC(ok), g2 = C.jsC(it.w);
    for (const c of V.choices) {
      if (c.ok) continue;
      const g = C.jsC(c.t);
      if (g >= 0 && (g === g1 || g === g2)) bad.push(`${it.w}：正解「${ok}」×「${c.t}」`);
    }
  }
  assert.deepEqual(bad.slice(0, 3), [], `${bad.length} 件`);
});
