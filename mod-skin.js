/* =====================================================================
   الطبقة الشكلية (Skin): لمسة احترافية موحّدة فوق التصميم الحالي — لا تغيّر أي منطق.
   ألوان المؤسسة تبقى من إعدادات النظام (--p / --a).
   ===================================================================== */
(()=>{
const st=document.createElement('style');st.id='skin';st.textContent=`
:root{--sh1:0 1px 2px rgba(18,55,42,.06),0 1px 1px rgba(18,55,42,.04);--sh2:0 6px 18px rgba(18,55,42,.10),0 2px 4px rgba(18,55,42,.05);--sh3:0 18px 50px rgba(10,30,22,.28);--r:12px}
body{background:radial-gradient(1200px 500px at 85% -10%,color-mix(in srgb,var(--p) 9%,transparent),transparent 70%),var(--bg);-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
header{background:linear-gradient(135deg,color-mix(in srgb,var(--p) 100%,#000 14%),var(--p) 55%,color-mix(in srgb,var(--p) 82%,#fff 18%));box-shadow:0 4px 18px rgba(10,40,28,.28);border-bottom:3px solid var(--a)}
/* البطاقات والصناديق */
.box,.card{box-shadow:var(--sh1);transition:box-shadow .2s,transform .2s,border-color .2s}
.box{border-radius:14px}
.card:hover{box-shadow:var(--sh2);transform:translateY(-2px);border-color:color-mix(in srgb,var(--p) 30%,var(--l))}
.card{border-radius:14px;background:linear-gradient(180deg,var(--c),color-mix(in srgb,var(--s) 60%,var(--c)))}
.box h3{display:flex;align-items:center;gap:8px;margin:0 0 10px;color:var(--p)}
.box h3::before{content:'';width:4px;height:18px;border-radius:3px;background:linear-gradient(var(--a),var(--p))}
/* الجداول */
table{border-collapse:separate;border-spacing:0}
th{background:linear-gradient(180deg,color-mix(in srgb,var(--p) 92%,#fff 8%),var(--p));position:sticky;top:0;z-index:1;letter-spacing:.2px;font-weight:700;white-space:nowrap}
th:first-child{border-start-start-radius:10px}th:last-child{border-start-end-radius:10px}
tbody tr{transition:background .12s}
tbody tr:nth-child(even) td{background:color-mix(in srgb,var(--s) 45%,transparent)}
tbody tr:hover td{background:color-mix(in srgb,var(--p) 8%,var(--c))}
td{padding:9px 10px}
/* الأزرار */
.b{transition:transform .12s,box-shadow .15s,filter .15s;box-shadow:0 1px 2px rgba(0,0,0,.12)}
.b:hover{filter:brightness(1.08);box-shadow:0 4px 12px rgba(18,55,42,.25);transform:translateY(-1px)}
.b:active{transform:translateY(0);box-shadow:none}
.b.o{box-shadow:none}.b.o:hover{background:color-mix(in srgb,var(--p) 8%,var(--c));box-shadow:none}
/* الحقول */
input,select,textarea{transition:border-color .15s,box-shadow .15s;border-radius:10px;padding:8px 10px}
input:hover,select:hover,textarea:hover{border-color:color-mix(in srgb,var(--p) 40%,var(--l))}
input:focus,select:focus,textarea:focus{outline:0;border-color:var(--p);box-shadow:0 0 0 3px color-mix(in srgb,var(--p) 18%,transparent)}
button:focus-visible,a:focus-visible,summary:focus-visible{outline:2px solid var(--a);outline-offset:2px}
/* النوافذ */
dialog#m{border-radius:18px;box-shadow:var(--sh3);overflow:hidden}
dialog::backdrop{background:rgba(8,28,20,.55);backdrop-filter:blur(3px)}
dialog#m[open]{animation:skin-pop .18s ease-out}
@keyframes skin-pop{from{opacity:0;transform:translateY(10px) scale(.985)}to{opacity:1;transform:none}}
.dh{background:linear-gradient(135deg,color-mix(in srgb,var(--p) 100%,#000 12%),var(--p));font-size:16px;padding:13px 20px;border-bottom-width:3px}
.db{padding:18px 20px}.df{padding:12px 20px;background:color-mix(in srgb,var(--s) 70%,var(--c))}
/* حالة الشارات */
.st{box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--p) 25%,transparent);border:0}
/* الصفحة الرئيسية */
.hello{font-size:15px;color:var(--t)}
.skh{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;background:linear-gradient(135deg,var(--p),color-mix(in srgb,var(--p) 70%,var(--a) 30%));color:#fff;border-radius:18px;padding:20px 24px;margin:6px auto 22px;max-width:1000px;box-shadow:var(--sh2);position:relative;overflow:hidden}
.skh::after{content:'';position:absolute;inset-inline-start:-40px;top:-60px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.18),transparent 70%)}
.skh h2{margin:0;font-size:21px;font-weight:800}.skh .d{opacity:.85;font-size:13px;margin-top:4px}
.skh .t{font-size:13px;background:rgba(255,255,255,.16);padding:6px 14px;border-radius:99px;backdrop-filter:blur(2px)}
.app{border-radius:18px;transition:transform .18s,box-shadow .18s}
.app:hover{transform:translateY(-4px)}
.app i{box-shadow:0 8px 18px color-mix(in srgb,var(--p) 40%,transparent);background:linear-gradient(145deg,color-mix(in srgb,var(--p) 85%,#fff 15%),color-mix(in srgb,var(--p) 100%,#000 12%))!important;transition:box-shadow .18s,transform .18s}
.app:hover i{box-shadow:0 14px 26px color-mix(in srgb,var(--p) 50%,transparent);transform:scale(1.05)}
/* القائمة الجانبية */
#side{box-shadow:-2px 0 18px rgba(18,55,42,.06)}
#side .mi,#side #nav button{transition:background .15s,color .15s,transform .15s}
#side #nav button.on{box-shadow:0 4px 12px color-mix(in srgb,var(--p) 35%,transparent)}
/* شريط التمرير */
*{scrollbar-width:thin;scrollbar-color:color-mix(in srgb,var(--p) 40%,transparent) transparent}
::-webkit-scrollbar{width:9px;height:9px}::-webkit-scrollbar-thumb{background:color-mix(in srgb,var(--p) 35%,transparent);border-radius:9px}
#toast{box-shadow:var(--sh3);border:1px solid rgba(255,255,255,.15)}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
@media print{.skh{display:none}}
`;document.head.appendChild(st);

const ar=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
const greet=()=>{const h=new Date().getHours();return h<5?'مساء الخير':h<12?'صباح الخير':h<17?'نهارك سعيد':'مساء الخير'};
const hello=()=>{const e=document.querySelector('#v .hello');if(!e||e.dataset.sk||!D.user)return;e.dataset.sk=1;
  const d=new Date(),ds=ar[d.getDay()]+'، '+d.toLocaleDateString('ar-EG',{day:'numeric',month:'long',year:'numeric'});
  e.outerHTML=`<div class="skh"><div><h2>${greet()}، ${esc(D.user.name)}</h2><div class="d">${ds}</div></div><div class="t">${esc((D.settings&&D.settings.org)||'')}</div></div>`};
{const o=window.render;window.render=function(){o.apply(this,arguments);try{hello()}catch(e){}}}
})();
