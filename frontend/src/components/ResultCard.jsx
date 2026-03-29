export default function ResultCard({ data }) {

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

  <div style={styles.count}>{data.count}</div>

  <div style={{ ...styles.risk, color }}>
    {data.risk}
  </div>

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
},

count: {
fontSize: "2.5rem",
fontWeight: "bold",
},

risk: {
marginTop: "8px",
fontWeight: "bold",
},

alert: {
marginBottom: "10px",
color: "#ef4444",
fontWeight: "bold",
animation: "blink 1s infinite",
},
};
