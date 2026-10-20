/* =====================================================================
   وحدة «الاعتمادات»: اعتماداتي + إعداد سلاسل الاعتماد لكل المستندات + التفويض + سجل السلاسل
   ===================================================================== */
(()=>{
const ST={T:null,loading:0,err:'',H:null,hl:0};
const uN=n=>{const u=(D.users||[]).find(x=>x.username===n);return u?u.name:n};
const AP=()=>D.ap||{kinds:[],rules:[],deleg:[],n:0,mine:false};
const adm=()=>D.user&&D.user.role==='admin';
const rr=()=>{if(['ap_in','ap_cfg','ap_dl','ap_hist'].includes(view))render()};
const loadIn=force=>{if(force)ST.T=null;if(!ST.T&&!ST.loading){ST.loading=1;ST.err='';api('wfInbox').then(j=>{ST.T=j;ST.loading=0;rr()}).catch(e=>{ST.loading=0;ST.err=e.message;rr()})}return ST.T};
const mut=async(a,d,msg)=>{const j=await run(a,d,msg);ST.T=null;rr();return j};
MOD_ORDER.splice(1,0,'ap');
MODS.ap={get title(){const n=(D.ap&&D.ap.n)||0;return 'الاعتمادات'+(n?` <b class="bn">${n}</b>`:'')},has:()=>!!D.user&&(adm()||AP().mine),
 nav:()=>{const n=[['ap_in','اعتماداتي']];if(adm()||AP().mine)n.push(['ap_dl','التفويض']);if(adm()){n.push(['ap_cfg','سلاسل الاعتماد']);n.push(['ap_hist','سجل السلاسل'])}return n}};
const chainTxt=r=>r.levels.map((l,i)=>(i+1)+') '+esc(l.name)+': '+esc((l.users||[]).map(uN).concat((l.profs||[]).map(p=>'دور '+((D.profiles||[]).find(x=>x.id==p)||{name:p}).name)).join('، '))).join('<br>');
const prog=x=>{const t=[];for(let i=0;i<x.of;i++)t.push(`<span style="display:inline-block;width:18px;height:8px;border-radius:4px;margin-inline-end:2px;background:${i<x.steps.length?'#1e7a46':i===x.steps.length?'#d9a441':'#ccc'}"></span>`);return t.join('')+`<br><small class="mu">${esc(x.levelName)} (${x.level}/${x.of})</small>`};

V.ap_in=()=>{const T=loadIn();
  if(ST.err)return `<div class="box">تعذّر التحميل: ${esc(ST.err)} <button class="b s o" data-a="apre">إعادة</button></div>`;
  if(!T)return '<div class="box mu">جارٍ التحميل…</div>';
  const L=T.list;
  return head('اعتماداتي — ما ينتظر قرارك','apre','تحديث')+`<div class="box">${L.length?tbl(['النوع','المستند','المبلغ','أعدّه','السلسلة والمرحلة','التقدّم',''],L.map(x=>[esc(x.label),`<b>${esc(x.desc)}</b>`,x.amount?f(x.amount):'—',esc(x.byName||uN(x.by)||'—'),esc(x.chain),prog(x),
    (x.mine?btn('api1',x.kind+'|'+x.doc,'اعتماد','g')+(x.rej?btn('apr1',x.kind+'|'+x.doc,'رفض','r'):''):'<small class="mu">للمتابعة (ليس دورك)</small>')+btn('apo',x.kind+'|'+x.doc,'فتح','o')])):'<p class="mu" style="text-align:center;padding:14px">لا شيء ينتظر اعتمادك الآن ✓</p>'}</div>
  <p class="mu">كل مستند يمر بالمراحل التي حدّدها مدير النظام بالترتيب. عند اعتمادك مرحلة غير أخيرة ينتقل المستند للمرحلة التالية ويصلها إشعار، والمرحلة الأخيرة تُنفّذ الاعتماد الفعلي.</p>`};
const pick=i=>{const [k,id]=String(i).split('|');return {x:((ST.T||{}).list||[]).find(a=>a.kind===k&&a.doc===id),k,id}};
A.apre=()=>{ST.T=null;rr()};
A.api1=i=>{const {x}=pick(i);if(!x)return;
  mdl('اعتماد '+x.desc,`<div class="full">المرحلة: <b>${esc(x.levelName)}</b> (${x.level} من ${x.of}) — ${esc(x.label)}${x.amount?' — المبلغ '+f(x.amount):''}</div>`+fld('ملاحظة (اختياري)','note','','ta','full'),
   ()=>mut(x.act,Object.assign({id:x.doc,ver:x.ver,note:rd().note},x.args),'تم الاعتماد'),'اعتماد')};
A.apr1=i=>{const {x}=pick(i);if(!x||!x.rej)return;
  mdl('رفض '+x.desc,fld('سبب الرفض','reason','','ta','full'),()=>{const r=rd().reason.trim();if(!r){toast('اكتب سبب الرفض',1);return false}return mut(x.rejAct,Object.assign({id:x.doc,ver:x.ver,reason:r},x.rej),'تم الرفض')},'رفض')};
A.apo=i=>{const {x}=pick(i);if(!x)return;const NTT={REQ:['inv','i_req'],CNT:['inv','i_cnt'],JE:['acc','c_je'],DON:['don','d_don'],AID:['ben','b_aid'],LV:['hr','h_lv'],PAY:['hr','h_pay'],MO:['mfg','m_mo'],ADV:['acc','c_adv'],EXP:['acc','c_exp']}[x.kind];
  if(NTT&&MODS[NTT[0]]&&MODS[NTT[0]].has()){A.mod(NTT[0]);A.go(NTT[1])}else toast('ليس لديك وصول لشاشة هذا المستند — يمكنك الاعتماد من هنا',1)};

/* ---------- إعداد السلاسل: نظرة شاملة لكل أنواع المستندات ---------- */
A.nwk=k=>{window.__wfk=k;try{A.nwf('')}finally{window.__wfk=null}};
V.ap_cfg=()=>{const P=AP(),R=P.rules;
  const rows=P.kinds.map(k=>{const rs=R.filter(r=>r.kind===k.kind);
    return [`<b>${esc(k.label)}</b>`,rs.length?rs.map(r=>`<div style="margin-bottom:6px">${st(r.active?'فعّالة':'موقوفة')} <b>${esc(r.name)}</b> <small class="mu">(${f(r.min)} ← ${r.max?f(r.max):'∞'})</small><br><small>${chainTxt(r)}</small> ${btn('nwf',r.id,'تعديل','o')}${btn('xwf',r.id,'حذف','r')}</div>`).join(''):'<span class="mu">بدون سلسلة — اعتماد بخطوة واحدة</span>',btn('nwk',k.kind,'+ سلسلة','g')]});
  return head('سلاسل الاعتماد لكل المستندات')+`<div class="box">${tbl(['المستند','السلاسل (حسب المبلغ)',''],rows)}</div>
  <p class="mu">اختر نوع المستند ثم عرّف المراحل بالترتيب (مثال: المالية ثم المدير). المرحلة تضم أشخاصًا و/أو أدوارًا، ولا يعتمد الشخص مرحلتين ولا مستندَه، ويتجاوز المدير العام المراحل. المرحلة الأخيرة تنفّذ الاعتماد الفعلي، وتشترط صلاحية «الاعتماد» في تاب المستند حسب صلاحيات المستخدم.</p>`};
V.ap_dl=()=>{const W=AP().deleg;
  return head('تفويض الاعتماد (أثناء الإجازة/الغياب)','ndl','+ تفويض')+`<div class="box">${tbl(['من','إلى (المفوَّض)','من تاريخ','إلى تاريخ','ملاحظة','الحالة',''],W.map(x=>[esc(uN(x.from)),esc(uN(x.to)),esc(x.start),esc(x.end),esc(x.note||''),st(!x.active?'موقوف':(x.end<today()?'منتهٍ':(x.start>today()?'قادم':'ساري'))),btn('ndl',x.id,'تعديل','o')+btn('xdl',x.id,'حذف','r')]))}</div>`};
V.ap_hist=()=>{if(!ST.H&&!ST.hl){ST.hl=1;api('wfRuns').then(j=>{ST.H=j;ST.hl=0;rr()}).catch(()=>{ST.hl=0;ST.H={list:[]};rr()})}
  if(!ST.H)return '<div class="box mu">جارٍ التحميل…</div>';
  return head('سجل سلاسل الاعتماد')+`<div class="box">${tbl(['التاريخ','النوع','المستند','السلسلة','الحالة','المراحل المنفّذة'],ST.H.list.map(r=>[esc((r.at||'').slice(0,10)),esc(((AP().kinds||[]).find(k=>k.kind===r.kind)||{}).label||r.kind),esc(r.no||r.doc),esc(r.name),st(r.st),r.steps.map(s=>esc(s.name)+': '+esc(s.byName||s.by)).join('<br>')||'—']))}</div>`};
A.ahref=()=>{ST.H=null;rr()};
})();
