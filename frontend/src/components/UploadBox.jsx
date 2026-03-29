import { useState } from "react";
import axios from "axios";

export default function UploadBox({ setVideo, setResult }) {
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;

    setVideo(file);

    const formData = new FormData();
    formData.append("video", file);

    try {
      setLoading(true);

      const res = await axios.post(
        "http://127.0.0.1:8000/api/analyze-video/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // ✅ REAL BACKEND RESPONSE
      setResult({
        risk: res.data.risk,
        avg_people: res.data.avg_people,
        max_people: res.data.max_people,
        video: res.data.processed_video,
      });

    } catch (err) {
      console.error(err);
      alert("Error processing video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        ...styles.box,
        border: drag
          ? "2px solid #38bdf8"
          : "2px dashed rgba(255,255,255,0.2)",
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
      />

      <p>
        {loading ? "Processing video..." : "Drag & Drop or Upload Video"}
      </p>
    </div>
  );
}

const styles = {
  box: {
    padding: "20px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(15px)",
    textAlign: "center",
    cursor: "pointer",
  },
};