import cv2
import numpy as np
from ultralytics import YOLO

# Load YOLO model once
MODEL = YOLO("yolov8n.pt")


def analyze_video(video_path, output_path=None):
    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        raise ValueError("Could not open video")

    fps = cap.get(cv2.CAP_PROP_FPS) or 25
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    # Video writer
    writer = None
    if output_path:
        output_path = output_path.replace(".mp4", ".avi")
        fourcc = cv2.VideoWriter_fourcc(*'XVID')
        writer = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

    counts = []

    # 🔥 Heatmap accumulator
    heatmap_accum = np.zeros((height, width), dtype=np.float32)

    # 🔥 Central danger zone
    zone_x1, zone_y1 = int(width * 0.3), int(height * 0.3)
    zone_x2, zone_y2 = int(width * 0.7), int(height * 0.7)

    last_risk = "LOW"
    last_danger_score = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        results = MODEL(frame, verbose=False)[0]

        people_count = 0
        zone_count = 0

        for box in results.boxes:
            class_id = int(box.cls[0])
            confidence = float(box.conf[0])

            if class_id == 0 and confidence >= 0.4:
                people_count += 1

                x1, y1, x2, y2 = map(int, box.xyxy[0])

                # 🔥 Heatmap update
                heatmap_accum[y1:y2, x1:x2] += 1

                # 🔥 Zone detection
                cx = (x1 + x2) // 2
                cy = (y1 + y2) // 2

                if zone_x1 < cx < zone_x2 and zone_y1 < cy < zone_y2:
                    zone_count += 1
                    color = (0, 0, 255)  # RED
                else:
                    color = (0, 255, 0)

                # Draw bounding box
                cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)

        counts.append(people_count)

        # 🔥 Danger Score (better for small crowd)
        danger_score = min(100, int((people_count / 30) * 100))

        # 🔥 Risk classification
        if people_count < 8:
            risk = "LOW"
        elif people_count < 20:
            risk = "MEDIUM"
        else:
            risk = "HIGH"

        last_risk = risk
        last_danger_score = danger_score

        # 🔥 Heatmap processing
        heatmap_blur = cv2.GaussianBlur(heatmap_accum, (31, 31), 0)
        heatmap_norm = cv2.normalize(heatmap_blur, None, 0, 255, cv2.NORM_MINMAX)
        heatmap_color = cv2.applyColorMap(heatmap_norm.astype(np.uint8), cv2.COLORMAP_JET)

        frame = cv2.addWeighted(frame, 0.6, heatmap_color, 0.4, 0)

        # 🔥 Draw zone box
        cv2.rectangle(frame, (zone_x1, zone_y1), (zone_x2, zone_y2), (255, 0, 0), 2)

        # 🔥 TEXT (VERY IMPORTANT FOR DEMO)
        cv2.putText(frame, f"People: {people_count}", (20, 40),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)

        cv2.putText(frame, f"Risk: {risk}", (20, 80),
                    cv2.FONT_HERSHEY_SIMPLEX, 1,
                    (0, 0, 255) if risk == "HIGH" else (0, 255, 255), 2)

        cv2.putText(frame, f"Danger Score: {danger_score}", (20, 120),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

        cv2.putText(frame, f"Zone Count: {zone_count}", (20, 160),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)

        # 🔥 ALERT TEXT (better than beep)
        if risk == "HIGH":
            cv2.putText(frame, "⚠ ALERT: HIGH CROWD DENSITY!",
                        (50, height - 50),
                        cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 0, 255), 3)

        if writer:
            writer.write(frame)

    cap.release()
    if writer:
        writer.release()

    avg_people = sum(counts) / len(counts) if counts else 0
    max_people = max(counts) if counts else 0

    return {
        "risk": last_risk,
        "avg_people": round(avg_people, 2),
        "max_people": max_people,
        "danger_score": last_danger_score
    }