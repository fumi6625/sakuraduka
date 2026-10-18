// index.html の <script id="data"> にある AGENTS / COMMON から .claude/agents/*.md を作る。
// AI先生の文章は index.html だけを直し、このスクリプトを実行して反映する。
//   node scripts/build-agents.mjs
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const m = html.match(/<script id="data">([\s\S]*?)<\/script>/);
if (!m) throw new Error('index.html に <script id="data"> が見つかりません');

const { AGENTS, COMMON } = vm.runInNewContext(`${m[1]}\n;({ AGENTS, COMMON })`);

const outDir = path.join(root, '.claude', 'agents');
fs.mkdirSync(outDir, { recursive: true });

for (const a of AGENTS) {
  const description = `桜塚高校をめざす中2のAI先生。${a.name}（${a.role}）。呼ぶとき：${a.when}`;
  const md = [
    '---',
    `name: ${a.id}`,
    `description: ${JSON.stringify(description)}`,
    'tools: Read, Write, Edit, Glob, Grep',
    '---',
    '',
    COMMON,
    '',
    a.body,
    '',
  ].join('\n');
  fs.writeFileSync(path.join(outDir, `${a.id}.md`), md);
  console.log('wrote', path.relative(root, path.join(outDir, `${a.id}.md`)));
}
