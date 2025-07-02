"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useCallback } from "react";

interface TiptapEditorProps {
    content: string;
    onChange: (content: string) => void;
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
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
                class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4",
            },
        },
    });

    const addImage = useCallback(() => {
        const url = window.prompt(
            "이미지 URL을 입력하세요 (예: /storage/image.jpg):"
        );
        if (url && editor) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    }, [editor]);

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
