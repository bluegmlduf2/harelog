"use client";

type LoadingProps = {
    color?: "gray" | "blue";
    display?: "" | "inline-block";
    size?: "small" | "normal" | "big";
};

export default function Loading({
    color = "blue",
    display = "",
    size = "normal",
}: LoadingProps) {
    const borderColor =
        color === "blue" ? "border-blue-600" : "border-gray-900";
    const displayClass = display === "inline-block" ? "inline-block" : "";
    const sizeClass = {
        small: '"h-6 w-6',
        normal: "h-8 w-8",
        big: '"h-12 w-12',
    }[size];

    return (
        <div
            className={`animate-spin rounded-full border-t-2 border-b-2
                     ${borderColor} 
                     ${displayClass}
                     ${sizeClass}`}
        />
    );
}
