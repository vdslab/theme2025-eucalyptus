import { useState, useEffect, forwardRef, useImperativeHandle } from "react";

const GeminiApi = forwardRef(
  (
    {
      selectedNodes,
      flowerMetadata,
      generatedImage,
      setGeneratedImage,
      isImageLoading,
      setIsImageLoading,
      prevSelectedNodesRef,
      isMobile = false,
    },
    ref
  ) => {
    const [error, setError] = useState("");

    useEffect(() => {
      // 前回の選択と実際に内容が変わった場合のみクリア
      const currentFilenames = selectedNodes
        .map((n) => n.filename)
        .sort()
        .join(",");
      const prevFilenames = prevSelectedNodesRef.current
        ? prevSelectedNodesRef.current
            .map((n) => n.filename)
            .sort()
            .join(",")
        : "";

      if (currentFilenames !== prevFilenames) {
        setGeneratedImage("");
        setError("");
      }
    }, [selectedNodes]);

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
      setIsImageLoading(true);
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
          setIsImageLoading(false);
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
        setIsImageLoading(false);
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

    useImperativeHandle(ref, () => ({
      handleGenerate,
    }));

    return (
      <div className={isMobile ? "space-y-3" : "space-y-4"}>
        {/* todo:PC版の画像生成もろもろ要修正 */}
        {!isMobile &&
          selectedNodes.length > 0 &&
          !isImageLoading &&
          !generatedImage && (
            <div className="text-sm text-gray-700 text-center">
              {selectedNodes.length}種類の花が選択されています
            </div>
          )}

        {/* PC版のみ：生成ボタン */}
        {!isMobile && (
          <button
            onClick={handleGenerate}
            disabled={isImageLoading || selectedNodes.length === 0}
            className="btn w-full py-3 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isImageLoading ? "生成中..." : "花束イメージを生成"}
          </button>
        )}

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

        {/* PC版のみ：ローディング表示 */}
        {!isMobile && isImageLoading && (
          <div className="py-4 text-center space-y-2">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 bg-yellow-500"></div>
            </div>
            <p className="text-sm font-medium">花束画像を生成中...</p>
            <p className="text-sm text-gray-600">数秒かかる場合があります</p>
          </div>
        )}

        {/* モバイル版：ローディング表示 */}
        {isMobile && isImageLoading && (
          <div className="py-3 text-center space-y-1">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 bg-yellow-500"></div>
            </div>
            <p className="text-xs font-medium">花束画像を生成中...</p>
            <p className="text-xs text-gray-500">数秒かかる場合があります</p>
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
                    ? "text-xs font-medium text-green-800"
                    : "text-sm font-medium text-green-900"
                }
              >
                生成された花束
              </h3>
              <button
                onClick={handleDownload}
                className={
                  isMobile
                    ? "text-xs text-green-600 hover:text-green-800 underline"
                    : "text-sm text-green-600 hover:text-green-800 underline transition-colors"
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
            {/* PC版のみ：再生成ボタン */}
            {!isMobile && !isImageLoading && (
              <button onClick={handleGenerate} className="btn w-full mt-3 py-2">
                再生成
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
);

export default GeminiApi;
