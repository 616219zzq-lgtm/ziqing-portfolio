import { useEffect, useRef } from 'react';
import { profile } from '../content';

export default function ClosingBadge() {
  const root=useRef(null), assembly=useRef(null), card=useRef(null), impulse=useRef(null);
  useEffect(()=>{
    const quiet=matchMedia('(prefers-reduced-motion: reduce)');
    let raf=0,last=0,visible=false,angle=0,velocity=0,flex=0,time=0;
    const tick=now=>{
      raf=0;if(!visible||quiet.matches)return;
      const dt=Math.min((now-last)/1000||1/60,.033);last=now;time+=dt;
      velocity+=(-8*angle-1.8*velocity+Math.sin(time*1.6)*.035)*dt;
      angle+=velocity*dt;flex+=(velocity*.075-flex)*Math.min(1,dt*7);
      assembly.current.style.transform='rotate('+angle+'rad) perspective(1200px) rotateX('+Math.sin(time*.9)*.012+'rad)';
      card.current.style.transform='rotate('+flex+'rad)';
      if(Math.abs(angle)>.0001||Math.abs(velocity)>.0001||visible)raf=requestAnimationFrame(tick);
    };
    const wake=()=>{if(visible&&!quiet.matches&&!raf){last=performance.now();raf=requestAnimationFrame(tick);}};
    impulse.current=()=>{velocity=Math.max(-2.2,Math.min(2.2,velocity+(angle>0?-1:1)*1.6));wake();};
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting&&!document.hidden;if(visible)wake();else{cancelAnimationFrame(raf);raf=0;}},{threshold:.08});observer.observe(root.current);
    const visibility=()=>{visible=!document.hidden&&root.current.getBoundingClientRect().bottom>0&&root.current.getBoundingClientRect().top<innerHeight;if(!visible){cancelAnimationFrame(raf);raf=0;}else wake();};
    const reduced=()=>{cancelAnimationFrame(raf);raf=0;if(quiet.matches){assembly.current.style.transform='none';card.current.style.transform='none';}else wake();};
    document.addEventListener('visibilitychange',visibility);quiet.addEventListener('change',reduced);
    return()=>{observer.disconnect();cancelAnimationFrame(raf);document.removeEventListener('visibilitychange',visibility);quiet.removeEventListener('change',reduced);};
  },[]);
  return <div className="closing-badge-stage" ref={root}><div className="closing-badge-assembly" ref={assembly}><span className="closing-ribbon" aria-hidden="true"/><button className="closing-badge-button" aria-label="轻推张紫晴的吊牌" onClick={()=>impulse.current?.()}><div className="closing-photo-card" ref={card}>{profile.portrait?<img className="closing-card-full-image" src={profile.portrait} alt="张紫晴，体验设计 / UI 设计"/>:<div className="closing-photo-placeholder" role="img" aria-label="个人照片素材预留"><span>+</span></div>}</div></button></div></div>;
}
