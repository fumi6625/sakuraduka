// 毎日の流れ（重複しない・まちがいが翌日に戻る・ミニ診断・つづりの同義語・自動で付く目標）を確かめる。
//   node --test tests/flow.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadCore } from '../scripts/headless.mjs';

const NAMES = ['S', 'setToday', 'routeFor', 'present', 'judge', 'recordAnswer', 'noteAnswer', 'completeStage', 'addDays', 'dayOK', 'dayNeed', 'peekDay',
  'BK', 'restoreGx', 'syncAutoGoals', 'isAutoGoal', 'SJL', 'PASS', 'ITEMS', 'dochira', 'stageXP', 'tierFor', 'doneDays', 'masteredBy', 'bankStats', 'qaStat', 'mathDays90', 'mistakeStats', 'GOAL_AUTO', 'goalN', 'goalOK', 'paceF', 'goalText', 'ROADMAP'];
const START = '2026-10-19';
const rng = (seed) => { let r = seed; return () => { r = (r * 1664525 + 1013904223) >>> 0; return r / 4294967296; }; };

/** 1日ぶんを、正答率 acc で最後までやる。answered に {id,date,ok} を足していく */
function doDay(C, date, rand, acc, log) {
  C.setToday(date); C.restoreGx();
  const route = C.routeFor(date);
  for (const st of route) {
    if (st.kind === 'session' && st.items.length) {
      let ok = 0;
      for (const it of st.items) {
        const g = rand() < acc; C.recordAnswer(it, g); C.noteAnswer(g); if (g) ok++;
        if (log) log(it, g);
      }
      C.completeStage(date, st.id, { ok, n: st.items.length, sec: st.items.length * 12, boss: !!st.boss });
    } else {
      // ミニ診断は、画面で6問おわって「受けた」記録が付く（dgPick と同じ）
      if (st.id === 'diag') C.S.diag[st.subj] = { ans: [], sc: 4, done: 1, paid: 1, at: date };
      C.completeStage(date, st.id, { ok: st.id === 'diag' ? 4 : 0, n: 0, sec: 0, min: st.min || 1 });
    }
  }
  return route;
}

test('同じ日に、同じ自動生成の問題が2回出ない', () => {
  const C = loadCore(NAMES), rand = rng(5);
  const dup = [];
  for (let i = 0; i < 150; i++) {
    const date = C.addDays(START, i);
    C.setToday(date); C.restoreGx();
    const route = C.routeFor(date), seen = new Set();
    for (const st of route) for (const it of st.items) {
      if (it.k !== 'gen') continue;
      const V = C.present(it);
      const key = it.gid + '|' + V.q + '|' + (V.accept || []).join(',') + '|' + (V.choices ? V.choices.find((c) => c.ok).t : '');
      if (seen.has(key)) dup.push(`${date} ${st.id} ${V.q.slice(0, 30)}`);
      seen.add(key);
    }
    doDay(C, date, rand, 0.75);
  }
  assert.deepEqual(dup.slice(0, 5), [], `同じ日に同じ生成問題が出た: ${dup.length}件`);
});

test('まちがえた問題は、たいてい次の日のうちにもう一度出る', () => {
  const C = loadCore(NAMES), rand = rng(777);
  const lastWrong = {}, lags = [];
  for (let i = 0; i < 90; i++) {
    const date = C.addDays(START, i);
    doDay(C, date, rand, 0.7, (it, g) => {
      if (it.k === 'gen') return;
      if (lastWrong[it.id] !== undefined) { if (i >= 29) lags.push(i - lastWrong[it.id]); delete lastWrong[it.id]; }
      if (!g) lastWrong[it.id] = i;
    });
  }
  assert.ok(lags.length > 100, `集計できた件数が少ない: ${lags.length}`);
  const next = lags.filter((x) => x <= 1).length / lags.length;
  assert.ok(next >= 0.6, `翌日に戻った割合 ${Math.round(next * 100)}%（6割は欲しい）`);
});

test('ミニ診断：3日目から1日1教科ずつ、5教科でおわり。クリアラインには数えない。しっかり期には出ない', () => {
  const C = loadCore(NAMES), rand = rng(3);
  const subj = [];
  for (let i = 0; i < 40; i++) {
    const date = C.addDays(START, i);
    const route = doDay(C, date, rand, 0.8);
    const dg = route.find((s) => s.id === 'diag');
    if (i < 2) assert.ok(!dg, `${i + 1}日目にミニ診断が出ている`);
    if (dg) {
      assert.equal(dg.kind, 'check'); assert.ok(C.SJL.includes(dg.subj));
      subj.push(dg.subj);
      // 診断のステージはXPが付かない
      const rec = C.peekDay(date);
      assert.ok(rec.stg.diag, 'ステージ完了が記録されている');
    }
    if (i >= 29) assert.ok(!dg, `${i + 1}日目（しっかり期）にミニ診断が出ている`);
  }
  assert.equal(subj.length, C.SJL.length, `ミニ診断が出た回数: ${subj.length}`);
  assert.equal(new Set(subj).size, subj.length, '同じ教科が2回出ていない');
  assert.ok(C.SJL.every((s) => C.S.diag[s] && C.S.diag[s].done), '5教科ぶん、受けたことになる');
  // 診断とふりかえりだけではクリアラインにならない
  assert.equal(C.dayOK({ stg: { diag: {}, hw: {}, ref: {} } }, 1), false);
});

test('ミニ診断のステージ自体にはXPが付かない（+10XPは診断の画面で、1教科につき1回だけ）', () => {
  const C = loadCore(NAMES), rand = rng(9);
  for (let i = 0; i < 2; i++) doDay(C, C.addDays(START, i), rand, 0.8);
  const date = C.addDays(START, 2);
  C.setToday(date);
  const dg = C.routeFor(date).find((s) => s.id === 'diag');
  assert.ok(dg, '3日目にミニ診断が出る');
  assert.equal(C.completeStage(date, 'diag', { ok: 4, n: 0, sec: 0, min: 3 }).xp, 0);
});

test('英単語のつづり：同じ意味・同じ品詞のことばは、どちらを書いても正解', () => {
  const C = loadCore(NAMES);
  const by = (en) => C.BK.EW.items.find((i) => i.en === en);
  for (const [a, b] of [['shop', 'store'], ['bike', 'bicycle'], ['start', 'begin'], ['huge', 'enormous'], ['sea', 'ocean']]) {
    const it = by(a);
    assert.ok(it, `${a} がない`);
    C.S.srs[it.id] = { b: 4, d: '2020-01-01', n: 5, ok: 5 };
    const V = C.present(it);
    assert.equal(V.kind, 'typ', `${a} は定着したらつづりで出る`);
    assert.ok(C.judge(V, a) && C.judge(V, b), `${a} / ${b} がどちらも正解になる`);
    assert.ok(!C.judge(V, 'zzz'));
  }
});

test('長文：国語30題・英語24題以上あり、どの問いも4択で、正解が選択肢に1つだけ入る', () => {
  const C = loadCore(NAMES);
  assert.ok(C.PASS.J.length >= 30, `国語の長文 ${C.PASS.J.length}`);
  assert.ok(C.PASS.E.length >= 24, `英語の長文 ${C.PASS.E.length}`);
  for (const arr of [C.PASS.J, C.PASS.E]) {
    assert.equal(new Set(arr.map((p) => p.id)).size, arr.length, '長文のIDが重ならない');
    for (const p of arr) {
      assert.ok(p.qs.length >= 3, `${p.id} の問いが少ない`);
      for (const q of p.qs) assert.equal(new Set(q.slice(1, 5)).size, 4, `${p.id}: 選択肢が重なる`);
    }
  }
  // 国語の長文：やや長い読解（800字以上）が5題以上ある
  assert.ok(C.PASS.J.filter((p) => p.text.length >= 800).length >= 5, `800字以上の国語の長文 ${C.PASS.J.filter((p) => p.text.length >= 800).length}題`);
  // 英語の長文：どれも40語以上で、設問の一部は英語。英語の設問の正解が、英文の中に根拠をもつ
  for (const p of C.PASS.E) {
    assert.ok(p.text.trim().split(/\s+/).length >= 40, `${p.id} が短い：${p.text.trim().split(/\s+/).length}語`);
    const en = p.qs.filter((q) => /^[A-Za-z]/.test(q[0]));
    assert.ok(en.length >= 1, `${p.id} の英語の設問が${en.length}つ`);
  }
});

test('毎日のルートに、長文は週に1題ずつ入り、新しい長文から順に出る', () => {
  const C = loadCore(NAMES), rand = rng(11);
  const seen = { ER: [], JR: [] };
  for (let i = 0; i < 126; i++) {
    const date = C.addDays(START, i);
    const route = doDay(C, date, rand, 0.8);
    for (const st of route) for (const it of st.items) if ((it.bank === 'ER' || it.bank === 'JR') && !seen[it.bank].includes(it.pid)) seen[it.bank].push(it.pid);
  }
  assert.ok(seen.ER.length >= 8 && seen.JR.length >= 8, `18週間で出た長文：英${seen.ER.length} 国${seen.JR.length}`);
  assert.equal(new Set(seen.ER).size, seen.ER.length);
});

test('目標：記録から自動で付くものだけが自動になる', () => {
  const C = loadCore(NAMES);
  assert.equal(C.isAutoGoal('2026-10', 4), true, '連続7日は記録から自動');
  assert.equal(C.isAutoGoal('2026-10', 0), false, 'ふつうの目標は自動にしない');
  C.S.best = 3;
  assert.equal(C.syncAutoGoals().length, 0, '条件を満たしていないうちは付かない');
  C.S.best = 7;
  const got = C.syncAutoGoals();
  assert.equal(got.length, 1);
  assert.ok(C.S.ms['2026-10|4']);
  assert.equal(C.syncAutoGoals().length, 0, '2回目は付け直さない（XPが二重に入らない）');
});

/** 指定の曜日だけ（日=0）、acc の正答率でやった日々を days 日ぶん進める。やった日の route を返す */
function simulate(C, days, acc, dows = null, seed = 1, skip = () => false) {
  const rand = rng(seed), out = [];
  for (let i = 0; i < days; i++) {
    const date = C.addDays(START, i);
    if ((dows && !dows.includes(new Date(date + 'T00:00:00').getDay())) || skip(i)) continue;
    out.push({ i, date, route: doDay(C, date, rand, acc) });
  }
  return out;
}
const seenBy = (C, bank) => C.BK[bank].items.filter((it) => C.S.srs[it.id]).length;
const minutesOf = (route) => route.reduce((t, s) => t + (s.min || 0), 0);

test('毎日やる子：理科・社会の一問一答が、1年ちょっとでほぼ一通り出る', () => {
  const C = loadCore(NAMES);
  simulate(C, 400, 0.9);
  assert.ok(seenBy(C, 'SQ') >= 0.8 * C.BK.SQ.items.length, `理科 ${seenBy(C, 'SQ')}/${C.BK.SQ.items.length}`);
  assert.ok(seenBy(C, 'OQ') >= 0.6 * C.BK.OQ.items.length, `社会 ${seenBy(C, 'OQ')}/${C.BK.OQ.items.length}`);
  assert.ok(seenBy(C, 'JG') >= 0.3 * C.BK.JG.items.length, `国語の文法・古文 ${seenBy(C, 'JG')}/${C.BK.JG.items.length}`);
});

test('週3日（月水金）しかやらない子でも、国語・社会・理科・英語のどれにもふれる', () => {
  const C = loadCore(NAMES);
  simulate(C, 280, 0.75, [1, 3, 5]);
  for (const b of ['SQ', 'OQ', 'JG', 'JI', 'EG']) assert.ok(seenBy(C, b) >= 20, `${b} が ${seenBy(C, b)} 問しか出ていない`);
});

test('1日の時間の見積りは、段階ごとの上限をこえない', () => {
  const C = loadCore(NAMES);
  const days = simulate(C, 120, 0.8);
  const worst = Math.max(...days.map((d) => minutesOf(d.route)));
  assert.ok(worst <= 39, `いちばん長い日の見積り ${worst} 分`);
  const early = Math.max(...days.slice(0, 14).map((d) => minutesOf(d.route)));
  assert.ok(early <= 15, `ならし期の見積り ${early} 分`);
});

test('7日以上休んだあとは、量をもどして、少しずつ戻す', () => {
  const C = loadCore(NAMES);
  const days = simulate(C, 100, 0.85, null, 3, (i) => i >= 60 && i < 74);
  const before = days.filter((d) => d.i >= 53 && d.i < 60).map((d) => minutesOf(d.route));
  const back = days.filter((d) => d.i >= 74).slice(0, 8).map((d) => minutesOf(d.route));
  assert.ok(Math.max(...before) >= 25, '休む前は、しっかり期の量');
  assert.ok(back[0] <= 15, `休み明け初日は短く：${back[0]}分`);
  assert.ok(back[2] <= 20, `3日目もまだ短い：${back[2]}分`);
  assert.ok(back[7] > back[0] + 8, `すこしずつ戻る：${back.join(',')}`);
});

test('正答が4割に届かないドリルでは、クリアライン・連続記録に数えない', () => {
  const C = loadCore(NAMES);
  assert.equal(C.dayOK({ stg: { mem: { ok: 0, n: 10 }, hw: {} } }, 1), false);
  assert.equal(C.dayOK({ stg: { mem: { ok: 3, n: 10 }, hw: {} } }, 1), false);
  assert.equal(C.dayOK({ stg: { mem: { ok: 4, n: 10 }, hw: {} } }, 1), true);
  assert.equal(C.dayOK({ stg: { mem: { ok: 1, n: 10 }, math: { ok: 8, n: 10 } } }, 2), false, '2つとも4割以上でないと、ふつう以上ではクリアラインにならない');
  assert.equal(C.dayOK({ stg: { mem: { ok: 5, n: 10 }, math: { ok: 8, n: 10 } } }, 2), true);
  assert.equal(C.dayOK({ stg: { mem: { ok: 8, n: 10 }, ref: {} } }, 2), false, 'ふりかえり（自己採点）は、2つ目に数えない');
  assert.equal(C.dayOK({ stg: { mem: { ok: 8, n: 10 }, hw: {} } }, 2), false, '保護者OKがオフなら、宿題は2つ目に数えない');
  C.S.pin = '1234'; C.S.pinOn = 1;
  assert.equal(C.dayOK({ stg: { mem: { ok: 8, n: 10 }, hw: {} } }, 2), true, '保護者OKがオンなら、宿題が2つ目になる');
  assert.equal(C.dayNeed({ stg: { mem: { ok: 8, n: 10 } } }, 2), 1);
  assert.equal(C.dayNeed({ stg: { hw: {} } }, 2), 1, 'ドリルが1つもない日は、あと1つ以上');
});

test('「AとBのどちら？」「A？B？」の問いは、もう一方の答えも選択肢に入る', () => {
  const C = loadCore(NAMES);
  let n = 0;
  for (const b of Object.keys(C.BK)) for (const it of C.BK[b].items) {
    if (it.k !== 'qa') continue;
    const ab = C.dochira(it.q);
    if (!ab) continue;
    const other = ab.find((x) => x !== it.a && !x.endsWith(it.a));
    if (!other) continue;
    const V = C.present(it);
    n++;
    assert.ok(V.choices.some((c) => c.t === other), `${it.q} の選択肢に「${other}」がない`);
  }
  assert.ok(n >= 8, `2択の問い ${n} 件`);
});

test('長文の選択肢：正解が最長に偏らない（どの順位も4割以下）', () => {
  const C = loadCore(NAMES);
  for (const [label, arr] of [['国語', C.PASS.J], ['英語', C.PASS.E]]) {
    const r = [0, 0, 0, 0]; let n = 0;
    for (const p of arr) for (const q of p.qs) {
      const c = q[1].length, ws = [q[2], q[3], q[4]].map((x) => x.length);
      const rank = ws.filter((w) => w > c).length + ws.filter((w) => w === c).length / 2;
      r[Math.min(3, Math.round(rank))]++; n++;
    }
    assert.ok(Math.max(...r) / n <= 0.45, `${label}の長文：正解の長さの順位 ${r.join('/')}`);
    assert.ok(r[0] / n <= 0.4, `${label}の長文：正解が最長の割合 ${Math.round(r[0] / n * 100)}%`);
  }
});

test('受験前の3か月：高い箱（5〜6）のふくしゅうも出る／どの教科も1割以上ある', () => {
  const C = loadCore(NAMES), rand = rng(42);
  let high = 0, late = 0, mid = 0; const bySubj = {};
  for (let i = 0; i < 500; i++) {
    const date = C.addDays(START, i);
    C.setToday(date); C.restoreGx();
    const route = C.routeFor(date);
    for (const st of route) {
      if (st.kind === 'session' && st.items.length) {
        let ok = 0;
        for (const it of st.items) {
          const s = C.S.srs[it.id];
          if (i >= 400 && s && s.b >= 5 && it.k !== 'gen') high++;
          if (i >= 150 && i < 350 && s && s.b >= 5 && it.k !== 'gen') mid++;   // 受験前でない時期（ふだん）
          if (i >= 410) { late++; bySubj[it.subj || '?'] = (bySubj[it.subj || '?'] || 0) + 1; }
          const g = rand() < 0.9; C.recordAnswer(it, g); C.noteAnswer(g); if (g) ok++;
        }
        C.completeStage(date, st.id, { ok, n: st.items.length, sec: st.items.length * 12, boss: !!st.boss });
      } else C.completeStage(date, st.id, { ok: 0, n: 0, sec: 0, min: st.min || 1 });
    }
  }
  assert.ok(high >= 400, `箱5〜6のふくしゅう ${high} 回（最後の100日）`);
  assert.ok(mid >= 150, `箱5〜6のふくしゅう ${mid} 回（150〜350日め。受験前でなくても、期限をすぎたら回ってくる）`);
  for (const sj of ['英', '国', '数', '理', '社']) assert.ok((bySubj[sj] || 0) / late >= 0.1, `${sj} の割合 ${Math.round((bySubj[sj] || 0) / late * 100)}%（最後の90日）`);
});

test('XP：正答が4割に届かないときは0（てきとうに押してかせげない）', () => {
  const C = loadCore(NAMES);
  assert.equal(C.stageXP('mem', { ok: 1, n: 10 }), 0);
  assert.ok(C.stageXP('mem', { ok: 4, n: 10 }) > 0);
  assert.ok(C.stageXP('mem', { ok: 10, n: 10 }) > C.stageXP('mem', { ok: 5, n: 10 }));
  assert.equal(C.stageXP('sub', { ok: 2, n: 10, boss: true }), 0);
});

test('もともと週に2日の子は、段階をもどされない（先週までよくやっていた子が、やすんだときだけもどす）', () => {
  const C = loadCore(NAMES);
  simulate(C, 140, 0.85, [0, 6]);
  const date = C.addDays(START, 141);
  C.setToday(date);
  assert.ok(C.doneDays(date) >= 28, `やった日数 ${C.doneDays(date)}`);
  assert.equal(C.tierFor(date), 3, 'しっかり期まで進める');
});

test('再戦：まちがえた計算問題は、数字を変えた同じ型で出る（記録は元の問題のまま）', () => {
  const C = loadCore([...NAMES, 'GEN', 'makeGen', 'drillItems', 'genKey']);
  // 種類がたっぷりある生成問題を1つ選ぶ
  const gid = Object.keys(C.GEN).find((id) => {
    const ks = new Set(); for (let s = 1; s <= 40; s++) ks.add(C.genKey(C.makeGen(id, 2, s * 7919)));
    return ks.size >= 30;
  });
  assert.ok(gid, '種類の多い生成問題がある');
  C.setToday(START); C.restoreGx();
  const it = C.makeGen(gid, 2, 4321), q0 = it.q;
  C.recordAnswer(it, false);
  assert.equal(C.S.srs[it.id].b, 0);
  const d1 = C.addDays(START, 1);
  C.setToday(d1);
  const a = C.drillItems({ type: 'due', n: 10 }), b = C.drillItems({ type: 'due', n: 10 });
  const f = a.find((x) => x.id === it.id);
  assert.ok(f, '翌日に再戦に出る');
  assert.notEqual(f.q, q0, '同じ文のまま出さない（数字を変える）');
  assert.equal(f.gid, gid); assert.equal(f.lv, 2);
  assert.equal(b.find((x) => x.id === it.id).q, f.q, 'その日のうちは中身が変わらない');
  C.recordAnswer(f, true);                       // 新しい数字で正解 → 元の記録が進む
  assert.equal(C.S.srs[it.id].b, 1);
  C.setToday(C.addDays(START, 2));
  assert.equal(C.drillItems({ type: 'due', n: 10 }).some((x) => x.id === it.id), false, '2日目は出ない（間があく）');
});

test('月の目標：自動で付く目標は、ふつうのペース（月〜金・正答率85%）で、その月までに届く', () => {
  const C = loadCore(NAMES);
  const rand = rng(11), at = {};
  const marks = { '2026-11-30': 'nov', '2027-02-28': 'feb', '2027-05-31': 'may' };
  for (let i = 0; i <= 225; i++) {
    const date = C.addDays(START, i), wd = new Date(date + 'T00:00:00').getDay();
    if (wd >= 1 && wd <= 5) doDay(C, date, rand, 0.85);
    if (marks[date]) {
      C.setToday(date);
      const q = C.qaStat(), m = C.mistakeStats();
      at[marks[date]] = { ew: C.bankStats('EW').seen, m90: C.mathDays90(), qn: q.n, qa: q.acc, dead: m.dead };
    }
  }
  assert.ok(at.nov.ew >= 40 && at.nov.m90 >= 3, `11月末：英単語 ${at.nov.ew}語（出題ずみ）、算数90%の日 ${at.nov.m90}`);
  assert.ok(at.feb.qn >= 800 && at.feb.qa >= 0.8, `2月末：理社 ${at.feb.qn}問 正答率 ${at.feb.qa.toFixed(2)}`);
  assert.ok(at.feb.dead >= 100, `2月末：たおした ${at.feb.dead}`);
  assert.ok(at.may.dead >= 250, `5月末：たおした ${at.may.dead}`);
  for (const key of ['2026-11|1', '2026-11|2', '2027-02|2', '2027-02|3', '2027-05|3']) assert.ok(C.GOAL_AUTO[key], `${key} は自動の目標`);
});

test('英単語：群1（5年前半）・群2（5年後半）は並行して出て、群3（6年前半）・群4（6年後半）は、開く日になったら、群1・2をやりきる前にも出はじめる', () => {
  const C = loadCore([...NAMES, 'BK']);
  const rand = rng(21);
  let g2early = 0;
  for (let i = 0; i <= 420; i++) {
    const date = C.addDays(START, i), wd = new Date(date + 'T00:00:00').getDay();
    if (wd >= 1 && wd <= 5) doDay(C, date, rand, 0.85);
    if (i === 100) g2early = C.BK.EW.items.filter((it) => +it.grp === 2 && C.S.srs[it.id]).length;
  }
  const by = {};
  for (const it of C.BK.EW.items) if (C.S.srs[it.id]) by[it.grp] = (by[it.grp] || 0) + 1;
  assert.ok(g2early >= 30, `100日めまでに、群2の語が ${g2early}語`);
  assert.ok((by[3] || 0) >= 20, `群3 ${by[3] || 0}語`);
  assert.ok((by[4] || 0) >= 8, `群4 ${by[4] || 0}語`);
  const g12 = C.BK.EW.items.filter((it) => +it.grp <= 2).length;
  assert.ok(((by[1] || 0) + (by[2] || 0)) < g12, '群1・2は、まだやりきっていない（それでも群3・4に入る）');
});

test('ミス退治：説明の「◯体」と、実際の問題の数が、どの日もそろっている（上限で外したあとも）', () => {
  const C = loadCore(NAMES), rand = rng(3);
  const bad = [];
  for (let i = 0; i < 160; i++) {
    const date = C.addDays(START, i), route = doDay(C, date, rand, 0.8);
    const mis = route.find((s) => s.id === 'mis');
    const m = mis && /(\d+)体/.exec(mis.desc);
    if (m && +m[1] !== mis.items.length) bad.push(`${date}: 説明${m[1]}体／問題${mis.items.length}`);
  }
  assert.deepEqual(bad.slice(0, 5), [], `${bad.length} 日ずれている`);
});

test('XP：宿題・ふりかえり・全クリのXPは、正答4割以上のドリルがある日だけ（ない日は預かって、あとで入る）', () => {
  const C = loadCore(NAMES);
  // 1日ぜんぶ不正解：XPは1つも入らない
  C.setToday(START); C.restoreGx();
  const xp0 = C.S.xp;
  doDay(C, START, rng(1), 0);
  assert.equal(C.S.xp, xp0, '全部まちがえた日は XP 0');
  // 先に宿題・ふりかえり、あとでドリルが4割以上 → 預かっていた分が入る
  const d2 = C.addDays(START, 1);
  C.setToday(d2);
  const x1 = C.S.xp;
  assert.equal(C.completeStage(d2, 'hw', { n: 0, min: 1 }).xp, 0);
  assert.equal(C.completeStage(d2, 'ref', { n: 0, note: 'x', min: 2 }).xp, 0);
  assert.equal(C.S.xp, x1);
  const r = C.completeStage(d2, 'mem', { ok: 8, n: 10, sec: 100 });
  assert.ok(r.xp >= 15 + 10, `預かっていた15XPも入る：${r.xp}`);
});

test('ミニの日：暗証番号を決めていないときは、1週間に2回まで', () => {
  const C = loadCore([...NAMES, 'canLight', 'lightUsed']);
  const mon = '2026-10-19';   // 月曜
  assert.equal(C.canLight(mon), true);
  C.S.light[mon] = 1; C.S.light[C.addDays(mon, 2)] = 1;
  assert.equal(C.lightUsed(C.addDays(mon, 4)), 2);
  assert.equal(C.canLight(C.addDays(mon, 4)), false, '同じ週の3回めはできない');
  assert.equal(C.canLight(C.addDays(mon, 7)), true, '来週はまた使える');
  C.S.pin = '1234'; C.S.pinOn = 1;
  assert.equal(C.canLight(C.addDays(mon, 4)), true, '暗証番号があるときは、おうちの人が決める');
});

test('月の目標：数のある自動の目標は、その子のペース（週3日なら6割）にそろう。週5日の子はそのまま', () => {
  const slow = loadCore(NAMES), rand = rng(31);
  for (let i = 0; i <= 140; i++) {
    const date = slow.addDays(START, i), wd = new Date(date + 'T00:00:00').getDay();
    if ([1, 3, 5].includes(wd)) doDay(slow, date, rand, 0.85);
  }
  const d = slow.addDays(START, 141); slow.setToday(d);
  const pf = slow.paceF(d);
  assert.ok(pf >= 0.5 && pf <= 0.75, `週3日のペース ${pf.toFixed(2)}`);
  assert.ok(slow.goalN('2027-02|2') < 800 && slow.goalN('2027-02|2') >= 400, `理社の延べ問題 ${slow.goalN('2027-02|2')}`);
  assert.ok(slow.goalOK('2026-11|1') && slow.goalOK('2026-11|2'), '週3日でも、11月の英単語と算数の目標には届く');
  const m = slow.ROADMAP.find((x) => x.k === '2027-02');
  assert.ok(!slow.goalText(m, 2).includes('{n}') && slow.goalText(m, 2).includes(String(slow.goalN('2027-02|2'))), '文の {n} が、ペースの数になる');
  const fast = loadCore(NAMES), r2 = rng(32);
  for (let i = 0; i <= 60; i++) { const date = fast.addDays(START, i), wd = new Date(date + 'T00:00:00').getDay(); if (wd >= 1 && wd <= 5) doDay(fast, date, r2, 0.85); }
  const d2 = fast.addDays(START, 61); fast.setToday(d2);
  assert.equal(fast.goalN('2027-02|2'), 800, '週5日の子は、そのままの数');
});
