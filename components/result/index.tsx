import Image from "next/image";
import { useAuth } from "@/context/auth-context";

const padLuckyNumber = (num: number) => num.toString().padStart(3, "0");

const ResultPage = () => {
  const { user } = useAuth();
  if (!user) return null;
  const luckyNumber = user.lucky ?? 0;

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#efd4aa] relative px-4">
      {/* Decorative stars */}
      <div className="absolute top-6 left-6 animate-pulse">
        <span className="text-yellow-400 text-xl">✨</span>
      </div>
      <div className="absolute top-6 right-6 animate-pulse">
        <span className="text-yellow-400 text-xl">✨</span>
      </div>
      <div className="absolute bottom-6 left-8 animate-pulse">
        <span className="text-yellow-400 text-lg">✨</span>
      </div>
      <div className="absolute bottom-6 right-8 animate-pulse">
        <span className="text-yellow-400 text-lg">✨</span>
      </div>

      <div className="bg-[#efd4aa] flex flex-col items-center px-8 py-10 rounded-xl shadow-2xl z-10 w-full max-w-sm border border-[#e5b772]">
        {/* Red envelope image */}
        <Image
          src="/hdwebsoft-blue.svg"
          alt="Red Envelope"
          width={150}
          height={70}
          className="mx-auto mb-2"
          priority
        />

        <div className="text-center mb-2 mt-2">
          <p className="text-[#222] font-semibold text-md">
            Số may mắn của bạn
          </p>
        </div>

        {/* Lucky number display */}
        <div className="flex items-center justify-center my-2">
          <span className="text-3xl mr-2">🍀</span>
          <span className="font-bold text-5xl tracking-widest text-[#333] drop-shadow">
            {padLuckyNumber(luckyNumber)}
          </span>
          <span className="text-3xl ml-2">🍀</span>
        </div>

        {/* Congratulations text */}
        <p className="text-center text-lg text-[#222] font-medium mt-4">
          Chúc mừng bạn có số may mắn&nbsp;
          <span className="font-bold text-[#333]">
            {padLuckyNumber(luckyNumber)}
          </span>
        </p>
      </div>
    </main>
  );
};

export default ResultPage;
