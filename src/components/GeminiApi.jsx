import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import "../styles/generationPanel.css";

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

    const handleGenerate = async (skipConfirm = false) => {
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
      if (!skipConfirm && isSameSelection && generatedImage) {
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
      <div
        className={
          isMobile ? "space-y-3" : "generation p-4 flex flex-col h-full"
        }
      >
        {/* PC版 */}
        {!isMobile && !generatedImage && !isImageLoading && (
          <div className="flex-1 flex items-center justify-center">
            <button
              onClick={handleGenerate}
              disabled={selectedNodes.length === 0}
              className="btn px-8 py-3 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              花束イメージを生成
            </button>
          </div>
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

        {isImageLoading && (
          <div
            className={
              isMobile
                ? "py-3 text-center space-y-1"
                : "flex-1 flex flex-col items-center justify-center space-y-2"
            }
          >
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 bg-yellow-500"></div>
            </div>
            <p
              className={
                isMobile ? "text-xs font-medium" : "text-sm font-medium"
              }
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

        {generatedImage && !isImageLoading && (
          <div
            className={
              isMobile ? "space-y-3" : "flex flex-col space-y-3 flex-1 min-h-0"
            }
          >
            {/* PC版 */}
            {!isMobile && (
              <>
                {/* ボタンは上部に固定 */}
                <div className="flex flex-shrink-0 justify-between items-center">
                  イメージ図
                  <div className="flex gap-2">
                    <button onClick={handleGenerate} className="btn  py-2">
                      再生成
                    </button>
                    <button
                      onClick={handleDownload}
                      className="btn  py-2 bg-green-600 hover:bg-green-700"
                    >
                      ダウンロード
                    </button>
                  </div>
                </div>

                {/* 画像は中央配置、スクロール可能 */}
                <div className="flex-1 flex items-center justify-center overflow-y-auto">
                  <img
                    src={generatedImage}
                    alt="生成された花束"
                    className="max-w-full max-h-full object-contain rounded-lg shadow-md"
                  />
                </div>
              </>
            )}

            {/* モバイル版 */}
            {isMobile && (
              <div className="p-3 ">
                <div className="flex items-center  justify-end mb-2">
                  <button
                    onClick={handleDownload}
                    className="text-xs text-green-600 hover:text-green-800 underline"
                  >
                    ダウンロード
                  </button>
                </div>
                <img
                  src={generatedImage}
                  alt="生成された花束"
                  className="w-full h-auto rounded shadow-sm"
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

export default GeminiApi;
