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
  isMobile = false,
}) => {
  const handleGenerate = async () => {
    if (!selectedNodes || selectedNodes.length === 0) {
      setError("花を選択してください");
      return;
    }

    if (!flowerMetadata) {
      setError("花のデータを読み込み中です");
      return;
    }

    // 前回と同じ花の組み合わせかチェック
    const isSameSelection =
      prevSelectedNodesRef.current &&
      prevSelectedNodesRef.current.length === selectedNodes.length &&
      prevSelectedNodesRef.current.every(
        (prev, idx) => prev.filename === selectedNodes[idx]?.filename
      );

    // 同じ花で既に画像がある場合は確認
    if (isSameSelection && generatedImage) {
      const shouldRegenerate = window.confirm(
        "同じ花の組み合わせで再生成しますか？\n（新しい画像が生成されます）"
      );
      if (!shouldRegenerate) return;
    }

    // 生成開始
    setGeneratedImage("");
    setLoading(true);
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

      const response = await fetch("/.netlify/functions/generate-bouquet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTPエラー: ${response.status}`);
      }

      const data = await response.json();

      if (data.imageData && data.mimeType) {
        const imageUrl = `data:${data.mimeType};base64,${data.imageData}`;
        setGeneratedImage(imageUrl);

        // 成功したら現在の選択を保存
        prevSelectedNodesRef.current = [...selectedNodes];

        console.log("画像生成成功");
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

  const handleDownload = () => {
    if (!generatedImage) return;

    const flowerNames = selectedNodes
      .map((node) => node.filename.replace(".jpeg", ""))
      .join("_");

    const filename = `${flowerNames}で組み合わせた花束イメージ.png`;

    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={isMobile ? "space-y-3" : "space-y-4"}>
      {/* 選択中の花の数を表示 */}
      {selectedNodes.length > 0 && !loading && !generatedImage && (
        <div
          className={
            isMobile
              ? "text-xs text-gray-600 text-center"
              : "text-sm text-gray-700 text-center"
          }
        >
          {selectedNodes.length}種類の花が選択されています
        </div>
      )}

      {/* 生成ボタン */}
      <button
        onClick={handleGenerate}
        disabled={loading || selectedNodes.length === 0}
        className={
          isMobile
            ? "btn w-full py-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
            : "btn w-full py-3 disabled:bg-gray-300 disabled:cursor-not-allowed"
        }
      >
        {loading ? "生成中..." : "花束イメージを生成"}
      </button>

      {/* エラー表示 */}
      {error && (
        <div
          className={
            isMobile
              ? "text-red-600 text-xs p-2 bg-red-50 border border-red-200 rounded"
              : "text-red-600 text-sm p-3 bg-red-50 border border-red-300 rounded-lg"
          }
        >
          {error}
        </div>
      )}

      {/* ローディング表示 */}
      {loading && (
        <div
          className={
            isMobile
              ? "py-3 text-center space-y-1"
              : "py-4 text-center space-y-2"
          }
        >
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
          <p
            className={isMobile ? "text-xs font-medium" : "text-sm font-medium"}
          >
            花束画像を生成中...
          </p>
          <p
            className={
              isMobile ? "text-xs text-gray-500" : "text-sm text-gray-600"
            }
          >
            数秒かかる場合があります
          </p>
        </div>
      )}

      {/* 生成された画像 */}
      {generatedImage && (
        <div
          className={
            isMobile
              ? "p-3 border border-gray-200 rounded-lg bg-gray-50"
              : "p-4 border border-gray-300 rounded-lg bg-gray-50 shadow-sm"
          }
        >
          <div className="flex items-center justify-between mb-2">
            <h3
              className={
                isMobile
                  ? "text-xs font-medium text-gray-800"
                  : "text-sm font-medium text-gray-900"
              }
            >
              生成された花束
            </h3>
            <button
              onClick={handleDownload}
              className={
                isMobile
                  ? "text-xs text-blue-600 hover:text-blue-800 underline"
                  : "text-sm text-blue-600 hover:text-blue-800 underline transition-colors"
              }
            >
              ダウンロード
            </button>
          </div>
          <img
            src={generatedImage}
            alt="生成された花束"
            className={
              isMobile
                ? "w-full h-auto rounded shadow-sm"
                : "w-full h-auto rounded-lg shadow-md"
            }
          />
          {/* 再生成ボタン */}
          {!loading && (
            <button
              onClick={handleGenerate}
              className={
                isMobile ? "btn w-full mt-2 py-2" : "btn w-full mt-3 py-2"
              }
            >
              再生成
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default GeminiApi;
