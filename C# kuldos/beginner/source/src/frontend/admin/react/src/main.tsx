import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <main>
      <h1>Adminisztrátori kezdőoldal</h1>
    </main>
  </StrictMode>,
);
