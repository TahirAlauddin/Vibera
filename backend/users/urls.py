from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    OtpRequestView,
    OtpVerifyView,
    OtpResendView,
    UserProfileViewSet,
)

router = DefaultRouter()
router.register(r"profiles", UserProfileViewSet, basename="userprofile")

urlpatterns = [
    # 2FA Authentication Endpoints
    path("auth/2fa/login/", OtpRequestView.as_view(), name="otp-request"),
    path("auth/2fa/verify/", OtpVerifyView.as_view(), name="otp-verify"),
    path("auth/2fa/resend/", OtpResendView.as_view(), name="otp-resend"),
    # User Profile Endpoints (via router)
    path("", include(router.urls)),
]
