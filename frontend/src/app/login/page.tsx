"use client";

import LoginModal from "../../components/loginPage";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();

    return (
        <LoginModal
            onClose={() => router.push("/")}
            onSwitch={() => router.push("/signup")}
        />
    );
}
