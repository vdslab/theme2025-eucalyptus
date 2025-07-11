import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getSelectListFromURL, saveSelectListToURL } from "./utils/urlParams";
import AppLayout from "./components/layout/AppLayout";
import MainPage from "./pages/MainPage";
import SubPage from "./pages/SubPage";
import ModalPage from "./pages/function/ModalPage";
import FlowersCart from "./pages/FlowersCart";

function App() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [monthRange, setMonthRange] = useState({ start: 0, end: 11 });

  // todo: ワードクラウドで表示されている頻出単語をselectWordの初期値とする
  const [selectedWordData, setSelectedWordData] = useState({
    selectedWord: null,
    flowerColorIndex: null,
  });
  const [allFlowersData, setAllFlowersData] = useState({});
  const [selectList, setSelectList] = useState([]);

  // 初回読み込み時にURLからカート情報を復元
  useEffect(() => {
    const flowersFromURL = getSelectListFromURL();
    if (flowersFromURL.length > 0) {
      setSelectList(flowersFromURL);
      console.log("URLからカート情報を復元:", flowersFromURL);
    }
  }, []);

  // selectListが変更されたらURLを更新
  useEffect(() => {
    saveSelectListToURL(selectList);
  }, [selectList]);

  const handleWordSelect = (word, slideIndex) => {
    console.log("単語が選択されました:", word, "スライド:", slideIndex);
    setSelectedWordData({
      selectedWord: word,
      flowerColorIndex: slideIndex,
    });
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <AppLayout
              monthRange={monthRange}
              onMonthChange={setMonthRange}
              rightContent={
                <SubPage
                  selectedWordData={selectedWordData}
                  allFlowersData={allFlowersData}
                  activeSlide={activeSlide}
                  monthRange={monthRange}
                  selectList={selectList}
                  setSelectList={setSelectList}
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
          }
        />
        <Route
          path="/cart"
          element={
            <FlowersCart
              selectList={selectList}
              setSelectList={setSelectList}
              allFlowersData={allFlowersData}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
