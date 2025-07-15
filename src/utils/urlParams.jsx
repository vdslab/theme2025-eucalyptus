import { useSearchParams } from "react-router-dom";

export const useUrlParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const getSelectListFromURL = () => {
    const flowersParam = searchParams.get("flowers");
    console.log("flowersParam", flowersParam);

    if (!flowersParam) {
      return [];
    }
    try {
      const flowers = flowersParam.split(",").map((item) => {
        const color = parseInt(item.charAt(0));
        const name = item.slice(1);
        return { name, color };
      });
      return flowers;
    } catch (error) {
      console.error("URLパラメータの解析エラー:", error);
      return [];
    }
  };

  const saveSelectListToURL = (selectList) => {
    const newSearchParams = new URLSearchParams(searchParams);
    // console.log("newSearchParams", newSearchParams);
    // URLSearchParams { flowers → "0ジェラート スプレーバラ,0アリシア スプレーバラ,0アライアンス 大輪ガーベラ" }
    if (selectList.length > 0) {
      const flowersParam = selectList
        .map((flower) => `${flower.color}${flower.name}`)
        .join(",");
      // 既存のパラメータに追加するために
      newSearchParams.set("flowers", flowersParam);
      //   console.log("flowersParam", flowersParam);
      // flowersParam 0ジェラート スプレーバラ,0アリシア
    } else {
      newSearchParams.delete("flowers");
    }
    setSearchParams(newSearchParams);
    console.log("newSearchParams", newSearchParams);
    // newSearchParams
    // URLSearchParams { flowers → "0ジェラート スプレーバラ,0アリシア " }
  };
  return {
    getSelectListFromURL,
    saveSelectListToURL,
    searchParams,
  };
};
