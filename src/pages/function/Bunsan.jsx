import * as d3 from "d3";
import { useRef, useEffect, useState } from "react";
import { TbChevronsDownLeft } from "react-icons/tb";

// const width = 600;
// const height = 400;
const margin = { top: 20, right: 20, bottom: 40, left: 40 };

const Bunsan = ({ height, width }) => {
  const [bunsanData, setBunsanData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/data/umap1_flower.json");
        const data = await res.json();
        console.log(data);
        setBunsanData(data);
      } catch (error) {
        console.error("データの読み込みエラー:", error);
      }
    };
    fetchData();
  }, []);

  // データが空の場合のデフォルト値を設定
  const xScale = d3
    .scaleLinear()
    .domain(
      bunsanData.length > 0
        ? [d3.min(bunsanData, (d) => d.x), d3.max(bunsanData, (d) => d.x)]
        : [0, 1]
    )
    .range([margin.left, width - margin.right])
    .nice();

  const yScale = d3
    .scaleLinear()
    .domain(
      bunsanData.length > 0
        ? [d3.min(bunsanData, (d) => d.y), d3.max(bunsanData, (d) => d.y)]
        : [0, 1]
    )
    .range([height - margin.bottom, margin.top])
    .nice();

  // Create refs for axes
  const xAxisRef = useRef(null);
  const yAxisRef = useRef(null);

  // Set up x-axis and y-axis with useEffect to handle D3 rendering
  useEffect(() => {
    if (xAxisRef.current && bunsanData.length > 0) {
      const xAxis = d3.axisBottom(xScale);
      d3.select(xAxisRef.current).call(xAxis);
    }

    if (yAxisRef.current && bunsanData.length > 0) {
      const yAxis = d3.axisLeft(yScale);
      d3.select(yAxisRef.current).call(yAxis);
    }
  }, [xScale, yScale, bunsanData]);

  return (
    <svg width={width} height={height}>
      {bunsanData.map((d, i) => (
        <image
          key={i}
          href={`/images/all_flower/${d.filename}`}
          x={xScale(d.x)}
          y={yScale(d.y)}
          height={20}
          width={20}
          preserveAspectRatio="xMidYMid slice"
          style={{
            cursor: "pointer",
            clipPath: "circle(50%)",
          }}
          onClick={() => {
            console.log(d.filename);
          }}
        />
      ))}
    </svg>
  );
};

export default Bunsan;
