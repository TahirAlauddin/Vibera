from django.urls import path
from .views import (
    OtpRequestView,
    OtpVerifyView,
    OtpResendView,
    UserProfileView,
    UserProfileDetailView,
)

urlpatterns = [
    # 2FA Authentication Endpoints
    path("auth/2fa/login/", OtpRequestView.as_view(), name="otp-request"),
    path("auth/2fa/verify/", OtpVerifyView.as_view(), name="otp-verify"),
    path("auth/2fa/resend/", OtpResendView.as_view(), name="otp-resend"),
    # User Profile Endpoints
    path("profile/", UserProfileView.as_view(), name="user-profile"),
    path("profile/<int:user_id>/", UserProfileDetailView.as_view(), name="user-profile-detail"),
]
