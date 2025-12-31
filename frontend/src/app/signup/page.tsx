"use client";

import SignUpModal from "../../components/signupPage";
import { useRouter } from "next/navigation";

export default function Signup() {
    const router = useRouter();

    return (
        <SignUpModal
            onClose={() => router.push("/")}
            onSwitch={() => router.push("/login")}
        />
    );
}
