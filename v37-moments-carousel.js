/* Real Guest Moments arrows and swipe/keyboard navigation. No carousel dependencies. */
(()=>{'use strict';
  document.querySelectorAll('.v37-moments-carousel').forEach(carousel=>{
    const track=carousel.querySelector('.v37-moments-track');
    const prev=carousel.querySelector('.v37-moments-prev');
    const next=carousel.querySelector('.v37-moments-next');
    const indicator=carousel.querySelector('.v37-moments-count');
    if(!track||!prev||!next)return;
    const photos=[...track.querySelectorAll('img')];
    const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
    const offset=photo=>photo.offsetLeft-photos[0].offsetLeft;
    const update=()=>{
      const max=Math.max(0,track.scrollWidth-track.clientWidth);
      prev.disabled=track.scrollLeft<=3;
      next.disabled=track.scrollLeft>=max-3;
      if(indicator){
        let closest=0,distance=Infinity;
        photos.forEach((photo,i)=>{
          const diff=Math.abs(offset(photo)-track.scrollLeft);
          if(diff<distance){distance=diff;closest=i;}
        });
        indicator.textContent=`${closest+1} / ${photos.length}`;
      }
    };
    const move=direction=>{
      const current=track.scrollLeft;
      const destinations=photos.map(offset);
      const target=direction>0
        ? destinations.find(x=>x>current+4)
        : destinations.slice().reverse().find(x=>x<current-4);
      const max=Math.max(0,track.scrollWidth-track.clientWidth);
      track.scrollTo({left:Math.max(0,Math.min(max,target===undefined?(direction>0?max:0):target)),behavior:reduceMotion.matches?'instant':'smooth'});
    };
    prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
    track.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();move(1);}else if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}});
    track.addEventListener('scroll',update,{passive:true});
    window.addEventListener('resize',update,{passive:true});
    for(const p of photos){p.setAttribute('draggable','false');}
    update();
  });
})();

/* Open actual guest photographs at full viewport size: no image regeneration. */
(()=>{'use strict';
 document.querySelectorAll('.v37-moments-carousel').forEach(carousel=>{
  const photos=[...carousel.querySelectorAll('.v37-moments-track img')];if(!photos.length)return;
  const viewer=document.createElement('div');viewer.className='v37-moments-lightbox';viewer.hidden=true;
  viewer.setAttribute('role','dialog');viewer.setAttribute('aria-modal','true');viewer.setAttribute('aria-label','Enlarged guest photograph');
  viewer.innerHTML='<button type="button" class="v37-moments-lightbox-close" aria-label="Close photo viewer">×</button><button type="button" class="v37-moments-lightbox-nav v37-moments-lightbox-prev" aria-label="Previous photo">‹</button><img class="v37-moments-lightbox-img" alt=""><button type="button" class="v37-moments-lightbox-nav v37-moments-lightbox-next" aria-label="Next photo">›</button><div class="v37-moments-lightbox-count" aria-live="polite"></div>';
  document.body.appendChild(viewer);
  const pic=viewer.querySelector('img'),counter=viewer.querySelector('.v37-moments-lightbox-count'),prev=viewer.querySelector('.v37-moments-lightbox-prev'),next=viewer.querySelector('.v37-moments-lightbox-next'),closeButton=viewer.querySelector('.v37-moments-lightbox-close');
  let at=0,origin=null,oldOverflow='';
  const show=i=>{at=Math.max(0,Math.min(photos.length-1,i));pic.src=photos[at].currentSrc||photos[at].src;pic.alt=photos[at].alt||'Real guest moment';counter.textContent=`${at+1} / ${photos.length}`;prev.disabled=at===0;next.disabled=at===photos.length-1;};
  const open=i=>{origin=photos[i];oldOverflow=document.body.style.overflow;viewer.hidden=false;document.body.style.overflow='hidden';show(i);closeButton.focus();};
  const close=()=>{viewer.hidden=true;document.body.style.overflow=oldOverflow;if(origin)origin.focus();};
  photos.forEach((photo,i)=>{photo.tabIndex=0;photo.setAttribute('role','button');photo.setAttribute('aria-label',`View guest photo ${i+1} of ${photos.length} in full screen`);photo.addEventListener('click',()=>open(i));photo.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(i);}});});
  closeButton.addEventListener('click',close);prev.addEventListener('click',()=>show(at-1));next.addEventListener('click',()=>show(at+1));
  viewer.addEventListener('click',e=>{if(e.target===viewer)close();});
  let startX=null;
  pic.addEventListener('touchstart',e=>{startX=e.touches[0]?.clientX??null;},{passive:true});
  pic.addEventListener('touchend',e=>{if(startX===null)return;const delta=(e.changedTouches[0]?.clientX??startX)-startX;if(Math.abs(delta)>55)show(at+(delta<0?1:-1));startX=null;},{passive:true});
  document.addEventListener('keydown',e=>{if(viewer.hidden)return;if(e.key==='Escape'){e.preventDefault();close();}else if(e.key==='ArrowRight'){e.preventDefault();show(at+1);}else if(e.key==='ArrowLeft'){e.preventDefault();show(at-1);}else if(e.key==='Tab'){e.preventDefault();const active=document.activeElement,els=[closeButton,prev,next].filter(x=>!x.disabled);let i=els.indexOf(active);els[(i+(e.shiftKey?-1:1)+els.length)%els.length].focus();}});
 });
})();
