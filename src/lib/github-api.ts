/**
 * GitHub API를 사용하여 파일을 생성/수정하는 Vercel 친화적인 솔루션
 */

interface GitHubFileResponse {
    sha: string;
    content: string;
}

/**
 * GitHub API를 사용하여 새로운 포스트 파일을 생성하고 커밋합니다
 * @param filename 생성될 파일명 (예: "123.md")
 * @param content 파일 내용 (마크다운)
 * @param title 포스트 제목 (커밋 메시지용)
 * @param postNumber 포스트 번호
 */
export async function createPostViaGitHubAPI(
    filename: string,
    content: string,
    title: string,
    postNumber: number
): Promise<void> {
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPOSITORY; // "owner/repo" 형식

    if (!token) {
        throw new Error("GITHUB_TOKEN is required for GitHub API operations");
    }

    if (!repo) {
        throw new Error("GITHUB_REPOSITORY is required (format: owner/repo)");
    }

    try {
        const [owner, repoName] = repo.split("/");
        const path = `posts/${filename}`;
        const branch = process.env.GITHUB_BRANCH || "main";

        // Base64로 인코딩된 파일 내용
        const encodedContent = Buffer.from(content, "utf-8").toString("base64");

        // 커밋 메시지
        const message = `Add new post: ${title} (#${postNumber})`;

        // GitHub API 요청
        const response = await fetch(
            `https://api.github.com/repos/${owner}/${repoName}/contents/${path}`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/vnd.github.v3+json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message,
                    content: encodedContent,
                    branch,
                    committer: {
                        name: process.env.GIT_USER_NAME || "HareLog Bot",
                        email: process.env.GIT_USER_EMAIL || "bot@harelog.com",
                    },
                    author: {
                        name: process.env.GIT_USER_NAME || "HareLog Bot",
                        email: process.env.GIT_USER_EMAIL || "bot@harelog.com",
                    },
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                `GitHub API Error: ${response.status} - ${errorData.message}`
            );
        }

        const result = await response.json();
        console.log(`Successfully created file via GitHub API: ${path}`);
        console.log(`Commit SHA: ${result.commit.sha}`);
    } catch (error) {
        console.error("GitHub API operation failed:", error);
        throw new Error(
            `GitHub API 작업 실패: ${
                error instanceof Error ? error.message : "알 수 없는 오류"
            }`
        );
    }
}

/**
 * GitHub API를 사용하여 기존 파일을 수정합니다
 * @param filename 수정할 파일명
 * @param content 새로운 파일 내용
 * @param title 포스트 제목 (커밋 메시지용)
 * @param postNumber 포스트 번호
 */
export async function updatePostViaGitHubAPI(
    filename: string,
    content: string,
    title: string,
    postNumber: number
): Promise<void> {
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPOSITORY;

    if (!token || !repo) {
        throw new Error("GITHUB_TOKEN and GITHUB_REPOSITORY are required");
    }

    try {
        const [owner, repoName] = repo.split("/");
        const path = `posts/${filename}`;
        const branch = process.env.GITHUB_BRANCH || "main";

        // 먼저 현재 파일의 SHA를 가져옵니다
        const getCurrentFile = await fetch(
            `https://api.github.com/repos/${owner}/${repoName}/contents/${path}?ref=${branch}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/vnd.github.v3+json",
                },
            }
        );

        if (!getCurrentFile.ok) {
            throw new Error(
                `Failed to get current file: ${getCurrentFile.status}`
            );
        }

        const currentFileData: GitHubFileResponse = await getCurrentFile.json();

        // Base64로 인코딩된 새로운 파일 내용
        const encodedContent = Buffer.from(content, "utf-8").toString("base64");

        // 커밋 메시지
        const message = `Update post: ${title} (#${postNumber})`;

        // 파일 업데이트
        const response = await fetch(
            `https://api.github.com/repos/${owner}/${repoName}/contents/${path}`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/vnd.github.v3+json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message,
                    content: encodedContent,
                    sha: currentFileData.sha, // 기존 파일의 SHA 필요
                    branch,
                    committer: {
                        name: process.env.GIT_USER_NAME || "HareLog Bot",
                        email: process.env.GIT_USER_EMAIL || "bot@harelog.com",
                    },
                    author: {
                        name: process.env.GIT_USER_NAME || "HareLog Bot",
                        email: process.env.GIT_USER_EMAIL || "bot@harelog.com",
                    },
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                `GitHub API Error: ${response.status} - ${errorData.message}`
            );
        }

        const result = await response.json();
        console.log(`Successfully updated file via GitHub API: ${path}`);
        console.log(`Commit SHA: ${result.commit.sha}`);
    } catch (error) {
        console.error("GitHub API update operation failed:", error);
        throw error;
    }
}

/**
 * GitHub 리포지토리 설정이 올바른지 확인합니다
 */
export async function checkGitHubAPIConfiguration(): Promise<boolean> {
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPOSITORY;

    if (!token || !repo) {
        console.error(
            "GITHUB_TOKEN and GITHUB_REPOSITORY environment variables are required"
        );
        return false;
    }

    try {
        const [owner, repoName] = repo.split("/");

        // 리포지토리 접근 권한 확인
        const response = await fetch(
            `https://api.github.com/repos/${owner}/${repoName}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/vnd.github.v3+json",
                },
            }
        );

        if (!response.ok) {
            console.error(`GitHub API access failed: ${response.status}`);
            return false;
        }

        const repoData = await response.json();
        console.log(
            `GitHub API access confirmed for repository: ${repoData.full_name}`
        );
        return true;
    } catch (error) {
        console.error("GitHub API configuration check failed:", error);
        return false;
    }
}
