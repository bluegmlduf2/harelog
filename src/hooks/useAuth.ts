import { useState, useEffect } from "react";

// useAuth 훅은 현재 사용자의 인증 상태를 확인하고,
// 인증 여부(`isAuthenticated`)와 로딩 상태(`isLoading`)를 반환합니다.
// 주로 인증 여부에 따라 페이지 또는 컴포넌트의 렌더링을 즉각적으로 제어할 때 사용됩니다.
export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("/api/auth/check", {
                    credentials: "include",
                });

                if (response.ok) {
                    const data = await response.json();
                    setIsAuthenticated(data.authenticated);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Auth check error:", error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    return { isAuthenticated, isLoading };
}
