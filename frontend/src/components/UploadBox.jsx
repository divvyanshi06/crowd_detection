import { useState } from "react";
import axios from "axios";

// 🔊 Generate a beep using the Web Audio API (no external file needed)
function playBeepSound() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;

  const ctx = new AudioCtx();
  const beepCount = 3;
  const beepDuration = 0.3; // seconds each beep
  const beepGap = 0.15;    // seconds between beeps

  for (let i = 0; i < beepCount; i++) {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = "square";
    const startTime = ctx.currentTime + i * (beepDuration + beepGap);
    oscillator.frequency.setValueAtTime(880, startTime); // 880 Hz = A5

    gainNode.gain.setValueAtTime(0.35, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + beepDuration);

    oscillator.start(startTime);
    oscillator.stop(startTime + beepDuration);
  }
}

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

      // 🔊 PLAY BEEP when risk is HIGH
      if (res.data.risk === "HIGH") {
        playBeepSound();
      }

      setResult({
        risk: res.data.risk,
        avg_people: res.data.avg_people,
        max_people: res.data.max_people,
        danger_score: res.data.danger_score,
        frame_counts: res.data.frame_counts,   // per-frame people count array
        total_frames: res.data.total_frames,   // total sampled frames
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
    <div>

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