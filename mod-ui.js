/* =====================================================================
   تصميم واجهة الدور بالشكل الفعلي (مثل أنظمة الـ ERP)
   • المدير يفتح النظام بنفس شكله ويُعلّم بمربعات اختيار على كل ما يظهر لأصحاب الدور:
     مديول رئيسي / تاب فرعي / زر أو خيار / عمود جدول / كارت مؤشر / حقل نموذج.
   • المحفوظ في الدور (Profiles.ui): hide = عناصر مخفية من الشاشة (إجراء a: / عمود c: / كارت k: / حقل f:)
     وsens = مجموعات بيانات حساسة تُحجب من الخادم نفسه (فلا تصل المتصفح أصلًا).
   • المديول والتاب المخفيان يُحفظان في صلاحيات الدور نفسها (mods/tabs) ويفرضهما الخادم.
   • الإخفاء من الشاشة (أزرار/أعمدة/كروت/حقول) للتنظيف والتبسيط؛ الحماية الفعلية للأفعال تتم بمصفوفة التابات (إنشاء/اعتماد/حذف) وللبيانات بمجموعات الحجب.
   ===================================================================== */
(()=>{
const SENS={
 hr_pay:{t:'رواتب الموظفين ومسيرات الرواتب',pre:'h_',cols:['الأساسي','البدلات','مكافأة','استقطاع ثابت','استقطاع إضافي','خصم سلفة','الصافي','الاستقطاعات','الإجمالي','الراتب']},
 hr_id:{t:'هوية الموظفين وبياناتهم البنكية وتواصلهم',pre:'h_',cols:['الرقم القومي','البنك','الهاتف','البريد']},
 ben_pii:{t:'هوية المستفيدين ودخلهم وتواصلهم',pre:'b_',cols:['الرقم القومي','الدخل','الهاتف','العنوان']},
 don_pii:{t:'بيانات تواصل المتبرعين وهوياتهم',pre:'d_',cols:['الهاتف','البريد','رقم الهوية']},
 inv_cost:{t:'تكلفة وقيمة المخزون',pre:'i_',cols:['القيمة','المتوسط','متوسط التكلفة','التكلفة','القيمة الحالية']}
};
let DES=null;               // حالة وضع التصميم
const KEEP=['bootstrap','ping','pub'];
const readOnly=a=>KEEP.includes(a)||(typeof LD_READ!=='undefined'&&LD_READ.test(a))||/(Dash|Cats|Inbox|Runs)$/.test(a)||/^(att|note)List$/.test(a);

/* ---------- عناصر الشاشة القابلة للتحكم ---------- */
const colLabel=th=>th.textContent.replace(/[⇅↑↓▲▼↕]/g,'').replace(/\s+/g,' ').trim();
const cardLabel=c=>{const m=c.querySelector('.mu')||c;return m.textContent.replace(/\s+/g,' ').trim().slice(0,60)};
const fieldWrap=el=>{const w=el.closest('#mb > div, #mb .db > div, #mb .full, #mb div');return w&&w.querySelector('label')&&w.querySelectorAll('[name]').length===1?w:null};
const items=(root,isDlg)=>{
  const v=typeof view==='string'?view:'',out=[];
  root.querySelectorAll('[data-a]').forEach(e=>{
    const a=e.dataset.a;if(!a||['go','mod','ng','home','itab','cmd','bell','prof','xl','ref','dzgo','dzsave','dzcancel','dzsens'].includes(a)||e.closest('#dzbar,.itabs,#nav,#mods'))return;
    out.push({el:e,key:'a:'+v+'|'+a,kind:'a'})});
  root.querySelectorAll('.card').forEach(c=>{const l=cardLabel(c);if(l)out.push({el:c,key:'k:'+v+'|'+l,kind:'k'})});
  root.querySelectorAll('table').forEach(t=>{const hr=t.tHead&&t.tHead.rows[0];if(!hr)return;
    [...hr.cells].forEach((th,i)=>{const l=colLabel(th);if(l)out.push({el:th,key:'c:'+v+'|'+l,kind:'c',table:t,idx:i})})});
  if(isDlg)root.querySelectorAll('[name]').forEach(e=>{const w=fieldWrap(e);if(w&&!e.closest('#dzbar'))out.push({el:w,key:'f:'+v+'|'+e.name,kind:'f'})});
  return out;
};
const sensHit=(label)=>{const v=typeof view==='string'?view:'';const S=D.user&&D.user.ui&&D.user.ui.sens||[];
  return S.some(g=>SENS[g]&&v.startsWith(SENS[g].pre)&&SENS[g].cols.includes(label))};
const hiddenSet=()=>DES?DES.hide:new Set((D.user&&D.user.ui&&D.user.ui.hide)||[]);

const removeCol=(t,i,n)=>{[...t.rows].forEach(r=>{if(r.cells.length===n&&r.cells[i])r.cells[i].remove()})};
const applyReal=(root,isDlg)=>{
  const H=hiddenSet(),S=D.user&&D.user.ui;if(!S||(!S.hide.length&&!S.sens.length)||D.user.role==='admin')return;
  const its=items(root,isDlg),cols={};
  its.forEach(x=>{
    if(x.kind==='c'){if(H.has(x.key)||sensHit(colLabel(x.el))){(cols[x.table.dataset.dzt||(x.table.dataset.dzt=Math.random().toString(36).slice(2))]=cols[x.table.dataset.dzt]||{t:x.table,n:x.table.tHead.rows[0].cells.length,i:[]}).i.push(x.idx)}}
    else if(H.has(x.key))x.el.remove()});
  Object.values(cols).forEach(c=>c.i.sort((a,b)=>b-a).forEach(i=>removeCol(c.t,i,c.n)));
};

/* ---------- وضع التصميم ---------- */
const mk=(key,checked,title)=>{const i=document.createElement('input');i.type='checkbox';i.className='dz';i.dataset.dk=key;i.checked=checked;i.title=title||'ظاهر لأصحاب الدور';return i};
const dimAll=(key)=>{document.querySelectorAll('[data-dzk="'+CSS.escape(key)+'"]').forEach(e=>e.classList.toggle('dzoff',!isOn(key)))};
const isOn=key=>{if(key.startsWith('m:'))return DES.modOn[key.slice(2)]!==false;if(key.startsWith('t:'))return DES.tabs[key.slice(2)]!=='x';return !DES.hide.has(key)};
const colCells=(x)=>{const t=x.table;return [...t.rows].map(r=>r.cells.length===t.tHead.rows[0].cells.length?r.cells[x.idx]:null).filter(Boolean)};
const decorate=(root,isDlg)=>{
  if(!DES)return;const seen=new Set();
  items(root,isDlg).forEach(x=>{
    if(x.el.dataset.dzk)return;x.el.dataset.dzk=x.key;
    if(x.kind==='c')colCells(x).forEach(c=>{c.dataset.dzk=x.key});
    x.el.classList.toggle('dzoff',!isOn(x.key));if(x.kind==='c')colCells(x).forEach(c=>c.classList.toggle('dzoff',!isOn(x.key)));
    if(seen.has(x.key)&&x.kind==='a')return; seen.add(x.key);
    const cb=mk(x.key,isOn(x.key),{a:'إظهار هذا الزر/الخيار',c:'إظهار هذا العمود',k:'إظهار هذا الكارت',f:'إظهار هذا الحقل في النموذج'}[x.kind]);
    if(x.kind==='a')x.el.prepend(cb);else if(x.kind==='k'){x.el.style.position='relative';cb.classList.add('dzc');x.el.prepend(cb)}else if(x.kind==='f'){const l=x.el.querySelector('label');(l||x.el).prepend(cb)}else x.el.prepend(cb);
  });
  document.querySelectorAll('[data-dzk]').forEach(e=>{const k=e.dataset.dzk;if(!k.startsWith('m:')&&!k.startsWith('t:'))e.classList.toggle('dzoff',!isOn(k))});
};
const decorateNav=()=>{
  if(!DES)return;
  document.querySelectorAll('[data-a="mod"][data-i]').forEach(e=>{const k=e.dataset.i;if(!(k in MODN)||e.dataset.dzn||e.closest('.bc'))return;e.dataset.dzn=1;
    const key='m:'+k;e.dataset.dzk=key;e.classList.toggle('dzoff',!isOn(key));const cb=mk(key,isOn(key),'إظهار هذا المديول لأصحاب الدور');cb.classList.add('dzm');e.prepend(cb)});
  document.querySelectorAll('#nav [data-a="go"][data-i]').forEach(e=>{const k=e.dataset.i;if(e.dataset.dzn)return;e.dataset.dzn=1;
    const key='t:'+k;e.dataset.dzk=key;e.classList.toggle('dzoff',!isOn(key));const cb=mk(key,isOn(key),'إظهار هذا التاب لأصحاب الدور');cb.classList.add('dzt');e.prepend(cb)});
};
const bar=()=>{let b=document.getElementById('dzbar');if(!DES){if(b)b.remove();return}
  if(!b){b=document.createElement('div');b.id='dzbar';document.body.appendChild(b)}
  const n=DES.hide.size+Object.values(DES.tabs).filter(v=>v==='x').length+Object.values(DES.modOn).filter(v=>v===false).length;
  b.innerHTML=`<b>🎨 تصميم واجهة الدور: ${esc(DES.name)}</b><span class="mu">المربع المحدد = ظاهر لأصحاب الدور. تنقّل بين الشاشات وافتح النوافذ لتعليم الأزرار والأعمدة والكروت والحقول (العمليات الفعلية معطّلة).</span>
  <details class="dzs"><summary>🔒 حجب بيانات حساسة من الخادم (${DES.sens.size})</summary><div>${Object.entries(SENS).map(([k,s])=>`<label class="chk"><input type="checkbox" data-dzs="${k}"${DES.sens.has(k)?' checked':''}> ${s.t}</label>`).join('')}<div class="mu">المحجوب لا يصل متصفح المستخدم أصلًا (حتى من أدوات المطوّر).</div></div></details>
  <span class="dzn">مخفي: ${n}</span><button class="b g" data-a="dzsave">حفظ التصميم</button><button class="b o" data-a="dzcancel">إلغاء</button>`};

document.addEventListener('click',e=>{
  const t=e.target;if(!DES||!t||!t.classList)return;
  if(t.classList.contains('dz')){e.stopPropagation();const key=t.dataset.dk,on=t.checked;
    if(key.startsWith('m:')){DES.modOn[key.slice(2)]=on}
    else if(key.startsWith('t:')){if(on){if(DES.tabs[key.slice(2)]==='x')delete DES.tabs[key.slice(2)]}else DES.tabs[key.slice(2)]='x'}
    else{if(on)DES.hide.delete(key);else DES.hide.add(key)}
    document.querySelectorAll('[data-dzk="'+CSS.escape(key)+'"]').forEach(x=>x.classList.toggle('dzoff',!on));
    document.querySelectorAll('input.dz[data-dk="'+CSS.escape(key)+'"]').forEach(x=>{x.checked=on});bar();return}
  if(t.dataset&&t.dataset.dzs!==undefined){e.stopPropagation();return}
},true);
document.addEventListener('change',e=>{const t=e.target;if(DES&&t&&t.dataset&&t.dataset.dzs){t.checked?DES.sens.add(t.dataset.dzs):DES.sens.delete(t.dataset.dzs);bar()}});

// منع العمليات الفعلية في وضع التصميم (القراءة فقط)
{const o=window.api;window.api=function(a){if(DES&&!readOnly(a)){toast('وضع التصميم: العمليات الفعلية معطّلة',1);return Promise.reject(new Error('وضع التصميم: العمليات الفعلية معطّلة'))}return o.apply(this,arguments)}}

A.dzgo=i=>{const p=(D.profiles||[]).find(x=>x.id==i);if(!p)return;
  DES={id:p.id,p,name:p.name,hide:new Set((p.ui&&p.ui.hide)||[]),sens:new Set((p.ui&&p.ui.sens)||[]),tabs:{...(p.tabs||{})},modOn:{}};
  Object.keys(MODN).forEach(k=>{DES.modOn[k]=!!(p.mods&&p.mods[k]&&p.mods[k]!=='none')});
  document.body.classList.add('dzmode');try{dlg.close()}catch(e){}
  UX.home=true;render();bar();toast('وضع التصميم: علّم على ما يظهر لأصحاب الدور «'+p.name+'»')};
A.dzcancel=()=>{if(!DES)return;if(!confirm('إلغاء التصميم بدون حفظ؟'))return;exit()};
const exit=()=>{DES=null;document.body.classList.remove('dzmode');document.querySelectorAll('input.dz').forEach(x=>x.remove());document.querySelectorAll('[data-dzk],[data-dzn]').forEach(x=>{delete x.dataset.dzk;delete x.dataset.dzn;x.classList.remove('dzoff')});bar();UX.home=true;render()};
A.dzsave=async()=>{if(!DES)return;const d=DES,p=d.p,mods={...(p.mods||{})};
  Object.keys(MODN).forEach(k=>{if(d.modOn[k]===false)mods[k]='none';else if(!mods[k]||mods[k]==='none'){const L=Object.keys(MODR[k]).filter(r=>r!=='none'&&r!=='admin');mods[k]=L.includes('viewer')?'viewer':L[0]}});
  if(Object.values(mods).every(v=>v==='none')){toast('أبقِ مديولًا واحدًا على الأقل ظاهرًا',1);return}
  const tabs={...d.tabs},ui={hide:[...d.hide],sens:[...d.sens]};
  DES=null;document.body.classList.remove('dzmode');
  try{await run('saveProfile',{id:p.id,name:p.name,desc:p.desc==='auto'?'':p.desc,active:p.active,mods,tabs,deny:p.deny||{},limits:p.limits||{},scope:p.scope||{},ui},'تم حفظ تصميم الواجهة للدور «'+p.name+'»')}catch(e){toast(e.message,1)}
  document.querySelectorAll('input.dz').forEach(x=>x.remove());document.querySelectorAll('[data-dzk],[data-dzn]').forEach(x=>{delete x.dataset.dzk;delete x.dataset.dzn;x.classList.remove('dzoff')});bar();render()};

/* ---------- الربط بالعرض ---------- */
{const o=window.render;window.render=function(){o.apply(this,arguments);try{
  const v=document.getElementById('v');if(!D.user||!v)return;
  if(DES){decorate(v,false);decorateNav();bar()}else applyReal(v,false)}catch(e){console.error('ui',e)}}}
{const o=window.mdl;window.mdl=function(){o.apply(this,arguments);try{
  const m=document.getElementById('mb');if(!m||!D.user)return;
  if(DES)decorate(m,true);else applyReal(m,true)}catch(e){console.error('ui',e)}}}
const st=document.createElement('style');st.textContent=`
body.dzmode{padding-bottom:84px}
#dzbar{position:fixed;left:0;right:0;bottom:0;z-index:90;background:#12372a;color:#fff;padding:10px 16px;display:flex;gap:12px;align-items:center;flex-wrap:wrap;box-shadow:0 -4px 16px rgba(0,0,0,.25)}
#dzbar .mu{color:#cfe3d9;font-size:12px;flex:1;min-width:260px}
#dzbar .dzs{position:relative}#dzbar .dzs summary{cursor:pointer;background:#1f5a44;padding:6px 10px;border-radius:8px}
#dzbar .dzs>div{position:absolute;bottom:42px;right:0;background:#fff;color:#222;border-radius:10px;padding:12px;min-width:320px;box-shadow:0 6px 22px rgba(0,0,0,.3)}
#dzbar .dzs .chk{display:block;margin:4px 0;color:#222}
#dzbar .dzn{background:#c77a00;border-radius:12px;padding:3px 10px;font-size:12px}
input.dz{width:16px;height:16px;margin:0 4px;vertical-align:middle;accent-color:#1e7a46;cursor:pointer;flex:none}
input.dz.dzc{position:absolute;top:6px;left:6px;z-index:2}
input.dz.dzm,input.dz.dzt{margin-inline-end:6px}
.dzoff{opacity:.35;text-decoration:line-through}
td.dzoff,th.dzoff{background:repeating-linear-gradient(45deg,transparent 0 6px,rgba(179,38,30,.07) 6px 12px)}
`;document.head.appendChild(st);
})();
