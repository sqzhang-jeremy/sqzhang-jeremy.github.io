import {readFile,writeFile,mkdir,cp} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const stylesheetVersion=createHash('sha256').update(await readFile('styles.css')).digest('hex').slice(0,12);
const posts=JSON.parse(await readFile('content/posts.json','utf8'));
const pictures=JSON.parse(await readFile('content/creative-images.json','utf8'));
const out='dist'; await mkdir(out,{recursive:true}); await cp('assets',out+'/assets',{recursive:true});
for(const f of ['styles.css','app.js'])await cp(f,out+'/'+f);
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const arrow='<span aria-hidden="true">↗</span>';
const external=(url,label,cls='text-link')=>`<a class="${cls}" href="${url}" target="_blank" rel="noopener noreferrer">${label} ${arrow}</a>`;
const meta=(text)=>`<span class="eyebrow">${text}</span>`;
function layout(title,body,active='',description='Jeremy Zhang is an AI engineer and researcher in Melbourne, working across AI products, agent evaluation and human-centred computing.'){
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)} — Jeremy Zhang</title><meta name="description" content="${esc(description)}"><meta name="theme-color" content="#f8f8f4"><meta property="og:title" content="${esc(title)} — Jeremy Zhang"><meta property="og:description" content="${esc(description)}"><link rel="icon" href="/assets/original-logo.png" type="image/png" sizes="48x48"><link rel="stylesheet" href="/styles.css?v=${stylesheetVersion}"><script defer src="/app.js"></script></head><body><a class="skip" href="#main">Skip to content</a><header class="site-header wrap"><a class="brand" href="/" aria-label="Jeremy Zhang home"><img src="/assets/original-logo.png" width="40" height="40" alt="Jeremy Zhang’s original landscape logo"></a><nav aria-label="Main navigation">${[['home','Home','/'],['portfolio','Portfolio','/portfolio/'],['writing','Writing','/writing/'],['about','About','/about/'],['cv','CV','/cv/']].map(([key,label,url])=>`<a href="${url}"${active===key?' aria-current="page"':''}>${label}</a>`).join('')}</nav><a class="header-contact" href="mailto:sqzhang.jeremy@gmail.com">Let’s talk ${arrow}</a></header><main id="main">${body}</main>${body.includes('class="twitter-tweet"')?'<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>':''}<footer class="wrap"><div><a class="footer-name" href="/">Jeremy Zhang</a><p>Curiosity, research, and things that work.</p></div><div class="footer-links">${external('https://github.com/sqzhang-jeremy','GitHub')}${external('https://www.linkedin.com/in/realjeremyzhang/','LinkedIn')}<a href="mailto:sqzhang.jeremy@gmail.com">Email ${arrow}</a></div><div class="footer-bottom"><span>© 2026 Jeremy Zhang</span><span>Made with care in Melbourne.</span><a href="#main">Back to top ↑</a></div></footer></body></html>`;
}
async function page(path,title,body,active,desc){const file=out+'/'+path;await mkdir(file.substring(0,file.lastIndexOf('/')),{recursive:true});await writeFile(file,layout(title,body,active,desc));}
const parkingVisual = `<div class="project-art parking-cover"><img src="/assets/parkingmate-sign-example.png" width="972" height="1128" alt="Melbourne parking sign beside ParkingMate’s split verdict for the left and right arrows." decoding="async"></div>`;
const droidVisual = `<div class="project-art research-cover"><img src="/assets/dailydroid-seminar-2917.jpg" alt="DailyDroid seminar slide showing how models, apps, interfaces and frameworks contribute to mobile agent reliability." width="1920" height="1080" loading="lazy"></div>`;
const projectCard=(href,visual,num,title,desc,tags)=>`<article class="project-card"><a class="art-link" href="${href}" aria-label="Explore ${title}">${visual}</a><div class="project-heading"><h3><a href="${href}">${title}</a></h3><a class="circle-link" href="${href}" aria-label="Read ${title} case study">↗</a></div><p>${desc}</p><div class="tags">${tags.map(t=>`<span>${t}</span>`).join('')}</div></article>`;
const writingRows=(list)=>list.map(p=>`<a class="writing-row" href="/posts/${p.id}.html" data-category="${p.category}"><time datetime="${p.date}">${p.date.slice(0,4)}</time><div><h3>${esc(p.title)}</h3><span>${p.category} <i>·</i> ${p.language}</span></div><span class="row-arrow" aria-hidden="true">↗</span></a>`).join('');
const parkingCard = projectCard('/work/parkingmate/',parkingVisual,'01','ParkingMate.ai','Making complicated parking signs easier to understand. An AI product built around a very everyday problem.',['AI product','Full-stack','Founder']);
const intro=(eyebrow,title,text)=>`<section class="wrap page-intro">${meta(eyebrow)}<h1>${title}</h1><p>${text}</p></section>`;
await page('writing/index.html','Writing',`${intro('THE NOTEBOOK','Notes, ideas,<br><em>and discoveries.</em>','A small archive of technical notes, talks and things I wanted to understand better. Original writing from 2020–2022, in English and Chinese.')}<section class="wrap writing-list"><div class="filter-bar" role="group" aria-label="Filter writing">${['All','Engineering','Learning','Notes'].map((x,i)=>`<button type="button" class="filter${i===0?' active':''}" data-filter="${x}" aria-pressed="${i===0}">${x}</button>`).join('')}<span id="result-count" aria-live="polite">${posts.length} articles</span></div>${writingRows(posts)}<p class="archive-note">Historical notes reflect their original publication dates; technical instructions may be out of date. <a href="/reading/">Reading reference ↗</a></p></section>`,'writing');
for(const p of posts) await page('posts/'+p.id+'.html',p.title,`<article class="wrap article-shell"><a class="back-link" href="/writing/">← All writing</a><div class="article-heading">${meta(p.category+' / '+p.language)}<h1>${esc(p.title)}</h1><p><time datetime="${p.date}">${p.date}</time> <span>·</span> Jeremy Zhang</p></div><div class="archive-banner">From the original blog · Content preserved from ${p.date.slice(0,4)}.</div><div class="prose" lang="${p.language==='EN'?'en':'zh-CN'}">${p.html}</div><a class="text-link article-back" href="/writing/">← Back to the notebook</a></article>`,'writing');
const experience=[['QCut','Research & Engineering Intern','Sep 2026–Present','Designed and shipped an agent CLI for video workflows. Developing audio search and automatic video-cutting features, and contributing prompts and testing for QCut’s chat agent.'],['University of Melbourne','Agentic Automation Research Engineer','2025','Built and evaluated mobile agents, with a focus on controlled experiments and failure analysis.'],['Intellifusion','AI Engineer · LLM Evaluation & Fine-Tuning','2023','Developed evaluation workflows, structured prompts and domain-specific fine-tuning.'],['MetaGPT','AI Product Engineer','2022–2023','Worked across product definition and research for generative-image applications.'],['Shenzhen Institute of Advanced Technology','Machine Learning Research Engineer','2020–2021','Built medical-image ML pipelines for classification, segmentation and detection.']];
const timeline=experience.map(([org,role,date,desc])=>`<div class="timeline-row"><span>${date}</span><div><h3>${org}</h3><h4>${role}</h4><p>${desc}</p></div></div>`).join('');
await page('about/index.html','About',`${intro('A LITTLE ABOUT ME','An engineer.<br><em>Always a student.</em>','I’m Jeremy Zhang (Shiquan), an AI engineer and researcher based in Melbourne. I like turning an interesting question into something you can actually use.')}<section class="wrap bio-grid"><aside><img class="avatar" src="/assets/avatar.png" alt="Jeremy’s original illustrated astronaut avatar" width="160" height="160"><p class="small-note">Same curious spirit.<br>A new chapter.</p>${external('https://scholar.google.com.au/citations?user=CmYDev0AAAAJ&hl=en','Google Scholar')}</aside><div class="prose"><h2>Connecting the dots.</h2><p>My path has taken me from mechanical engineering to computer science, from medical-image models to language models, and from research experiments to building ParkingMate.ai.</p><p>I completed an MPhil in Computer Science at the University of Melbourne. My research explores mobile intelligence: evaluating agents that interact with apps, and using smartphone sensing to make on-device language models more personal.</p><p>I’ve also worked as a Head Tutor at the University of Melbourne, mentoring Android project teams and teaching website development with generative AI tools.</p><p>What connects these experiences is a practical question: how do we make technology useful, understandable and dependable for the people using it?</p><a class="text-link" href="/cv/">View my CV ${arrow}</a></div></section><section class="wrap section"><div class="section-heading"><div>${meta('EXPERIENCE')}<h2>A few stops along the way.</h2></div></div><div class="timeline">${timeline}</div></section><section class="wrap personal-section">${meta('BEYOND THE CODE')}<h2>There’s more than one way<br>to <em>make something.</em></h2><p>Film projects, a boxing-club identity, a café poster and a few good coffees. A collection of creative work, from earlier films to co-creating videos with AI.</p><a class="button" href="/portfolio/#creative">Explore creative work ${arrow}</a></section>`,'about');
const youtubePreview=(id,title,host='www.youtube-nocookie.com')=>`<div class="video-preview"><iframe src="https://${host}/embed/${id}" title="${esc(title)}" width="560" height="315" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`;
const cohorts = JSON.parse(await readFile('content/comp90018.json', 'utf8'));
const cohortSections = cohorts.map(({year, tutorials}) => `
<section class="wrap teaching-year" id="year-${year}" aria-labelledby="heading-${year}">
  <div class="section-heading"><div>${meta('SEMESTER 2')}<h2 id="heading-${year}">${year}</h2></div></div>
  ${tutorials.map(({label, groups}) => `<section class="teaching-tutorial">
    <h3>${esc(label)}</h3>
    <ul class="teaching-grid">
      ${groups.map(({group, title, video, videoNote}) => {
        const name = title || 'Group ' + group;
        return `<li class="teaching-card">${video ? youtubePreview(video, `${year} ${label}, ${name} project demo`) : ''}
          <div class="teaching-caption">
            ${title ? meta('GROUP ' + group) : ''}
            <h4>${esc(name)}</h4>
            ${video ? external('https://www.youtube.com/watch?v=' + video, 'Watch on YouTube', 'text-link') : `<p>${esc(videoNote || 'Demo pending')}</p>`}
          </div>
        </li>`;
      }).join('')}
    </ul>
  </section>`).join('')}
</section>`).join('');
await page('comp90018/index.html', 'COMP90018 student projects', `
  ${intro('TEACHING / UNIVERSITY OF MELBOURNE', 'Mobile computing<br><em>in practice.</em>', 'A video portfolio of student teams I mentored in COMP90018, Mobile Computing Systems Programming, from 2024 to 2026. Each demo was made by the team that built the app.')}
  <nav class="wrap portfolio-index" aria-label="Jump to year">${cohorts.map(({year}) => `<a href="#year-${year}">${year} ↓</a>`).join('')}</nav>
${cohortSections}
`, 'portfolio', 'Student mobile app demos from Jeremy Zhang’s COMP90018 tutorials at the University of Melbourne, 2024–2026.');
const creativeImg=(index,cls='')=>pictures[index]?`<img class="${cls}" src="${pictures[index].src}" alt="${esc(pictures[index].alt)}"${pictures[index].width && pictures[index].height ? ` width="${pictures[index].width}" height="${pictures[index].height}"` : ''} loading="lazy">`:'';
const qcutVideoUrl='https://x.com/peter6759/status/2115772753731285000';
const qcutVisual=`<div class="social-video-preview"><blockquote class="twitter-tweet" data-media-max-width="560" data-dnt="true" data-conversation="none" data-align="center"><p>FIST REALM · Co-created with QCut</p><a href="${qcutVideoUrl}">Watch FIST REALM on X</a></blockquote></div>`;
const creativeProjects=`
<article class="creative-row" id="fist-realm"><div>${meta('01 / AI VIDEO CO-CREATION · 2026')}<h3>FIST REALM.</h3><p class="project-original-title">QCut · Research & Engineering Intern · Sep 2026–Present</p><p>A video generated entirely through natural-language interactions with QCut’s chat agent. I contributed prompts and tested the agent to help co-create the film.</p><div class="link-stack">${external(qcutVideoUrl,'Watch FIST REALM on X')}<a class="text-link" href="/work/qcut/">Behind the project ${arrow}</a></div></div>${qcutVisual}</article>
<article class="creative-row" id="graduation-film"><div>${meta('02 / FILM · 2022')}<h3>Remembering SIAT.</h3><p class="project-original-title" lang="zh-CN">毕业纪念视频 · 记忆中的先进院</p><p>A graduation commemorative film for the Shenzhen Institute of Advanced Technology. I contributed to planning, filming and on-set coordination.</p>${external('https://www.youtube.com/watch?v=musMlkXoNCc','Watch the graduation film')}</div>${youtubePreview('musMlkXoNCc','SIAT graduation commemorative film')}</article>
<article class="creative-row" id="graduate-interviews"><div>${meta('03 / FILM · 2022')}<h3>Voices of the graduates.</h3><p class="project-original-title" lang="zh-CN">毕业采访视频 · 毕业生寄语</p><p>Graduate interviews at SIAT. I contributed to filming, editing and post-production.</p>${external('https://www.youtube.com/watch?v=Q4Je_0nL_HY','Watch the interviews')}</div>${youtubePreview('Q4Je_0nL_HY','SIAT graduate interviews')}</article>
<article class="creative-row" id="pku-boxing"><div>${meta('04 / IDENTITY & COMMUNITY · 2019')}<h3>PKU Boxing.</h3><p class="project-original-title" lang="zh-CN">北大拳击社</p><p>Co-designed the identity for the Peking University Shenzhen boxing club. Photos from the club’s participation in the 2019 boxing competition in Shenzhen.</p></div><div><div class="creative-photo logo-photo">${creativeImg(0)}</div><div class="portfolio-gallery">${[1,2,3].map(i=>creativeImg(i)).join('')}</div></div></article>
<article class="creative-row" id="yanan-film"><div>${meta('05 / FILM · 2017')}<h3>A journey to Yan’an.</h3><p class="project-original-title" lang="zh-CN">海南大学致远班 · 社会实践</p><p>Contributed to directing, filming, editing and post-production for Hainan University’s social-practice team.</p>${external('https://www.youtube.com/watch?v=bQNj0DzCzcs','Watch the film')}</div>${youtubePreview('bQNj0DzCzcs','Yan’an social-practice film','www.youtube.com')}</article>
<article class="creative-row" id="haitc-coffee"><div>${meta('06 / DESIGN & EVERYDAY LIFE · 2017')}<h3>HAITC Coffee.</h3><p class="project-original-title" lang="zh-CN">海南大学咖啡馆</p><p>Contributed to the café’s opening poster at Hainan University’s International Tourism College — and made caramel macchiatos while working there.</p></div><div><div class="creative-photo poster-photo">${creativeImg(4)}</div><div class="portfolio-gallery">${[5,6,7].map(i=>creativeImg(i)).join('')}</div></div></article>`;
const seminarTitle = 'Large Language Model Agents for Smartphone Interaction: Introducing DailyDroid and Understanding Mobile Agent Failures';
const seminarPath = '/work/dailydroid-seminar/';
const seminarVisual = `<div class="project-art research-cover"><img src="/assets/dailydroid-seminar-0040.jpg" alt="Seminar slide introducing the coffee-ordering example" width="1280" height="720" loading="lazy"></div>`;
const seminarCard = projectCard(seminarPath, seminarVisual, '02', seminarTitle, 'LLM Agent Seminar · University of Melbourne. Includes the recording and slides.', ['Academic seminar', '2025']);
const portfolioDroidCover = `<div class="project-art research-cover"><img src="/assets/dailydroid-paper-cover.png" alt="DailyDroid paper diagram showing how a mobile agent observes and acts on a smartphone." width="1920" height="701" loading="lazy"></div>`;
const portfolioDroidCard = projectCard('/work/dailydroid/', portfolioDroidCover, '03', 'DailyDroid', 'Benchmarking everyday Android tasks and analysing mobile agent failures.', ['Agent evaluation', '2025']);
const onDeviceCover = `<div class="project-art research-cover"><img src="/assets/on-device-llm-paper-cover.jpg" alt="Research diagram showing how AWARE-Light sensing feeds a local language model that returns a personalised recommendation." width="2629" height="2511" loading="lazy"></div>`;
const portfolioOnDeviceCard = projectCard('/work/on-device-llms/', onDeviceCover, '04', 'Personal AI, closer to you.', 'Exploring LLM personalisation through smartphone sensing.', ['On-device AI', '2024']);
const researchProjects = `<div class="project-grid">${parkingCard}${seminarCard}${portfolioDroidCard}${portfolioOnDeviceCard}</div>`;
const teachingShowcase = `<section id="teaching" class="wrap teaching-showcase portfolio-section" aria-labelledby="teaching-heading">
  <div class="section-heading"><div><span class="eyebrow">02 / TEACHING & MENTORING</span><h2 id="teaching-heading">Teaching & student projects.</h2></div><span class="section-aside">2024–2026</span></div>
  <div class="teaching-showcase-layout">
    <div class="teaching-intro"><h3>Ideas into<br><em>working apps.</em></h3><p>As a tutor at the University of Melbourne, I supported student teams in COMP90018, Mobile Computing Systems Programming, as they worked together to turn their ideas into working mobile apps.</p><p>The projects and demos are the students’ work. My role was to support their learning and development along the way.</p></div>
    <a class="student-showcase-card" href="/comp90018/" aria-labelledby="student-showcase-title student-showcase-cta">
      <div class="student-showcase-art" aria-hidden="true"><span class="art-caption">BUILT BY STUDENTS. SUPPORTED THROUGH TEACHING.</span><div class="student-cohorts"><div class="student-cohort"><span class="cohort-play">▷</span><strong>2024</strong><span>10 projects</span></div><div class="student-cohort"><span class="cohort-play">▷</span><strong>2025</strong><span>12 projects</span></div><div class="student-cohort"><span class="cohort-play">▷</span><strong>2026</strong><span>5 projects</span></div></div><span class="art-foot">MOBILE COMPUTING / 2024–2026</span></div>
      <div class="student-showcase-copy"><span class="eyebrow">COMP90018 · 27 STUDENT PROJECTS</span><h3 id="student-showcase-title">Student video showcase.</h3><p>Explore the apps built by the teams I supported, across the 2024–2026 cohorts.</p><span class="text-link" id="student-showcase-cta">Explore the student video portfolio <span aria-hidden="true">→</span></span></div>
    </a>
  </div>
</section>`;
await page('index.html','AI engineer & researcher',`<section class="hero wrap"><div class="hero-eyebrow"><span class="status-dot"></span> AI ENGINEER & RESEARCHER <span class="hero-location">MELBOURNE, AUSTRALIA</span></div><h1>Curiosity,<br><em>made practical.</em></h1><div class="hero-bottom"><p>I’m Jeremy. I build AI products and study how intelligent systems work in everyday life — from the phone in your pocket to the street you park on.</p><a class="button dark" href="/portfolio/">Explore my portfolio <span aria-hidden="true">↗</span></a></div><div class="hero-notes"><span>AI products</span><span>Agent evaluation</span><span>Human-centred research</span><span><a href="#teaching">Teaching &amp; mentorship</a></span></div></section><section id="work" class="wrap section"><div class="section-heading"><div>${meta('01 / PRODUCTS & RESEARCH')}<h2>Research &amp; Development</h2></div><a class="text-link" href="/portfolio/">Full portfolio ${arrow}</a></div>${researchProjects}</section>${teachingShowcase}<section class="about-band"><div class="wrap about-teaser"><div>${meta('03 / A LITTLE CONTEXT')}<h2>Research-minded.<br><em>Builder at heart.</em></h2></div><div><p>My work sits between machine learning, software engineering and the people who use them. I’m an MPhil graduate from the University of Melbourne, with experience in AI products, mobile agents and medical-image research.</p><p>Outside the technical work, there’s filmmaking, design, a little boxing, and an enduring curiosity about what’s next.</p><a class="text-link" href="/about/">More about me ${arrow}</a></div></div></section><section class="wrap section writing-preview"><div class="section-heading"><div>${meta('04 / FROM THE NOTEBOOK')}<h2>Things I’ve been thinking about.</h2></div><a class="text-link" href="/writing/">All writing ${arrow}</a></div>${writingRows([posts.find(p=>p.id==='2004'),posts.find(p=>p.id==='a627'),posts.find(p=>p.id==='8057')])}<p class="archive-note">Notes from the original blog, kept in their original language.</p></section><section class="wrap contact-section">${meta('HAVE SOMETHING IN MIND?')}<h2>Good things start<br>with a <em>conversation.</em></h2><a class="contact-link" href="mailto:sqzhang.jeremy@gmail.com">sqzhang.jeremy@gmail.com ${arrow}</a></section>`, 'home');
await page('portfolio/index.html','Portfolio',`${intro('PORTFOLIO / TECHNOLOGY, CREATIVE WORK & TEACHING','Different mediums.<br><em>Same curiosity.</em>','AI products, research, films, design and teaching. A collection of the things I’ve built, explored and helped bring to life.')}<nav class="wrap portfolio-index" aria-label="Portfolio sections"><a href="#technical">Research &amp; Development <span>04</span> <span class="section-jump-arrow" aria-hidden="true">↓</span></a><a href="#teaching">Teaching & student projects <span>27</span> <span class="section-jump-arrow" aria-hidden="true">↓</span></a><a href="#creative">Creative work <span>06</span> <span class="section-jump-arrow" aria-hidden="true">↓</span></a></nav><section id="technical" class="wrap section portfolio-section"><div class="section-heading"><div>${meta('01 / PRODUCTS & RESEARCH')}<h2>Research &amp; Development</h2></div></div>${researchProjects}</section>${teachingShowcase}<section id="creative" class="wrap creative-list portfolio-section"><div class="section-heading"><div>${meta('03 / FILM, DESIGN & COMMUNITY')}<h2>Creative work.</h2></div><span class="section-aside">2017–2026</span></div>${creativeProjects}</section>`,'portfolio');
await page('personal/index.html','Beyond the code',`${intro('CREATIVE & PERSONAL / 2017–2026','A different kind<br>of <em>making.</em>','Selected films, AI video collaborations, design and community projects.')}<div class="wrap"><a class="text-link" href="/portfolio/">← View the complete portfolio</a></div><section class="wrap creative-list">${creativeProjects}</section>`,'portfolio');
const casePage=async(slug,kicker,title,lead,visual,facts,content,links,section='technical')=>page(`work/${slug}/index.html`,title,`<section class="wrap case-intro${slug === 'dailydroid-seminar' ? ' seminar-intro' : ''}"><a class="back-link" href="/portfolio/#${section}">← Portfolio</a>${meta(kicker)}<h1>${title}</h1><p>${lead}</p></section><div class="wrap case-visual">${visual}</div><section class="wrap case-body"><aside class="case-facts">${facts.map(([k,v])=>`<div>${meta(k)}<p>${v}</p></div>`).join('')}<div class="link-stack">${links}</div></aside><div class="prose">${content}</div></section><div class="wrap case-end"><a class="text-link" href="/portfolio/">← Back to portfolio</a><a class="text-link" href="mailto:sqzhang.jeremy@gmail.com">Talk about this project ${arrow}</a></div>`,'portfolio');
await casePage('qcut','AI VIDEO CO-CREATION · 2026','QCut & FIST REALM.','Building tools for video agents, and exploring what it means to co-create a film through conversation.',qcutVisual,[['ROLE','Research & Engineering Intern'],['WHEN','Sep 2026–Present'],['CONTEXT','Melbourne-based video editing startup']],`<h2>From conversation to a finished video.</h2><p>FIST REALM was generated entirely through natural-language interactions with QCut’s chat agent. I contributed prompts and tested the agent to help co-create the video.</p><p>The project brings together my interests in filmmaking and AI agents: shaping a creative result through conversation and testing how the agent responds.</p><h2>Tools that let agents work with video.</h2><p>At QCut, I designed and shipped an agent CLI that enables AI agents to inspect projects, manipulate video timelines, generate and transcribe media, and export videos.</p><h2>Exploring the next workflows.</h2><p>I’m experimenting with and developing audio search and automatic video-cutting features, alongside contributing prompts and testing QCut’s chat agent.</p>`,external(qcutVideoUrl,'Watch FIST REALM on X')+external('https://quriosity.com.au/','Visit QCut'),'creative');
const parkingExample = `<section class="parking-showcase" aria-labelledby="parking-showcase-title">
  <div class="parking-showcase-copy">
    ${meta('MELBOURNE / MOBILE WEB APP')}
    <h2 id="parking-showcase-title">Can I park here?</h2>
    <p>Photograph the whole sign and get a reading in English or Chinese while you’re still at the kerb.</p>
    <a class="button dark" href="https://parkingmate.ai/" target="_blank" rel="noopener noreferrer">Try ParkingMate ${arrow}</a>
  </div>
  <figure class="parking-showcase-figure">
    <img src="/assets/parkingmate-sign-example.png" width="972" height="1128" alt="A Melbourne parking sign beside ParkingMate’s result screen. The app shows Don’t park for the left arrow and Can park for the right arrow." decoding="async">
    <figcaption>ParkingMate’s public product example showing a split verdict.</figcaption>
  </figure>
</section>`;
await casePage('parkingmate', '01 / PRODUCT ENGINEERING', 'ParkingMate.ai',
  'A camera-first web app for reading Melbourne parking signs. I designed and built it for drivers who need to make sense of several rules before leaving the car.',
  parkingExample,
  [['ROLE', 'Founder & AI Engineer'], ['PRODUCT', 'Melbourne parking sign scanner'], ['LANGUAGES', 'English · 中文'], ['STACK', 'React · Firebase · Node.js · Stripe']],
  `<h2>Read the whole pole</h2>
  <p>ParkingMate is built for new drivers, newcomers and anyone parking on an unfamiliar street. Take a photo in your browser or upload one from your camera roll. The app reads the panels, hours and arrows, then explains which signed rule applies at the current Melbourne time.</p>
  <h2>How to read the example</h2>
  <p>The sign in the product example points to two sets of conditions. During the weekday loading-zone window, the left arrow points to the active loading zone. The right arrow points to a separate metered area. ParkingMate shows a <strong>Check side</strong> result so drivers can match the answer to where they’re standing. They can expand the recognized rules to check the model’s reading against the sign.</p>
  <h2>Designed for a quick decision</h2>
  <p>The result leads with one of four states, from Safe or Check side to Don’t park or Uncertain. It puts the explanation and recognized rules underneath. When the photo is hard to read, an Uncertain result gives the driver a reason to look again or retake it. Drivers can try a scan from the website before creating an account.</p>
  <h2>How I built it</h2>
  <p>I built the mobile scan flow, bilingual interface, vision-model integration, account access and Stripe billing. The model returns structured facts per signed direction. The backend validates those facts and calculates any supported departure or recheck time. I tested cases with opposing arrows, unreadable panels and daylight-saving boundaries, including a case where one direction remains interpretable when the other is unclear.</p>
  <p>The app’s result is a reading of the photographed sign. Drivers still need to check the posted signs and road markings at the spot.</p>`,
  external('https://parkingmate.ai/', 'Visit the live product'));

const driveRecording = (id, title, details, poster) => {
  const previewUrl = `https://drive.google.com/file/d/${id}/preview`;
  const watchUrl = `https://drive.google.com/file/d/${id}/view`;
  const preview = poster
    ? `<a class="video-poster" href="${watchUrl}" data-video-preview="${previewUrl}" aria-label="${esc(title)}"><img src="${poster}" alt="" decoding="async"><span aria-hidden="true">▶ Play seminar</span></a>`
    : `<iframe src="${previewUrl}" title="${esc(title)}" width="560" height="315" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
  return `<figure class="case-recording">
  <div class="video-preview">${preview}</div>
  <figcaption><strong>${esc(title)}</strong><p>${esc(details)}</p>${external(watchUrl, 'Open in Google Drive')}</figcaption>
</figure>`;
};
await casePage('dailydroid', '03 / AGENT EVALUATION · 2025', 'DailyDroid',
  'We tested whether adding screenshots helps Android agents complete everyday tasks, then examined the failures that a success rate alone would hide.',
  droidVisual,
  [['ROLE', 'First author'], ['BENCHMARK', '75 tasks · 25 Android apps'], ['EXPERIMENT', '2 models · 2 input settings · 300 trials'], ['PREPRINT', '2026']],
  `<nav class="case-section-links" aria-label="DailyDroid case study sections">
    <a href="#benchmark">Benchmark</a><a href="#results">Results</a><a href="#failures">Failure analysis</a><a href="#recordings">Recordings</a>
  </nav>
  <h2 id="benchmark">What DailyDroid tests</h2>
  <p>We selected five apps in each of five categories and wrote a simple, medium and hard task for each app. The resulting 75 tasks cover everyday interactions with forms, search, media controls and system settings.</p>
  <table class="case-results">
    <caption>Benchmark coverage from Table 2. Each category contains five apps and 15 tasks.</caption>
    <thead><tr><th scope="col">Category</th><th scope="col">Example apps</th></tr></thead>
    <tbody>
      <tr><th scope="row">Productivity &amp; tools</th><td>Calendar, Email, Notes</td></tr>
      <tr><th scope="row">Utilities &amp; system tasks</th><td>Clock, Settings, Calculator</td></tr>
      <tr><th scope="row">Information access</th><td>Wikipedia, Chrome, Maps</td></tr>
      <tr><th scope="row">Media &amp; entertainment</th><td>Spotify, YouTube, Books</td></tr>
      <tr><th scope="row">Communication</th><td>Facebook, Reddit, Messages</td></tr>
    </tbody>
  </table>
  <p>${external('https://arxiv.org/html/2604.17817v1#S3.T2', 'See the full benchmark table')}</p>
  <h2>Two views of the same screen</h2>
  <p>We extended AutoTask to capture a screenshot at each step. The text-only setting used the Android UI tree converted to simplified HTML. The multimodal setting added a screenshot from the same step. Both models ran all 75 tasks in both settings, with the same emulator configuration and a ten-step cap. We reviewed the logs to verify each outcome.</p>
  <figure class="case-paper-figure">
    <a href="/assets/dailydroid-screen-representations.png"><img src="/assets/dailydroid-screen-representations.png" alt="Simplified HTML for Google Maps beside a screenshot of the same screen centred on the Eiffel Tower." width="1087" height="885" loading="lazy"></a>
    <figcaption>Figure 2. Screen text exposes element labels and structure. The screenshot also shows layout, icons and map content. ${external('https://arxiv.org/html/2604.17817v1#S3.F2', 'View in the paper')}</figcaption>
  </figure>
  <h2 id="results">What screenshots changed</h2>
  <table class="case-results">
    <caption>Selected metrics from Table 4. Each condition had 75 trials. Mean time and model cost refer to successful runs.</caption>
    <thead><tr><th scope="col">Model and input</th><th scope="col">Completed</th><th scope="col">Mean time</th><th scope="col">Mean cost (USD)</th></tr></thead>
    <tbody>
      <tr><th scope="row">GPT-4o<br>Screen text</th><td>20/75<br>26.7%</td><td>141.92 s</td><td>$0.0947</td></tr>
      <tr><th scope="row">GPT-4o<br>Text + screenshot</th><td>24/75<br>32.0%</td><td>144.86 s</td><td>$2.4593</td></tr>
      <tr><th scope="row">o4-mini<br>Screen text</th><td>22/75<br>29.3%</td><td>204.97 s</td><td>$0.0077</td></tr>
      <tr><th scope="row">o4-mini<br>Text + screenshot</th><td>25/75<br>33.3%</td><td>220.39 s</td><td>$0.1906</td></tr>
    </tbody>
  </table>
  <p>Adding screenshots yielded four more completions for GPT-4o and three for o4-mini. In this setup, the average model cost per successful task was about 25–26 times higher with screenshots. ${external('https://arxiv.org/html/2604.17817v1#S4.T4', 'See the full results table')}</p>
  <h2 id="failures">Where the runs broke down</h2>
  <p>The Failure Handbook distinguishes system-level blockers from errors the agent makes while it can still act. Failure to retrieve the UI was the most frequent system-level issue, affecting 23–25 of the 75 trials in each condition.</p>
  <table class="case-results">
    <caption>Selected categories from Table 3, the Failure Handbook</caption>
    <thead><tr><th scope="col">Failure</th><th scope="col">What happens</th></tr></thead>
    <tbody>
      <tr><th scope="row">UI retrieval</th><td>The system fails to fetch the app’s interface.</td></tr>
      <tr><th scope="row">UI parsing</th><td>The interface is retrieved, but the system cannot identify the controls needed to continue.</td></tr>
      <tr><th scope="row">Execution</th><td>The intended action is identified but cannot be performed.</td></tr>
      <tr><th scope="row">Model prediction or reflection</th><td>The agent picks the wrong action or misjudges whether a step worked.</td></tr>
      <tr><th scope="row">Step limit</th><td>The run exhausts its action budget, sometimes after repeating the same attempts.</td></tr>
    </tbody>
  </table>
  <figure class="case-paper-figure">
    <a href="/assets/dailydroid-text-only-failures.png"><img src="/assets/dailydroid-text-only-failures.png" alt="Three Android screenshots highlight a reading-progress indicator, a red hang-up button and a search result summary." width="927" height="522" loading="lazy"></a>
    <figcaption>Figure 3. Three visual cues that the text-only input missed. ${external('https://arxiv.org/html/2604.17817v1#S5.F3', 'View in the paper')}</figcaption>
  </figure>
  <p>A screenshot can reveal a control such as the red hang-up button. The agent still needs a way to act on it, so an accessibility or execution failure can block the task even when the control is visible. ${external('https://arxiv.org/html/2604.17817v1#S4.T3', 'Read the full Failure Handbook')}</p>
  <h2 id="recordings">Two recorded runs</h2>
  <p>The recordings show different tasks and model settings. The tables above compare the four settings on the same tasks.</p>
  ${driveRecording('1pF3QFMp9RYzc0qVjerr4OP6tqzG7GsRm', 'Success · Clear YouTube’s cache', 'GPT-4o with screen text · 167 seconds. An Android settings task completed in the text-only setup.')}
  ${driveRecording('109WBceE9b88okLbt_zBe8UVKSB_oY8JI', 'Failure · Find a Domino’s phone number', 'o4-mini with screen text and screenshots · 460 seconds. The run ended without completing the lookup.')}`,
  external('https://arxiv.org/abs/2604.17817', 'Read the preprint') +
  `<a class="text-link" href="${seminarPath}">Watch the academic seminar ${arrow}</a>`);

await casePage('dailydroid-seminar', '02 / LLM AGENT SEMINAR · 2025', seminarTitle,
  'My University of Melbourne seminar introduces DailyDroid and shows how we traced mobile agent failures back to the interface, the automation framework, and the model.',
  `<div class="case-feature-video">${driveRecording('1b9Lp1NN5CNv_lt6ivW1ABvBpMkT1QeOp', 'Watch the LLM Agent Seminar', 'Jeremy Shiquan Zhang · University of Melbourne', '/assets/dailydroid-seminar-0040.jpg')}</div>`,
  [['FORMAT', 'Academic seminar'], ['SPEAKER', 'Jeremy Shiquan Zhang'], ['BENCHMARK', '75 tasks · 25 Android apps · 300 trials']],
  `<h2>What the talk covers</h2>
  <p>The seminar opens with a simple-sounding task: ordering a specific coffee for delivery. The agent can get the temperature wrong, choose the wrong shop, or default to pickup. These examples motivate a broader question about how to identify where everyday smartphone tasks break down.</p>
  <h2>From benchmark to failure analysis</h2>
  <p>DailyDroid evaluates 75 tasks across 25 Android apps and three difficulty levels. Using an open-source mobile agent framework, we compared GPT-4o and o4-mini with screen text alone and with screen text plus screenshots across 300 trials.</p>
  <p>The talk uses examples such as finding a nearby Domino’s phone number and planning a walking route in Maps to illustrate different failure modes. It closes with implications for accessible UI design, agent action spaces, and how to choose and evaluate the information an agent receives.</p>
  <p><a href="/work/dailydroid/">Explore the DailyDroid case study</a> for the results table and two individual run recordings.</p>`,
  external('https://drive.google.com/file/d/1EqhXlF_8uesSUcuJPrSrAO8N0kqmfE2V/view', 'View the seminar slides (PDF)') +
  external('https://arxiv.org/abs/2604.17817', 'Read the DailyDroid preprint'));

const onDeviceDemo = `<figure class="case-recording case-feature-video">
  ${youtubePreview('oI69AaTGMiI', 'Enabling On-Device LLMs Personalization with Smartphone Sensing', 'www.youtube.com')}
  <figcaption><strong>Conference demo · UbiComp/ISWC 2024</strong><p>Published by ACM SIGCHI.</p>${external('https://www.youtube.com/watch?v=oI69AaTGMiI', 'Watch on YouTube')}</figcaption>
</figure>`;
await casePage('on-device-llms', '04 / MOBILE INTELLIGENCE · UBICOMP/ISWC 2024', 'Personal AI, on device.',
  'We built a research prototype that combines smartphone sensing with a language model running on the same Android phone.',
  onDeviceDemo,
  [['ROLE', 'First author'], ['PLATFORM', 'Google Pixel 8 Pro · Android'], ['PROTOTYPE', 'AWARE-Light · Termux · llama.cpp · Llama 3 8B']],
  `<h2>Giving the model context from the phone</h2>
  <p>A generic prompt can miss what happened during a person’s day. We explored whether locally collected screen text and short self-report questionnaires could give the model enough context to respond more specifically. Keeping inference on the phone lets this pipeline run without sending the prompt to a cloud LLM.</p>
  <h2>How the prototype works</h2>
  <ol class="case-steps">
    <li><strong>Collect and export.</strong> We extended AWARE-Light to export sensing data to files on Android. The case study used screen text and periodic experience-sampling questionnaires.</li>
    <li><strong>Assemble the prompt.</strong> A template brings together the question, user and domain context, sensing data and requested output format. This makes it possible to see what information the model is being asked to use.</li>
    <li><strong>Generate locally.</strong> We ran Llama 3 8B through llama.cpp in Termux on a Pixel 8 Pro. The Android tool Automate helped trigger the pipeline and present the response.</li>
  </ol>
  <h2>What the demo shows</h2>
  <p>The student case study combines a summary of phone activity with questionnaire responses to generate a personalised reflection. The demo illustrates the path from data collection to a context-aware answer on the phone.</p>
  <h2>The trade-offs of running locally</h2>
  <p>The paper reports approximately 16.5% RAM usage and 3% battery drain over five minutes of on-device inference in this case study. These measurements come from one prototype and handset. The paper also identifies occasional output errors and calls for broader sensor coverage and larger user studies.</p>
  <p>The prototype demonstrates that the workflow can run on a phone. The quality and usefulness of its recommendations across users remain open research questions. ${external('https://arxiv.org/abs/2407.04418', 'Read the demo paper')}</p>`,
  external('https://doi.org/10.1145/3675094.3677545', 'View the ACM publication'));
await page('cv/index.html','CV',`${intro('CURRICULUM VITAE','Jeremy Zhang<span class="cv-chinese">Shiquan Zhang</span>','AI engineer and researcher · Melbourne, Australia')}<div class="wrap cv-actions"><button class="button dark" type="button" id="print-cv">Print / save as PDF ${arrow}</button><a class="text-link" href="mailto:sqzhang.jeremy@gmail.com">Get in touch ${arrow}</a></div><section class="wrap cv-content"><div class="cv-block"><h2>Profile</h2><p>AI engineer and University of Melbourne MPhil graduate, working across agent evaluation, full-stack AI products and applied machine learning.</p></div><div class="cv-block"><h2>Independent product</h2><div><h3>ParkingMate.ai</h3><p>Founder & AI Engineer</p><p>Built an AI parking assistant integrating sign interpretation, local-context retrieval, authentication and payments.</p><a class="text-link" href="/work/parkingmate/">Project overview ${arrow}</a></div></div><div class="cv-block"><h2>Experience</h2><div class="timeline">${timeline}<div class="timeline-row"><span>2024–2026</span><div><h3>University of Melbourne</h3><h4>Head Tutor</h4><p>Mentored Android project teams and taught website development using generative AI tools.</p></div></div></div></div><div class="cv-block"><h2>Education</h2><div class="education"><h3>MPhil · Computer Science</h3><p>University of Melbourne · 2023–2026</p><h3>M.Eng · Computer Science</h3><p>University of Chinese Academy of Sciences · 2019–2022</p><h3>B.Eng · Mechanical Engineering</h3><p>Hainan University · 2015–2019</p></div></div><div class="cv-block"><h2>Selected research</h2><div class="link-stack">${external('https://arxiv.org/abs/2604.17817','Do LLMs Need to See Everything? (2026)')}${external('https://arxiv.org/abs/2407.04418','On-Device LLMs Personalization with Smartphone Sensing (2024)')}</div></div><div class="cv-block"><h2>Tools & practice</h2><p>Python · JavaScript · React · Node.js · PyTorch · Firebase · Google Cloud<br>Agent evaluation · RAG · Prompt engineering · Full-stack development</p></div></section>`,'cv');
await page('404.html','Page not found',`${intro('404 / A SMALL DETOUR','Nothing here.<br><em>Plenty elsewhere.</em>','This page may have moved. You can find the original articles in the writing archive.')}<div class="wrap error-links"><a class="button dark" href="/">Back home</a><a class="text-link" href="/writing/">Browse writing ${arrow}</a></div>`);
for(const [path,url] of [['archives','/writing/'],['categories','/writing/'],['tags','/writing/'],['contact','/about/']]){
 await mkdir(out+'/'+path,{recursive:true});await writeFile(out+'/'+path+'/index.html',`<!doctype html><html lang="en"><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${url}"><title>Page moved</title><a href="${url}">Continue to the new page</a></html>`);
}
await writeFile(out+'/.nojekyll','');
console.log(`Built portfolio, project pages, creative archive, writing archive and ${posts.length} preserved posts.`);
await page('reading/index.html','Reading',`${intro('FROM THE ORIGINAL SITE','A reading list,<br><em>with context.</em>','The original site linked to Lex Fridman’s 2023 reading list. It is retained here as a reference, rather than a record of books I have read.')}<section class="wrap personal-section"><h2>A place to explore.</h2><p>The list ranges across fiction, philosophy and science. The original recommendations, commentary and reading schedule belong to Lex Fridman.</p>${external('https://lexfridman.com/reading-list/','Explore the original reading list','button')}<p style="margin-top:24px"><a class="text-link" href="/writing/">Read my own notes instead ${arrow}</a></p></section>`,'writing');

// Keep bookmarked archive/category routes and original public media accessible.
await cp('legacy',out,{recursive:true});
const legacyRedirects=JSON.parse(await readFile('content/legacy-redirects.json','utf8'));
for(const [route,target] of Object.entries(legacyRedirects)){
 const file=out+'/'+route;await mkdir(file.substring(0,file.lastIndexOf('/')),{recursive:true});
 await writeFile(file,`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="refresh" content="0;url=${target}"><title>Page moved — Jeremy Zhang</title></head><body><a href="${target}">Continue to the new page</a></body></html>`);
}
