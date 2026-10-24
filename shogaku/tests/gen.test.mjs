import test from 'node:test';
import assert from 'node:assert/strict';
import { loadCore } from '../scripts/headless.mjs';

const C = loadCore(['GEN', 'makeGen', 'present', 'judge', 'ITEMS', 'BK']);

test('数学・理科ジェネレータ：落ちない／答えが成り立つ／選択肢が重ならない', () => {
  const fails = [];
  for (const id of Object.keys(C.GEN)) {
    for (let lv = 1; lv <= 3; lv++) {
      for (let n = 1; n <= 300; n++) {
        const seed = n * 7919 + lv;
        try {
          const it = C.makeGen(id, lv, seed);
          const V = C.present(it);
          if (!it.q || typeof it.q !== 'string') throw new Error('問題文が空');
          if (V.kind === 'mc') {
            const t = V.choices.map((c) => c.t);
            if (V.choices.length !== 4) throw new Error('選択肢が4つない: ' + t.join(' / '));
            if (new Set(t).size !== 4) throw new Error('選択肢が重複: ' + t.join(' / '));
            if (V.choices.filter((c) => c.ok).length !== 1) throw new Error('正解が1つでない');
          } else {
            if (!it.accept.length) throw new Error('許す答えが空');
            if (!C.judge(V, it.accept[0])) throw new Error('正解を入れても不正解になる');
            if (C.judge(V, 'zzz')) throw new Error('でたらめが正解になる');
          }
          if (it.v && !it.v()) throw new Error('検算に失敗');
          if (/NaN|undefined|Infinity|\[object/.test(it.q + it.exp + (it.disp || ''))) throw new Error('文字が壊れている: ' + it.q);
        } catch (e) {
          fails.push(`${id} lv${lv} seed${seed}: ${e.message}`);
        }
      }
    }
  }
  assert.equal(fails.length, 0, `${fails.length}件\n` + fails.slice(0, 15).join('\n'));
});

test('ジェネレータが十分な種類ある', () => {
  assert.ok(Object.keys(C.GEN).length >= 38, 'ジェネレータ数 ' + Object.keys(C.GEN).length);
});

/** 「a√b」「√b」「n」「a/b」「nπ」の値（4択の誤答が、正解と同じ値になっていないか確かめる） */
const val = (s) => {
  s = String(s).replace(/−/g, '-').replace(/\s/g, '');
  const m = s.match(/^(-?)(\d*\.?\d*)(?:√(\d+))?(π)?(?:\/(\d+))?$/);
  if (!m) return null;
  const [, sg, c, r, pi, d] = m;
  if (c === '' && !r && !pi) return null;
  let v = c === '' ? 1 : parseFloat(c);
  if (r) v *= Math.sqrt(+r);
  if (pi) v *= Math.PI;
  if (d) v /= +d;
  return (sg ? -1 : 1) * v;
};

test('4択の誤答が、正解と同じ値にならない（√63 と 3√7 など）', () => {
  const bad = [];
  for (const id of Object.keys(C.GEN)) for (let lv = 1; lv <= 3; lv++) for (let n = 1; n <= 300; n++) {
    const g = C.makeGen(id, lv, n * 7919 + lv);
    if (!g.ch) continue;
    const vs = g.ch.map(val);
    if (vs.some((v) => v === null)) continue;
    if (vs.slice(1).some((v) => Math.abs(v - vs[0]) < 1e-9)) bad.push(`${id} Lv${lv}: ${g.q} → ${g.ch.join(' / ')}`);
  }
  assert.equal(bad.length, 0, `${bad.length}件\n` + bad.slice(0, 5).join('\n'));
});

test('式や解説の表示に、「1√」「1π」「×−3」「＋ −」「0x」などの不自然な書き方がない', () => {
  const pats = [[/×\s*[−-]\d/, '×の次に負の数（かっこなし）'], [/＋\s*[−-]\d/, '＋の次に負の数'], [/(^|[^\d.])1√/, '1√'], [/(^|[^\d.])1π/, '1π'], [/(^|[^\d])0x/, '0x'], [/[−-]\s*[−-]\s*\d/, '−−']];
  const hit = [];
  for (const id of Object.keys(C.GEN)) for (let lv = 1; lv <= 3; lv++) for (let n = 1; n <= 200; n++) {
    const g = C.makeGen(id, lv, n * 104729 + lv);
    const txt = [g.q, g.disp || '', String(g.exp || ''), ...(g.ch || [])].join('\n');
    for (const [re, name] of pats) if (re.test(txt)) hit.push(`${id} Lv${lv} ${name}: ${txt.split('\n').find((l) => re.test(l)).slice(0, 60)}`);
  }
  assert.equal(hit.length, 0, `${hit.length}件\n` + [...new Set(hit)].slice(0, 5).join('\n'));
});

test('自動生成：「−0」「+0」のような符号つきのゼロを、問題・答え・解説に出さない', () => {
  const C = loadCore(['GEN', 'makeGen']);
  const bad = [];
  for (const id of Object.keys(C.GEN)) for (const lv of [1, 2, 3]) for (let s = 1; s <= 200; s++) {
    const g = C.makeGen(id, lv, s * 7919 + 13);
    for (const t of [g.q, g.disp, ...(g.accept || []), ...(g.ch || []), g.exp].map((x) => String(x || ''))) {
      if (/(^|[^\d.])[−\-+＋]0(?![\d.])/.test(t)) { bad.push(`${id} Lv${lv}: ${t.slice(0, 50)}`); break; }
    }
  }
  assert.deepEqual(bad.slice(0, 3), [], `${bad.length} 件`);
});
