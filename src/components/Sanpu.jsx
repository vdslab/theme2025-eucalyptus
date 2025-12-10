import * as d3 from "d3";
import { useRef, useEffect, useState } from "react";

const margin = { top: 5, right: 5, bottom: 5, left: 5 };

const Sanpu = ({
  height,
  width,
  onNodeClick,
  onNodesSelect,
  selectedNodes,
  colorMatchedNodes,
  eventMatchedNodes,
  nameMatchedNode,
}) => {
  const [bunsanData, setBunsanData] = useState([]);
  const size = width * 0.03 + height * 0.03;
  const [simulateData, setSimulateData] = useState([]);

  const svgRef = useRef();
  const zoomRef = useRef();
  const [k, setK] = useState(1);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/data/umap2_flower.json");
        const data = await res.json();
        console.log(data);
        setBunsanData(data);
      } catch (error) {
        console.error("データの読み込みエラー:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    //zoom
    zoomRef.current = d3
      .zoom()
      .translateExtent([
        [-width / 2, -height / 2],
        [width * 1.5, height * 1.5],
      ])
      .on("zoom", (event) => {
        const { x, y, k } = event.transform;
        setK(k);
        setX(x);
        setY(y);
      });
    d3.select(svgRef.current).call(zoomRef.current);
  }, []);

  // データが空の場合のデフォルト値を設定
  const xScale = d3
    .scaleLinear()
    .domain([d3.min(bunsanData, (d) => d.x), d3.max(bunsanData, (d) => d.x)])
    .range([margin.left, width - margin.right])
    .nice();

  const yScale = d3
    .scaleLinear()
    .domain([d3.min(bunsanData, (d) => d.y), d3.max(bunsanData, (d) => d.y)])
    .range([margin.top, height - margin.bottom])
    .nice();

  useEffect(() => {
    if (bunsanData.length === 0) return;

    const node = bunsanData.map((d) => ({ ...d }));
    const simulation = d3
      .forceSimulation(node)
      .force(
        "x",
        d3.forceX((d) => xScale(d.x))
      )
      .force(
        "y",
        d3.forceY((d) => yScale(d.y))
      )
      .force("collide", d3.forceCollide(size / 2))
      .stop();

    simulation.tick(500);
    node.forEach((d) => {
      d.x = Math.max(
        margin.right + size / 2,
        Math.min(width - margin.left - size / 2, d.x)
      );
      d.y = Math.max(
        margin.bottom + size / 2,
        Math.min(height - margin.top - size / 2, d.y)
      );
    });

    setSimulateData(node);
  }, [bunsanData, width, height]);

  const zoomToNode = (node) => {
    if (!zoomRef.current) return;

    const zoomSvg = d3.select(svgRef.current);

    const scale = 2;
    const translateX = width / 2 - node.x * scale;
    const translateY = height / 2 - node.y * scale;

    zoomSvg
      .transition()
      .duration(750)
      .call(
        zoomRef.current.transform,
        d3.zoomIdentity.translate(translateX, translateY).scale(scale)
      );
  };

  return (
    <svg ref={svgRef} width={width} height={height}>
      <g transform={`translate(${x},${y})scale(${k})`}>
        {simulateData.map((d, i) => {
          const isSelected = selectedNodes.some(
            (node) => node.filename === d.filename
          );

          const colorMatch = colorMatchedNodes.find(
            (node) => node.filename === d.filename
          );

          const eventMatch = eventMatchedNodes.find(
            (node) => node.filename === d.filename
          );

          const nameMatch = nameMatchedNode.find(
            (node) => node.filename === d.filename
          );

          const isDimmed =
            colorMatchedNodes.length > 0 &&
            eventMatchedNodes.length > 0 &&
            nameMatchedNode.length > 0
              ? !colorMatch || !eventMatch || !nameMatch // 両方設定
              : colorMatchedNodes.length > 0
              ? !colorMatch // 色のみ設定
              : eventMatchedNodes.length > 0
              ? !eventMatch // イベントのみ設定
              : nameMatchedNode.length > 0
              ? !nameMatch
              : false;

          return (
            <g key={i}>
              {colorMatchedNodes.length > 0 &&
                colorMatch &&
                (eventMatchedNodes.length === 0 || eventMatch) && (
                  <circle
                    cx={d.x}
                    cy={d.y}
                    r={size / 2 + 5}
                    fill="none"
                    stroke={colorMatch.hex}
                    strokeWidth="4"
                  />
                )}
              {isSelected && (
                <circle
                  cx={d.x}
                  cy={d.y}
                  r={size / 2 + 3}
                  fill="none"
                  // stroke="#00ffc3ff"
                  stroke="#FFB53E"
                  strokeWidth="4"
                />
              )}
              <image
                href={`/images/all_flower/${d.filename}`}
                x={d.x - size / 2}
                y={d.y - size / 2}
                height={size}
                width={size}
                preserveAspectRatio="xMidYMid slice"
                style={{
                  cursor: "pointer",
                  clipPath: "circle(50%)",
                  opacity: isDimmed ? 0.2 : 1,
                }}
                onClick={() => {
                  console.log(d.filename);
                  onNodeClick(d);
                  const isSelected = selectedNodes.some(
                    (node) => node.filename === d.filename
                  );
                  if (isSelected) {
                    onNodesSelect(
                      selectedNodes.filter(
                        (node) => node.filename !== d.filename
                      )
                    );
                  } else {
                    onNodesSelect([...selectedNodes, d]);
                  }

                  zoomToNode(d);
                }}
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
};

export default Sanpu;
