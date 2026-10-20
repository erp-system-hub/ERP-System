/* =====================================================================
   المصروفات (داخل الحسابات): تسجيل ← اعتماد (سلسلة الاعتماد) ← صرف بقيد محاسبي + تصنيفات + تقارير متعددة الأبعاد
   ===================================================================== */
(()=>{
NAVX.acc.push(['c_exp','المصروفات'],['c_exr','تقارير المصروفات']);
const ST={T:null,loading:0,err:'',q:'',st:'',cat:'',R:null,rl:0,rerr:'',dim:'cat',from:today().slice(0,4)+'-01-01',to:today()};
const role=()=>(D.acc||{}).role;
const canW=()=>['admin','manager','accountant'].includes(role())&&canV('c','c_exp');
const isMgr=()=>['admin','manager'].includes(role());
const COL={'مسودة':'#c77a00','معتمد':'#1d5fa8','مدفوع':'#1e7a46','مرفوض':'#b3261e','ملغي':'#777'};
const bd=s=>`<span class="st" style="background:${COL[s]||'#777'};color:#fff">${esc(s)}</span>`;
const rr=()=>{if(view==='c_exp'||view==='c_exr')render()};
const load=force=>{if(force)ST.T=null;if(!ST.T&&!ST.loading){ST.loading=1;ST.err='';api('listExp').then(j=>{ST.T=j;ST.loading=0;rr()}).catch(e=>{ST.loading=0;ST.err=e.message;rr()})}return ST.T};
const mut=async(a,d,msg)=>{const j=await run(a,d,msg);ST.T=null;ST.R=null;rr();return j};
const find=i=>((ST.T||{}).list||[]).find(x=>x.id==i);
const nm=(L,id)=>((L||[]).find(x=>x.id==id)||{}).name||'—';
const opts=(L,none)=>[['',none]].concat((L||[]).map(x=>[x.id,x.name]));
A.exre=()=>{ST.err='';ST.T=null;rr()};

V.c_exp=()=>{const T=load(),ttl='المصروفات';
  if(ST.err)return head(ttl)+`<div class="box" style="color:#c0392b">${esc(ST.err)} <button class="b s" data-a="exre">إعادة المحاولة</button></div>`;
  if(!T)return head(ttl)+'<div class="box mu">جارٍ التحميل…</div>';
  const ym=today().slice(0,7),sum=(f)=>T.list.filter(f).reduce((s,x)=>s+x.amount,0);
  const cards=[['مصروف هذا الشهر (معتمد + مدفوع)',f(sum(x=>x.date.startsWith(ym)&&['معتمد','مدفوع'].includes(x.st)))],['بانتظار الاعتماد',T.list.filter(x=>x.st==='مسودة').length+' — '+f(sum(x=>x.st==='مسودة'))],['معتمد وبانتظار الصرف',T.list.filter(x=>x.st==='معتمد').length+' — '+f(sum(x=>x.st==='معتمد'))],['مدفوع هذا الشهر',f(sum(x=>x.date.startsWith(ym)&&x.st==='مدفوع'))]];
  const q=ST.q.trim();
  const L=T.list.filter(x=>(!ST.st||x.st===ST.st)&&(!ST.cat||x.cat===ST.cat)&&(!q||(x.no+x.payee+x.desc+x.ref+x.catName).includes(q)));
  const me=D.user.username;
  const acts=x=>{let b=btn('vex',x.id,'عرض','o');
    if(canW()&&['مسودة','مرفوض'].includes(x.st)&&(x.by===me||isMgr()))b+=btn('nex',x.id,'تعديل','o');
    if(x.st==='مسودة'&&canV('a','c_exp')&&(isMgr()||(D.ap&&D.ap.mine))&&x.by!==me||x.st==='مسودة'&&D.user.role==='admin')b+=btn('apx',x.id,'اعتماد','g')+btn('rjx',x.id,'رفض','r');
    if(canW()&&x.st==='معتمد'&&T.linked&&canV('a','c_exp'))b+=btn('pyx',x.id,'صرف','g');
    if(canW()&&x.st!=='ملغي')b+=btn('dpx',x.id,'نسخ','o');
    if(canW()&&x.st!=='ملغي'&&(['مسودة','معتمد','مرفوض'].includes(x.st)&&(x.by===me||isMgr())||x.st==='مدفوع'&&isMgr()))b+=btn('clx',x.id,'إلغاء','r');
    return b};
  return head(ttl,canW()?'nex':'','+ مصروف جديد',`<input placeholder="بحث" value="${esc(ST.q)}" oninput="exF('q',this.value)" style="width:150px"><select onchange="exF('st',this.value)"><option value="">كل الحالات</option>${['مسودة','معتمد','مدفوع','مرفوض','ملغي'].map(s=>`<option${ST.st===s?' selected':''}>${s}</option>`).join('')}</select><select onchange="exF('cat',this.value)"><option value="">كل التصنيفات</option>${T.cats.map(c=>`<option value="${esc(c.id)}"${ST.cat===c.id?' selected':''}>${esc(c.name)}</option>`).join('')}</select>${isMgr()?'<button class="b s o" data-a="xcats">التصنيفات</button>':''}`)
   +`<div class="cards">${cards.map(c=>`<div class="card"><div class="mu">${c[0]}</div><b>${c[1]}</b></div>`).join('')}</div>`
   +(!T.cats.length?`<div class="box">لا توجد تصنيفات بعد. ${isMgr()?'<button class="b s g" data-a="xseed">إنشاء تصنيف لكل حساب مصروف من الدليل</button> أو <button class="b s o" data-a="nxc">+ تصنيف</button>':'اطلب من مدير الحسابات إنشاءها.'}</div>`:'')
   +`<div class="box">${tbl(['الرقم','التاريخ','التصنيف','المستفيد','البيان','المبلغ','المشروع','الحالة',''],L.map(x=>[esc(x.no),esc(x.date),esc(x.catName),esc(x.payee),esc(x.desc.length>40?x.desc.slice(0,40)+'…':x.desc),f(x.amount),esc(x.proj||'—'),bd(x.st)+(x.st==='مرفوض'&&x.reason?`<br><small class="mu">${esc(x.reason)}</small>`:''),acts(x)]))}</div>
   <p class="mu">الدورة: تسجيل ← اعتماد (حسب سلسلة الاعتماد التي حدّدها المدير لنوع «المصروفات») ← صرف من خزينة/بنك بقيد تلقائي (مدين حساب المصروف / دائن الخزينة). تُنسب المصروفات للمشروع والحملة والحدث ومركز التكلفة فتظهر في التقارير والتحليل متعدد الأبعاد، وتُفحص موازنة المشروع عند الاعتماد.</p>`};
window.exF=(k,v)=>{ST[k]=v;rr()};

A.nex=i=>{const T=ST.T;if(!T||!canW())return;const x=i?find(i):{date:today(),method:'نقدي',cat:'',amount:''};if(!x)return;
  const act=T.cats.filter(c=>c.active);
  mdl(i?'تعديل مصروف '+x.no:'مصروف جديد',
   fld('التاريخ','date',x.date,'date')+sel('التصنيف','cat',[['','— اختر —']].concat(act.map(c=>[c.id,c.name+(c.budget?'':'')])),x.cat||'')
   +fld('المبلغ (ج.م)','amount',x.amount,'number')+sel('طريقة الدفع','method',T.methods.map(m=>[m,m]),x.method||'نقدي')
   +fld('المستفيد / الجهة المدفوع لها','payee',x.payee||'','text','full')
   +sel('مورد (اختياري)','sup',opts(T.sups,'— بدون —'),x.sup||'')+sel('موظف (اختياري)','emp',opts(T.emps,'— بدون —'),x.emp||'')
   +fld('البيان','desc',x.desc||'','ta','full')+fld('رقم الفاتورة / المرجع','ref',x.ref||'')
   +fld('المشروع (كود)','proj',x.proj||'','text')+sel('مركز التكلفة','cc',opts(T.ccs,'— بدون —'),x.cc||'')
   +sel('الحملة / المبادرة','cmp',opts(T.cmps,'— بدون —'),x.cmp||'')+sel('الحدث / القافلة','evt',opts(T.evts,'— بدون —'),x.evt||'')
   +(T.cash.length?sel('حساب الصرف المقترح','cash',[['','— يحدّده المختص عند الصرف —']].concat(T.cash.map(c=>[c.id,c.code+' · '+c.name])),x.cash||''):'')
   +(i?attBox('EXP',i):'<div class="full mu">بعد الحفظ يمكنك إرفاق صورة الفاتورة.</div>'),
   ()=>{const o=rd();if(!o.cat){toast('اختر التصنيف',1);return false}if(!(+o.amount>0)){toast('أدخل المبلغ',1);return false}if(!o.desc.trim()){toast('اكتب البيان',1);return false}if(i){o.id=i;o.ver=x.ver}return mut('saveExp',o,i?'تم الحفظ':'تم تسجيل المصروف وإرساله للاعتماد')});
  if(i&&typeof attInit==='function')attInit()};
A.vex=i=>{const x=find(i),T=ST.T;if(!x)return;
  mdl('مصروف '+x.no,kv('التاريخ',x.date)+kv('التصنيف',x.catName)+kv('المبلغ',f(x.amount)+' ج.م')+kv('المستفيد',x.payee)+(x.supName?kv('المورد',x.supName):'')+kv('طريقة الدفع',x.method)+kv('البيان',x.desc)+(x.ref?kv('المرجع',x.ref):'')+kv('المشروع',x.proj||'—')+kv('مركز التكلفة',nm(T.ccs,x.cc))+kv('الحملة',nm(T.cmps,x.cmp))+kv('الحدث',nm(T.evts,x.evt))+kv('الحالة',x.st)+(x.reason?kv('السبب',x.reason):'')+kv('سجّله',x.byName)+(x.actBy?kv('آخر إجراء',x.actBy):'')+(x.payDate?kv('تاريخ الصرف',x.payDate)+kv('من حساب',nm((T.cash||[]).map(c=>({id:c.id,name:c.code+' · '+c.name})),x.cash)):'')+attBox('EXP',x.id),null);
  if(typeof attInit==='function')attInit()};
A.apx=i=>{const x=find(i);if(!x)return;
  mdl('اعتماد المصروف '+x.no,`<div class="full">${esc(x.payee)} — <b>${f(x.amount)}</b> ج.م — ${esc(x.catName)}</div><div class="full mu">إن كان لهذا النوع سلسلة اعتماد فسيُسجَّل اعتمادك لمرحلتك وينتقل للمرحلة التالية، والمرحلة الأخيرة تُعتمد نهائيًا.</div>`,()=>mut('approveExp',{id:i,ver:x.ver},'تم الاعتماد'),'اعتماد')};
A.rjx=i=>{const x=find(i);if(!x)return;mdl('رفض المصروف '+x.no,fld('سبب الرفض','reason','','ta','full'),()=>{const r=rd().reason.trim();if(!r){toast('اكتب سبب الرفض',1);return false}return mut('rejectExp',{id:i,ver:x.ver,reason:r},'تم الرفض')},'رفض')};
A.pyx=i=>{const x=find(i),T=ST.T;if(!x)return;
  mdl('صرف المصروف '+x.no,`<div class="full">${esc(x.payee)} — <b>${f(x.amount)}</b> ج.م</div>`+sel('الصرف من','cash',[['','— اختر —']].concat(T.cash.map(c=>[c.id,c.code+' · '+c.name])),x.cash||'')+fld('تاريخ الصرف','date',today(),'date'),()=>{const o=rd();if(!o.cash){toast('اختر حساب الصرف',1);return false}return mut('payExp',{id:i,ver:x.ver,cash:o.cash,date:o.date},'تم الصرف وترحيل القيد')},'صرف')};
A.clx=i=>{const x=find(i);if(!x)return;mdl('إلغاء المصروف '+x.no,(x.st==='مدفوع'?'<div class="full mu">سيُعكس قيد الصرف.</div>':'')+fld('السبب','reason','','text','full'),()=>mut('cancelExp',{id:i,ver:x.ver,reason:rd().reason},'تم الإلغاء'),'إلغاء المصروف')};
A.dpx=i=>{if(confirm('نسخ هذا المصروف كمسودة جديدة بتاريخ اليوم؟'))mut('dupExp',{id:i},'تم النسخ — راجعه واعتمد')};
/* ---------- التصنيفات ---------- */
A.xcats=()=>{const T=ST.T;if(!T)return;
  mdl('تصنيفات المصروفات',`<div class="full">${tbl(['الكود','التصنيف','حساب المصروف','الموازنة السنوية','الحالة',''],T.cats.map(c=>[esc(c.code),esc(c.name),esc(c.accName),c.budget?f(c.budget):'—',st(c.active?'فعّال':'موقوف'),btn('nxc',c.id,'تعديل','o')+btn('dxc',c.id,'حذف','r')]))}</div><div class="full"><button class="b s g" data-a="nxc">+ تصنيف</button> <button class="b s o" data-a="xseed">إنشاء من حسابات المصروف</button></div>`,null)};
A.nxc=i=>{const T=ST.T;const x=i?T.cats.find(c=>c.id==i):{active:true};if(!x)return;
  mdl(i?'تعديل تصنيف':'تصنيف جديد',fld('اسم التصنيف','name',x.name||'','text','full')+sel('حساب المصروف (من دليل الحسابات)','acc',[['','— اختر —']].concat(T.accs.map(a=>[a.id,a.name])),x.acc||'')+fld('الموازنة السنوية (اختياري)','budget',x.budget||'','number')+sel('الحالة','active',[['true','فعّال'],['false','موقوف']],String(x.active!==false)),
   ()=>{const o=rd();if(!o.name.trim()||!o.acc){toast('أدخل الاسم واختر الحساب',1);return false}if(i){o.id=i;o.ver=x.ver}return mut('saveExpCat',o,'تم الحفظ').then(r=>{if(r!==false)setTimeout(()=>A.xcats(),300);return r})})};
A.dxc=i=>{if(confirm('حذف التصنيف؟'))mut('delExpCat',{id:i},'تم الحذف').then(()=>setTimeout(()=>A.xcats(),300))};
A.xseed=async()=>{const j=await mut('seedExpCats',{},'');if(j!==false)toast('أُنشئ '+j.n+' تصنيف')};

/* ---------- التقارير ---------- */
const DIMS=[['cat','التصنيف'],['proj','المشروع'],['cmp','الحملة'],['evt','الحدث'],['month','الشهر'],['payee','المستفيد'],['method','طريقة الدفع']];
const loadR=()=>{if(!ST.R&&!ST.rl){ST.rl=1;ST.rerr='';api('expRep',{from:ST.from,to:ST.to}).then(j=>{ST.R=j;ST.rl=0;rr()}).catch(e=>{ST.rl=0;ST.rerr=e.message;ST.R={by:{},totals:{}};rr()})}return ST.R};
V.c_exr=()=>{const R=loadR(),ttl='تقارير المصروفات';
  const bar=`<div class="box" style="display:flex;gap:8px;flex-wrap:wrap;align-items:end"><label>من<input type="date" value="${esc(ST.from)}" onchange="exR('from',this.value)"></label><label>إلى<input type="date" value="${esc(ST.to)}" onchange="exR('to',this.value)"></label><span style="flex:1"></span>${DIMS.map(d=>`<button class="b s${ST.dim===d[0]?'':' o'}" data-a="exdim" data-i="${d[0]}">${d[1]}</button>`).join('')}</div>`;
  if(!R)return head(ttl)+bar+'<div class="box mu">جارٍ التحميل…</div>';
  if(ST.rerr)return head(ttl)+bar+`<div class="box" style="color:#c0392b">${esc(ST.rerr)}</div>`;
  const t=R.totals,L=R.by[ST.dim]||[],mx=Math.max(1,...L.map(x=>x.total+x.pending));
  const cards=[['إجمالي المنصرف (مدفوع + معتمد)',f(t.total)],['مدفوع',f(t.paid)],['معتمد بانتظار الصرف',f(t.approved)],['مسودات بانتظار الاعتماد',f(t.pending)],['عدد المصروفات',t.n]];
  const hasB=ST.dim==='cat';
  return head(ttl)+bar+`<div class="cards">${cards.map(c=>`<div class="card"><div class="mu">${c[0]}</div><b>${c[1]}</b></div>`).join('')}</div>
  <div class="box">${tbl([DIMS.find(d=>d[0]===ST.dim)[1],'العدد','مدفوع','معتمد','مسودات','الإجمالي','التوزيع'].concat(hasB?['الموازنة السنوية','% منها']:[]),L.map(x=>[esc(x.name),x.n,f(x.paid),f(x.approved),f(x.pending),`<b>${f(x.total)}</b>`,`<div style="background:var(--l);border-radius:4px;height:10px;min-width:100px"><div style="width:${Math.round(x.total/mx*100)}%;background:var(--p);height:10px;border-radius:4px"></div></div>`].concat(hasB?[x.budget?f(x.budget):'—',x.budget?`<b style="color:${x.total>x.budget?'#b3261e':'inherit'}">${Math.round(x.total/x.budget*100)}%</b>`:'—']:[])))}</div>
  <p class="mu">الفترة حسب تاريخ المصروف. «الإجمالي» = المدفوع + المعتمد. نسبة الموازنة تقارن إجمالي الفترة بالموازنة السنوية للتصنيف.</p>`};
window.exR=(k,v)=>{ST[k]=v;ST.R=null;rr()};
A.exdim=i=>{ST.dim=i;rr()};
})();
