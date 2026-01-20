from django.urls import path
from .views import FollowUserView, UnfollowUserView, GetFollowersView, GetFollowingView

urlpatterns = [
    # Follow/Unfollow actions
    path("follow/<int:user_id>/", FollowUserView.as_view(), name="follow-user"),
    path("unfollow/<int:user_id>/", UnfollowUserView.as_view(), name="unfollow-user"),
    # Get my followers/following
    path("followers/", GetFollowersView.as_view(), name="get-my-followers"),
    path("following/", GetFollowingView.as_view(), name="get-my-following"),
    # Get a specific user's followers/following
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
]
