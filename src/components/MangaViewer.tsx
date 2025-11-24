"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { MangaPage } from "@/lib/github";

interface MangaViewerProps {
    pages: MangaPage[];
}

export default function MangaViewer({ pages }: MangaViewerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isClient, setIsClient] = useState(false);

    // クライアントサイドでのみ実行（localStorageアクセス用）
    useEffect(() => {
        setIsClient(true);
        const savedIndex = localStorage.getItem("guda_progress");
        if (savedIndex) {
            const index = parseInt(savedIndex, 10);
            if (!isNaN(index) && index >= 0 && index < pages.length) {
                setCurrentIndex(index);
            }
        }
    }, [pages.length]);

    // ページ変更時に進捗を保存
    useEffect(() => {
        if (isClient) {
            localStorage.setItem("guda_progress", currentIndex.toString());
        }
    }, [currentIndex, isClient]);

    const paginate = (newDirection: number) => {
        const nextIndex = currentIndex + newDirection;
        if (nextIndex >= 0 && nextIndex < pages.length) {
            setDirection(newDirection);
            setCurrentIndex(nextIndex);
        }
    };

    const variants = {
        enter: (direction: number) => {
            return {
                x: direction > 0 ? 1000 : -1000,
                opacity: 0,
            };
        },
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => {
            return {
                zIndex: 0,
                x: direction < 0 ? 1000 : -1000,
                opacity: 0,
            };
        },
    };

    if (pages.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen text-gray-500">
                ページが見つかりません。
            </div>
        );
    }

    return (
        <div className="relative w-full h-screen flex flex-col items-center justify-center bg-cream-100 overflow-hidden">
            {/* ナビゲーションボタン（PC用） */}
            <button
                className="absolute left-4 z-10 p-2 rounded-full bg-white/50 hover:bg-white/80 hidden md:block"
                onClick={() => paginate(-1)}
                disabled={currentIndex === 0}
            >
                <ChevronLeft size={32} />
            </button>
            <button
                className="absolute right-4 z-10 p-2 rounded-full bg-white/50 hover:bg-white/80 hidden md:block"
                onClick={() => paginate(1)}
                disabled={currentIndex === pages.length - 1}
            >
                <ChevronRight size={32} />
            </button>

            {/* 画像表示エリア */}
            <div className="relative w-full max-w-3xl aspect-[3/4] md:aspect-auto md:h-[90vh] flex items-center justify-center">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.img
                        key={currentIndex}
                        src={pages[currentIndex].url}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 },
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = swipePower(offset.x, velocity.x);

                            if (swipe < -swipeConfidenceThreshold) {
                                paginate(1);
                            } else if (swipe > swipeConfidenceThreshold) {
                                paginate(-1);
                            }
                        }}
                        className="absolute max-w-full max-h-full object-contain shadow-lg rounded-sm bg-white"
                        alt={`Page ${currentIndex + 1}`}
                    />
                </AnimatePresence>
            </div>

            {/* ページ番号とタイトル */}
            <div className="absolute bottom-4 left-0 right-0 text-center text-gray-600 bg-white/30 backdrop-blur-sm py-2">
                <p className="text-sm font-medium">
                    {pages[currentIndex].title} - {currentIndex + 1} / {pages.length}
                </p>
            </div>

            {/* モバイル用タップエリア（左右の端） */}
            <div className="absolute inset-y-0 left-0 w-1/4 z-0 md:hidden" onClick={() => paginate(-1)} />
            <div className="absolute inset-y-0 right-0 w-1/4 z-0 md:hidden" onClick={() => paginate(1)} />
        </div>
    );
}

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
};
