from django.urls import path
from .views import (
    FollowUserView,
    UnfollowUserView,
    GetFollowersView,
    GetFollowingView,
    SocialStatsView,
    FollowSuggestionsView,
    FollowStatusView,
)

urlpatterns = [
    path("follow/<int:user_id>/", FollowUserView.as_view(), name="follow-user"),
    path("unfollow/<int:user_id>/", UnfollowUserView.as_view(), name="unfollow-user"),
    path("followers/", GetFollowersView.as_view(), name="get-my-followers"),
    path("following/", GetFollowingView.as_view(), name="get-my-following"),
    path(
        "followers/<int:user_id>/",
        GetFollowersView.as_view(),
        name="get-user-followers",
    ),
    path(
        "following/<int:user_id>/",
        GetFollowingView.as_view(),
        name="get-user-following",
    ),
    path("stats/", SocialStatsView.as_view(), name="social-stats"),
    path("suggestions/", FollowSuggestionsView.as_view(), name="follow-suggestions"),
    path("status/<int:user_id>/", FollowStatusView.as_view(), name="follow-status"),
]
