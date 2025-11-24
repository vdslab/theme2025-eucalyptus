import "../styles/selectedNodesPanel.css";
import { RxCross2 } from "react-icons/rx";

function SelectedNodesPanel({
  selectedNodes,
  onNodeRemove,
  onClearAll,
  isMobile = false,
}) {
  return (
    <aside className={isMobile ? "" : "selected-nodes-panel"}>
      {/* デスクトップ版のみヘッダー表示 */}
      {!isMobile && (
        <div className="panel-header">
          <h3 className="text-sm">選択中の花</h3>
          {selectedNodes.length > 0 && (
            <button onClick={onClearAll} className=" btn">
              すべてクリア
            </button>
          )}
        </div>
      )}

      {/* 花リスト - 共通 */}
      <div className={isMobile ? "flex flex-col gap-2" : "nodes-list"}>
        {selectedNodes.map((node, i) => (
          <div
            key={i}
            className={
              isMobile
                ? "flex items-center gap-3 p-2 bg-white rounded hover:bg-gray-50 transition-colors"
                : "node-item"
            }
          >
            <img
              src={`/images/all_flower/${node.filename}`}
              alt={node.filename}
              className={isMobile ? "w-10 h-10 rounded-full object-cover" : ""}
            />
            <span
              className={isMobile ? "flex-1 text-sm truncate" : "node-name"}
            >
              {node.filename.replace(".jpeg", "")}
            </span>
            <button
              onClick={() => onNodeRemove(node)}
              className={
                isMobile
                  ? "w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 hover:bg-yellow-900 hover:text-white transition-colors"
                  : "remove-btn"
              }
            >
              <RxCross2 />
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default SelectedNodesPanel;
