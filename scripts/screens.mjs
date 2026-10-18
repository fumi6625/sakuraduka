// 画面の見た目を確認するためのスクリーンショットを、まとめて撮る（評価エージェント用）。
//   node scripts/screens.mjs [出力フォルダ] [--nofonts]
// ?debug を付けた index.html をブラウザで開き、デバッグ用の入り口(__sq)で状態をつくって撮影する。
// Playwright が必要（/opt/node-tools/node_modules/playwright か、npm の playwright）。
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/opt/node-tools/node_modules/playwright')); }

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.resolve(process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : path.join(root, 'screens'));
const useFonts = !process.argv.includes('--nofonts');
fs.mkdirSync(out, { recursive: true });
const URL = 'file://' + path.join(root, 'index.html') + '?debug';

async function launch({ w, h, date = '2026-10-19T10:00:00', dpr = 1 }) {
  const px = process.env.HTTPS_PROXY; let u; try { u = new URL(px); } catch {}
  const browser = await chromium.launch(useFonts && u ? { proxy: { server: `${u.protocol}//${u.host}`, username: decodeURIComponent(u.username || ''), password: decodeURIComponent(u.password || '') } } : {});
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, ignoreHTTPSErrors: true, deviceScaleFactor: dpr, hasTouch: true });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/fonts\.g|ERR_|Failed to load resource|net::/.test(m.text())) errs.push('console: ' + m.text()); });
  await page.clock.install({ time: new Date(date) });
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(useFonts ? 4000 : 400);
  const shot = async (name) => { await page.screenshot({ path: path.join(out, name + '.png') }); console.log('  ', name); };
  return { page, errs, browser, shot };
}

/* 解く補助：いまの問題に、正解／不正解で答える */
async function solveOne(P, correct = true) {
  const info = await P.evaluate((correct) => {
    const V = __sq.PL.V, k = V.kind;
    if (k === 'mc') { const ok = V.choices.findIndex((c) => c.ok); return { k, idx: correct ? ok : (ok + 1) % 4 }; }
    if (k === 'tf') return { k, v: correct ? V.truth : !V.truth };
    if (k === 'num') return { k, text: correct ? V.accept[0] : '99999' };
    if (k === 'typ') return { k, text: correct ? V.accept[0] : 'zzz' };
    if (k === 'order') return { k, order: correct ? V.answers[0].split(V.join) : [], tokens: V.tokens };
    return { k };
  }, correct);
  if (info.k === 'mc') await P.click(`.ch >> nth=${info.idx}`);
  else if (info.k === 'tf') await P.click(info.v ? '.tfy' : '.tfn');
  else if (info.k === 'num') { for (const c of info.text) await P.evaluate((c) => __sq.ACT.plKey(c === '-' ? '−' : c), c); await P.click('[data-act="plNum"]'); }
  else if (info.k === 'typ') { await P.fill('#tyIn', info.text); await P.click('[data-act="plTyp"]'); }
  else if (info.k === 'order') {
    if (!correct) await P.click('[data-act="plSkip"]');
    else { const used = new Set(); for (const w of info.order) { const i = info.tokens.findIndex((t, j) => t === w && !used.has(j)); used.add(i); await P.click(`#bank [data-a="${i}"]`); } await P.click('[data-act="plOrder"]'); }
  } else { await P.click('[data-act="plShow"]'); await P.click(`[data-act="plSelf"][data-a="${correct ? 1 : 0}"]`); }
}
async function solveAll(P, acc = 1, onStep) {
  for (let n = 0; n < 120;) {
    const st = await P.evaluate(() => (window.__sq.PL ? window.__sq.PL.phase : 'none'));
    if (st === 'done' || st === 'none') return n;
    if (st === 'fb') { await P.evaluate(() => __sq.ACT.plNext()); await P.waitForTimeout(60); continue; }
    if (st !== 'q') { await P.waitForTimeout(80); continue; }
    await solveOne(P, Math.random() < acc); n++;
    if (onStep) await onStep(n);
    await P.waitForTimeout(100);
  }
  return -1;
}
const seed = (P) => P.evaluate(() => {
  const q = __sq, S = q.S; S.nick = 'さくら'; S.xp = 1500; S.coin = 380; S.streak = 5; S.best = 5; S.last = '2026-10-18'; S.start = '2026-10-04';
  const ids = Object.keys(q.ITEMS).filter((i) => /^(EW|JK|JI|EG|JS|MQ|SQ|OQ)/.test(i)).slice(0, 120);
  ids.forEach((id, i) => { S.srs[id] = { b: i % 6, n: 3, w: i % 6 === 0 ? 2 : 0, d: i % 3 ? 99999 : 0 }; });
  ['2026-10-14', '2026-10-15', '2026-10-16', '2026-10-17', '2026-10-18'].forEach((d, i) => { S.days[d] = { stg: { mem: { ok: 8, n: 9, xp: 18, sec: 120 }, math: { ok: 6, n: 8, xp: 22, sec: 240 } }, min: { 総: 2, 数: 4 }, ok: 1, full: i % 2 ? 1 : 0, n: 17, c: 14, dx: 0 }; });
  S.tot = { n: 500, ok: 390 };
  q.refresh();
});
const closeAny = async (P) => { await P.evaluate(() => { try { __sq.ACT.sheetClose(); __sq.ACT.ovClose(); if (__sq.PL) __sq.ACT.plClose(); } catch (e) {} }); await P.waitForTimeout(150); };

const log = [];
async function run(name, size, fn) {
  console.log(name);
  const t = await launch(size);
  try { await fn(t); } catch (e) { log.push(`${name}: ${e.message.split('\n')[0]}`); }
  if (t.errs.length) log.push(`${name}: ${t.errs.join(' / ')}`);
  await t.browser.close();
}

/* ① iPad たて（いちばん大事）：ホーム・プレイヤー・各タブ・各ページ */
await run('ipad-portrait', { w: 820, h: 1180 }, async ({ page: P, shot }) => {
  await shot('01-home-first-run');
  await P.evaluate(() => { __sq.S.nick = 'さくら'; __sq.refresh(); });
  await P.click('[data-act="stageGo"][data-a="mem"] >> nth=0'); await P.waitForTimeout(500); await shot('03-question-choice');
  await solveOne(P, false); await P.waitForTimeout(450); await shot('04-feedback-wrong');
  await P.evaluate(() => __sq.ACT.plNext()); await P.waitForTimeout(300);
  await solveOne(P, true); await P.waitForTimeout(450); await shot('05-feedback-correct');
  await solveAll(P, 0.8, async (n) => { if (n === 5) { await P.waitForTimeout(500); await shot('06-round-banner'); } });
  await P.waitForTimeout(1800); await shot('07-result');
  await P.click('[data-act="plHome"]'); await P.waitForTimeout(800); await shot('08-home-after-first-stage');
  // コンボ（3問つづけて正解）／全問正解のSランク結果／レベルアップ
  await P.evaluate(() => { __sq.startSession({ title: 'コンボ', subj: '英', items: __sq.BK.EW.items.slice(60, 72), skipBrief: true }); });
  await P.waitForTimeout(400);
  for (let i = 0; i < 4; i++) { await solveOne(P, true); await P.waitForTimeout(300); if (i === 3) await shot('06b-combo'); await P.evaluate(() => __sq.ACT.plNext()); await P.waitForTimeout(200); }
  await solveAll(P, 1); await P.waitForTimeout(2200); await shot('07b-result-rank-s');
  await P.click('[data-act="plHome"]'); await P.waitForTimeout(600);
  await P.evaluate(() => __sq.levelUp(6)); await P.waitForTimeout(700); await shot('07c-level-up'); await closeAny(P); await P.waitForTimeout(3200);
  await P.evaluate(() => { __sq.S.xp = 0; });
  await seed(P); await P.waitForTimeout(300); await shot('09-home-with-progress');
  await P.click('[data-act="stageGo"][data-a="math"] >> nth=0'); await P.waitForTimeout(500); await shot('10-question-number-keypad');
  await closeAny(P);
  const gens = await P.evaluate(() => [__sq.makeGen('sim_add', 2, 55)]);
  await P.evaluate((g) => __sq.startSession({ title: 'テスト', subj: '数', items: [g], skipBrief: true }), gens[0]); await P.waitForTimeout(400); await shot('11-question-number-alpha'); await closeAny(P);
  const ids = await P.evaluate(() => ({ typ: __sq.BK.EW.items[40].id, order: __sq.BK.EO.items[3].id, read: __sq.BK.ER.items[0].id, self: __sq.BK.EC.items[1].id }));
  await P.evaluate((id) => { __sq.S.srs[id] = { b: 5, n: 3, w: 0, d: 0 }; __sq.startSession({ title: 'テスト', subj: '英', items: [__sq.ITEMS[id]], skipBrief: true }); }, ids.typ); await P.waitForTimeout(400); await P.fill('#tyIn', 'abc'); await shot('12-question-typing'); await closeAny(P);
  await P.evaluate((id) => __sq.startSession({ title: 'テスト', subj: '英', items: [__sq.ITEMS[id]], skipBrief: true }), ids.order); await P.waitForTimeout(400); await P.click('.bank .tk >> nth=0'); await shot('13-question-order'); await closeAny(P);
  await P.evaluate((id) => __sq.startSession({ title: 'テスト', subj: '英', items: [__sq.ITEMS[id]], skipBrief: true }), ids.read); await P.waitForTimeout(400); await shot('14-question-reading'); await closeAny(P);
  await P.evaluate((id) => __sq.startSession({ title: 'テスト', subj: '英', items: [__sq.ITEMS[id]], skipBrief: true }), ids.self); await P.waitForTimeout(400); await P.click('[data-act="plShow"]'); await shot('15-question-self-check'); await closeAny(P);
  await P.evaluate(() => __sq.ACT.tsukkomi()); await P.waitForTimeout(400); await shot('02-brief-tsukkomi'); await P.click('[data-act="plGo"]'); await P.waitForTimeout(400); await shot('16-tsukkomi-battle'); await closeAny(P);
  await P.click('.route [data-a="ref"]'); await P.waitForTimeout(300); await P.click('[data-act="refStar"][data-a="5"]'); await P.waitForTimeout(300); await shot('17-reflection-calibration'); await closeAny(P);
  await P.evaluate(() => __sq.ACT.stageGo('hw')); await P.waitForTimeout(300); await shot('18-homework-check'); await closeAny(P);
  for (const tab of ['drill', 'map', 'reward', 'menu']) { await P.click(`#dock [data-tab="${tab}"]`); await P.waitForTimeout(500); await shot('20-tab-' + tab); }
  await P.click('#dock [data-tab="drill"]'); await P.evaluate(() => __sq.ACT.drillOpen('bank:EW')); await P.waitForTimeout(300); await shot('21-drill-sheet'); await closeAny(P);
  for (const pg of ['school', 'diag', 'subj', 'ai', 'family', 'mist']) { await P.evaluate((pg) => __sq.openPage(pg), pg); await P.waitForTimeout(400); await shot('30-page-' + pg); }
});
/* ② iPad よこ */
await run('ipad-landscape', { w: 1180, h: 820 }, async ({ page: P, shot }) => {
  await seed(P); await shot('40-landscape-home');
  await P.click('[data-act="stageGo"][data-a="mem"] >> nth=0'); await P.waitForTimeout(500); await shot('41-landscape-question');
});
/* ③ スマホ */
await run('phone', { w: 390, h: 844, dpr: 2 }, async ({ page: P, shot }) => {
  await seed(P); await shot('50-phone-home');
  await P.click('[data-act="stageGo"][data-a="mem"] >> nth=0'); await P.waitForTimeout(500); await shot('51-phone-question');
});
console.log(log.length ? '\n注意:\n' + log.join('\n') : '\nエラーなし');
console.log('→', out);
