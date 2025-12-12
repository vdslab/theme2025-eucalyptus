import { useState, useMemo } from "react";

const WordSearch = ({
  flowerMetadata,
  onNameSearch,
  inputValue,
  setInputValue,
}) => {
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

  const handleClear = () => {
    setInputValue("");
    setShowSuggestions(false);
    onNameSearch();
  };

  const suggestions = useMemo(() => {
    if (!inputValue) return [];
    return allName.filter((flowerName) =>
      flowerName.toUpperCase().includes(inputValue.toUpperCase())
    );
  }, [inputValue, allName]);

  return (
    <div className="ml-auto">
      <div className="relative flex items-center gap-2 rounded-lg shadow-sm">
        <div className="relative flex-1">
          <input
            className="
        flex-1 rounded-md  px-3 py-2 text-[#0e4037] placeholder-[#8DA39F]
        focus:outline-none focus
        text-sm border-2 border-[#faf9f7] focus:border-[#8DA39F]
      "
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => inputValue && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (inputValue == "") {
                  onNameSearch();
                } else {
                  onNameSearch(inputValue);
                }
              }
            }}
            placeholder="花の種類から探す"
          />
          {inputValue && (
            <button
              className="
                absolute right-2 top-1/2 -translate-y-1/2
                text-[#8DA39F] hover:text-[#0e4037]
                transition-colors duration-150
                p-1 rounded-full hover:bg-gray-100
              "
              onClick={handleClear}
              type="button"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full text-xs left-0 right-0 bg-white rounded-md max-h-52 overflow-y-auto z-[1000] shadow-md mt-1">
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
