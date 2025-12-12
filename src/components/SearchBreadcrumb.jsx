import { IoIosArrowForward } from "react-icons/io";

const SearchBreadcrumb = ({ history, onFilterClick }) => {
  if (history.length === 0) return null;
  return (
    <div className="absolute left-0 top-full m-2 bg-white/90 px-4 py-2 flex items-center gap-2 z-10 text-xs">
      <button
        onClick={() => onFilterClick(-1)} // 全てクリア
        className="hover:underline"
      >
        全て
      </button>
      {history.map((filter, index) => (
        <div key={index} className="flex items-center gap-2">
          <IoIosArrowForward className="text-gray-400" />
          <button
            onClick={() => onFilterClick(index)}
            className="hover:underline text-gray-700"
          >
            {filter.value}
          </button>
        </div>
      ))}
    </div>
  );
};

export default SearchBreadcrumb;
