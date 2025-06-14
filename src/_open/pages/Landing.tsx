"use client";
import Price from "@/components/custom/Price";
import ButtonCustom from "@/components/custom/ButtonCustom";
import { MobileMock } from "@/components/custom/Mobile-mock";
import { motion } from "framer-motion";
import ToolmateFeatureGrid from "@/components/custom/ToolmateFeatureGrid";
import { Highlight } from "@/components/ui/hero-highlight";
import NewsletterSignup from "@/components/custom/NewsletterSignup";
import FaqSection from "@/components/custom/FaqSection";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import TrustBlock from "@/components/custom/TrustBlock";
import { useEffect } from "react";
import { CheckIcon } from "lucide-react";
import QuickProjectPrompt from "@/components/custom/QuickProjectPrompt";
import { useState } from "react";
import TestimonialCarousel from "@/components/custom/TestimonialCarousel";
import HowItWorks from "@/components/custom/HowItWorks";
import { useAppContext } from "@/context/AppContext";

export default function Landing() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { showExplanationModal, isMobileChatOpened, isMobileFullHeight } =
    useAppContext();
  useEffect(() => {
    window.scrollTo(0, 0);
    window.scrollTo({ top: 0, behavior: "smooth" });
    const handleScroll = () => {
      const heroHeight = document.querySelector("section")?.offsetHeight || 600;
      setShowBackToTop(window.scrollY > heroHeight);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  //Link to testimonial
  const scrollToTestimonial = () => {
    const section = document.getElementById("testimonial");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <>
      <div className="w-full flex items-center justify-center">
        <div className="md:px-20 scroll-smooth py-6 md:py-0 overflow-x-hidden max-w-[1480px]">
          <div className="">
            {/* hero section */}
            <section className="flex justify-between lg:flex-row flex-col lg:p-12 relative">
              <div className={`container mx-auto sm:px-4 px-2 lg:py-14`}>
                <div className="absolute inset-0 -z-10 opacity-10">
                  <div className="absolute top-0 left-0 w-full h-full bg-[url('/assets/images/square.svg')] bg-cover bg-center bg-no-repeat"></div>
                </div>

                <div className="flex flex-col-reverse lg:flex-row items-start justify-between lg:gap-20">
                  {/* left side */}

                  {!isMobileChatOpened && (
                    <div
                      className={`text-center ${
                        isMobileChatOpened || isMobileFullHeight
                          ? "mt-36"
                          : "mt-0"
                      } lg:justify-start justify-center lg:items-start items-center lg:text-left lg:w-2/3 max-w-2/5 place-content-center flex flex-col gap-12`}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: [20, -5, 0] }}
                        transition={{
                          duration: 1.0,
                          ease: [0.4, 0.0, 0.2, 0.5],
                        }}
                        className="space-y-8"
                      >
                        <div>
                          <p className="text-transparent text-center hidden lg:block bg-clip-text bg-gradient-to-r from-black to-black font-[800] text-5xl lg:text-[60px] sm:text-left lg:text-left leading-[4.9rem] tracking-wider">
                            Ask Matey
                            <br />
                            <span>
                              which tools you need It's live,{" "}
                              <Highlight className="dark:text-white text-transparent">
                                free
                              </Highlight>{" "}
                              and no sign-up needed
                            </span>
                          </p>
                          <p className="lg:hidden justify-center items-center w-full text-center font-extrabold pt-4 text-3xl sm:text-4xl leading-tight">
                            Ask Matey <br /> which tools you need It's live,{" "}
                            <Highlight className="dark:text-white text-transparent">
                              free
                            </Highlight>{" "}
                            and no sign-up needed
                          </p>
                        </div>
                        {/* Benefit stack - 3 clear benefits */}
                        <div className="space-y-2 lg:w-4/5 flex flex-col text-start">
                          <div className="flex items-center gap-2">
                            <div className="bg-orange p-1 rounded-full">
                              <CheckIcon className="h-4 w-4 text-white" />
                            </div>
                            <p className="font-semibold text-gray-800 text-lg">
                              Grab the right gear for the task
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="bg-orange p-1 rounded-full">
                              <CheckIcon className="h-4 w-4 text-white" />
                            </div>
                            <p className="font-semibold flex items-center text-lg gap-1 text-gray-800">
                              Follow tips from a bloke who's been there
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="bg-orange p-1 rounded-full">
                              <CheckIcon className="h-4 w-4 text-white" />
                            </div>
                            <p className="font-semibold text-gray-800 text-lg">
                              Cut the waste keep the wins
                            </p>
                          </div>
                        </div>
                        <p className="lg:w-2/3 text-center font-medium lg:text-lg text-xl w-full lg:text-left text-gray-500 tracking-tight">
                          Matey's here to steer you straight. First crack or
                          fiftieth reno, he'll tell you what's worth grabbing,
                          what to skip, and how to see it through properly.
                        </p>

                        {/* CTA section with "no sign-up needed" badge */}
                        <div className="relative">
                          <div
                            className={`lg:flex hidden absolute ${
                              showExplanationModal ? "" : ""
                            } gap-2 items-center justify-center lg:justify-start lg:items-start`}
                          >
                            <ButtonCustom
                              text="Chat with Matey now"
                              isArrow={true}
                              isDark={true}
                            />
                          </div>

                          {/* No sign-up needed badge */}
                          <div className="flex items-center lg:justify-start justify-center">
                            <div className="bg-green-100 text-green-800 font-medium px-3 py-1 rounded-full text-base flex items-center gap-1.5">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                                <path d="m9 12 2 2 4-4"></path>
                              </svg>
                              No sign-up. Just start chatting
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {/* Right side - Chat */}
                  <motion.div
                    className="w-full lg:w-1/2 flex flex-col lg:flex-row justify-center lg:justify-end"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <MobileMock />
                  </motion.div>
                </div>

                {/* Testimonial Carousel - Directly under CTA and trust badge on desktop */}

                {!isMobileChatOpened && (
                  <div className="hidden relative lg:block px-2 mt-20">
                    <img
                      loading="lazy"
                      src="/assets/matey/langingMatey.svg"
                      alt="back"
                      className="z-0 w-[600px] absolute -left-72 bottom-0 -rotate-12"
                    />
                    <TestimonialCarousel />
                  </div>
                )}
                {/* trust badge section */}
                {!isMobileChatOpened && (
                  <div className="lg:flex hidden justify-center mt-10">
                    <div className="flex gap-2 flex-col">
                      <div className="font-bold text-3xl items-center text-left w-fit flex">
                        <div className="flex items-center text-left gap-2">
                          <p className="font-semibold text-left opacity-80 text-slate-500 text-md">
                            Already helping
                          </p>
                          <motion.div
                            onClick={scrollToTestimonial}
                            className="group rounded-full border border-orange-200 bg-whiteYellow text-lg text-gray-800 transition-all ease-in hover:cursor-pointer hover:bg-paleYellow shadow-sm hover:shadow-md"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1.5 transition ease-out hover:text-orange hover:duration-300 dark:hover:text-lighterYellow font-medium">
                              <span>✨ Trusted by 1000+ Aussies</span>
                              <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                            </AnimatedShinyText>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Mobile trust badge */}
            {!isMobileChatOpened && (
              <div className="flex justify-center">
                <div className="flex md:hidden gap-2 flex-col mt-5">
                  <div className="font-bold text-3xl items-center pt-5 text-left w-fit flex">
                    <div className="flex items-center text-left gap-2">
                      <p className="font-semibold text-left opacity-80 text-slate-500 text-md">
                        Already helping
                      </p>
                      <motion.div
                        onClick={scrollToTestimonial}
                        className="group rounded-full border border-orange-200 bg-whiteYellow text-lg text-gray-800 transition-all ease-in hover:cursor-pointer hover:bg-paleYellow shadow-sm hover:shadow-md"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1.5 transition ease-out hover:text-orange hover:duration-300 dark:hover:text-lighterYellow font-medium">
                          <span>✨ 1000+ Aussies</span>
                          <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                        </AnimatedShinyText>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Testimonial Carousel - After trust badge on mobile */}
            {!isMobileChatOpened && (
              <div className="md:hidden mt-6">
                <TestimonialCarousel />
              </div>
            )}

            {/* Mobile CTA - Positioned after testimonials on mobile */}
            {!isMobileChatOpened && (
              <div className="md:hidden flex justify-center mt-8">
                <ButtonCustom
                  text="Chat with Matey now"
                  isArrow={true}
                  isDark={true}
                />
              </div>
            )}

            {/* Quick Project Prompts */}
            {!isMobileChatOpened && (
              <div className="py-10">
                <p className="text-3xl md:text-4xl lg:text-6xl mb-10 md:leading-[4.5rem] text-center font-bold">
                  Got Something To Tackle? <br /> Let
                  <span className="text-orange"> Matey </span>
                  Help
                </p>
                <QuickProjectPrompt />
              </div>
            )}
            {/* grid stock video section */}
            {!isMobileChatOpened && (
              <div className="px-2 md:px-0 py-10">
                <ToolmateFeatureGrid />
              </div>
            )}
            {!isMobileChatOpened && (
              <div id="testimonial" className="py-10">
                <HowItWorks />
              </div>
            )}
            {/* price page */}
            {!isMobileChatOpened && (
              <div className="">
                {/* header */}
                <p className="text-3xl md:text-4xl lg:text-6xl text-center my-5 font-bold md:text-center px-4">
                  Pick Your
                  <span className="text-orange text-left"> Mate </span>
                </p>
                {/* prices */}

                <Price />
              </div>
            )}
            {/* community section */}
            {/* <div className='w-full flex items-center justify-center '>
            <div className='md:mx-16 w-full md:w-[calc(100%-5rem)]'>
              <p className='text-4xl md:text-6xl lg:text-7xl font-bold md:leading-[4rem] mt-20'>
                Got Question? Jump into the <span className='text-orange'>Toolmate</span> Community
              </p>
              <div className='pl-4 md:pl-0'>
                <CommunityExample />
              </div>
            </div>
          </div> */}
            {!isMobileChatOpened && (
              <div className="py-10">
                <TrustBlock />
              </div>
            )}
            {!isMobileChatOpened && (
              <div className="py-10">
                <p className="text-3xl md:text-4xl flex flex-col items-center lg:text-6xl text-center my-5 font-bold md:text-center px-4">
                  Got Questions?
                  <span className="text-orange text-center">
                    {" "}
                    Matey's Got Answers!
                  </span>
                </p>
                <FaqSection />
              </div>
            )}
            {!isMobileChatOpened && (
              <div className="py-10">
                <NewsletterSignup />
              </div>
            )}
            {/* Back to chat container button */}
            {isMobileChatOpened && (
              <motion.button
                onClick={scrollToTop}
                className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-orange text-white shadow-xl hover:shadow-2xl"
                title="Back to Matey?"
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{
                  opacity: showBackToTop ? 1 : 0,
                  scale: showBackToTop ? 1 : 0.5,
                  y: showBackToTop ? [0, -5, 0] : 20,
                }}
                whileHover={{
                  scale: 1.2,
                  rotate: [0, 5, -5, 5, 0],
                  boxShadow: "0px 0px 20px rgba(255, 165, 0, 0.6)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.img
                  loading="lazy"
                  src="/assets/matey-emoji/largeSmile.svg"
                  alt="Back to Matey"
                  className="w-12 h-12"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: showBackToTop ? [0, 10, -10, 10, 0] : 0 }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                    ease: "easeInOut",
                  }}
                />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
