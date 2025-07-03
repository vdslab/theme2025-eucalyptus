import React, { useState, useEffect } from "react";
import "../styles/subpage.css";

const SubPage = ({
  selectedWordData,
  allFlowersData,
  activeSlide,
  monthRange,
}) => {
  // 選択した花言葉を持つ花のリスト
  const [flowersList, setFlowersList] = useState([]);

  useEffect(() => {
    // 検索処理を書く
  }, [selectedWordData, allFlowersData]);

  if (!selectedWordData || !selectedWordData.selectedWord) {
    return (
      <div>
        <h1 className="no-select">選択してください</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>{selectedWordData.selectedWord}</h1>
      <h1>{activeSlide}</h1>
    </div>
  );
};

export default SubPage;
