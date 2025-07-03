import * as d3 from "d3";
import { useRef, useEffect } from "react";
import * as d3Cloud from "d3-cloud";

const WordCloud = ({
  width,
  height,
  data,
  fontFamily,
  slideColor,
  slideColorHover,
  onWordClick,
}) => {
  const ref = useRef();

  // 単一の色を使用
  // const mainColor = "#4A90E2"; // 青系の色

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
          .style("cursor", "pointer")
          .style("transition", "all 0.3s ease")
          // .style("fill", (d) => {
          //   return d3.color(mainColor).copy({ opacity: 0.8 });
          // })
          .style("fill", slideColor)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "central")
          .on("mouseover", function (event, d) {
            d3.select(this).style("fill", slideColorHover);
          })

          .on("mouseout", function (event, d) {
            d3.select(this).style("fill", slideColor);
          })

          .on("click", function (event, d) {
            console.log("WordCloudでクリックされた単語:", d.text);
            //todo: クリックされている単語がわかりやすいように、デザインを変える

            // 親コンポーネントに単語を通知
            if (onWordClick) {
              onWordClick(d.text);
            }
          })

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
        .fontSize((d) => Math.min(Math.max(d.value * 5, 20), 40))
        .spiral("archimedean")
        .random(d3.randomLcg(42))

        .on("end", draw);

      layout.start();
    }
  }, [
    width,
    height,
    data,
    fontFamily,
    slideColor,
    slideColorHover,
    onWordClick,
  ]);

  return (
    <div>
      <svg ref={ref} width={width} height={height}>
        <g transform={`translate(${width / 2}, ${height / 2})`}></g>
      </svg>
    </div>
  );
};

export default WordCloud;
