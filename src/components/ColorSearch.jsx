const ColorSearch = ({
  selectedColor,
  setSelectedColor,
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

  if (isMobile) {
    // モバイル版
    return (
      <div className="p-4">
        {selectedColor.name && (
          <div className="mb-4 p-3 bg-white rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded border-2 border-gray-200"
                style={{ backgroundColor: selectedColor.code }}
              />
              <span className="text-sm">{selectedColor.name}</span>
            </div>
            <button
              className="text-xs px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
              onClick={() => {
                setSelectedColor({ code: "", name: "" });
                onClearSearch();
              }}
            >
              解除
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          {presetColors.map((color) => (
            <button
              key={color.name}
              className="flex items-center gap-2.5 p-2 hover:bg-white rounded-lg transition-colors"
              onClick={() => {
                setSelectedColor({ code: color.hex, name: color.name });
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

  // PC版（Tailwind CSSで書き直し）
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 min-w-max">
      {/* 選択中の色表示 */}
      {selectedColor.name && (
        <div className="mb-3 flex items-center gap-2 text-sm">
          <div
            className="w-6 h-6 rounded border-2 border-gray-200"
            style={{ backgroundColor: selectedColor.code }}
          />
          <span>選択中: {selectedColor.name}</span>
          <button
            className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
            onClick={() => {
              setSelectedColor({ code: "", name: "" });
              onClearSearch();
            }}
          >
            解除
          </button>
        </div>
      )}

      {/* 色の選択 - 横並び */}
      <div className="flex gap-3">
        {presetColors.map((color) => (
          <div
            key={color.name}
            className="flex flex-col items-center gap-1 cursor-pointer"
            onClick={() => {
              setSelectedColor({ code: color.hex, name: color.name });
              onColorSelect(color.name);
            }}
          >
            <div
              className="w-10 h-10 rounded-full border-2 border-gray-200 hover:border-gray-400 hover:scale-110 transition-all"
              style={{ backgroundColor: color.hex }}
            />
            <span className="text-xs text-gray-600">{color.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorSearch;
