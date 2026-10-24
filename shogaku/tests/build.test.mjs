// index.html の中身（データ＋画面のコードぜんぶ）が、1つの script として読み込めることを確かめる。
//   node --test tests/build.test.mjs
// 画面のコード（50番台）はブラウザがないと動かさないので、ほかのテストでは見えない。
// 同じ名前の const／function を二重に宣言すると、ページ全体が真っ白になる（前に、ここで一度やった）ので、構文の段階で見張る。
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from '../scripts/build.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readDir = (dir) => fs.readdirSync(path.join(root, dir)).filter((f) => f.endsWith('.js')).sort().map((f) => fs.readFileSync(path.join(root, dir, f), 'utf8')).join('');

test('データと画面のコードを、つなげて読み込める（同じ名前の二重宣言・構文エラーがない）', () => {
  assert.doesNotThrow(() => new vm.Script(readDir('src/data') + '\n' + readDir('src/js'), { filename: 'sakura-quest.js' }));
});

test('index.html は、src/ から作った最新のもの（直接は直さない）', () => {
  const built = build();
  const cur = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.equal(cur, built, 'index.html が古い。node scripts/build.mjs で作りなおす');
});
