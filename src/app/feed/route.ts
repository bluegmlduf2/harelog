import { getAllPosts } from "@/lib/posts";

export async function GET() {
    const posts = getAllPosts();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const rssItems = posts
        .map((post) => {
            // 날짜 검증 및 fallback
            let pubDate: string;
            try {
                const postDate = new Date(post.date);
                if (isNaN(postDate.getTime())) {
                    throw new Error("Invalid date");
                }
                pubDate = postDate.toUTCString();
            } catch {
                console.warn(
                    `Invalid date for post ${post.slug}: ${post.date}`
                );
                pubDate = new Date().toUTCString();
            }

            return `
        <item>
          <title><![CDATA[${post.title}]]></title>
          <description><![CDATA[${post.title}]]></description>
          <pubDate>${pubDate}</pubDate>
          <link>${baseUrl}/posts/${post.slug}</link>
          <guid isPermaLink="true">${baseUrl}/posts/${post.slug}</guid>
          <author>HareLog</author>
          ${post.category ? `<category>${post.category}</category>` : ""}
        </item>
      `;
        })
        .join("");

    const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>HareLog</title>
    <description>Next.js와 Tailwind CSS로 만든 마크다운 기반 개발 블로그</description>
    <link>${baseUrl}</link>
    <language>ko-KR</language>
    <managingEditor>harelog@example.com (HareLog)</managingEditor>
    <webMaster>harelog@example.com (HareLog)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;

    return new Response(rssFeed, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
        },
    });
}
