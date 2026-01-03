'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

export default function AnimatedThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null; // prevent SSR mismatch

    const isDark = theme === 'dark';

    return (
        <button onClick={() => setTheme(isDark ? 'light' : 'dark')}>
            <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                    <motion.div
                        key="sun"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                    >
                        <Sun className="w-4 h-4 cursor-pointer text-foreground" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="moon"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                    >
                        <Moon className="w-4 h-4 cursor-pointer text-foreground" />
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    );
}
