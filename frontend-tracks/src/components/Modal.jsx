import React from "react";
import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const Modal = ({ children, onClose }) => {
  const dialog = useRef();

  useEffect(() => {
    const modal = dialog.current;
    if (!modal.open) {
      modal.showModal();
    }

    return () => {
      if (modal.open) {
        modal.close();
      }
    };
  }, []);

  return (
    <div>
      {createPortal(
        <dialog className="modal-backdrop" onClick={onClose} ref={dialog}>
          <div>Modal window</div>
          <div className="p-4" onClick={(e) => e.stopPropagation()}>
            {children}
          </div>
        </dialog>,
        document.getElementById("modal-root")
      )}
    </div>
  );
};

export default Modal;
