import { useState } from "react";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const ModalPage = ({ isOpen, setIsOpen }) => {
  const closeModal = () => {
    return setIsOpen(false);
  };
  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
      <p>hallo</p>
      <button onClick={closeModal}>close</button>
    </Modal>
  );
};
export default ModalPage;
