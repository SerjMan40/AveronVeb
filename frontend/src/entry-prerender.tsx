import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { App } from './app/App'

export function renderPage(path: string) {
  return renderToString(
    <div id="root">
      <StrictMode>
        <StaticRouter location={path}><App /></StaticRouter>
      </StrictMode>
    </div>,
  )
}
