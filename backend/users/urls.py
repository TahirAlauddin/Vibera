from django.urls import path
from .views import LoginStep1View, LoginStep2View, ResendOTPView

urlpatterns = [
    # 2FA Authentication Endpoints
    path("auth/2fa/step1/", LoginStep1View.as_view(), name="login-step1"),
    path("auth/2fa/step2/", LoginStep2View.as_view(), name="login-step2"),
    path("auth/2fa/resend/", ResendOTPView.as_view(), name="resend-otp"),
]

