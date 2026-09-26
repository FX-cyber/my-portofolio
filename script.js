const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
$$('.welcome,.skills article,.actions a,blockquote,.status-card,.quest-grid article,.certificate-card,.save-terminal,.music-hint,.music-badge,.volume-popover').forEach((box,index)=>{box.classList.add('pixel-box',`variant-${index%3}`);if(box.classList.contains('primary'))box.classList.add('primary')});
const reactor=document.createElement('div');reactor.className='beat-reactor';reactor.setAttribute('aria-hidden','true');$('.photo-wrap').append(reactor);
const musicBadge=document.createElement('button'),musicHint=document.createElement('div');musicBadge.id='musicBadge';musicBadge.className='music-badge pixel-box variant-1';musicBadge.setAttribute('aria-label','Play music');musicHint.className='music-hint pixel-box variant-2';musicHint.textContent='PLAY MUSIC';const xpControl=$('.xp');xpControl.classList.add('music-control');xpControl.replaceChildren(musicBadge);$('.photo-wrap').append(musicHint);
const beatCells=Array.from({length:20},()=>{const cell=document.createElement('i');cell.className='beat-cell';reactor.append(cell);return cell});function paintBeatCells(step=0){const colors=['#e5322d','#2447c4','#f5c728','transparent'];beatCells.forEach((cell,index)=>{const state=(index+step*3+Math.floor(index/5)*step)%4;cell.style.setProperty('--cell-color',colors[state]);cell.style.setProperty('--cell-opacity',state===3?'0':'1')})}paintBeatCells();
const photos=$$('.portrait'), dots=$$('.photo-dots button');photos[0].classList.remove('active');photos[1].classList.add('active');dots[0].classList.remove('on');dots[1].classList.add('on');let photo=1;
function setPhoto(i){photos[photo].classList.remove('active');dots[photo].classList.remove('on');photo=i;photos[photo].classList.add('active');dots[photo].classList.add('on');$('.photo-frame').classList.add('photo-changing');setTimeout(()=>$('.photo-frame').classList.remove('photo-changing'),850)}
dots.forEach((d,i)=>d.onclick=()=>setPhoto(i));
const theme=$('.theme'), body=document.body;function themeIcon(){theme.innerHTML=`<svg><use href="#i-${body.classList.contains('dark')?'sun':'moon'}"/></svg>`}body.classList.toggle('dark',(localStorage.theme??'light')==='dark');themeIcon();theme.onclick=()=>{body.classList.toggle('dark');localStorage.theme=body.classList.contains('dark')?'dark':'light';themeIcon()};
const audio=$('#bgAudio'),volume=$('.volume'),steps=$('.volume-steps');let muted=localStorage.muted==='true',vol=Number(localStorage.volume??.35),played=false;function audioState(){audio.volume=vol;audio.muted=muted;volume.innerHTML='<svg><use href="#i-speaker"/></svg>';steps.innerHTML='';for(let i=1;i<=10;i++){let b=document.createElement('button');b.className=i<=Math.round(vol*10)&&!muted?'on':'';b.onclick=e=>{e.stopPropagation();vol=i/10;muted=false;localStorage.volume=vol;localStorage.muted=false;audioState();audio.play().catch(()=>{})};steps.append(b)}}audioState();volume.onclick=e=>{e.stopPropagation();muted=!muted;localStorage.muted=muted;audioState()};document.addEventListener('click',e=>burst(e.clientX,e.clientY));document.addEventListener('visibilitychange',()=>{if(document.hidden){played=!audio.paused;audio.pause()}else if(played&&!muted)audio.play().catch(()=>{})});
function updateMusicControl(){const active=played&&!audio.paused&&!muted;musicBadge.innerHTML=`<svg><use href="#i-speaker"/></svg><span>${active?'MUSIC ON':'PLAY MUSIC'}</span>`;musicBadge.classList.toggle('on',active);musicHint.classList.toggle('hidden',played||window.scrollY>35)}musicBadge.addEventListener('click',event=>{event.stopPropagation();const active=played&&!audio.paused&&!muted;if(active){audio.pause();muted=true;reactorRunning=false;reactor.style.setProperty('--reactor-scale','1');reactor.style.setProperty('--reactor-rotate','0deg');reactor.style.setProperty('--reactor-opacity','.55');paintBeatCells(0);localStorage.muted=true;audioState()}else{muted=false;played=true;localStorage.muted=false;audioState();audio.play().catch(()=>{})}updateMusicControl()});audio.addEventListener('play',updateMusicControl);audio.addEventListener('pause',updateMusicControl);window.addEventListener('scroll',updateMusicControl,{passive:true});updateMusicControl();
audio.addEventListener('ended',()=>{setPhoto((photo+1)%photos.length);audio.currentTime=0;if(played&&!muted)audio.play().catch(()=>{})});
let audioContext,analyserNode,frequencyData,reactorRunning=false,lastBeat=false,cellStep=0,lastCellShift=0;function activateReactor(){if(matchMedia('(prefers-reduced-motion: reduce)').matches||reactorRunning)return;try{audioContext??=new AudioContext();if(!analyserNode){const source=audioContext.createMediaElementSource(audio);analyserNode=audioContext.createAnalyser();analyserNode.fftSize=64;analyserNode.smoothingTimeConstant=.24;source.connect(analyserNode);analyserNode.connect(audioContext.destination);frequencyData=new Uint8Array(analyserNode.frequencyBinCount)}audioContext.resume();reactorRunning=true;const react=()=>{if(!reactorRunning)return;analyserNode.getByteFrequencyData(frequencyData);const bass=frequencyData.slice(0,10).reduce((sum,value)=>sum+value,0)/(10*255),energy=Math.min(1,bass*2),hit=energy>.2,now=performance.now(),cadence=energy>.32?260:420;if(now-lastCellShift>cadence){cellStep++;paintBeatCells(cellStep);lastCellShift=now}if(hit&&!lastBeat){cellStep++;paintBeatCells(cellStep);lastCellShift=now}if(energy<.13)lastBeat=false;else lastBeat=hit;reactor.style.setProperty('--reactor-scale',(1+energy*.28).toFixed(3));reactor.style.setProperty('--reactor-rotate',`${Math.round(energy*5)}deg`);reactor.style.setProperty('--reactor-opacity',(.5+energy*.42).toFixed(2));reactor.style.setProperty('--reactor-fill',(.14+energy*.4).toFixed(2));reactor.style.setProperty('--reactor-shadow',`${9+Math.round(energy*11)}px ${9+Math.round(energy*11)}px 0 rgba(229,50,45,${(.35+energy*.5).toFixed(2)}),-${7+Math.round(energy*9)}px -${7+Math.round(energy*9)}px 0 rgba(43,170,94,${(.32+energy*.48).toFixed(2)})`);document.dispatchEvent(new CustomEvent('portfolio-beat',{detail:{energy}}));requestAnimationFrame(react)};react()}catch{reactor.classList.add('fallback-beat')}}audio.addEventListener('play',activateReactor);
function burst(x,y){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;for(let i=0;i<7;i++){let p=document.createElement('i');p.className='burst';p.style.left=x+'px';p.style.top=y+'px';p.style.setProperty('--x',(Math.random()*58-29)+'px');p.style.setProperty('--y',(Math.random()*58-29)+'px');document.body.append(p);setTimeout(()=>p.remove(),450)}}
const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.13});$$('.reveal').forEach(e=>observer.observe(e));
const quest=$('#questModal');$$('.quest-grid article').forEach(card=>card.onclick=()=>{quest.querySelector('small span').textContent=card.dataset.n;quest.querySelector('h2').textContent=card.dataset.title;quest.querySelector('.category').textContent=card.dataset.category;quest.querySelector('.platform').textContent=card.dataset.platform;quest.querySelector('.objective').textContent=card.dataset.objective;quest.querySelector('.modal-skills').textContent=card.dataset.skills;quest.showModal()});
const certs=[['IBM SkillsBuild','IBM SkillsBuild','seftifikat/IBM%20SkillsBuild/image.png'],['IBM SkillsBuild Certificate','IBM SkillsBuild','seftifikat/IBM%20SkillsBuild/sv1.png'],['IBM SkillsBuild Credential','IBM SkillsBuild','seftifikat/IBM%20SkillsBuild/sv2.png'],['Google Arcade 2026','Google','seftifikat/Google%20Arcade%202026/XemqcUvTQE65dglOn1zBWtA5uhoWQulCF+Y82SW_njA=.png'],['Google Arcade Quest','Google','seftifikat/Google%20Arcade%202026/setiv%201.png'],['Google Arcade Badge','Google','seftifikat/Google%20Arcade%202026/PUSiCmSF+b3bUaIYgmjZAxsxo0ALtju8g3OMu9MR8Fw=.png']];const cg=$('#certificateGrid'),cm=$('#certificateModal');certs.forEach(([title,issuer,src],index)=>{let el=document.createElement('article');el.className=`certificate-card pixel-box variant-${index%3}`;el.innerHTML=`<img class="cert-preview" src="${src}" alt="${title}"><div class="cert-info"><svg class="cert-icon"><use href="#i-trophy"/></svg><h3>${title}</h3><p>${issuer} · 2026</p></div>`;el.onclick=()=>{cm.querySelector('img').src=src;cm.querySelector('img').alt=title;cm.querySelector('h2').textContent=title;cm.querySelector('p').textContent=`Issued by ${issuer} · 2026`;cm.showModal()};cg.append(el)});$$('.close').forEach(b=>b.onclick=()=>b.closest('dialog').close());$$('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d)d.close()}));


// Tactile movement translated from template-porto-pantai-main/useCardTilt.
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(pointer: fine)');
document.querySelectorAll('.quest-grid article, .photo-frame').forEach(card => {
  card.addEventListener('pointermove', event => {
    if (motionPreference.matches || !finePointer.matches) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    card.style.transform = `perspective(1000px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-4px)`;
  });
  card.addEventListener('pointerleave', () => { card.style.transform = ''; });
});
document.querySelectorAll('.quest-grid article, .certificate-card').forEach(card => {
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', 'Open ' + card.querySelector('h3').textContent);
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      card.click();
    }
  });
});
dots.forEach((dot, i) => dot.setAttribute('aria-label', `Show portrait ${i + 1}`));
document.querySelectorAll('.close').forEach(button => button.setAttribute('aria-label', 'Close dialog'));
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll('.nav nav a').forEach(link => {
      const active = link.hash === '#' + entry.target.id;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
document.querySelectorAll('main section[id]').forEach(section => navObserver.observe(section));
volume.addEventListener('click', () => {
  document.querySelector('.volume-popover').classList.toggle('open');
  updateMusicControl();
});
document.querySelectorAll('.volume-steps button').forEach((button, i) => button.setAttribute('aria-label', `Volume ${(i + 1) * 10}%`));

const photoStage = document.querySelector('.photo-wrap');
let parallaxFrame = 0;
function updateParallax() {
  parallaxFrame = 0;
  photoStage.style.translate = motionPreference.matches || !finePointer.matches
    ? '' : `0 ${Math.min(window.scrollY, 700) * .055}px`;
}
window.addEventListener('scroll', () => {
  if (!parallaxFrame) parallaxFrame = requestAnimationFrame(updateParallax);
}, { passive: true });
motionPreference.addEventListener('change', updateParallax);
audio.addEventListener('pause', () => { reactorRunning = false; });
document.querySelector('#questModal a').addEventListener('click', () => quest.close());

