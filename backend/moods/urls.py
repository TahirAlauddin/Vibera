from django.urls import path
from . import views

urlpatterns = [
    # Mood endpoints
    path("", views.MoodLogView.as_view(), name="mood-log"),
    path("<int:pk>/", views.MoodLogDetailView.as_view(), name="mood-log-detail"),
    # Tag endpoints
    path("tags/", views.MoodTagListView.as_view(), name="mood-tag-list"),
]
