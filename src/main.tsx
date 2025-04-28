
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize app with language detection
document.addEventListener('DOMContentLoaded', () => {
  // Set default language attributes for better accessibility and SEO
  document.documentElement.setAttribute('lang', 'ru');
  document.documentElement.setAttribute('dir', 'ltr');
});

createRoot(document.getElementById("root")!).render(<App />);
