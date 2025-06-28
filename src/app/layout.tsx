import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "HareLog",
        template: "%s | HareLog",
    },
    description: "개발 블로그 및 일상생활 기록을 위한 공간",
    keywords: [
        "Next.js",
        "React",
        "Vue.js",
        "CSS",
        "HTML",
        "Javascript",
        "TypeScript",
        "Tailwind CSS",
        "Lalavel",
        "일본생활",
        "블로그",
        "개발",
    ],
    authors: [{ name: "Hare" }],
    creator: "HareLog",
    publisher: "HareLog",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    ),
    alternates: {
        canonical: "/",
    },
    // 아이콘 설정
    icons: {
        icon: [
            { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
            { url: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
            { url: "/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
            { url: "/icon-512.svg", sizes: "512x512", type: "image/svg+xml" },
        ],
        apple: [
            {
                url: "/apple-touch-icon.svg",
                sizes: "180x180",
                type: "image/svg+xml",
            },
        ],
        other: [
            {
                rel: "mask-icon",
                url: "/favicon.svg",
                color: "#3B82F6",
            },
        ],
    },
    // PWA 설정
    manifest: "/manifest.json",
    openGraph: {
        type: "website",
        locale: "ko_KR",
        url: "/",
        title: "HareLog",
        description: "개발 블로그 및 일상생활 기록을 위한 공간",
        siteName: "HareLog",
    },
    twitter: {
        card: "summary_large_image",
        title: "HareLog",
        description: "개발 블로그 및 일상생활 기록을 위한 공간",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <head>
                {/* RSS Feed */}
                <link
                    rel="alternate"
                    type="application/rss+xml"
                    title="HareLog RSS Feed"
                    href="/feed"
                />
                {/* 브라우저별 최적화 */}
                <meta name="msapplication-TileColor" content="#3B82F6" />
                <meta
                    name="msapplication-config"
                    content="/browserconfig.xml"
                />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta
                    name="apple-mobile-web-app-status-bar-style"
                    content="default"
                />
                <meta name="apple-mobile-web-app-title" content="HareLog" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="theme-color" content="#3B82F6" />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}
