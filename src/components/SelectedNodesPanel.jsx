import "../styles/selectedNodesPanel.css";
import { RxCross2 } from "react-icons/rx";

function SelectedNodesPanel({ selectedNodes, onNodeRemove, onClearAll }) {
  return (
    <aside className="selected-nodes-panel">
      <div className="panel-header">
        <h3>選択中の花</h3>
        {selectedNodes.length > 0 && (
          <button onClick={onClearAll} className="clear-btn">
            すべてクリア
          </button>
        )}
      </div>

      <div className="nodes-list">
        {selectedNodes.map((node, i) => (
          <div key={i} className="node-item">
            <img
              src={`/images/all_flower/${node.filename}`}
              alt={node.filename}
            />
            <span className="node-name">
              {node.filename.replace(".jpeg", " ")}
            </span>
            <button onClick={() => onNodeRemove(node)} className="remove-btn">
              <RxCross2 />
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default SelectedNodesPanel;
