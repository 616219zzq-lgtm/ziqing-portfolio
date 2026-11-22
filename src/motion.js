import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Each animated layer is separate from the layer used by hovering, flipping,
// dragging or the phone's existing reversible scroll narrative.
export function usePortfolioMotion(path) {
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add({
      desktop: '(min-width: 701px)',
      mobile: '(max-width: 700px)',
      quiet: '(prefers-reduced-motion: reduce)',
    }, context => {
      if (context.conditions.quiet) return;
      const mobile = context.conditions.mobile;
      const distance = mobile ? 65 : 125;
      const ease = 'power4.out';
      const enterTitle = (timeline, target, position = 0) => {
        if (!target || !target.length) return;
        timeline.fromTo(target,
          { yPercent: 105, scaleX: .94, transformOrigin: '0% 100%' },
          { yPercent: 0, scaleX: 1, duration: 1.25, ease:'power4.out', stagger: .1, clearProps: 'transform' }, position);
      };
      const titleLines = scope => [...scope.querySelectorAll('.motion-title .title-line')];
      const hero = document.querySelector('.reference-hero');
      if (hero && !mobile && scrollY < 30 && !location.hash) {
        const opening = gsap.timeline({ defaults: { ease }, onComplete:()=>ScrollTrigger.refresh() });
        gsap.set('.hero-badges',{scale:.96,autoAlpha:0});
        opening.fromTo('.home-header',{y:-50,autoAlpha:0},{y:0,autoAlpha:1,duration:1.05,clearProps:'transform,opacity,visibility'},.08)
          .fromTo(hero.querySelector('.eyebrow'),{y:28,autoAlpha:0},{y:0,autoAlpha:1,duration:.85,clearProps:'transform,opacity,visibility'},.2)
          .to('.hero-badges',{scale:1,autoAlpha:1,duration:1.5,ease:'power3.out',clearProps:'transform,opacity,visibility'},.3);
        enterTitle(opening,hero.querySelectorAll('h1 .title-line'),.32);
        opening.fromTo(hero.querySelectorAll('.hero-description,.hero-copy>.button'),{y:28,autoAlpha:0},{y:0,autoAlpha:1,duration:.95,stagger:.1,clearProps:'transform,opacity,visibility'},.88);
      }

      const phone = document.querySelector('.phone-assembly');
      if (phone) gsap.fromTo(phone, { y: 85, scale: .86 }, {
        y: 0, scale: 1, duration: 1.8, ease, clearProps: 'transform',
        scrollTrigger: { trigger: '.centered-phone-story', start: 'top 85%', once: true },
      });

      const buildSection = (selector, cardsSelector, textSelector) => {
        const section = document.querySelector(selector);
        if (!section || section.getBoundingClientRect().bottom < 0) return;
        const heading = section.querySelector('.section-heading,.motion-heading,.explore-heading,.about-intro') || section;
        const timeline = gsap.timeline({ scrollTrigger: {
          trigger: heading, start: mobile ? 'top 88%' : 'top 82%',
          toggleActions: 'play none none none', once: true,
        } });
        enterTitle(timeline, titleLines(section));
        const copy = textSelector ? section.querySelectorAll(textSelector) : [];
        if (copy.length) timeline.fromTo(copy,
          { y: 26, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1, stagger: .08, ease, clearProps: 'transform,opacity,visibility' }, .18);
        const cards = section.querySelectorAll(cardsSelector);
        if (cards.length) {
          // Reveal when the cards themselves approach the viewport, after the heading.
          gsap.fromTo(cards,
            { y: distance*.55, scale: .97, clipPath: 'inset(0 0 16% 0 round 18px)' },
            { y: 0, scale: 1, clipPath: 'inset(0 0 0% 0 round 0px)', duration: 1.35, ease, stagger: .12, clearProps: 'transform,clipPath',
              scrollTrigger: { trigger: cards[0], start: 'top 94%', once: true } });
        }
      };
      buildSection('#work', '.project-arrival', '.section-heading>p');
      buildSection('.motion-section', '.motion-device-wrap', '.motion-heading>p,.motion-heading>.text-link');
      buildSection('#explorations', '.exploration-card', '.explore-heading .eyebrow,.explore-heading>span');
      buildSection('#about', '.about-portrait,.about-job,.about-editorial-footer', '.about-identity,.about-experience>h3');
      const contact = document.querySelector('.reference-contact');
      if (contact) {
        const copy = contact.querySelector('.contact-copy');
        const timeline = gsap.timeline({ scrollTrigger: { trigger: copy, start: 'top 92%', once: true } });
        enterTitle(timeline, titleLines(copy));
        timeline.fromTo(copy.querySelectorAll('p,.contact-actions,.contact-details'),
          { y: 45, clipPath: 'inset(0 0 100% 0)' },
          { y: 0, clipPath: 'inset(0 0 0% 0)', duration: 1.5, stagger: .16, ease, clearProps: 'transform,clipPath' }, .48);
      }
      // Local image movement only: native scrolling and anchor navigation remain intact.
      document.querySelectorAll('.exploration-image,.video-placeholder,.motion-showcase-reel,.case-banner,.chapter-media').forEach(frame => {
        const content = frame.querySelector(':scope > .project-placeholder,:scope > img');
        if (!content || content.matches('.case-image')) return;
        gsap.fromTo(content, { yPercent: mobile ? -2 : -4, scale: 1.1 }, {
          yPercent: mobile ? 2 : 4, scale: 1.04, ease: 'none',
          scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: .45 },
        });
      });
      if (path !== '/') {
        const intro = document.querySelector('.case-intro');
        if (intro) gsap.fromTo(intro.children, { y: 55, clipPath: 'inset(0 0 100% 0)' },
          { y: 0, clipPath: 'inset(0 0 0% 0)', duration: 1.5, stagger: .12, ease, clearProps: 'transform,clipPath' });
      }
      ScrollTrigger.refresh();
      // Accordion expansion changes later trigger positions without a window resize.
      const main = document.querySelector('main');
      let refreshFrame=0;
      const observer = new ResizeObserver(() => {
        cancelAnimationFrame(refreshFrame);
        refreshFrame=requestAnimationFrame(()=>ScrollTrigger.refresh());
      });
      if (main) observer.observe(main);
      return () => { observer.disconnect(); cancelAnimationFrame(refreshFrame); };
    });
    return () => media.revert();
  }, [path]);
}
