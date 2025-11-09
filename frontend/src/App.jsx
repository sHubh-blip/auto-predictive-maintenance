import React, { useEffect, useState } from 'react'
import { listVehicles, orchestrate, listCenters, listSlots, bookSlot, getInsights } from './services/api'

export default function App(){
  const [vehicles, setVehicles] = useState([])
  const [selected, setSelected] = useState(null)
  const [result, setResult] = useState(null)
  const [centers, setCenters] = useState([])
  const [slots, setSlots] = useState([])
  const [insights, setInsights] = useState([])

  useEffect(() => { (async () => {
    const v = await listVehicles(); setVehicles(v)
    const c = await listCenters(); setCenters(c)
    const ins = await getInsights(); setInsights(ins.insights || [])
  })() }, [])

  async function run(vehicle){
    setSelected(vehicle)
    const r = await orchestrate(vehicle._id)
    setResult(r)
    if (centers[0]){
      const s = await listSlots(centers[0]._id)
      setSlots(s)
    }
    // simple TTS demo
    if (window.speechSynthesis && r?.conversation?.transcript){
      const utter = new SpeechSynthesisUtterance(r.conversation.transcript)
      speechSynthesis.speak(utter)
    }
  }

  async function book(vehicleId){
    if (!centers[0] || !slots[0]) return alert('No available slots')
    const appt = await bookSlot({ vehicleId, centerId: centers[0]._id, start: slots[0].start })
    alert('Booked appointment: '+ new Date(appt.slotStart).toLocaleString() + ' at center '+ centers[0].name)
  }

  return (
    <main className="container">
      <h2 className="page-title">Dashboard</h2>
      <div className="grid grid-2">
        <div>
          <section className="card">
            <div className="section-title">Vehicles</div>
            <table className="table">
              <thead>
                <tr><th>Owner</th><th>VIN</th><th>Mileage</th><th>Action</th></tr>
              </thead>
              <tbody>
                {vehicles.map(v => (
                  <tr key={v._id}>
                    <td>{v.ownerName}</td>
                    <td>{v.vin}</td>
                    <td>{v.mileageKm}</td>
                    <td><button className="btn btn-primary" onClick={()=>run(v)}>Run Predict + Engage</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="card">
            <div className="section-title">Manufacturing CAPA/RCA Insights</div>
            <ul className="list">
              {insights.map((x,i)=> (
                <li key={i}><b>{x.component}</b>: {x.root_cause} — CA: {x.corrective_action}; PA: {x.preventive_action} <span className="muted">(recurrence {x.total_recurrence})</span></li>
              ))}
            </ul>
          </section>
        </div>

        <section className="card">
          <div className="section-title">Result</div>
          {result ? (
            <div>
              <p className="kv"><span className="label">Prediction</span> <span className={`badge ${result.prediction.severity}`}>{result.prediction.severity}</span> &nbsp; {result.prediction.component} — {(result.prediction.probability*100).toFixed(0)}%</p>
              <p><span className="label">Script</span><br/>{result.conversation.transcript}</p>
              <div style={{marginTop:12, display:'flex', gap:12}}>
                <button className="btn btn-primary" onClick={()=>book(selected._id)}>Accept & Book First Available</button>
              </div>
              <h4 style={{marginTop:16}}>Available Slots <span className="muted">(Center: {centers[0]?.name||'-'})</span></h4>
              <ul className="list">
                {slots.map((s,i)=> <li key={i}>{new Date(s.start).toLocaleString()} — {new Date(s.end).toLocaleString()}</li>)}
              </ul>
            </div>
          ) : <p className="muted">Select a vehicle and run the flow.</p>}
        </section>
      </div>
    </main>
  )
}
