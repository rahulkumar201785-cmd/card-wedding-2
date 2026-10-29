const intro=document.getElementById('intro');
const main=document.getElementById('invitation');
const openBtn=document.getElementById('openInvite');
// Let the cover settle before inviting the guest to open it.
window.addEventListener('load',()=>intro.classList.add('ready'));
openBtn.addEventListener('click',()=>{
  if(intro.classList.contains('opening')) return;
  intro.classList.add('opening');
  window.setTimeout(()=>{intro.classList.add('opened');main.classList.remove('hidden');document.body.style.overflow='auto';requestAnimationFrame(()=>{paintGold();});},850);
});
// Scratch reveal canvas: works with both touch and mouse.
const canvas=document.getElementById('scratchCanvas'), card=document.getElementById('scratchCard'), ctx=canvas.getContext('2d');
let scratching=false, scratched=0, revealed=false;
function paintGold(){const rect=card.getBoundingClientRect();const dpr=Math.max(1,window.devicePixelRatio||1);canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);canvas.style.width=rect.width+'px';canvas.style.height=rect.height+'px';ctx.setTransform(dpr,0,0,dpr,0,0);const g=ctx.createLinearGradient(0,0,rect.width,rect.height);g.addColorStop(0,'#c4a05b');g.addColorStop(.28,'#f4e2ad');g.addColorStop(.53,'#b58e48');g.addColorStop(.76,'#f1dca0');g.addColorStop(1,'#b48d46');ctx.globalCompositeOperation='source-over';ctx.fillStyle=g;ctx.fillRect(0,0,rect.width,rect.height);ctx.strokeStyle='rgba(255,250,222,.65)';ctx.lineWidth=1;for(let i=0;i<12;i++){ctx.beginPath();ctx.moveTo(0,i*rect.height/11);ctx.lineTo(rect.width,i*rect.height/11);ctx.stroke()}ctx.fillStyle='#554323';ctx.textAlign='center';ctx.font='600 10px DM Sans, sans-serif';ctx.fillText('✦  SCRATCH HERE  ✦',rect.width/2,rect.height/2-9);ctx.font='28px Georgia,serif';ctx.fillText('❦',rect.width/2,rect.height/2+28);ctx.globalCompositeOperation='destination-out';}
function resizeScratch(){if(!revealed)paintGold()}
function pos(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
function scratch(e){if(!scratching||revealed)return;e.preventDefault();const p=pos(e);ctx.beginPath();ctx.arc(p.x,p.y,22,0,Math.PI*2);ctx.fill();scratched++;if(scratched%8===0)checkProgress()}
function checkProgress(){try{const data=ctx.getImageData(0,0,canvas.width,canvas.height).data;let clear=0;for(let i=3;i<data.length;i+=32)if(data[i]<40)clear++;if(clear/(data.length/32)>.42)revealScratch()}catch(e){}}
function revealScratch(){revealed=true;card.classList.add('reveal-complete');ctx.clearRect(0,0,canvas.width,canvas.height)}
canvas.addEventListener('pointerdown',e=>{if(revealed)return;scratching=true;canvas.setPointerCapture?.(e.pointerId);scratch(e)});canvas.addEventListener('pointermove',scratch);['pointerup','pointercancel','pointerleave'].forEach(n=>canvas.addEventListener(n,()=>scratching=false));
document.getElementById('revealNow').addEventListener('click',revealScratch);window.addEventListener('resize',resizeScratch);if(!main.classList.contains('hidden'))paintGold();
// Countdown to the wedding date (local device time).
function updateCountdown(){const target=new Date(2026,10,26,16,0,0).getTime(),now=Date.now(),diff=target-now;const text=document.getElementById('countdownText');if(diff<=0){['days','hours','minutes','seconds'].forEach(id=>document.getElementById(id).textContent='00');text.textContent='The celebration day is here!';return}const values={days:Math.floor(diff/86400000),hours:Math.floor(diff%86400000/3600000),minutes:Math.floor(diff%3600000/60000),seconds:Math.floor(diff%60000/1000)};Object.entries(values).forEach(([id,val])=>document.getElementById(id).textContent=String(val).padStart(2,'0'));text.textContent='Counting down to the wedding celebration';}updateCountdown();setInterval(updateCountdown,1000);
async function shareInvite(){const data={title:'Jai Kumar weds Manisha',text:'With love, we invite you to celebrate the wedding of Jai Kumar & Manisha on 26 November 2026. Venue: Shagun Vatika, Ramgarh Bhagwanpur, Rewari.'};if(navigator.share){try{await navigator.share(data)}catch(e){}}else if(navigator.clipboard){try{await navigator.clipboard.writeText(data.text+' '+location.href);alert('Invitation message copied! Send it to family and friends on WhatsApp.')}catch(e){prompt('Copy this invitation message:',data.text+' '+location.href)}}else{prompt('Copy this invitation message:',data.text+' '+location.href)}}
document.getElementById('shareTop').addEventListener('click',shareInvite);document.getElementById('shareBottom').addEventListener('click',shareInvite);
