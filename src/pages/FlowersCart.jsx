import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/cart.css";
import ModalPage from "./function/ModalPage";

const FlowersCart = ({ selectList, setSelectList, allFlowersData }) => {
  const location = useLocation();
  // console.log("selectList:", selectList);
  // selectList: Array(3) [ {…}, {…}, {…} ]
  // console.log("allFlowersData:", allFlowersData);

  // selectList花名と花色しか持っていないので、開花時期と花言葉（全て)を受け取る必要がある
  const [flowersList, setFlowersList] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const getFlowerData = (flowerName, color) => {
    const foundEntry = Object.entries(allFlowersData.flowers).find(
      ([name, data]) => name === flowerName && data.花色 === String(color)
    );
    if (!foundEntry) return { meaning: [], bloomTimes: [] };
    const [matchedName, matchedData] = foundEntry;
    const allMeanings = Object.values(matchedData.花言葉).flat();
    return {
      meaning: allMeanings,
      bloomTimes: matchedData.開花時期,
    };
  };

  // 開花時期の表示形式を変える
  const getCurrentSeason = (bloomTimes) => {
    if (!Array.isArray(bloomTimes) || bloomTimes.length === 0) return "不明";

    const start = bloomTimes[0];
    const end = bloomTimes[bloomTimes.length - 1];

    if (start === 1 && end === 12) return "通年";
    if (start === end) return `${start}月のみ`;
    return `${start}月~${end}月`;
  };

  useEffect(() => {
    if (!allFlowersData.flowers) {
      return;
    }
    const newFlowersList = selectList.map((flower) => {
      const flowerData = getFlowerData(flower.name, flower.color);
      return {
        ...flower,
        bloomTime: getCurrentSeason(flowerData.bloomTimes),
        meaning: flowerData.meaning,
      };
    });
    setFlowersList(newFlowersList);
  }, [selectList, allFlowersData]);

  // 花束生成につかうListの作成
  const [generateList, setGenerateList] = useState([]);

  // 花色テーマの定義
  const colorThemes = {
    0: { color: "#DC8CC3", name: "ピンク系" },
    1: { color: "#A6A6B4", name: "白系" },
    2: { color: "#E2AB62", name: "黄・オレンジ系" },
    3: { color: "#DC5F79", name: "赤系" },
    4: { color: "#7B8EE1", name: "青・青紫系" },
  };

  // console.log("flowersList", flowersList);
  // Array [ {…}, {…} ]形式で、name,color,bloomTime,meaning[]が受け取れる

  // 花束の役割を決める
  // ホバーされた花のindex
  const [hoveredFlower, setHoveredFlower] = useState(null);
  //それぞれの花の状態
  const [flowerRoles, setFlowerRoles] = useState({});
  useEffect(() => {
    if (flowersList.length > 0) {
      setFlowerRoles((prev) => {
        const newRoles = { ...prev };
        flowersList.forEach((_, index) => {
          if (newRoles[index] === undefined) {
            newRoles[index] = "none";
          }
        });
        return newRoles;
      });
    }
  }, [flowersList.length]);

  useEffect(() => {
    const newGenerateList = flowersList.map((flower, index) => {
      // ここでホバー時の状態を受け取る
      return {
        name: flower.name,
        color: flower.color,
        role: flowerRoles[index],
      };
    });
    setGenerateList(newGenerateList);
  }, [flowersList, flowerRoles]);

  const getButtonText = (role) => {
    switch (role) {
      case "main":
        return "メインフラワー";
      case "sub":
        return "サブフラワー";
      default:
        return "花束の役割を決める";
    }
  };

  const getMenuItems = (currentRole) => {
    switch (currentRole) {
      case "none":
        return ["メインフラワーに設定する", "サブフラワーに設定する"];
      case "main":
        return ["サブフラワーに設定する", "メインフラワーの設定を外す"];
      case "sub":
        return ["メインフラワーに設定する", "サブフラワーの設定を外す"];
    }
  };

  const handleMenuClick = (menuItem, flowerIndex) => {
    // console.log("クリックされました:", menuItem, flowerIndex);
    console.log(flowerRoles);
    let newRole;
    if (menuItem === "メインフラワーに設定する") {
      newRole = "main";
    } else if (menuItem === "サブフラワーに設定する") {
      newRole = "sub";
    } else if (menuItem.includes("設定を外す")) {
      newRole = "none";
    }

    setFlowerRoles((prev) => ({
      ...prev,
      [flowerIndex]: newRole,
    }));
    setHoveredFlower(null);
  };

  return (
    <div>
      <header className="header">
        <Link to={`/${location.search}`} className="back-button">
          花束作成支援サイト
        </Link>
      </header>

      <div className="cart-content">
        {/* <div class="cart-page-title">カートページ</div> */}

        <div className="cart-card-scroll">
          <div className="cart-cards-grid">
            {flowersList.map((flowers, index) => (
              <div key={index} className="flower-card-cart">
                <div className="flower-name">{flowers.name}</div>

                <div>
                  <div className="cart-overview">
                    花言葉: {flowers.meaning.join(",")}
                  </div>
                  <div
                    className="dropdown-content"
                    // ホバー時
                    onMouseEnter={() =>
                      setHoveredFlower(index) + console.log(hoveredFlower)
                    }
                    // マウスが離れた時
                    onMouseLeave={() =>
                      setHoveredFlower(null) + console.log("マウスが離れた")
                    }
                  >
                    <button className="setting-flower">
                      {getButtonText(flowerRoles[index])}
                    </button>
                    {hoveredFlower === index ? (
                      <div className="dropdown-menu">
                        {getMenuItems(flowerRoles[index]).map(
                          (item, itemIndex) => (
                            <div
                              key={itemIndex}
                              onClick={() => handleMenuClick(item, index)}
                            >
                              {item}
                            </div>
                          )
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="cart-overview">
                  開花時期: {flowers.bloomTime}
                </div>

                <div>
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
        <div className="footer">
          <button className="green-modal" onClick={() => setOpenModal(true)}>
            グリーン系を選択
          </button>
          <button className="create-button">作成</button>
        </div>
      </div>
      <ModalPage isOpen={openModal} setIsOpen={setOpenModal} />
    </div>
  );
};
export default FlowersCart;
