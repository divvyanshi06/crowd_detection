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

        upload_dir = os.path.join(str(settings.MEDIA_ROOT), "uploads")
        processed_dir = os.path.join(str(settings.MEDIA_ROOT), "processed")
        os.makedirs(upload_dir, exist_ok=True)
        os.makedirs(processed_dir, exist_ok=True)

        file_id = uuid.uuid4().hex
        ext = os.path.splitext(video.name)[1] or ".mp4"

        input_path = os.path.join(upload_dir, f"{file_id}{ext}")
        output_path = os.path.join(processed_dir, f"{file_id}_boxed.avi")
        

        # save uploaded video
        with open(input_path, "wb+") as f:
            for chunk in video.chunks():
                f.write(chunk)

        # process video
        result = analyze_video(input_path, output_path)

        response_data = {
            "status": "success",
            "risk": result["risk"],
            "avg_people": result["avg_people"],
            "max_people": result["max_people"],
        }

        # optional output video link
        if os.path.exists(output_path):
            response_data["processed_video"] = request.build_absolute_uri(
                f"{settings.MEDIA_URL}processed/{file_id}_boxed.avi"
            )

        return Response(response_data, status=200)