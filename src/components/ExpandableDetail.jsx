import "../styles/expandableDetail.css";
import { RxCross2 } from "react-icons/rx";

function ExpandableDetail({ data, onClose, isMobile = false, flowerMetadata }) {
  const metadata = flowerMetadata?.[data.filename];

  const getBloomSeasonText = (bloomSeason) => {
    if (!bloomSeason || bloomSeason.length === 0) return "情報なし";

    // 表記：周年または、〇~〇月
    if (bloomSeason.length === 12) return "周年";
    const minMonth = Math.min(...bloomSeason);
    const maxMonth = Math.max(...bloomSeason);

    if (minMonth === maxMonth) {
      return `${minMonth}月`;
    }

    return `${minMonth}月～${maxMonth}月`;
  };

  if (isMobile) {
    return (
      <div className="bg-gray-100 rounded-lg shadow-lg p-4 flex gap-4 items-start relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center"
        >
          <RxCross2 size={20} />
        </button>
        <img
          src={`/images/all_flower/${data.filename}`}
          alt={data.filename}
          className="w-20 h-20 rounded object-cover flex-shrink-0"
        />
        <div className="flex-1 text-sm pr-6">
          <p className="font-medium mb-1">
            {metadata?.name || data.filename.replace(".jpeg", "")}
          </p>
          <p className="text-xs">品目名：{metadata?.family_ja || "情報なし"}</p>
          <p className=" text-xs">
            開花時期：{getBloomSeasonText(metadata?.bloom_season)}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="expandable-detail">
      <button onClick={onClose} className="close-button">
        <RxCross2 />
      </button>
      <img
        src={`/images/all_flower/${data.filename}`}
        alt={data.filename}
        style={{ width: "200px", height: "200px", objectFit: "cover" }}
      />
      <p text-sm mt-3>
        品種：{metadata?.name || data.filename.replace(".jpeg", "")}
      </p>
      <p className="text-sm">品目名：{metadata?.family_ja || "情報なし"}</p>
      {/* <p className="text-sm">サイズ：</p> */}
      <p className="text-sm">
        開花時期：{getBloomSeasonText(metadata?.bloom_season)}
      </p>
    </div>
  );
}

export default ExpandableDetail;
