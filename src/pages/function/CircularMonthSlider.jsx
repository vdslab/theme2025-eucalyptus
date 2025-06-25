import { useRef, useEffect, useState } from "react";

const CircularMonthSlider = ({ start, end, onChange }) => {
  const canvasRef = useRef(null);
  // todo: 画面上の割合で指定する
  const size = 300;
  const center = size / 2;
  const radius = 100;
  const handleRadius = 10;
  const maxHitDistance = 25;
  const totalMonths = 12;
  const draggingRef = useRef(null);
  const [dpr, setDpr] = useState(1);

  // 季節の定義（月末まで含むように調整）
  const seasons = [
    { name: "春", months: [2, 3, 4], color: "#FFB6C1", textColor: "#8B4513" }, // 3月1日-5月31日
    { name: "夏", months: [5, 6, 7], color: "#87CEEB", textColor: "#191970" }, // 6月1日-8月31日
    { name: "秋", months: [8, 9, 10], color: "#DEB887", textColor: "#8B4513" }, // 9月1日-11月30日
    { name: "冬", months: [11, 0, 1], color: "#E6E6FA", textColor: "#4B0082" }, // 12月1日-2月28日
  ];

  // 月の開始角度（月の境界）
  // 角度で月を表示させてるから、-90度しないと、1月が真上にこない
  const angleFromMonth = (month) =>
    (month / totalMonths) * 2 * Math.PI - Math.PI / 2;

  // 月の中央角度（ラベル表示用）
  const angleFromMonthCenter = (month) =>
    ((month + 0.5) / totalMonths) * 2 * Math.PI - Math.PI / 2;

  // 今いる角度を0~11の月に当たる数字に変換
  const monthFromAngle = (angle) =>
    Math.round(
      (((angle + Math.PI / 2 + 2 * Math.PI) % (2 * Math.PI)) / (2 * Math.PI)) *
        totalMonths
    ) % totalMonths;

  //
  const getAngleFromCoord = (x, y) => {
    const dx = x / dpr - center;
    const dy = y / dpr - center;
    return Math.atan2(dy, dx);
  };

  const getCanvasCoords = (clientX, clientY) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (clientX - rect.left) * dpr,
      y: (clientY - rect.top) * dpr,
    };
  };

  const getHandlePosition = (angle) => ({
    x: center + radius * Math.cos(angle),
    y: center + radius * Math.sin(angle),
  });

  const getDistance = (x, y, targetX, targetY) =>
    Math.sqrt((x - targetX) ** 2 + (y - targetY) ** 2);

  // 点が円の内側にあるかチェック
  const isInsideCircle = (x, y, centerX, centerY, radius) => {
    return getDistance(x, y, centerX, centerY) <= radius;
  };

  // クリックした位置がどの季節エリアかを判定
  const getSeasonFromCoord = (x, y) => {
    const adjustedX = x / dpr;
    const adjustedY = y / dpr;

    if (!isInsideCircle(adjustedX, adjustedY, center, center, radius - 10)) {
      return null;
    }

    const angle = getAngleFromCoord(x, y);
    const month = monthFromAngle(angle);
    console.log(angle);
    console.log(month);

    return seasons.find((season) => season.months.includes(month));
  };

  const drawHandle = (ctx, angle, color) => {
    const { x, y } = getHandlePosition(angle);
    ctx.beginPath();
    ctx.arc(x, y, handleRadius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, handleRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const devicePixelRatio = window.devicePixelRatio || 1;

    setDpr(devicePixelRatio);

    canvas.width = size * devicePixelRatio;
    canvas.height = size * devicePixelRatio;
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";

    ctx.scale(devicePixelRatio, devicePixelRatio);
  };

  const draw = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, size, size);

    const startAngle = angleFromMonth(start);
    const endAngle = angleFromMonth(end);

    // 終了ハンドルの位置を計算（月末に配置）
    const endHandleAngle =
      start === end
        ? angleFromMonth((end + 1) % totalMonths) // 単月の場合は月末
        : angleFromMonth((end + 1) % totalMonths); // 範囲選択の場合も月末

    // 季節の背景を描画
    seasons.forEach((season) => {
      const seasonStartAngle = angleFromMonth(season.months[0]);
      // 最後の月の次の月の開始角度まで（つまり最後の月の月末まで）
      const lastMonth = season.months[2];
      const seasonEndAngle = angleFromMonth((lastMonth + 1) % totalMonths);

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius - 10, seasonStartAngle, seasonEndAngle);
      ctx.closePath();
      ctx.fillStyle = season.color;
      ctx.fill();

      // 季節の境界線
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.lineTo(
        center + (radius - 10) * Math.cos(seasonStartAngle),
        center + (radius - 10) * Math.sin(seasonStartAngle)
      );
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // 通年ボタンを描画
    ctx.beginPath();
    ctx.arc(center, center, 25, 0, 2 * Math.PI);
    ctx.fillStyle = "#f0f0f0";
    ctx.fill();
    ctx.strokeStyle = "#999";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#333";
    ctx.font =
      "bold 10px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("通年", center, center);

    // 季節名を描画
    seasons.forEach((season) => {
      const middleMonth = season.months[1]; // 中央の月
      const angle = angleFromMonthCenter(middleMonth); // 中央角度を使用
      const x = center + (radius - 40) * Math.cos(angle);
      const y = center + (radius - 40) * Math.sin(angle);

      ctx.fillStyle = season.textColor;
      ctx.font =
        "bold 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(season.name, x, y);
    });

    // 円ベース
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#999";
    ctx.lineWidth = 3;
    ctx.stroke();

    // 選択範囲の描画（改良版）
    ctx.beginPath();
    ctx.strokeStyle = "#ff7f50";
    ctx.lineWidth = 8;

    if (start === 0 && end === 11) {
      // 通年選択の場合：円全体を描画
      ctx.arc(center, center, radius, 0, 2 * Math.PI);
    } else if (start === end) {
      // 単月選択の場合：その月の開始から終了まで
      const monthStartAngle = angleFromMonth(start);
      const monthEndAngle = angleFromMonth((start + 1) % totalMonths);
      ctx.arc(center, center, radius, monthStartAngle, monthEndAngle);
    } else if (startAngle <= endHandleAngle) {
      // 通常の範囲選択
      ctx.arc(center, center, radius, startAngle, endHandleAngle);
    } else {
      // 年またぎの場合
      ctx.arc(center, center, radius, startAngle, endHandleAngle + 2 * Math.PI);
    }
    ctx.stroke();

    // ハンドル
    drawHandle(ctx, startAngle, "#ff4444");
    drawHandle(ctx, endHandleAngle, "#4444ff"); // 終了ハンドルは月末位置に

    // 月表示（月の中央に配置）
    for (let i = 0; i < totalMonths; i++) {
      const angle = angleFromMonthCenter(i); // 月の中央角度を使用
      const x = center + (radius + 25) * Math.cos(angle);
      const y = center + (radius + 25) * Math.sin(angle);

      ctx.fillStyle = "#333";
      ctx.font =
        "12px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${i + 1}月`, x, y);
    }
  };

  useEffect(() => {
    setupCanvas();
  }, []);

  useEffect(() => {
    draw();
  }, [start, end, dpr]);

  const handleInputAt = (x, y) => {
    const angle = getAngleFromCoord(x, y);
    const newMonth = monthFromAngle(angle);
    if (draggingRef.current === "start") {
      onChange(newMonth, end);
    } else if (draggingRef.current === "end") {
      onChange(start, newMonth);
    }
  };

  // 月のラベルエリアがクリックされたかチェック
  const getClickedMonthLabel = (x, y) => {
    const adjustedX = x / dpr;
    const adjustedY = y / dpr;

    for (let i = 0; i < totalMonths; i++) {
      const angle = angleFromMonthCenter(i);
      const labelX = center + (radius + 25) * Math.cos(angle);
      const labelY = center + (radius + 25) * Math.sin(angle);

      // クリック範囲を少し大きくして判定しやすく
      if (getDistance(adjustedX, adjustedY, labelX, labelY) < 20) {
        console.log(`月${i + 1}のラベルがクリックされました！`);
        return i;
      }
    }
    return null;
  };

  const handleMouseDown = (e) => {
    const { x, y } = getCanvasCoords(e.clientX, e.clientY);
    const adjustedX = x / dpr;
    const adjustedY = y / dpr;

    const startAngle = angleFromMonth(start);
    const endHandleAngle =
      start === end
        ? angleFromMonth((end + 1) % totalMonths)
        : angleFromMonth((end + 1) % totalMonths);

    const { x: sx, y: sy } = getHandlePosition(startAngle);
    const { x: ex, y: ey } = getHandlePosition(endHandleAngle);

    const distToStart = getDistance(adjustedX, adjustedY, sx, sy);
    const distToEnd = getDistance(adjustedX, adjustedY, ex, ey);

    // ハンドルをクリックした場合
    if (distToStart < maxHitDistance || distToEnd < maxHitDistance) {
      draggingRef.current = distToStart <= distToEnd ? "start" : "end";
      handleInputAt(x, y);
      return;
    }

    // 中央の通年ボタンをクリックした場合
    if (isInsideCircle(adjustedX, adjustedY, center, center, 30)) {
      onChange(0, 11); // 1月〜12月（通年）
      return;
    }

    // 月のラベルをクリックした場合 ← 追加！
    const clickedMonth = getClickedMonthLabel(x, y);
    if (clickedMonth !== null) {
      onChange(clickedMonth, clickedMonth); // 単月選択
      return;
    }

    // 季節エリアをクリックした場合
    const clickedSeason = getSeasonFromCoord(x, y);
    if (clickedSeason) {
      // const seasonMonths = clickedSeason.months;
      // 各季節の実際の開始月と終了月を設定
      if (clickedSeason.name === "春") {
        onChange(2, 4); // 3月〜5月
      } else if (clickedSeason.name === "夏") {
        onChange(5, 7); // 6月〜8月
      } else if (clickedSeason.name === "秋") {
        onChange(8, 10); // 9月〜11月
      } else if (clickedSeason.name === "冬") {
        onChange(11, 1); // 12月〜2月（年またぎ）
      }
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

  const getCurrentSeason = () => {
    // 通年チェック
    if (start === 0 && end === 11) {
      return "通年";
    }

    // 単月チェック
    if (start === end) {
      return `${start + 1}月のみ`;
    }

    // 各季節をチェック
    if (start === 2 && end === 4) return "春";
    if (start === 5 && end === 7) return "夏";
    if (start === 8 && end === 10) return "秋";
    if (start === 11 && end === 1) return "冬";

    return "カスタム";
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h2 className="text-xl font-bold">季節選択対応 円形月スライダー</h2>
      <canvas
        ref={canvasRef}
        style={{
          touchAction: "none",
          cursor: "grab",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      <div className="text-center">
        <div className="text-sm text-gray-600 mb-2">
          選択期間: {start + 1}月 〜 {end + 1}月 ({getCurrentSeason()})
        </div>
      </div>
    </div>
  );
};

// デモ用のラッパーコンポーネント
const App = () => {
  const [startMonth, setStartMonth] = useState(0); // 1月のみ
  const [endMonth, setEndMonth] = useState(11); // 1月のみ

  return (
    <CircularMonthSlider
      start={startMonth}
      end={endMonth}
      onChange={(newStart, newEnd) => {
        setStartMonth(newStart);
        setEndMonth(newEnd);
      }}
    />
  );
};

export default App;
