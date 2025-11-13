import LoginForm from "@/components/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "관리자 로그인 - WallyLog",
    description: "관리자 로그인",
};

export default function LoginPage() {
    return (
        <div className="max-w-md mx-auto px-4 py-16">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    관리자 로그인
                </h1>
                <LoginForm />
            </div>
        </div>
    );
}
