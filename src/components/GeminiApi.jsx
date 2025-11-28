import { useEffect } from "react";

const GeminiApi = ({
  selectedNodes,
  flowerMetadata,
  generatedImage,
  setGeneratedImage,
  error,
  setError,
  loading,
  setLoading,
  prevSelectedNodesRef,
}) => {
  useEffect(() => {
    // flowerListまたはflowerMetadataが空の場合は処理しない
    if (!selectedNodes || selectedNodes.length === 0 || !flowerMetadata) {
      return;
    }

    // selectedNodesが実質的に変わったかチェック
    const nodesChanged =
      !prevSelectedNodesRef.current ||
      prevSelectedNodesRef.current.length !== selectedNodes.length ||
      prevSelectedNodesRef.current.some(
        (prev, idx) => prev.filename !== selectedNodes[idx]?.filename
      );

    if (!nodesChanged) {
      console.log("花の選択は変わっていないので、画像生成をスキップ");
      return;
    }

    prevSelectedNodesRef.current = selectedNodes;

    console.log("新しい花が選択されたので、画像生成を開始");
    setGeneratedImage("");
    setLoading(true);

    const fetchImage = async () => {
      setError("");

      try {
        const flowerPrompts = selectedNodes
          .map((f) => {
            const metadata = flowerMetadata[f.filename];
            if (metadata && metadata.prompt) {
              return metadata.prompt;
            }
            return f.filename;
          })
          .filter(Boolean);

        if (flowerPrompts.length === 0) {
          setError("花のプロンプト情報が見つかりませんでした");
          setLoading(false);
          return;
        }

        const combinedPrompts = flowerPrompts.join(", ");
        const prompt = `Create a hand-tied bouquet (NOT in a vase) consisting of these flowers: ${combinedPrompts}. The bouquet should be wrapped and ready to give as a gift. Show only the flowers and wrapping, no vase or container.`;

        console.log("送信するプロンプト:", prompt);
        console.log("使用する花のプロンプト:", flowerPrompts);

        const response = await fetch("/.netlify/functions/generate-bouquet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
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
  }, [selectedNodes, flowerMetadata]);

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
          <div style={{ padding: "15px", textAlign: "center" }}>
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
