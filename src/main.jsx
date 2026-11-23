import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Start React and let it draw <App> into the empty div in index.html.
// StrictMode only acts during development: it runs some code twice on purpose
// to reveal mistakes early. (You may see books.json being loaded twice.)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
