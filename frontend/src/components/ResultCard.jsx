// 📊 SVG line chart — people count per sampled frame
function FrameChart({ counts }) {
  if (!counts || counts.length === 0) return null;

  const W = 260, H = 80;
  const maxVal = Math.max(...counts, 25); // minimum scale = 25
  const n = counts.length;
  const step = n > 1 ? W / (n - 1) : 0;

  // Convert a count to a Y pixel (with 4px padding top/bottom)
  const toY = (c) => H - 4 - (c / maxVal) * (H - 8);

  const points = counts
    .map((c, i) => `${(i * step).toFixed(1)},${toY(c).toFixed(1)}`)
    .join(" ");

  const lowY  = toY(10); // MEDIUM threshold line
  const highY = toY(20); // HIGH threshold line

  return (
    <div style={{ marginTop: "14px", textAlign: "left" }}>
      <div style={styles.label}>People Count per Frame</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{
          display: "block",
          marginTop: "5px",
          background: "rgba(0,0,0,0.35)",
          borderRadius: "8px",
        }}
      >
        {/* MEDIUM threshold (10) */}
        {lowY >= 0 && lowY <= H && (
          <line x1={0} y1={lowY} x2={W} y2={lowY}
            stroke="#facc15" strokeWidth={0.8} strokeDasharray="4,3" />
        )}
        {/* HIGH threshold (20) */}
        {highY >= 0 && highY <= H && (
          <line x1={0} y1={highY} x2={W} y2={highY}
            stroke="#ef4444" strokeWidth={0.8} strokeDasharray="4,3" />
        )}
        {/* Count line */}
        <polyline
          points={points}
          fill="none"
          stroke="#38bdf8"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        {/* Dots — only when frames are few enough */}
        {n <= 80 && counts.map((c, i) => (
          <circle
            key={i}
            cx={(i * step).toFixed(1)}
            cy={toY(c).toFixed(1)}
            r={2}
            fill="#38bdf8"
          />
        ))}
      </svg>
      <div style={styles.chartLegend}>
        <span>Frame 1</span>
        <span style={{ color: "#facc15" }}>— Med(10)</span>
        <span style={{ color: "#ef4444" }}>— High(20)</span>
        <span>Frame {n}</span>
      </div>
    </div>
  );
}

export default function ResultCard({ data }) {
  if (!data) return null;

  const getColor = () => {
    if (data.risk === "LOW") return "#22c55e";
    if (data.risk === "MEDIUM") return "#facc15";
    return "#ef4444";
  };

  const color = getColor();
  const dangerPct = Math.min(100, data.danger_score || 0);

  return (
    <div style={{ ...styles.card, boxShadow: `0 0 25px ${color}` }}>

      {/* 🚨 HIGH RISK ALERT */}
      {data.risk === "HIGH" && (
        <div style={styles.alert}>🚨 HIGH RISK DETECTED</div>
      )}

      {/* RISK LEVEL */}
      <div style={styles.section}>
        <div style={styles.label}>Risk Level</div>
        <div style={{ ...styles.risk, color }}>{data.risk}</div>
      </div>

      {/* DANGER SCORE BAR */}
      <div style={styles.section}>
        <div style={styles.label}>Danger Score — {dangerPct}%</div>
        <div style={styles.barBg}>
          <div style={{ ...styles.barFill, width: `${dangerPct}%`, background: color }} />
        </div>
      </div>

      {/* STATS ROW */}
      <div style={styles.statsRow}>
        <div style={styles.statBox}>
          <div style={styles.label}>Avg People</div>
          <div style={styles.value}>{data.avg_people}</div>
        </div>
        <div style={styles.statBox}>
          <div style={styles.label}>Max People</div>
          <div style={styles.value}>{data.max_people}</div>
        </div>
        <div style={styles.statBox}>
          <div style={styles.label}>Frames</div>
          <div style={styles.value}>{data.total_frames ?? "—"}</div>
        </div>
      </div>

      {/* 📊 FRAME COUNT CHART */}
      <FrameChart counts={data.frame_counts} />

      {/* PROCESSED VIDEO */}
      {data.video && (
        <div style={styles.videoContainer}>
          <div style={styles.label}>Processed Video</div>
          <video
            width="100%"
            controls
            src={data.video}
            style={{ borderRadius: "10px" }}
          />
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    padding: "20px",
    borderRadius: "15px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(20px)",
    textAlign: "center",
    marginTop: "20px",
  },

  section: {
    marginTop: "12px",
  },

  label: {
    fontSize: "0.85rem",
    opacity: 0.7,
  },

  value: {
    fontSize: "1.4rem",
    fontWeight: "bold",
  },

  risk: {
    fontSize: "2rem",
    fontWeight: "bold",
  },

  alert: {
    marginBottom: "10px",
    color: "#ef4444",
    fontWeight: "bold",
    background: "rgba(255,0,0,0.15)",
    padding: "8px",
    borderRadius: "8px",
    animation: "pulse 1s infinite",
  },

  barBg: {
    width: "100%",
    height: "8px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "4px",
    marginTop: "5px",
    overflow: "hidden",
  },

  barFill: {
    height: "100%",
    borderRadius: "4px",
    transition: "width 0.8s ease",
  },

  statsRow: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "14px",
  },

  statBox: {
    flex: 1,
  },

  chartLegend: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.68rem",
    opacity: 0.55,
    marginTop: "3px",
  },

  videoContainer: {
    marginTop: "15px",
  },
};
