import { useEffect, useState } from "react";

const GeminiApi = ({ flowerList }) => {
  const [generatedText, setGeneratedText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // flowerListが空の場合は処理しない
    if (!flowerList || flowerList.length === 0) return;

    setGeneratedText("");

    const fetchText = async () => {
      setError("");

      try {
        const prompt = flowerList.map((f) => f.filename).join(", ");
        console.log("送信するプロンプト:", prompt);

        // Netlify Functionを呼び出す
        const response = await fetch("/.netlify/functions/generate-bouquet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: `次の花について簡単に説明してください: ${prompt}`,
          }),
        });

        console.log("ステータスコード:", response.status);

        if (!response.ok) {
          throw new Error(`HTTPエラー: ${response.status}`);
        }

        const data = await response.json();
        console.log("受信したデータ:", data);

        // テキストデータを処理
        if (data.text) {
          setGeneratedText(data.text);
          console.log("生成されたテキスト:", data.text);
        } else if (data.error) {
          setError(data.error);
        } else {
          setError("テキストの生成に失敗しました");
        }
      } catch (error) {
        setError("エラーが発生しました: " + error.message);
        console.error("Fetch error:", error);
      }
    };

    fetchText();
  }, [flowerList]);

  return (
    <div>
      <div style={{ maxWidth: "500px" }}>
        {error && (
          <div
            style={{
              color: "red",
              marginBottom: "20px",
              padding: "10px",
              backgroundColor: "#ffe6e6",
              border: "1px solid #ff9999",
              borderRadius: "4px",
            }}
          >
            {error}
          </div>
        )}
        {generatedText ? (
          <div
            style={{
              padding: "15px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h3>生成されたテキスト:</h3>
            <p>{generatedText}</p>
          </div>
        ) : (
          <p>テキスト生成中...</p>
        )}
      </div>
    </div>
  );
};

export default GeminiApi;
