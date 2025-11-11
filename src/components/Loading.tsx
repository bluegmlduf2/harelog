"use client";

type LoadingProps = {
    display?: "" | "inline-block";
    size?: "small" | "normal" | "big";
};

export default function Loading({
    display = "",
    size = "normal",
}: LoadingProps) {
    const displayClass = display === "inline-block" ? "inline-block" : "";
    const sizeClass = {
        small: "h-6 w-6",
        normal: "h-8 w-8",
        big: "h-12 w-12",
    }[size];

    return (
        <div
            className={`animate-spin rounded-full border-t-2 border-b-2 mx-auto border-blue-600 ${displayClass} ${sizeClass}`}
        />
    );
}
