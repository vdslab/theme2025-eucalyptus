import React, { useRef, useEffect } from "react";

const CircularMonthSlider = ({ start, end, onChange }) => {
  const canvasRef = useRef(null);

  const size = 300;
  const center = size / 2;
  const radius = 100;
  const handleRadius = 10;
  const maxHitDistance = 25; // ハンドルを掴める範囲を拡大
  const totalMonths = 12;

  const draggingRef = useRef(null);

  const angleFromMonth = (month) =>
    (month / totalMonths) * 2 * Math.PI - Math.PI / 2;

  const monthFromAngle = (angle) =>
    Math.round(((angle + Math.PI / 2 + 2 * Math.PI) % (2 * Math.PI)) / (2 * Math.PI) * totalMonths) % totalMonths;

  const getAngleFromCoord = (x, y) => {
    const dx = x - center;
    const dy = y - center;
    return Math.atan2(dy, dx);
  };

  const getCanvasCoords = (clientX, clientY) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const getHandlePosition = (angle) => ({
    x: center + radius * Math.cos(angle),
    y: center + radius * Math.sin(angle),
  });

  const getDistance = (x1, y1, x2, y2) =>
    Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);

  const drawHandle = (ctx, angle, color) => {
    const { x, y } = getHandlePosition(angle);
    ctx.beginPath();
    ctx.arc(x, y, handleRadius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  };

  const draw = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, size, size);

    const startAngle = angleFromMonth(start);
    const endAngle = angleFromMonth(end);

    // 円ベース
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 4;
    ctx.stroke();

    // 選択範囲
    ctx.beginPath();
    ctx.strokeStyle = "#ff7f50";
    ctx.lineWidth = 8;
    if (startAngle <= endAngle) {
      ctx.arc(center, center, radius, startAngle, endAngle);
    } else {
      ctx.arc(center, center, radius, startAngle, endAngle + 2 * Math.PI);
    }
    ctx.stroke();

    // ハンドル
    drawHandle(ctx, startAngle, "#ff4444");
    drawHandle(ctx, endAngle, "#4444ff");

    // 月表示
    for (let i = 0; i < totalMonths; i++) {
      const angle = angleFromMonth(i);
      const x = center + (radius + 20) * Math.cos(angle);
      const y = center + (radius + 20) * Math.sin(angle);
      ctx.fillStyle = "black";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${i + 1}月`, x, y);
    }
  };

  useEffect(() => {
    draw();
  }, [start, end]);

  const handleInputAt = (x, y) => {
    const angle = getAngleFromCoord(x, y);
    const newMonth = monthFromAngle(angle);
    if (draggingRef.current === "start") {
      onChange(newMonth, end);
    } else if (draggingRef.current === "end") {
      onChange(start, newMonth);
    }
  };

  const handleMouseDown = (e) => {
    const { x, y } = getCanvasCoords(e.clientX, e.clientY);

    const startAngle = angleFromMonth(start);
    const endAngle = angleFromMonth(end);
    const { x: sx, y: sy } = getHandlePosition(startAngle);
    const { x: ex, y: ey } = getHandlePosition(endAngle);

    const distToStart = getDistance(x, y, sx, sy);
    const distToEnd = getDistance(x, y, ex, ey);

    if (distToStart < maxHitDistance || distToEnd < maxHitDistance) {
      draggingRef.current = distToStart <= distToEnd ? "start" : "end";
      handleInputAt(x, y);
    }
  };

  const handleMouseMove = (e) => {
    if (!draggingRef.current) return;
    const { x, y } = getCanvasCoords(e.clientX, e.clientY);
    handleInputAt(x, y);
  };

  const handleMouseUp = () => {
    draggingRef.current = null;
  };

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ touchAction: "none", cursor: "grab" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
};

export default CircularMonthSlider;
