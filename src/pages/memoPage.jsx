import { useState, useEffect } from "react";
import "../styles/subpage.css";

const SubPage = ({ selectedWordData, allFlowersData, onBack }) => {
  const [childElements, setChildElements] = useState([]);
  const [flowersList, setFlowersList] = useState([]);

  useEffect(() => {
    if (selectedWordData && allFlowersData.flowers) {
      const { selectedWord, flowerColorIndex } = selectedWordData;

      console.log("SubPageでの検索:", { selectedWord, flowerColorIndex });

      // 子要素と花の情報を検索
      const childElementsSet = new Set();
      const flowersWithWord = [];

      // 指定された花色の花のみを検索
      Object.entries(allFlowersData.flowers).forEach(
        ([flowerName, flowerData]) => {
          if (flowerData.花色 === flowerColorIndex && flowerData.花言葉) {
            // 選択された単語が花言葉のキーに存在するかチェック
            if (flowerData.花言葉[selectedWord]) {
              console.log(
                `${flowerName} に「${selectedWord}」が見つかりました:`,
                flowerData.花言葉[selectedWord]
              );

              // 子要素（意味の詳細）を収集
              flowerData.花言葉[selectedWord].forEach((meaning) => {
                childElementsSet.add(meaning);
              });

              // この花の情報を保存
              flowersWithWord.push({
                name: flowerName,
                meanings: flowerData.花言葉[selectedWord],
                bloomTime: flowerData.開花時期,
              });
            }
          }
        }
      );

      console.log("見つかった子要素:", Array.from(childElementsSet));
      console.log("見つかった花:", flowersWithWord);

      setChildElements(Array.from(childElementsSet));
      setFlowersList(flowersWithWord);
    }
  }, [selectedWordData, allFlowersData]);

  if (!selectedWordData) {
    return <div>データがありません</div>;
  }

  const { selectedWord, flowerColorIndex } = selectedWordData;

  // 花色テーマの設定
  const colorThemes = {
    0: { color: "#DC8CC3", name: "ピンク系" },
    1: { color: "#A6A6B4", name: "白系" },
    2: { color: "#E2AB62", name: "黄・オレンジ系" },
    3: { color: "#DC5F79", name: "赤系" },
    4: { color: "#7B8EE1", name: "青・青紫系" },
  };

  const currentTheme = colorThemes[flowerColorIndex] || {
    color: "#666",
    name: "不明",
  };

  return (
    <div className="subpage-container">
      {/* ヘッダー */}
      // SubPage.jsx のヘッダー部分を修正
      <header
        className="subpage-header"
        style={{ borderBottom: `3px solid ${currentTheme.color}` }}
      >
        {/* 戻るボタンを条件付きで表示 */}
        {onBack && (
          <button
            className="back-button"
            onClick={onBack}
            style={{ color: currentTheme.color }}
          >
            ← 戻る
          </button>
        )}
        <div className="header-info">
          <h1
            className="selected-word-title"
            style={{ color: currentTheme.color }}
          >
            「{selectedWord}」
          </h1>
          <span
            className="flower-type-badge"
            style={{
              backgroundColor: `${currentTheme.color}15`,
              color: currentTheme.color,
            }}
          >
            {currentTheme.name}
          </span>
        </div>
      </header>
      {/* 統計情報 */}
      <div className="stats-section">
        <div className="stat-card">
          <span className="stat-number">{childElements.length}</span>
          <span className="stat-label">種類の意味</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{flowersList.length}</span>
          <span className="stat-label">該当する花</span>
        </div>
      </div>
      {/* デバッグ情報 */}
      <div
        style={{
          background: "#f5f5f5",
          padding: "10px",
          margin: "20px 0",
          fontSize: "14px",
        }}
      >
        <strong>デバッグ情報:</strong>
        <br />
        選択された単語: {selectedWord}
        <br />
        花色インデックス: {flowerColorIndex}
        <br />
        見つかった意味: {childElements.length}個<br />
        見つかった花: {flowersList.length}個
      </div>
      {/* 子要素（意味）一覧 */}
      {childElements.length > 0 && (
        <section className="meanings-section">
          <h2 className="section-title">「{selectedWord}」の様々な意味</h2>
          <div className="meanings-grid">
            {childElements.map((meaning, index) => (
              <div
                key={index}
                className="meaning-card"
                style={{ borderLeft: `4px solid ${currentTheme.color}` }}
              >
                <span className="meaning-text">{meaning}</span>
              </div>
            ))}
          </div>
        </section>
      )}
      {/* 花一覧 */}
      {flowersList.length > 0 && (
        <section className="flowers-section">
          <h2 className="section-title">
            「{selectedWord}」を表現する{currentTheme.name}の花
          </h2>
          <div className="flowers-grid">
            {flowersList.map((flower, index) => (
              <div key={index} className="flower-card">
                <div
                  className="flower-header"
                  style={{ backgroundColor: `${currentTheme.color}15` }}
                >
                  <h3
                    className="flower-name"
                    style={{ color: currentTheme.color }}
                  >
                    {flower.name}
                  </h3>
                </div>
                <div className="flower-content">
                  <div className="flower-meanings">
                    <h4>「{selectedWord}」として表現される意味：</h4>
                    <ul>
                      {flower.meanings.map((meaning, idx) => (
                        <li
                          key={idx}
                          className="meaning-item"
                          style={{ color: currentTheme.color }}
                        >
                          {meaning}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bloom-time">
                    <h4>開花時期：</h4>
                    <div className="bloom-months">
                      {Array.isArray(flower.bloomTime) ? (
                        flower.bloomTime.map((month, idx) => (
                          <span
                            key={idx}
                            className="month-badge"
                            style={{
                              backgroundColor: `${currentTheme.color}20`,
                              color: currentTheme.color,
                            }}
                          >
                            {month}月
                          </span>
                        ))
                      ) : (
                        <span>{flower.bloomTime}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      {/* データが見つからない場合 */}
      {childElements.length === 0 && flowersList.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          <h3>該当するデータが見つかりませんでした</h3>
          <p>
            「{selectedWord}」を花言葉に持つ{currentTheme.name}
            の花は見つかりませんでした。
          </p>
        </div>
      )}
    </div>
  );
};

export default SubPage;
