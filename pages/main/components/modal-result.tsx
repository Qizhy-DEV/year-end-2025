"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface LuckyMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  luckyNumber: number;
  blessing: string;
}

export function LuckyMoneyModal({
  isOpen,
  onClose,
  amount,
  luckyNumber,
  blessing,
}: LuckyMoneyModalProps) {
  const [displayAmount, setDisplayAmount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setDisplayAmount(0);

      // Count-up animation for the amount
      const duration = 1200; // 1.2 seconds
      const steps = 60;
      const increment = amount / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          setDisplayAmount(amount);
          clearInterval(timer);
        } else {
          setDisplayAmount(Math.floor(increment * currentStep));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isOpen, amount]);

  if (!isOpen) return null;

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
                  {displayAmount.toLocaleString("vi-VN")}
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
                    {luckyNumber}
                  </span>
                  <span className="text-xl">🍀</span>
                </div>
              </div>
            </div>

            {/* Blessing Message */}
            <div className="text-center mb-8 animate-fade-in-up animation-delay-500">
              <p className="text-tet-text-primary text-lg font-medium leading-relaxed text-balance px-4">
                {blessing}
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
