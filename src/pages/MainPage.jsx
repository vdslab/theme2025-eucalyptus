import React, { useEffect, useState } from "react";
import "../styles/carousel.css";
import WordCloud from "./function/WordCloud";

// todo: 一番最初の位置から、左を選択した時のスライドの移動をスムーズにする必要がある？

const MainPage = () => {
  // 現在のスライドインデックス
  const [activeSlide, setActiveSlide] = useState(0);

  // スライドの総数:テーマの数で調整
  const totalSlides = 1;

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
      const res = await fetch("/data/flowers_white_extracted_words.json");
      const data = await res.json();
      setFlowerData(data);

      // クラスターごとにデータを分類
      const clusters = {};
      for (let i = 0; i < totalSlides; i++) {
        clusters[i] = [];
      }

      // すべての花のextracted_wordsを使用する
      let wordCount = {}; // 単語の出現回数を記録するオブジェクト

      // まず、すべての単語の出現回数をカウント
      data.forEach((flower) => {
        if (flower.extracted_words && Array.isArray(flower.extracted_words)) {
          flower.extracted_words.forEach((word) => {
            if (word && word.length > 0) {
              if (wordCount[word]) {
                wordCount[word] += 8;
              } else {
                wordCount[word] = 2;
              }
            }
          });
        }
      });

      // 単語の出現回数をもとにワードクラウド用のデータを作成
      const wordCloudData = Object.keys(wordCount).map((word) => ({
        text: word,
        value: 10 + wordCount[word] * 3, // 基本値10に出現回数×3を加算
      }));

      // ワードクラウドデータをクラスター0に設定
      clusters[0] = wordCloudData;

      // デバッグ情報
      console.log("単語の総数:", wordCloudData.length);
      console.log("ワードクラウドデータ:", wordCloudData);

      setClusterData(clusters);
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
                    height={window.innerHeight * 0.5}
                    data={clusterData[index]}
                    fontFamily="Noto Sans JP"
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
