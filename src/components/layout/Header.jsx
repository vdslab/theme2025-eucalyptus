import { useState } from "react";
import "../../styles/layout.css";
import MonthSelectionModal from "../MonthSelectionModal";

const Header = ({ monthRange, onMonthChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            {getCurrentSeason()}の花を探す ▼
          </button>
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
