import React, { useEffect, useMemo, useState } from "react";
import "../styles/carousel.css";
import WordCloud from "./function/wordCloud";
import CircularMonthSlider from "./function/CircularMonthSlider";

const months = [
  "1月",
  "2月",
  "3月",
  "4月",
  "5月",
  "6月",
  "7月",
  "8月",
  "9月",
  "10月",
  "11月",
  "12月",
];

const MainPage = () => {
  // 現在のスライドインデックス
  const [activeSlide, setActiveSlide] = useState(0);
  // スライドの総数:テーマの数で調整
  const totalSlides = 5;

  // 前のスライドへ移動
  const goToPrevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  // 次のスライドへ移動
  const goToNextSlide = () => {
    setActiveSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  // 指定したスライドへ移動
  const goToSlide = (index) => setActiveSlide(index);

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [allFlowersData, setAllFlowersData] = useState({});
  const [loading, setLoading] = useState(true);

  // 選択された月の範囲（12月〜3月など）
  const [monthRange, setMonthRange] = useState({ start: 11, end: 2 });

  const title = [
    "ピンク系の花の花言葉",
    "白系の花の花言葉",
    "黄・オレンジ系の花の花言葉",
    "赤系の花の花言葉",
    "青・青紫系の花言葉",
  ];

  const slideColors = ["#DC8CC3", "#A6A6B4", "#E2AB62", "#DC5F79", "#7B8EE1"];
  const slideColorsHover = [
    "#EB7BC2",
    "#6A6A73",
    "#E2A542",
    "#DC5766",
    "#7A71E1",
  ];

  // const handleWordSelect = (wordData) => {
  //   console.log("選択された単語データ:", wordData);
  //   setSelectedWordData(wordData);
  //   setCurrentPage("sub");
  // };

  // 花色別にワードクラウドデータを生成する関数
  const generateWordCloudData = (flowerColor) => {
    if (!allFlowersData.flowers) return [];

    const frequencyMap = new Map();

    Object.values(allFlowersData.flowers).forEach((flower) => {
      const matchColor = flower.花色 === flowerColor;

      const matchMonth =
        Array.isArray(flower.開花時期) &&
        flower.開花時期.some((m) => {
          const { start, end } = monthRange;
          if (start <= end) return m - 1 >= start && m - 1 <= end;
          return m - 1 >= start || m - 1 <= end;
        });

      if (matchColor && matchMonth && flower.花言葉) {
        Object.keys(flower.花言葉).forEach((parentElement) => {
          const currentCount = frequencyMap.get(parentElement) || 0;
          frequencyMap.set(parentElement, currentCount + 2);
        });
      }
    });

    // WordCloud用の配列に変換
    return Array.from(frequencyMap.entries()).map(([text, frequency]) => ({
      text,
      value: frequency,
    }));
  };

  // ワードクラウドデータを事前に計算する
  //　今後、開花時期で絞ったりする場合は、依存関係を増やす必要あり？
  const allWordCloudData = useMemo(() => {
    if (!allFlowersData.flowers) return [];
    return Array.from({ length: totalSlides }, (_, index) => {
      const flowerColor = `${index}`;
      return generateWordCloudData(flowerColor);
    });
  }, [allFlowersData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/data/parent_child_data.json");
        const data = await res.json();
        setAllFlowersData(data);
        setLoading(false);
      } catch (error) {
        console.error("データの読み込みエラー:", error);
        setLoading(false);
      }
    };

    fetchData();

    const reSizeWindow = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", reSizeWindow);
    //コンポーネントのアンマウント時(コンポーネントがwebページを離れたとき)に実行する関数
    return () => window.removeEventListener("resize", reSizeWindow);
  }, []);

  return (
    <div>
      <div className="carousel-container">
        <div style={{ textAlign: "center", margin: "20px" }}>
          <label>開花時期で絞り込み: </label>
          <CircularMonthSlider
            start={monthRange.start}
            end={monthRange.end}
            onChange={(start, end) => setMonthRange({ start, end })}
          />
        </div>

        {/* カルーセルトラック - 横スクロールするコンテナ */}
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${activeSlide * 100}%)` }}
        >
          {[...Array(totalSlides)].map((_, index) => {
            // スライドごとに花色を決定
            //0から順に"ピンク系","白系","黄・オレンジ系","赤系","青・青紫系",
            const currentWordCloudData = allWordCloudData[index] || [];

            return (
              <div className="carousel-slide" key={index}>
                <div className="slide-content">
                  {!loading && currentWordCloudData.length > 0 ? (
                    <WordCloud
                      width={windowSize.width * 0.5}
                      height={windowSize.height * 0.8}
                      data={currentWordCloudData}
                      fontFamily="Noto Sans JP"
                      slideIndex={index}
                      slideColor={slideColors[index]}
                      slideColorHover={slideColorsHover[index]}
                      // onWordClick={handleWordSelect}
                      // currentSlideColor={index.toString()}
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

        {/* ページのタイトル */}
        <div className="cluster-title">
          {[...Array(totalSlides)].map((_, index) => (
            <div key={index}>{activeSlide === index && title[index]}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
