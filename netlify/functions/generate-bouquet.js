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
    const { prompt } = JSON.parse(event.body);
    console.log("受信したプロンプト:", prompt);

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY が設定されていません");
    }

    // gemini-2.5-flash-image
    const modelName = "gemini-2.5-flash-image";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    console.log(`使用するモデル: ${modelName}`);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    console.log("レスポンスステータス:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("APIエラーレスポンス:", errorText);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("APIレスポンス構造:", JSON.stringify(data, null, 2));

    // 画像データを取得
    const parts = data.candidates[0].content.parts;

    // inlineDataから画像を取得
    const imagePart = parts.find((part) => part.inlineData);

    if (!imagePart || !imagePart.inlineData) {
      throw new Error("画像データが見つかりませんでした");
    }

    const imageData = imagePart.inlineData.data;
    const mimeType = imagePart.inlineData.mimeType;

    console.log("使用トークン数:", data.usageMetadata);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        imageData: imageData,
        mimeType: mimeType,
        usage: data.usageMetadata, // トークン使用量
      }),
    };
  } catch (error) {
    console.error("詳細なエラー:", {
      message: error.message,
      stack: error.stack,
    });

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message,
        details: error.toString(),
      }),
    };
  }
};
