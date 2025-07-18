import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/cart.css";
import ModalPage from "./function/ModalPage";

const FlowersCart = ({ selectList, setSelectList, allFlowersData }) => {
  const location = useLocation();
  console.log("selectList:", selectList);
  console.log("allFlowersData:", allFlowersData);
  const [flowersList, setFlowersList] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const getCurrentSeason = (bloomTimes) => {
    if (!Array.isArray(bloomTimes) || bloomTimes.length === 0) return "不明";

    const start = bloomTimes[0];
    const end = bloomTimes[bloomTimes.length - 1];

    if (start === 1 && end === 12) return "通年";
    if (start === end) return `${start}月のみ`;
    return `${start}月~${end}月`;
  };

  useEffect(() => {
    const newFlowersList = [];
  }, [selectList]);

  return (
    <div>
      <header className="header">
        <Link to={`/${location.search}`} className="back-button">
          花束作成支援サイト
        </Link>
      </header>

      <div className="cart-content">
        <div className="cart-card-scroll">
          {/* 基本4,5列 */}
          <div className="card-grid">orz</div>
        </div>

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
