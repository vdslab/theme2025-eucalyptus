import { useEffect, useRef, useState } from "react";
import "../styles/colorViz.css";
import Sanpu from "./Sanpu";

const ColorViz = ({
  onNodeClick,
  onNodesSelect,
  hasSidebar,
  selectedNodes,
  colorMatchedNodes,
  eventMatchedNodes,
  nameMatchedNode,
}) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  //リサイズ
  useEffect(() => {
    const reSizeWindow = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", reSizeWindow);

    return () => window.removeEventListener("resize", reSizeWindow);
  }, []);

  return (
    <section className="section">
      <Sanpu
        width={windowSize.width}
        height={windowSize.height}
        onNodeClick={onNodeClick}
        onNodesSelect={onNodesSelect}
        selectedNodes={selectedNodes}
        colorMatchedNodes={colorMatchedNodes}
        eventMatchedNodes={eventMatchedNodes}
        nameMatchedNode={nameMatchedNode}
      />
    </section>
  );
};

export default ColorViz;
