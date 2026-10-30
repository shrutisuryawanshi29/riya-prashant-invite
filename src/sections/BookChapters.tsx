import { wedding as w } from '../data';
import { moments } from '../data/moments';
import { WeddingCountdown } from '../components/WeddingCountdown';
import { CalendarControls, ShareInvitation } from '../components/GuestControls';

function ChapterHeading({ number, title, subtitle }: {number:string; title:string; subtitle?:string}) {
  return <header className="book-new-heading"><p className="book-label">{number}</p><div className="book-chapter-divider" aria-hidden="true">✦</div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</header>;
}

export function PlacesChapter() {
 const cities = [ ['Mumbai','Her beginnings','mumbai'], ['Nagpur','His beginnings','nagpur'], ['California','Their next chapter','california'] ];
 return <article className="book-new-chapter book-places"><ChapterHeading number="Chapter two" title="Three Places, One Forever" subtitle="Different cities. Shared dreams. A lifetime together."/><div className="book-city-list">{cities.map(([name, caption, image]) => <figure key={name}><img src={'/images/three-places-'+image+'.webp'} loading="lazy" width="500" height="500" alt={'Watercolor illustration of '+name}/><figcaption><h3>{name}</h3><p>{caption}</p></figcaption></figure>)}</div></article>;
}

export function MomentsChapter() {
 const [featured, first, second, third, ...more] = moments;
 return <article className="book-new-chapter book-moments scrapbook">
   <svg className="scrapbook-botanical" viewBox="0 0 80 135" aria-hidden="true" fill="none"><path d="M6 130Q23 85 57 9M17 98Q3 87 8 74Q24 79 22 90M28 76Q17 62 24 51Q38 59 33 68M38 55Q31 41 39 30Q49 39 44 47M49 33Q45 20 54 12Q61 20 55 28" stroke="currentColor" strokeWidth="1.2"/><circle cx="57" cy="9" r="3" fill="currentColor"/><circle cx="25" cy="51" r="2.5" fill="currentColor"/><circle cx="8" cy="74" r="2.5" fill="currentColor"/></svg>
   <ChapterHeading number="Chapter three" title="Our Moments" subtitle="A few frames from our story."/>
   <div className="scrapbook-composition">
     <figure className="scrapbook-featured"><div className="scrapbook-paper"><img src={featured.src} alt={featured.alt} width={featured.width} height={featured.height} decoding="async" /></div><figcaption className="scrapbook-note">Some moments say everything without a word.<span aria-hidden="true"> ♡</span></figcaption></figure>
     <div className="scrapbook-collage">
       <figure className="scrapbook-memory scrapbook-memory-a"><img src={first.src} alt={first.alt} width={first.width} height={first.height} loading="lazy" decoding="async"/><figcaption>A little moment,<br/>a lot of love. <span aria-hidden="true">♡</span></figcaption></figure>
       <figure className="scrapbook-memory scrapbook-memory-b"><img src={second.src} alt={second.alt} width={second.width} height={second.height} loading="lazy" decoding="async"/><figcaption>Different places,<br/>same us. <span aria-hidden="true">♡</span></figcaption></figure>
       <figure className="scrapbook-memory scrapbook-memory-c"><img src={third.src} alt={third.alt} width={third.width} height={third.height} loading="lazy" decoding="async"/><figcaption>A memory to hold close.</figcaption></figure>
     </div>
     <div className="scrapbook-continued" aria-label="More photographs">{more.map((photo,i)=><figure className={'scrapbook-extra scrapbook-extra-'+i} key={photo.src}><img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async"/>{i===2 && <figcaption>A little more of our story. <span aria-hidden="true">♡</span></figcaption>}</figure>)}</div>
   </div>
 </article>;
}

export function InvitationChapter() {
 return <article className="book-new-chapter book-invitation"><ChapterHeading number="Chapter four" title="Until Forever Begins" subtitle="A moment we have been waiting for"/><WeddingCountdown/><p className="book-date">3 December 2026 · 10:15 AM IST</p><p>With divine blessings and the love of our families, we joyfully invite you to celebrate our wedding.</p><details className="book-disclosure"><summary>Read Our Invitation</summary><div className="book-family"><p>{w.invocations[0]}<br/>{w.invocations[1]}</p><p>With the blessings of<br/><strong>{w.grandparents}</strong></p><p>Together with their families, we joyfully invite you to celebrate the wedding of</p><h3>{w.couple.brideFull}</h3><p>Daughter of<br/><strong>{w.parents.bride}</strong></p><h3>{w.couple.groomFull}</h3><p>Son of<br/><strong>{w.parents.groom}</strong></p></div></details></article>;
}

export function CelebrationsChapter() {
 return <article className="book-new-chapter book-celebrations"><ChapterHeading number="Chapter five" title="The Celebrations" subtitle="Five cherished occasions, one beautiful beginning."/><ol className="book-events">{w.events.map((e,i)=><li key={e.name}><p className="book-event-date">{e.date.replace(/^(\w+), (\w+) (\d+), (\d+)$/, '$1, $3 $2 $4')}</p><h3>{i===4?'Reception':e.name}</h3>{e.tagline && <p className="book-event-tagline">{e.tagline}</p>}<p>{e.time}</p>{'muhurat' in e && <p>{e.muhurat} IST</p>}{'extra' in e && <p>{e.extra}</p>}</li>)}</ol></article>;
}

export function VenuesChapter() {
 return <article className="book-new-chapter book-venues"><ChapterHeading number="Chapter six" title="Join Us" subtitle="Where our celebrations unfold"/>{w.venues.map((v,i)=><section className="book-venue" key={v.label}><p className="book-label">{v.label}</p><h3>{v.name}</h3><address>{v.lines.map(line=><span key={line}>{line}<br/></span>)}</address><p>{v.date}</p><a className="book-direction" href={'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(v.query)} target="_blank" rel="noreferrer">Get directions ↗</a><CalendarControls index={i}/></section>)}<ShareInvitation/></article>;
}

export function EpilogueChapter() {
 return <article className="book-new-chapter book-epilogue"><ChapterHeading number="Epilogue" title="Our Next Chapter" subtitle="California awaits our next chapter together."/><div className="book-epilogue-moon" aria-hidden="true">☾</div><p className="book-signature">Riya <span>&amp;</span> Prashant</p><p className="book-blessing">With Love &amp; Blessings</p><p>Kalburgi &amp; Mahant Families</p><p className="book-gifts">Presents Only in Blessings</p></article>;
}
