/* Scattered pixel companions; no dedicated playground or game UI. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const palettes = ['var(--blue)', 'var(--green)', 'var(--red)', 'var(--yellow)'];
  let paused = false;
  const noMotion = () => reduced.matches || paused;
  const actors = [];
  const icons = {
    byte: '<path d="M7 5h3V2h4v3h3v3h4v12h-3v3h-4v-3h-4v3H6v-3H3V8h4z"/><g class="byte-eyes" fill="var(--panel)"><path d="M7 10h3v4H7zm7 0h3v4h-3z"/></g><path fill="var(--panel)" d="M9 17h6v2H9z"/>',
    spark: '<path d="M10 1h4v6h4v3h5v4h-5v4h-4v5h-4v-5H6v-4H1v-4h5V7h4z"/>',
    data: '<path d="M2 2h20v20H2z"/><g fill="var(--panel)" class="data-tiles"><path d="M6 6h4v4H6z"/><path d="M14 6h4v4h-4z"/><path d="M6 14h4v4H6z"/><path d="M14 14h4v4h-4z"/></g>'
  };
  function animate(element, frames, options) {
    if(noMotion()) return null;
    return element.animate(frames,options);
  }
  function particles(x,y,trail=false) {
    if(noMotion())return;
    const count=trail?2:12;
    for(let i=0;i<count;i++){
      const bit=document.createElement('i');bit.className='pixel-confetti';
      bit.style.cssText='left:'+x+'px;top:'+y+'px;background:'+palettes[i%4];
      document.body.append(bit);
      const angle=i/count*Math.PI*2, distance=trail?18:55+Math.random()*35;
      const effect=bit.animate([{transform:'translate(0,0)',opacity:.85},{transform:'translate('+Math.cos(angle)*distance+'px,'+Math.sin(angle)*distance+'px) scale(.2)',opacity:0}],{duration:trail?300:650,easing:'ease-out'});
      effect.finished.then(()=>bit.remove(),()=>bit.remove());
    }
  }
  const specs=[
    {kind:'byte',host:'.hero',color:palettes[0],hint:'Klik untuk menyapa · bisa digeser',words:['oh halo. nyari anak data? coba kenalan dulu.','sistem informasi. tertarik data sama AI. iya, masih belajar juga.','orangnya suka ngulik data. udah, biar proyeknya yang cerita.','boleh cek profil dulu. santai, ga ditanya balik kok.','kalau cocok, kabarin lewat kontak ya. masa pixel terus yang diajak ngobrol :(']},
    {kind:'data',host:'#projects',color:palettes[2],hint:'Klik untuk menyusun pixel · bisa digeser',words:['nah, ini proyeknya. klik aja, ada detailnya.','analisis data, ML, sama visualisasi. mau lihat yang mana dulu?','cek tujuan sama tools-nya juga ya. jangan salfok animasinya doang.','bentar. grafik bagus belum tentu jawab pertanyaannya.','udah sampai sini, masa cuma lewat :( buka satu dulu lah.']},
    {kind:'spark',host:'#achievements',color:palettes[1],hint:'Klik untuk percikan ide · bisa digeser',words:['ini hasil belajarnya. boleh dicek satu-satu.','ada IBM SkillsBuild sama Google Arcade. klik biar kebaca.','sertifikatnya serius. yang muter-muter ini emang gabut.','belum tamat belajarnya. emang ada tamatnya?','udah lihat proyek sama sertifikat? nah, tinggal kenalan.']}
  ];
  specs.forEach((spec,index)=>{
    const host=document.querySelector(spec.host);
    const wrap=document.createElement('div');wrap.className='pixel-companion companion-'+spec.kind;wrap.style.setProperty('--object-color',spec.color);
    const button=document.createElement('button');button.type='button';button.className='companion-button';
    button.style.setProperty('--object-color',spec.color);button.style.setProperty('--float-delay',-index+'s');
    button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+icons[spec.kind]+'</svg><span>'+spec.kind.toUpperCase()+'</span>';
    button.setAttribute('aria-label',spec.kind.toUpperCase()+': '+spec.hint);
    button.setAttribute('aria-describedby','hint-'+spec.kind);
    const bubble=document.createElement('span');bubble.className='companion-bubble';bubble.id='hint-'+spec.kind;bubble.textContent='';bubble.setAttribute('role','status');
    const interactionHint=document.createElement('span');
    interactionHint.className='pixel-interaction-hint';
    interactionHint.textContent='↖ klik / geser';
    interactionHint.setAttribute('aria-hidden','true');
    wrap.append(button,bubble,interactionHint);host.append(wrap);

    let messageSlot=null;
    let x=0,y=0,drag=null,suppress=false,step=0,timer,lastTrail=0;
    let effects=[];
    const cancel=()=>{effects.forEach(effect=>effect?.cancel());effects=[];};
    function say(message){
      clearTimeout(timer);bubble.textContent=message;wrap.classList.add('is-speaking');
      placeBubble();
      timer=setTimeout(()=>{wrap.classList.remove('is-speaking');if(messageSlot){messageSlot.classList.remove('is-visible');bubble.textContent='';}else{bubble.textContent='';}},Math.min(8500,Math.max(4500,message.length*65)));
    }
    function placeBubble(){
      if(spec.kind!=='byte')return;
      const anchor=wrap.getBoundingClientRect();
      const hero=host.getBoundingClientRect();
      const heading=document.querySelector('.hero h1');
      const walker=document.createTreeWalker(heading,NodeFilter.SHOW_TEXT);
      let textNode, nameRight=heading.getBoundingClientRect().left;
      while((textNode=walker.nextNode())){
        if(!textNode.textContent.trim())continue;
        const range=document.createRange();range.selectNodeContents(textNode);
        nameRight=Math.max(nameRight,range.getBoundingClientRect().right);
      }
      const title={right:nameRight};
      const photo=document.querySelector('.photo-frame').getBoundingClientRect();
      const gap=16;
      // Use the actual empty corridor between the heading and portrait.
      const left=Math.max(title.right+gap,hero.left);
      const right=photo.left-gap;
      let width=Math.min(190,right-left);
      bubble.style.right='auto';bubble.style.bottom='auto';
      if(innerWidth>760 && width>=108){
        bubble.style.width=width+'px';
        bubble.style.left=(left-anchor.left)+'px';
        bubble.style.top=(anchor.height+12)+'px';
        bubble.dataset.tail='top';bubble.style.setProperty('--tail-x',Math.max(16,Math.min(width-20,anchor.left+anchor.width/2-left))+'px');
      }else{
        // On stacked layouts, reserve a small dialogue pocket beside Byte.
        const pocket=document.querySelector('.byte-dialogue-pocket');
        const rect=pocket.getBoundingClientRect();
        bubble.style.width=rect.width+'px';
        bubble.style.left=(rect.left-anchor.left)+'px';
        bubble.style.top=(rect.top-anchor.top)+'px';
        bubble.dataset.tail='right';
      }
    }
    if(spec.kind==='byte'){
      const pocket=document.createElement('div');pocket.className='byte-dialogue-pocket';
      document.querySelector('.hero-copy .welcome').after(pocket);
      wrap.addEventListener('pointerenter',placeBubble);
      button.addEventListener('focus',placeBubble);
      window.addEventListener('resize',placeBubble);
    }
    function react(dropped=false){
      wrap.classList.add('has-interacted');
      cancel();
      step++;
      button.dataset.reaction=String(step);
      say(dropped ? {byte:step%2?'eh. dipindah ke mana ini :(':'iya iya, geser dikit.',spark:'wih. jauh juga. balik dulu ah.',data:'lah. kartunya yang diklik, bukan diangkut pixelnya.'}[spec.kind] : (spec.kind==='byte' && document.body.classList.contains('music-dancing') && step%3===0 ? 'nah ada musik. dari tadi hening banget.' : spec.words[(step-1)%spec.words.length]));
      if(spec.kind==='byte'){
        effects.push(animate(button.querySelector('svg'),[{transform:'rotate(0)'},{transform:'translateY(-12px) rotate(-14deg)'},{transform:'rotate(12deg)'},{transform:'rotate(0)'}],{duration:650,easing:'ease-out'}));
        effects.push(animate(button.querySelector('.byte-eyes'),[{opacity:1},{opacity:0,offset:.4},{opacity:1}],{duration:500}));
      } else if(spec.kind==='spark'){
        const r=button.getBoundingClientRect();particles(r.left+r.width/2,r.top+r.height/2);
        effects.push(animate(button.querySelector('svg'),[{transform:'rotate(0) scale(1)'},{transform:'rotate(180deg) scale(1.3)'},{transform:'rotate(360deg) scale(1)'}],{duration:700,easing:'cubic-bezier(.2,.8,.2,1)'}));
      } else {
        button.style.setProperty('--object-color',palettes[(step+1)%4]);
        button.querySelectorAll('.data-tiles path').forEach((tile,i)=>{
          effects.push(animate(tile,[{transform:'translate(0,0)'},{transform:'translate('+(i%2?'-3':'3')+'px,'+(i<2?'3':'-3')+'px)'},{transform:'translate(0,0)'}],{duration:600,delay:i*55,easing:'steps(4,end)'}));
        });
      }
    }
    function move(nextX,nextY){
      // Keep the dragged decoration within the viewport horizontally and its own section vertically.
      const base=wrap.getBoundingClientRect(),section=host.getBoundingClientRect();
      x=Math.max(8-base.left,Math.min(innerWidth-base.right-8,nextX));
      y=Math.max(section.top-base.top,Math.min(section.bottom-base.bottom,nextY));
      button.style.translate=x+'px '+y+'px';
    }
    function reset(){
      x=0;y=0;button.style.translate='0px 0px';wrap.classList.remove('is-dragging');
    }
    function returnHome(){
      const from=x+'px '+y+'px';reset();
      effects.push(animate(button,[{translate:from},{translate:'0px -7px',offset:.8},{translate:'0px 0px'}],{duration:620,easing:'cubic-bezier(.16,.8,.3,1)'}));
    }
    button.addEventListener('pointerdown',event=>{
      if(event.button!==0||drag)return;
      cancel();clearTimeout(timer);wrap.classList.remove('is-speaking');
      drag={id:event.pointerId,startX:event.clientX,startY:event.clientY,x,y,moved:false};
      button.setPointerCapture(event.pointerId);wrap.classList.add('is-dragging');
    });
    button.addEventListener('pointermove',event=>{
      if(!drag||drag.id!==event.pointerId)return;
      const dx=event.clientX-drag.startX,dy=event.clientY-drag.startY;
      if(Math.hypot(dx,dy)>6)drag.moved=true;
      move(drag.x+dx,drag.y+dy);
      if(spec.kind==='spark'&&drag.moved&&performance.now()-lastTrail>90){particles(event.clientX,event.clientY,true);lastTrail=performance.now();}
    });
    function release(event,cancelled=false){
      if(!drag||drag.id!==event.pointerId)return;
      const moved=drag.moved;drag=null;
      if(button.hasPointerCapture(event.pointerId))button.releasePointerCapture(event.pointerId);
      wrap.classList.remove('is-dragging');suppress=true;
      if(cancelled){cancel();reset();return;}
      react(moved);
      if(moved)returnHome();
    }
    button.addEventListener('pointerup',event=>release(event));
    button.addEventListener('pointercancel',event=>release(event,true));
    button.addEventListener('lostpointercapture',event=>release(event,true));
    button.addEventListener('click',event=>{
      event.stopPropagation();
      if(suppress&&event.detail>0){suppress=false;return;}
      suppress=false;react();
      if(x||y)returnHome();
    });
    button.addEventListener('keydown',event=>{
      const delta={ArrowLeft:[-16,0],ArrowRight:[16,0],ArrowUp:[0,-16],ArrowDown:[0,16]}[event.key];
      if(delta){event.preventDefault();cancel();move(x+delta[0],y+delta[1]);}
      if(event.key==='Escape'){cancel();reset();wrap.classList.remove('is-speaking');}
    });
    button.addEventListener('blur',()=>{if(!drag){cancel();reset();}});
    actors.push({
      wrap,
      speak:()=>{
        step++;
        say(spec.words[(step-1)%spec.words.length]);
      },
      reset:()=>{cancel();reset();}
    });
  });
  // One visible companion speaks after inactivity; never interrupt dialogs or another message.
  let idleTimer, idleTurn=0;
  function scheduleIdle(delay=11000){
    clearTimeout(idleTimer);
    if(document.hidden)return;
    idleTimer=setTimeout(()=>{
      if(!document.hidden && !paused && !document.querySelector('dialog[open],.pixel-transition.is-active,.is-speaking,.is-dragging')){
        const headerBottom=document.querySelector('.nav').getBoundingClientRect().bottom;
        const candidates=actors.filter(actor=>{
          const r=actor.wrap.getBoundingClientRect();
          return r.top>=headerBottom+12 && r.bottom<=innerHeight-12 && r.right>0 && r.left<innerWidth;
        });
        if(candidates.length)candidates[idleTurn++%candidates.length].speak();
      }
      scheduleIdle(26000);
    },delay);
  }
  ['pointerdown','pointermove','keydown','scroll','touchstart'].forEach(event=>{
    window.addEventListener(event,()=>scheduleIdle(),{passive:true});
  });
  document.addEventListener('visibilitychange',()=>scheduleIdle());
  scheduleIdle();
  window.addEventListener('resize',()=>actors.forEach(actor=>actor.reset()));
  reduced.addEventListener('change',()=>actors.forEach(actor=>actor.reset()));
  document.querySelectorAll('.profile,.contact').forEach((section,index)=>{
    const cluster=document.createElement('div');cluster.className='ambient-pixels';cluster.setAttribute('aria-hidden','true');
    cluster.style.setProperty('--cluster-color',palettes[index+1]);cluster.innerHTML='<i></i><i></i><i></i><i></i><i></i>';section.append(cluster);
  });
  const motionButton=document.createElement('button');motionButton.type='button';motionButton.className='motion-toggle';
  motionButton.textContent='Ⅱ Animasi';motionButton.setAttribute('aria-pressed','false');
  document.querySelector('footer').append(motionButton);
  motionButton.addEventListener('click',()=>{
    paused=!paused;document.body.classList.toggle('motion-paused',paused);motionButton.setAttribute('aria-pressed',String(paused));motionButton.textContent=paused?'▶ Animasi':'Ⅱ Animasi';
    if(paused)actors.forEach(actor=>actor.reset());
  });
  // Reuse the existing music analyser rather than creating a second audio source.
  const soundtrack = document.querySelector('#bgAudio');
  let lastDanceFrame = 0;
  const party = document.createElement('div');
  party.className = 'music-party';
  party.setAttribute('aria-hidden','true');
  document.body.append(party);
  let lastParty = 0;
  function partyBurst(energy) {
    const now = performance.now();
    if(now-lastParty < 450 || energy < .12 || party.childElementCount > 32) return;
    lastParty=now;
    for(let i=0;i<3;i++){
      const bit=document.createElement('span');
      const side=Math.random()<.5;
      const note=Math.random()>.7;
      bit.className=note?'party-note':'party-pixel';
      bit.textContent=note?(i%2?'♫':'♪'):'';
      bit.style.color=palettes[Math.floor(Math.random()*4)];
      bit.style.background=note?'transparent':'currentColor';
      // Concentrate movement at the sides so content remains readable.
      bit.style.left=(side?Math.random()*13:87+Math.random()*11)+'%';
      bit.style.top=(10+Math.random()*75)+'%';
      party.append(bit);
      const drift=(side?1:-1)*(20+Math.random()*45);
      const effect=bit.animate([
        {opacity:0,transform:'translate(0,20px) rotate(0deg) scale(.5)'},
        {opacity:.7,offset:.2},
        {opacity:0,transform:'translate('+drift+'px,-110px) rotate('+(note?20:160)+'deg) scale(1)'}
      ],{duration:1800+Math.random()*900,easing:'ease-out'});
      effect.finished.then(()=>bit.remove(),()=>bit.remove());
    }
  }
  function resetDance() {
    document.body.classList.remove('music-dancing');
    party.getAnimations({subtree:true}).forEach(animation=>animation.cancel());
    party.replaceChildren();
    document.body.style.removeProperty('--music-accent');
    document.body.style.removeProperty('--music-energy');
    document.querySelectorAll('.pixel-companion').forEach(wrap=>{
      wrap.style.removeProperty('--music-hop');
      wrap.style.removeProperty('--music-turn');
      wrap.style.removeProperty('--music-scale');
      wrap.style.removeProperty('--music-color');
    });
  }
  function syncMusic() {
    const active = !soundtrack.paused && !soundtrack.ended && !soundtrack.muted && soundtrack.volume > 0 && !noMotion() && !document.hidden;
    document.body.classList.toggle('music-dancing',active);
    if(!active) resetDance();
  }
  ['play','pause','ended','volumechange'].forEach(event=>soundtrack.addEventListener(event,syncMusic));
  reduced.addEventListener('change',syncMusic);
  document.addEventListener('visibilitychange',syncMusic);
  document.addEventListener('portfolio-beat',event=>{
    if(performance.now()-lastDanceFrame<40)return;
    lastDanceFrame=performance.now();
    syncMusic();
    if(!document.body.classList.contains('music-dancing'))return;
    const energy=event.detail.energy, time=performance.now()/1000;
    partyBurst(energy);
    const colorStep=Math.floor(time/1.6);
    document.body.style.setProperty('--music-accent',palettes[colorStep%4]);
    document.body.style.setProperty('--music-energy',energy.toFixed(3));
    document.querySelectorAll('.pixel-companion').forEach((wrap,index)=>{
      const swing=Math.sin(time*7+index*1.7);
      wrap.style.setProperty('--music-color',palettes[(colorStep+index)%4]);
      wrap.style.setProperty('--music-hop',(-energy*(9+index*3)).toFixed(1)+'px');
      wrap.style.setProperty('--music-turn',(swing*energy*18).toFixed(1)+'deg');
      wrap.style.setProperty('--music-scale',(1+energy*.16).toFixed(3));
    });
    document.querySelector('.music-badge').style.setProperty('--meter-scale',String(.2+energy*.8));
  });
  motionButton.addEventListener('click',syncMusic);
  // Three custom scene changes: diagonal pixels, checkerboard, and horizontal shutters.
  const curtain=document.createElement('div');
  curtain.className='pixel-transition';curtain.setAttribute('aria-hidden','true');
  const cells=Array.from({length:72},(_,index)=>{
    const cell=document.createElement('i');cell.style.background=palettes[Math.floor(index/12)%4];curtain.append(cell);return cell;
  });
  document.body.append(curtain);
  let transitioning=false;
  const variants={home:'diagonal',profile:'checker',projects:'shutter',achievements:'diagonal',contact:'checker'};
  async function navigate(target,hash) {
    if(transitioning)return;
    transitioning=true;
    const type=variants[target.id]||'diagonal';
    const go=()=>{
      const offset=document.querySelector('.nav').getBoundingClientRect().height+20;
      const top=target.getBoundingClientRect().top+scrollY-offset;
      window.scrollTo({top:Math.max(0,top),behavior:'instant'});
      if(location.hash!==hash) history.pushState(null,'',hash);
      target.tabIndex=-1;target.focus({preventScroll:true});
    };
    if(noMotion()){go();transitioning=false;return;}
    curtain.className='pixel-transition is-active '+type;
    const delay=index=>{
      const col=index%12,row=Math.floor(index/12);
      return type==='checker'?(col+row)%2*85:type==='shutter'?row*28:(col+row)*13;
    };
    const initial=type==='shutter'?'scaleX(0)':'scale(0)';
    const animations=[];
    try {
      const covers=cells.map((cell,index)=>cell.animate([{transform:initial},{transform:'scale(1.015)'}],{duration:170,delay:delay(index),fill:'both',easing:'steps(4,end)'}));
      animations.push(...covers);
      await Promise.all(covers.map(animation=>animation.finished));
      go();
      const reveals=cells.map((cell,index)=>cell.animate([{transform:'scale(1.015)'},{transform:initial}],{duration:210,delay:delay(71-index)*.7,fill:'both',easing:'steps(4,end)'}));
      animations.push(...reveals);
      await Promise.all(reveals.map(animation=>animation.finished));
    } finally {
      animations.forEach(animation=>animation.cancel());
      curtain.className='pixel-transition';transitioning=false;
    }
  }
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href^="#"]');
    if(!link||event.defaultPrevented||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.button!==0)return;
    const hash=link.getAttribute('href');
    if(hash.length<2)return;
    const target=document.getElementById(hash.slice(1));
    if(!target)return;
    event.preventDefault();
    navigate(target,hash);
  });
  // Pause passive loops when the tab is hidden.
  document.addEventListener('visibilitychange',()=>document.body.classList.toggle('page-hidden',document.hidden));
})();





















