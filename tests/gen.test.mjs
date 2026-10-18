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
