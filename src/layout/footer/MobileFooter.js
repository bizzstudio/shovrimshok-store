import React, { useContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useCart } from "react-use-cart";
import { FiHome, FiUser, FiShoppingCart, FiAlignLeft,FiUserCheck } from "react-icons/fi";
import { BsWhatsapp } from "react-icons/bs";

import { UserContext } from "@context/UserContext";
import LoginModal from "@component/modal/LoginModal";
import { SidebarContext } from "@context/SidebarContext";
import CategoryDrawer from "@component/drawer/CategoryDrawer";

const MobileFooter = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { toggleCartDrawer, toggleCategoryDrawer } = useContext(SidebarContext);
  const { totalItems } = useCart();

  const {
    state: { userInfo },
  } = useContext(UserContext);

  return (
    <>
      <LoginModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
      <div className="flex flex-col h-full justify-between align-middle bg-white rounded cursor-pointer overflow-y-scroll flex-grow scrollbar-hide w-full">
        <CategoryDrawer className="w-6 h-6 drop-shadow-xl" />
      </div>
      <footer className="lg:hidden fixed z-30 bottom-0 bg-customGreen flex items-center justify-between w-full h-16 px-3 sm:px-10">
        <button
          aria-label="Bar"
          onClick={toggleCategoryDrawer}
          className="flex items-center justify-center flex-shrink-0 h-auto relative focus:outline-none"
        >
          <span className="text-xl text-white">
            <FiAlignLeft className="w-6 h-6 drop-shadow-xl" />
          </span>
        </button>
        <Link
          href="/"
          className="text-xl text-white"
          rel="noreferrer"
          aria-label="Home"
        >
          <FiHome className="w-6 h-6 drop-shadow-xl" />
        </Link>

        <button
          onClick={toggleCartDrawer}
          className="h-9 w-9 relative whitespace-nowrap inline-flex items-center justify-center text-white text-lg"
        >
          <span className="absolute z-10 top-0 right-0 inline-flex items-center justify-center p-1 h-5 w-5 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 bg-red-500 rounded-full">
            {totalItems}
          </span>
          <FiShoppingCart className="w-6 h-6 drop-shadow-xl" />
        </button>
        <button
          aria-label="User"
          type="button"
          className="flex items-center text-xl text-customGreen bg-white indicator justify-center p-2 aspect-1 h-2/5 rounded-full outline outline-2 outline-white outline-offset-2"
        >
          {userInfo?.image ? (
            <Link href="/user/dashboard" className="relative top-1 w-6 h-6">
              <Image
                width={29}
                height={29}
                src={userInfo.image}
                alt="user"
                className="rounded-full"
              />
            </Link>
          ) : userInfo?.name ? (
            <Link
              href="/user/dashboard"
              className="leading-none font-bold font-serif block mb-0.5"
            >
               <FiUserCheck className="w-6 h-6 drop-shadow-xl" />
            </Link>
          ) : (
            <span onClick={() => setModalOpen(!modalOpen)}>
              <FiUser className="w-6 h-6 drop-shadow-xl" />
            </span>
          )}
        </button>
        <button
          aria-label="User"
          type="button"
          className="text-xl text-white indicator justify-center"
        >
   
            <a
              href="https://api.whatsapp.com/send/?phone=972525123003"
              className="leading-none font-bold font-serif block"
            >
       
            <span>
              <BsWhatsapp className="w-6 h-6 drop-shadow-xl" />
            </span>
            </a>
        
        </button>
      </footer>
    </>
  );
};

export default dynamic(() => Promise.resolve(MobileFooter), { ssr: false });
