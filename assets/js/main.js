const WHATSAPP_NUMBER = '84971978439';
function waLink(message){return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`}
function todayISO(){const d=new Date();d.setMinutes(d.getMinutes()-d.getTimezoneOffset());return d.toISOString().split('T')[0]}
function setupDates(){document.querySelectorAll('input[type=date]').forEach(el=>{if(!el.min) el.min=todayISO()})}
function setupNav(){
  const nav=document.querySelector('.nav');
  const toggle=document.querySelector('.mobile-toggle');
  const links=document.querySelectorAll('.nav-links a');
  if(toggle&&nav){
    toggle.setAttribute('aria-expanded','false');
    toggle.addEventListener('click',()=>{
      nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded',nav.classList.contains('open')?'true':'false');
      toggle.textContent=nav.classList.contains('open')?'×':'☰';
    });
    links.forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='☰'}));
    document.addEventListener('click',(e)=>{if(nav.classList.contains('open')&&!nav.contains(e.target)){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='☰'}})
  }
}
function setupWaLinks(){document.querySelectorAll('[data-wa-message]').forEach(a=>{a.href=waLink(a.dataset.waMessage)})}
function setupBookingForms(){document.querySelectorAll('[data-booking-form]').forEach(form=>{form.addEventListener('submit',e=>{e.preventDefault();const checkin=form.querySelector('[name=checkin]')?.value||'Not sure yet';const checkout=form.querySelector('[name=checkout]')?.value||'Not sure yet';const guests=form.querySelector('[name=guests]')?.value||'1';const room=form.dataset.room||'available room options';const msg=`Hi Saigon Authentic 👋\nI'd like to check ${room}.\n\nCheck-in: ${checkin}\nCheck-out: ${checkout}\nGuests: ${guests}\n\nCould you send me the available options and rates?`;window.open(waLink(msg),'_blank','noopener')})})}
function setupCurrentNav(){
  const path=window.location.pathname.replace(/index\.html$/,'').replace(/\/$/,'') || '/';
  document.querySelectorAll('.nav-links a').forEach(a=>{
    const href=new URL(a.getAttribute('href'), window.location.origin).pathname.replace(/index\.html$/,'').replace(/\/$/,'') || '/';
    if(path===href){a.classList.add('is-current')}
  });
}
function setupBookingFieldLabels(){
  const definitions=[['checkin','Check-in'],['checkout','Check-out'],['guests','Guests']];
  document.querySelectorAll('.mini-form').forEach((form,formIndex)=>{
    definitions.forEach(([name,labelText])=>{
      const control=form.querySelector(`[name="${name}"]`);
      if(!control||control.closest('.mini-field')) return;
      const id=control.id||`booking-${formIndex}-${name}`;
      control.id=id;
      const wrapper=document.createElement('div');
      wrapper.className='mini-field';
      const label=document.createElement('label');
      label.htmlFor=id;
      label.textContent=labelText;
      control.parentNode.insertBefore(wrapper,control);
      wrapper.appendChild(label);
      wrapper.appendChild(control);
      if(name==='checkin') control.title='Choose your check-in date';
      if(name==='checkout') control.title='Choose your check-out date';
      if(name==='guests'){
        [...control.options].forEach(option=>{
          const value=option.textContent.trim();
          if(/^\d\+$/.test(value)) option.textContent=`${value} guests`;
          else if(/^\d+$/.test(value)) option.textContent=`${value} ${value==='1'?'guest':'guests'}`;
        });
      }
    });
  });
}
function injectUxPolish(){
  const style=document.createElement('style');
  style.textContent=`
    .mini-field{display:flex;flex-direction:column;gap:6px;min-width:0}
    .mini-field label{display:block;padding-left:2px;font-size:.72rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#7c6a5c}
    .mini-field input,.mini-field select{min-height:50px}
    @media(max-width:680px){
      .wa-panel{padding:18px 16px}
      .wa-panel .mini-form{gap:14px}
      .mini-field label{font-size:.76rem}
      .mini-field input,.mini-field select{min-height:54px}
      .wa-panel .btn{min-height:56px}
    }
  `;
  document.head.appendChild(style);
}
function setupMobileWa(){
  const bar=document.querySelector('.mobile-wa');
  if(!bar) return;
  let actionVisible=false;
  const watched=[...document.querySelectorAll('[data-booking-form], main .btn-wa')].filter(el=>!el.classList.contains('mobile-wa')&&!el.classList.contains('btn-header'));
  const states=new Map(watched.map(el=>[el,false]));
  const update=()=>{
    if(window.innerWidth>680 || window.scrollY<420 || actionVisible){bar.classList.remove('show');return;}
    bar.classList.add('show');
  };
  if('IntersectionObserver' in window && watched.length){
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>states.set(entry.target,entry.isIntersecting));
      actionVisible=[...states.values()].some(Boolean);
      update();
    },{threshold:.12});
    watched.forEach(el=>observer.observe(el));
  }
  update();
  window.addEventListener('scroll',update,{passive:true});
  window.addEventListener('resize',update);
}
document.addEventListener('DOMContentLoaded',()=>{injectUxPolish();setupDates();setupNav();setupWaLinks();setupBookingFieldLabels();setupBookingForms();setupCurrentNav();setupMobileWa()});
