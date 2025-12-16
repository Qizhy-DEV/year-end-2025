"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const EVENT_DATE = new Date("2026-01-31T19:00:00");

const Page = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const diff = EVENT_DATE.getTime() - new Date().getTime();
    if (diff <= 0) return null;

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen relative bg-gradient-to-br from-black via-gray-800 via-35% via-violet-800/100 to-black flex items-center justify-center px-4 overflow-hidden">
      <div
        className="absolute -bottom-18 -left-1/3 h-16 w-3/2"
        style={{
          boxShadow: "0 -40px 40px rgba(0,0,0,1)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-3xl w-full text-center text-white"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="uppercase tracking-widest text-sm text-gray-400 mb-4"
        >
          Coming Soon
        </motion.p>
        <div className="flex justify-center items-center mb-4">
          <Image
            src="/hdwebsoft-logo-blue-new.svg"
            alt="HDWebsoft Logo"
            width={200}
            height={40}
            priority
          />
        </div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-4xl md:text-6xl font-extrabold mb-6"
        >
          Year End Party <span className="text-indigo-500">2025</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-300 text-lg mb-10"
        >
          We’re preparing something special to close 2025 with unforgettable
          moments. Stay tuned!
        </motion.p>

        {timeLeft ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15 },
              },
            }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            {Object.entries(timeLeft).map(([label, value]) => (
              <motion.div
                key={label}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="bg-white/5 backdrop-blur rounded-2xl py-6 shadow-lg"
              >
                <p className="text-3xl font-bold">{value}</p>
                <p className="uppercase text-xs tracking-widest text-gray-400 mt-1">
                  {label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl font-semibold text-indigo-400"
          >
            The event has started 🎉
          </motion.p>
        )}

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-gray-500 text-sm"
        >
          © 2025 HDWebsoft. All rights reserved.
        </motion.footer>
      </motion.div>
    </main>
  );
};

export default Page;
