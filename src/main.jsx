import { createRoot } from 'react-dom/client';
import 'lenis/dist/lenis.css';
import './styles/global.scss';
import './styles/animations.scss';
import './components/decor/decor.scss';
import App from './App';

// Always begin at the sealed envelope, never mid-page.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

createRoot(document.getElementById('root')).render(<App />);
