import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { isServerAvailable } from './healthApi';
import './styles.css';

function App() {
  const [statusMessage, setStatusMessage] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  async function checkConnection() {
    setIsChecking(true);

    try {
      const available = await isServerAvailable();
      setStatusMessage(available ? 'A szerver működik' : 'A szerver nem működik');
    } catch {
      setStatusMessage('A szerver nem működik');
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <main>
      <h1>Felhasználói kezdőoldal</h1>
      <button type="button" onClick={checkConnection} disabled={isChecking}>
        Ellenőrzés
      </button>
      <p role="status">{statusMessage}</p>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
