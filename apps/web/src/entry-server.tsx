import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { routes } from './routes';

export { routes };

export function render(path: string) {
  return renderToString(
    <StrictMode>
      <App path={path} />
    </StrictMode>
  );
}
