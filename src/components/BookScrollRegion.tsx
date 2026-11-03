import { useEffect, useRef, useState, type ReactNode } from 'react';

type Props = { children: ReactNode; cover: boolean; active: boolean; hintSeen: boolean; onFirstScroll: () => void };

export function BookScrollRegion({ children, cover, active, hintSeen, onFirstScroll }: Props) {
  const region = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState({ overflow: false, below: false, progress: 0 });

  useEffect(() => {
    const node = region.current;
    if (!node || cover) return;
    const update = () => {
      const distance = Math.max(0, node.scrollHeight - node.clientHeight);
      setMetrics({ overflow: distance > 2, below: distance - node.scrollTop > 2, progress: distance ? Math.min(1, node.scrollTop / distance) : 0 });
    };
    const onScroll = () => {
      update();
      if (active && node.scrollTop > 3) onFirstScroll();
    };
    const resize = new ResizeObserver(update);
    resize.observe(node);
    Array.from(node.children).forEach(child => resize.observe(child));
    node.addEventListener('scroll', onScroll, { passive: true });
    node.addEventListener('load', update, true);
    update();
    return () => { resize.disconnect(); node.removeEventListener('scroll', onScroll); node.removeEventListener('load', update, true); };
  }, [cover, active, onFirstScroll]);

  return <div className="book-scroll-shell">
    <div ref={region} className={'book-page-scroll' + (cover ? ' book-page-scroll-cover' : '')} tabIndex={cover ? undefined : 0} aria-label={cover ? undefined : 'Chapter content'}>{children}</div>
    {metrics.overflow && <div className="book-scroll-marker" aria-hidden="true"><span style={{ top: `${metrics.progress * 100}%` }} /></div>}
    {metrics.below && <div className="book-scroll-fade" aria-hidden="true" />}
    {active && metrics.overflow && !hintSeen && <div className="book-scroll-hint" aria-hidden="true"><span>↓</span> Swipe up to read more</div>}
  </div>;
}
