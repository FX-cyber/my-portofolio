
/* Scroll depth uses individual transforms, preserving pointer tilt and reveal transforms. */
(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const targets = [...document.querySelectorAll('.photo-frame,.profile-photo,.status-card,.certificate-card,.save-terminal,blockquote')];
  const visible = new Set();
  let frame = 0;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target));
    schedule();
  }, {rootMargin:'100px'});
  targets.forEach((element,index) => {
    element.classList.add('scroll-depth');
    element.style.setProperty('--depth-side',index%2 ? '1' : '-1');
    observer.observe(element);
  });
  function render() {
    frame = 0;
    const disabled = preference.matches || document.body.classList.contains('motion-paused');
    const height = innerHeight;
    visible.forEach(element => {
      if(disabled) {
        element.style.removeProperty('--scroll-angle');
        element.style.removeProperty('--scroll-lift');
        element.style.removeProperty('--scroll-scale');
        return;
      }
      const rect = element.getBoundingClientRect();
      // A calm central reading zone; depth is strongest only when entering/leaving.
      const center = rect.top + rect.height / 2;
      const progress = Math.max(-1,Math.min(1,(center-height*.5)/(height*.65)));
      const amount = Math.sign(progress)*Math.max(0,Math.abs(progress)-.22)/.78;
      const mobile = innerWidth <= 760;
      element.style.setProperty('--scroll-angle',(amount*(mobile?6:12)).toFixed(2)+'deg');
      element.style.setProperty('--scroll-lift',(amount*(mobile?10:22)).toFixed(2)+'px');
      element.style.setProperty('--scroll-scale',(1-Math.abs(amount)*.035).toFixed(4));
    });
  }
  function schedule() {if(!frame && !document.hidden)frame=requestAnimationFrame(render);}
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule);
  document.addEventListener('visibilitychange',schedule);
  preference.addEventListener('change',()=>{
    targets.forEach(element=>{
      element.style.removeProperty('--scroll-angle');
      element.style.removeProperty('--scroll-lift');
      element.style.removeProperty('--scroll-scale');
    });
    schedule();
  });
  document.querySelector('.motion-toggle')?.addEventListener('click',()=>{
    targets.forEach(element=>{
      element.style.removeProperty('--scroll-angle');
      element.style.removeProperty('--scroll-lift');
      element.style.removeProperty('--scroll-scale');
    });
    schedule();
  });
})();

