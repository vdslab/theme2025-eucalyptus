import "../styles/colorSearch.css";
import { useState } from "react";

const ColorSearch = ({ onClose, onColorSelect, onClearSearch }) => {
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
