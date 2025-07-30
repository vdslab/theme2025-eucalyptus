import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/layout.css";
import MonthSelectionModal from "../MonthSelectionModal";
import { LuFlower2 } from "react-icons/lu";
import { IoSearch } from "react-icons/io5";

const Header = ({ monthRange, onMonthChange, selectList }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation();
  // console.log("location", location);
  // location
  // Object { pathname: "/", search: "", hash: "", state: null, key: "ey4avxu6" }
  // console.log("location.search", location.search);

  const getCurrentSeason = () => {
    if (!monthRange) return "通年";
    const { start, end } = monthRange;
    if (start === 0 && end === 11) return "通年";
    if (start === end) return `${start + 1}月`;
    if (start === 2 && end === 4) return "春";
    if (start === 5 && end === 7) return "夏";
    if (start === 8 && end === 10) return "秋";
    if (start === 11 && end === 1) return "冬";
    return `${start + 1}月〜${end + 1}月`;
  };

  return (
    <>
      <header className="header">
        <div className="container">
          <h1 className="site-title">花束作成支援サイト</h1>

          <button
            onClick={() => setIsModalOpen(true)}
            className="month-select-button"
          >
            {getCurrentSeason()}の花を探す
            <IoSearch size="0.9rem" />
          </button>
        </div>
        <div className="cart-link-content">
          {selectList.length === 0 ? (
            ""
          ) : (
            <div className="cart-count">{selectList.length}</div>
          )}

          <Link
            to={`/cart${location.search}`}
            className="cart-button"
            title="カートページへ進む"
          >
            {/* 花束カート */}
            <LuFlower2 size="1.2rem" />
          </Link>
        </div>
      </header>
      <MonthSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        monthRange={monthRange}
        onMonthChange={onMonthChange}
      />
    </>
  );
};

export default Header;
