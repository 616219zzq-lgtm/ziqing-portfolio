import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, ArrowDown, ArrowLeft, ArrowRight, RotateCw, Download, Copy, Check, Menu, X, Plus, MapPin, Smartphone, Signal, Battery } from 'lucide-react';
import { profile, projects, explorations, media, motionClips, heroMedia, phonePortrait, explorationCovers } from './content';
import ProfileCard from './components/ProfileCard';
import ClosingBadge from './components/ClosingBadge';
import GalleryTilt from './components/GalleryTilt';
import './style.css';
import './components/Gallery.css';
import { usePortfolioMotion } from './motion';

const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));
const PatternWaves = lazy(() => import('./components/PatternWaves'));
const phase = (n, a, b) => clamp((n - a) / (b - a));
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, '');
const withBase = path => {
  if (/^(https?:|data:|blob:)/.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return BASE_PATH && (normalized === BASE_PATH || normalized.startsWith(`${BASE_PATH}/`))
    ? normalized
    : `${BASE_PATH}${normalized}`;
};
const casePath = id => `/projects/${id}`;
const routePath = pathname => {
  const path=pathname.replace(/\/$/, '')||'/';
  return (BASE_PATH&&path.startsWith(BASE_PATH)?path.slice(BASE_PATH.length):path)||'/';
};

function MotionTitle({ children, className = '', ...props }) {
  return <h2 className={'motion-title '+className} {...props}><span className="title-mask"><span className="title-line">{children}</span></span></h2>;
}

function PersonalArt({ compact = false }) {
  return <div className={`personal-art ${compact ? 'compact' : ''}`} aria-hidden="true"><div className="art-grid"/><div className="art-orbit orbit-a"/><div className="art-orbit orbit-b"/><div className="chrome-flower">✳</div><span className="art-corner">CREATIVE<br/>BY NATURE.</span><span className="art-sign">zq.</span><div className="art-dot dot-a"/><div className="art-dot dot-b"/></div>;
}

function NameCard({ small = false, className = '' }) {
  return <div className={`name-card ${small ? 'small' : ''} ${className}`}><PersonalArt compact={small}/><div className="name-card-info"><span className="tiny-code">HELLO, I'M</span><strong>{profile.name}</strong><span>{profile.role}</span><div className="name-card-foot"><span>WUXI, CHINA</span><ArrowUpRight size={17}/></div></div></div>;
}

function ProjectPlaceholder({ label = '项目素材', video = false }) {
  return <div className="project-placeholder" role="img" aria-label={label + '，素材预留区域'}><span className="placeholder-mark" aria-hidden="true">{video ? '▷' : '+'}</span><span>{label}</span><small>{video ? 'VIDEO SPACE' : 'IMAGE SPACE'} / 素材预留</small></div>;
}

function ProjectMedia({ src, alt, video = false, poster }) {
  const [failed, setFailed] = useState(false);
  const element = useRef(null);
  useEffect(() => setFailed(false), [src]);
  useEffect(() => {
    const el=element.current;
    if (!video || !el) return;
    const observer=new IntersectionObserver(([entry])=>{if(!entry.isIntersecting)el.pause();});
    observer.observe(el);
    return ()=>observer.disconnect();
  }, [video, src, failed]);
  if (!src || failed) return <ProjectPlaceholder label={alt} video={video}/>;
  const mediaUrl=src.startsWith('/')?(src.startsWith(`${BASE_PATH}/`)?src:withBase(src)):src;
  const posterUrl=poster?(poster.startsWith('/')?withBase(poster):poster):undefined;
  return video ? <video ref={element} className="project-media" src={mediaUrl} poster={posterUrl} controls muted playsInline preload="metadata" onError={()=>setFailed(true)} aria-label={alt}/> : <img className="project-media" src={mediaUrl} alt={alt} loading="lazy" decoding="async" onError={()=>setFailed(true)}/>;
}

function PeanutArt() {
  return <ProjectMedia src={media.xiaohuasheng.cover} alt="小花生 · 项目封面"/>;
}

function MapArt() {
  return <ProjectMedia src={media.flarewild.cover} alt="FlareWild · 项目封面"/>;
}

function BackgroundMusic() {
  const audio = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const label = playing ? '暂停背景音乐' : '播放背景音乐';
  const preferenceKey = 'portfolio-bgm';

  useEffect(() => {
    try { if (localStorage.getItem(preferenceKey) === 'off') return; } catch {}
    const player = audio.current;
    player.volume = 0.28;
    const retry = event => {
      if (event.target instanceof Element && event.target.closest('.music-control')) return;
      if (event.type === 'keydown' && (event.repeat || !['Enter', ' '].includes(event.key))) return;
      start();
    };
    const stopListening = () => {
      window.removeEventListener('click', retry, true);
      window.removeEventListener('keydown', retry, true);
      player.removeEventListener('play', stopListening);
    };
    const start = () => player.play().catch(error => {
      if (!['NotAllowedError', 'AbortError'].includes(error.name)) stopListening();
    });
    window.addEventListener('click', retry, true);
    window.addEventListener('keydown', retry, true);
    player.addEventListener('play', stopListening, { once: true });
    start();
    return stopListening;
  }, []);

  const toggleMusic = async () => {
    const player = audio.current;
    try { localStorage.setItem(preferenceKey, player.paused ? 'on' : 'off'); } catch {}
    if (!player.paused) {
      player.pause();
      return;
    }
    setFailed(false);
    if (player.error) player.load();
    player.volume = 0.28;
    try {
      await player.play();
    } catch (error) {
      if (error.name !== 'AbortError') setFailed(true);
    }
  };

  return <div className="music-control">
    <audio ref={audio} src={withBase('/assets/audio/bgm.mp3')} loop preload="none"
      onPlaying={() => { setPlaying(true); setFailed(false); }} onPause={() => setPlaying(false)}
      onError={() => { setPlaying(false); setFailed(true); }}/>
    <button type="button" className="music-toggle" aria-label="背景音乐" aria-pressed={playing} title={label} onClick={toggleMusic}>
      <span className="music-bars" aria-hidden="true"><i/><i/><i/></span>
      <span aria-hidden="true">{playing ? 'PAUSE' : 'MUSIC'}</span>
    </button>
    {failed && <span className="music-error" role="status">音乐加载失败，请重试</span>}
  </div>;
}

function Header({ navigate, isCase = false }) {
  const [open, setOpen] = useState(false);
  const toggle=useRef(null);
  useEffect(()=>setOpen(false), [isCase]);
  useEffect(()=>{
    if(!open)return;
    const close=e=>{if(e.key==='Escape'){setOpen(false);toggle.current?.focus();}};
    window.addEventListener('keydown',close);
    return ()=>window.removeEventListener('keydown',close);
  },[open]);
  const anchor=(event,id)=>{
    if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    setOpen(false);
    event.preventDefault();navigate('/',id);
  };
  return <header className={'site-header '+(isCase?'case-header':'home-header')}>
    <a className="logo" href={withBase('/')} onClick={e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();setOpen(false);navigate('/');}} aria-label="张紫晴，返回首页">zq<span>✳</span></a>
    <div className="header-actions">
    <BackgroundMusic/>
    <button ref={toggle} className="menu-button icon-button" aria-label={open?'关闭导航':'打开导航'} aria-expanded={open} aria-controls="primary-nav" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
    <nav id="primary-nav" className={open?'is-open':''} aria-label="主导航">
      <a href={withBase('/#work')} onClick={e=>anchor(e,'work')}>作品<span>02</span></a>
      <a href={withBase('/#about')} onClick={e=>anchor(e,'about')}>关于我</a>
      <a href={withBase('/#contact')} onClick={e=>anchor(e,'contact')}>联系<ArrowUpRight size={14}/></a>
      <a className="nav-resume" href={profile.resume} download="张紫晴-体验设计简历.pdf">下载简历<Download size={14}/></a>
    </nav>
    </div>
  </header>;
}

function Hero() {
  const hero=useRef(null);
  useEffect(()=>{
    const element=hero.current, quiet=matchMedia('(prefers-reduced-motion: reduce)');
    let frame=0,last=0,height=element.offsetHeight,visible=true;
    const current=[0,0,0],target=[0,0,0],velocity=[0,0,0];
    const paint=()=>{['--pointer-x','--pointer-y','--hero-scroll'].forEach((key,i)=>element.style.setProperty(key,current[i].toFixed(5)));};
    const tick=time=>{
      frame=0;const dt=Math.min((time-last)/1000||1/60,.032);last=time;let moving=false;
      current.forEach((value,i)=>{velocity[i]+=(60*(target[i]-value)-20*velocity[i])*dt;current[i]+=velocity[i]*dt;if(Math.abs(target[i]-current[i])+Math.abs(velocity[i])>.0001)moving=true;});
      paint();if(moving&&visible)frame=requestAnimationFrame(tick);
    };
    const wake=()=>{if(!frame&&visible&&!quiet.matches){last=performance.now();frame=requestAnimationFrame(tick);}};
    const move=e=>{if(e.pointerType!=='mouse')return;target[0]=e.clientX/innerWidth*2-1;target[1]=e.clientY/innerHeight*2-1;wake();};
    const scroll=()=>{target[2]=clamp(scrollY/Math.max(1,height));wake();};
    const resize=()=>{height=element.offsetHeight;scroll();};
    const reset=()=>{cancelAnimationFrame(frame);frame=0;current.fill(0);velocity.fill(0);paint();if(!quiet.matches){scroll();wake();}};
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible){current[2]=target[2];wake();}else{cancelAnimationFrame(frame);frame=0;}});observer.observe(element);
    window.addEventListener('pointermove',move,{passive:true});window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',resize);quiet.addEventListener('change',reset);scroll();
    return()=>{cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('pointermove',move);window.removeEventListener('scroll',scroll);window.removeEventListener('resize',resize);quiet.removeEventListener('change',reset);};
  },[]);
  const badges = [
    {position:'left-main',label:'小花生',subtitle:'UI / UX DESIGN',src:heroMedia.xiaohuasheng},
    {position:'left-top',label:'Design exploration',subtitle:'SELECTED WORK',src:heroMedia.designExploration},
    {position:'right-top',label:'A little curiosity',subtitle:'DESIGN NOTES',src:heroMedia.curiosity},
    {position:'right-main',label:'FlareWild',subtitle:'EXPERIENCE DESIGN',src:heroMedia.flarewild},
    {position:'left-edge',label:'Visual stories',subtitle:'EXPLORATION',src:heroMedia.visualStories},
    {position:'left-bottom',label:'Everyday ideas',subtitle:'INTERACTION DESIGN',src:heroMedia.everydayIdeas},
    {position:'right-bottom',label:'Let’s connect',subtitle:'SAY HELLO',src:heroMedia.connect},
    {position:'right-edge',label:'More to come',subtitle:'WORK IN PROGRESS',src:heroMedia.moreToCome},
  ];
  return <section ref={hero} className="hero-section reference-hero" aria-labelledby="hero-title">
    <div className="hero-badges" aria-label="八张作品吊牌">{badges.map((badge,i)=><div className={'hero-badge badge-'+badge.position} key={badge.position} style={{'--drift-duration':(6+i%4*1.3)+'s','--drift-delay':(-i*1.7)+'s','--depth':i%3===0?1:.55}}>
      <div className="hero-badge-strap"/><div className="hero-badge-surface"><ProfileCard name="" title="" avatarUrl={badge.src} holo={0.8} glare={0.5} parallax={0} radius={16} enableTilt={false} intro={false} showUserInfo={false} theme="light"/><i className="hero-badge-slot"/></div>
    </div>)}</div>
    <div className="hero-copy"><p className="eyebrow">Experience &amp; UI Designer</p><h1 id="hero-title" aria-label="Turn ideas into experiences.">{['Turn ideas','into experiences.'].map(word=><span className="title-mask" key={word}><span className="title-line">{word}</span></span>)}</h1><p className="hero-description">换一个视角，跳出常规<br/>去挖掘用户容易被忽略的需求</p><a href={withBase('/#work')} className="button button-dark">查看精选项目</a></div>
  </section>;
}

function PhoneStory() {
  const ref=useRef(null),scene=useRef(null),gesture=useRef(null),swiped=useRef(false);
  const [active,setActive]=useState(1),[swing,setSwing]=useState(0),[mode,setMode]=useState('hand'),[chapter,setChapter]=useState(0),[showPattern,setShowPattern]=useState(false);
  const cards=['卡片 01','卡片 02','卡片 03'];
  const captions=[['Ideas, in motion.','从日常观察出发，让想法成为可以感知的体验。'],['A different perspective.','换一个视角，让想法面向更多人。'],['Made to connect.','让设计在真实的互动中，与人产生连接。'],['Take ideas with you.','把好奇心带入日常，也把观察带回设计。']];
  useEffect(()=>{
    let frame=0,last=0,current=0,velocity=0,target=0,previousScroll=scrollY;
    let bounds=null,motionBounds=null,lastMode=null,lastChapter=-1,lastDark=false;
    const readBounds=()=>{const r=ref.current.getBoundingClientRect(),m=document.getElementById('motion')?.getBoundingClientRect();bounds={top:r.top+scrollY,height:r.height};motionBounds=m?{top:m.top+scrollY,bottom:m.bottom+scrollY}:null;};
    const mq=matchMedia('(prefers-reduced-motion: reduce)');
    const draw=p=>{
      if(!ref.current||!scene.current)return;
      const quiet=mq.matches,angle=quiet?0:phase(p,.06,.24)*180;
      const wear=phase(p,.2,.29),strap=phase(p,.23,.33)*(1-phase(p,.58,.63)),pocket=phase(p,.64,.78);
      const values={'--phone-angle':angle+'deg','--card-angle':-angle+'deg','--phone-scale':1-.06*Math.sin(angle*Math.PI/180),'--wear':wear,'--strap-progress':strap,'--pocket-progress':pocket,'--phone-drop':pocket*36+'svh','--badge-sway':quiet?0:phase(p,.28,.36)*(1-phase(p,.58,.63)),'--caption-opacity':p>.6&&p<.75?0:1};
      for(const [key,value] of Object.entries(values))scene.current.style.setProperty(key,value);
      const next=p<.2?'hand':p<.78?'lanyard':'pocket';
      if(lastMode!==next){lastMode=next;setMode(next);}
      const nextChapter=p<.28?0:p<.44?1:p<.6?2:3;
      if(lastChapter!==nextChapter){lastChapter=nextChapter;setChapter(nextChapter);}
      const dark=p>=.2&&p<.6;
      if(lastDark!==dark){lastDark=dark;setShowPattern(dark);}
      scene.current.dataset.theme=p>=.6?'pocket':dark?'dark':'light';
      const motionDark=motionBounds&&motionBounds.top-scrollY<=62&&motionBounds.bottom-scrollY>62;
      document.documentElement.toggleAttribute('data-stage-dark',motionDark||(dark&&bounds.top<=scrollY&&bounds.top+bounds.height-scrollY>innerHeight*.5));
    };
    const tick=time=>{
      frame=0;const dt=Math.min((time-last)/1000||1/60,.034);last=time;
      if(mq.matches){current=target;velocity=0;}else{velocity+=(140*(target-current)-28*velocity)*dt;current+=velocity*dt;}
      if(Math.abs(target-current)<.0001&&Math.abs(velocity)<.0005){current=target;velocity=0;}
      draw(current);if(current!==target||velocity!==0)frame=requestAnimationFrame(tick);
    };
    const measure=(snap=false)=>{
      if(!ref.current)return;if(!bounds)readBounds();target=clamp((scrollY-bounds.top)/Math.max(1,bounds.height-innerHeight));
      if(snap||Math.abs(scrollY-previousScroll)>innerHeight*.6){current=target;velocity=0;draw(current);}
      previousScroll=scrollY;if(!frame){last=performance.now();frame=requestAnimationFrame(tick);}
    };
    const onScroll=()=>measure();const onResize=()=>{readBounds();measure(true);};
    const layoutObserver=new ResizeObserver(()=>{readBounds();measure();});layoutObserver.observe(document.querySelector('main'));
    readBounds();
    measure(true);window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onResize);mq.addEventListener('change',onResize);
    return()=>{layoutObserver.disconnect();cancelAnimationFrame(frame);window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onResize);mq.removeEventListener('change',onResize);document.documentElement.removeAttribute('data-stage-dark');};
  },[]);
  const wearing=mode!=='hand';
  return <section className="phone-story centered-phone-story" id="intro" ref={ref} aria-label="手机随滚动旋转、悬挂与收入口袋"><div className={'phone-sticky mode-'+mode} ref={scene}>
    <div className="phone-stage"><div className="phone-assembly"><div className="phone-body"><div className="phone-speaker"/><div className="phone-screen"><div className="phone-screen-dark"/><div className="phone-pattern-layer" aria-hidden="true">{showPattern&&<Suspense fallback={null}><PatternWaves preset="silk" color="#ffffff" backgroundColor="#120f17" fade="edges" interactive cursorSize={50} cursorStrength={0.6} pattern="dot" wave="silk" spacing={9} markSize={0.95} depth={0.95} light={0} shine={0.8} contrast={1.2} speed={0.35} scale={1} direction={20} opacity={1} fadeSize={0.5} characters=".:-=+*%@" intro/></Suspense>}</div>
      <div className="phone-screen-label"><span>9:41</span><span className="phone-status-icons"><Signal size={12}/><Battery size={17}/></span></div>
      <button className="phone-swing" onClick={()=>setSwing(n=>n+1)} tabIndex={wearing?-1:0} aria-hidden={wearing} aria-label="轻摇手机卡片"><Smartphone size={10}/>Swing</button>
      <div className="phone-card-window" onClickCapture={e=>{if(swiped.current){e.preventDefault();e.stopPropagation();swiped.current=false;}}} onPointerDown={e=>{if(wearing)return;swiped.current=false;gesture.current=e.clientX;}} onPointerUp={e=>{if(gesture.current!==null){const dx=e.clientX-gesture.current;swiped.current=Math.abs(dx)>12;if(Math.abs(dx)>30)setActive(n=>clamp(n+(dx<0?1:-1),0,2));}gesture.current=null;}} onPointerCancel={()=>{gesture.current=null;}}>
        <div className="phone-card-track"><div className={'phone-cards-motion '+(swing?'is-swinging':'')} key={swing}><div className="phone-inner-lanyard" aria-hidden="true"><div className="inner-ribbon-tip"/></div>{cards.map((label,i)=><div className={'phone-preview-card '+(active===i?'is-active':'')} style={{'--card-offset':i-active}} key={label} onClick={e=>{if(!wearing&&!e.target.closest('button,a'))setActive(i);}} onKeyDown={e=>{if(e.target===e.currentTarget&&(e.key==='Enter'||e.key===' ')){e.preventDefault();setActive(i);}}} tabIndex={!wearing&&active===i?0:-1} role="group" aria-hidden={wearing&&active!==i} aria-label={label+(active===i?'，当前卡片':'')} inert={wearing&&active!==i}>
          {i===1 ? <img className="phone-personal-art" loading="lazy" decoding="async" src={withBase('/assets/phone/personal-card-web.webp')} alt="张紫晴，体验设计 / UI设计" draggable="false"/> : <ProfileCard name="" title="" handle="ziqing" status="欢迎交流" contactText="联系我" avatarUrl={withBase(['/assets/phone/reading-card-web.webp','','/assets/phone/flarewild-card-web.webp'][i])} contactTabIndex={active===i?0:-1} holo={0.8} glare={0.5} tiltStrength={12} parallax={8} radius={16} enableTilt={!wearing} intro={false} showUserInfo={false} enableMobileTilt={false} theme="dark" onContactClick={()=>{document.getElementById('contact')?.scrollIntoView({behavior:reduceMotion()?'instant':'smooth'});}}/>}
        </div>)}</div></div>
      </div>
      <div className="phone-pagination" aria-label="手机卡片切换" inert={wearing} aria-hidden={wearing}>{cards.map((label,i)=><button key={label} className={active===i?'current':''} aria-label={'切换到'+label} aria-pressed={active===i} onClick={()=>setActive(i)}/>)}</div><span className="phone-screen-footer">ZIQING ZHANG · PORTFOLIO</span>
    </div></div><div className="phone-lanyard" aria-hidden="true"><div className="lanyard-ribbon"/><div className="lanyard-clip"/></div></div></div>
    <div className="phone-pocket" aria-hidden="true"><div className="pocket-seam"/></div>
    {captions.map(([title,body],i)=><div className={'story-heading story-chapter-'+i+(chapter===i?' is-current':'')} key={title} aria-hidden={chapter!==i}><MotionTitle>{title}</MotionTitle><p>{body}</p></div>)}
  </div></section>;
}

function Gallery({ navigate }) {
  const cards=[...projects,{id:'explorations',number:'03',name:'更多探索',category:'设计实验 · 创意探索',title:'新的想法，慢慢展开。',summary:'新的想法，慢慢展开。项目素材将在这里陆续更新。',contribution:'探索交互、视觉与有趣的表达方式。',tags:['设计探索']}];
  const [selected,setSelected]=useState(0),[flipped,setFlipped]=useState([false,false,false]);
  const [scale,setScale]=useState(1.08),[dragOffset,setDragOffset]=useState(0),[dragging,setDragging]=useState(false);
  const gallery=useRef(null),gesture=useRef(null),dragged=useRef(false),dragFrame=useRef(0);
  useEffect(()=>{
    const observer=new ResizeObserver(([entry])=>setScale(clamp(entry.contentRect.width/520,.66,1.08)));
    observer.observe(gallery.current);
    return()=>{observer.disconnect();cancelAnimationFrame(dragFrame.current);};
  },[]);
  const spacing=314.8*scale;
  const wrap=i=>(i%cards.length+cards.length)%cards.length;
  const select=i=>{setSelected(wrap(i));setFlipped([false,false,false]);};
  const flip=i=>{
    const next=!flipped[i];
    setFlipped(f=>f.map((v,j)=>j===i?next:v));
    requestAnimationFrame(()=>document.querySelector('.slot-'+i+' .'+(next?'project-back':'project-front')+' button')?.focus({preventScroll:true}));
  };
  const resetDrag=()=>{cancelAnimationFrame(dragFrame.current);setDragOffset(0);setDragging(false);gesture.current=null;};
  const endGesture=e=>{
    const start=gesture.current;if(!start)return;
    const dx=e.clientX-start.x,dy=e.clientY-start.y;
    dragged.current=start.dragging;
    if(start.dragging&&Math.abs(dx)>Math.abs(dy)*1.4&&(Math.abs(dx)>.3*spacing||Math.abs(dx/Math.max(1,performance.now()-start.time))>.5))select(selected+(dx<0?1:-1));
    if(gallery.current?.hasPointerCapture(e.pointerId))gallery.current.releasePointerCapture(e.pointerId);
    resetDrag();
  };
  const open=(event,id)=>{event.stopPropagation();if(dragged.current){event.preventDefault();return;}if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();navigate(casePath(id));};
  return <section id="work" className="work-section reference-work">
    <div className="gallery-ambient" aria-hidden="true" key={selected}/>
    <div className="section-heading"><p className="eyebrow">SELECTED WORK &amp; EXPLORATIONS</p><MotionTitle>Selected work.<br/>&amp; explorations.</MotionTitle><p>理解用户行为与业务目标，<br/>把观察转化为具体的交互与视觉方案。</p></div>
    <div ref={gallery} className={'gallery'+(dragging?' is-dragging':'')} style={{'--badge-scale':scale,'--card-w':320*scale+'px','--card-h':505*scale+'px','--card-radius':24*scale+'px'}} role="region" aria-roledescription="轮播" aria-label="精选项目画廊，可用左右方向键切换" tabIndex={0}
      onKeyDown={e=>{if(e.target!==e.currentTarget)return;if(e.key==='ArrowRight'){e.preventDefault();select(selected+1);}if(e.key==='ArrowLeft'){e.preventDefault();select(selected-1);}}}
      onPointerDown={e=>{if(e.pointerType==='mouse'&&e.button!==0)return;dragged.current=false;if(e.target.closest('button,a'))return;gesture.current={x:e.clientX,y:e.clientY,time:performance.now(),dragging:false};}}
      onPointerMove={e=>{const start=gesture.current;if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;if(!start.dragging&&Math.abs(dx)>6&&Math.abs(dx)>Math.abs(dy)*1.4){start.dragging=true;setDragging(true);gallery.current.setPointerCapture(e.pointerId);}if(start.dragging){cancelAnimationFrame(dragFrame.current);dragFrame.current=requestAnimationFrame(()=>setDragOffset(clamp(dx,-spacing,spacing)));}}}
      onPointerUp={endGesture} onPointerCancel={()=>{dragged.current=true;resetDrag();}}
      onLostPointerCapture={e=>{if(e.target===e.currentTarget&&gesture.current)resetDrag();}}>
      <div className="gallery-track">{cards.map((p,i)=>{
        const position=(((i-selected+cards.length+1)%cards.length)-1)+dragOffset/spacing, distance=Math.min(Math.abs(position),1);
        const opacity=1-.25*distance;
        const transform='perspective('+1100*scale+'px) translateX('+position*spacing+'px) rotateY('+-14*clamp(position,-1,1)+'deg) scale('+(1-.12*distance)+')';
        return <article key={p.id} className={'project-slot '+(i===selected?'selected':'adjacent')+' slot-'+i} style={{transform,opacity,zIndex:10-Math.round(2*Math.abs(position))}} aria-label={p.name+(i===selected?'，当前项目':'')} inert={Math.abs(position)>=1.99} aria-hidden={Math.abs(position)>=1.99} onClick={e=>{if(dragged.current||e.target.closest('button,a'))return;if(i!==selected)select(i);}}>
          <div className="project-arrival"><GalleryTilt disabled={dragging}><div className={'project-card '+(flipped[i]?'is-flipped':'')}>
            <div className="project-face project-front" inert={flipped[i]} aria-hidden={flipped[i]}>
              <div className="project-cover">{i===0?<PeanutArt/>:i===1?<MapArt/>:<ProjectMedia src={explorationCovers.more} alt="更多探索 · 项目封面"/>}</div><i className="project-badge-slot"/>
              <div className="project-card-copy"><h3>{p.name}</h3><p>{p.category}</p><div className="gallery-card-actions">
                <button className="card-flip" onClick={e=>{e.stopPropagation();if(dragged.current)return;if(i!==selected){select(i);return;}flip(i);}} aria-label={'翻面查看'+p.name+'速览'}><RotateCw size={16}/></button>
                <a className="gallery-case-link" href={p.id==='explorations'?'#explorations':withBase(casePath(p.id))} onClick={e=>{if(p.id==='explorations'){e.stopPropagation();if(dragged.current)e.preventDefault();}else open(e,p.id);}}>{p.id==='explorations'?'查看探索':'查看案例'}<ArrowUpRight size={14}/></a>
              </div></div>
            </div>
            <div className="project-face project-back" inert={!flipped[i]} aria-hidden={!flipped[i]}><span className="tiny-code">PROJECT {p.number} / AT A GLANCE</span><h3>{p.name}</h3><p className="back-summary">{p.summary}</p><div className="back-contribution"><span>我的贡献</span><p>{p.contribution}</p></div><div className="project-tags">{(p.tags||[]).map(t=><span key={t}>{t}</span>)}</div><button className="card-flip" onClick={e=>{e.stopPropagation();flip(i);}} aria-label={'返回'+p.name+'正面'}><RotateCw size={16}/></button></div>
          </div></GalleryTilt></div>
        </article>;
      })}</div>
    </div>
    <div className="gallery-pagination" aria-label="选择项目">{cards.map((p,i)=><button key={p.id} className={selected===i?'is-current':''} aria-label={'切换到'+p.name} aria-pressed={selected===i} onClick={()=>select(i)}><span/></button>)}</div>
    <p className="gallery-caption" aria-live="polite">{cards[selected].title}</p>
  </section>;
}

function VideoSlot() {
  return <div className="video-placeholder"><ProjectMedia src={media.flarewild.video} poster={media.flarewild.poster} alt="FlareWild · 互动视频" video/></div>;
}

function MotionSpotlight() {
  const screen = useRef(null);
  const videos = useRef([]);
  const [nearby, setNearby] = useState(false);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(-1);
  const [buffering, setBuffering] = useState(false);
  const [failed, setFailed] = useState(false);
  const next = (active + 1) % motionClips.length;
  const select = delta => {
    setFailed(false);
    setActive(index => (index + delta + motionClips.length) % motionClips.length);
  };

  useEffect(() => {
    const frame = screen.current;
    const warmup = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setNearby(true);
      warmup.disconnect();
    }, { rootMargin: '1300px 0px' });
    const playback = new IntersectionObserver(([entry]) => setVisible(entry.intersectionRatio >= .3), { threshold: .3 });
    warmup.observe(frame);
    playback.observe(frame);
    return () => { warmup.disconnect(); playback.disconnect(); };
  }, []);

  useEffect(() => {
    const video = videos.current[active];
    if (!visible || !video || reduceMotion()) return;
    if (video.ended) video.currentTime = 0;
    if (video.readyState < 3) setBuffering(true);
    video.play().catch(error => {
      if (error.name !== 'AbortError') { setBuffering(false); setFailed(true); }
    });
    return () => video.pause();
  }, [active, visible]);

  // Keep the last frame visible until the next video presents its first frame.
  const reveal = (video, index) => {
    const show = () => {
      if (video.paused) return;
      setShown(index);
      setBuffering(false);
    };
    if (shown !== index && video.requestVideoFrameCallback) video.requestVideoFrameCallback(show);
    else show();
  };

  return <section id="motion" className="motion-section reference-motion" aria-labelledby="motion-title"><div className="motion-heading"><p className="eyebrow">MOTION DESIGN</p><MotionTitle id="motion-title">FlareWild <span className="motion-title-muted">道具互动</span></MotionTitle><p>用道具创造互动，用动效回应参与。<br/>从拾取、使用到反馈，让每一次互动都被感知。</p></div>
    <div className="motion-device-wrap" role="region" aria-label="FlareWild 动效视频，可用左右方向键切换" tabIndex={0} onKeyDown={event => { if (event.key === 'ArrowLeft') { event.preventDefault(); select(-1); } if (event.key === 'ArrowRight') { event.preventDefault(); select(1); } }}>
      <button type="button" className="motion-video-prev icon-button" onClick={() => select(-1)} aria-label="上一个动效视频"><ChevronLeft/></button>
      <div className="motion-iphone" data-device="iphone-18-pro"><i className="device-volume" aria-hidden="true"/><i className="device-power" aria-hidden="true"/>
        <div className="motion-iphone-screen" ref={screen}>
          <div className="motion-video-slide">
            {motionClips[0]?.poster && <img className="motion-video-poster" src={motionClips[0].poster} alt="" loading="lazy"/>}
            {motionClips.map((clip, index) => <video key={clip.id} ref={el => { videos.current[index] = el; }}
              className={shown === index ? 'is-shown' : ''} src={clip.src} muted playsInline disablePictureInPicture
              preload={nearby && (index === active || index === next) ? 'auto' : 'none'}
              aria-hidden={shown !== index} aria-label={clip.title}
              onPlaying={event => { if (active === index) reveal(event.currentTarget, index); }}
              onWaiting={() => { if (active === index) setBuffering(true); }}
              onEnded={() => { if (active === index) { setBuffering(false); setActive(next); } }}
              onError={() => { if (active === index) { setBuffering(false); setFailed(true); } }}/>) }
          </div>
          {visible && buffering && !failed && <span className="motion-video-spinner" role="status" aria-label="正在加载视频"/>}
          <i className="device-home-indicator" aria-hidden="true"/>
        </div>
      </div>
      <button type="button" className="motion-video-next icon-button" onClick={() => select(1)} aria-label="下一个动效视频"><ChevronRight/></button>
      <div className="motion-video-pagination" aria-live="polite"><span>{String(active + 1).padStart(2, '0')} <i>/ {String(motionClips.length).padStart(2, '0')}</i></span><p>{motionClips[active]?.title}</p></div>
    </div><p className="motion-footnote">从互动玩法到视觉反馈，<br/>探索动效如何成为体验的一部分。</p></section>;
}

function Explorations({ openPreview }) {
  return <section id="explorations" className="explorations-section"><div className="explore-heading"><div><p className="eyebrow">OFF THE MAIN PATH</p><MotionTitle>Beyond the screen.</MotionTitle></div><span>一些在界面之外，<br/>也在体验之中的探索。</span></div><div className="explorations-grid">{explorations.map((p,i)=>{const content=<><div className="exploration-image"><GalleryTilt><ProjectMedia src={p.image} alt={p.name+' · 项目封面'}/></GalleryTilt></div><div className="exploration-info"><span className="tiny-code">0{i+1} / {p.english}</span><h3>{p.name}<ArrowUpRight size={23}/></h3><p>{p.text}</p><span className="exploration-tags">{p.tags}</span></div></>;return p.href?<a className={'exploration-card '+p.tone} key={p.name} href={p.href} target="_blank" rel="noreferrer" aria-label={'打开'+p.name+'网站'}>{content}</a>:<button className={'exploration-card '+p.tone} key={p.name} onClick={()=>openPreview(p)} aria-label={'查看'+p.name+'项目简介'}>{content}</button>;})}</div></section>;
}

function About({ copy }) {
  const asset=name=>withBase('/assets/about/'+name+'.webp');
  const experience=[
    {start:['2025','06'],end:['2026','03'],company:'上海慧力信息技术有限公司',body:'参与小花生亲子阅读教育平台AI全链路的体验升级，围绕核心问题，完成用户研究、需求洞察、核心流程及高保真设计。项目中熟练使用 Figma 进行交互与视觉设计，并结合生成式 AI 完成多方案探索，通过 Codex快速搭建可交互Demo，形成AI工作流，提升方案探索与验证效率。'},
    {start:['2026','03'],end:['2026','09'],company:'无锡旋涡动力Vortex Force',body:'参与 FlareWild 海外地图社交 App 从 0 到 1 设计，核心产出涵盖地图社交、虚拟互动道具及商业化功能，完成 50+ 低保真原型与 30+ 高保真页面。积累 C 端社交产品交互、信息架构及海外用户体验设计能力，并参与 AI 内容冷启动实验，提升对社区增长与 AI 辅助设计的理解。'},
  ];
  return <section id="about" className="about-section about-editorial" aria-label="关于张紫晴">
    <div className="about-wordmark" aria-hidden="true"><img src={asset('wordmark-web')} width={3615} height={447} alt="" loading="lazy" decoding="async"/></div>
    <div className="about-editorial-content">
      <div className="about-profile">
        <h2 className="about-identity"><img src={asset('identity')} width={869} height={442} alt="张紫晴 Zoey · 江南大学 设计研究生" loading="lazy"/></h2>
        <div className="about-portrait"><img src={asset('portrait-web')} width={706} height={880} alt="张紫晴的个人照片" loading="lazy"/></div>
      </div>
      <div className="about-experience">
        <h3><img src={asset('experience')} width={666} height={79} alt="实习经历 Experience" loading="lazy"/></h3>
        <div className="about-experience-list">{experience.map(item=><article className="about-job" key={item.company}>
          <div className="about-job-dates" aria-label={item.start.join('.')+' — '+item.end.join('.')}><time><small>{item.start[0]}</small><span>{item.start[1]}</span></time><i aria-hidden="true"/><time><small>{item.end[0]}</small><span>{item.end[1]}</span></time></div>
          <div className="about-job-copy"><div className="about-job-heading"><h4>{item.company}</h4><img src={asset('product-pill')} width={310} height={162} alt="C端产品" loading="lazy"/></div><p>{item.body}</p></div>
        </article>)}</div>
      </div>
      <div className="about-editorial-footer">
        <div className="about-contact-strip">
          <button className="about-contact-action" onClick={()=>copy(profile.wechat,'微信号')} aria-label="复制微信号"><img src={asset('wechat')} width={780} height={92} alt="WeChat:z13673185526" loading="lazy"/></button>
          <a className="about-contact-action" href={'mailto:'+profile.email} aria-label="发送邮件"><img src={asset('email')} width={916} height={92} alt="E-mail:3551194747@qq.com" loading="lazy"/></a>
        </div>
        <div className="about-skills">{[['motion','动效设计','motion'],['ai','AI工作流','explorations'],['experience','体验设计','work']].map(([assetName,label,target])=><a className="about-skill-action" key={assetName} href={'#'+target} aria-label={'查看'+label}><img src={asset('skill-'+assetName)} width={471} height={264} alt={label} loading="lazy"/></a>)}</div>
      </div>
    </div>
  </section>;
}

function Contact({ copy }) {
  return <section id="contact" className="contact-section reference-contact"><ClosingBadge/><div className="contact-copy"><MotionTitle>let’s <em>talk</em> about it.</MotionTitle><p>想了解我的项目、设计过程或工作经历？<br/>欢迎联系我。</p><div className="contact-actions"><a className="button button-white" href={`mailto:${profile.email}`}>发一封邮件<ArrowUpRight size={17}/></a><a className="button button-outline" href={profile.resume} download="张紫晴-体验设计简历.pdf">下载简历<Download size={17}/></a></div><div className="contact-details"><div><span>EMAIL</span><a href={`mailto:${profile.email}`}>{profile.email}</a><button className="copy-button" onClick={()=>copy(profile.email,'邮箱')} aria-label="复制邮箱"><Copy size={14}/></button></div><div><span>WECHAT</span><button className="wechat-copy" onClick={()=>copy(profile.wechat,'微信号')}>{profile.wechat}<Copy size={14}/></button></div><div><span>PHONE</span><a href={`tel:${profile.phone}`}>{profile.phone}</a></div></div></div><footer className="site-footer"><a className="logo" href={withBase('/#top')}>zq<span>✳</span></a><span>© {new Date().getFullYear()} 张紫晴 · MADE WITH CURIOSITY.</span><a href={withBase('/#top')}>回到顶部<ArrowUpRight size={13}/></a></footer></section>;
}

function CaseImage({ src, alt, banner = false }) {
  return <img className="case-image" src={src} alt={alt} width={1600} height={900} loading={banner ? 'eager' : 'lazy'} decoding="async"/>;
}

function CaseSectionVisual({ projectId, index, title, type }) {
  if (projectId==='xiaohuasheng') return <div className="chapter-media"><CaseImage src={media.xiaohuasheng.chapters[index]} alt={title+' · 设计过程'}/></div>;
  if (projectId==='flarewild' && type==='demo') return <VideoSlot/>;
  return <div className="chapter-media"><GalleryTilt><ProjectMedia src={media[projectId]?.chapters[index]} alt={title+' · 设计过程'}/></GalleryTilt></div>;
}

function CasePage({project,navigate}) {
  const other=projects.find(p=>p.id!==project.id);
  return <main className={`case-page case-${project.id}`} id="main-content" tabIndex={-1}><div id="top"/><div className="case-intro content-shell"><a className="text-link case-back" href={withBase('/#work')} onClick={e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();navigate('/','work');}}><ArrowLeft size={16}/>返回精选项目</a><p className="eyebrow">{project.category} / {project.time}</p><h1>{project.title}</h1><p className="case-subtitle">{project.subtitle}</p><div className="case-facts"><div><span>PROJECT</span><strong>{project.name}</strong></div><div><span>ROLE</span><strong>{project.role}</strong></div><div><span>TEAM</span><strong>{project.company}</strong></div></div></div><div className="case-banner">{project.id==='xiaohuasheng'?<CaseImage src={media.xiaohuasheng.caseBanner} alt="小花生亲子阅读教育平台项目总览" banner/>:<MapArt/>}</div><div className="case-body content-shell"><aside className="case-sidebar"><span className="tiny-code">IN THIS CASE</span>{project.sections.map((s,i)=><a href={`#chapter-${i}`} key={s.label}><span>0{i+1}</span>{s.title}</a>)}<a href={profile.resume} download="张紫晴-体验设计简历.pdf" className="sidebar-resume">下载简历<Download size={13}/></a></aside><div className="case-chapters"><div className="case-overview"><span className="eyebrow">MY PART IN THE STORY</span><h2>我在其中做了什么</h2><p>{project.contribution}</p><div className="status-note"><Check size={16}/><span>{project.status}</span></div></div>{project.sections.map((s,i)=><section className="case-chapter" id={`chapter-${i}`} key={s.label}><span className="eyebrow">{s.label}</span><h2>{s.title}</h2><p>{s.body}</p>{s.insight&&<blockquote>{s.insight}</blockquote>}<CaseSectionVisual projectId={project.id} index={i} title={s.title} type={s.type}/></section>)}</div></div><section className="next-case content-shell"><span className="eyebrow">KEEP EXPLORING</span><a href={withBase(casePath(other.id))} onClick={e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();navigate(casePath(other.id));}}><div><span>下一个连接</span><h2>{other.name}</h2><p>{other.title}</p></div><ArrowUpRight size={50}/></a></section><div className="case-footer content-shell"><a href={withBase('/#contact')} className="text-link" onClick={e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();navigate('/','contact');}}>聊聊设计<ArrowUpRight size={16}/></a><span>张紫晴 / EXPERIENCE & UI DESIGN</span></div></main>;
}

function PreviewDialog({preview,onClose}) {
  const dialog=useRef(null);
  useEffect(()=>{if(!preview)return;const el=dialog.current;const trigger=document.activeElement;el.showModal();document.body.style.overflow='hidden';return()=>{document.body.style.overflow='';trigger?.focus();};},[preview]);
  if(!preview)return null;
  return <dialog ref={dialog} className="preview-dialog" onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose();}} aria-labelledby="preview-title"><button className="preview-close icon-button" onClick={onClose} aria-label="关闭预览"><X/></button><div className="preview-content"><span className="eyebrow">A LITTLE EXPLORATION</span><h2 id="preview-title">{preview.name}</h2><p>{preview.text}</p><ProjectMedia src={preview.image} alt={preview.name+" · 项目素材"}/><span className="tiny-code">项目简介 · {preview.tags}</span></div></dialog>;
}

function NotFound({navigate}) {return <main className="not-found content-shell" id="main-content" tabIndex={-1}><p className="eyebrow">404 / OFF THE MAP</p><h1>这个连接，<br/>还没有发生。</h1><a className="button button-dark" href={withBase('/')} onClick={e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();navigate('/');}}>回到首页<ArrowRight size={18}/></a></main>;}

function App(){
  const [path,setPath]=useState(routePath(window.location.pathname)),[preview,setPreview]=useState(null),[toast,setToast]=useState(null);
  const timer=useRef(null);
  const restore=(anchor,top=0,focus=false)=>requestAnimationFrame(()=>requestAnimationFrame(()=>{
    if(focus)document.getElementById('main-content')?.focus({preventScroll:true});
    const target=anchor&&document.getElementById(anchor);
    if(target)target.scrollIntoView({behavior:'instant'});else window.scrollTo({top,behavior:'instant'});
  }));
  const navigate=(next,anchor)=>{
    if(next===path&&!anchor){window.scrollTo({top:0,behavior:reduceMotion()?'instant':'smooth'});return;}
    window.history.replaceState({...window.history.state,scrollY:window.scrollY},'');
    window.history.pushState({page:next},'',withBase(next)+(anchor?'#'+anchor:''));
    if(next===path&&anchor){document.getElementById(anchor)?.scrollIntoView({behavior:reduceMotion()?'instant':'smooth'});return;}
    setPath(next);setPreview(null);
    restore(anchor,0,true);
  };
  useEffect(()=>{
    const previous=window.history.scrollRestoration;
    window.history.scrollRestoration='manual';
    const pop=()=>{
      const p=routePath(location.pathname);
      setPath(p);setPreview(null);
      const y=window.history.state?.scrollY;
      restore(typeof y==='number'?null:decodeURIComponent(location.hash.slice(1)),typeof y==='number'?y:0);
    };
    if(location.hash)restore(decodeURIComponent(location.hash.slice(1)));
    window.addEventListener('popstate',pop);
    return()=>{window.removeEventListener('popstate',pop);window.history.scrollRestoration=previous;};
  },[]);
  useEffect(()=>{
    const followAnchor=event=>{
      if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
      const link=event.target.closest('a[href]');if(!link||link.target||link.hasAttribute('download'))return;
      const url=new URL(link.href,location.href);
      if(url.origin!==location.origin||url.pathname!==location.pathname||url.search!==location.search||!url.hash)return;
      const target=document.getElementById(decodeURIComponent(url.hash.slice(1)));if(!target)return;
      event.preventDefault();
      history.replaceState({...history.state,scrollY},'');
      history.pushState({},'',url.pathname+url.search+url.hash);
      target.scrollIntoView({behavior:reduceMotion()?'instant':'smooth'});
      if(target.id==='main-content')target.focus({preventScroll:true});
    };
    document.addEventListener('click',followAnchor);
    return()=>document.removeEventListener('click',followAnchor);
  },[]);
  useEffect(()=>{const p=projects.find(p=>casePath(p.id)===path);document.title=p?p.name+' — 张紫晴的设计案例':path==='/'?'张紫晴 — 体验设计 / UI 设计':'页面未找到 — 张紫晴';},[path]);
  useEffect(()=>()=>clearTimeout(timer.current),[]);
  const copy=async(value,label)=>{clearTimeout(timer.current);try{await navigator.clipboard.writeText(value);setToast(`${label}已复制`);}catch{setToast(`请手动复制${label}：${value}`);}timer.current=setTimeout(()=>setToast(null),4200);};
  usePortfolioMotion(path);
  const project=projects.find(p=>casePath(p.id)===path);
  return <><a className="skip-link" href="#main-content">跳到主要内容</a><Header navigate={navigate} isCase={path!=='/'}/>{path==='/'?<main id="main-content" tabIndex={-1}><div id="top"/><Hero/><PhoneStory/><About copy={copy}/><Gallery navigate={navigate}/><MotionSpotlight/><Explorations openPreview={setPreview}/><Contact copy={copy}/></main>:project?<CasePage key={project.id} project={project} navigate={navigate}/>:<NotFound navigate={navigate}/>}<PreviewDialog preview={preview} onClose={()=>setPreview(null)}/>{toast&&<div className="toast" role="status"><Check size={16}/>{toast}</div>}</>;
}

createRoot(document.getElementById('root')).render(<App/>);
