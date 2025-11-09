const base = ''

async function j(path, opts={}){
  const res = await fetch(base+path, { headers: { 'Content-Type': 'application/json', 'x-agent': 'UserUI' }, ...opts })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function listVehicles(){ return j('/api/vehicles') }
export async function orchestrate(vehicleId){ return j(`/api/orchestrator/predict-and-engage/${vehicleId}`, { method:'POST', headers: { 'Content-Type': 'application/json', 'x-agent': 'MasterAgent' } }) }
export async function listCenters(){ return j('/api/scheduling/centers') }
export async function listSlots(centerId){ return j(`/api/scheduling/slots?centerId=${centerId}`) }
export async function bookSlot(body){ return j('/api/scheduling/book', { method:'POST', body: JSON.stringify(body) }) }
export async function getInsights(){ return j('/api/insights') }
