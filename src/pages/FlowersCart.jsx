import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/cart.css";
import ModalPage from "./function/ModalPage";
import { MdCancel } from "react-icons/md";
import { PiFlowerLight, PiFlowerFill } from "react-icons/pi";
import { GiThreeLeaves } from "react-icons/gi";

const FlowersCart = ({
  selectList,
  setSelectList,
  allFlowersData,
  greenFlowersData,
}) => {
  const location = useLocation();
  // console.log("selectList:", selectList);
  // selectList: Array(3) [ {…}, {…}, {…} ]

  // selectList花名と花色しか持っていないので、開花時期と花言葉（全て)を受け取る必要がある
  const [flowersList, setFlowersList] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  // リセットボタンを押した時→一番初めの画面に戻る
  const navigate = useNavigate();
  const handleReset = () => {
    setSelectList([]);
    setTimeout(() => {
      navigate("/");
    }, 0);
  };

  const getFlowerData = (flowerName, color) => {
    if (color === 5) {
      if (greenFlowersData.flowers && greenFlowersData.flowers[flowerName]) {
        const greenData = greenFlowersData.flowers[flowerName];
        return {
          meaning: [greenData.花言葉],
          bloomTimes: greenData.開花時期,
          image: greenData.image || "/images/questionMark.jpg",
        };
      }
    }
    const foundEntry = Object.entries(allFlowersData.flowers).find(
      ([name, data]) => name === flowerName && data.花色 === String(color)
    );
    if (!foundEntry) return { meaning: [], bloomTimes: [] };
    const [matchedName, matchedData] = foundEntry;
    const allMeanings = Object.values(matchedData.花言葉).flat();
    return {
      meaning: allMeanings,
      bloomTimes: matchedData.開花時期,
      image: matchedData.画像 || "/images/questionMark.jpg",
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
    if (!allFlowersData.flowers || !greenFlowersData.flowers) {
      return;
    }
    const newFlowersList = selectList.map((flower) => {
      const flowerData = getFlowerData(flower.name, flower.color);
      return {
        ...flower,
        bloomTime: getCurrentSeason(flowerData.bloomTimes),
        meaning: flowerData.meaning,
        image: flowerData.image,
      };
    });

    setFlowersList(newFlowersList);
  }, [selectList, greenFlowersData, allFlowersData]);

  // 花束生成につかうListの作成
  const [generateList, setGenerateList] = useState([]);

  // 花色テーマの定義
  const colorThemes = {
    0: { color: "#db9dc759", name: "ピンク系" },
    1: { color: "#FFFFFF", name: "白系" },
    2: { color: "#d7ba9463", name: "黄・オレンジ系" },
    3: { color: "#d194a05e", name: "赤系" },
    4: { color: "#9aa5d655", name: "青・青紫系" },
    5: { color: "#d0f0d655", name: "グリーン系" },
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
        role: flower.color === 5 ? "green" : flowerRoles[index],
        image: flower.image,
      };
    });
    setGenerateList(newGenerateList);
  }, [flowersList, flowerRoles]);

  const getButtonText = (role) => {
    switch (role) {
      case "main":
        return (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <PiFlowerFill size="1rem" /> メインフラワー
          </span>
        );
      case "sub":
        return (
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <PiFlowerLight size="1rem" /> サブフラワー
          </span>
        );
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

  // 削除ボタン
  const deleteFlowerList = (flowers) => {
    setSelectList((prevList) => {
      const findIndex = prevList.findIndex(
        (item) => item.name === flowers.name && item.color === flowers.color
      );
      if (findIndex >= 0) {
        const newList = [...prevList];
        newList.splice(findIndex, 1);
        return newList;
      }
      return prevList;
    });
  };

  console.log("hoveredFlower", hoveredFlower);
  console.log("generateList", generateList);
  // name,color,role
  console.log("flowerRoles", flowerRoles);
  // Object { 0: "none", 1: "main", 2: "none" }

  return (
    <div>
      <header className="cart-header">
        <Link to={`/${location.search}`} className="back-button">
          花束作成支援サイト
        </Link>
        <button className="resetCart-button" onClick={handleReset}>
          {/* カートの中身をリセットする */}
          最初からやり直す
        </button>
      </header>

      <div className="cart-content">
        {/* <div class="cart-page-title">カートページ</div> */}

        <div className="cart-card-scroll">
          <div className="cart-cards-grid">
            {flowersList.map((flowers, index) => (
              <div key={index}>
                <MdCancel
                  size="2rem"
                  className="icon-move-down"
                  onClick={() => deleteFlowerList(flowers)}
                />
                <div
                  // key={index}
                  className="flower-card-cart"
                  style={{ backgroundColor: colorThemes[flowers.color]?.color }}
                >
                  <div className="flower-name-card">{flowers.name}</div>

                  <div>
                    <div className="cart-overview meaning-size">
                      {/* 花言葉:  */}
                      {flowers.meaning.join(",")}
                    </div>

                    {flowers.color === 5 ? (
                      <button className="greenRole">
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <GiThreeLeaves size="1rem" />
                          グリーン
                        </span>
                      </button>
                    ) : (
                      // ここで役割を決める
                      <div
                        className="dropdown-content"
                        // ホバー時
                        onMouseEnter={() => setHoveredFlower(index)}
                        // マウスが離れた時
                        onMouseLeave={() => setHoveredFlower(null)}
                      >
                        <button
                          className={`setting-flower ${
                            flowerRoles[index] === "main"
                              ? "main-flower"
                              : flowerRoles[index] === "sub"
                              ? "sub-flower"
                              : ""
                          }`}
                        >
                          {getButtonText(flowerRoles[index])}
                        </button>
                        {hoveredFlower === index && (
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
                        )}
                      </div>
                    )}
                  </div>

                  <div className="cart-overview">
                    開花時期: {flowers.bloomTime}
                  </div>

                  <div className="flower-image-container">
                    <img
                      src={flowers.image}
                      alt={`${flowers.name} の画像`}
                      className="flower-image"
                    />
                  </div>
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
      <ModalPage
        isOpen={openModal}
        setIsOpen={setOpenModal}
        selectList={selectList}
        setSelectList={setSelectList}
        greenFlowersData={greenFlowersData}
      />
    </div>
  );
};
export default FlowersCart;
