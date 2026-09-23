const hospitals = [
  {name:'Northview Medical Centre', city:'Chandigarh', condition:'kidney', distance:4.2, cost:148000, label:'Sample listing', beds:'320 beds', rating:'4.8'},
  {name:'Cedar Grove Hospital', city:'Chandigarh', condition:'kidney', distance:8.6, cost:176000, label:'Sample listing', beds:'210 beds', rating:'4.6'},
  {name:'Cityline Institute of Care', city:'Chandigarh', condition:'kidney', distance:12.1, cost:195000, label:'Sample listing', beds:'450 beds', rating:'4.7'},
  {name:'Jaipur Heart & Vascular Centre', city:'Jaipur', condition:'heart', distance:3.8, cost:225000, label:'Sample listing', beds:'280 beds', rating:'4.8'},
  {name:'Aravali Cardiac Hospital', city:'Jaipur', condition:'heart', distance:9.4, cost:268000, label:'Sample listing', beds:'190 beds', rating:'4.5'},
  {name:'Sanjeevani Cancer Institute', city:'Chandigarh', condition:'cancer', distance:6.3, cost:185000, label:'Sample listing', beds:'350 beds', rating:'4.7'},
];
const form = document.querySelector('#search-form');
const queryInput = document.querySelector('#care-query');
const result = document.querySelector('#search-result');
const formatCost = n => '₹' + n.toLocaleString('en-IN');

function runSearch(query) {
  const q = query.toLowerCase();
  const detected = ['kidney','heart','cancer'].find(term => q.includes(term)) || 'kidney';
  const city = q.includes('jaipur') ? 'Jaipur' : 'Chandigarh';
  const budgetMatch = q.match(/(?:under|below|less than)\s*₹?\s*([\d.]+)\s*(lakh|lakhs|l)?/i);
  const budget = budgetMatch ? Number(budgetMatch[1]) * (budgetMatch[2]?.toLowerCase().startsWith('l') || Number(budgetMatch[1]) < 100 ? 100000 : 1) : Infinity;
  const matches = hospitals.filter(h => h.condition === detected && h.city === city && h.cost <= budget);
  const shown = matches.length ? matches : hospitals.filter(h => h.condition === detected && h.city === city);
  const detail = `${detected[0].toUpperCase()+detected.slice(1)} care near ${city}${Number.isFinite(budget) ? ` · budget up to ${formatCost(budget)}` : ''}`;
  result.innerHTML = `<div class="result-summary"><span>${shown.length} sample options · ${detail}</span><span class="result-demo-label">ILLUSTRATIVE DATA</span></div><div class="hospital-results">${shown.map((h,i)=>`<article class="hospital-result"><h4>${h.name}</h4><p>${h.city} · ${h.distance} km away · ${h.beds}</p><div class="result-metrics"><span>EST. PROCEDURE COST<b>${formatCost(h.cost)}</b></span><span>FACILITY RATING<b>${h.rating} / 5</b></span></div><label class="compare-toggle"><input type="checkbox" value="${i}" /> Add to comparison</label></article>`).join('')}</div><div class="compare-panel" hidden></div>`;
  const toggles = [...result.querySelectorAll('.compare-toggle input')];
  const panel = result.querySelector('.compare-panel');
  toggles.forEach(input => input.addEventListener('change', () => {
    const selected = toggles.filter(t => t.checked).map(t => shown[Number(t.value)]);
    panel.hidden = selected.length === 0;
    panel.innerHTML = selected.length ? `<strong>Side-by-side comparison</strong><br>${selected.map(h=>`${h.name}: ${formatCost(h.cost)} estimated · ${h.distance} km · ${h.beds}`).join('<br>')}` : '';
  }));
}
form.addEventListener('submit', e => { e.preventDefault(); runSearch(queryInput.value.trim() || 'Kidney treatment near Chandigarh under ₹2 lakh'); });
document.querySelectorAll('.query-chip').forEach(chip => chip.addEventListener('click', () => { queryInput.value = chip.dataset.query; runSearch(chip.dataset.query); }));
runSearch(queryInput.value);

const features = [
  {label:'01 — LOCATION & DISTANCE',title:'Care closer to your life.',text:'Look for hospitals by city, pin code, or distance from a location that works for you.',kind:'map'},
  {label:'02 — ESTIMATED TREATMENT BUDGET',title:'Plan with cost in view.',text:'Explore estimated procedure costs and ranges to understand what may fit your budget.',kind:'cost'},
  {label:'03 — FACILITIES & SERVICES',title:'Find the care setup you need.',text:'Review available specialties, units, equipment, and other facility information.',kind:'facility'},
  {label:'04 — SIDE-BY-SIDE COMPARISON',title:'Compare details that matter.',text:'See available costs, facilities, distance, and verified information together.',kind:'compare'},
];
let featureIndex = 0;
const featureCard = document.querySelector('#feature-card');
function paintFeature(){
  const f=features[featureIndex];
  document.querySelector('.big-number').innerHTML=`0${featureIndex+1}<span>/04</span>`;
  featureCard.querySelector('.feature-label').textContent=f.label;
  featureCard.querySelector('h3').textContent=f.title;
  featureCard.querySelector('.feature-copy p').textContent=f.text;
  const art=featureCard.querySelector('.feature-art');
  art.className=`feature-art feature-${f.kind}`;
  const drawings={
    map:'<span class="map-ring ring-one"></span><span class="map-ring ring-two"></span><span class="map-pin">✚</span><span class="map-location loc-a">CHANDIGARH</span><span class="map-location loc-b">SECTOR 17</span><span class="map-road road-one"></span><span class="map-road road-two"></span>',
    cost:'<div class="cost-graphic"><span>ESTIMATED COST RANGE</span><b>₹1.4L — ₹2.1L</b><i class="cost-track"><em></em></i><small>Costs vary by hospital and treatment plan</small></div>',
    facility:'<div class="facility-graphic"><span class="facility-symbol">✚</span><b>FACILITY DETAILS</b><i>Specialist unit <strong>Available</strong></i><i>Diagnostic services <strong>Available</strong></i><i>Accreditation <strong>Listed</strong></i></div>',
    compare:'<div class="compare-graphic large"><div class="compare-col"><b>HOSPITAL A</b><i></i><i></i><i></i></div><div class="compare-col active"><b>HOSPITAL B</b><i></i><i></i><i></i></div><div class="compare-col"><b>HOSPITAL C</b><i></i><i></i><i></i></div></div>'
  };
  art.innerHTML=drawings[f.kind];
}
document.querySelector('#prev-slide').addEventListener('click',()=>{featureIndex=(featureIndex+features.length-1)%features.length;paintFeature()});
document.querySelector('#next-slide').addEventListener('click',()=>{featureIndex=(featureIndex+1)%features.length;paintFeature()});
document.querySelector('#feature-next').addEventListener('click',()=>{featureIndex=(featureIndex+1)%features.length;paintFeature()});
const menuToggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav');
menuToggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(open));});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false')}));
