import React, { useState } from 'react'

const DOCS = [
  {
    label: 'electron-tsdown',
    href: 'https://github.com/Kiyozz/electron-tsdown',
  },
  { label: 'Electron', href: 'https://www.electronjs.org/docs/latest' },
  { label: 'React', href: 'https://react.dev?uwu=true' },
  { label: 'Vite', href: 'https://vitejs.dev' },
]

const BADGES = [
  { label: 'Electron', color: 'oklch(55% 0.07 210)' },
  { label: 'React', color: 'oklch(87% 0.14 210)' },
  { label: 'Vite', color: 'oklch(55% 0.22 270)' },
]

export function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="root">
      <div className="card">
        <header className="header">
          <span className="logo">⚡</span>
          <h1 className="title">electron-tsdown</h1>
          <p className="tagline">Electron + React + Vite, zero config</p>
        </header>

        <div className="badges">
          {BADGES.map((b) => (
            <span
              key={b.label}
              className="badge"
              style={{ '--badge-color': b.color }}
            >
              {b.label}
            </span>
          ))}
        </div>

        <div className="counter">
          <button className="btn" onClick={() => setCount((c) => c - 1)}>
            −
          </button>
          <span className="count">{count}</span>
          <button className="btn" onClick={() => setCount((c) => c + 1)}>
            +
          </button>
        </div>

        <footer className="footer">
          <p className="hint">
            Edit <code>src/renderer/App.jsx</code> to get started
          </p>
          <p className="hint">
            Config lives in <code>electron-tsdown.config.js</code>
          </p>
          <nav className="links">
            {DOCS.map((d) => (
              <a key={d.label} href={d.href} target="_blank" rel="noreferrer">
                {d.label} Docs
              </a>
            ))}
          </nav>
        </footer>
      </div>
    </div>
  )
}
