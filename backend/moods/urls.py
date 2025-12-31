from django.urls import path
from . import views

urlpatterns = [
    path("", views.MoodLogView.as_view(), name="mood-log"),
]
