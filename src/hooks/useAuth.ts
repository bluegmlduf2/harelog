import { useState, useEffect } from "react";

// useAuth 훅을 사용하여 로그인 상태와 로딩 상태를 동적으로 관리합니다.
// 이 훅은 인증 상태를 확인하고, 로딩이 완료되면 해당 상태를 반환합니다.
// 인증 상태에 따라 화면 렌더링을 조정하기 위해 사용됩니다.
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
