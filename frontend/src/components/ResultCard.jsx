export default function ResultCard({ data }) {
  if (!data) return null;

  const getColor = () => {
    if (data.risk === "HIGH") return "#ef4444";
    if (data.risk === "MEDIUM") return "#facc15";
    return "#22c55e";
  };

  const color = getColor();

  return (
    <div style={{ ...styles.card, boxShadow: `0 0 25px ${color}` }}>
      
      {data.risk === "HIGH" && (
        <div style={styles.alert}>
          🚨 HIGH RISK DETECTED
        </div>
      )}

      <div style={styles.section}>
        <div style={styles.label}>Risk Level</div>
        <div style={{ ...styles.risk, color }}>{data.risk}</div>
      </div>

      <div style={styles.section}>
        <div style={styles.label}>Average People</div>
        <div style={styles.value}>{data.avg_people}</div>
      </div>

      <div style={styles.section}>
        <div style={styles.label}>Max People</div>
        <div style={styles.value}>{data.max_people}</div>
      </div>

      {data.video && (
        <div style={styles.videoContainer}>
          <div style={styles.label}>Processed Video</div>
          <video width="100%" controls src={data.video}></video>
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
    marginTop: "10px",
  },

  label: {
    fontSize: "0.9rem",
    opacity: 0.7,
  },

  value: {
    fontSize: "1.5rem",
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
  },

  videoContainer: {
    marginTop: "15px",
  },
};