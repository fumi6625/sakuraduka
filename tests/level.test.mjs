// 問題ごとの難易度の表示（中1・2学期レベル／チャレンジ）と、毎日かならず理科か社会が1問以上出ることを確かめる。
//   node --test tests/level.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadCore } from '../scripts/headless.mjs';

const NAMES = ['S', 'setToday', 'routeFor', 'recordAnswer', 'noteAnswer', 'completeStage', 'addDays', 'BK', 'GEN', 'makeGen', 'levelOf', 'ITEMS'];
const START = '2026-10-19';

test('どの問題にも難易度が付く（ミスの登録以外）。学年・学期の形になるもの、基本/標準/入試B問題などの形になるもの', () => {
  const C = loadCore(NAMES);
  const bad = [], seen = new Set();
  for (const b of Object.keys(C.BK)) for (const it of C.BK[b].items) {
    const L = C.levelOf(it);
    seen.add(L.text);
    if (!/^(中[123](・[123]学期)?レベル|中1〜中3レベル|基本レベル|標準レベル|発展レベル|応用レベル|入試B問題レベル|英検準2級レベル)$/.test(L.text)) bad.push(`${it.id}: 「${L.text}」`);
  }
  for (const id of Object.keys(C.GEN)) for (let lv = 1; lv <= 3; lv++) {
    const L = C.levelOf(C.makeGen(id, lv, 7));
    if (!/^(中[123]・[123]学期|小学[56]年)レベル$/.test(L.text)) bad.push(`GEN ${id}: 「${L.text}」`);
    assert.equal(L.ch, lv >= 3 && !/^小/.test(L.text) ? 1 : 0, `計算 ${id} Lv.${lv} のチャレンジ`);
  }
  assert.deepEqual(bad.slice(0, 5), [], `難易度が決まらない問題が ${bad.length} 件`);
  for (const t of ['中1・1学期レベル', '中2・2学期レベル', '中3・3学期レベル', '標準レベル', '入試B問題レベル']) assert.ok(seen.has(t), t + ' が1問も出ない');
});

test('単元ごとの難易度の例（教科書の標準的な順番）', () => {
  const C = loadCore(NAMES);
  const of = (bank, tag) => C.levelOf(C.BK[bank].items.find((x) => (x.tag || '') === tag));
  assert.equal(of('MQ', '一次関数').text, '中2・2学期レベル');
  assert.equal(of('MQ', '正負の数・文字式').text, '中1・1学期レベル');
  assert.equal(of('EG', '現在完了').text, '中3・1学期レベル');
  assert.equal(of('EG', 'be・一般動詞').text, '中1・1学期レベル');
  assert.equal(of('SQ', '物理/電流/用語').text, '中2・2学期レベル');
  assert.equal(of('OQ', '歴史/古代/用語').text, '中1・2学期レベル');
  assert.equal(of('OQ', '公民/政治/人権').text, '中3・1学期レベル');
  assert.equal(of('JG', '敬語').text, '中2レベル');
  assert.equal(C.levelOf(C.makeGen('pythag', 1, 3)).text, '中3・3学期レベル');
  assert.equal(C.levelOf(C.makeGen('speed', 1, 3)).text, '小学5年レベル');
  assert.equal(C.levelOf(C.makeGen('geo_poly', 1, 3)).text, '小学5年レベル');
  assert.equal(C.levelOf(C.makeGen('geo_poly', 2, 3)).text, '中2・2学期レベル');
  assert.equal(C.levelOf(C.makeGen('speed', 3, 3)).ch, 0, '小学の問題はチャレンジにしない');
});

test('チャレンジ：英検準2級の単語・漢字の発展・計算のLv.3・数学の証明/補助線。ふつうの問題には付けない', () => {
  const C = loadCore(NAMES);
  const chAll = [];
  for (const b of Object.keys(C.BK)) for (const it of C.BK[b].items) if (C.levelOf(it).ch) chAll.push(it);
  const by = (f) => chAll.filter(f).length;
  assert.ok(by((i) => i.bank === 'EW' && +i.grp === 4) > 100, '英検準2級の単語');
  assert.equal(by((i) => i.bank === 'EW' && +i.grp !== 4), 0);
  assert.ok(by((i) => i.bank === 'JK' && i.tag === '発展') > 50, '漢字の発展');
  assert.equal(by((i) => i.bank === 'JK' && i.tag !== '発展'), 0);
  assert.ok(by((i) => i.bank === 'MS') > 5, '数学の証明・補助線');
  assert.equal(by((i) => ['EG', 'MQ', 'SQ', 'OQ', 'OT', 'JG', 'JI', 'JW', 'JS', 'EO', 'EL', 'ER', 'JR'].includes(i.bank)), 0, '標準の教材にはチャレンジを付けない');
  assert.equal(C.levelOf({ k: 'mist', bank: 'MG', tag: '', q: 'x' }).text, '', '学校のミスは難易度なし');
});

/** 1日ぶんを、正答率 acc で最後までやる（休む日は doit=false） */
function playDay(C, date, acc, only) {
  C.setToday(date);
  for (const st of C.routeFor(date)) {
    if (only && !only.includes(st.id)) continue;
    if (st.kind === 'session' && st.items.length) {
      let ok = 0;
      for (const it of st.items) { const g = Math.random() < acc; C.recordAnswer(it, g); C.noteAnswer(g); if (g) ok++; }
      C.completeStage(date, st.id, { ok, n: st.items.length, sec: st.items.length * 12, boss: !!st.boss });
    } else C.completeStage(date, st.id, { ok: 0, n: 0, sec: 0, min: 1 });
  }
}

test('毎日のルートに、理科か社会の問題が最低1問は入る（最初の日から、ならし・ふつう・しっかり・ミニの日・休み明けでも）。理科と社会は日がわりでかたよらない', () => {
  const C = loadCore(NAMES);
  const rs = (d) => { const items = C.routeFor(d).flatMap((s) => s.items); return { r: items.filter((i) => i.subj === '理').length, s: items.filter((i) => i.subj === '社').length }; };
  const miss = [], days = [];
  for (let i = 0; i < 150; i++) {
    const d = C.addDays(START, i);
    C.setToday(d);
    if (i === 20 || i === 21) C.S.light[d] = 1;   // ミニの日
    const x = rs(d); days.push(x);
    if (x.r + x.s < 1) miss.push(d);
    if (i >= 100 && i < 107) continue;            // 1週間やすむ（記録をつくらない）
    playDay(C, d, i % 7 === 3 ? 0.4 : 0.85);
  }
  assert.deepEqual(miss, [], '理科も社会も出ない日がある');
  for (let i = 0; i + 7 <= days.length; i++) {
    const w = days.slice(i, i + 7);
    assert.ok(w.some((x) => x.r > 0) && w.some((x) => x.s > 0), `${i}日目からの1週間に、理科か社会の片方が出ない`);
  }
});
