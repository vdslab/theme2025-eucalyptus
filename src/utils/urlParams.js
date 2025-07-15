// URLからselectListを読み取る
export const getSelectListFromURL = () => {
  const urlParams = new URLSearchParams(window.location.search);
  console.log("window.location.search", window.location.search);
  //   console.log("urlParams:", urlParams);
  //   urlParams:
  // URLSearchParams { flowers → "0プリマドンナ アルストロメリア" }
  const flowersParam = urlParams.get("flowers");

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

// selectListをURLに保存する
export const saveSelectListToURL = (selectList) => {
  const urlParams = new URLSearchParams(window.location.search);

  if (selectList.length > 0) {
    const flowersParam = selectList
      .map((flower) => `${flower.color}${flower.name}`)
      .join(",");
    urlParams.set("flowers", flowersParam);
  } else {
    urlParams.delete("flowers");
  }

  const newURL = `${window.location.pathname}?${urlParams.toString()}`;
  window.history.replaceState({}, "", newURL);
  //   reactじゃなくて、ブラウザに向かってURLを書き換えている
  // reactは受け取れない
};
