import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import App from './App'
import Ueba from './pages/Ueba'
import Landing from './pages/Landing'
import './theme.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <header className="nav">
      <div className="container nav-inner">
        <div className="brand"><Link className="nav-link brand-link" to="/" style={{padding:0,border:'none'}}><span className="name reveal-ltr">Predictive Maintenance</span></Link></div>
        <nav className="nav-links">
          <Link className="nav-link" to="/">Home</Link>
          <Link className="nav-link" to="/dashboard">Dashboard</Link>
          <Link className="nav-link" to="/ueba">UEBA</Link>
        </nav>
      </div>
    </header>
    <Routes>
      <Route path="/" element={<Landing/>} />
      <Route path="/dashboard" element={<App/>} />
      <Route path="/ueba" element={<Ueba/>} />
    </Routes>
  </BrowserRouter>
)
