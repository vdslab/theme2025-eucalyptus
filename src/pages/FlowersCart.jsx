import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/cart.css";

const FlowersCart = ({ selectList, setSelectList }) => {
  const location = useLocation();
  console.log("selectList:", selectList);
  return (
    <div>
      <header className="header">
        <Link to={`/${location.search}`} className="back-button">
          花束作成支援サイト
        </Link>
      </header>

      <div className="cart-content">
        <div>umu</div>

        <div className="footer">
          <button className="green-modal">グリーン系を選択</button>
          <button className="create-button">作成</button>
        </div>
      </div>
    </div>
  );
};
export default FlowersCart;
