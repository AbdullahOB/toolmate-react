import { motion } from "framer-motion";
import HeroChat from "./HeroChat";
import { useAppContext } from "@/context/AppContext";
import Lottie from "lottie-react";
import MateyGfx from "../../../public/MatteyNobg.json";
import { useEffect, useState } from "react";
export function MobileMock() {
  const { isMobileFullHeight, showExplanationModal } = useAppContext();

  // current height
  const currentHeight = window.innerHeight;

  const [height, setHeight] = useState(currentHeight - 200);

  useEffect(() => {
    const handleResize = () => {
      const newHeight = window.innerHeight - 100;
      setHeight(newHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div className="w-full h-full flex lg:flex-row flex-col justify-center lg:justify-start items-center mb-5 relative">
      <div className="hidden lg:flex">
        <Lottie
          className={`absolute ${
            showExplanationModal ? "z-0" : "z-40"
          } -top-[58px] scale-[0.4] -left-[275px] w-[1px] h-[1px]`}
          animationData={MateyGfx}
          style={{
            width: "100%",
            height: "auto",
          }}
          loop={true}
        />
      </div>
      <div
        className={`${
          isMobileFullHeight ? "hidden" : "block"
        } lg:hidden w-full h-full`}
      >
        <img
          loading="lazy"
          src="/assets/matey/langingMatey.svg"
          alt="back"
          className="w-96 h-96 -mb-[203px] -mt-7"
        />
      </div>
      {/* current height - 200px */}
      <div
        className={`lg:w-[460px] w-full ${
          isMobileFullHeight ? "h-full" : "h-full"
        } lg:mb-10 lg:ml-20 z-10 p-1 md:rounded-[1.8rem] ${
          isMobileFullHeight ? "mt-10 rounded-2xl" : "rounded-2xl"
        } bg-gradient-to-t from-slate-300 to-softYellow`}
      >
        <HeroChat />
      </div>
    </div>
  );
}
