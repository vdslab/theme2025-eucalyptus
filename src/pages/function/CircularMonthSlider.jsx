import React, { useRef, useEffect } from "react";

const CircularMonthSlider = ({ start, end, onChange }) => {
  const canvasRef = useRef(null);
  const radius = 100;
  const center = 150;
  const handleRadius = 10;
  const totalMonths = 12;

  let dragging = null;

  useEffect(() => {
    draw();
  }, [start, end]);

  const draw = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, 300, 300);

    // 円周のベース
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 4;
    ctx.stroke();

    // 選択範囲の弧を描画
    const startAngle = ((start / totalMonths) * 2 * Math.PI) - Math.PI / 2;
    const endAngle = ((end / totalMonths) * 2 * Math.PI) - Math.PI / 2;

    ctx.beginPath();
    ctx.strokeStyle = "#ff7f50";
    ctx.lineWidth = 8;

    if (start <= end) {
      ctx.arc(center, center, radius, startAngle, endAngle);
    } else {
      ctx.arc(center, center, radius, startAngle, endAngle + 2 * Math.PI);
    }
    ctx.stroke();

    // ハンドル（開始月と終了月）
    drawHandle(ctx, start, "#ff4444");
    drawHandle(ctx, end, "#4444ff");

    // 月名
    for (let i = 0; i < totalMonths; i++) {
      const angle = ((i / totalMonths) * 2 * Math.PI) - Math.PI / 2;
      const x = center + (radius + 20) * Math.cos(angle);
      const y = center + (radius + 20) * Math.sin(angle);
      ctx.fillStyle = "black";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${i + 1}月`, x, y);
    }
  };

  const drawHandle = (ctx, monthIndex, color) => {
    const angle = ((monthIndex / totalMonths) * 2 * Math.PI) - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(x, y, handleRadius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  };

  const getMonthFromCoord = (x, y) => {
    const dx = x - center;
    const dy = y - center;
    let angle = Math.atan2(dy, dx) + Math.PI / 2;
    if (angle < 0) angle += 2 * Math.PI;
    return Math.round((angle / (2 * Math.PI)) * totalMonths) % 12;
  };

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const month = getMonthFromCoord(x, y);

    // 距離が近いハンドルをドラッグ対象に
    const distToStart = Math.abs(month - start) % 12;
    const distToEnd = Math.abs(month - end) % 12;
    dragging = distToStart <= distToEnd ? "start" : "end";
  };

  const handleMouseMove = (e) => {
    if (dragging === null) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const month = getMonthFromCoord(x, y);

    if (dragging === "start") {
      onChange(month, end);
    } else if (dragging === "end") {
      onChange(start, month);
    }
  };

  const handleMouseUp = () => {
    dragging = null;
  };

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={300}
      style={{ touchAction: "none", cursor: "pointer" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
};

export default CircularMonthSlider;

