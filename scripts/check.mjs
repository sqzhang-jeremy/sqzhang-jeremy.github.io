import {readdir,readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('dist');let errors=[];let pages=0;let links=0;
async function walk(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory()){await walk(file);continue;}if(!file.endsWith('.html'))continue;pages++;const html=await readFile(file,'utf8');if(!/<title>.+<\/title>/.test(html))errors.push(`${file}: missing title`);
 for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){const u=m[1];if(/^(https?:|mailto:|data:|#)/.test(u))continue;links++;let target=decodeURIComponent(u.split(/[?#]/)[0]);target=target.startsWith('/')?path.join(root,target):path.resolve(path.dirname(file),target);try{await stat(target);}catch{errors.push(`${path.relative(root,file)}: missing ${u}`);}}
}}
await walk(root);console.log(`Checked ${pages} HTML pages and ${links} local references.`);if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log('All local references resolve.');
