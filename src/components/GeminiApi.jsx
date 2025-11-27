import { useEffect, useState } from "react";

const GeminiApi = ({ flowerList, flowerMetadata }) => {
  const [generatedImage, setGeneratedImage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // flowerListまたはflowerMetadataが空の場合は処理しない
    if (!flowerList || flowerList.length === 0 || !flowerMetadata) return;

    setGeneratedImage("");
    setLoading(true);

    const fetchImage = async () => {
      setError("");

      try {
        // 各花のpromptを取得して組み合わせる
        const flowerPrompts = flowerList
          .map((f) => {
            const metadata = flowerMetadata[f.filename];
            if (metadata && metadata.prompt) {
              return metadata.prompt;
            }
            // promptがない場合はfilenameをフォールバック
            return f.filename;
          })
          .filter(Boolean); // 空の値を除外

        if (flowerPrompts.length === 0) {
          setError("花のプロンプト情報が見つかりませんでした");
          setLoading(false);
          return;
        }

        // 花のプロンプトを組み合わせて画像生成用のプロンプトを作成
        const combinedPrompts = flowerPrompts.join(", ");
        const prompt = `Please ${combinedPrompts} to create a bouquet.`;

        console.log("送信するプロンプト:", prompt);
        console.log("使用する花のプロンプト:", flowerPrompts);

        // Netlify Functionを呼び出す
        const response = await fetch("/.netlify/functions/generate-bouquet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: prompt,
          }),
        });

        console.log("ステータスコード:", response.status);

        if (!response.ok) {
          throw new Error(`HTTPエラー: ${response.status}`);
        }

        const data = await response.json();
        console.log("受信したデータ:", data);

        // 画像データを処理
        if (data.imageData && data.mimeType) {
          // base64データをdata URLに変換
          const imageUrl = `data:${data.mimeType};base64,${data.imageData}`;
          setGeneratedImage(imageUrl);
          console.log("画像生成成功");

          // 使用トークン数をログ出力
          if (data.usage) {
            console.log("使用トークン数:", data.usage);
          }
        } else if (data.error) {
          setError(data.error);
        } else {
          setError("画像の生成に失敗しました");
        }
      } catch (error) {
        setError("エラーが発生しました: " + error.message);
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [flowerList, flowerMetadata]);

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

        {loading && (
          <div
            style={{
              padding: "15px",
              textAlign: "center",
            }}
          >
            <p>花束画像を生成中...</p>
            <p style={{ fontSize: "0.9em", color: "#666" }}>
              数秒かかる場合があります
            </p>
          </div>
        )}

        {generatedImage && (
          <div
            style={{
              padding: "15px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h3>生成された花束:</h3>
            <img
              src={generatedImage}
              alt="生成された花束"
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GeminiApi;
