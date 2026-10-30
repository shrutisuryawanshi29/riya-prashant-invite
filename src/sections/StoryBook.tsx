import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { wedding } from '../data';
import { PlacesChapter, MomentsChapter, InvitationChapter, CelebrationsChapter, VenuesChapter, EpilogueChapter } from './BookChapters';

type Page = 'cover' | 'little' | 'places' | 'moments' | 'invitation' | 'celebrations' | 'venues' | 'epilogue';
const pages: Page[] = ['cover', 'little', 'places', 'moments', 'invitation', 'celebrations', 'venues', 'epilogue'];
const labels = ['Cover', 'The Little Things', 'Three Places', 'Our Moments', 'Until Forever', 'Celebrations', 'Join Us', 'Our Next Chapter'];
function pageFromHash(): Page { const key = window.location.hash.slice(1); return pages.includes(key as Page) ? key as Page : key === 'story' || key === 'chapter' ? 'little' : 'cover'; }

function BookCover({ open }: { open: () => void }) {
  return <div className="book-cover-content">
    <div className="book-cover-heading"><p className="book-label">A story under the same moon</p><h1>{wedding.couple.bride} <span>&amp;</span><br />{wedding.couple.groom}</h1><span className="book-moon" aria-hidden="true">☾</span><p className="book-cover-subtitle">A story that started with a game<br />and turned into forever.</p><p className="book-cover-date">3 December 2026 · Nagpur</p></div>
    <div className="book-cover-photo"><div className="book-photo-mat"><img src="/images/riya-prashant-photograph.webp" width="576" height="1024" alt="Riya and Prashant together by the sea at sunset" /></div></div>
    <svg className="book-cover-trail" viewBox="0 0 400 100" fill="none" aria-hidden="true"><path d="M15 83C80 0 151 61 225 55c38-3 41-42 55-34 12 7-2 25-12 34 16 5 45 5 93-32" stroke="currentColor" strokeDasharray="3 4" strokeWidth="1.4"/><path d="M19 80l-7-12 12 5-5 7Zm-7-12-6-8 12 3 6 10" stroke="currentColor" strokeWidth="1.2"/></svg>
    <button className="book-open" onClick={open}>Open our story <span aria-hidden="true">→</span></button>
  </div>;
}

function LittleThings() {
  return <article className="book-chapter-content book-little">
    <p className="book-label">Chapter one</p><div className="book-chapter-divider" aria-hidden="true">✦</div>
    <h2>The Little<br />Things</h2><p className="little-intro">It’s the little things that make their story their own.</p>
    <div className="little-art"><img src="/images/watercolor-story-mobile.webp" alt="" width="1122" height="1402"/><svg className="little-trail" viewBox="0 0 320 390" fill="none" aria-hidden="true"><path d="M30 90C55 20 152 25 164 100S60 210 115 270 260 260 276 360" stroke="currentColor" strokeWidth="1" strokeDasharray="3 5"/></svg>
      <p className="little-note little-badminton"><strong>Badminton</strong>Where their story began.</p>
      <p className="little-note little-moon"><strong>Moon</strong>Their favorite symbol of love.</p>
      <p className="little-note little-chai"><strong>Chai</strong>The little moments they love sharing.</p>
      <p className="little-note little-music"><strong>Music</strong>The soundtrack of their togetherness.</p>
    </div>

  </article>;
}

export function StoryBook() {
  const [page, setPage] = useState<Page>(pageFromHash);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuArea = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const [transition, setTransition] = useState<{from: Page; to: Page; reverse: boolean; scrollTop: number; id: number} | null>(null);
  const turning = transition !== null;
  const timeout = useRef<number | undefined>(undefined);
  const turnLocked = useRef(false);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const scrollRegion = useRef<HTMLDivElement>(null);
  const frontSurface = useRef<HTMLDivElement>(null);
  const outgoingSnapshot = useRef<HTMLElement | null>(null);
  const transitionId = useRef(0);
  const restoreFocus = useRef(false);
  useEffect(() => {
    if (!restoreFocus.current) return;
    stage.current?.querySelector<HTMLButtonElement>(page === 'cover' ? '.book-open' : '[aria-label="Previous page"]')?.focus({ preventScroll: true });
    restoreFocus.current = false;
  }, [page]);
  useEffect(() => {
    if (!menuOpen) return;
    menuArea.current?.querySelector<HTMLButtonElement>('.chapter-menu-panel button')?.focus({preventScroll: true});
    function dismiss(event: PointerEvent) { if (!menuArea.current?.contains(event.target as Node)) setMenuOpen(false); }
    function escape(event: KeyboardEvent) { if (event.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus({preventScroll: true}); } }
    document.addEventListener('pointerdown', dismiss); document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', dismiss); document.removeEventListener('keydown', escape); };
  }, [menuOpen]);
  useEffect(() => { const sync = () => { window.clearTimeout(timeout.current); transitionId.current++; outgoingSnapshot.current = null; turnLocked.current = false; restoreFocus.current = false; setTransition(null); setPage(pageFromHash()); }; window.addEventListener('popstate', sync); window.addEventListener('hashchange', sync); return () => { window.clearTimeout(timeout.current); window.removeEventListener('popstate', sync); window.removeEventListener('hashchange', sync); }; }, []);
  useLayoutEffect(() => {
    if (!transition || !frontSurface.current || !outgoingSnapshot.current) return;
    const surface = frontSurface.current;
    surface.replaceChildren(outgoingSnapshot.current);
    const snapshotScroll = surface.querySelector<HTMLElement>('.book-page-scroll');
    if (snapshotScroll) snapshotScroll.scrollTop = transition.scrollTop;
    return () => { surface.replaceChildren(); };
  }, [transition]);
  function finishTurn(id: number, next: Page) {
    if (transitionId.current !== id || !turnLocked.current) return;
    window.clearTimeout(timeout.current);
    setPage(next); setTransition(null); outgoingSnapshot.current = null; turnLocked.current = false;
  }
  function turn(next: Page) {
    if (turnLocked.current || turning || page === next || !next) return;
    setMenuOpen(false);
    turnLocked.current = true;
    restoreFocus.current = true;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const currentPage = stage.current?.querySelector<HTMLElement>('.book-page-base');
    const scrollTop = scrollRegion.current?.scrollTop ?? 0;
    const id = ++transitionId.current;
    if (!reduceMotion && currentPage) {
      outgoingSnapshot.current = currentPage.cloneNode(true) as HTMLElement;
      outgoingSnapshot.current.classList.remove('book-page-base');
      outgoingSnapshot.current.classList.add('book-page-snapshot');
      outgoingSnapshot.current.setAttribute('aria-hidden', 'true');
      outgoingSnapshot.current.inert = true;
    }
    window.history.pushState(null, '', '#' + next);
    window.scrollTo({top: 0, behavior: 'instant'});
    if (reduceMotion || !outgoingSnapshot.current) { setPage(next); turnLocked.current = false; return; }
    setTransition({from: page, to: next, reverse: pages.indexOf(next) < pages.indexOf(page), scrollTop, id});
    timeout.current = window.setTimeout(() => finishTurn(id, next), 1050);
  }
  function swipeEnd(e: React.TouchEvent) {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) { const next = pages[pages.indexOf(page) + (dx < 0 ? 1 : -1)]; if (next) turn(next); }
  }
  const basePage = transition?.to ?? page;
  useEffect(() => { if (scrollRegion.current) scrollRegion.current.scrollTop = 0; }, [basePage, page]);
  function content(which: Page) { switch(which) { case 'cover': return <BookCover open={() => turn('little')} />; case 'little': return <LittleThings />; case 'places': return <PlacesChapter />; case 'moments': return <MomentsChapter />; case 'invitation': return <InvitationChapter />; case 'celebrations': return <CelebrationsChapter />; case 'venues': return <VenuesChapter />; case 'epilogue': return <EpilogueChapter />; } }
  const pageNumber = pages.indexOf(basePage) + 1;
  return <section className="storybook" aria-label="Our storybook">
    <nav className="book-site-nav" aria-label="Wedding navigation">{(['invitation','celebrations','venues'] as Page[]).map((target, i) => <a key={target} href={'#'+target} onClick={e => {e.preventDefault(); turn(target);}}>{['Invitation','Celebrations','Venues'][i]}</a>)}</nav>
    <div className="book-index"><label htmlFor="chapter-index">Chapter index</label><select id="chapter-index" value={page} onChange={e => turn(e.target.value as Page)} disabled={turning}>{pages.map((p,i)=><option value={p} key={p}>{labels[i]}</option>)}</select></div>
    <div ref={stage} className="book-stage" onTouchStart={e => { if ((e.target as HTMLElement).closest('button,a,summary,select,input')) { touch.current = null; return; } touch.current = {x:e.touches[0].clientX,y:e.touches[0].clientY};}} onTouchEnd={swipeEnd} onTouchCancel={() => { touch.current = null; }}>
      <div className="book-spine" aria-hidden="true" />
      <div className={"chapter-menu" + (basePage === "cover" ? " chapter-menu-cover" : "")} ref={menuArea}>
        <button ref={menuButton} className="chapter-menu-trigger" type="button" aria-label="Chapter menu" aria-expanded={menuOpen} aria-controls="mobile-chapter-menu" disabled={turning} onClick={() => setMenuOpen(open => !open)}><span aria-hidden="true">☰</span></button>
        {menuOpen && <nav className="chapter-menu-panel" id="mobile-chapter-menu" aria-label="Choose a chapter">{pages.map((item,index)=><button type="button" key={item} aria-current={item===page?'page':undefined} onClick={() => { if(item===page) { setMenuOpen(false); menuButton.current?.focus({preventScroll:true}); } else turn(item); }}>{labels[index]}</button>)}</nav>}
      </div>
      <div className="book-page book-page-base" inert={turning} aria-hidden={turning ? true : undefined}>
        <div ref={scrollRegion} className={"book-page-scroll" + (basePage === "cover" ? " book-page-scroll-cover" : "")} tabIndex={basePage === "cover" ? undefined : 0} aria-label={basePage === "cover" ? undefined : "Chapter content"}>{content(basePage)}</div>
        {basePage !== 'cover' && <div className="book-controls"><button onClick={() => turn(pages[pages.indexOf(page)-1])} disabled={turning || page === 'cover'} aria-label="Previous page">←</button><span className="book-page-number"><small>{basePage === 'epilogue' ? 'Epilogue' : `Chapter ${pageNumber-1} of 7`}</small>{String(pageNumber).padStart(2,'0')} / 08</span><button onClick={() => turn(pages[pages.indexOf(page)+1])} disabled={turning || page === 'epilogue'} aria-label="Next page">→</button></div>}
      </div>
      {transition && <div className={'book-hinge-shadow ' + (transition.reverse ? 'book-hinge-reverse' : '')} aria-hidden="true" />}
      {transition && <div className={'book-cast-shadow ' + (transition.reverse ? 'book-cast-shadow-reverse' : '')} aria-hidden="true" />}
      {transition && <div key={transition.id} className={'book-turn ' + (transition.reverse ? 'book-turn-reverse' : '')} aria-hidden="true" inert onAnimationEnd={event => { if (event.target === event.currentTarget) finishTurn(transition.id, transition.to); }}><div className="book-turn-front" ref={frontSurface}/><div className="book-turn-back" /></div>}
    </div>
    <p className="book-status" aria-live="polite">{labels[pages.indexOf(page)]} · {pages.indexOf(page)+1} of 8</p>
  </section>;
}
