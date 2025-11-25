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

    const apiKey = process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("VITE_GEMINI_API_KEY が設定されていません");
    }

    // gemini-flash-latest
    const modelName = "gemini-flash-latest";
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
    const generatedText = data.candidates[0].content.parts[0].text;

    console.log("生成されたテキスト:", generatedText);
    console.log("使用トークン数:", data.usageMetadata);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        text: generatedText,
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
