// Reuse the already installed, exact Remotion versions without copying node_modules.
import {readFileSync,writeFileSync} from 'node:fs';
const manifest=JSON.parse(readFileSync('package.json','utf8'));
const lock=JSON.parse(readFileSync(process.argv[2],'utf8'));
lock.name=manifest.name;lock.version=manifest.version;
lock.packages['']={name:manifest.name,version:manifest.version,dependencies:manifest.dependencies,devDependencies:manifest.devDependencies};
writeFileSync('package-lock.json',JSON.stringify(lock,null,2)+'\n');
