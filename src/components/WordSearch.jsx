import { useState, useMemo } from "react";

const WordSearch = ({ flowerMetadata, onNameSearch }) => {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const allName = useMemo(() => {
    if (!flowerMetadata) return [];
    const names = new Set();
    Object.values(flowerMetadata).forEach((flower) => {
      if (flower.family_ja) {
        names.add(flower.family_ja);
      }
    });
    return Array.from(names).sort();
  }, [flowerMetadata]);

  // const handleWordSearch = (flowerName) => {
  //   if (!flowerMetadata) return;

  //   const matches = Object.entries(flowerMetadata)
  //     .filter(
  //       ([filename, data]) =>
  //         data.family_ja && data.family_ja.includes(flowerName)
  //     )
  //     .map(([filename, data]) => ({
  //       filename: filename,
  //     }));

  //   onNameSearch(matches);
  //   console.log("nameMatch:", matches);
  // };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(value !== "");
  };

  const handleSuggestionClick = (flowerName) => {
    setInputValue(flowerName);
    onNameSearch(flowerName);
    setShowSuggestions(false);
  };

  const suggestions = useMemo(() => {
    if (!inputValue) return [];
    return allName.filter((flowerName) =>
      flowerName.toUpperCase().includes(inputValue.toUpperCase())
    );
  }, [inputValue, allName]);

  return (
    <div className="ml-auto">
      <div className="relative flex items-center gap-2 p-3 rounded-lg shadow-sm">
        <input
          className="
        flex-1
        rounded-md
        px-3 py-2
        text-emerald-900
        placeholder-emerald-900
        focus:outline-none focus
        shadow-sm
      "
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => inputValue && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onNameSearch(inputValue);
            }
          }}
          placeholder="花の品目で検索"
        />
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white rounded-md max-h-52 overflow-y-auto z-[1000] shadow-md mt-1">
            {suggestions.map((flowerName, index) => (
              <div
                className="py-2 px-3 cursor-pointer border-b border-gray-200"
                key={index}
                onClick={() => handleSuggestionClick(flowerName)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f0f0f0")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "white")
                }
              >
                {flowerName}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WordSearch;
