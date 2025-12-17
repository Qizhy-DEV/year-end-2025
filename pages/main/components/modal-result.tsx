"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

interface LuckyMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  luckyNumber: number;
  isLoading: boolean;
}

export function LuckyMoneyModal({
  isOpen,
  onClose,
  amount,
  isLoading,
  luckyNumber: propLuckyNumber,
}: LuckyMoneyModalProps) {
  const [displayAmount, setDisplayAmount] = useState(0);
  const [displayLucky, setDisplayLucky] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const amountTimerRef = useRef<NodeJS.Timeout | null>(null);
  const luckyTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animationDoneRef = useRef(false);

  // Hiệu ứng nhảy số cho cả số tiền và số may mắn (theo trạng thái isLoading)
  useEffect(() => {
    if (!isOpen) return;

    setIsAnimating(true);
    setDisplayAmount(0);
    setDisplayLucky(0);
    animationDoneRef.current = false;

    if (amountTimerRef.current) {
      clearInterval(amountTimerRef.current);
      amountTimerRef.current = null;
    }
    if (luckyTimerRef.current) {
      clearInterval(luckyTimerRef.current);
      luckyTimerRef.current = null;
    }

    if (isLoading) {
      amountTimerRef.current = setInterval(() => {
        setDisplayAmount(Math.floor(Math.random() * 1000000));
      }, 32);
      luckyTimerRef.current = setInterval(() => {
        setDisplayLucky(Math.floor(Math.random() * 1000));
      }, 42);

      return () => {
        if (amountTimerRef.current) {
          clearInterval(amountTimerRef.current);
          amountTimerRef.current = null;
        }
        if (luckyTimerRef.current) {
          clearInterval(luckyTimerRef.current);
          luckyTimerRef.current = null;
        }
      };
    }

    // Xử lý hiệu ứng số tiền tăng dần và số may mắn tăng dần khi không loading
    const duration = 1200; // 1.2 seconds
    const steps = 60;
    const incrementAmount = amount / steps;
    let currentStepAmount = 0;

    const incrementLucky = Math.max(
      1,
      Math.floor((propLuckyNumber || 0) / steps)
    );
    let currentLucky = 0;

    amountTimerRef.current = setInterval(() => {
      currentStepAmount++;
      if (currentStepAmount >= steps) {
        setDisplayAmount(amount);
        clearInterval(amountTimerRef.current!);
        amountTimerRef.current = null;
        animationDoneRef.current = true;
      } else {
        setDisplayAmount(Math.floor(incrementAmount * currentStepAmount));
      }
    }, duration / steps);

    luckyTimerRef.current = setInterval(() => {
      if (currentLucky + incrementLucky >= sanitizeLucky(propLuckyNumber)) {
        setDisplayLucky(sanitizeLucky(propLuckyNumber));
        clearInterval(luckyTimerRef.current!);
        luckyTimerRef.current = null;
      } else {
        currentLucky += incrementLucky;
        setDisplayLucky(currentLucky);
      }
    }, duration / steps);

    return () => {
      if (amountTimerRef.current) {
        clearInterval(amountTimerRef.current);
        amountTimerRef.current = null;
      }
      if (luckyTimerRef.current) {
        clearInterval(luckyTimerRef.current);
        luckyTimerRef.current = null;
      }
    };
  }, [isOpen, amount, isLoading, propLuckyNumber]);

  // Theo dõi trạng thái isLoading, khi hết loading thì set về giá trị amount và luckyNumber thực tế
  useEffect(() => {
    if (isOpen && !isLoading) {
      if (amountTimerRef.current) {
        clearInterval(amountTimerRef.current);
        amountTimerRef.current = null;
      }
      if (luckyTimerRef.current) {
        clearInterval(luckyTimerRef.current);
        luckyTimerRef.current = null;
      }
      setDisplayAmount(amount);
      setDisplayLucky(sanitizeLucky(propLuckyNumber));
      animationDoneRef.current = true;
    }
  }, [isLoading, isOpen, amount, propLuckyNumber]);

  if (!isOpen) return null;

  function sanitizeLucky(lucky: number) {
    // Always bound the lucky number between 0 and 999
    if (typeof lucky !== "number" || isNaN(lucky)) return 0;
    return Math.max(0, Math.min(999, Math.floor(lucky)));
  }
  function padLucky(lucky: number) {
    // Always show as 3 digits
    return sanitizeLucky(lucky).toString().padStart(3, "0");
  }

  return (
    <>
      {/* Backdrop with fade-in */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal with slide-up animation */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 transition-all duration-500 ease-out ${
          isAnimating
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0"
        }`}
      >
        <div className="bg-tet-cream rounded-t-[32px] bg-[#e2c086] shadow-2xl max-w-2xl mx-auto overflow-hidden border-t-4">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          <div className="p-8 pb-10 relative">
            {/* Decorative sparkles */}
            <div className="absolute top-8 left-8 text-2xl animate-spin-slow">
              ✨
            </div>
            <div className="absolute top-12 right-12 text-2xl animate-spin-slow animation-delay-1000">
              ✨
            </div>

            {/* Header Icon */}
            <div className="text-center mb-6 animate-bounce-gentle">
              <div className="inline-block text-7xl drop-shadow-lg animate-wiggle">
                🧧
              </div>
            </div>

            {/* Money Amount - Most Prominent */}
            <div className="text-center mb-8">
              <p className="text-tet-text-secondary text-sm font-medium mb-2 tracking-wide">
                Số tiền lì xì
              </p>
              <div className="relative inline-block">
                <div className="text-6xl md:text-7xl font-bold text-tet-red drop-shadow-lg animate-scale-in">
                  <span
                    className="overflow-hidden"
                    style={{
                      display: "inline-block",
                      minWidth: "240px",
                      textAlign: "right",
                    }}
                  >
                    {displayAmount.toLocaleString("vi-VN")}
                  </span>
                  <span className="text-4xl ml-2">₫</span>
                </div>
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine" />
              </div>
            </div>

            {/* Lucky Number */}
            <div className="flex items-center justify-center gap-3 mb-8 animate-fade-in-up animation-delay-300">
              <div className="bg-gradient-to-br from-tet-gold to-tet-gold-dark rounded-2xl px-6 py-4 shadow-lg border-2 border-tet-gold-dark">
                <p className="text-xs font-medium text-tet-red/80 mb-1 text-center">
                  Số may mắn của bạn
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xl">🍀</span>
                  <span className="text-4xl font-bold text-tet-red">
                    {padLucky(displayLucky)}
                  </span>
                  <span className="text-xl">🍀</span>
                </div>
              </div>
            </div>

            {/* Blessing Message */}
            <div className="text-center mb-8 animate-fade-in-up animation-delay-500">
              <p className="text-tet-text-primary text-lg font-medium leading-relaxed text-balance px-4">
                {isLoading && amount > 0
                  ? "Đang xử lý..."
                  : "Chúc mừng bạn đã trúng thưởng " +
                    amount.toLocaleString("vi-VN") +
                    " đồng"}
              </p>
            </div>

            {/* Action Button */}
            <div className="text-center animate-fade-in-up animation-delay-700">
              <button
                onClick={onClose}
                type="button"
                className="bg-[#D32F2F] text-white font-bold rounded-full px-12 py-6 text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Nhận Lì Xì 🎊
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
