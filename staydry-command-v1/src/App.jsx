import React, { useMemo, useState } from "react";

// ================= FIREBASE REAL INTEGRATION =================
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBe4axVvePWHbtAr8QXu5Mvl2QUf2V_ZHc",
  authDomain: "staydry-command.firebaseapp.com",
  projectId: "staydry-command",
  storageBucket: "staydry-command.appspot.com",
  messagingSenderId: "546013069071",
  appId: "1:546013069071:web:b0aa9ce4d00de6465ec87a",
  measurementId: "G-CYRJYWN96K"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const saveJob = async (job) => {
  try {
    await addDoc(collection(db, "jobs"), {
      ...job,
      createdAt: new Date().toISOString()
    });
    console.log("Saved to Firebase:", job);
  } catch (e) {
    console.error("Firebase Error:", e);
  }
};

// ================= DATA =================
const pumpData = [
  { date: "04/03", gallons: 17243 },
  { date: "04/04", gallons: 26444 },
  { date: "04/05", gallons: 26149 },
  { date: "04/06", gallons: 23589 },
  { date: "04/07", gallons: 21658 }
];

// ================= LOGIC =================
const avgGallons = (data) =>
  Math.round(data.reduce((s, d) => s + d.gallons, 0) / data.length);

const riskLevel = (g) =>
  g >= 25000 ? "Critical" :
  g >= 12000 ? "High" :
  g >= 6000 ? "Moderate" : "Low";

// ================= OWNER =================
function OwnerUI({ avg }) {
  return (
    <div>
      <h2>Owner Dashboard</h2>
      <p>Risk Level: {riskLevel(avg)}</p>
      <p>Avg Water: {avg}</p>
      <p>Monthly Savings: $3500</p>
      <p>Upsell Revenue: $35000</p>
    </div>
  );
}

// ================= SALES =================
function SalesUI({ createJob }) {
  return (
    <div>
      <h2>Sales System</h2>
      <ul>
        <li>Capture full water issue</li>
        <li>Identify source</li>
        <li>Recommend full system</li>
        <li>Set expectations</li>
      </ul>

      <button onClick={() => createJob({ type: "Assessment", status: "Created" })}>
        Create Job
      </button>
    </div>
  );
}

// ================= FIELD TECH =================
function FieldTechUI({ photos, setPhotos, completeJob }) {
  return (
    <div>
      <h2>Field Execution</h2>

      <input
        type="file"
        multiple
        onChange={(e) =>
          setPhotos([...photos, ...Array.from(e.target.files)])
        }
      />

      {photos.map((p, i) => (
        <div key={i}>{p.name}</div>
      ))}

      <button onClick={() => completeJob({ status: "Completed", photos: photos.length })}>
        Complete Job
      </button>
    </div>
  );
}

// ================= CLIENT =================
function ClientUI() {
  return (
    <div>
      <h2>Client Portal</h2>
      <p>Before: High Water Table</p>
      <p>After: Controlled + Verified</p>
    </div>
  );
}

// ================= WORKFLOW =================
function WorkflowUI() {
  return (
    <div>
      <h2>Workflow</h2>
      <p>Assess → Plan → Install → Verify → Close</p>
    </div>
  );
}

// ================= MAIN =================
export default function App() {
  const [role, setRole] = useState(null);
  const [photos, setPhotos] = useState([]);

  const avg = useMemo(() => avgGallons(pumpData), []);

  const createJob = async (job) => {
    await saveJob(job);
    alert("Job Created & Saved to Firebase");
  };

  const completeJob = async (job) => {
    await saveJob(job);
    alert("Job Completed with Proof");
  };

  if (!role) {
    return (
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#020617", color: "white" }}>
        <div>
          <h1>StayDry Command™</h1>
          {["Owner", "Sales", "Field Tech", "Client"].map(r => (
            <button key={r} onClick={() => setRole(r)} style={{ margin: 5 }}>
              {r}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>StayDry Command™</h1>
      <p>Role: {role}</p>

      {role === "Owner" && <OwnerUI avg={avg} />}
      {role === "Sales" && <SalesUI createJob={createJob} />}
      {role === "Field Tech" && (
        <FieldTechUI photos={photos} setPhotos={setPhotos} completeJob={completeJob} />
      )}
      {role === "Client" && <ClientUI />}

      <WorkflowUI />
    </div>
  );
}
