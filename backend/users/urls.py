from django.urls import path
from .views import LoginStep1View, LoginStep2View, ResendOTPView

urlpatterns = [
    # 2FA Authentication Endpoints
    path("auth/2fa/login/", LoginStep1View.as_view(), name="otp-request"),
    path("auth/2fa/verify/", LoginStep2View.as_view(), name="otp-verify"),
    path("auth/2fa/resend/", ResendOTPView.as_view(), name="otp-resend"),
]
