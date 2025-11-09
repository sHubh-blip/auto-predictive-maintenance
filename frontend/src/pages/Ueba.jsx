import React, { useEffect, useState } from 'react'

export default function Ueba(){
  const [events, setEvents] = useState([])

  useEffect(()=>{ (async ()=>{
    const res = await fetch('/api/ueba/events', { headers: { 'x-agent': 'UserUI' } })
    const data = await res.json()
    setEvents(data)
  })() },[])

  return (
    <main className="container">
      <h2 className="page-title">UEBA Events</h2>
      <section className="card">
        <table className="table">
          <thead>
            <tr><th>Time</th><th>Agent</th><th>Action</th><th>Resource</th><th>Outcome</th><th>Severity</th></tr>
          </thead>
          <tbody>
            {events.map(e => (
              <tr key={e._id}>
                <td>{new Date(e.createdAt).toLocaleString()}</td>
                <td>{e.agent}</td>
                <td>{e.action}</td>
                <td>{e.resource}</td>
                <td>{e.outcome}</td>
                <td><span className={`badge ${e.severity}`}>{e.severity}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  )
}
