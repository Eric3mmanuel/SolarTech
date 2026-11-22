document.addEventListener('DOMContentLoaded',()=>{
  const toggle=document.querySelector('.menu-toggle');
  const nav=document.querySelector('.nav-links');
  if(toggle&&nav){
    const closeMenu=()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation');toggle.textContent='☰';};
    toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');toggle.textContent=open?'×':'☰';});
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
    document.addEventListener('click',e=>{if(nav.classList.contains('open')&&!nav.contains(e.target)&&!toggle.contains(e.target))closeMenu();});
  }
  const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();

  // Subtle scroll reveals, staggered cards and an accessible reduced-motion fallback.
  const revealTargets=document.querySelectorAll('.section-head,.card,.split > div,.split-img,.cta-band,.stats-grid,.form-card,.contact-item,.page-hero .container,.service-row');
  revealTargets.forEach((el,i)=>{el.classList.add('reveal');if(el.matches('.grid .card'))el.classList.add('reveal-delay-'+((i%3)+1));});
  if('IntersectionObserver' in window&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.12,rootMargin:'0px 0px -35px 0px'});
    revealTargets.forEach(el=>observer.observe(el));
  }else revealTargets.forEach(el=>el.classList.add('is-visible'));

  // Reading progress and back-to-top control.
  const progress=document.createElement('div');progress.className='scroll-progress';progress.setAttribute('aria-hidden','true');document.body.appendChild(progress);
  const topButton=document.createElement('button');topButton.className='back-to-top';topButton.type='button';topButton.setAttribute('aria-label','Back to top');topButton.textContent='↑';document.body.appendChild(topButton);
  const updateScroll=()=>{const max=document.documentElement.scrollHeight-window.innerHeight;progress.style.width=(max>0?(window.scrollY/max)*100:0)+'%';topButton.classList.toggle('visible',window.scrollY>500);};
  window.addEventListener('scroll',updateScroll,{passive:true});updateScroll();
  topButton.addEventListener('click',()=>window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));

  // Product category filters.
  const filterButtons=document.querySelectorAll('[data-filter]'),cards=document.querySelectorAll('.product-card'),empty=document.getElementById('emptyState');
  filterButtons.forEach(btn=>btn.addEventListener('click',()=>{
    filterButtons.forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false');});btn.classList.add('active');btn.setAttribute('aria-pressed','true');let shown=0;
    cards.forEach(card=>{const match=btn.dataset.filter==='all'||card.dataset.category===btn.dataset.filter;card.hidden=!match;if(match){shown++;card.classList.remove('is-visible');requestAnimationFrame(()=>card.classList.add('is-visible'));}});
    if(empty)empty.style.display=shown?'none':'block';
  }));

  // Remember product interest when visitors continue to the enquiry form.
  document.querySelectorAll('[data-product]').forEach(link=>link.addEventListener('click',()=>{try{sessionStorage.setItem('solartech-interest',link.dataset.product);}catch(e){}}));
  const interest=document.getElementById('interest');
  if(interest){try{const chosen=sessionStorage.getItem('solartech-interest');if(chosen){const opt=[...interest.options].find(o=>o.text.toLowerCase().includes(chosen.split(' ')[0].toLowerCase()));if(opt)interest.value=opt.value;sessionStorage.removeItem('solartech-interest');}}catch(e){}}

  // Client-side enquiry validation and email hand-off (no form data is stored on this site).
  const form=document.getElementById('quoteForm');
  if(form){form.addEventListener('submit',e=>{
    e.preventDefault();if(!form.reportValidity())return;const d=new FormData(form);
    const subject=encodeURIComponent('SolarTech enquiry — '+d.get('interest'));
    const body=encodeURIComponent(`Name: ${d.get('name')}\nEmail: ${d.get('email')}\nPhone: ${d.get('phone')}\nLocation: ${d.get('location')}\nInterest: ${d.get('interest')}\n\nRequirements:\n${d.get('message')}`);
    const msg=document.getElementById('formMessage');if(msg){msg.setAttribute('role','status');msg.textContent='Your email app is opening with your enquiry. Please review the details and send the email.';}
    window.location.href=`mailto:info@solartech.co.ke?subject=${subject}&body=${body}`;
  });}

  // Keep keyboard and screen-reader users informed about FAQ disclosure state.
  document.querySelectorAll('.faq details').forEach(item=>item.addEventListener('toggle',()=>{const summary=item.querySelector('summary');if(summary)summary.setAttribute('aria-expanded',String(item.open));}));
});
