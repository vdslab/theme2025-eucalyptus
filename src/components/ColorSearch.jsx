import { IoMdClose } from "react-icons/io";

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
    { name: "緑", hex: "#13AF17" },
  ];

  if (isMobile) {
    // モバイル版
    return (
      <div className="p-4">
        {selectedColor.name && (
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full">
            <div
              className="w-5 h-5 rounded-full border-2 border-gray-200"
              style={{ backgroundColor: selectedColor.code }}
            />
            <span className="text-sm">{selectedColor.name}</span>
            <button
              onClick={() => {
                setSelectedColor({ code: "", name: "" });
                onClearSearch();
              }}
              className="ml-1 text-[#8DA39F] hover:text-[#0e4037]"
            >
              <IoMdClose className="w-4 h-4" />
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

  // PC版
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 min-w-max">
      {/* 選択中の色表示 */}
      {selectedColor.name && (
        <div className="mb-4 inline-flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full">
          <div
            className="w-5 h-5 rounded-full border-2 border-gray-200"
            style={{ backgroundColor: selectedColor.code }}
          />
          <span className="text-sm">{selectedColor.name}</span>
          <button
            onClick={() => {
              setSelectedColor({ code: "", name: "" });
              onClearSearch();
            }}
            className="ml-1  text-[#8DA39F] hover:text-[#0e4037]"
          >
            <IoMdClose className="w-4 h-4" />
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
