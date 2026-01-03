import { Suspense } from "react";
import ParticipantsPage from "@/components/admin/participants";

export default function Page() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-64">Đang tải...</div>}>
            <ParticipantsPage />
        </Suspense>
    );
}
