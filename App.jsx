import React, { useMemo, useState } from "react";

const pumpData = [
  { date: "04/03", gallons: 17243, cycles: 1326 },
  { date: "04/04", gallons: 26444, cycles: 1584 },
  { date: "04/05", gallons: 26149, cycles: 1591 },
  { date: "04/06", gallons: 23589, cycles: 1612 },
  { date: "04/07", gallons: 21658, cycles: 1571 },
  { date: "04/08", gallons: 17951, cycles: 1338 },
  { date: "04/09", gallons: 17878, cycles: 1360 },
  { date: "04/10", gallons: 16647, cycles: 1285 },
  { date: "04/11", gallons: 15413, cycles: 1209 },
  { date: "04/12", gallons: 14898, cycles: 1174 },
  { date: "04/13", gallons: 14647, cycles: 1174 },
];

const kpiData = [
  { name: "Fix-It-Once Score", value: 91 },
  { name: "Proof Closeout", value: 96 },
  { name: "Client Trust", value: 88 },
  { name: "Callback Risk", value: 14 },
];

const initialFindings = [
  "High water table condition with heavy sump dependency",
  "Drywell appears saturated and visually overwhelmed",
  "Discharge appears to remain on site instead of being removed from the water problem area",
  "Pump cycle volume indicates system stress and possible recirculation",
  "Corrective scope should evaluate exterior interception, discharge redesign, sump pit setup, and interior relief",
];

const evidenceItems = [
  "Front discharge point photos",
  "Sump pit interior photo",
  "PitBoss Pro screenshots",
  "Foundation wall photos",
  "Grade and downspout photos",
  "Final walkthrough video",
];

const kpiItems = [
  "Sales assessment accuracy",
  "Estimate-to-actual labor variance",
  "Callback and warranty claim rate",
  "Client praise vs complaint themes",
  "Change-order response time",
  "Photo/video closeout completion",
  "Pump alert trends after install",
];

const futureInsights = [
  {
    alert: "High groundwater pressure trend detected",
    action: "Recommend exterior interception or discharge redesign before water reaches the foundation.",
    level: "Critical",
  },
  {
    alert: "Pump cycle frequency abnormal",
    action: "Potential pump fatigue risk within 10–14 days if cycle rate continues.",
    level: "High",
  },
  {
    alert: "Discharge saturation risk",
    action: "Redirect discharge farther from the foundation and verify no recirculation path.",
    level: "High",
  },
  {
    alert: "Callback probability elevated",
    action: "Require foreman deviation review before closeout and attach proof photos.",
    level: "Moderate",
  },
];

const wbs = [
  { phase: "1. Field Intake", owner: "Sales / Estimator", output: "Client interview, photo set, pump logs, concern summary" },
  { phase: "2. Site Diagnosis", owner: "Estimator + Foreman", output: "Water source map, grading review, sump/pit inspection, discharge assessment" },
  { phase: "3. Corrective Design", owner: "Design Lead", output: "Exterior interception plan, discharge route, sump redesign, interior relief option" },
  { phase: "4. Client Proposal", owner: "Office / Sales", output: "Plain-language scope, WBS, price logic, assumptions, alternatives" },
  { phase: "5. Production Work", owner: "Crew Foreman", output: "Daily photos, deviations, material tracking, completion evidence" },
  { phase: "6. Quality Closeout", owner: "QC Lead", output: "Pump test, discharge verification, final photos, warranty packet, client signoff" },
];

const actionPlan = [
  "Verify whether the drywell is undersized, saturated, clogged, or unsuitable for the soil condition.",
  "Confirm whether discharge is being recycled back toward the home or foundation zone.",
  "Inspect sump pit setup, pump elevation, float operation, debris, check valves, backup system, and battery backup status.",
  "Quote a permanent correction in separate line items: discharge redesign, exterior interception, interior relief, sump correction, restoration.",
  "Create a client-facing decision summary explaining why each option is recommended, what it solves, and what it costs.",
];

const tabs = ["assessment", "analytics", "wbs", "roi", "intelligence", "proof", "tests"];

function calculateSavings(callbackRate, jobsPerMonth, avgCallbackCost) {
  const monthlyCallbacks = jobsPerMonth * (callbackRate / 100);
  return Math.round(monthlyCallbacks * avgCallbackCost);
}

function calculateUpsellRevenue(systemPrice, attachRate, jobsPerMonth) {
  return Math.round(systemPrice * (attachRate / 100) * jobsPerMonth);
}

function getAverageGallons(data) {
  if (!Array.isArray(data) || data.length === 0) return 0;
  return Math.round(data.reduce((sum, item) => sum + Number(item.gallons || 0), 0) / data.length);
}

function getRiskFromGallons(gallons) {
  if (gallons >= 25000) return "Critical";
  if (gallons >= 15000) return "High";
  if (gallons >= 8000) return "Moderate";
  return "Low";
}

function getFixItOnceScore({ noCallback, pumpCyclesReduced, dischargeVerified, clientSatisfied }) {
  return (noCallback ? 40 : 0) + (pumpCyclesReduced ? 20 : 0) + (dischargeVerified ? 20 : 0) + (clientSatisfied ? 20 : 0);
}

function getSelfTests() {
  const avg = getAverageGallons(pumpData);
  return [
    { name: "Pump data loaded", pass: pumpData.length > 0 },
    { name: "Average > 18k gallons", pass: avg > 18000 },
    { name: "Risk = Critical @ 26k", pass: getRiskFromGallons(26000) === "Critical" },
    { name: "WBS includes Closeout", pass: wbs.some(x => x.phase.includes("Closeout")) },
    { name: "ROI calc returns number", pass: typeof calculateSavings(20, 50, 300) === "number" },
    { name: "Upsell calc valid", pass: calculateUpsellRevenue(2500, 30, 40) > 0 },
    { name: "Fix-It-Once perfect score = 100", pass: getFixItOnceScore({ noCallback: true, pumpCyclesReduced: true, dischargeVerified: true, clientSatisfied: true }) === 100 },
    { name: "Future intelligence has simulated insights", pass: futureInsights.length >= 3 },
  ];
}

function RiskPill({ value }) {
  const color = value === "Critical" ? "red" : value === "High" ? "orange" : value === "Moderate" ? "yellow" : "green";
  return <span className={`pill ${color}`}>{value}</span>;
}

function Card({ children, className = "" }) {
  return <section className={`card ${className}`}>{children}</section>;
}

function Section({ title, kicker }) {
  return (
    <div className="section-header">
      {kicker && <div className="kicker">{kicker}</div>}
      <h2>{title}</h2>
    </div>
  );
}

function Bar({ value }) {
  return (
    <div className="bar-track">
      <div className="bar-fill" style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }} />
    </div>
  );
}

function MiniLineChart({ data }) {
  const width = 720;
  const height = 240;
  const pad = 30;
  const max = Math.max(...data.map(d => d.gallons));
  const min = Math.min(...data.map(d => d.gallons));
  const points = data.map((d, i) => {
    const x = pad + (i * (width - pad * 2)) / (data.length - 1);
    const y = height - pad - ((d.gallons - min) / Math.max(max - min, 1)) * (height - pad * 2);
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="line-chart" role="img" aria-label="Daily gallons pumped trend">
      <rect x="0" y="0" width={width} height={height} rx="20" fill="#f8fafc" />
      {[0,1,2,3].map(i => <line key={i} x1={pad} x2={width-pad} y1={pad+i*55} y2={pad+i*55} stroke="#e2e8f0" />)}
      <polyline points={points} fill="none" stroke="#0284c7" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => {
        const [x,y] = points.split(" ")[i].split(",").map(Number);
        return <circle key={d.date} cx={x} cy={y} r="5" fill="#0ea5e9" />;
      })}
      <text x={pad} y="22" fontSize="13" fill="#0284c7" fontWeight="700">Daily Gallons</text>
    </svg>
  );
}

export default function StayDryPlatform() {
  const [tab, setTab] = useState("assessment");
  const [callbackRate, setCallbackRate] = useState(25);
  const [jobsPerMonth, setJobsPerMonth] = useState(40);
  const [callbackCost, setCallbackCost] = useState(350);
  const [systemPrice, setSystemPrice] = useState(2500);
  const [attachRate, setAttachRate] = useState(35);
  const [noCallback, setNoCallback] = useState(true);
  const [pumpCyclesReduced, setPumpCyclesReduced] = useState(false);
  const [dischargeVerified, setDischargeVerified] = useState(false);
  const [clientSatisfied, setClientSatisfied] = useState(true);

  const avgGallons = useMemo(() => getAverageGallons(pumpData), []);
  const risk = useMemo(() => getRiskFromGallons(avgGallons), [avgGallons]);
  const savings = calculateSavings(callbackRate, jobsPerMonth, callbackCost);
  const upsell = calculateUpsellRevenue(systemPrice, attachRate, jobsPerMonth);
  const fixScore = getFixItOnceScore({ noCallback, pumpCyclesReduced, dischargeVerified, clientSatisfied });
  const tests = getSelfTests();
  const passedTests = tests.filter(t => t.pass).length;

  return (
    <main className="app-shell">
      <div className="demo-banner">🚀 LIVE DEMO MODE — StayDry Command™ | Pilot Ready | ROI + AI Simulation Active</div>

      <header className="hero">
        <div>
          <div className="kicker light">StayDry Command™ by Palmer Systems</div>
          <h1>Diagnose It Right. Fix It Once. Stay Dry.</h1>
          <p>A mobile-ready AI + IoT waterproofing command center that connects the client, estimator, crew, office, and proof-of-performance into one transparent operating system.</p>
          <div className="hero-pills">
            <span>IoT Ready</span><span>iPhone Demo</span><span>Callback Control</span><span>Client Proof</span>
          </div>
        </div>
        <div className="hero-stat">
          <small>Demo Case Risk</small>
          <strong>{risk}</strong>
          <span>{avgGallons.toLocaleString()} avg gallons/day</span>
        </div>
      </header>

      <nav className="tabs" aria-label="App sections">
        {tabs.map(t => (
          <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </nav>

      {tab === "assessment" && (
        <div className="grid two">
          <Card>
            <Section title="Field Assessment" kicker="Job truth before job scope" />
            <div className="metric-row">
              <div><span>Avg Pump Volume</span><strong>{avgGallons.toLocaleString()}</strong></div>
              <div><span>Risk Level</span><strong><RiskPill value={risk} /></strong></div>
            </div>
            <div className="finding-list">
              {initialFindings.map(f => <div key={f}>• {f}</div>)}
            </div>
          </Card>
          <Card>
            <Section title="Required Evidence" kicker="Crew-ready documentation" />
            {evidenceItems.map(i => <div className="check-item" key={i}>✅ {i}</div>)}
          </Card>
        </div>
      )}

      {tab === "analytics" && (
        <div className="grid two">
          <Card>
            <Section title="Pump Analytics" kicker="IoT data simulation" />
            <MiniLineChart data={pumpData} />
          </Card>
          <Card>
            <Section title="Quality KPIs" kicker="Management view" />
            {kpiData.map(k => (
              <div className="kpi-row" key={k.name}>
                <div><strong>{k.name}</strong><span>{k.value}%</span></div>
                <Bar value={k.value} />
              </div>
            ))}
          </Card>
        </div>
      )}

      {tab === "wbs" && (
        <Card>
          <Section title="Work Breakdown Structure" kicker="One plan for sales, crew, and client" />
          <div className="wbs-list">
            {wbs.map(w => (
              <div className="wbs-card" key={w.phase}>
                <strong>{w.phase}</strong>
                <span>{w.owner}</span>
                <p>{w.output}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "roi" && (
        <div className="grid two">
          <Card>
            <Section title="Executive ROI Model" kicker="Shows the money leak and upside" />
            <label>Callback Rate %<input type="number" value={callbackRate} onChange={e=>setCallbackRate(Number(e.target.value))} /></label>
            <label>Jobs / Month<input type="number" value={jobsPerMonth} onChange={e=>setJobsPerMonth(Number(e.target.value))} /></label>
            <label>Cost per Callback<input type="number" value={callbackCost} onChange={e=>setCallbackCost(Number(e.target.value))} /></label>
            <label>Smart Sump + Battery System Price<input type="number" value={systemPrice} onChange={e=>setSystemPrice(Number(e.target.value))} /></label>
            <label>Attach Rate %<input type="number" value={attachRate} onChange={e=>setAttachRate(Number(e.target.value))} /></label>
          </Card>
          <Card>
            <Section title="Business Impact" kicker="Pilot-ready owner view" />
            <div className="money-card"><span>Monthly Callback Savings</span><strong>${savings.toLocaleString()}</strong></div>
            <div className="money-card"><span>Monthly Upsell Revenue</span><strong>${upsell.toLocaleString()}</strong></div>
            <div className="money-card total"><span>Total Monthly Impact</span><strong>${(savings + upsell).toLocaleString()}</strong></div>
            <p className="note">This models how the platform reduces rework, protects labor capacity, and creates a premium smart system upsell.</p>
          </Card>
        </div>
      )}

      {tab === "intelligence" && (
        <div className="grid two">
          <Card>
            <Section title="Advanced Future Intelligence" kicker="Simulated AI + IoT capability" />
            {futureInsights.map((insight) => (
              <div className="insight" key={insight.alert}>
                <div><RiskPill value={insight.level} /> <strong>{insight.alert}</strong></div>
                <p>{insight.action}</p>
              </div>
            ))}
          </Card>
          <Card>
            <Section title="Water Control Simulation" kicker="Future visualization concept" />
            <div className="simulation-box">
              <div className="house">HOME</div>
              <div className="water-line one" />
              <div className="water-line two" />
              <div className="water-line three" />
              <div className="red-zone">Pressure Zone</div>
              <div className="green-zone">Controlled Discharge</div>
            </div>
            <p className="note">Demo only: future version would combine pump data, site photos, field notes, soil/drainage references, and technician verification to improve recommendations over time.</p>
          </Card>
        </div>
      )}

      {tab === "proof" && (
        <div className="grid two">
          <Card>
            <Section title="Client Proof Report" kicker="The trust closer" />
            {actionPlan.map((a, i) => <div className="check-item" key={a}>Step {i + 1}: {a}</div>)}
            <div className="client-promise">StayDry promise: One inspection. One plan. One source of truth. Proof the home stays dry.</div>
          </Card>
          <Card>
            <Section title="Fix-It-Once Score" kicker="Quality closeout standard" />
            {[
              ["No callback within 30 days", noCallback, setNoCallback, 40],
              ["Pump cycles reduced", pumpCyclesReduced, setPumpCyclesReduced, 20],
              ["Discharge verified away", dischargeVerified, setDischargeVerified, 20],
              ["Client satisfied", clientSatisfied, setClientSatisfied, 20],
            ].map(([label, checked, setter, points]) => (
              <label className="checkbox-row" key={label}>
                <input type="checkbox" checked={checked} onChange={e => setter(e.target.checked)} />
                <span>{label}</span>
                <strong>+{points}</strong>
              </label>
            ))}
            <div className="score">{fixScore}<span>/100</span></div>
          </Card>
        </div>
      )}

      {tab === "tests" && (
        <Card>
          <Section title="Built-In Demo Tests" kicker={`${passedTests}/${tests.length} passing`} />
          {tests.map(t => <div className="test-row" key={t.name}><span>{t.name}</span><strong>{t.pass ? "PASS" : "FAIL"}</strong></div>)}
        </Card>
      )}
    </main>
  );
}
