import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

// Read-only: no network requests or filesystem changes.
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const root = execFileSync('git', ['-C', scriptDirectory, 'rev-parse', '--show-toplevel'], {encoding: 'utf8'}).trim();
const git = (...args) => execFileSync('git', args, {cwd: root, encoding: 'utf8'});
const manifest = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
const entries = git('ls-tree', '-r', '-l', '-z', 'HEAD').split('\0').filter(Boolean).map((record) => {
  const separator = record.indexOf('\t');
  const [mode, type, object, size] = record.slice(0, separator).trim().split(/\s+/);
  return {path: record.slice(separator + 1), size: size === '-' ? 0 : Number(size), type};
});
const mp4s = entries.filter((entry) => /\.mp4$/i.test(entry.path));
const largeFiles = entries.filter((entry) => entry.size >= 10 * 1024 * 1024).sort((a, b) => b.size - a.size);

console.log(JSON.stringify({
  scope: '只读本地盘点；不代表完整GitHub账号或Windows软件清单',
  project: manifest.name,
  currentBranch: git('branch', '--show-current').trim() || '(detached HEAD)',
  localBranches: git('branch', '--format=%(refname:short)').trim().split('\n').filter(Boolean),
  dependencies: manifest.dependencies ?? {},
  devDependencies: manifest.devDependencies ?? {},
  workingTreeStatus: git('status', '--short').trimEnd(),
  trackedMp4Count: mp4s.length,
  trackedMp4TotalBytes: mp4s.reduce((total, entry) => total + entry.size, 0),
  trackedOutputs: entries.filter((entry) => entry.path.startsWith('out/')),
  largeTrackedFiles: largeFiles,
  notes: ['已跟踪的out文件仍在Git内，.gitignore不会自动移除它们。', '文件大小统计针对HEAD中的文件，不是Git历史或工作区总占用。'],
}, null, 2));
