// src/ の部品をつなげて、1ファイルの index.html を作る。
//   node scripts/build.mjs                     index.html を作る
//   node scripts/build.mjs --artifact <path>   Artifact用（先頭3行を除いた版）も <path> に書く
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const readDir = (dir) =>
  fs.readdirSync(path.join(root, dir)).filter((f) => f.endsWith('.js')).sort().map((f) => read(`${dir}/${f}`)).join('');

export function build() {
  const head = read('src/head.html');
  const css = read('src/style.css');
  const body = read('src/body.html');
  const data = readDir('src/data');
  const app = readDir('src/js');
  return `${head}<style>${css}</style>${body}<script id="data">${data}</script>\n<script>${app}</script>\n`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const html = build();
  fs.writeFileSync(path.join(root, 'index.html'), html);
  console.log(`index.html  ${(html.length / 1024).toFixed(0)} KB`);
  const i = process.argv.indexOf('--artifact');
  if (i > 0) {
    const out = process.argv[i + 1];
    fs.mkdirSync(path.dirname(out), { recursive: true });
    // 先頭3行（doctype・charset・viewport）は公開時に自動で付くので除く
    fs.writeFileSync(out, html.split('\n').slice(3).join('\n'));
    console.log(`artifact    ${out}`);
  }
}
