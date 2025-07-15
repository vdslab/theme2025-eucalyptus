import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
// import { useUrlParams } from "./utils/urlParams";
import { useUrlParams } from "../../utils/urlParams";
import Header from "./Header";
import MainPage from "../../pages/MainPage";
import SubPage from "../../pages/SubPage";
import ModalPage from "../../pages/function/ModalPage";
import FlowersCart from "../../pages/FlowersCart";
import "../../styles/layout.css";

// const AppLayout = ({ children, monthRange, onMonthChange, rightContent }) => {
//   return (
//     <div className="app-container">
//       <Header monthRange={monthRange} onMonthChange={onMonthChange} />
//       <main className="main-content">
//         <div className="content-wrapper">
//           <div className="left-Panel">{children}</div>
//           <div className="right-Panel">{rightContent}</div>
//         </div>
//       </main>
//     </div>
//   );
// };

const AppLayout = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [monthRange, setMonthRange] = useState({ start: 0, end: 11 });

  // todo: ワードクラウドで表示されている頻出単語をselectWordの初期値とする
  const [selectedWordData, setSelectedWordData] = useState({
    selectedWord: null,
    flowerColorIndex: null,
  });
  const [allFlowersData, setAllFlowersData] = useState({});
  const [selectList, setSelectList] = useState([]);

  // React Routerの内側でuseUrlParamsを使いたかった
  const { getSelectListFromURL, saveSelectListToURL } = useUrlParams();

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
    <Routes>
      <Route
        path="/"
        element={
          <div className="app-container">
            <Header monthRange={monthRange} onMonthChange={setMonthRange} />
            <main className="main-content">
              <div className="content-wrapper">
                <div className="left-Panel">
                  <MainPage
                    activeSlide={activeSlide}
                    setActiveSlide={setActiveSlide}
                    monthRange={monthRange}
                    onWordSelect={handleWordSelect}
                    onFlowersDataLoad={setAllFlowersData}
                  />
                </div>
                <div className="right-Panel">
                  <SubPage
                    selectedWordData={selectedWordData}
                    allFlowersData={allFlowersData}
                    activeSlide={activeSlide}
                    monthRange={monthRange}
                    selectList={selectList}
                    setSelectList={setSelectList}
                  />
                </div>
              </div>
            </main>
          </div>
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
  );
};

export default AppLayout;
