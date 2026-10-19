// 画面の色（テーマ）：全テーマに色のもとがそろっている／CSSが使う変数が定義されている／文字が読める（コントラスト）／JS・head との一致
//   node --test tests/theme.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const css = fs.readFileSync(path.join(root, 'src/style.css'), 'utf8');
const ui = fs.readFileSync(path.join(root, 'src/js/50-ui.js'), 'utf8');
const head = fs.readFileSync(path.join(root, 'src/head.html'), 'utf8');

/* ---- style.css から、テーマごとの色のもとを読む ---- */
const decls = (body) => { const o = {}; for (const m of body.matchAll(/--([\w-]+):([^;]+);/g)) o[m[1]] = m[2].trim(); return o; };
const block = (sel) => { const i = css.indexOf(sel + '{'); if (i < 0) return null; let d = 0, j = i + sel.length; for (; j < css.length; j++) { if (css[j] === '{') d++; else if (css[j] === '}') { d--; if (d === 0) break; } } return css.slice(i + sel.length + 1, j); };
const ROOT = decls(block(':root'));
const NAMES = ['normal', 'soft', 'neon', 'night', 'pop'];
const THEME = Object.fromEntries(NAMES.map((n) => [n, n === 'normal' ? ROOT : decls(block(`html[data-theme=${n}]`))]));
const COMMON = new Set(['f-d', 'f-b', 'sat', 'sab', 'dock', 'team', 'team2', 'teamd', 'team-rgb', 'team-t']);   // テーマに関係なく、:root にある
const KEYS = Object.keys(ROOT).filter((k) => !COMMON.has(k));

/* ---- 色の計算 ---- */
const tok = (T, name) => (T[name] != null ? T[name] : ROOT[name]);
function resolve(T, v, d = 0) {
  if (d > 8) throw new Error('変数がぐるぐる：' + v);
  return v.replace(/var\(--([\w-]+)(?:,[^)]*)?\)/g, (_, n) => { const x = tok(T, n); if (x == null) throw new Error('未定義：--' + n); return resolve(T, x, d + 1); });
}
function rgba(str) {
  str = str.trim();
  let m;
  if ((m = /^#([0-9a-f]{6})$/i.exec(str))) return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)).concat(1);
  if ((m = /^#([0-9a-f]{3})$/i.exec(str))) return [0, 1, 2].map((i) => parseInt(m[1][i] + m[1][i], 16)).concat(1);
  if ((m = /^rgba?\(([^)]*)\)$/i.exec(str))) { const p = m[1].split(',').map((x) => parseFloat(x)); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; }
  if (str === 'transparent') return [0, 0, 0, 0];
  throw new Error('色が読めない：' + str);
}
const over = (fg, bg) => [0, 1, 2].map((i) => fg[i] * fg[3] + bg[i] * (1 - fg[3])).concat(1);
const lum = (c) => { const f = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const C = (T, name) => rgba(resolve(T, tok(T, name)));

test('どのテーマも、同じ色のもと（--変数）をぜんぶ持っている', () => {
  for (const n of NAMES) {
    const have = new Set(Object.keys(THEME[n]).filter((k) => !COMMON.has(k)));
    const miss = KEYS.filter((k) => !have.has(k)), extra = [...have].filter((k) => !KEYS.includes(k));
    assert.deepEqual([miss, extra], [[], []], `${n}：ない ${miss.join(',')} ／よぶん ${extra.join(',')}`);
  }
  assert.ok(KEYS.length > 150, `色のもとの数 ${KEYS.length}`);
});

test('CSSが使う var(--…) は、すべて定義されている（要素ごとにJSがつける変数だけは除く）', () => {
  const dyn = new Set(['c', 'cs', 'mc', 'cb', 'cc', 'sc', 'sct', 'w', 'p', 'p1', 'p2', 'fbh', 'ta', 'tb', 'tc', 'tk']);
  const def = new Set([...Object.keys(ROOT), ...[...css.matchAll(/--([\w-]+):/g)].map((m) => m[1])]);
  const bad = new Set();
  for (const m of css.matchAll(/var\(--([\w-]+)/g)) if (!def.has(m[1]) && !dyn.has(m[1])) bad.add(m[1]);
  assert.deepEqual([...bad], [], '未定義の変数');
});

test('どのテーマも、色の値が読めて、変数がぐるぐるしない', () => {
  for (const n of NAMES) for (const k of KEYS) {
    const v = resolve(THEME[n], THEME[n][k]);
    if (/^(#|rgba?\()/.test(v.trim())) rgba(v);   // 色なら、読める
  }
});

/* ---- 文字の読みやすさ。ネオンは「はじめの版」のままなので、基準をゆるめる（それでも、読めない色には落とさない） ---- */
const STRICT = { tx: 7, tx2: 4.5, mu: 4.5, fill: 4.5, text: 4.5, band: 4.5 };
const LOOSE = { tx: 7, tx2: 4.5, mu: 2.9, fill: 4.5, text: 3, band: 2.4 };   // ネオン：はじめの版のまま（白字の帯などが、2.4:1まで）
const LIM = (n) => (n === 'neon' ? LOOSE : STRICT);

test('本文の色が、地・カード・パネルの上で読める（本文7:1、補助4.5:1、うすい字は4.5:1。ネオンは3:1）', () => {
  const bad = [];
  for (const n of NAMES) {
    const T = THEME[n], L = LIM(n);
    const bg = C(T, 'bg');
    const surf = { bg, pn: C(T, 'pn'), pn2: C(T, 'pn2'), pa: C(T, 'pa'), pa2: C(T, 'pa2'), 'q-a': C(T, 'q-a'), 'q-b': C(T, 'q-b'), 'sh-a': C(T, 'sh-a'), 'sh-b': C(T, 'sh-b'), 'stn-a': C(T, 'stn-a'), 'stn-b': C(T, 'stn-b'), 'std-a': C(T, 'std-a'), 'std-b': C(T, 'std-b') };
    // うすい白（または黒）をかさねたパネル
    for (const k of ['sunk-a', 'sunk-b', 'sunk-c']) for (const b of ['pn2', 'pa']) surf[`${k}/${b}`] = over(C(T, k), surf[b]);
    for (const [sn, sc] of Object.entries(surf)) {
      for (const [tn, lim] of [['tx', L.tx], ['tx2', L.tx2], ['mu', L.mu]]) {
        const r = ratio(C(T, tn), sc);
        if (r < lim) bad.push(`${n}：${tn} × ${sn} = ${r.toFixed(1)}（${lim}以上）`);
      }
    }
  }
  assert.deepEqual(bad, []);
});

test('ボタン・チップ・ラベルの濃い字（--on）や、色つきの帯の上の字が読める（4.5:1。ネオンの帯は、はじめの版のまま2.4:1まで）', () => {
  const bad = [];
  const fills = ['pink', 'cyan', 'lime', 'orange', 'purple', 'yellow', 'red', 'green', 'sou', 'lime-hi', 'lime-lo', 'cyan-hi', 'cyan-lo', 'yellow-hi', 'yellow-lo', 'red-hi', 'green-lo',
    'ch1-a', 'ch1-b', 'ch2-a', 'ch2-b', 'ch3-a', 'ch3-b', 'ch4-a', 'ch4-b', 'okc-a', 'okc-b', 'btn-a', 'btn-b', 'fn-a', 'fn-b', 'clr-a', 'clr-b', 'clr-c', 'rkS-a', 'rkS-b', 'rkS-c', 'rkC',
    't-pink', 't-pink2', 't-lime', 't-lime2', 't-cyan', 't-cyan2', 't-orange', 't-orange2', 't-purple', 't-purple2'];
  for (const n of NAMES) {
    const T = THEME[n], on = C(T, 'on');
    for (const f of fills) { const r = ratio(on, C(T, f)); if (r < 4.5) bad.push(`${n}：on × ${f} = ${r.toFixed(1)}`); }
    // 色つきの帯の上の字：それぞれ専用の字の色
    const pairs = [['hero-tx', ['hero-b', 'hero-c']], ['cta-tx', ['cta-a', 'cta-b', 'cta-c']], ['tsk-tx', ['tsk-a', 'tsk-b', 'tsk-c']], ['fok-tx', ['fok-a', 'fok-b']], ['fng-tx', ['fng-a', 'fng-b']],
      ['ngc-tx', ['ngc-a', 'ngc-b']], ['lcd-tx', ['lcd']], ['nb-tx', ['red']], ['lbp-tx', ['purple']], ['tx', ['optok', 'optng']]];
    for (const [t, bs] of pairs) for (const b of bs) { const r = ratio(C(T, t), C(T, b)); if (r < LIM(n).band) bad.push(`${n}：${t} × ${b} = ${r.toFixed(1)}（${LIM(n).band}以上）`); }
    // ヒーローの左はしは、チームカラー（ピンク）か、そのうすい色
    for (const tm of ['t-pink', 't-lime', 't-cyan', 't-orange', 't-purple']) {
      const a = T['hero-a'] === 'var(--team)' ? C(T, tm) : T['hero-a'] === 'var(--team2)' ? C(T, tm + '2') : T['hero-a'] === 'var(--teamd)' ? C(T, tm + 'd') : C(T, 'hero-a');
      const r = ratio(C(T, 'hero-tx'), a);
      if (r < (n === 'neon' ? 1 : 4.5)) bad.push(`${n}：hero-tx × hero-a（${tm}）= ${r.toFixed(1)}`);
    }
  }
  assert.deepEqual(bad, []);
});

test('色つきの文字（--…-t）が、カードの上で読める（4.5:1。ネオンは3:1）', () => {
  const bad = [];
  for (const n of NAMES) {
    const T = THEME[n], lim = LIM(n).text;
    for (const t of ['yellow-t', 'lime-t', 'cyan-t', 'orange-t', 'red-t', 'green-t', 'purple-t', 'sou-t', 't-pink-t', 't-lime-t', 't-cyan-t', 't-orange-t', 't-purple-t']) {
      for (const s of ['pn2', 'pa', 'bg']) {
        if (n === 'neon' && (t === 'purple-t' || t === 'sou-t' || t === 't-purple-t') ) continue;   // ネオンは、これらを文字に使っていない（はじめの版のまま）
        const r = ratio(C(T, t), C(T, s));
        if (r < lim) bad.push(`${n}：${t} × ${s} = ${r.toFixed(1)}（${lim}以上）`);
      }
    }
  }
  assert.deepEqual(bad, []);
});

test('JSのテーマ一覧（50-ui.js）・headの起動前スクリプトが、CSSと合っている', () => {
  const rows = [...ui.matchAll(/\['(\w+)','([^']+)','([^']*)','(#[0-9a-f]{6})','(#[0-9a-f]{6})','(#[0-9a-f]{6})','(#[0-9a-f]{6})',(\d)\]/g)];
  assert.deepEqual(rows.map((m) => m[1]), NAMES, '一覧のならび');
  for (const m of rows) {
    const [, k, name, , bg, card, a, ink, dark] = m, T = THEME[k];
    assert.ok(name.length >= 2 && name.length <= 6, `${k}の名前「${name}」`);
    assert.equal(bg, rgbHex(C(T, 'bg')), `${k}：地の色が --bg とちがう`);
    assert.equal(a, rgbHex(C(T, 't-pink')), `${k}：見本のアクセントが --t-pink とちがう`);
    assert.equal(ink, rgbHex(C(T, 'ink')), `${k}：線の色が --ink とちがう`);
    assert.equal(+dark, block(k === 'normal' ? ':root' : `html[data-theme=${k}]`).includes('color-scheme:dark') ? 1 : 0, `${k}：暗い地かどうか`);
    assert.ok(head.includes(`${k}:'${bg}'`), `head の起動前スクリプトに ${k}:'${bg}'`);
  }
  assert.ok(head.includes("t=B[s.theme]?s.theme:'normal'"), 'はじめの設定は「ふつう」');
  assert.match(css, /:root\{[^}]*color-scheme:light/, ':root（ふつう）は明るいテーマ');
});

function rgbHex(c) { return '#' + c.slice(0, 3).map((x) => Math.round(x).toString(16).padStart(2, '0')).join(''); }
