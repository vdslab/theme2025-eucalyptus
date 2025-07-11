import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/cart.css";
import ModalPage from "./function/ModalPage";

const FlowersCart = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div>
      <header className="header">
        <Link to="/" className="back-button">
          花束作成支援サイト
        </Link>
      </header>

      <div className="cart-content">
        <div>umu</div>

        <div className="footer">
          <button className="green-modal" onClick={() => setOpenModal(true)}>
            グリーン系を選択
          </button>
          <button className="create-button">作成</button>
        </div>
      </div>
      <ModalPage isOpen={openModal} setIsOpen={setOpenModal} />
    </div>
  );
};
export default FlowersCart;
