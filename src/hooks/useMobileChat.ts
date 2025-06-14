import { useCallback, useEffect, useRef } from "react";
import { useAppContext } from "@/context/AppContext";

/**
 * Encapsulates mobile chat behavior such as focusing the input,
 * toggling fullscreen mode and preventing background scroll.
 */
export function useMobileChat(
  inputRef: React.RefObject<HTMLInputElement>
) {
  const {
    setIsMobileFullHeight,
    isMobileChatOpened,
    setIsMobileChatOpened,
  } = useAppContext();

  const didOpenScroll = useRef(false);

  const focusAndAlignInput = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    if (window.innerWidth <= 768) {
      setIsMobileChatOpened(true);
      didOpenScroll.current = false;

      setTimeout(() => {
        el.scrollIntoView({ block: "start", behavior: "smooth" });
        didOpenScroll.current = true;
      }, 150);
    }
  }, [inputRef, setIsMobileChatOpened]);

  const unFocusAndRestore = useCallback(() => {
    if (window.innerWidth <= 768) {
      inputRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
    }
  }, [inputRef]);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsMobileFullHeight(isMobileChatOpened);
      document.body.style.overflow = isMobileChatOpened ? "hidden" : "";
    }
  }, [isMobileChatOpened, setIsMobileFullHeight]);

  return { focusAndAlignInput, unFocusAndRestore };
}

