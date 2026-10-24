// 「6年生のまとめへの近づき具合」の予定カーブを作る：週5日（月〜金）・正答率85%で続けた子の、実力の見こみ(K)の進み。
//   node scripts/plan-curve.mjs           src/data/15-plan-path.js を書く
//   node scripts/plan-curve.mjs --check   いまの教材・ルートで作りなおした値と、15-plan-path.js のずれを出す
// 教材やルートを変えたら、作りなおす（tests/path.test.mjs が、古くなっていないかを確かめる）。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCore } from './headless.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(root, 'src/data/15-plan-path.js');
const START = '2026-10-19', EXAM = '2028-03-01';

/** 標準の子の、チェックポイント（月末と6年生のまとめの日）ごとのK。{d:[日付…], K:{英:[…],…}} */
export function planCurve({ acc = 0.85, dows = [1, 2, 3, 4, 5], seed = 42 } = {}) {
  const C = loadCore(['S', 'setToday', 'routeFor', 'recordAnswer', 'noteAnswer', 'completeStage', 'addDays', 'restoreGx', 'knowNow', 'diff']);
  let r = seed;
  const rand = () => { r = (r * 1664525 + 1013904223) >>> 0; return r / 4294967296; };
  const days = C.diff(START, EXAM);
  const checks = ['2026-10-18'];
  for (let i = 0; i <= days; i++) {
    const d = C.addDays(START, i), nx = C.addDays(START, i + 1);
    if (d.slice(0, 7) !== nx.slice(0, 7) && d < EXAM) checks.push(d);
  }
  checks.push(EXAM);
  const K = { 英: [0], 国: [0], 数: [0], 理: [0], 社: [0] };
  for (let i = 0; i <= days; i++) {
    const date = C.addDays(START, i);
    C.setToday(date);
    if (dows.includes(new Date(date + 'T00:00:00').getDay())) {
      C.restoreGx();
      for (const s of C.routeFor(date)) {
        if (s.kind === 'session' && s.items.length) {
          let ok = 0;
          for (const it of s.items) { const g = rand() < acc; C.recordAnswer(it, g); C.noteAnswer(g); if (g) ok++; }
          C.completeStage(date, s.id, { ok, n: s.items.length, sec: s.items.length * 12, boss: !!s.boss });
        } else {
          if (s.id === 'diag') C.S.diag[s.subj] = { ans: [], sc: 4, done: 1, paid: 1, at: date };
          C.completeStage(date, s.id, { ok: s.id === 'diag' ? 4 : 0, n: 0, sec: 0, min: s.min || 1 });
        }
      }
    }
    if (checks.includes(date)) { const k = C.knowNow(date); for (const s of Object.keys(K)) K[s].push(Math.round(k[s])); }
  }
  return { d: checks, K };
}

const text = (c) => `/* 6年生のまとめへの近づき具合の「予定」：週5日（月〜金）・正答率85%で続けた子の、実力の見こみ(K)の進み（月末と6年生のまとめの日の値）。
   scripts/plan-curve.mjs で作る。教材やルートを変えたら作りなおす（tests/path.test.mjs が、古くなっていないかを確かめる） */
const PLAN_PATH=${JSON.stringify(c).replace(/"(英|国|数|理|社)":/g, '$1:')};\n`;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const c = planCurve();
  if (process.argv.includes('--check')) {
    const cur = loadCore(['PLAN_PATH']).PLAN_PATH;
    for (const s of Object.keys(c.K)) {
      const e = c.K[s].length - 1;
      console.log(`${s}  いまの予定の終わり ${cur.K[s][e]} ／ 作りなおした値 ${c.K[s][e]}（${Math.round((c.K[s][e] / cur.K[s][e] - 1) * 100)}%）`);
    }
  } else {
    fs.writeFileSync(OUT, text(c));
    console.log('wrote', OUT, '\n', c.d.length, '点');
    for (const s of Object.keys(c.K)) console.log(s, c.K[s].join(','));
  }
}
