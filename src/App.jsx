import "./App.css";
import Header from "./components/Header";
import ColorViz from "./components/ColorViz";
import ExpandableDetail from "./components/ExpandableDetail";
import SelectedNodesPanel from "./components/SelectedNodesPanel";
import GeminiApi from "./components/GeminiApi";
import { useState, useEffect, useRef } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

function App() {
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  // 色検索パネル
  const [colorMatchedNodes, setColorMatchedNodes] = useState([]);

  // イベント検索
  const [eventMatchedNodes, setEventMatchedNodes] = useState([]);

  // モバイル版は画像生成の箇所を開閉する
  const [isGenerationOpen, setIsGenerationOpen] = useState(false);
  const [sheetHeight, setSheetHeight] = useState(30); // 初期値50vh
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);

  // 画像生成
  const [generatedImage, setGeneratedImage] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(false);
  const prevSelectedNodesRef = useRef();

  //ワード検索
  const [nameMatchedNode, setNameMatchedNode] = useState([]);

  // モバイルパネル
  const geminiApiMobileRef = useRef();
  const geminiApiDesktopRef = useRef();
  const prevIsGenerationOpenRef = useRef(false);

  // モバイル版の画面制御
  const handleDragStart = (e) => {
    setIsDragging(true);
    setStartY(e.touches ? e.touches[0].clientY : e.clientY);
  };
  // ドラッグ中
  const handleDragMove = (e) => {
    if (!isDragging) return;

    const currentY = e.touches ? e.touches[0].clientY : e.clientY;
    const deltaY = startY - currentY; // 上にスワイプで正の値
    const windowHeight = window.innerHeight;
    // 高さ20〜80vhの範囲
    const newHeight = Math.min(
      80,
      Math.max(20, sheetHeight + (deltaY / windowHeight) * 100)
    );
    setSheetHeight(newHeight);
    setStartY(currentY);
  };
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // meta.json読み込み
  const [flowerMetadata, setFlowerMetadata] = useState(null);
  useEffect(() => {
    const fetchMetadata = async () => {
      const res = await fetch("/data/flower_metadata.json");
      const data = await res.json();
      setFlowerMetadata(data);
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    if (isGenerationOpen && !prevIsGenerationOpenRef.current) {
      const timer = setTimeout(() => {
        if (
          !generatedImage &&
          selectedNodes.length > 0 &&
          !isImageLoading &&
          geminiApiMobileRef.current
        ) {
          geminiApiMobileRef.current.handleGenerate();
        }
      }, 150);

      prevIsGenerationOpenRef.current = isGenerationOpen;
      return () => clearTimeout(timer);
    }
    prevIsGenerationOpenRef.current = isGenerationOpen;
  }, [isGenerationOpen, generatedImage, selectedNodes.length, isImageLoading]);

  // パネルが開いている状態で花の選択が変わったら自動生成
  useEffect(() => {
    if (isGenerationOpen && selectedNodes.length > 0 && !isImageLoading) {
      const timer = setTimeout(() => {
        if (geminiApiMobileRef.current) {
          geminiApiMobileRef.current.handleGenerate();
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [selectedNodes, isGenerationOpen, isImageLoading]);

  // 再生成ハンドラー
  const handleRegenerate = () => {
    if (geminiApiMobileRef.current) {
      geminiApiMobileRef.current.handleGenerate();
    }
  };

  const handleNodeRemove = (nodeToRemove) => {
    setSelectedNodes((prev) =>
      prev.filter((node) => node.filename !== nodeToRemove.filename)
    );
  };

  const handleColorSearch = (colorName) => {
    if (!flowerMetadata) return;

    const matches = Object.entries(flowerMetadata)
      .filter(
        ([filename, data]) =>
          data.colors_ja && data.colors_ja.includes(colorName)
      )
      .map(([filename, data]) => ({
        filename: filename,
        hex: data.main_color.hex,
      }));

    setColorMatchedNodes(matches);
    console.log(`${colorName}で${matches.length}件見つかりました`);
  };

  const handleEventSearch = (eventName) => {
    if (!flowerMetadata) return;

    const matches = Object.entries(flowerMetadata)
      .filter(
        ([filename, data]) => data.events && data.events.includes(eventName)
      )
      .map(([filename, data]) => ({
        filename: filename,
      }));

    setEventMatchedNodes(matches);
    console.log(`${eventName}で${matches.length}件見つかりました`);
  };

  const handleWordSearch = (flowerName) => {
    if (!flowerMetadata) return;

    const matches = Object.entries(flowerMetadata)
      .filter(
        ([filename, data]) =>
          data.family_ja && data.family_ja.includes(flowerName)
      )
      .map(([filename, data]) => ({
        filename: filename,
      }));

    setNameMatchedNode(matches);
  };

  const handleClearSearch = () => {
    setColorMatchedNodes([]); // 検索結果をクリア
  };

  const handleClearEventSearch = () => {
    setEventMatchedNodes([]);
  };

  const handleClearAll = () => {
    setSelectedNodes([]);
  };
  console.log("selectedNodes:", selectedNodes);
  console.log("selectData", selectedData);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header
        onColorSelect={handleColorSearch}
        onClearSearch={handleClearSearch}
        // イベント検索
        onEventSelect={handleEventSearch}
        onClearEventSearch={handleClearEventSearch}
        flowerMetadata={flowerMetadata}
        onNameSearch={handleWordSearch}
      />
      <main className="flex-1 flex relative overflow-hidden">
        <ColorViz
          onNodeClick={setSelectedData}
          onNodesSelect={setSelectedNodes}
          hasSidebar={selectedNodes.length > 0}
          selectedNodes={selectedNodes}
          colorMatchedNodes={colorMatchedNodes}
          eventMatchedNodes={eventMatchedNodes}
          nameMatchedNode={nameMatchedNode}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm py-2 text-center text-xs text-gray-600 z-10">
          Photo by{" "}
          <a
            href="https://photosuta.hanasuta.jp/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-900"
          >
            ハナスタ
          </a>
        </div>

        {selectedNodes.length > 0 && (
          // <div className="hidden md:block">
          <div className="hidden md:flex md:absolute md:right-0 md:flex-col md:gap-4 md:h-full md:pr-6 md:w-80">
            <SelectedNodesPanel
              selectedNodes={selectedNodes}
              onNodeRemove={handleNodeRemove}
              onClearAll={handleClearAll}
            />
            <GeminiApi
              ref={geminiApiDesktopRef}
              selectedNodes={selectedNodes}
              flowerMetadata={flowerMetadata}
              generatedImage={generatedImage}
              setGeneratedImage={setGeneratedImage}
              isImageLoading={isImageLoading}
              setIsImageLoading={setIsImageLoading}
              prevSelectedNodesRef={prevSelectedNodesRef}
              isMobile={false}
            />
          </div>
          // </div>
        )}

        {selectedData && (
          <>
            <div className="hidden md:block">
              <ExpandableDetail
                data={selectedData}
                onClose={() => setSelectedData(null)}
                isMobile={false}
                flowerMetadata={flowerMetadata}
              />
            </div>
            <div className="md:hidden fixed bottom-20 left-0 right-0 top-20 z-20 px-4 pointer-events-none">
              <div className="pointer-events-auto">
                <ExpandableDetail
                  data={selectedData}
                  onClose={() => setSelectedData(null)}
                  isMobile={true}
                  flowerMetadata={flowerMetadata}
                />
              </div>
            </div>
          </>
        )}
      </main>

      {selectedNodes.length > 0 && (
        <div
          className="md:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg z-40  flex flex-col transition-all"
          style={{
            height: `${sheetHeight}vh`,
            maxHeight: "80vh",
            minHeight: "20vh",
          }}
        >
          {/* ヘッダーを触った際に、高さを変えられる */}
          <div
            className="flex-shrink-0 cursor-grab active:cursor-grabbing select-none"
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
          >
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto my-3" />

            {/* ヘッダー */}
            <div className="px-4 py-2 border-b flex items-center justify-between">
              <p className="text-sm font-medium">
                選択中: {selectedNodes.length}個
              </p>
              <button
                onClick={handleClearAll}
                className="btn"
                onTouchStart={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              >
                すべてクリア
              </button>
            </div>
          </div>

          {/* 選択中の花リスト */}
          <div className="flex-1 overflow-y-auto px-4">
            <SelectedNodesPanel
              selectedNodes={selectedNodes}
              onNodeRemove={handleNodeRemove}
              onClearAll={handleClearAll}
              isMobile={true}
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              Photo by{" "}
              <a
                href="https://photosuta.hanasuta.jp/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-900"
              >
                ハナスタ
              </a>
            </p>
          </div>

          <div className="border-t bg-white flex-shrink-0">
            <div className="w-full px-4 py-3 flex items-center justify-between">
              <button
                onClick={() => setIsGenerationOpen(!isGenerationOpen)}
                className="flex items-center gap-2 text-left font-medium flex-1"
                onTouchStart={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <span className="text-sm">花束イメージを生成</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRegenerate();
                  }}
                  className="btn disabled:bg-gray-400"
                  disabled={isImageLoading || !isGenerationOpen}
                  onTouchStart={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {isImageLoading
                    ? "生成中..."
                    : generatedImage
                    ? "再生成"
                    : "作成"}
                </button>

                <button
                  onClick={() => setIsGenerationOpen(!isGenerationOpen)}
                  className="text-xl flex items-center"
                >
                  {isGenerationOpen ? <IoIosArrowDown /> : <IoIosArrowUp />}
                </button>
              </div>
            </div>

            {/* 画像生成 */}
            {isGenerationOpen && (
              <div className="px-4 pb-4 border-t max-h-96 overflow-y-auto">
                <GeminiApi
                  ref={geminiApiMobileRef}
                  selectedNodes={selectedNodes}
                  flowerMetadata={flowerMetadata}
                  generatedImage={generatedImage}
                  setGeneratedImage={setGeneratedImage}
                  isImageLoading={isImageLoading}
                  setIsImageLoading={setIsImageLoading}
                  prevSelectedNodesRef={prevSelectedNodesRef}
                  isMobile={true}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
