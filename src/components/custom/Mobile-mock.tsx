import HeroChat from "./HeroChat";
import { useAppContext } from "@/context/AppContext";
import Lottie from "lottie-react";
import MateyGfx from "../../../public/MatteyNobg.json";
import { useEffect, useState } from "react";
export function MobileMock() {
  // get the height of the device
  const { showExplanationModal, isMobileChatOpened, isMobileFullHeight } =
    useAppContext();
  const [deviceHeight, setDeviceHeight] = useState(0);
  // get browser
  useEffect(() => {
    const handleResize = () => {
      setDeviceHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  // is chatting, when the user is chatting the container will be full screen
  return (
    <div
      className={`w-full ${
        isMobileChatOpened ? "mt-0" : "mt-0"
      } -mb-2 h-full flex lg:flex-row flex-col justify-center p-0 lg:justify-start items-center  relative`}
    >
      <Lottie
        className={`absolute ${
          showExplanationModal ? "z-0" : "z-40"
        } -top-[58px] scale-[0.4] -left-[275px] w-[1px] h-[1px] ${
          isMobileChatOpened ? "hidden" : ""
        }`}
        animationData={MateyGfx}
        style={{
          width: "100%",
          height: "auto",
        }}
        loop={true}
      />
      <div className="hidden lg:flex"></div>
      <div className={` lg:hidden w-full h-full`}>
        <img
          loading="lazy"
          src="/assets/matey/langingMatey.svg"
          alt="back"
          className={`w-96 h-96 -mb-[203px] -mt-7`}
        />
      </div>

      {deviceHeight < 660 ? (
        <div
          className={`lg:w-[480px] h-[470px] w-[98%] mx-auto lg:mx-0  lg:mb-10 lg:ml-20 z-10 md:rounded-[1.8rem] rounded-2xl ${
            isMobileChatOpened ? "mt-32" : "mt-0"
          } bg-gradient-to-t from-slate-300 to-softYellow`}
        >
          <HeroChat />
        </div>
      ) : (
        <div
          className={`lg:w-[480px] ${
            isMobileFullHeight ? `` : ``
          } w-[98%] mx-auto lg:mx-0 lg:mb-10 lg:ml-20 z-10 md:rounded-[1.8rem] rounded-2xl ${
            isMobileChatOpened ? "" : "mt-0"
          } bg-gradient-to-t from-slate-300 to-softYellow`}
        >
          <HeroChat />
        </div>
      )}
    </div>
  );
}
