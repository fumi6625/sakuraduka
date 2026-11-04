// ブラウザなしでデータとコア（DOMに触れない部分）を読み込む。テストと出題サンプル作成用。
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readDir = (dir, ok = () => true) =>
  fs.readdirSync(path.join(root, dir)).filter((f) => f.endsWith('.js') && ok(f)).sort()
    .map((f) => fs.readFileSync(path.join(root, dir, f), 'utf8')).join('');

/** names: 取り出したい識別子の配列。{識別子: 値} を返す */
export function loadCore(names) {
  const data = readDir('src/data');
  const core = readDir('src/js', (f) => /^\d\d-/.test(f) && +f.slice(0, 2) > 0 && +f.slice(0, 2) < 50);
  return vm.runInNewContext(`${data}${core}\n;({${names.join(',')}})`, { console });
}
