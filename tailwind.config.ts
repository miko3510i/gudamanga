import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                cream: {
                    100: "#FDFBF7",
                    200: "#F5F0E6",
                },
                pastel: {
                    pink: "#FFD1DC",
                    blue: "#AEC6CF",
                    green: "#77DD77",
                    yellow: "#FDFD96",
                },
            },
            fontFamily: {
                sans: ['var(--font-geist-sans)', 'sans-serif'], // デフォルト
                // 必要に応じて手書き風フォントを追加
            },
        },
    },
    plugins: [],
} satisfies Config;
