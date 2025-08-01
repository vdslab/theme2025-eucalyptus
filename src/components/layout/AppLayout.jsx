import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useUrlParams } from "../../utils/urlParams";
import Header from "./Header";
import MainPage from "../../pages/MainPage";
import SubPage from "../../pages/SubPage";
import ModalPage from "../../pages/function/ModalPage";
import FlowersMain from "../../pages/FlowersMain";
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
  // グリーンのデータを取得する
  const [greenFlowersData, setGreenFlowersData] = useState({});
  // 切花データを取得する
  const [allFlowersData, setAllFlowersData] = useState({});
  // 選んだ花たち
  const [selectList, setSelectList] = useState([]);

  // AppLayoutでデータを読み込む(FlowersCartでallFlowersDataが読み込めなかったので)
  //todo: Mainの読み込みも消して一つできたらいいところ
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 通常の花データ
        const res1 = await fetch("/data/parent_child_data.json");
        const data1 = await res1.json();
        setAllFlowersData(data1);

        // グリーン系データ
        const res2 = await fetch("/data/green_data.json");
        const data2 = await res2.json();
        setGreenFlowersData(data2);

        console.log("AppLayoutでデータ読み込み完了");
      } catch (error) {
        console.error("データの読み込みエラー:", error);
      }
    };
    fetchData();
  }, []);

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
            <Header
              monthRange={monthRange}
              onMonthChange={setMonthRange}
              selectList={selectList}
            />
            <main className="main-content">
              <div className="content-wrapper">
                <div
                  className={`left-Panel ${
                    selectList.length > 0 ? "with-flower" : ""
                  }`}
                >
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
                {selectList.length > 0 && (
                  <div className="flowers-panel">
                    <FlowersMain
                      allFlowersData={allFlowersData}
                      selectList={selectList}
                      setSelectList={setSelectList}
                      greenFlowersData={greenFlowersData}
                    />
                  </div>
                )}
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
            greenFlowersData={greenFlowersData}
          />
        }
      />
    </Routes>
  );
};

export default AppLayout;
