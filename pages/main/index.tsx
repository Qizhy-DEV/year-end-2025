import { useState } from "react";
import LuckyMoney from "./components/lucky-money";
import { luckyMoneyData } from "./data/lucky-money";
import { LuckyMoneyModal } from "./components/modal-result";

const Main = () => {
  const [curActiveIndex, setCurActiveIndex] = useState<number>(0);
  const [isModalResultOpen, setIsModalResultOpen] = useState<boolean>(false);

  const handleClick = (index: number) => {
    setCurActiveIndex(index);
    setIsModalResultOpen(true);
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
        isLoading={true}
        isOpen={isModalResultOpen}
        onClose={() => setIsModalResultOpen(false)}
        amount={100000}
        luckyNumber={123456}
      />
    </div>
  );
};

export default Main;
