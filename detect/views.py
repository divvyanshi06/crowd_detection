import os
import uuid

from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from .utils import analyze_video


class AnalyzeVideoView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        video = request.FILES.get("video")

        if not video:
            return Response(
                {"status": "error", "message": "No video uploaded"},
                status=400
            )

        # Create directories
        upload_dir = os.path.join(str(settings.MEDIA_ROOT), "uploads")
        processed_dir = os.path.join(str(settings.MEDIA_ROOT), "processed")
        os.makedirs(upload_dir, exist_ok=True)
        os.makedirs(processed_dir, exist_ok=True)

        # Unique file name
        file_id = uuid.uuid4().hex
        ext = os.path.splitext(video.name)[1] or ".mp4"

        input_path = os.path.join(upload_dir, f"{file_id}{ext}")
        output_path = os.path.join(processed_dir, f"{file_id}_boxed.avi")

        # Save uploaded video
        try:
            with open(input_path, "wb+") as f:
                for chunk in video.chunks():
                    f.write(chunk)
        except Exception as e:
            return Response(
                {"status": "error", "message": f"File save error: {str(e)}"},
                status=500
            )

        # Run AI processing
        try:
            result = analyze_video(input_path, output_path)
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response(
                {"status": "error", "message": str(e)},
                status=500
            )

        # ✅ FINAL RESPONSE
        response_data = {
            "status": "success",
            "risk": result.get("risk"),
            "avg_people": result.get("avg_people"),
            "max_people": result.get("max_people"),
            "danger_score": result.get("danger_score", 0),
            "frame_counts": result.get("frame_counts", []),   # per-frame people count
            "total_frames": result.get("total_frames", 0),   # sampled frame count
        }

        # Add processed video
        if os.path.exists(output_path):
            response_data["processed_video"] = request.build_absolute_uri(
                f"{settings.MEDIA_URL}processed/{file_id}_boxed.avi"
            )

        return Response(response_data, status=200)