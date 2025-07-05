/**
 * GitHub API 관련 유틸리티 함수들
 */

interface GitHubConfig {
    token: string;
    repository: string;
    branch: string;
    userInfo: {
        name: string;
        email: string;
    };
}

/**
 * 환경 변수에서 GitHub 설정을 가져옵니다
 */
export function getGitHubConfig(): GitHubConfig {
    const token = process.env.GITHUB_TOKEN;
    const repository = process.env.GITHUB_REPOSITORY;
    const branch = process.env.GITHUB_BRANCH || "main";
    const userName = process.env.GIT_USER_NAME || "HareLog Bot";
    const userEmail = process.env.GIT_USER_EMAIL || "bot@harelog.com";

    if (!token || !repository) {
        throw new Error(
            "GitHub 설정이 올바르지 않습니다. GITHUB_TOKEN과 GITHUB_REPOSITORY를 확인해주세요."
        );
    }

    return {
        token,
        repository,
        branch,
        userInfo: {
            name: userName,
            email: userEmail,
        },
    };
}

/**
 * GitHub API 요청을 위한 공통 헤더를 생성합니다
 */
export function getGitHubHeaders(token: string) {
    return {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github.v3+json",
    };
}

/**
 * GitHub에 파일을 업로드합니다
 */
export async function uploadFileToGitHub({
    path,
    content,
    message,
    isBase64 = false,
}: {
    path: string;
    content: string;
    message: string;
    isBase64?: boolean;
}): Promise<{ url: string; downloadUrl: string; htmlUrl: string }> {
    const config = getGitHubConfig();
    const apiUrl = `https://api.github.com/repos/${config.repository}/contents/${path}`;

    const response = await fetch(apiUrl, {
        method: "PUT",
        headers: getGitHubHeaders(config.token),
        body: JSON.stringify({
            message,
            content: isBase64
                ? content
                : Buffer.from(content).toString("base64"),
            branch: config.branch,
            committer: config.userInfo,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("GitHub API 업로드 오류:", errorText);
        throw new Error(`GitHub에 파일 업로드 실패: ${response.status}`);
    }

    const result = await response.json();

    // GitHub Raw URL 생성
    const rawUrl = `https://raw.githubusercontent.com/${config.repository}/${config.branch}/${path}`;

    return {
        url: rawUrl,
        downloadUrl: result.content.download_url,
        htmlUrl: result.content.html_url,
    };
}

/**
 * GitHub에서 파일을 삭제합니다
 */
export async function deleteFileFromGitHub({
    path,
    message,
}: {
    path: string;
    message: string;
}): Promise<void> {
    const config = getGitHubConfig();
    const apiUrl = `https://api.github.com/repos/${config.repository}/contents/${path}`;

    // 먼저 파일 정보를 가져와서 SHA 값을 얻습니다
    const getFileResponse = await fetch(`${apiUrl}?ref=${config.branch}`, {
        headers: getGitHubHeaders(config.token),
    });

    if (!getFileResponse.ok) {
        if (getFileResponse.status === 404) {
            throw new Error("삭제하려는 파일을 찾을 수 없습니다.");
        }
        throw new Error(
            `파일 정보를 가져올 수 없습니다: ${getFileResponse.status}`
        );
    }

    const fileInfo = await getFileResponse.json();
    const sha = fileInfo.sha;

    // 파일 삭제
    const deleteResponse = await fetch(apiUrl, {
        method: "DELETE",
        headers: getGitHubHeaders(config.token),
        body: JSON.stringify({
            message,
            sha,
            branch: config.branch,
            committer: config.userInfo,
        }),
    });

    if (!deleteResponse.ok) {
        const errorText = await deleteResponse.text();
        console.error("GitHub API 삭제 오류:", errorText);
        throw new Error(`GitHub에서 파일 삭제 실패: ${deleteResponse.status}`);
    }
}

/**
 * 마크다운 파일을 위한 front matter와 함께 GitHub에 업로드합니다
 */
export async function uploadMarkdownPost({
    slug,
    title,
    category,
    content,
}: {
    slug: string;
    title: string;
    category: string;
    content: string;
}): Promise<{ url: string; filename: string }> {
    const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD 형식

    const frontMatter = `---
title: "${title}"
date: "${date}"
category: "${category}"
---

${content}`;

    const filename = `${slug}.md`;
    const result = await uploadFileToGitHub({
        path: `posts/${filename}`,
        content: frontMatter,
        message: `포스트 추가: ${title}`,
    });

    return {
        url: result.url,
        filename,
    };
}

/**
 * 이미지 파일을 GitHub에 업로드합니다
 */
export async function uploadImageToGitHub(
    file: File
): Promise<{ url: string; filename: string; githubUrl: string }> {
    const timestamp = Math.floor(Date.now() / 1000);
    const extension = file.name.split(".").pop() || "jpg";
    const filename = `${timestamp}.${extension}`;

    const buffer = await file.arrayBuffer();
    const base64Content = Buffer.from(buffer).toString("base64");

    const result = await uploadFileToGitHub({
        path: `public/storage/${filename}`,
        content: base64Content,
        message: `이미지 업로드: ${filename}`,
        isBase64: true,
    });

    return {
        url: result.url,
        filename,
        githubUrl: result.htmlUrl,
    };
}
