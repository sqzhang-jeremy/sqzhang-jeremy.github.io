const filters=[...document.querySelectorAll('[data-filter]')];
filters.forEach(button=>button.addEventListener('click',()=>{
 const selected=button.dataset.filter;
 filters.forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
 let count=0;document.querySelectorAll('.writing-row[data-category]').forEach(row=>{row.hidden=selected!=='All'&&row.dataset.category!==selected;if(!row.hidden)count++;});
 const result=document.getElementById('result-count');if(result)result.textContent=`${count} ${count===1?'article':'articles'}`;
}));
document.getElementById('print-cv')?.addEventListener('click',()=>window.print());

document.querySelectorAll('[data-video-preview]').forEach(link => {
  link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const player = document.createElement('iframe');
    player.src = link.dataset.videoPreview;
    player.title = link.getAttribute('aria-label');
    player.referrerPolicy = 'strict-origin-when-cross-origin';
    player.allowFullscreen = true;
    link.replaceWith(player);
    player.focus();
  });
});
