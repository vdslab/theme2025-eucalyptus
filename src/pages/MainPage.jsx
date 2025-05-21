import React, { useEffect, useState } from "react";
import "../styles/carousel.css";
import WordCloud from "./function/wordCloud";

// todo: 一番最初の位置から、左を選択した時のスライドの移動をスムーズにする必要がある？

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

  const [flowerData, setFlowerData] = useState([]);
  const [clusterData, setClusterData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/data/flowers_clustered.json");
      const data = await res.json();
      setFlowerData(data);

      // クラスターごとにデータを分類
      const clusters = {};
      for (let i = 0; i < totalSlides; i++) {
        clusters[i] = [];
      }

      data.forEach((flower) => {
        const cluster = flower.custer;
        if (cluster >= 0 && cluster < totalSlides) {
          // 花言葉をスペースで分割して単語に分ける
          const words = flower.language.split(/[\s、。]/);
          words.forEach((word) => {
            if (word && word.length > 0) {
              // 既に同じ単語があるか確認
              const existingWord = clusters[cluster].find(
                (item) => item.text === word
              );
              if (existingWord) {
                existingWord.value += 3; // 既存の単語の場合、値を増やす
              } else {
                clusters[cluster].push({
                  text: word,
                  value: 10, // 新しい単語の初期値
                });
              }
            }
          });
        }
      });

      setClusterData(clusters);
      console.log("クラスターデータ:", clusters);
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
          {[...Array(totalSlides)].map((_, index) => (
            <div className="carousel-slide" key={index}>
              <div className="slide-content">
                {/* この中でワードクラウドを表示 */}
                {clusterData[index] && clusterData[index].length > 0 ? (
                  <WordCloud
                    width={window.innerWidth * 0.7}
                    height={window.innerHeight * 0.6}
                    data={clusterData[index]}
                    fontFamily="Impact"
                  />
                ) : (
                  <div>データ読み込み中...</div>
                )}
              </div>
            </div>
          ))}
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
        <div className="cluster-title">テーマ {activeSlide + 1}</div>
      </div>
    </div>
  );
};

export default MainPage;
