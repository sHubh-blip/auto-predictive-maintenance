import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './landing.css'

export default function Landing(){
  const navigate = useNavigate()

  useEffect(()=>{
    // parallax mouse effect for the hero wheel
    const hero = document.querySelector('.hero-visual')
    function onMove(e){
      const { innerWidth:w, innerHeight:h } = window
      const rx = ((e.clientY - h/2) / h) * -6
      const ry = ((e.clientX - w/2) / w) * 10
      hero && (hero.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  },[])

  return (
    <div className="landing">
      <section className="hero container">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">Master Orchestration for Automotive After-sales</div>
            <h1 className="hero-title reveal-ltr" style={{'--delay': '0.15s'}}>Autonomous Predictive Maintenance</h1>
            <p className="hero-sub">Prevent breakdowns, boost retention, and feed quality insights back to manufacturing with our Agentic AI platform.</p>
            <div className="hero-cta">
              <button className="btn btn-primary glow" onClick={()=>navigate('/dashboard')}>Get Started</button>
              <Link className="btn" to="/ueba">View UEBA</Link>
            </div>
            <div className="stats">
              <div className="stat"><span className="stat-val">92%</span><span className="stat-label">Issue detection accuracy</span></div>
              <div className="stat"><span className="stat-val">37%</span><span className="stat-label">Downtime reduction</span></div>
              <div className="stat"><span className="stat-val">X 3</span><span className="stat-label">Customer retention</span></div>
            </div>
          </div>
          <div className="hero-art">
            <div className="hero-visual">
              <div className="car-scene" style={{'--car-image': "url('https://images.unsplash.com/photo-1542367597-8849ebcdcf1d?q=80&w=1600&auto=format&fit=crop')"}}>
                <div className="car-bg"/>
                <div className="road"/>
                <div className="speedline s1"/>
                <div className="speedline s2"/>
                <div className="speedline s3"/>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container section">
        <h3 className="section-heading">We detect failures before they happen</h3>
        <p className="section-sub">Streaming telematics + historical maintenance + CAPA/RCA form a closed loop. The Master Agent coordinates analysis, engagement, and scheduling.</p>
        <div className="features">
          <div className="feature-card tilt">
            <div className="feature-img f1"/>
            <div className="feature-copy">
              <h4>Real-time analysis</h4>
              <p>Continuously monitors sensor health to surface early warning signals.</p>
            </div>
          </div>
          <div className="feature-card tilt">
            <div className="feature-img f2"/>
            <div className="feature-copy">
              <h4>Persuasive outreach</h4>
              <p>Voice-first engagement to explain issues and convert to appointments.</p>
            </div>
          </div>
          <div className="feature-card tilt">
            <div className="feature-img f3"/>
            <div className="feature-copy">
              <h4>Autonomous scheduling</h4>
              <p>Optimizes service load by offering best-fit slots based on demand.</p>
            </div>
          </div>
          <div className="feature-card tilt">
            <div className="feature-img f4"/>
            <div className="feature-copy">
              <h4>Manufacturing insights</h4>
              <p>RCA/CAPA patterns flow back to design for continuous quality.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container section how">
        <h3 className="section-heading">How it works</h3>
        <div className="how-grid">
          <div className="how-step">
            <div className="step-num">1</div>
            <div>
              <h5>Ingest</h5>
              <p>Vehicle telemetry + history are normalized and scored by the Diagnosis Agent.</p>
            </div>
          </div>
          <div className="how-step">
            <div className="step-num">2</div>
            <div>
              <h5>Engage</h5>
              <p>Customer Agent crafts a human-like voice script explaining benefits and urgency.</p>
            </div>
          </div>
          <div className="how-step">
            <div className="step-num">3</div>
            <div>
              <h5>Schedule</h5>
              <p>Scheduling Agent proposes load-balanced slots and confirms bookings.</p>
            </div>
          </div>
          <div className="how-step">
            <div className="step-num">4</div>
            <div>
              <h5>Improve</h5>
              <p>Insights module maps recurring defects to CAPA actions for manufacturing.</p>
            </div>
          </div>
        </div>
        <div className="how-cta">
          <button className="btn btn-secondary" onClick={()=>navigate('/dashboard')}>Open Dashboard</button>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <div>© {new Date().getFullYear()} Predictive Maintenance</div>
          <div className="muted">UEBA monitored. Unauthorized actions are blocked.</div>
        </div>
      </footer>
    </div>
  )
}
