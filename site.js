// GauRush authentic four-video showcase. Four new MP4 demos and freshly generated posters; original brand logo unchanged.
const features = [
 {heading:'Inspect every frame.',description:'Scrub the timeline and inspect a capture from different angles. Open PLY, SPLAT, and KSPLAT files or add multiple captures to a scene.',poster:'view.jpg',video:'view.mp4',label:'GauRush viewport with sample splat sequence and playback timeline'},
 {heading:'Add a crop box to a sequence.',description:'Add a fixed crop box while the capture plays. Toggle Preview to see how the same box affects each frame.',poster:'crop.jpg',video:'crop.mp4',label:'GauRush demo adding a crop box to a splat sequence'},
 {heading:'Remove stray splats with a lasso.',description:'Draw around unwanted splats in the viewport and delete the selection from the current frame.',poster:'lasso.jpg',video:'lasso.mp4',label:'GauRush lasso cleanup demo showing selection and deletion'},
 {heading:'Make the crop follow the action.',description:'Keyframe crop position, rotation, and size. Adjust timing and interpolation directly in the timeline.',poster:'animate.jpg',video:'animate.mp4',label:'GauRush animation and crop keyframe timeline'}
];
const tabs=[...document.querySelectorAll('[role="tab"]')], panel=document.querySelector('#workspace-panel'),demo=document.querySelector('#workspace-demo'),reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');let demoVisible=false;
function tryPlay(){if(demoVisible&&!reduceMotion.matches)demo.play().catch(()=>{});}
const videoObserver=new IntersectionObserver(([entry])=>{demoVisible=entry.isIntersecting&&entry.intersectionRatio>=.3;if(demoVisible)tryPlay();else demo.pause();},{threshold:.3});videoObserver.observe(demo);
function selectFeature(index){const f=features[index];tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1});panel.setAttribute('aria-labelledby',tabs[index].id);panel.querySelector('h3').textContent=f.heading;panel.querySelector('p').textContent=f.description;document.querySelector('#video-counter').textContent=String(index+1).padStart(2,'0')+' / 04';if(demo.getAttribute('src')!=='assets/'+f.video){demo.pause();demo.poster='assets/'+f.poster;demo.src='assets/'+f.video;demo.setAttribute('aria-label',f.label);demo.load();tryPlay();}}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>selectFeature(index));tab.addEventListener('keydown',event=>{const m={ArrowLeft:index-1,ArrowRight:index+1,ArrowUp:index-1,ArrowDown:index+1,Home:0,End:tabs.length-1};if(!(event.key in m))return;event.preventDefault();const next=(m[event.key]+tabs.length)%tabs.length;selectFeature(next);tabs[next].focus()})});reduceMotion.addEventListener('change',()=>reduceMotion.matches?demo.pause():tryPlay());
// The hero is a silent, looping background video. No controls or playhead are shown.
const heroVideo = document.querySelector('#hero-video');
if (heroVideo) {
  heroVideo.muted = true;
  heroVideo.defaultMuted = true;
  heroVideo.volume = 0;
  heroVideo.play().catch(() => {});
}
const progress=document.querySelector('.scroll-progress');let scrollFrame=0;window.addEventListener('scroll',()=>{if(scrollFrame)return;scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform='scaleX('+(max>0?scrollY/max:0)+')'})},{passive:true});


// Scroll choreography: reveal + gentle, frame-synchronized parallax.
// Keep the original media and interactive tab controls independent of animation.
(function setupScrollMotion() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const revealNodes = [
    ...document.querySelectorAll('.section-head, .workbench, .manifesto .section-index, .manifesto h2, .manifesto p, .feature-grid article, .download-copy > *, .download-mark, .after-download > *, .ribbon-inner')
  ];
  revealNodes.forEach((el, index) => {
    el.classList.add('motion-reveal');
    if (el.matches('.feature-grid article')) el.style.setProperty('--reveal-delay', `${(index % 3) * 65}ms`);
  });

  let observer;
  function setRevealMode() {
    observer?.disconnect();
    if (prefersReduced.matches || !('IntersectionObserver' in window)) {
      document.documentElement.classList.remove('motion-enabled');
      revealNodes.forEach(el => el.classList.add('in-view'));
      resetParallax();
      return;
    }
    document.documentElement.classList.add('motion-enabled');
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target); // never hide content again when scrolling up
        }
      });
    }, { rootMargin: '0px 0px -7% 0px', threshold: 0.08 });
    revealNodes.forEach(el => {
      if (!el.classList.contains('in-view')) observer.observe(el);
    });
    requestScrollFrame();
  }

  const hero = document.querySelector('.hero');
  const heroVideo = document.querySelector('.hero-video');
  const heroCopy = document.querySelector('.hero-copy');
  const floatNodes = [
    [document.querySelector('.workbench-main'), 16],
    [document.querySelector('.download-mark'), 24],
    [document.querySelector('.manifesto h2'), 10]
  ].filter(([el]) => !!el);
  let raf = 0;
  function resetParallax() {
    if (heroVideo) heroVideo.style.setProperty('--hero-drift','0px');
    if (heroCopy) heroCopy.style.setProperty('--copy-drift','0px');
    floatNodes.forEach(([el]) => el.style.setProperty('--float-y','0px'));
  }
  function applyScrollMotion() {
    raf = 0;
    if (prefersReduced.matches) { resetParallax(); return; }
    const vh = window.innerHeight || 1;
    if (hero) {
      const rect = hero.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < vh) {
        const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height)));
        heroVideo?.style.setProperty('--hero-drift', `${(progress * 70).toFixed(1)}px`);
        heroCopy?.style.setProperty('--copy-drift', `${(-progress * 45).toFixed(1)}px`);
      }
    }
    floatNodes.forEach(([el, amount]) => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > vh + 100) return;
      const center = (rect.top + rect.height / 2 - vh / 2) / vh;
      const translation = Math.max(-amount, Math.min(amount, -center * amount * 1.6));
      el.style.setProperty('--float-y', `${translation.toFixed(1)}px`);
    });
  }
  function requestScrollFrame() { if (!raf) raf = requestAnimationFrame(applyScrollMotion); }
  window.addEventListener('scroll', requestScrollFrame, { passive: true });
  window.addEventListener('resize', requestScrollFrame, { passive: true });
  prefersReduced.addEventListener('change', setRevealMode);
  setRevealMode();
})();
