import { useState } from "react";
import ResultCard from "./components/ResultCard";
import UploadBox from "./components/UploadBox";

export default function App() {
const [result, setResult] = useState(null);
const [video, setVideo] = useState(null);

return ( <div style={styles.app}>

  <div style={styles.header}>
    Crowd Intelligence System
  </div>

  <div style={styles.content}>

    {/* VIDEO AREA */}
    <div style={styles.videoArea}>
      {video ? (
        <div style={styles.videoWrapper}>

          <video
            src={URL.createObjectURL(video)}
            autoPlay
            loop
            muted
            style={styles.video}
          />

          <div style={styles.heatmap}></div>
          <div style={styles.scan}></div>

          <div style={styles.liveBadge}>● LIVE</div>

        </div>
      ) : (
        <div style={styles.placeholder}>
          Upload a video to start
        </div>
      )}
    </div>

    {/* PANEL */}
    <div style={styles.panel}>

      <UploadBox setVideo={setVideo} setResult={setResult} />

      {result && (
        <div style={styles.status}>
          LIVE ANALYSIS ACTIVE
        </div>
      )}

      {result && <ResultCard data={result} />}

    </div>

  </div>
</div>

);
}

const styles = {
app: {
height: "100vh",
display: "flex",
flexDirection: "column",
background: "radial-gradient(circle at top, #020617, #000)",
color: "white",
fontFamily: "Arial, sans-serif",
},

header: {
height: "60px",
display: "flex",
alignItems: "center",
padding: "0 20px",
fontSize: "1.4rem",
letterSpacing: "1px",
background: "rgba(255,255,255,0.05)",
backdropFilter: "blur(12px)",
borderBottom: "1px solid rgba(255,255,255,0.1)",
},

content: {
flex: 1,
display: "flex",
},

videoArea: {
flex: 3,
display: "flex",
justifyContent: "center",
alignItems: "center",
},

videoWrapper: {
position: "relative",
width: "95%",
height: "90%",
},

video: {
width: "100%",
height: "100%",
objectFit: "cover",
borderRadius: "16px",
},

heatmap: {
position: "absolute",
inset: 0,
borderRadius: "16px",
pointerEvents: "none",
background:
"radial-gradient(circle at 40% 60%, rgba(255,0,0,0.5), transparent 60%), radial-gradient(circle at 70% 30%, rgba(255,255,0,0.4), transparent 60%)",
animation: "heatMove 4s infinite linear",
},

scan: {
position: "absolute",
width: "100%",
height: "3px",
background: "rgba(56,189,248,0.8)",
top: 0,
animation: "scanMove 3s infinite linear",
},

liveBadge: {
position: "absolute",
top: "10px",
left: "10px",
color: "#ef4444",
fontWeight: "bold",
fontSize: "0.9rem",
},

placeholder: {
color: "#64748b",
},

panel: {
flex: 1,
padding: "20px",
display: "flex",
flexDirection: "column",
gap: "20px",
background: "rgba(255,255,255,0.05)",
backdropFilter: "blur(20px)",
borderLeft: "1px solid rgba(255,255,255,0.1)",
},

status: {
color: "#38bdf8",
fontSize: "0.85rem",
letterSpacing: "1px",
},
};
