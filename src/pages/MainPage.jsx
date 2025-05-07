import React, { useState } from "react";
import "../styles/carousel.css";

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
                {/* <WordCloud /> */}
                <div>ワードクラウド {index + 1}</div>
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
      </div>
    </div>
  );
};

export default MainPage;
