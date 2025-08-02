import { useEffect, useState } from "react";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    borderRadius: "1rem",
    transform: "translate(-50%, -50%)",
    padding: "20px 40px",
    color: "#323b49",
  },
  overlay: {
    // backgroundColor: "rgb(196 196 196 / 75%)",
    backgroundColor: "rgb(0 0 0 / 50%)",
  },
};

const ModalPage = ({
  isOpen,
  setIsOpen,
  selectList,
  setSelectList,
  // グリーン系のデータはAppLayoutで取得している
  greenFlowersData,
}) => {
  const getCurrentSeason = (start, end) => {
    if (start === 1 && end === 12) return "通年";
    if (start === end) return `${start}月のみ`;
    return `${start}月~${end}月`;
  };

  const greenFlowerData = [];
  if (greenFlowersData.flowers) {
    Object.entries(greenFlowersData.flowers).forEach(
      ([flowerName, flowerData]) => {
        const bloomTimes = flowerData.開花時期;
        greenFlowerData.push({
          name: flowerName,
          meaning: flowerData.花言葉,
          bloomTimes: getCurrentSeason(
            bloomTimes[0],
            bloomTimes[bloomTimes.length - 1]
          ),
          en: flowerData.en,
          image: flowerData.image,
        });
      }
    );
  }

  const closeModal = () => {
    return setIsOpen(false);
  };

  // 選択したグリーン系が、既に選択されているか否かを判別する
  const handleGreenClick = (clickedGreen) => {
    const greenWithColor = {
      name: clickedGreen.name,
      color: 5,
    };
    const isAlreadySelected = selectList.some(
      (green) => green.name === clickedGreen.name
    );
    if (isAlreadySelected) {
      setSelectList((prev) =>
        prev.filter((green) => green.name !== clickedGreen.name)
      );
    } else {
      setSelectList((prev) => [...prev, greenWithColor]);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
      <div className="greenModal-title-content">
        <div className="greenModal-title">グリーン系</div>
        <div className="greenModal-overview">
          グリーン系とは花束のバランスをとってくれる緑色のお花たちのことです。
        </div>
      </div>

      <div className="modal-grid">
        {greenFlowerData.map((greenFlower, index) => {
          const isSelected = selectList.some(
            (flower) => flower.name === greenFlower.name
          );
          return (
            <button
              key={index}
              onClick={() => handleGreenClick(greenFlowerData[index])}
              className={`modal-card ${isSelected ? "selected" : ""}`}
            >
              <div className="greenFlower-name">{greenFlower.name}</div>
              <div className="flower-content">
                <div className="flower-meanings">
                  花言葉: {greenFlower.meaning}
                </div>
              </div>

              {/* 「夏」の葉と表示させているなら、開花時期を表示させる理由はないのでは */}
              {/* <div className="flower-info">
              開花時期: {greenFlower.bloomTimes}
            </div> */}

              <div className="flower-image-container">
                <img
                  src={greenFlower.image}
                  alt={greenFlower.name}
                  className="flower-image"
                />
              </div>
            </button>
          );
        })}
      </div>
      <div className="modalPage-buttons">
        <button onClick={closeModal} className="modal-button apply">
          追加
        </button>
      </div>
    </Modal>
  );
};
export default ModalPage;
