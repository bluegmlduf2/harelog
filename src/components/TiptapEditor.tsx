"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useCallback, useEffect } from "react";

interface TiptapEditorProps {
    content: string;
    onChange: (content: string) => void;
    onImageUpload?: (file: File) => Promise<string>;
}

export default function TiptapEditor({
    content,
    onChange,
    onImageUpload,
}: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
            }),
            Image,
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-h1:text-3xl prose-h1:border-b prose-h1:border-gray-200 prose-h1:pb-3 prose-h1:mb-6 prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-blue-700 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-gray-800 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium prose-strong:text-gray-900 prose-strong:font-semibold prose-code:text-pink-500 prose-code:bg-pink-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto prose-ul:space-y-2 prose-ol:space-y-2 prose-li:text-gray-700 prose-img:rounded-lg prose-img:shadow-md [&_pre_code]:text-gray-100 [&_pre_code]:bg-gray-900 mx-auto focus:outline-none min-h-[300px] p-4",
            },
        },
    });

    // content prop이 변경될 때 에디터 내용 업데이트
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [editor, content]);

    const addImage = useCallback(() => {
        // 파일 선택 input 생성
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file && onImageUpload && editor) {
                try {
                    // 로딩 표시
                    editor
                        .chain()
                        .focus()
                        .setImage({
                            src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40NzcgMiAyIDYuNDc3IDIgMTJTNi40NzcgMjIgMTIgMjJTMjIgMTcuNTIzIDIyIDEyUzE3LjUyMyAyIDEyIDJaTTEyIDIwQzcuNTg5IDIwIDQgMTYuNDExIDQgMTJTNy41ODkgNDEyIDRTMjAgNy41ODkgMjAgMTJTMTYuNDExIDIwIDEyIDIwWiIgZmlsbD0iIzk5OTk5OSIvPgo8cGF0aCBkPSJNMTIgNkMxMS40NDc3IDYgMTEgNi40NDc3MiAxMSA3VjExSDdDNi40NDc3MiAxMSA2IDExLjQ0NzcgNiAxMkM2IDEyLjU1MjMgNi40NDc3MiAxMyA3IDEzSDExVjE3QzExIDE3LjU1MjMgMTEuNDQ3NyAxOCAxMiAxOEMxMi41NTIzIDE4IDEzIDE3LjU1MjMgMTMgMTdWMTNIMTdDMTcuNTUyMyAxMyAxOCAxMi41NTIzIDE4IDEyQzE4IDExLjQ0NzcgMTcuNTUyMyAxMSAxNyAxMUgxM1Y3QzEzIDYuNDQ3NzIgMTIuNTUyMyA2IDEyIDZaIiBmaWxsPSIjOTk5OTk5Ii8+Cjwvc3ZnPgo=",
                            alt: "이미지 업로드 중...",
                        })
                        .run();

                    // 이미지 업로드
                    const imageUrl = await onImageUpload(file);

                    // 플레이스홀더를 실제 이미지로 교체
                    editor
                        .chain()
                        .focus()
                        .setImage({ src: imageUrl, alt: file.name })
                        .run();
                } catch (error) {
                    console.error("이미지 업로드 실패:", error);
                    alert("이미지 업로드에 실패했습니다.");
                }
            }
        };

        input.click();
    }, [editor, onImageUpload]);

    const setLink = useCallback(() => {
        const previousUrl = editor?.getAttributes("link").href;
        const url = window.prompt("링크 URL을 입력하세요:", previousUrl);

        if (url === null) {
            return;
        }

        if (url === "") {
            editor?.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }

        editor
            ?.chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url })
            .run();
    }, [editor]);

    if (!editor) {
        return (
            <div className="min-h-[300px] bg-gray-100 rounded animate-pulse" />
        );
    }

    return (
        <div className="tiptap-editor">
            {/* 툴바 */}
            <div className="border-b border-gray-200 p-2 flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`px-3 py-1 rounded text-sm ${
                        editor.isActive("bold")
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    굵게
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`px-3 py-1 rounded text-sm ${
                        editor.isActive("italic")
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    기울임
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className={`px-3 py-1 rounded text-sm ${
                        editor.isActive("code")
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    코드
                </button>
                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    className={`px-3 py-1 rounded text-sm ${
                        editor.isActive("heading", { level: 1 })
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    H1
                </button>
                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    className={`px-3 py-1 rounded text-sm ${
                        editor.isActive("heading", { level: 2 })
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    H2
                </button>
                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                    className={`px-3 py-1 rounded text-sm ${
                        editor.isActive("heading", { level: 3 })
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    H3
                </button>
                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                    className={`px-3 py-1 rounded text-sm ${
                        editor.isActive("bulletList")
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    목록
                </button>
                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                    className={`px-3 py-1 rounded text-sm ${
                        editor.isActive("orderedList")
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    번호목록
                </button>
                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleCodeBlock().run()
                    }
                    className={`px-3 py-1 rounded text-sm ${
                        editor.isActive("codeBlock")
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    코드블록
                </button>
                <button
                    type="button"
                    onClick={setLink}
                    className={`px-3 py-1 rounded text-sm ${
                        editor.isActive("link")
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    링크
                </button>
                <button
                    type="button"
                    onClick={addImage}
                    className="px-3 py-1 rounded text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                    이미지
                </button>
            </div>

            {/* 에디터 컨텐츠 */}
            <EditorContent editor={editor} />

            {/* CSS 스타일 */}
            <style jsx global>{`
                .tiptap-editor .ProseMirror {
                    outline: none;
                }

                .tiptap-editor
                    .ProseMirror
                    p.is-editor-empty:first-child::before {
                    color: #adb5bd;
                    content: "내용을 입력하세요...";
                    float: left;
                    height: 0;
                    pointer-events: none;
                }

                .tiptap-editor .ProseMirror h1 {
                    font-size: 1.875rem;
                    font-weight: 700;
                    margin: 1rem 0;
                }

                .tiptap-editor .ProseMirror h2 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin: 0.75rem 0;
                }

                .tiptap-editor .ProseMirror h3 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin: 0.5rem 0;
                }

                .tiptap-editor .ProseMirror ul,
                .tiptap-editor .ProseMirror ol {
                    padding-left: 1.5rem;
                    margin: 0.5rem 0;
                }

                .tiptap-editor .ProseMirror li {
                    margin: 0.25rem 0;
                }

                .tiptap-editor .ProseMirror code {
                    background-color: #f3f4f6;
                    padding: 0.125rem 0.25rem;
                    border-radius: 0.25rem;
                    font-family: ui-monospace, SFMono-Regular, monospace;
                    font-size: 0.875em;
                }

                .tiptap-editor .ProseMirror pre {
                    background-color: #1f2937;
                    color: #f9fafb;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    overflow-x: auto;
                    margin: 1rem 0;
                }

                .tiptap-editor .ProseMirror pre code {
                    background: none;
                    padding: 0;
                    color: inherit;
                }

                .tiptap-editor .ProseMirror a {
                    color: #2563eb;
                    text-decoration: underline;
                }

                .tiptap-editor .ProseMirror img {
                    max-width: 100%;
                    height: auto;
                    margin: 1rem 0;
                    border-radius: 0.5rem;
                }
            `}</style>
        </div>
    );
}
