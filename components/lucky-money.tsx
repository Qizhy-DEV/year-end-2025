import { cn } from "@/libs/utils";
import { motion } from "framer-motion";

const LuckyMoney = ({
  image,
  className,
  isActive,
  onClick,
}: {
  image: string;
  className?: string;
  onClick?: () => void;
  isActive: boolean;
}) => {
  const transitionProps = isActive
    ? {
        duration: 0.55,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      }
    : {
        duration: 1.6,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      };

  return (
    <motion.div
      onClick={onClick}
      className={cn(
        "absolute top-1/2 left-1/2 w-10 h-20 bg-center bg-cover",
        className,
        isActive && "top-[150%] transition-all duration-1000 z-50"
      )}
      style={{
        backgroundImage: `url('${image}')`,
      }}
      animate={{
        scale: [0.9, 1.05, 0.9],
      }}
      transition={{
        ...transitionProps,
        ease: ["easeInOut"],
        repeatType: "loop" as const,
      }}
    ></motion.div>
  );
};

export default LuckyMoney;
