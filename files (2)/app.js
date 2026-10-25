const $=id=>document.getElementById(id),R=n=>'R'+Math.round(n).toLocaleString('en-ZA');
$('mb').onclick=()=>$('nv').classList.toggle('open');$('nv').onclick=()=>$('nv').classList.remove('open');
// Budget: provisional estimates, editable
const B=[['Bed, mattress and linen',[['Double bed frame',1,4500],['Quality mattress',1,5500],['Pillows',4,180],['Duvet and inner',1,900],['Hotel-style linen sets',2,950],['Mattress protector',1,350]]],
['Bedside furniture and lighting',[['Compact bedside tables',2,550],['Warm bedside lamps',2,350]]],
['Seating',[['Small sofa or accent chair',1,4500]]],
['Dining / workspace',[['Small table',1,1800],['Chairs',2,600]]],
['Kitchen equipment and utensils',[['Cookware set',1,1200],['Plates, bowls, cutlery, glasses, mugs set',1,1500],['Kettle',1,350],['Kitchen basics (board, knives, utensils)',1,600]]],
['Bathroom essentials',[['Towel sets',2,650],['Bathroom accessories',1,500],['Initial guest toiletries',1,400]]],
['Patio furniture',[['Outdoor chairs',2,650],['Small outdoor table',1,600]]],
['Curtains, décor and mirrors',[['Curtains or blinds',1,1500],['Full-length mirror',1,800],['Storage and hangers',1,700],['Décor and guest information',1,800]]],
['Guest supplies',[['Initial consumables',1,500]]],
['Photography and listing preparation',[['Photography',1,1800]]],
['Delivery and assembly',[['Delivery and assembly',1,1500]]]];
const tb=document.querySelector('#bt tbody');let h='';B.forEach((c,ci)=>{h+=`<tr class="cat"><td colspan="4">${c[0]}</td></tr>`;c[1].forEach((it,ii)=>h+=`<tr data-c="${ci}"><td>${it[0]} <small>(est.)</small></td><td><input type="number" min="0" value="${it[1]}" style="width:60px"></td><td><input type="number" min="0" value="${it[2]}"></td><td class="t"></td></tr>`);h+=`<tr class="tot" id="st${ci}"><td colspan="3">Subtotal</td><td></td></tr>`});
h+='<tr class="grand"><td colspan="3">Total provisional startup budget</td><td id="gt"></td></tr>';tb.innerHTML=h;
function bud(){let g=0;B.forEach((c,ci)=>{let s=0;tb.querySelectorAll(`tr[data-c="${ci}"]`).forEach(r=>{const i=r.querySelectorAll('input'),t=(+i[0].value||0)*(+i[1].value||0);r.querySelector('.t').textContent=R(t);s+=t});$('st'+ci).lastElementChild.textContent=R(s);g+=s});$('gt').textContent=R(g)}
tb.addEventListener('input',bud);bud();
// Market chart (occupancy as reported)
$('mchart').innerHTML='<b>Reported Pretoria occupancy by source</b>'+[['AirDNA (Sept 2026)',48],['Airbtics (to Jan 2026)',48],['BnBCalc (2026)',26]].map(d=>`<div class="bar"><span class="l">${d[0]}</span><i class="go" style="width:${d[1]*5}px"></i>${d[1]}%</div>`).join('');
// Calculator
const S=[{a:550,o:26},{a:700,o:40},{a:850,o:48}];let sc=1;
const v=id=>+$(id).value||0;
function load(){$('adr').value=S[sc].a;$('occ').value=S[sc].o;document.querySelectorAll('#sc button').forEach(b=>b.classList.toggle('on',+b.dataset.s===sc))}
function calc(a,o){const n=v('nts'),occN=n*o/100,rev=occN*a,fee=rev*v('fee')/100,pl=rev*v('pl')/100,rent=$('lease').checked?v('rent'):0,
op=v('cl')+v('ut')+v('co')+v('mr')+v('ot')+pl+rent;return{occN,rev,fee,pl,rent,op,bal:rev-fee-op}}
function run(){const r=calc(v('adr'),v('occ')),row=(l,x,k)=>`<div class="row ${k||''}"><span>${l}</span><span>${x}</span></div>`;
$('res').innerHTML=row('Occupied nights',r.occN.toFixed(1)+' of '+v('nts'))+row('Estimated accommodation revenue',R(r.rev))+row('Luxenest management fee ('+v('fee')+'%)','− '+R(r.fee))+
row('Rent (if leased)','− '+R(r.rent))+row('Cleaning, utilities, consumables, maintenance, other','− '+R(v('cl')+v('ut')+v('co')+v('mr')+v('ot')))+row('Platform charges','− '+R(r.pl))+
row('Indicative balance before taxes and unlisted expenses',R(r.bal),'k');
const bs=S.map((s,i)=>({n:['Conservative','Moderate','Stronger demand'][i],b:calc(s.a,s.o).bal})),m=Math.max(...bs.map(x=>Math.abs(x.b)),1);
$('cchart').innerHTML=bs.map(x=>`<div class="bar"><span class="l">${x.n}</span><i class="${x.b<0?'neg':''}" style="width:${Math.abs(x.b)/m*220}px"></i>${R(x.b)}</div>`).join('')}
document.querySelectorAll('#sc button').forEach(b=>b.onclick=()=>{sc=+b.dataset.s;load();run()});
document.querySelectorAll('.inputs input').forEach(i=>i.addEventListener('input',()=>{if(i.id==='adr')S[sc].a=v('adr');if(i.id==='occ')S[sc].o=v('occ');run()}));
load();run();
