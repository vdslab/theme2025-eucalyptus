exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    const { flowerList } = JSON.parse(event.body);

    console.log("Received flowers:", flowerList);

    // まずはテスト用のレスポンスを返す
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "Function is working!",
        receivedFlowers: flowerList,
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
