import { useEffect, useState } from "react";
import { MdCancel } from "react-icons/md";
import "../styles/flowersMain.css";
import { Link, useLocation } from "react-router-dom";

const FlowersMain = ({
  allFlowersData,
  selectList,
  setSelectList,
  greenFlowersData,
}) => {
  const [flowersImage, setFlowersImage] = useState([]);
  const location = useLocation();

  const getFlowerData = (flowerName, color) => {
    if (color === 5) {
      if (greenFlowersData?.flowers?.[flowerName]) {
        const greenData = greenFlowersData.flowers[flowerName];
        return {
          image: greenData.image || "/images/questionMark.jpg",
        };
      }
    }
    const foundEntry =
      Object.entries(allFlowersData.flowers).find(
        ([name, data]) => name === flowerName && data.花色 === String(color)
      ) || [];

    const [matchedName, matchedData] = foundEntry;
    return { image: matchedData.画像 || "/images/questionMark.jpg" };
  };

  useEffect(() => {
    if (!allFlowersData.flowers || !greenFlowersData.flowers) {
      return;
    }
    const newFlowersList = selectList.map((flower) => {
      const flowerData = getFlowerData(flower.name, flower.color);
      return {
        name: flower.name,
        color: flower.color,
        image: flowerData.image,
      };
    });

    setFlowersImage(newFlowersList);
  }, [selectList, greenFlowersData, allFlowersData]);

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
  return (
    <div className="flowersMain">
      {/* <Link to={`/cart${location.search}`} className="main-cart-button">
        花束作成に進む
      </Link> */}
      {flowersImage.map((flowers, index) => (
        <div key={index} className="flowersMain-content">
          <MdCancel
            size="1.5rem"
            className="icon-flowers-cancel"
            title="削除する"
            onClick={() => deleteFlowerList(flowers)}
          />
          <div className="flowersMain-image-content">
            <img
              src={flowers.image}
              title={flowers.name}
              alt={`${flowers.name} の画像`}
              className="flower-image"
              loading="lazy"
            />
          </div>
        </div>
      ))}
    </div>
  );
};
export default FlowersMain;
