import { useState, useEffect } from "react";
import CircularMonthSlider from "../pages/function/CircularMonthSlider";
import "../styles/modal.css";

const MonthSelectionModal = ({
  isOpen,
  onClose,
  monthRange,
  onMonthChange,
}) => {
  const [tempMonthRange, setTempMonthRange] = useState(monthRange);

  // monthRangeが変更されたときにtempMonthRangeを更新
  useEffect(() => {
    if (monthRange) {
      setTempMonthRange(monthRange);
    }
  }, [monthRange, isOpen]); // isOpenも依存配列に追加

  const getCurrentSeason = (start, end) => {
    if (start === 0 && end === 11) return "通年";
    if (start === end) return `${start + 1}月のみ`;
    if (start === 2 && end === 4) return "春";
    if (start === 5 && end === 7) return "夏";
    if (start === 8 && end === 10) return "秋";
    if (start === 11 && end === 1) return "冬";
    return "カスタム";
  };

  const handleApply = () => {
    onMonthChange(tempMonthRange);
    onClose();
  };

  const handleCancel = () => {
    setTempMonthRange(monthRange);
    onClose();
  };

  // モーダルが開いていない場合は何も表示しない
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">開花時期を選択</h2>

        <div className="modal-slider-container">
          <CircularMonthSlider
            start={tempMonthRange.start}
            end={tempMonthRange.end}
            onChange={(start, end) => setTempMonthRange({ start, end })}
          />
        </div>

        <div className="modal-info">
          <div className="selected-period">
            選択期間: {tempMonthRange.start + 1}月 〜 {tempMonthRange.end + 1}月
          </div>
          <div className="selected-season">
            {getCurrentSeason(tempMonthRange.start, tempMonthRange.end)}
          </div>
        </div>

        <div className="modal-buttons">
          <button onClick={handleCancel} className="modal-button cancel">
            キャンセル
          </button>
          <button onClick={handleApply} className="modal-button apply">
            決定
          </button>
        </div>
      </div>
    </div>
  );
};

export default MonthSelectionModal;
