import "../styles/header.css";
import ColorSearch from "./ColorSearch";
import EventSearch from "./EventSearch";
import { useState } from "react";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import { IoIosArrowDown } from "react-icons/io";

const Header = ({
  onColorSelect,
  onClearSearch,
  onEventSelect,
  onClearEventSearch,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileColorOpen, setIsMobileColorOpen] = useState(false);
  const [isColorSearchHovered, setIsColorSearchHovered] = useState(false);
  const [isMobileEventOpen, setIsMobileEventOpen] = useState(false);
  const [isEventSearchHovered, setIsEventSearchHovered] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("");

  const [selectedColor, setSelectedColor] = useState({ code: "", name: "" });
  return (
    <>
      {/* todo:今は仮の画像なので、BooPickの画像を新しく入れる必要がある */}
      <header className="flex justify-between items-center bg-[#fff4cc] px-3 md:px-8 md:py-3">
        {/* <h1 className=" font-dancing text-2xl md:text-3xl leading-none m-0">
          BooPick
        </h1> */}
        <img
          src="/images/image0.png"
          alt="BooPick"
          className="h-9 md:h-10 leading-none m-0"
        />
        <div className="search-content hidden md:flex">
          <div className="relative">
            <button
              className="search-button underline"
              onMouseEnter={() => setIsColorSearchHovered(true)}
              onMouseLeave={() => setIsColorSearchHovered(false)}
            >
              色から探す
            </button>

            {isColorSearchHovered && (
              <div
                className="absolute top-full right-0  mt-1 z-50"
                onMouseEnter={() => setIsColorSearchHovered(true)}
                onMouseLeave={() => setIsColorSearchHovered(false)}
              >
                <ColorSearch
                  selectedColor={selectedColor}
                  setSelectedColor={setSelectedColor}
                  onColorSelect={onColorSelect}
                  onClearSearch={onClearSearch}
                  isMobile={false}
                />
              </div>
            )}
          </div>
          {/* <button className="search-button">開花時期から探す</button> */}
          {/* イベント検索ボタン（相対位置の基準にする） */}
          <div className="relative">
            <button
              className="search-button underline"
              onMouseEnter={() => setIsEventSearchHovered(true)}
              onMouseLeave={() => setIsEventSearchHovered(false)}
            >
              イベントから探す
            </button>

            {/* ホバー時に表示されるパネル */}
            {isEventSearchHovered && (
              <div
                className="absolute top-full right-0 mt-1 z-50"
                onMouseEnter={() => setIsEventSearchHovered(true)}
                onMouseLeave={() => setIsEventSearchHovered(false)}
              >
                <EventSearch
                  selectedEvent={selectedEvent}
                  setSelectedEvent={setSelectedEvent}
                  onEventSelect={onEventSelect}
                  onClearEventSearch={onClearEventSearch}
                  isMobile={false}
                />
              </div>
            )}
          </div>
        </div>
        {/* モバイル版：ハンバーガーメニュー */}
        <button
          className="md:hidden text-2xl p-3 hover:bg-gray-100 rounded transition-colors"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="メニューを開く"
        >
          <RxHamburgerMenu />
        </button>
      </header>

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

          {/* <button
            className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg flex items-center justify-between transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span>開花時期から探す</span>
            <IoIosArrowDown />
          </button> */}

          <button
            onClick={() => setIsMobileEventOpen(!isMobileEventOpen)}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between transition-colors bg-white"
          >
            <span>イベントから探す</span>
            <IoIosArrowDown
              className={`transition-transform duration-200 ${
                isMobileEventOpen ? "rotate-180" : "" // ← 修正
              }`}
            />
          </button>

          {/* 展開エリア */}
          {isMobileEventOpen && (
            <div className="border-t bg-gray-50">
              <EventSearch
                selectedEvent={selectedEvent}
                setSelectedEvent={setSelectedEvent}
                onEventSelect={onEventSelect}
                onClearEventSearch={onClearEventSearch}
                isMobile={true}
              />
            </div>
          )}
        </nav>
        {/* 下に「使い方」を入れるのはどうか */}
      </div>
    </>
  );
};

export default Header;
