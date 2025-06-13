import Footer from "@/components/custom/FooterOpen";
import Navbar from "@/components/custom/Navbar";
import { Outlet } from "react-router-dom";
// this layout is used for pages where authanication is not needed
import { useAppContext } from "@/context/AppContext";
export default function OpenLayout() {
  const { isMobileChatOpened } = useAppContext();
  return (
    <>
      <div className="w-full h-full">
        <Navbar />

        <Outlet />

        {isMobileChatOpened ? (
        <></>
        ) : (
        <Footer />
        )}
      </div>
    </>
  );
}
