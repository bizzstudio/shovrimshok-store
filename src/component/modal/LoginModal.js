import React from "react";

// Internal import

import Common from "@component/login/Common";
import MainModal from "@component/modal/MainModal";

const LoginModal = ({ modalOpen, setModalOpen }) => {
  return (
    <MainModal modalOpen={modalOpen} setModalOpen={setModalOpen}>
      <div className="inline-block sm:w-screen w-full max-w-xl px-10 py-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
        <Common setModalOpen={setModalOpen} />
      </div>
    </MainModal>
  );
};

export default LoginModal;
