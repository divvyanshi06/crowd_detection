# 🚨 Crowd Intelligence System

A full-stack project that detects crowd density and predicts **stampede risk** from video input using YOLOv8.

---

## 🎯 Features

* Upload video from frontend
* Detect people using YOLOv8
* Calculate crowd density
* Predict risk level:

  * 🟢 LOW
  * 🟡 MEDIUM
  * 🔴 HIGH
* Returns processed video with bounding boxes

---

## 🛠️ Tech Stack

* **Backend:** Django, Django REST Framework
* **Frontend:** React (Vite)
* **AI:** YOLOv8 (Ultralytics), OpenCV

---

## ⚙️ Setup Instructions

### 🔹 1. Clone Repository

```bash
git clone https://github.com/divvyanshi06/crowd_detection.git
cd crowd_detection
```

---

### 🔹 2. Backend Setup (Django)

```bash
pip install -r requirements.txt
python manage.py runserver
```

Backend runs at:

```
http://127.0.0.1:8000/
```

---

### 🔹 3. Frontend Setup (React)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173/
```

---

## 📡 API Endpoint

### POST `/api/analyze-video/`

**Request:**

* `video` → video file

**Response:**

```json
{
  "status": "success",
  "risk": "HIGH",
  "avg_people": 25,
  "max_people": 40,
  "processed_video": "http://..."
}
```

---

## 📸 Demo

### UI Screenshot

![App Screenshot](https://github.com/user-attachments/assets/59424f50-f5de-4d01-b6b7-967cc3383380)

---

### 🎥 Demo Video

https://github.com/user-attachments/assets/29cdc3f5-73ed-4cea-be95-6c66d3ca0fd5

---

## ⚠️ Notes

* Ensure backend is running before frontend
* Model (`yolov8n.pt`) will auto-download if not present
* Use small videos for testing

---

## 👥 Contributors

* divvyanshi06
* Rohan-nn
* failedengineer



https://github.com/user-attachments/assets/29cdc3f5-73ed-4cea-be95-6c66d3ca0fd5

<img width="1747" height="980" alt="Screenshot 2026-03-29 174954" src="https://github.com/user-attachments/assets/59424f50-f5de-4d01-b6b7-967cc3383380" />
