// 教材データの形式・重複・選択肢をチェックする。  node scripts/validate-data.mjs
import { loadCore } from './headless.mjs';

const C = loadCore(['RAW', 'BANKS', 'BK', 'ITEMS', 'PASS', 'present', 'judge', 'GEN', 'CUR', 'levelOf']);
const errs = [];
const warn = [];
const bad = (m) => errs.push(m);

// 1) 行数と読み込めた数が一致するか（形式ミスで落ちた行を見つける）
const lineCount = (raw) => raw.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('//') && l[0] !== '#').length;
for (const [id] of C.BANKS) {
  if (id === 'ER' || id === 'JR') continue;
  const raw = C.RAW[id] || '';
  const n = lineCount(raw), got = C.BK[id].items.length;
  if (n !== got) bad(`${id}: 行 ${n} に対して読み込めたのは ${got}（形式ミスの行があります）`);
}
// 2) id の重複
for (const [id] of C.BANKS) {
  const ids = C.BK[id].items.map((i) => i.id);
  const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
  if (dup.length) bad(`${id}: id 重複 ${[...new Set(dup)].slice(0, 5).join(' / ')}`);
}
// 3) 問題ごとの形をチェック
const POS = new Set(['n', 'v', 'adj', 'adv', 'prep', 'conj', 'pron', 'aux', 'int', 'num']);
for (const [id] of C.BANKS) {
  for (const it of C.BK[id].items) {
    const tag = `${id}:${(it.q || it.en || it.w || it.base || it.id).toString().slice(0, 24)}`;
    if (it.k === 'word') {
      if (!POS.has(it.pos)) bad(`${tag} 品詞が不明: ${it.pos}`);
      if (!it.ja) bad(`${tag} 日本語が空`);
    }
    if (['mc', 'listen', 'read'].includes(it.k)) {
      const o = [it.c, ...it.w];
      if (o.some((x) => !x)) bad(`${tag} 空の選択肢`);
      if (new Set(o).size !== 4) bad(`${tag} 選択肢が重複: ${o.join(' / ')}`);
      if (!it.q) bad(`${tag} 問題文が空`);
    }
    if (it.k === 'order' && it.en.split(' ').length < 3) bad(`${tag} 語数が少ない`);
    if (it.k === 'yomi' && !/^[ぁ-ゖー]+$/.test(it.r)) bad(`${tag} 読みがひらがなでない: ${it.r}`);
    if (it.k === 'verb' && (!it.past || !it.pp)) bad(`${tag} 活用が空`);
  }
}
// 4) 長文
for (const [kind, arr] of Object.entries(C.PASS)) {
  arr.forEach((p) => p.qs.forEach((q, i) => {
    if (q.length < 5) bad(`長文${p.id}-${i}: 要素不足`);
    if (new Set(q.slice(1, 5)).size !== 4) bad(`長文${p.id}-${i}: 選択肢が重複`);
  }));
}
// 4b) 長文の数と長さ（小5・6年用：英語24題・国語30題。英語は40語以上、国語は400字以上で、800字以上が5題）
if (C.PASS.E.length < 24) bad(`英語の長文が ${C.PASS.E.length} 題（24題以上）`);
if (C.PASS.J.length < 30) bad(`国語の長文が ${C.PASS.J.length} 題（30題以上）`);
for (const p of C.PASS.E) if (p.text.trim().split(/\s+/).length < 40) bad(`英語の長文 ${p.id} が40語未満`);
for (const p of C.PASS.J) if (p.text.length < 400) bad(`国語の長文 ${p.id} が400字未満`);
if (C.PASS.J.filter((p) => p.text.length >= 800).length < 5) bad('国語の長文：800字以上が5題未満');
// 4c) どの問題にも難易度（小4〜小6）が付く
for (const [id] of C.BANKS) for (const it of C.BK[id].items) {
  const t = C.levelOf(it).text;
  if (!/^(小[456](・[123]学期)?レベル|標準レベル|応用レベル)$/.test(t)) { bad(`${id}:${it.id} 難易度が決まらない「${t}」`); break; }
}
// 5) 実際に出題の形にできるか（全問）
let made = 0;
for (const [id] of C.BANKS) {
  for (const it of C.BK[id].items) {
    try {
      const V = C.present(it);
      if (V.kind === 'mc') {
        if (V.choices.length !== 4) bad(`${id}:${it.id} 選択肢が${V.choices.length}個になる（${V.q}）`);
        else if (new Set(V.choices.map((c) => c.t)).size !== 4) bad(`${id}:${it.id} 選択肢が重複して出る（${V.q}）`);
      }
      if (!V.q) bad(`${id}:${it.id} 問題文が空`);
      made++;
    } catch (e) { bad(`${id}:${it.id} present() で例外: ${e.message}`); }
  }
}
// 6) カリキュラムが指すジェネレータ・タグの存在
const tagsOf = (b) => [...new Set(C.BK[b].items.map((i) => i.tag || ''))];
for (const c of C.CUR) for (const [k, b] of [['jk', 'JK'], ['sc', 'SQ'], ['so', 'OQ'], ['g', 'EG']]) for (const p of c[k]) if (!tagsOf(b).some((t) => t.startsWith(p))) bad(`CUR ${c.from}.${k}: タグ「${p}」に合う ${b} の問題がありません`);
for (const c of C.CUR) for (const k of ['m', 'rv', 'w', 's']) for (const g of c[k]) if (!C.GEN[g]) bad(`CUR ${c.from}.${k}: ジェネレータ ${g} がありません`);

const total = Object.values(C.BK).reduce((t, b) => t + b.items.length, 0);
console.log('=== 教材の数 ===');
for (const [id, name] of C.BANKS.map((b) => [b[0], b[1]])) console.log(`${id.padEnd(3)} ${name.padEnd(14, '　')} ${String(C.BK[id].items.length).padStart(5)}`);
console.log(`合計 ${total} 問（固定） ＋ 自動生成 ${Object.keys(C.GEN).length} 種（無限）  出題の形にできた: ${made}`);
if (warn.length) console.log('注意:\n' + warn.join('\n'));
if (errs.length) { console.log(`\n問題 ${errs.length} 件:\n` + errs.slice(0, 60).join('\n')); process.exit(1); }
console.log('問題なし');
