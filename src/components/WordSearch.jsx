import { useState, useMemo } from "react";

const WordSearch = ({ flowerMetadata }) => {
  const [showItem, setShowItem] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const allFamilies = useMemo(() => {
    if (!flowerMetadata) return [];
    const families = new Set();
    Object.values(flowerMetadata).forEach((flower) => {
      if (flower.family_ja) {
        families.add(flower.family_ja);
      }
    });
    return Array.from(families).sort();
  }, [flowerMetadata]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(value !== "");
  };

  const handleSuggestionClick = (family) => {
    setInputValue(family);
    setShowSuggestions(false);
  };

  const suggestions = useMemo(() => {
    if (!inputValue) return [];
    return allFamilies.filter((family) =>
      family.toUpperCase().includes(inputValue.toUpperCase())
    );
  }, [inputValue, allFamilies]);

  return (
    <div>
      <div style={{ position: "relative" }}>
        <label>検索</label>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => inputValue && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="花の品目で検索"
        />
        {showSuggestions && suggestions.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              backgroundColor: "white",
              border: "1px solid #ccc",
              borderRadius: "4px",
              maxHeight: "200px",
              overflowY: "auto",
              zIndex: 1000,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              marginTop: "4px",
            }}
          >
            {suggestions.map((family, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(family)}
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  borderBottom:
                    index < suggestions.length - 1 ? "1px solid #eee" : "none",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f0f0f0")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "white")
                }
              >
                {family}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WordSearch;
