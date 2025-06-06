import React, { useEffect, useState } from "react";
import "../styles/carousel.css";
import WordCloud from "./function/wordCloud";

const MainPage = () => {
  // 現在のスライドインデックス
  const [activeSlide, setActiveSlide] = useState(0);
  // スライドの総数:テーマの数で調整
  const totalSlides = 6;

  // 前のスライドに移動
  const goToPrevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  // 次のスライドに移動
  const goToNextSlide = () => {
    setActiveSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  // 指定したスライドに移動
  const goToSlide = (index) => {
    setActiveSlide(index);
  };

  const [allFlowersData, setAllFlowersData] = useState({});
  const [loading, setLoading] = useState(true);

  // 花色別にワードクラウドデータを生成する関数
  const generateWordCloudData = (flowerColor) => {
    if (!allFlowersData.flowers) return [];

    const frequencyMap = new Map();

    // 指定した花色の花のみフィルタリング
    Object.values(allFlowersData.flowers).forEach((flower) => {
      if (flower.花色 === flowerColor && flower.花言葉) {
        // 花言葉オブジェクトのキー（親要素）を取得
        Object.keys(flower.花言葉).forEach((parentElement) => {
          const currentCount = frequencyMap.get(parentElement) || 0;
          frequencyMap.set(parentElement, currentCount + 2);
        });
      }
    });

    // WordCloud用の配列に変換
    return Array.from(frequencyMap.entries()).map(([text, frequency]) => ({
      text: text,
      value: frequency,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/data/pinkNomi_parent_child_data.json");
        const data = await res.json();

        setAllFlowersData(data);
        setLoading(false);
        console.log("花データ読み込み完了:", data);
      } catch (error) {
        console.error("データの読み込みエラー:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="carousel-container">
        {/* カルーセルトラック - 横スクロールするコンテナ */}
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${activeSlide * 100}%)` }}
        >
          {[...Array(totalSlides)].map((_, index) => {
            // スライドごとに花色を決定
            let flowerColor;
            let slideTitle;

            if (index === 0) {
              flowerColor = "0"; // ピンク系の花
              slideTitle = "ピンク系の花言葉";
            } else if (index === 1) {
              flowerColor = "1"; // 白い花
              slideTitle = "白い花の花言葉";
            } else {
              flowerColor = "0"; // デフォルト
              slideTitle = `テーマ ${index + 1}`;
            }

            const currentWordCloudData = generateWordCloudData(flowerColor);

            return (
              <div className="carousel-slide" key={index}>
                <div className="slide-content">
                  {!loading && currentWordCloudData.length > 0 ? (
                    <WordCloud
                      width={window.innerWidth * 0.7}
                      height={window.innerHeight * 0.6}
                      data={currentWordCloudData}
                      fontFamily="Impact"
                    />
                  ) : (
                    <div
                      style={{
                        textAlign: "center",
                        fontSize: "18px",
                        color: "#666",
                      }}
                    >
                      {loading ? "データ読み込み中..." : "データがありません"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/*左*/}
        <button
          className="carousel-nav-btn carousel-prev"
          onClick={goToPrevSlide}
        >
          &#9664;
        </button>

        {/*右*/}
        <button
          className="carousel-nav-btn carousel-next"
          onClick={goToNextSlide}
        >
          &#9654;
        </button>

        {/*ドット*/}
        <div className="carousel-dots">
          {[...Array(totalSlides)].map((_, index) => (
            <div
              key={index}
              className={`carousel-dot ${
                activeSlide === index ? "active" : ""
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>

        <div className="cluster-title">
          {activeSlide === 0 && "ピンク系の花言葉"}
          {activeSlide === 1 && "白い花の花言葉"}
          {activeSlide >= 2 && `テーマ ${activeSlide + 1}`}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
