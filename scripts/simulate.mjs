// 毎日のルートを、ブラウザなしで何日分もシミュレーションする。
//   node scripts/simulate.mjs [日数=30] [正答率=0.75] [--sample 2026-10-19] [--json out.json] [--dpw 3] [--break 100:14]
//   --dpw N：週にN日だけやる子（3＝月水金、4＝月火木金、5＝平日、2＝土日）／--break 開始日めから:日数：その間は休む（おやすみ明けの確認）
// 出力：日ごとの内容（ステージ名・問題数・予想時間）と、各教材の消化状況。
import fs from 'node:fs';
import { loadCore } from './headless.mjs';

const args = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
const nums = args.filter((a, i) => /^\d+(\.\d+)?$/.test(a) && !args[i - 1]?.startsWith('--'));
const DAYS = +(nums[0] || 30), ACC = +(nums[1] || 0.75);
const C = loadCore(['S', 'setToday', 'routeFor', 'present', 'judge', 'recordAnswer', 'noteAnswer', 'completeStage', 'BK', 'BANKS', 'GEN', 'addDays', 'masteredCount', 'masteredBy', 'itemCat', 'dn', 'drillXP', 'lvInfo', 'totalItems', 'mistakeStats', 'previewDay']);

const start = flag('--start') || '2026-10-19';
let rnd = 12345;
const rand = () => { rnd = (rnd * 1664525 + 1013904223) >>> 0; return rnd / 4294967296; };
const sampleDate = flag('--sample');
const out = { days: [] };
const wdn = '日月火水木金土';
const dayLines = [];

const DPW = { 2: [6, 0], 3: [1, 3, 5], 4: [1, 2, 4, 5], 5: [1, 2, 3, 4, 5] }[+flag('--dpw')] || null;
const [BRK0, BRKN] = (flag('--break') || '-1:0').split(':').map(Number);
for (let i = 0; i < DAYS; i++) {
  const date = C.addDays(start, i);
  if ((i >= BRK0 && i < BRK0 + BRKN) || (DPW && !DPW.includes(new Date(date + 'T00:00:00').getDay()))) continue;
  C.setToday(date);
  const stages = C.routeFor(date);
  const rec = { date, wd: wdn[new Date(date + 'T00:00:00').getDay()], stages: [] };
  for (const st of stages) {
    const row = { id: st.id, title: st.t, subj: st.subj, desc: st.desc, min: st.min, n: st.items.length, brk: st.brk };
    if (st.kind === 'session' && st.items.length) {
      let ok = 0;
      for (const it of st.items) {
        const V = C.present(it);
        const good = rand() < ACC;
        C.recordAnswer(it, good); C.noteAnswer(good);
        if (good) ok++;
        if (sampleDate === date && row.samples === undefined) row.samples = [];
        if (sampleDate === date && row.samples.length < 4) {
          row.samples.push({ cat: C.itemCat(it), kind: V.kind, q: V.q, sub: V.sub, choices: V.choices ? V.choices.map((c) => c.t + (c.ok ? ' ◎' : '')) : undefined, accept: V.accept, exp: V.exp });
        }
      }
      row.ok = ok;
      C.completeStage(date, st.id, { ok, n: st.items.length, sec: st.items.length * 12, boss: st.id === 'sub' && st.items.length === 10 && st.t.startsWith('週ボス') });
    } else {
      C.completeStage(date, st.id, { ok: 0, n: 0, sec: 0, min: st.min });
    }
    rec.stages.push(row);
  }
  out.days.push(rec);
  const total = rec.stages.reduce((t, s) => t + s.n, 0), mins = rec.stages.reduce((t, s) => t + s.min, 0);
  dayLines.push(`${date}(${rec.wd}) ${rec.stages.map((s) => `${s.title.replace(/[：:].*/, '')}${s.n ? s.n : ''}`).join(' / ')}  計${total}問 約${mins}分`);
}

console.log(dayLines.join('\n'));
const S = C.S;
console.log('\n=== 教材の消化状況（' + DAYS + '日・正答率' + ACC + '）===');
for (const [id, name] of C.BANKS.map((b) => [b[0], b[1]])) {
  const items = C.BK[id].items; if (!items.length) continue;
  const seen = items.filter((it) => S.srs[it.id]).length;
  console.log(`${id.padEnd(3)} ${name.padEnd(14, '　')} 全${String(items.length).padStart(5)} 出題済${String(seen).padStart(5)} おぼえた${String(C.masteredBy(id)).padStart(5)}`);
}
const genN = Object.values(S.gs).reduce((t, g) => t + g.n, 0);
console.log(`自動生成の計算: ${genN}問 / 累計回答 ${S.tot.n}問 / 連続${S.streak}日 / XP ${S.xp} (Lv.${C.lvInfo(S.xp).lv}) / ミス ${JSON.stringify(C.mistakeStats())}`);
if (flag('--json')) { fs.writeFileSync(flag('--json'), JSON.stringify(out, null, 1)); console.log('JSON →', flag('--json')); }
