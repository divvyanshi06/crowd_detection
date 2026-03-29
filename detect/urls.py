from django.urls import path
from .views import AnalyzeVideoView


urlpatterns = [
    path("analyze-video/", AnalyzeVideoView.as_view(), name="analyze-video"),
]