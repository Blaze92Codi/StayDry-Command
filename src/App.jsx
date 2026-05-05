import React, { useState, useMemo } from "react";

/* =========================
   DEMO DATA (SIMULATION)
========================= */
const demoScenarios = {
  flood: {
    avg: 19320,
    jobs: [
      { id: 1, type: "Emergency Pumping", status: "Active", stage: "Dispatch", photos: 6 },
      { id: 2, type: "Basement Flood", status: "Queued", stage: "Assessment", photos: 2 }
    ]
  },
  prevention: {
    avg: 4200,
    jobs: [
      { id: 3, type: "French Drain Install", status: "Complete", stage: "Closed", photos: 12 }
    ]
  },
  sales: {
    avg: 8700,
    jobs: [
      { id: 4, type: "Estimate", status: "Pending", stage: "Quote", photos: 0 }
    ]
  }
};

/* =========================
   HELPERS
========================= */
function riskLevel(avg) {
  if (avg > 15000) return "High";
  if (avg > 8000) return "Moderate";
  return "Low";
}

function riskColor(level) {
  if (level === "High") return "#ff4d4f";
  if (level === "Moderate") return "#faad14";
  return "#52c41a";
}

/* =========================
   OWNER UI (EXECUTIVE VIEW)
========================= */
function OwnerUI({ avg, jobs }) {
  const level = riskLevel(avg);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Executive Dashboard</h2>

      {/* KPI ROW */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div style={cardStyle}>
          <h4>Avg Pump Volume</h4>
          <h2>{avg.toLocaleString()}</h2>
        </div>

        <div style={{ ...cardStyle, borderLeft: `6px solid ${riskColor(level)}` }}>
          <h4>Risk Level</h4>
          <h2 style={{ color: riskColor(level) }}>{level}</h2>
        </div>

        <div style={cardStyle}>
          <h4>Active Jobs</h4>
          <h2>{jobs.length}</h2>
        </div>
      </div>

      {/* JOB LIST */}
      <div style={cardStyle}>
        <h3>Live Operations</h3>

        {jobs.length === 0 && <p>No active jobs</p>}

        {jobs.map((j) => (
          <div key={j.id} style={jobStyle}>
            <strong>{j.type}</strong>
            <p>Status: {j.status}</p>
            <p>Stage: {j.stage}</p>
            <p>Photos: {j.photos}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================
   SALES UI
========================= */
function SalesUI({ jobs }) {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Sales Pipeline</h2>

      {jobs.map((j) => (
        <div key={j.id} style={jobStyle}>
          <strong>{j.type}</strong>
          <p>Status: {j.status}</p>
          <p>Stage: {j.stage}</p>
        </div>
      ))}
    </div>
  );
}

/* =========================
   FIELD TECH UI
========================= */
function FieldUI({ jobs }) {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Field Operations</h2>

      {jobs.map((j) => (
        <div key={j.id} style={jobStyle}>
          <strong>{j.type}</strong>
          <p>Stage: {j.stage}</p>
          <p>Photos Required: {j.photos}</p>
        </div>
      ))}
    </div>
  );
}

/* =========================
   CLIENT UI
========================= */
function ClientUI({ avg }) {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Client View</h2>
      <p>Your system is processing approximately:</p>
      <h1>{avg.toLocaleString()} gallons/day</h1>
      <p>We are actively managing your water risk.</p>
    </div>
  );
}

/* =========================
   MAIN APP (MERGED UI)
========================= */
export default function App() {
  const [demo, setDemo] = useState(true);
  const [scenario, setScenario] = useState("flood");
  const [role, setRole] = useState("Owner");

  const data = useMemo(() => {
    if (demo) return demoScenarios[scenario];
    return { avg: 0, jobs: [] }; // placeholder for Firebase later
  }, [demo, scenario]);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#f5f7fa", minHeight: "100vh" }}>

      {/* =========================
         EXECUTIVE CONTROL BAR
      ========================= */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "15px",
        background: "#0b1f3a",
        color: "white",
        alignItems: "center"
      }}>
        <strong>StayDry Command™</strong>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => setDemo(!demo)}>
            Demo: {demo ? "ON" : "OFF"}
          </button>

          <select value={scenario} onChange={(e) => setScenario(e.target.value)}>
            <option value="flood">Flood</option>
            <option value="prevention">Prevention</option>
            <option value="sales">Sales</option>
          </select>

          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Owner">Owner</option>
            <option value="Sales">Sales</option>
            <option value="Field">Field Tech</option>
            <option value="Client">Client</option>
          </select>
        </div>
      </div>

      {/* =========================
         ROLE-BASED UI
      ========================= */}
      {role === "Owner" && <OwnerUI avg={data.avg} jobs={data.jobs} />}
      {role === "Sales" && <SalesUI jobs={data.jobs} />}
      {role === "Field" && <FieldUI jobs={data.jobs} />}
      {role === "Client" && <ClientUI avg={data.avg} />}
    </div>
  );
}

/* =========================
   STYLES
========================= */
const cardStyle = {
  background: "white",
  padding: "15px",
  borderRadius: "10px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  flex: 1
};

const jobStyle = {
  border: "1px solid #ddd",
  padding: "10px",
  marginTop: "10px",
  borderRadius: "8px"
};
