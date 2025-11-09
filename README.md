# Automo)ve Hero + M&M — Agentic Predictive Maintenance (MERN + Python)

This is a working reference implementation you can deploy and demo for the challenge. It implements a Master Orchestrator with Worker Agents across a MERN backend and Python AI/ML microservice, a React dashboard, and a lightweight UEBA layer.

Contents
- server: Express + MongoDB (Mongoose). Master Agent orchestrator, Scheduling, UEBA, data APIs, seed script
- python: FastAPI AI/ML microservice for predictions, demand forecast, and CAPA/RCA insights
- frontend: React + Vite dashboard to demo end-to-end flow

Quick start
1) Prereqs
- Node 18+
- Python 3.9+
- MongoDB running locally at mongodb://localhost:27017 (or set MONGO_URI)

2) Install deps
- Server
  cd server
  npm i
- Python AI service
  cd ../python
  python -m venv .venv
  .venv/Scripts/activate (Windows) or source .venv/bin/activate (Mac/Linux)
  pip install -r requirements.txt
- Frontend
  cd ../frontend
  npm i

3) Configure env
- Copy server/.env.example to server/.env and adjust if needed.

4) Seed sample data
  cd server
  npm run seed

5) Run services (3 terminals)
- Python AI microservice
  cd python && .venv/Scripts/activate && uvicorn predictive_service:app --host 127.0.0.1 --port 8000 --reload
- Node backend
  cd server && npm run dev
- Frontend
  cd frontend && npm run dev

6) Demo flow
- Open the React app (Vite will print http://localhost:5173)
- Use Dashboard to:
  - View vehicles and predicted issues
  - Click "Run Predict + Engage" to simulate Master Agent calling Worker Agents
  - Review persuasive voice script, accept/decline, book an appointment
  - See UEBA alerts (abnormal agent requests or unauthorized access attempts)
  - View manufacturing CAPA/RCA insights

Services & Roles
- Master Agent (server/orchestrator route): orchestrates Worker Agents via HTTP
- Worker Agents
  - Data Analysis + Diagnosis (python /predict): predicts failures and severity
  - Scheduling Agent (server/routes/scheduling): proposes and books slots
  - Customer Engagement Agent (server/orchestrator): composes persuasive script
  - Feedback Agent (server/routes/feedback placeholder) + UI actions
  - Manufacturing Insights (python /insights)
- UEBA: server/src/ueba/* — middleware + policies + event log model

Notes
- Voice UX is simulated (TTS-ready via Web Speech API in modern browsers). For real calls, hook Twilio/MSG91 in Customer Engagement Agent.
- Telematics is mocked via vehicle sensor snapshots; you can POST new telemetry to /api/vehicles/:id/telemetry.
- Forecasting endpoint returns simple computed values suitable for demo; plug in advanced models as needed.

Deploy
- You can deploy server and python services on any VM (or Docker), point frontend to the server URL, and use MongoDB Atlas.
- Minimal Docker files are not included to keep bootstrap simple; add docker-compose if preferred.
