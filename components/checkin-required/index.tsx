import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";

const starVariants = {
  initial: { opacity: 0, scale: 0 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatType: "reverse" as const,
      repeatDelay: 0.5,
    },
  },
};

const containerVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

const imageVariants = {
  initial: { opacity: 0, y: -20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.2,
    },
  },
};

const textVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.4,
    },
  },
};

const iconVariants = {
  initial: { opacity: 0, scale: 0.5, rotate: -180 },
  animate: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 15,
      delay: 0.6,
    },
  },
};

const logoutLinkVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 1.2,
    },
  },
};

const CheckInRequired = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Set background color for body and main when on this page
  useEffect(() => {
    document.body.style.backgroundColor = "#efd4aa";
    const mainElement = document.querySelector("main");
    if (mainElement) {
      (mainElement as HTMLElement).style.backgroundColor = "#efd4aa";
    }

    // Cleanup: restore original background when component unmounts
    return () => {
      document.body.style.backgroundColor = "";
      const mainElement = document.querySelector("main");
      if (mainElement) {
        (mainElement as HTMLElement).style.backgroundColor = "";
      }
    };
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#efd4aa] relative px-4">
      {/* Decorative stars */}
      <motion.div
        className="absolute top-6 left-6"
        variants={starVariants}
        initial="initial"
        animate="animate"
      >
        <span className="text-yellow-400 text-xl">✨</span>
      </motion.div>
      <motion.div
        className="absolute top-6 right-6"
        variants={starVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.1 }}
      >
        <span className="text-yellow-400 text-xl">✨</span>
      </motion.div>
      <motion.div
        className="absolute bottom-6 left-8"
        variants={starVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.2 }}
      >
        <span className="text-yellow-400 text-lg">✨</span>
      </motion.div>
      <motion.div
        className="absolute bottom-6 right-8"
        variants={starVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.3 }}
      >
        <span className="text-yellow-400 text-lg">✨</span>
      </motion.div>

      <motion.div
        className="bg-[#efd4aa] flex flex-col items-center px-8 py-10 rounded-xl shadow-2xl z-10 w-full max-w-sm border border-[#e5b772]"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Logo image */}
        <motion.div
          variants={imageVariants}
          initial="initial"
          animate="animate"
        >
          <Image
            src="/hdwebsoft-blue.svg"
            alt="HDWebsoft Logo"
            width={150}
            height={70}
            className="mx-auto mb-2"
            priority
          />
        </motion.div>

        {/* Icon */}
        <motion.div
          className="flex items-center justify-center my-4"
          variants={iconVariants}
          initial="initial"
          animate="animate"
        >
          <span className="text-6xl">📋</span>
        </motion.div>

        {/* Title */}
        <motion.div
          className="text-center mb-4"
          variants={textVariants}
          initial="initial"
          animate="animate"
        >
          <h1 className="text-2xl font-bold text-[#333] mb-2">
            Vui lòng đến quầy tiếp tân
          </h1>
        </motion.div>

        {/* Message */}
        <motion.p
          className="text-center text-lg text-[#222] font-medium"
          variants={textVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.6 }}
        >
          Để nhận số may mắn, bạn cần check-in tại quầy tiếp tân trước.
        </motion.p>

        {/* Additional info */}
        <motion.div
          className="mt-6 pt-6 border-t border-[#e5b772] w-full"
          variants={textVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.8 }}
        >
          <p className="text-center text-sm text-[#666] leading-relaxed">
            <span className="block mb-2">📍 Tìm quầy tiếp tân tại sự kiện</span>
            <span className="block mb-2">
              ✅ Nhân viên sẽ hỗ trợ bạn check-in
            </span>
            <span className="block">
              🎁 Sau khi check-in, bạn sẽ nhận số may mắn
            </span>
          </p>
        </motion.div>

        {/* Logout link */}
        <motion.button
          onClick={handleLogout}
          className="text-center text-sm text-[#666] font-medium mt-6 underline hover:text-[#333] transition-colors cursor-pointer"
          variants={logoutLinkVariants}
          initial="initial"
          animate="animate"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Thoát
        </motion.button>
      </motion.div>
    </main>
  );
};

export default CheckInRequired;
