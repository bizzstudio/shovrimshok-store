import React, { useContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { FiHome, FiUser, FiShoppingCart, FiAlignLeft, FiUserCheck } from "react-icons/fi";
import { BsWhatsapp } from "react-icons/bs";
import { TbCategory } from "react-icons/tb";
import useTranslation from "next-translate/useTranslation";

import { UserContext } from "@context/UserContext";
import LoginModal from "@component/modal/LoginModal";
import { SidebarContext } from "@context/SidebarContext";
import CategoryDrawer from "@component/drawer/CategoryDrawer";
import useCart from "@hooks/useCart";

const MobileFooter = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { toggleCartDrawer, toggleCategoryDrawer } = useContext(SidebarContext);
  const { totalItems } = useCart();

  const {
    state: { userInfo },
  } = useContext(UserContext);

  const { t } = useTranslation();

  return (
    <>
      <LoginModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
      <div className="flex flex-col h-full justify-between align-middle bg-white rounded cursor-pointer overflow-y-scroll flex-grow scrollbar-hide w-full">
        <CategoryDrawer className="w-6 h-6 drop-shadow-xl" />
      </div>
      <footer className="lg:hidden fixed z-30 bottom-0 w-full"
      // style={{ boxShadow: '8px -8px 10px rgba(0, 0, 0, 0.1)' }}
      >
        <hr
          className="w-full h-[3px]"
          style={{
            backgroundImage:
              'linear-gradient(to right, transparent 0%, #f3f4f6 10%, #002863 30%, #002863 70%, #f3f4f6 90%, transparent 100%)',
          }}
        />
        <div className="bg-gray-100 text-customBlue flex items-center justify-between w-full h-16 px-3 sm:px-10">
          <button
            aria-label="Bar"
            onClick={toggleCategoryDrawer}
            className="flex flex-col items-center justify-center flex-shrink-0 h-auto relative focus:outline-none"
          >
            <span className="text-xl">
              {/* <FiAlignLeft className="w-6 h-6 drop-shadow-xl" /> */}
              <TbCategory className="w-6 h-6 drop-shadow-xl" />
            </span>
            <p className="text-xs text-center">{t("common:categories")}</p>
          </button>
          <Link
            href="/"
            className="text-xl"
            rel="noreferrer"
            aria-label="Home"
          >
            <FiHome className="w-6 h-6 drop-shadow-xl" />
            <p className="text-xs text-center">{t("common:home")}</p>
          </Link>

          <button
            onClick={toggleCartDrawer}
            className="flex flex-col items-center justify-center"
          >
            <div className="relative whitespace-nowrap inline-flex items-center justify-center text-lg">
              <span className="absolute z-10 bottom-3 right-0 inline-flex items-center justify-center p-1 h-5 w-5 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 bg-red-500 rounded-full">
                {totalItems}
              </span>
              <FiShoppingCart className="w-6 h-6 drop-shadow-xl" />
            </div>
            <p className="text-xs text-center pl-1">{t("common:cart")}</p>
          </button>
          <button
            aria-label="User"
            type="button"
            className="flex flex-col items-center justify-center"
          >
            <div
            // className="flex flex-col gap-4 items-center justify-center text-xl text-customRed bg-white p-0.5 
            // aspect-1 rounded-full outline outline-2 outline-white outline-offset-2"
            >
              {userInfo?.image ? (
                <Link href="/user/dashboard" className="w-6 h-6">
                  <Image
                    width={29}
                    height={29}
                    src={userInfo.image}
                    alt="user"
                    className="rounded-full object-cover aspect-1 border-2 border-white"
                  />
                </Link>
              ) : userInfo?.CardName ? (
                <Link
                  href="/user/dashboard"
                  className="leading-none font-bold font-serif block mb-0.5"
                >
                  <FiUserCheck className="text-[26px] ml-1.5 drop-shadow-xl" />
                </Link>
              ) : (
                <div onClick={() => setModalOpen(!modalOpen)}>
                  <FiUser className="text-[26px] drop-shadow-xl" />
                </div>
              )}
            </div>
            {userInfo?.CardName ? (
              <p className="text-xs text-center">{t("common:profile")}</p>
            ) : (
              <p className="text-xs text-center">{t("common:login")}</p>
            )}
          </button>
          <a href="https://api.whatsapp.com/send/?phone=972525123003"
            target="_blank"
            className="flex flex-col gap-1 items-center justify-center text-xl">
            <span>
              <BsWhatsapp className="w-6 h-6 drop-shadow-xl" />
            </span>
            <p className="text-xs text-center">{t("common:contactUs")}</p>
          </a>
        </div>
      </footer>
    </>
  );
};

export default dynamic(() => Promise.resolve(MobileFooter), { ssr: false });
