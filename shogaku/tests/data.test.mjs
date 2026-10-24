// 教材データの選択肢の質と、新しい教材がルートに入ることを確かめる。
//   node --test tests/data.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadCore } from '../scripts/headless.mjs';

const NAMES = ['S', 'setToday', 'routeFor', 'present', 'recordAnswer', 'noteAnswer', 'completeStage', 'addDays', 'BK', 'aliasKey', 'QALIAS'];
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

test('一問一答：正解の別名（ソ連とソビエト連邦、中国と中華人民共和国など）を、まちがいの選択肢に並べない（正解が2つに見えるため）', () => {
  const C = loadCore(NAMES);
  const bad = [];
  for (const b of Object.keys(C.BK)) for (const it of C.BK[b].items) {
    if (it.k !== 'qa') continue;
    for (let t = 0; t < 8; t++) {   // 選択肢は毎回ちがうので、何回かずつ見る
      const V = C.present(it);
      if (V.kind !== 'mc') break;
      const keys = V.choices.map((c) => C.aliasKey(c.t));
      if (new Set(keys).size !== keys.length) { bad.push(`${it.id}: ${V.choices.map((c) => c.t).join(' / ')}`); break; }
    }
  }
  assert.deepEqual(bad.slice(0, 5), [], `別名がならんだ選択肢が ${bad.length} 件`);
  // 別名の組は、答えのかたちを1つにそろえる（データの答えに、同じ別名の組の2つ以上が混ざらない）
  const ans = new Map();
  for (const b of Object.keys(C.BK)) for (const it of C.BK[b].items) if (it.k === 'qa') ans.set(String(it.a), 1);
  for (const g of C.QALIAS) {
    if (g[0] === '中国') continue;   // 「中国」（首都が北京の国）と「中華人民共和国」（1949年に成立した国）は、問いが別。選択肢には並ばない（上の検査）
    assert.ok(g.filter((x) => ans.has(x)).length <= 1, `${g.join('・')} が、答えに混ざっている`);
  }
});

test('しっかり期：国語の日に作文の問題、算数ドリルに「考え方」の問題が入る', () => {
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

test('一問一答：型が決まらない問いも、まちがいの選択肢は、答えと同じかたち（数・カタカナ・変化・短い漢字語・文のような答え…）', () => {
  const C = loadCore(['BK', 'distractQA', 'qGroup', 'ansShape']);
  const bad = []; let n = 0;
  for (const b of ['SQ', 'OQ']) for (const it of C.BK[b].items) {
    if (!C.qGroup(it).startsWith('s:')) continue;
    for (let k = 0; k < 2; k++) for (const d of C.distractQA(it, 'a')) { n++; if (C.ansShape(d) !== C.ansShape(it.a)) bad.push(`${it.q.slice(0, 24)}｜答え「${it.a}」×「${d}」`); }
  }
  assert.ok(n > 300, `調べた選択肢 ${n}`);
  assert.ok(bad.length / n < 0.12, `かたちのちがう選択肢 ${bad.length}/${n}：${bad.slice(0, 3).join(' ／ ')}`);
});

test('一問一答：「増える」と「大きくなる」のような、同じ向きの変化（同じ意味）を、まちがいの選択肢に並べない', () => {
  const C = loadCore(['BK', 'present', 'chgDir']);
  const bad = [];
  for (const b of ['SQ', 'OQ']) for (const it of C.BK[b].items) {
    const d0 = C.chgDir(it.a);
    if (!d0) continue;
    for (let k = 0; k < 4; k++) for (const c of C.present(it).choices) if (!c.ok && C.chgDir(c.t) === d0) bad.push(`${it.q.slice(0, 24)}｜答え「${it.a}」×「${c.t}」`);
  }
  assert.deepEqual(bad.slice(0, 3), [], `${bad.length} 件`);
});

test('一問一答：名詞の問いが少ないグループ（単独の名詞など）も、まちがいの選択肢は、答えと大まかに同じかたち（数・カタカナ・漢字…）', () => {
  const C = loadCore(['BK', 'distractQA', 'qGroup', 'ansShape']);
  const coarse = (a) => { const x = C.ansShape(a); return x === 'k3' || x === 'k4' ? 'k' : x; };
  const size = {};
  for (const b of ['SQ', 'OQ']) for (const it of C.BK[b].items) { const g = C.qGroup(it); if (g.startsWith('h:')) size[g] = (size[g] || 0) + 1; }
  const bad = []; let n = 0;
  for (const b of ['SQ', 'OQ']) for (const it of C.BK[b].items) {
    const g = C.qGroup(it);
    if (!g.startsWith('h:') || size[g] >= 4) continue;
    for (let k = 0; k < 2; k++) for (const d of C.distractQA(it, 'a')) { n++; if (coarse(d) !== coarse(it.a)) bad.push(`${it.q.slice(0, 24)}｜答え「${it.a}」×「${d}」`); }
  }
  assert.ok(n > 300, `調べた選択肢 ${n}`);
  assert.ok(bad.length / n < 0.2, `かたちのちがう選択肢 ${bad.length}/${n}：${bad.slice(0, 3).join(' ／ ')}`);
});

test('一問一答：「…の乱」「…の変」「…一揆」のような答えは、まちがいの選択肢にも同じ終わりの字の答えを（できるだけ）ならべる', () => {
  const C = loadCore(['BK', 'distractQA', 'qGroup']);
  let n = 0, none = 0;
  for (const b of ['OQ']) for (const it of C.BK[b].items) {
    const m = /(の戦い|の乱|の変|の役|一揆)$/.exec(String(it.a));
    if (!m) continue;
    for (let k = 0; k < 3; k++) { n++; if (!C.distractQA(it, 'a').some((x) => x.endsWith(m[1]))) none++; }
  }
  assert.ok(n > 40, `調べた出題 ${n}`);
  assert.ok(none / n < 0.2, `同じ終わりの字がひとつもない出題 ${none}/${n}`);
});

test('長文：国語の長文は、短いもの2題につき長いもの（800字ほど）が1題まじる順で出る（長いものが最後に回らない）', () => {
  const C = loadCore(['BK', 'passOrder']);
  const ord = C.passOrder('JR'), len = (pid) => C.BK.JR.items.find((i) => i.pid === pid).text.length;
  assert.equal(ord.length, new Set(ord).size);
  assert.equal(ord.length, new Set(C.BK.JR.items.map((i) => i.pid)).size, 'すべての長文が入っている');
  const first15 = ord.slice(0, 15).filter((p) => len(p) >= 600).length;
  assert.equal(first15, 5, `はじめの15題に長い長文が ${first15}`);
  assert.ok(len(ord[2]) >= 600 && len(ord[0]) < 600 && len(ord[1]) < 600, '短・短・長の順');
  assert.equal(C.passOrder('ER').join(), [...new Set(C.BK.ER.items.map((i) => i.pid))].join(), '英語の長文は、もとの順（長さがそろっている）');
});

test('長文を読む時間の見積もり：長い長文ほど長い（国語は字数、英語は語数に比例）', () => {
  const C = loadCore(['BK', 'readSec', 'estMin']);
  const jr = (pid) => C.BK.JR.items.find((i) => i.pid === pid), er = (pid) => C.BK.ER.items.find((i) => i.pid === pid);
  assert.ok(C.readSec(jr('j41')) > C.readSec(jr('j01')) * 1.8, `${C.readSec(jr('j41'))} / ${C.readSec(jr('j01'))}`);
  assert.ok(C.readSec(er('e40')) > C.readSec(er('e06')), '英語も、語数が多いほど長い');
  const qs = (b, pid) => C.BK[b].items.filter((i) => i.pid === pid);
  assert.ok(C.estMin(qs('JR', 'j41')) > C.estMin(qs('JR', 'j01')), '1題ぶんの見積もりも、長いほど長い');
});

