import cv2
from ultralytics import YOLO

# Load pretrained YOLOv8 model once
MODEL = YOLO("yolov8n.pt")

def classify_risk(max_people, avg_people):
    if max_people < 10 and avg_people < 5:
        return "LOW"
    elif max_people < 25 and avg_people < 12:
        return "MEDIUM"
    return "HIGH"

def analyze_video(video_path, output_path=None):
    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        raise ValueError("Could not open video")

    fps = cap.get(cv2.CAP_PROP_FPS) or 25
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    writer = None
    if output_path:
        fourcc = cv2.VideoWriter_fourcc(*"mp4v")
        writer = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

    counts = []

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        results = MODEL(frame, verbose=False)[0]
        person_boxes = []

        for box in results.boxes:
            class_id = int(box.cls[0])
        
            confidence = float(box.conf[0])

            # COCO class 0 = person
            if class_id == 0 and confidence >= 0.4:
                person_boxes.append(box)

        count = len(person_boxes)
        counts.append(count)

        # draw boxes
        for box in person_boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            conf = float(box.conf[0])

            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(
                frame,
                f"person {conf:.2f}",
                (x1, max(y1 - 10, 20)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                (0, 255, 0),
                2
            )

        cv2.putText(
            frame,
            f"People: {count}",
            (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0, 0, 255),
            2
        )

        if writer:
            writer.write(frame)

    cap.release()
    if writer:
        writer.release()

    if not counts:
        return {
            "risk": "LOW",
            "avg_people": 0,
            "max_people": 0,
            "frame_count": 0
        }

    avg_people = sum(counts) / len(counts)
    max_people = max(counts)
    risk = classify_risk(max_people, avg_people)

    return {
        "risk": risk,
        "avg_people": round(avg_people, 2),
        "max_people": max_people,
        "frame_count": len(counts)
    }