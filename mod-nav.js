/* =====================================================================
   ترتيب المديولات والتبويبات بمعيار الـ ERP (تنقّل فقط — مفاتيح الصلاحيات كما هي):
   • ترتيب المديولات: الإيرادات (التبرعات) ← البرامج (المستفيدون) ← دورة الشراء والمخزون والتصنيع ← الموارد البشرية ← الحسابات ← الاعتمادات ← الاستيراد ← الإعدادات
   • داخل كل مديول: لوحة التحكم ← العمليات اليومية ← التقارير والاستعلامات ← الإعداد (البيانات الأساسية)
   ===================================================================== */
(()=>{
const GR={
 don:[['',['d_dash']],['العمليات',['d_donors','d_don','d_plg','d_com']],['الحملات والفعاليات',['d_cmp','d_evt']],['التقارير',['d_rep']],['الإعداد',['d_chn']]],
 ben:[['العمليات',['b_ben','b_aid']],['التقارير',['b_rep']],['الإعداد',['b_prog']]],
 proc:[['',['p_dash']],['العمليات',['p_pr','p_rfq','p_po','p_ct']],['الإعداد',['p_sup']]],
 inv:[['',['i_dash']],['العمليات',['i_req','i_grn','i_iss','i_trf','i_cnt']],['الاستعلامات',['i_stock']],['الإعداد',['i_items','i_wh']]],
 mfg:[['',['m_dash']],['العمليات',['m_mo']],['التقارير',['m_rep']],['الإعداد',['m_bom','m_wc']]],
 hr:[['الأفراد',['h_emp']],['العمليات',['h_lv','h_pay']]],
 acc:[['',['c_dash']],['اليومية والقيود',['c_je','c_exp','c_dpn','c_aid']],['الموردون والخزينة',['c_ap','c_adv','c_trn','c_chq','c_bnk','c_bk']],['الأصول والمنح والموازنات',['c_fa','c_grn','c_bud']],['التقارير والتحليل',['c_gl','c_tb','c_rep','c_exr','c_dim','c_prj']],['الإعداد والإقفال',['c_coa','c_map','c_cc','c_per']]],
 ap:[['العمليات',['ap_in','ap_dl']],['التقارير',['ap_hist']],['الإعداد',['ap_cfg']]],
 adm:[['المستخدمون والأمان',['a_users','a_prof','a_dept']],['البيانات الأساسية',['a_proj']],['النظام',['a_set','a_log']]]
};
const REN={c_prj:'أداء المشروعات المالي',a_set:'إعدادات النظام'};
const DROP={adm:['a_wf']}; // سلاسل الاعتماد صارت في وحدة «الاعتمادات»
const ORDER=['don','ben','proc','inv','mfg','hr','acc','ap','imp','adm'];
MOD_ORDER.splice(0,MOD_ORDER.length,...ORDER);
if(MODS.adm)MODS.adm.title='الإعدادات';
if(MODS.ap)Object.defineProperty(MODS.ap,'title',{value:'الاعتمادات',writable:true,configurable:true});
Object.keys(GR).forEach(k=>{const m=MODS[k];if(!m)return;const o=m.nav;
 m.nav=()=>{const map=new Map();o().forEach(n=>{if(!(DROP[k]||[]).includes(n[0]))map.set(n[0],n)});const out=[];
  GR[k].forEach(([g,keys])=>keys.forEach(key=>{const n=map.get(key);if(n){out.push([key,REN[key]||n[1],g]);map.delete(key)}}));
  map.forEach(n=>out.push([n[0],REN[n[0]]||n[1],'']));return out}});
// ترتيب الصلاحيات في محرر الأدوار بنفس الترتيب
if(typeof TABL!=='undefined')Object.keys(GR).forEach(k=>{const T=TABL[k];if(!T)return;const L=T[1],ks=[].concat(...GR[k].map(g=>g[1]));
 L.sort((a,b)=>{const i=ks.indexOf(a[0]),j=ks.indexOf(b[0]);return (i<0?999:i)-(j<0?999:j)});L.forEach(x=>{if(REN[x[0]])x[1]=REN[x[0]]})});
const st=document.createElement('style');st.textContent='#nav .nvg{font-size:11px;font-weight:700;opacity:.55;padding:10px 14px 2px;letter-spacing:.3px;white-space:nowrap;cursor:default}@media(max-width:899px){#nav .nvg{padding:8px 8px}}';document.head.appendChild(st);
})();
