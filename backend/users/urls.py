from django.urls import path
from .views import OtpRequestView, OtpVerifyView, OtpResendView

urlpatterns = [
    # 2FA Authentication Endpoints
    path("auth/2fa/login/", OtpRequestView.as_view(), name="otp-request"),
    path("auth/2fa/verify/", OtpVerifyView.as_view(), name="otp-verify"),
    path("auth/2fa/resend/", OtpResendView.as_view(), name="otp-resend"),
]
