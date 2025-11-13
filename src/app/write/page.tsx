import ProtectedWritePage from "@/components/ProtectedWritePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "글쓰기 - WallyLog",
    description: "새로운 포스트를 작성합니다",
};

export default function WritePage() {
    return <ProtectedWritePage />;
}
