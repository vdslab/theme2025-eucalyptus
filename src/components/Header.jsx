import "../styles/header.css";
import ColorSearch from "./ColorSearch";
import { useState } from "react";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import { IoIosArrowDown } from "react-icons/io";
import MonthSelectionModal from "./MonthSelectionModal";

const Header = ({
  onColorSearchClick,
  isColorSearchOpen,
  onColorSearchClose,
  onColorSelect,
  onClearSearch,
  onFloweringPeriodClick,
  isFloweringPeriodOpen,
  onFloweringPeriodClose,
  monthRange,
  onMonthChange,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileColorOpen, setIsMobileColorOpen] = useState(false);
  return (
    <>
      <header className="flex justify-between items-center bg-[#fff4cc] px-4 py-3 md:px-8 md:py-4">
        <h1 className=" font-dancing text-2xl md:text-3xl leading-none m-0">
          BooPick
        </h1>
        <div className="search-content hidden md:flex">
          <button className="search-button" onClick={onColorSearchClick}>
            色から探す
          </button>
          <button className="search-button" onClick={onFloweringPeriodClick}>
            開花時期から探す
          </button>
          <button className="search-button">イベントから探す</button>
        </div>
        {/* モバイル版：ハンバーガーメニュー */}
        <button
          className="md:hidden text-2xl p-2 hover:bg-gray-100 rounded transition-colors"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="メニューを開く"
        >
          <RxHamburgerMenu />
        </button>
      </header>

      {isColorSearchOpen && (
        <div className="hidden md:block">
          <ColorSearch
            onClose={onColorSearchClose}
            onColorSelect={onColorSelect}
            onClearSearch={onClearSearch}
            isMobile={false}
          />
        </div>
      )}
      {isFloweringPeriodOpen && (
        <div>
          <MonthSelectionModal
            isOpen={isFloweringPeriodOpen}
            onClose={onFloweringPeriodClose}
            monthRange={monthRange}
            onMonthChange={onMonthChange}
          />
        </div>
      )}

      {/* モバイル版 */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div
        className={`
          md:hidden fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-medium  text-lg">花を探す</h2>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-2xl hover:bg-gray-100 p-2 rounded w-10 h-10 flex items-center justify-center"
          >
            <RxCross2 />
          </button>
        </div>

        {/* メニュー項目 */}
        <nav className="p-4 flex flex-col gap-2">
          <div className="border rounded-lg overflow-hidden">
            <button
              onClick={() => setIsMobileColorOpen(!isMobileColorOpen)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between transition-colors bg-white"
            >
              <span>色から探す</span>
              <IoIosArrowDown
                className={`transition-transform duration-200 ${
                  isMobileColorOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* 展開エリア */}
            {isMobileColorOpen && (
              <div className="border-t bg-gray-50">
                <ColorSearch
                  onClose={() => {}}
                  onColorSelect={onColorSelect}
                  onClearSearch={onClearSearch}
                  isMobile={true}
                />
              </div>
            )}
          </div>

          <button
            className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg flex items-center justify-between transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span>開花時期から探す</span>
            <IoIosArrowDown />
          </button>

          <button
            className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg flex items-center justify-between transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span>イベントから探す</span>
            <IoIosArrowDown />
          </button>
        </nav>
        {/* 下に「使い方」を入れるのはどうか */}
      </div>
    </>
  );
};

export default Header;
