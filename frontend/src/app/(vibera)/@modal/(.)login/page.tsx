"use client";

import LoginModal from "../../../../components/loginPage";
import { useRouter } from "next/navigation";

export default function LoginInterceptRoute() {
    const router = useRouter();

    return (
        <LoginModal
            onClose={() => router.back()}
            onSwitch={() => router.push("/signup")}
        />
    );
}
