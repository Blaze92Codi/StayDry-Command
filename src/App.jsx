import React, { useState, useMemo } from "react";

/* =========================
   FUTURE DEMO DATA
========================= */
const demoScenarios = {
  flood: {
    avg: 19320,
    trend: [12000, 14000, 16000, 17500, 19320],
    jobs: [
      { id: 1, type: "Emergency Pumping", status: "Active", stage: "Dispatch", photos: 6 },
      { id: 2, type: "Basement Flood", status: "Queued", stage: "Assessment", photos: 2 }
    ]
  },
  prevention: {
    avg: 4200,
    trend: [6000, 5200, 4800, 4500, 4200],
    jobs: [
      { id: 3, type: "Drain Install", status: "Complete", stage: "Closed", photos: 12 }
    ]
  },
  sales: {
    avg: 8700,
    trend: [4000, 6000, 7200, 8100, 8700],
    jobs: [
      { id: 4, type: "Estimate", status: "Pending", stage: "Quote", photos: 0 }
    ]
  }
};

/* =========================
   AI / RISK ENGINE
========================= */
function riskLevel(avg) {
  if (avg > 15000) return "CRITICAL";
  if (avg > 8000) return "ELEVATED";
  return "STABLE";
}

function riskColor(level) {
  if (level === "CRITICAL") return "#ff3b30";
  if (level === "ELEVATED") return "#ff9f0a";
  return "#34c759";
}

/* =========================
   MINI TREND GRAPH (no libs)
========================= */
function Trend({ data }) {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {data.map((v, i) => (
        <div
          key={i}
          style={{
            height: v / 200,
            width: 6,
            background: "#4facfe",
            borderRadius: 3
          }}
        />
      ))}
    </div>
  );
}

/* =========================
   EXECUTIVE OWNER UI
========================= */
function OwnerUI({ avg, jobs, trend }) {
  const level = riskLevel(avg);

  return (
    <div style={{ padding: 30 }}>
      <h2 style={{ color: "white" }}>Executive Command Center</h2>

      {/* KPI GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        
        <GlassCard>
          <h4>Avg Water</h4>
          <h1>{avg.toLocaleString()}</h1>
          <Trend data={trend} />
        </GlassCard>

        <GlassCard>
          <h4>Risk Level</h4>
          <h1 style={{ color: riskColor(level) }}>{level}</h1>
        </GlassCard>

        <GlassCard>
          <h4>AI Insight</h4>
          <p>
            {level === "CRITICAL"
              ? "Immediate system intervention required"
              : level === "ELEVATED"
              ? "Monitor and optimize discharge"
              : "System stable and optimized"}
          </p>
        </GlassCard>
      </div>

      {/* LIVE JOBS */}
      <div style={{ marginTop: 30 }}>
        <GlassCard>
          <h3>Live Operations</h3>

          {jobs.map(j => (
            <div key={j.id} style={jobStyle}>
              <strong>{j.type}</strong>
              <p>Status: {j.status}</p>
              <p>Stage: {j.stage}</p>
              <p>Photos: {j.photos}</p>
            </div>
          ))}
        </GlassCard>
      </div>
    </div>
  );
}

/* =========================
   OTHER ROLES
========================= */
function SalesUI({ jobs }) {
  return (
    <div style={{ padding: 30, color: "white" }}>
      <h2>Revenue Intelligence</h2>
      {jobs.map(j => (
        <GlassCard key={j.id}>
          <strong>{j.type}</strong>
          <p>{j.status}</p>
        </GlassCard>
      ))}
    </div>
  );
}

function FieldUI({ jobs }) {
  return (
    <div style={{ padding: 30, color: "white" }}>
      <h2>Field Operations</h2>
      {jobs.map(j => (
        <GlassCard key={j.id}>
          <strong>{j.type}</strong>
          <p>{j.stage}</p>
        </GlassCard>
      ))}
    </div>
  );
}

function ClientUI({ avg }) {
  return (
    <div style={{ padding: 30, color: "white" }}>
      <h2>Client Overview</h2>
      <h1>{avg.toLocaleString()} gal/day</h1>
      <p>System actively managing water risk.</p>
    </div>
  );
}

/* =========================
   MAIN APP
========================= */
export default function App() {
  const [demo, setDemo] = useState(true);
  const [scenario, setScenario] = useState("flood");
  const [role, setRole] = useState("Owner");

  const data = useMemo(() => {
    if (demo) return demoScenarios[scenario];
    return { avg: 0, jobs: [], trend: [] };
  }, [demo, scenario]);

  return (
    <div style={appStyle}>

      {/* TOP COMMAND BAR */}
      <div style={topBar}>
        <strong>StayDry Command™</strong>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setDemo(!demo)}>
            Demo {demo ? "ON" : "OFF"}
          </button>

          <select value={scenario} onChange={(e) => setScenario(e.target.value)}>
            <option value="flood">Flood</option>
            <option value="prevention">Prevention</option>
            <option value="sales">Sales</option>
          </select>

          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Owner">Owner</option>
            <option value="Sales">Sales</option>
            <option value="Field">Field</option>
            <option value="Client">Client</option>
          </select>
        </div>
      </div>

      {/* ROLE UI */}
      {role === "Owner" && <OwnerUI {...data} />}
      {role === "Sales" && <SalesUI {...data} />}
      {role === "Field" && <FieldUI {...data} />}
      {role === "Client" && <ClientUI {...data} />}
    </div>
  );
}

/* =========================
   FUTURE UI STYLES
========================= */
const appStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
  fontFamily: "Inter, sans-serif"
};

const topBar = {
  display: "flex",
  justifyContent: "space-between",
  padding: 20,
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(10px)",
  color: "white"
};

const GlassCard = ({ children }) => (
  <div style={{
    padding: 20,
    borderRadius: 16,
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
  }}>
    {children}
  </div>
);

const jobStyle = {
  marginTop: 10,
  padding: 10,
  borderRadius: 10,
  background: "rgba(255,255,255,0.05)"
};
