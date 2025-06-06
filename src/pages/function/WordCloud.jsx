import React from "react";
import * as d3 from "d3";
import { useRef, useEffect } from "react";
import * as d3Cloud from "d3-cloud";

const WordCloud = ({ width, height, data, fontFamily }) => {
  const ref = useRef();

  // 単一の色を使用
  const mainColor = "#4A90E2"; // 青系の色

  useEffect(() => {
    if (data && data.length > 0) {
      const svg = d3.select(ref.current);
      const g = svg.select("g");
      g.selectAll("text").remove();

      const draw = (words) => {
        g.selectAll("text")
          .data(words)
          .enter()
          .append("text")
          .style("font-size", (d) => `${d.size}px`)
          .style("font-family", fontFamily)
          // .style("fill", (d) => {
          //   const opacity = 0.5 + (d.value / 100) * 0.5;
          //   return d3.color(mainColor).copy({ opacity });
          // })
          .style("fill", (d) => {
            return d3.color(mainColor).copy({ opacity: 0.8 });
          })
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "central")
          .attr(
            "transform",
            (d) => `translate(${d.x}, ${d.y}) rotate(${d.rotate})`
          )
          .text((d) => d.text);
      };

      const layout = d3Cloud
        .default()
        .size([width, height])
        .words(data)
        .padding(8)
        .rotate(0)
        .font(fontFamily)
        .fontSize((d) => Math.min(Math.max(d.value * 10, 20), 40)) // フォントサイズに上限を設定
        .spiral("archimedean") // 組み込みのarchimedeanSpiralを使用
        .on("end", draw);

      layout.start();
    }
  }, [width, height, data, fontFamily]);

  return (
    <div>
      <svg ref={ref} width={width} height={height}>
        <g transform={`translate(${width / 2}, ${height / 2})`}></g>
      </svg>
    </div>
  );
};

export default WordCloud;
