import { createRoot } from 'react-dom/client';
import './styles.css';

function App() {
  return <main><h1>Farmily</h1><p>Prototype is ready.</p></main>;
}

createRoot(document.getElementById('root')!).render(<App />);
