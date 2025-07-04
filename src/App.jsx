import React, { useState } from "react";
import AppLayout from "./components/layout/AppLayout";
import MainPage from "./pages/MainPage";
import SubPage from "./pages/SubPage";

function App() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [monthRange, setMonthRange] = useState({ start: 0, end: 11 });

  // todo: ワードクラウドで表示されている頻出単語をselectWordの初期値とする
  const [selectedWordData, setSelectedWordData] = useState({
    selectedWord: null,
    flowerColorIndex: null,
  });
  const [allFlowersData, setAllFlowersData] = useState({});

  const handleWordSelect = (word, slideIndex) => {
    console.log("単語が選択されました:", word, "スライド:", slideIndex);
    setSelectedWordData({
      selectedWord: word,
      flowerColorIndex: slideIndex,
    });
  };

  return (
    <AppLayout
      monthRange={monthRange}
      onMonthChange={setMonthRange}
      rightContent={
        <SubPage
          selectedWordData={selectedWordData}
          allFlowersData={allFlowersData}
          activeSlide={activeSlide}
          monthRange={monthRange}
        />
      }
    >
      <MainPage
        activeSlide={activeSlide}
        setActiveSlide={setActiveSlide}
        monthRange={monthRange}
        // SubPageの為
        onWordSelect={handleWordSelect}
        onFlowersDataLoad={setAllFlowersData}
      />
    </AppLayout>
  );
}

export default App;
