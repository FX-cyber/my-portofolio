/* Scroll-driven scenes adapted from the beach template's pinned overlapping panels. */
(() => {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const grid=document.querySelector('.quest-grid');
  const cards=[...grid.querySelectorAll('article')];
  const track=document.createElement('div');track.className='project-scroll-track';
  grid.before(track);track.append(grid);
  const scene=document.createElement('div');scene.className='project-scroll-stage';
  track.prepend(scene);scene.append(grid);
  const controls=document.createElement('nav');controls.className='scene-controls';controls.setAttribute('aria-label','Pilih adegan proyek');
  const buttons=cards.map((card,index)=>{
    card.classList.add('scene-card');card.classList.remove('scroll-depth');
    card.style.setProperty('--scene-color',['var(--blue)','var(--green)','var(--red)'][index]);
    card.style.setProperty('--scene-index',index);
    const cta=document.createElement('span');cta.className='scene-cta';cta.textContent='BUKA DETAIL ↗';card.append(cta);
    const button=document.createElement('button');button.type='button';button.textContent='0'+(index+1);
    button.setAttribute('aria-label',card.dataset.title);button.addEventListener('click',()=>{
      const top=track.getBoundingClientRect().top+scrollY;
      const distance=track.offsetHeight-scene.offsetHeight;
      window.scrollTo({top:top-navHeight()+distance*(index/(cards.length-1)),behavior:reduced.matches?'instant':'smooth'});
    });
    controls.append(button);return button;
  });
  scene.append(controls);
  const hint=document.createElement('span');hint.className='scene-scroll-hint';hint.textContent='SCROLL TO EXPLORE ↓';scene.append(hint);
  const bands=[];
  [['profile','02 / PROFILE','var(--green)'],['projects','03 / PROJECTS','var(--blue)'],['achievements','04 / ACHIEVEMENTS','var(--red)'],['contact','05 / LET’S CONNECT','var(--yellow)']].forEach(([id,label,color])=>{
    const section=document.getElementById(id);
    const band=document.createElement('div');band.className='scroll-scene-divider';band.setAttribute('aria-hidden','true');band.style.setProperty('--band-color',color);
    const title=document.createElement('span');title.textContent=label;band.append(title);
    for(let i=0;i<12;i++){const block=document.createElement('i');block.style.setProperty('--column',i);band.append(block);}
    section.before(band);bands.push(band);
  });
  const clamp=value=>Math.max(0,Math.min(1,value));
  function navHeight(){return document.querySelector('.nav').offsetHeight+12;}
  let frame=0,active=-1;
  function update(){
    frame=0;
    const off=reduced.matches||document.body.classList.contains('motion-paused')||innerHeight<560;
    document.body.classList.toggle('scroll-scenes-off',off);
    document.documentElement.style.setProperty('--scene-top',navHeight()+'px');
    if(off){
      cards.forEach(card=>{card.inert=false;card.removeAttribute('aria-hidden');card.style.removeProperty('--panel-y');card.style.removeProperty('--panel-scale');});
      active=-1;return;
    }
    const rect=track.getBoundingClientRect();
    const progress=clamp((navHeight()-rect.top)/(track.offsetHeight-scene.offsetHeight));
    let current=0;
    cards.forEach((card,index)=>{
      const start=index===0?0:(index===1?.19:.62);
      const entrance=index===0?1:clamp((progress-start)/.19);
      const next=index===2?0:clamp((progress-(index===0?.19:.62))/.19);
      card.style.setProperty('--panel-y',((1-entrance)*110).toFixed(2)+'%');
      card.style.setProperty('--panel-scale',(1-next*.09).toFixed(3));
      card.style.setProperty('--panel-tilt',(-next*9).toFixed(2)+'deg');
      if(entrance>.65)current=index;
    });
    if(current!==active){
      active=current;
      cards.forEach((card,index)=>{card.inert=index!==active;card.setAttribute('aria-hidden',String(index!==active));});
      buttons.forEach((button,index)=>{button.classList.toggle('is-current',index===active);button.setAttribute('aria-current',index===active?'true':'false');});
    }
    bands.forEach(band=>{
      const r=band.getBoundingClientRect();
      if(r.bottom<0||r.top>innerHeight)return;
      const p=clamp((innerHeight-r.top)/(innerHeight+r.height));
      band.style.setProperty('--band-shift',((p-.5)*180).toFixed(1)+'px');
      [...band.querySelectorAll('i')].forEach((block,index)=>{
        const wave=Math.sin(p*Math.PI+index*.45);
        block.style.transform='translateY('+((1-wave)*70).toFixed(1)+'%)';
      });
    });
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(update);}
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule);
  reduced.addEventListener('change',schedule);
  document.querySelector('.motion-toggle').addEventListener('click',schedule);
  new ResizeObserver(schedule).observe(track);
  update();
})();
