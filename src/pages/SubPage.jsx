import React, { useState, useEffect, useRef } from "react";
import "../styles/subpage.css";

// データの形 memo
//  "スプレーカーネーション『恋心』": {
//       "花色": "0",
//       "花言葉": {
//         "純粋": ["純粋な愛"],
//         "感動": ["感動"],
//         "愛情": ["あなたを想う"]
//       },
//       "開花時期": [4, 5, 6, 7, 8, 9, 10]
//     },

const SubPage = ({
  selectedWordData,
  allFlowersData,
  activeSlide,
  monthRange,
}) => {
  // 選択した花言葉を持つ花のリスト
  const [flowersList, setFlowersList] = useState([]);
  const [childElements, setChildElements] = useState([]);

  // 各花のカードへの参照を保存するためのref
  const flowerRefs = useRef({});

  // 花色テーマの定義
  const colorThemes = {
    0: { color: "#DC8CC3", name: "ピンク系" },
    1: { color: "#A6A6B4", name: "白系" },
    2: { color: "#E2AB62", name: "黄・オレンジ系" },
    3: { color: "#DC5F79", name: "赤系" },
    4: { color: "#7B8EE1", name: "青・青紫系" },
  };

  // 開花時期の表示用関数
  const getCurrentSeason = (start, end) => {
    if (start === 1 && end === 12) return "通年";
    if (start === end) return `${start}月のみ`;
    return `${start}月~${end}月`;
  };
  useEffect(() => {
    console.log("=== データ確認 ===");
    console.log("selectedWordData:", selectedWordData);
    console.log("selectedWordData:", selectedWordData);
    console.log("activeSlide:", activeSlide);
    // 開花時期
    console.log("monthRange:", monthRange);
    console.log("allFlowersData.flowers:", allFlowersData.flowers);
    // 下だとmetaDataも入ってしまう
    console.log("allFlowersData:", allFlowersData);

    if (!allFlowersData || !allFlowersData.flowers) {
      // 一周目は、allFlowersDataの中身がないのでスキップする必要がある
      // stateをクリア
      setFlowersList([]);
      setChildElements([]);
      return;
    }

    const selectedWord = selectedWordData.selectedWord;
    const flowerColorIndex = selectedWordData.flowerColorIndex?.toString();

    // 子要素の配列 重複がないように
    const childElementsSet = new Set();
    // 名前、子要素、開花時期の配列
    const flowersWithWord = [];

    Object.entries(allFlowersData.flowers).forEach(
      ([flowerName, flowerData]) => {
        const bloomTimes = flowerData.開花時期;

        const matchMonth =
          Array.isArray(bloomTimes) &&
          bloomTimes.some((m) => {
            const { start, end } = monthRange;
            if (start <= end) return m - 1 >= start && m - 1 <= end;
            return m - 1 >= start || m - 1 <= end;
          });

        if (matchMonth) {
          if (flowerData.花色 === flowerColorIndex) {
            if (flowerData.花言葉[selectedWord]) {
              console.log(
                `${flowerName} に「${selectedWord}」が見つかりました:`,
                flowerData.花言葉[selectedWord]
              );

              flowerData.花言葉[selectedWord].forEach((meaning) => {
                childElementsSet.add(meaning);
              });

              flowersWithWord.push({
                name: flowerName,
                meanings: flowerData.花言葉[selectedWord],
                bloomTime: getCurrentSeason(
                  bloomTimes[0],
                  bloomTimes[bloomTimes.length - 1]
                ),
              });
            }
          }
        }
      }
    );

    setChildElements(Array.from(childElementsSet));
    setFlowersList(flowersWithWord);

    console.log("flowersList", flowersList);
    // bloomTime: "通年";
    // meanings: Array["感動"];
    // name: "スプレーカーネーション『恋心』";
    console.log("childElements", childElements);
  }, [selectedWordData, allFlowersData]);

  if (!selectedWordData.selectedWord) {
    return (
      <div>
        <div className="no-select">気になる花言葉を選択してください</div>
      </div>
    );
  }

  const flowerColorIndex = selectedWordData.flowerColorIndex;
  const flowerColor = colorThemes[flowerColorIndex];
  console.log("花色:", flowerColor.name);

  const scrollToFlowerWithMeaning = (targetMeaning) => {
    // 該当する花言葉を持つ最初の花を見つける
    const targetFlower = flowersList.find((flower) =>
      flower.meanings.includes(targetMeaning)
    );

    if (targetFlower && flowerRefs.current[targetFlower.name]) {
      flowerRefs.current[targetFlower.name].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="right-panel-container">
      {/* flexでカードの領域を出したいので、ここをヘッダーとする */}
      <div className="header-section">
        <div className="main-title">
          「{selectedWordData.selectedWord}」が含まれる花言葉
        </div>

        <div className="tags-container">
          {/* 花色　これはtagじゃなくても良い　背景に入れてみたい */}
          <div
            className="color-tag-item"
            style={{ background: flowerColor.color }}
          >
            {flowerColor.name}
          </div>
          {/* 子要素一覧 */}
          {childElements.map((element, index) => (
            <button
              key={index}
              className="tag-item"
              onClick={() => {
                scrollToFlowerWithMeaning(element);
              }}
            >
              {element}
            </button>
          ))}
        </div>
      </div>

      <div className="cards-scroll-container">
        <div className="cards-grid">
          {flowersList.map((flowers, index) => (
            <div
              key={index}
              className="flower-card"
              ref={(target) => {
                if (target) {
                  flowerRefs.current[flowers.name] = target;
                }
              }}
            >
              <div className="flower-name">{flowers.name}</div>

              <div className="flower-content">
                <div className="flower-meanings">
                  花言葉: {flowers.meanings.join(",")}
                </div>
                <button className="save-button">＋ 花束カートに入れる</button>
              </div>

              <div className="flower-info">開花時期: {flowers.bloomTime}</div>

              <div className="flower-image-container">
                <img
                  src="/images/questionMark.jpg"
                  alt="花の画像"
                  className="flower-image"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubPage;
