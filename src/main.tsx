import { createRoot } from 'react-dom/client';
import { StoryBook } from './sections/StoryBook';
import './style.css';
import { RallyHeroSection } from './sections/RallyHeroSection';
import { BadmintonStorySection } from './sections/BadmintonStorySection';

const rallyPreview = new URLSearchParams(window.location.search).get("preview") === "rally";
createRoot(document.getElementById('root')!).render(rallyPreview ? <main><RallyHeroSection preview /><BadmintonStorySection /></main> : <main className="storybook-preview"><StoryBook /></main>);
