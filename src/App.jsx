// EXECUTIVE 2050 UI + SAFE FIREBASE + AI
import React, { useState, useMemo, useEffect } from "react";

// FIREBASE (SAFE INIT)
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBe4axVvePWHbtAr8QXu5Mvl2QUf2V_ZHc",
  authDomain: "staydry-command.firebaseapp.com",
  projectId: "staydry-command",
  storageBucket: "staydry-command.appspot.com",
  messagingSenderId: "546013069071",
  appId: "1:546013069071:web:b0aa9ce4d00de6465ec87a"
};

let db;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (e) {
  console.log("Firebase already initialized");
}

/* =========================
   DEMO DATA
========================= */
const demoScenarios = {
  flood: { history: [12000,14000,16000,17500,19320] },
  prevention: { history: [6000,5200,4800,4500,4200] },
  sales: { history: [4000,6000,7200,8100,8700] }
};

/* =========================
   AI ENGINE
========================= */
function forecastNext(history) {
  if (history.length < 2) return history[0] || 0;
  const trend = history[history.length - 1] - history[history.length - 2];
  return Math.round(history[history.length - 1] + trend);
}

function riskLevel(val) {
  if (val > 15000) return "CRITICAL";
  if (val > 8000) return "ELEVATED";
  return "STABLE";
}

function recommendation(level) {
  if (level === "CRITICAL") return "Deploy drainage + pump upgrade immediately";
  if (level === "ELEVATED") return "Recommend preventative waterproofing";
  return "Maintain current system";
}

/* =========================
   UI COMPONENTS
========================= */
const GlassCard = ({ children }) => (
  <div style={{ padding:20,borderRadius:16,background:"rgba(255,255,255,0.08)",backdropFilter:"blur(12px)",marginBottom:15 }}>
    {children}
  </div>
);

function Trend({ data }) {
  return (
    <div style={{ display:"flex",gap:6,marginTop:10 }}>
      {data.map((v,i)=>(<div key={i} style={{height:v/200,width:6,background:"#4facfe"}}/>))}
    </div>
  );
}

/* =========================
   OWNER UI
========================= */
function OwnerUI({ history }) {
  const next = forecastNext(history);
  const level = riskLevel(next);

  return (
    <div style={{ padding:30,color:"white" }}>
      <h2>AI Command Center</h2>

      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20 }}>
        <GlassCard>
          <h4>Current Avg</h4>
          <h1>{history[history.length-1]?.toLocaleString()}</h1>
          <Trend data={history} />
        </GlassCard>

        <GlassCard>
          <h4>Predicted Next</h4>
          <h1>{next.toLocaleString()}</h1>
        </GlassCard>

        <GlassCard>
          <h4>Risk Forecast</h4>
          <h1>{level}</h1>
        </GlassCard>
      </div>

      <GlassCard>
        <h3>AI Recommendation</h3>
        <p>{recommendation(level)}</p>
      </GlassCard>
    </div>
  );
}

/* =========================
   MAIN APP
========================= */
export default function App() {
  const [scenario,setScenario]=useState("flood");
  const [history,setHistory]=useState([]);
  const [mode,setMode]=useState("demo");

  // SAFE FIREBASE LOAD
  useEffect(()=>{
    if(mode==="live" && db){
      (async ()=>{
        try {
          const snap = await getDocs(collection(db,"jobs"));
          const values = snap.docs
            .map(d=>d.data().gallons || 0)
            .filter(v=>v>0);
          if(values.length>0) setHistory(values);
        } catch(err){
          console.error("Firebase load error", err);
        }
      })();
    }
  },[mode]);

  const data = useMemo(()=>{
    if(mode==="demo") return demoScenarios[scenario].history;
    return history.length?history:[1000];
  },[scenario,mode,history]);

  return (
    <div style={{ minHeight:"100vh",background:"linear-gradient(135deg,#0f2027,#203a43,#2c5364)",fontFamily:"Inter" }}>

      <div style={{ display:"flex",justifyContent:"space-between",padding:20,color:"white" }}>
        <strong>StayDry AI Command™</strong>

        <div>
          <select onChange={(e)=>setMode(e.target.value)} value={mode}>
            <option value="demo">Demo</option>
            <option value="live">Live</option>
          </select>

          <select onChange={(e)=>setScenario(e.target.value)} value={scenario}>
            <option value="flood">Flood</option>
            <option value="prevention">Prevention</option>
            <option value="sales">Sales</option>
          </select>
        </div>
      </div>

      <OwnerUI history={data} />

    </div>
  );
}
