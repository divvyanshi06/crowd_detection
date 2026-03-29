import { useState } from "react";

export default function UploadBox({ setVideo, setResult }) {
const [drag, setDrag] = useState(false);

const handleFile = (file) => {
setVideo(file);

let count = 5;

const interval = setInterval(() => {
  count += Math.floor(Math.random() * 5);

  let risk = "LOW";
  if (count > 25) risk = "HIGH";
  else if (count > 12) risk = "MEDIUM";

  setResult({ count, risk });

}, 1000);

setTimeout(() => clearInterval(interval), 8000);

};

return (
<div
style={{
...styles.box,
border: drag ? "2px solid #38bdf8" : "2px dashed rgba(255,255,255,0.2)",
}}
onDragOver={(e) => {
e.preventDefault();
setDrag(true);
}}
onDragLeave={() => setDrag(false)}
onDrop={(e) => {
e.preventDefault();
setDrag(false);
handleFile(e.dataTransfer.files[0]);
}}
>
<input
type="file"
accept="video/*"
onChange={(e) => handleFile(e.target.files[0])}
/> <p>Drag & Drop or Upload Video</p> </div>
);
}

const styles = {
box: {
padding: "20px",
borderRadius: "12px",
background: "rgba(255,255,255,0.08)",
backdropFilter: "blur(15px)",
textAlign: "center",
},
};
