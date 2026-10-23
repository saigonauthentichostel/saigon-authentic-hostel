/* v37 – display 25 October 2026 instead of browser-dependent yyyy-mm-dd. */
(()=>{'use strict';
 const readable=iso=>{
   if(!/^\d{4}-\d{2}-\d{2}$/.test(iso||''))return '';
   const [year,month,day]=iso.split('-').map(Number);
   const d=new Date(year,month-1,day);
   if(d.getFullYear()!==year||d.getMonth()!==month-1||d.getDate()!==day)return '';
   return d.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
 };
 document.querySelectorAll('input[type="date"]').forEach(input=>{
   if(input.closest('.v37-readable-date'))return;
   const holder=document.createElement('span');holder.className='v37-readable-date';
   const visible=document.createElement('span');visible.className='v37-readable-date-text';visible.setAttribute('aria-hidden','true');
   input.parentNode.insertBefore(holder,input);holder.appendChild(visible);holder.appendChild(input);
   const label=document.querySelector('label[for="'+CSS.escape(input.id)+'"]');
   const placeholder=label && /check-in/i.test(label.textContent)?'Select check-in':label && /check-out/i.test(label.textContent)?'Select check-out':'Select date';
   input.setAttribute('lang','en-GB');
   const refresh=()=>{const text=readable(input.value);visible.textContent=text||placeholder;holder.classList.toggle('has-date',!!text);};
   input.addEventListener('change',refresh);input.addEventListener('input',refresh);
   input.addEventListener('click',()=>{if(typeof input.showPicker==='function'){try{input.showPicker();}catch(e){/* Let native date input handle it. */}}});
   input.form?.addEventListener('reset',()=>setTimeout(refresh,0));
   window.addEventListener('pageshow',refresh);refresh();
 });
})();
