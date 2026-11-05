import {readdir,readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('dist');let errors=[];let pages=0;let links=0;
async function walk(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory()){await walk(file);continue;}if(!file.endsWith('.html'))continue;pages++;const html=await readFile(file,'utf8');if(!/<title>.+<\/title>/.test(html))errors.push(`${file}: missing title`);
 for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){const u=m[1];if(/^(https?:|mailto:|data:|#)/.test(u))continue;links++;let target=decodeURIComponent(u.split(/[?#]/)[0]);target=target.startsWith('/')?path.join(root,target):path.resolve(path.dirname(file),target);try{await stat(target);}catch{errors.push(`${path.relative(root,file)}: missing ${u}`);}}
}}
const portfolio = await readFile(path.join(root,'portfolio/index.html'),'utf8');
const sectionNav = portfolio.match(/<nav class="wrap portfolio-index"[^>]*>([\s\S]*?)<\/nav>/)?.[1] || '';
const navTargets = [...sectionNav.matchAll(/href="([^"]+)"/g)].map(m=>m[1]);
const sectionOrder = [...portfolio.matchAll(/<section id="(technical|teaching|creative)"/g)].map(m=>m[1]);
if(navTargets.join(',') !== '#technical,#teaching,#creative') errors.push('Portfolio navigation must be Technical, Teaching, Creative.');
if(sectionOrder.join(',') !== 'technical,teaching,creative') errors.push('Portfolio sections must be Technical, Teaching, Creative.');
for(const label of ['01 / PRODUCTS & RESEARCH','02 / TEACHING & MENTORING','03 / FILM, DESIGN & COMMUNITY']){
 if(!portfolio.includes(label)) errors.push(`Portfolio section label missing: ${label}`);
}
if(!/href="\/styles\.css\?v=[a-f0-9]{12}"/.test(portfolio)) errors.push('Portfolio stylesheet must include its content version.');
if(!/<a class="student-showcase-card" href="\/comp90018\/"/.test(portfolio)) errors.push('Portfolio student showcase link is missing.');
await walk(root);console.log(`Checked ${pages} HTML pages and ${links} local references.`);if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log('All local references resolve.');
