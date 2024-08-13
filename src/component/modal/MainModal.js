import React, { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoClose } from "react-icons/io5";

const MainModal = ({ modalOpen, setModalOpen, children, z = null, onClose }) => {
  const cancelButtonRef = useRef();

  const handleClose = () => {
    if (onClose) {
      onClose(); // השתמש בפונקציה שהועברה ב-onClose
    } else {
      setModalOpen(false); // התנהגות ברירת מחדל
    }
  };

  return (
    <>
      <Transition appear show={modalOpen} as={Fragment}>
        <Dialog
          as="div"
          className={`fixed inset-0 z-30 overflow-y-auto text-center`}
          onClose={handleClose}
          initialFocus={cancelButtonRef}
          style={{ zIndex: z ? z : 30 }}
        >
          <div className="min-h-screen p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              // leaveFrom="opacity-100 scale-100"
              // leaveTo="opacity-80"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-60" />
            </Transition.Child>

            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block overflow-hidden text-left align-middle transition-all transform bg-white rounded-2xl xl:max-w-6xl shadow-popup">
                {children}
                <div className="absolute right-5 top-5">
                  <button
                    ref={cancelButtonRef}
                    onClick={handleClose}
                    type="button"
                    className="inline-flex justify-center px-2 py-2 text-base font-medium text-customGreen border border-transparent rounded-full bg-customGreen-leaf focus:outline-none border-none outline-none"
                  >
                    <IoClose />
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default React.memo(MainModal);
