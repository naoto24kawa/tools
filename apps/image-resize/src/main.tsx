import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';
import 'react-image-crop/dist/ReactCrop.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found. Make sure your HTML contains an element with id="root"');
}

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
