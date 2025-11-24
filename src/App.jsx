import "./App.css";
import Header from "./components/Header";
import ColorViz from "./components/ColorViz";
import ExpandableDetail from "./components/ExpandableDetail";
import SelectedNodesPanel from "./components/SelectedNodesPanel";
import GenerationPanel from "./components/GenerationPanel";
import ColorSearch from "./components/ColorSearch";
import { useState, useEffect } from "react";

function App() {
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  // 色検索パネル
  const [isColorSearchOpen, setIsColorSearchOpen] = useState(false);
  const [colorMatchedNodes, setColorMatchedNodes] = useState([]);

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

  const handleClearSearch = () => {
    setColorMatchedNodes([]); // 検索結果をクリア
  };

  const handleClearAll = () => {
    setSelectedNodes([]);
  };
  console.log("selectedNodes:", selectedNodes);
  console.log("selectData", selectedData);

  return (
    <div className="container">
      <Header onColorSearchClick={() => setIsColorSearchOpen(true)} />
      {isColorSearchOpen && (
        <ColorSearch
          onClose={() => setIsColorSearchOpen(false)}
          onColorSelect={handleColorSearch}
          onClearSearch={handleClearSearch}
        />
      )}
      <main className="main-content">
        <ColorViz
          onNodeClick={setSelectedData}
          onNodesSelect={setSelectedNodes}
          hasSidebar={selectedNodes.length > 0}
          selectedNodes={selectedNodes}
          colorMatchedNodes={colorMatchedNodes}
        />

        {selectedNodes.length > 0 && (
          <div className="sidebar-panels">
            <SelectedNodesPanel
              selectedNodes={selectedNodes}
              onNodeRemove={handleNodeRemove}
              onClearAll={handleClearAll}
            />
            <GenerationPanel flowerList={selectedNodes} />
          </div>
        )}

        {selectedData && (
          <ExpandableDetail
            data={selectedData}
            onClose={() => setSelectedData(null)}
          />
        )}
      </main>
    </div>
  );
}

export default App;
