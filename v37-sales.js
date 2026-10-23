(()=>{'use strict';const offers={"walking": "Saigon Hidden Alleys Food Adventure", "motorbike": "Saigon Night Motorbike & Local Dinner", "cuchi": "Half Day Cu Chi Tunnels", "mekong": "Full Day Discover Authentic Mekong Delta", "combo": "Full Day Cu Chi & Mekong Delta", "airport": "Airport Transfer"};
const o=document.getElementById('v37-overlay');if(!o)return;
const form=document.getElementById('v37-enquiry-form'),sel=document.getElementById('v37-tour-select'),dt=document.getElementById('v37-date'),guests=document.getElementById('v37-guests'),nm=document.getElementById('v37-guestname'),notes=document.getElementById('v37-notes'),wrap=document.getElementById('v37-msg-preview'),preview=document.getElementById('v37-msg-text'),status=document.getElementById('v37-copy-status'),departureWrap=document.getElementById('v37-cuchi-departure-wrap'),departure=document.getElementById('v37-cuchi-departure'),stay=document.getElementById('v37-stay-location');let message='';
const iso=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};dt.min=iso();
const setDeparture=()=>{const visible=sel.value==='cuchi';departureWrap.hidden=!visible;departure.required=visible;if(!visible)departure.value='';};sel.addEventListener('change',()=>{setDeparture();wrap.hidden=true;});const close=()=>{o.classList.remove('open');o.setAttribute('aria-hidden','true');document.body.style.overflow='';};
const open=id=>{if(offers[id])sel.value=id;setDeparture();dt.min=iso();wrap.hidden=true;message='';status.textContent='';o.classList.add('open');o.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';document.getElementById('v37-dialog-close').focus();};
document.addEventListener('click',e=>{const b=e.target.closest('[data-v37-open]');if(b){e.preventDefault();open(b.dataset.v37Open);}});
document.getElementById('v37-dialog-close').addEventListener('click',close);o.addEventListener('click',e=>{if(e.target===o)close();});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&o.classList.contains('open'))close()});
form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;if(dt.value<iso()){dt.setCustomValidity('Choose today or a future date.');dt.reportValidity();return;}dt.setCustomValidity('');const dateStr=new Date(dt.value+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
message=`Hello Saigon Authentic team! 👋\n\nI'm interested in: ${offers[sel.value]}\nPreferred date: ${dateStr}\nNumber of guests: ${guests.value}${departureWrap.hidden?'':'\nCu Chi departure: '+departure.value}${stay.value?'\nStaying at / pickup location: '+stay.value:''}${nm.value.trim()?'\nName: '+nm.value.trim():''}${notes.value.trim()?'\nQuestions or details: '+notes.value.trim():''}\n\nCould you please confirm availability, total price, what is included, the meeting or pickup point, and how I can book?\n\nThank you!`;
preview.textContent=message;wrap.hidden=false;wrap.scrollIntoView({block:'nearest',behavior:'smooth'});});dt.addEventListener('change',()=>dt.setCustomValidity(''));
document.getElementById('v37-send-wa').addEventListener('click',()=>{if(message)window.open('https://wa.me/84971978439?text='+encodeURIComponent(message),'_blank','noopener');});
document.getElementById('v37-copy-msg').addEventListener('click',async()=>{if(!message)return;try{await navigator.clipboard.writeText(message);status.textContent='Message copied.'}catch{status.textContent='Please select and copy the message above.'}});
})();

/* v37 demo-only: return from a tour to the exact card position the visitor clicked.
   Native browser history preserves scrolling when available. On direct links, keep the original fallback. */
(()=>{'use strict';
  try { if(window.frameElement && window.frameElement.id==='site-frame') return; }catch(e){}
  const KEY='sa-v37-return-location', PENDING='sa-v37-restore-scroll', HOME='sa-v37-experiences-home', MENU_HOME='sa-v37-menu-home';
  const detailPaths=new Set(['experiences.html','walking-neighborhood-tour.html','motorbike-street-food-tour.html',
    'half-day-cu-chi-tunnels.html','full-day-mekong-delta.html',
    'full-day-cu-chi-and-mekong-delta.html','airport-transfer.html']);
  const current=decodeURIComponent(location.pathname.split('/').pop()||'index.html');
  const store=(key,value)=>{try{sessionStorage.setItem(key,JSON.stringify(value));}catch(e){}};
  const get=key=>{try{return JSON.parse(sessionStorage.getItem(key)||'null');}catch(e){return null;}};
  document.addEventListener('click',event=>{
    const a=event.target.closest('a[href]');if(!a)return;
    const url=new URL(a.getAttribute('href'),location.href);
    if(current==='index.html' && url.origin===location.origin && url.pathname.split('/').pop()==='experiences.html') {
      store(HOME,{page:'index.html',scrollY:window.scrollY});
    }
    if(url.origin===location.origin && detailPaths.has(url.pathname.split('/').pop()) &&
       (current==='index.html'||current==='experiences.html')){
      store(KEY,{page:current,scrollY:window.scrollY});
    }
    if(current==='index.html' && url.origin===location.origin && ['stay.html','hostel-life.html','find-us.html','saigon-authentic-hostel.html','saigon-authentic-alley-hostel.html'].includes(url.pathname.split('/').pop())) {
      store(MENU_HOME,{page:'index.html',scrollY:window.scrollY,target:url.pathname.split('/').pop()});
    }
    if(a.matches('.v37-return-home,.v37-hostel-return-home')){
      const origin=get(MENU_HOME);
      if(origin && origin.page==='index.html' && (!a.matches('.v37-hostel-return-home') || origin.target===current)){
        event.preventDefault();store(PENDING,origin);location.assign('index.html');return;
      }
    }
    if(a.matches('.v37-detailcrumb')){
      const origin=a.matches('.v37-experiences-back')?get(HOME):get(KEY);
      if(!origin||!['index.html','experiences.html'].includes(origin.page))return;
      event.preventDefault();
      const ref=document.referrer;
      let sameSource=false;
      try{sameSource=new URL(ref).pathname.split('/').pop()===origin.page;}catch(e){}
      if(sameSource&&history.length>1){history.back();return;}
      store(PENDING,origin);
      location.assign(origin.page);
    }
  });
  const pending=get(PENDING);
  if(pending && pending.page===current && Number.isFinite(pending.scrollY)){
    try{sessionStorage.removeItem(PENDING);}catch(e){}
    const restore=()=>window.scrollTo({top:pending.scrollY,behavior:'instant'});
    addEventListener('load',()=>{restore();setTimeout(restore,90);setTimeout(restore,330);},{once:true});
  }
})();
