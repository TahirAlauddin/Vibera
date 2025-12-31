"use client";

import SignUpModal from "../../../../components/signupPage";
import { useRouter } from "next/navigation";

export default function SignupInterceptRoute() {
    const router = useRouter();

    return (
        <SignUpModal
            onClose={() => router.back()}
            onSwitch={() => router.push("/login")}
        />
    );
}
