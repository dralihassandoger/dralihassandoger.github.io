const $=(s,r=document)=>r.querySelector(s), el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!==undefined)e.innerHTML=h;return e};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
$("#bio").textContent=SITE.bio; $("#headline").textContent=SITE.headline;
$("#about-text").innerHTML=SITE.about.map(p=>`<p>${esc(p)}</p>`).join("");
$("#edu-uni").textContent=SITE.university; $("#edu-deg").textContent=SITE.degree;
$("#edu-sem").textContent="Currently in "+SITE.semester; $("#edu-grad").textContent=SITE.graduation;
$("#year").textContent=new Date().getFullYear();
for(const id of ["gh","gh2"])$("#"+id).href=SITE.github; for(const id of ["li","li2"])$("#"+id).href=SITE.linkedin;
$("#mail").href="mailto:"+SITE.email; $("#mail").textContent=SITE.email;
$("#tel").href="tel:"+SITE.phone; $("#tel").textContent=SITE.phone;
$("#skills-grid").innerHTML=Object.entries(SKILLS).map(([k,v])=>`<div class="card"><h3>${esc(k)}</h3><ul class="chips">${v.map(s=>`<li>${esc(s)}</li>`).join("")}</ul></div>`).join("");
// Copy email
$("#copy").onclick=async e=>{try{await navigator.clipboard.writeText(SITE.email);e.target.textContent="Copied"}catch{e.target.textContent="Copy failed"}setTimeout(()=>e.target.textContent="Copy email",1800)};
// Mobile menu
const nav=$("#nav"),mb=$("#menu");mb.onclick=()=>{const o=nav.classList.toggle("open");mb.setAttribute("aria-expanded",o)};
nav.addEventListener("click",e=>{if(e.target.tagName==="A"){nav.classList.remove("open");mb.setAttribute("aria-expanded",false)}});
// Scroll spy
const links=[...nav.querySelectorAll("a")];
new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(l=>l.classList.toggle("on",l.hash==="#"+e.target.id))}),{rootMargin:"-45% 0px -50% 0px"}).observe&&document.querySelectorAll("main section").forEach(s=>new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(l=>l.classList.toggle("on",l.hash==="#"+s.id))}),{rootMargin:"-45% 0px -50% 0px"}).observe(s));
// ID badge tilt (skipped for reduced motion)
const badge=$("#badge");
if(!matchMedia("(prefers-reduced-motion: reduce)").matches&&matchMedia("(hover:hover)").matches){
  badge.addEventListener("pointermove",e=>{const r=badge.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;badge.style.transform=`rotateY(${x*14}deg) rotateX(${-y*10}deg)`});
  badge.addEventListener("pointerleave",()=>badge.style.transform="");
}

// Projects with optional language filter
let filter="";
function renderProjects(){
  const list=PROJECTS.filter(p=>!filter||p.tech.some(t=>t.toLowerCase()===filter.toLowerCase()));
  $("#filter-bar").innerHTML=filter?`Showing projects using <strong>${esc(filter)}</strong> <button type="button" id="clear">Show all</button>`:"";
  if(filter)$("#clear").onclick=()=>{filter="";renderProjects()};
  $("#project-grid").innerHTML=list.length?list.map(p=>{
    const ph=/^\[/.test(p.title),link=(u,l)=>u?`<a href="${esc(u)}" target="_blank" rel="noopener">${l}</a>`:`<span class="off">${l} (add link)</span>`;
    return `<article class="card project${ph?" ph":""}"><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p><ul class="chips">${p.tech.map(t=>`<li>${esc(t)}</li>`).join("")}</ul><div class="links">${link(p.github,"GitHub")}${link(p.demo,"Live demo")}</div></article>`}).join(""):`<p class="note">No ${esc(filter)} projects added yet.</p>`;
}
renderProjects();
// Specialization: language selector
const lt=$("#lang-tabs"),lp=$("#lang-panel");
function pick(i){
  [...lt.children].forEach((b,j)=>{b.setAttribute("aria-selected",j===i);b.tabIndex=j===i?0:-1});
  const s=SPECIALIZATION[i];
  lp.innerHTML=`<h3>${esc(s.name)} <small>${esc(s.area)}</small></h3><p>${esc(s.note)}</p><button type="button" class="btn" id="see">See ${esc(s.name)} projects</button>`;
  $("#see").onclick=()=>{filter=s.name;renderProjects();$("#projects").scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"})};
}
SPECIALIZATION.forEach((s,i)=>{const b=el("button","tab",esc(s.name));b.role="tab";b.onclick=()=>pick(i);
  b.onkeydown=e=>{const d={ArrowRight:1,ArrowLeft:-1}[e.key];if(d){const n=(i+d+SPECIALIZATION.length)%SPECIALIZATION.length;pick(n);lt.children[n].focus()}};lt.append(b)});
pick(0);
$("#focus").innerHTML=FOCUS.map(f=>`<div class="card"><h3>${esc(f.title)}</h3><p>${esc(f.text)}</p></div>`).join("");
