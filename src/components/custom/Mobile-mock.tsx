import { motion } from "framer-motion";
import { memo, useMemo } from "react";
import HeroChat from "./HeroChat";
import { useAppContext } from "@/context/AppContext";
import Lottie from "lottie-react";
import MateyGfx from "../../../public/MatteyNobg.json";

// Memoized Lottie component to prevent unnecessary re-renders
const MateyLottie = memo(({ showExplanationModal }) => (
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
    // Optimize Lottie performance
    rendererSettings={{
      preserveAspectRatio: "xMidYMid slice",
      progressiveLoad: true,
    }}
  />
));

MateyLottie.displayName = "MateyLottie";

// Memoized static image component
const MateyStaticImage = memo(() => (
  <img
    loading="lazy"
    src="/assets/matey/langingMatey.svg"
    alt="Matey mascot"
    className="w-96 h-96 -mb-[203px] -mt-7"
    // Add width/height attributes for better performance
    width={384}
    height={384}
  />
));

MateyStaticImage.displayName = "MateyStaticImage";

export const MobileMock = memo(() => {
  const { isMobileFullHeight, showExplanationModal, mobileMockChatRef } =
    useAppContext();

  // Memoize the container classes to prevent recalculation
  const containerClasses = useMemo(
    () =>
      `lg:w-[460px] w-full lg:mb-10 lg:ml-20 z-10 p-1 md:rounded-[1.8rem] ${
        isMobileFullHeight ? "rounded-2xl" : "rounded-2xl"
      } bg-gradient-to-t from-slate-300 to-softYellow`,
    [isMobileFullHeight]
  );

  const mobileImageClasses = useMemo(
    () => `${isMobileFullHeight ? "hidden" : "block"} lg:hidden w-full`,
    [isMobileFullHeight]
  );

  // Main container classes for proper layout
  const mainContainerClasses = useMemo(
    () =>
      `w-full min-h-screen flex lg:flex-row flex-col justify-center lg:justify-start items-start lg:items-center relative ${
        isMobileFullHeight ? "pb-0" : "pb-8"
      }`,
    [isMobileFullHeight]
  );

  return (
    <div className={mainContainerClasses}>
      {/* Desktop Lottie Animation - Only render on large screens */}
      <div className="hidden lg:flex">
        <MateyLottie showExplanationModal={showExplanationModal} />
      </div>

      {/* Mobile Layout Container */}
      <div className="w-full lg:w-auto flex flex-col lg:flex-row lg:items-center">
        {/* Mobile Static Image - Only render when not in full height mode */}
        <div className={mobileImageClasses}>
          <MateyStaticImage />
        </div>

        {/* Chat Container */}
        <div className={containerClasses}>
          <HeroChat />
        </div>
      </div>
    </div>
  );
});

MobileMock.displayName = "MobileMock";
