"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LuckyMoney from "../lucky-money";
import { luckyMoneyData } from "../../data/lucky-money";
import { LuckyMoneyModal } from "../modal-result";
import { useLuckyNumber } from "@/hooks/use-lucky-number";
import { api } from "@/libs/api";
import type { User } from "@/libs/types";
import toast from "react-hot-toast";

const Main = () => {
  const [curActiveIndex, setCurActiveIndex] = useState<number>(0);
  const [isModalResultOpen, setIsModalResultOpen] = useState<boolean>(false);
  const { isPending: isLoading } = useLuckyNumber();
  const [luckyNumber, setLuckyNumber] = useState<number>(0);
  const [user, setUser] = useState<User | null>(null);
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const router = useRouter();

  // Fetch user data from userId query parameter
  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        try {
          const userData = await api.getUserById(userId);
          setUser(userData);
        } catch (error) {
          console.error("Error fetching user:", error);
          toast.error("Không tìm thấy người dùng hoặc đã xảy ra lỗi");
          router.push("/admin/qr-scanner");
        }
      }
    };

    fetchUser();
  }, [userId]);

  const handleClick = async (index: number) => {
    setCurActiveIndex(index);
    setIsModalResultOpen(true);

    // If user ID is provided (from QR check-in), use existing lucky number
    // No loading needed since we already have the number
    if (user && user.lucky_number) {
      setLuckyNumber(user.lucky_number);
      return;
    }

    // Otherwise, use the original flow with username/password
    // This will show loading state
    // Note: This fallback may not work if userId is required
    // You may want to handle this case differently
  };

  const handleCloseModal = () => {
    setIsModalResultOpen(false);
    toast.success("Đã ghi nhận số may mắn");
    router.push("/admin/qr-scanner");
  };

  return (
    <div className="h-screen w-full relative overflow-hidden">
      <div
        className="absolute -bottom-18 -left-1/3 h-16 z-50 w-3/2"
        style={{
          boxShadow: "0 -40px 40px rgba(0,0,0,1)",
        }}
      />
      <div
        className="w-full h-screen relative bg-cover bg-center"
        style={{
          backgroundImage: "url('/main-bg.png')",
        }}
      >
        {luckyMoneyData.map((item) => (
          <LuckyMoney
            key={item.id}
            image={item.image}
            className={item.className}
            isActive={curActiveIndex === item.id}
            onClick={() => handleClick(item.id)}
          />
        ))}
      </div>
      <LuckyMoneyModal
        isLoading={isLoading && !(user && user.lucky_number)}
        isOpen={isModalResultOpen}
        onClose={handleCloseModal}
        luckyNumber={luckyNumber}
      />
    </div>
  );
};

export default Main;
