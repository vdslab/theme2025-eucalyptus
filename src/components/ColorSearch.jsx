import "../styles/colorSearch.css";
import { useState } from "react";

const ColorSearch = ({
  onClose,
  onColorSelect,
  onClearSearch,
  isMobile = false,
}) => {
  const presetColors = [
    { name: "ピンク", hex: "#FFB6C1" },
    { name: "赤", hex: "#FF0000" },
    { name: "白", hex: "#FFFFFF" },
    { name: "黄", hex: "#FFFF00" },
    { name: "オレンジ", hex: "#FFA500" },
    { name: "紫", hex: "#8114b8ff" },
    { name: "青", hex: "#0000FF" },
  ];

  const [colorCode, setColorCode] = useState("");
  const [colorName, setColorName] = useState("");

  if (isMobile) {
    // モバイル版: シンプルなレイアウト
    return (
      <div className="p-4">
        {/* 選択中の色 */}
        {colorName && (
          <div className="mb-4 p-3 bg-white rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded border-2 border-gray-200"
                style={{ backgroundColor: colorCode }}
              />
              <span className="text-sm">{colorName}</span>
            </div>
            <button
              className="text-xs px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
              onClick={() => {
                setColorCode("");
                setColorName("");
                onClearSearch();
              }}
            >
              解除
            </button>
          </div>
        )}

        {/* プリセットカラー - 2列表示 */}
        <div className="grid grid-cols-2 gap-2">
          {presetColors.map((color) => (
            <button
              key={color.name}
              className="flex items-center gap-2.5 p-2 hover:bg-white rounded-lg transition-colors"
              onClick={() => {
                setColorCode(color.hex);
                setColorName(color.name);
                onColorSelect(color.name);
              }}
            >
              <div
                className="w-8 h-8 rounded-full border-2 border-gray-200 flex-shrink-0"
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-sm">{color.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="color-search-overlay" onClick={onClose} />
      <div className="color-search-panel" onClick={(e) => e.stopPropagation()}>
        {/* 選択中の色*/}
        <div className="selected-color-display">
          <div className="display-flex">
            <div
              className="color-preview-box"
              style={{ backgroundColor: colorCode || "#CCCCCC" }}
            />
            <span className="selected-text">
              選択中の色： {colorName || colorCode || "未選択"}
            </span>
          </div>
          {colorName && (
            <button
              className="search-button"
              onClick={() => {
                setColorCode("");
                setColorName("");
                onClearSearch();
              }}
            >
              絞り込みを解除
            </button>
          )}
        </div>

        {/* プリセットカラー */}
        <div className="preset-colors">
          {presetColors.map((color) => (
            <div key={color.name} className="color-item">
              <button
                className="color-chip"
                style={{ backgroundColor: color.hex }}
                onClick={() => {
                  setColorCode(color.hex);
                  setColorName(color.name);
                  onColorSelect(color.name);
                }}
                title={color.name}
              />
              <span className="color-name">{color.name}</span>
            </div>
          ))}
        </div>

        {/* todo: 配置を整える */}
        {/* <div className="color-code-picker"> */}
        {/* カラーコード入力 */}
        {/* <div className="color-input">
          <span className="input-label"></span>
          <input
            type="text"
            placeholder="#FF0000"
            className="color-code-input"
            value={colorCode}
            onChange={(e) => setColorCode(e.target.value)}
          />
        </div> */}

        {/* カラーピッカー */}
        {/* <div className="color-picker-wrapper">
          <input
            type="color"
            className="color-picker"
            onChange={(e) => setColorCode(e.target.value)}
          />
          <span className="picker-label">カラーピッカー</span>
        </div>
      </div> */}
      </div>
    </>
  );
};

export default ColorSearch;
